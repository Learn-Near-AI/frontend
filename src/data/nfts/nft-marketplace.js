export const nftMarketplaceExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a simple NFT marketplace — a contract where users can list and buy NFTs.

**Requirements:**
- Store \`sales: UnorderedMap<String, Sale>\`
- Define \`Sale\` struct with \`token_id, seller_id, nft_contract_id, price: NearToken\`
- Implement \`list(nft_contract_id, token_id, price)\` — creates a listing with a composite ID
- Implement \`buy(listing_id)\` — \`#[payable]\`, validates payment, calls \`nft_transfer_from\`, pays seller
- Implement \`get_sale(listing_id)\` — view method

**Test:** Insufficient payment must fail; seller receives correct amount!`,
  },
  {
    title: 'The Trading Post!',
    content: `NFT marketplaces like Paras and Mintbase use this pattern to enable peer-to-peer trading.

Picture a medieval trading post. Merchants arrive, set up stalls with prices, and buyers walk through making purchases. The trading post doesn't own the goods — it just facilitates the exchange.

That's exactly what a **marketplace contract** does:
- Sellers list their NFTs at a fixed price
- Buyers pay the price and receive the NFT
- The marketplace takes a fee (optional, not in this example)

**Three core patterns converge here:**
1. **Payable methods** — accepting NEAR for purchases
2. **Cross-contract calls** — calling the NFT contract to transfer tokens
3. **Promise chaining** — coordinating payment + transfer atomically`,
  },
  {
    title: 'The Marketplace Structure',
    content: `Listings are stored in a map keyed by a composite ID:

\`\`\`rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Sale {
    token_id: String,
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: NearToken,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    sales: UnorderedMap<String, Sale>,
}
\`\`\`

**Why a composite listing ID?** The listing ID is \`"{seller}:{token_id}"\` — this guarantees uniqueness because each seller has their own token IDs. Without this, two sellers listing token "1" from different NFT contracts would collide.

**Why store \`nft_contract_id\` in the sale?** The marketplace can handle NFTs from multiple contracts. Each listing records which NFT contract the token lives on, so \`buy\` knows where to call \`nft_transfer_from\`.

**NearToken for price:** NEAR uses the \`NearToken\` type (not \`u128\`) for token amounts. This provides type safety and clear display formatting. Always use \`NearToken::from_yoctonear()\` and \`NearToken::from_near()\` for conversions.`,
  },
  {
    title: 'Listing Items',
    content: `Creating a listing requires the seller to approve the marketplace first:

\`\`\`rust
pub fn list(&mut self, nft_contract_id: AccountId, token_id: String, price: NearToken) {
    let listing_id = format!("{}:{}", env::predecessor_account_id(), token_id);
    self.sales.insert(&listing_id, &Sale {
        token_id,
        seller_id: env::predecessor_account_id(),
        nft_contract_id,
        price,
    });
}
\`\`\`

**The approval prerequisite:** Before calling \`list\`, the seller MUST call \`approve\` on the NFT contract, approving THIS marketplace contract as the approved account. Without this, \`buy\`'s \`nft_transfer_from\` will fail.

**Listing flow:**
1. Seller calls \`nft_contract.approve(token_id, marketplace_account)\`
2. Seller calls \`marketplace.list(nft_contract, token_id, price)\`
3. Listing is live!

**Why not combine approve + list?** Cross-contract calls in NEAR can't be batched like this easily. The two-step flow is standard. Some advanced marketplaces use a callback pattern to verify approval was granted, but the two-step flow is simpler and more common.

**Delisting:** Not implemented in this example, but in production you'd add a \`delist(listing_id)\` that only the seller can call to remove a listing. Without it, listings are permanent (until bought).`,
  },
  {
    title: 'The Buy Flow — Cross-Contract Calls',
    content: `Buying is where the magic happens — payment, NFT transfer, all in one call:

\`\`\`rust
#[payable]
pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
    let sale = self.sales.get(&listing_id).expect("Sale not found");
    require!(env::attached_deposit() >= sale.price, "Insufficient payment");

    let seller = sale.seller_id.clone();
    let nft_contract = sale.nft_contract_id.clone();
    let token_id = sale.token_id.clone();
    let price = sale.price;
    let buyer = env::predecessor_account_id();

    self.sales.remove(&listing_id);
    env::log_str(&format!("NFT sale {} to {}", listing_id, buyer));

    let args = format!(r#"{{"owner_id":"{}","receiver_id":"{}","token_id":"{}"}}"#, seller, buyer, token_id);
    let nft_promise = near_sdk::Promise::new(nft_contract)
        .function_call(
            "nft_transfer_from".to_string(),
            args.into_bytes(),
            NearToken::from_yoctonear(1),
            Gas::from_tgas(5),
        );

    let transfer_promise = near_sdk::Promise::new(seller).transfer(price);

    near_sdk::Promise::and(nft_promise, transfer_promise)
}
\`\`\`

**The buy flow step by step:**
1. **Look up and validate** the sale exists
2. **Check payment** — attached deposit must be >= price
3. **Remove listing** — prevent double-sale (atomic: if either fails, the whole call reverts)
4. **Call NFT contract** — request \`nft_transfer_from\` with 1 yoctoNEAR (NEP-171)
5. **Pay seller** — transfer the sale price
6. **Return combined promise** — both happen in parallel

**\`Promise::and\`** runs both promises in parallel. If the NFT transfer fails, the payment transfer ALSO fails (atomic). If the payment fails, the NFT transfer reverts. Both succeed or both fail.

**Important:** This parallel approach is simpler but has a subtle issue — if the NFT transfer succeeds but the payment fails, the NFT is stuck. The callback pattern (see next section) is safer: only send payment after confirming NFT transfer succeeded.`,
  },
  {
    title: 'Callback Pattern for Safe Payment',
    content: `The JavaScript version uses a callback pattern for safer payment:

\`\`\`javascript
@call({ payable: true })
buy({ listing_id }) {
    // ... validate and remove sale ...
    return NearPromise.new(nft_contract)
        .functionCall("nft_transfer_from", nftArgs, 1n, gas)
        .then(NearPromise.new(near.currentAccountId())
            .functionCall("on_payment_sent", callbackArgs, 0n, gas))
        .asReturn();
}

@call({})
on_payment_sent({ seller_id, amount }) {
    try {
        near.promiseResultRaw(0);  // Check NFT transfer result
    } catch (_) {
        near.panic("NFT transfer failed");
    }
    return NearPromise.new(seller_id).transfer(BigInt(amount)).asReturn();
}
\`\`\`

**How the callback pattern works:**
1. Call \`nft_transfer_from\` on the NFT contract
2. Chain a callback to \`on_payment_sent\` on THIS contract
3. In the callback, check if the NFT transfer succeeded (\`promiseResultRaw\`)
4. If successful, transfer payment to seller
5. If failed, panic — the entire transaction reverts

**Why this is safer:**
- Payment only happens AFTER confirming NFT transfer
- If NFT transfer fails (not approved, wrong owner, etc.), no money moves
- The seller doesn't get paid unless the buyer actually receives the NFT

**In the Rust version** (for simplicity), we use \`Promise::and\` for parallel execution. Both run concurrently and either both succeed or both fail. The callback pattern is more precise but more complex to implement.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A marketplace is one of the most useful contracts in the NFT ecosystem. It enables trustless peer-to-peer trading without intermediaries.

**The two-step approve-list flow** is a UX friction point. Users must first approve, then list. Some marketplaces combine this into a single flow with meta-transactions.

**The parallel Promise::and** (Rust version) is simpler but can leave tokens stranded if only one promise fails. The callback pattern (JS version) is safer but more gas-intensive.

**The 1 yoctoNEAR requirement** for \`nft_transfer_from\` means the marketplace must attach it. This adds a tiny cost to each buy call.

**Missing features in this example:**
- Marketplace fees (take a percentage of each sale)
- Offer system (buyers propose prices)
- Auction support (time-based bidding)
- Bulk listing (list many NFTs at once)

These features build on the same foundation: listings in a map, cross-contract calls, promise chaining. The patterns here are the building blocks for all of them.`,
  },
  {
    title: "Don't Do This!",
    content: `Sending payment BEFORE the NFT transfer:

\`\`\`rust
// BAD: Payment sent even if NFT transfer fails
pub fn buy(&mut self, listing_id: String) {
    let sale = self.sales.get(&listing_id).expect("Sale not found");
    // Payment sent immediately!
    Promise::new(sale.seller_id.clone()).transfer(sale.price);
    // NFT transfer might fail...
    Promise::new(sale.nft_contract_id.clone())
        .function_call("nft_transfer_from", ..., 1, 5);
}
\`\`\`

**The exploit:**
1. Buyer pays seller
2. NFT transfer fails (not approved, deleted listing, etc.)
3. Buyer lost their money AND didn't get the NFT
4. Seller got paid for nothing

Always send payment AFTER confirming the transfer. Either use \`Promise::and\` (parallel atomic) or the callback pattern (sequential with verification).

**Another mistake:** Not removing the listing before cross-contract calls:
\`\`\`rust
// BAD: Listing still exists after buy starts
// If the cross-contract call fails, listing is still active
// Buyer can try again without paying (listing still exists)
\`\`\`

Remove the listing immediately to prevent double-sale. If the call fails, the state change reverts automatically (NEAR's transactional guarantees).`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a marketplace where users can list and buy NFTs across different NFT contracts.

**Code Snippet:**
\`\`\`rust
pub fn list(&mut self, nft_contract_id: AccountId, token_id: String, price: NearToken) {
    // TODO: Build composite listing_id
    // TODO: Insert Sale into sales map
}

#[payable]
pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
    // TODO: Get sale, validate payment
    // TODO: Remove listing
    // TODO: Call nft_transfer_from on the NFT contract
    // TODO: Pay seller
}
\`\`\`

**Solution Hints:**
- Listing ID: \`format!("{}:{}", env::predecessor_account_id(), token_id)\`
- Sale struct: \`Sale { token_id, seller_id: env::predecessor_account_id(), nft_contract_id, price }\`
- Buy validation: \`require!(env::attached_deposit() >= sale.price, "Insufficient payment");\`
- Remove listing: \`self.sales.remove(&listing_id);\`
- NFT call args: \`format!(r#"{{"owner_id":"{}","receiver_id":"{}","token_id":"{}"}}"#, seller, buyer, token_id)\`
- NFT call: \`Promise::new(nft_contract).function_call("nft_transfer_from".to_string(), args.into_bytes(), NearToken::from_yoctonear(1), Gas::from_tgas(5))\`
- Payment: \`Promise::new(seller).transfer(price)\`
- Combine: \`Promise::and(nft_promise, transfer_promise)\`

**JavaScript version:** Use \`NearPromise.new(...).functionCall(...).then(...).asReturn()\` with a callback for payment verification.

[Learn more about marketplace patterns →](https://docs.near.org/build/contracts/nfts/marketplace)`,
  },
];

export default nftMarketplaceExplanation;
