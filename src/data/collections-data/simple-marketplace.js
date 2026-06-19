export const simpleMarketplaceExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a simple marketplace for trading NFTs.

**Requirements:**
- Store \`listings: UnorderedMap<String, Listing>\`
- Define \`Listing\` struct with \`seller_id, nft_contract_id, token_id, price\`
- Implement \`list_item(listing_id, nft_contract_id, token_id, price)\` — creates a listing
- Implement \`buy(listing_id)\` — \`#[payable]\` method that validates payment, transfers NFT, pays seller
- Implement \`get_listing(listing_id)\` — view method

**Test:** Insufficient payment must fail; seller receives correct amount!`,
  },
  {
    title: 'The Marketplace!',
    content: `DeFi platforms use maps to track active orders and positions.

Picture a medieval marketplace. Merchants set up stalls with prices. Buyers walk around, pay the price, and take the goods. That's exactly what this contract does — but for NFTs!

The **Simple Marketplace** is your first taste of:
- **Payable methods** — accepting NEAR tokens in function calls
- **Cross-contract calls** — calling NFT contracts to transfer tokens
- **Promise chaining** — coordinating payment + transfer atomically

This is the foundation for every DeFi primitive on NEAR. Lending, staking, AMMs — they all build on these same patterns.`,
  },
  {
    title: 'The Marketplace Structure',
    content: `Listings are stored in a map:

\`\`\`rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: NearToken,
    token_id: String,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    listings: UnorderedMap<String, Listing>,
}
\`\`\`

**Why a map keyed by String?**
- Each listing has a unique \`listing_id\` (a string chosen by the seller)
- Instant lookup: \`listings.get(&listing_id)\`
- Easy removal: \`listings.remove(&listing_id)\`

**Listing fields:**
- \`seller_id\` — who's selling (set to predecessor at listing time)
- \`nft_contract_id\` — which NFT contract has the token
- \`price\` — the asking price in NEAR (\`NearToken\` type!)
- \`token_id\` — which token on that contract is for sale

Note: The seller must APPROVE this marketplace contract on the NFT contract BEFORE listing. Otherwise \`nft_transfer_from\` will fail.`,
  },
  {
    title: 'Listing an Item',
    content: `Creating a listing is straightforward:

\`\`\`rust
pub fn list_item(
    &mut self,
    listing_id: String,
    nft_contract_id: AccountId,
    token_id: String,
    price: NearToken,
) {
    let seller = env::predecessor_account_id();
    self.listings.insert(&listing_id, &Listing {
        seller_id: seller,
        nft_contract_id,
        price,
        token_id,
    });
}
\`\`\`

**What happens:**
1. Seller calls \`list_item\` with their item details
2. The contract stores the listing with the seller set to the caller
3. Anyone can now buy it

**Critical prerequisite:** Before calling \`list_item\`, the seller must call \`nft_approve\` on the NFT contract to approve THIS marketplace contract as a transfer operator. Without approval, the buy transaction will fail.

This two-step pattern (approve → list) is standard in NFT marketplaces. It separates "I authorize this marketplace" from "I list my item."`,
  },
  {
    title: 'Buying — The Complex Part',
    content: `Buying involves payment validation, state changes, and cross-contract calls:

\`\`\`rust
#[payable]
pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
    let listing = self.listings.get(&listing_id).expect("Listing not found");
    require!(env::attached_deposit() >= listing.price, "Insufficient payment");

    let seller = listing.seller_id.clone();
    let nft_contract = listing.nft_contract_id.clone();
    let token_id = listing.token_id.clone();
    let price = listing.price;
    let buyer = env::predecessor_account_id();

    self.listings.remove(&listing_id);
    env::log_str(&format!("Sold {} to {}", listing_id, buyer));

    let transfer_promise = near_sdk::Promise::new(seller.clone()).transfer(price);

    let args = format!(r#"{{"owner_id":"{}","receiver_id":"{}","token_id":"{}"}}"#, seller, buyer, token_id);
    let nft_promise = near_sdk::Promise::new(nft_contract)
        .function_call(
            "nft_transfer_from".to_string(),
            args.into_bytes(),
            NearToken::from_yoctonear(1),
            Gas::from_tgas(5),
        );

    near_sdk::Promise::and(transfer_promise, nft_promise)
}
\`\`\`

**The flow:**
1. Validate listing exists and payment is sufficient
2. Remove listing (prevents double-buy)
3. Create a promise to pay the seller
4. Create a promise to transfer the NFT
5. Execute both promises in parallel with \`Promise::and\`

**Why parallel promises?** \`Promise::and\` runs both promises simultaneously. The seller gets paid AND the NFT is transferred in the same transaction. No race conditions, no partial failures that leave one side hanging.

**\`#[payable]\` is required** — without it, the contract rejects any attached deposit. This macro tells NEAR "this method expects money."`,
  },
  {
    title: 'Why Use NearToken?',
    content: `NEAR SDK uses \`NearToken\` for all token amounts:

\`\`\`rust
let price = NearToken::from_near(10);       // 10 NEAR
let deposit = NearToken::from_yoctonear(1); // 1 yoctoNEAR
let amount = NearToken::from_millinear(500); // 0.5 NEAR
\`\`\`

**Why not just u128?** \`NearToken\` is a type-safe wrapper that:
- Prevents accidentally treating NEAR as yoctoNEAR
- Makes code self-documenting (you see the unit)
- Provides conversion methods (\`from_near\`, \`from_yoctonear\`, \`as_near\`)
- Avoids the 10^24 decimal math errors that plague DeFi contracts

**Conversion:**
- 1 NEAR = 1,000,000,000,000,000,000,000,000 yoctoNEAR (10^24)
- \`NearToken::from_near(1)\` = \`NearToken::from_yoctonear(10u128.pow(24))\`

Using raw u128 values is a common source of bugs. Someone writes \`price: 100\` meaning 100 NEAR but it's actually 100 yoctoNEAR (essentially free). \`NearToken\` eliminates this class of error.`,
  },
  {
    title: 'The Design Insight',
    content: `**Why combine validation + state change + cross-contract call?**

This pattern is the foundation of all DeFi:

1. **Validate** — check preconditions (sufficient payment, listing exists)
2. **State change** — remove listing (prevent double-spend)
3. **Cross-contract** — transfer assets atomically

The key insight: the state change happens BEFORE the cross-contract call. If the NFT transfer fails, the listing is already removed. But that's OK because:
- The payment hasn't been sent yet (promises are executed AFTER)
- The seller can re-list
- No funds are lost

This "optimistic removal" pattern is common in marketplaces. You trust that the NFT transfer will succeed (the seller approved it), and if it doesn't, the payment never goes through. No one gets stuck.`,
  },
  {
    title: 'Callbacks for Safe Transfers',
    content: `For production use, add a callback to verify the NFT transfer succeeded:

\`\`\`rust
pub fn on_nft_transfer_complete(&self) {
    // Called after the cross-contract NFT transfer
    match near_sdk::promise_result::PromiseResult::Successful(result) => {
        // NFT transferred, seller already paid via Promise::and
        env::log_str("Transfer completed successfully");
    }
}
\`\`\`

**Why callbacks matter:**
- Without them, the seller gets paid even if the NFT transfer fails
- The callback checks \`promise_result(0)\` to confirm success
- If the NFT transfer failed, the callback can refund the buyer

This is the safe pattern: parallel promises (pay + transfer) + callback (verify + handle failure). The callback is your safety net.

**\`Promise::and\` vs \`Promise::then\`:**
- \`and\`: Run both in parallel (pay seller AND transfer NFT simultaneously)
- \`then\`: Run sequentially (transfer NFT, THEN pay seller on success)

Sequential is safer but uses more gas because the transaction spans multiple blocks.`,
  },
  {
    title: 'Simple Marketplace vs Full Marketplace',
    content: `Quick comparison:

**This simple marketplace:**
- Single listing price
- No escrow
- Manual approval from seller
- Good for learning

**Full marketplace:**
- Bidding system (offers below asking price)
- Escrow (hold NFT in contract for instant buys)
- Royalty distribution to creators
- Multiple payment tokens (NEAR + NEP-141 FTs)
- Auction support (English, Dutch)

Start simple, then add features. The hardest part is the cross-contract call pattern — once you have that working, everything else is just adding more data and logic.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A marketplace on NEAR gives you a trust-minimized trading platform. The contract executes the trade exactly as programmed. No one can cheat, no one can back out, no one can steal funds. That's the super power of on-chain marketplaces.

But trades cost gas — both listing and buying require transaction fees. The cross-contract call for NFT transfer adds complexity (and potential failure points). And every action is public: prices, sellers, buyers — all visible on the blockchain.

This is a feature, not a bug. Transparency is the whole point. But it means marketplaces aren't suitable for private or negotiated deals.

**When NOT to use an on-chain marketplace:** For private sales, for OTC (over-the-counter) deals where parties negotiate directly, or when speed of settlement matters more than trustlessness.`,
  },
  {
    title: "Don't Do This!",
    content: `A marketplace that doesn't check payment:

\`\`\`rust
// BAD: No payment validation!
#[payable]
pub fn buy(&mut self, listing_id: String) {
    let listing = self.listings.get(&listing_id).expect("Not found");
    // No require! checking attached_deposit >= price!
    self.listings.remove(&listing_id);
    // Seller gets paid 0 NEAR. Buyer gets the NFT for free.
}
\`\`\`

**The problem:** Without the payment check, a buyer calls \`buy\` with 0 NEAR attached and walks away with the NFT. The seller gets nothing.

**Always, ALWAYS validate payment in payable methods.** The check is small but critical.

**Another mistake:** Not removing the listing before executing trades:
\`\`\`rust
// BAD: Remove after cross-contract call
self.nft_transfer_from(...);  // Could fail!
self.listings.remove(&listing_id);  // Never reached on failure
\`\`\`
If the transfer fails, the listing stays. That's actually OK (seller can retry). But if you remove first and the transfer fails, the listing is gone and no one can buy it. Remove first only when you're confident the transfer will succeed.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a marketplace where users can list and buy NFTs.

**Code Snippet:**
\`\`\`rust
pub fn list_item(&mut self, listing_id: String, nft_contract_id: AccountId, token_id: String, price: NearToken) {
    // TODO: Get predecessor as seller
    // TODO: Insert listing with seller, nft_contract_id, price, token_id
}

#[payable]
pub fn buy(&mut self, listing_id: String) -> Promise {
    // TODO: Get listing
    // TODO: Require attached_deposit >= price
    // TODO: Remove listing
    // TODO: Create transfer promise + nft_transfer_from promise
}
\`\`\`

**Solution Hints:**
- Seller: \`env::predecessor_account_id()\`
- Insert: \`self.listings.insert(&listing_id, &Listing { seller_id: seller, ... })\`
- Payment: \`require!(env::attached_deposit() >= listing.price, "...")\`
- Transfer: \`near_sdk::Promise::new(seller).transfer(price)\`
- NFT call: \`near_sdk::Promise::new(nft_contract).function_call("nft_transfer_from", args, 1, Gas::from_tgas(5))\`
- Combine: \`near_sdk::Promise::and(transfer_promise, nft_promise)\`

**Important:** Seller must \`nft_approve\` this contract on the NFT contract before listing.

[Learn more about cross-contract calls →](https://docs.near.org/smart-contracts/testing/cross-contract)`,
  },
];

export default simpleMarketplaceExplanation;
