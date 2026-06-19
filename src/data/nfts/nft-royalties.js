export const nftRoyaltiesExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement NFT royalties — a percentage (in basis points) paid to the creator each time an NFT is resold.

**Requirements:**
- Store \`owner_id: AccountId\` and \`royalties: UnorderedMap<String, u16>\`
- Implement \`set_royalty(token_id, percent_basis_points)\` — owner-only, max 10000
- Implement \`get_royalty(token_id)\` — returns the royalty percentage or None

**Test:** Only the owner can set royalty; value must be <= 10000 (100%)!`,
  },
  {
    title: 'The Royalty Chest!',
    content: `Music NFT platforms use royalties to ensure creators receive a percentage of every secondary sale.

Imagine you're an artist. You mint an NFT and sell it to Alice for 10 NEAR. Alice later sells it to Bob for 100 NEAR. Without royalties, you get nothing from the second sale. With royalties, you get a percentage — say 10% — automatically.

**Royalties solve the "artist doesn't benefit from resale" problem.** In the physical world, when a painting resells for millions, the original artist sees nothing. Royalties on NFTs fix this using smart contracts.

**Basis points (bps):** Royalties are expressed in basis points, where 1 bps = 0.01%. So:
- 100 bps = 1%
- 500 bps = 5%
- 10000 bps = 100% (maximum)

This avoids floating-point arithmetic on-chain. All calculations are integer-based and precise.`,
  },
  {
    title: 'Basis Points Explained',
    content: `Basis points are a standard financial unit for percentages:

\`\`\`rust
// Basis points (bps) = percent * 100
// 1%   = 100 bps
// 5%   = 500 bps
// 10%  = 1000 bps
// 100% = 10000 bps (max)

pub fn set_royalty(&mut self, token_id: String, percent_basis_points: u16) {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner can set royalty");
    require!(percent_basis_points <= 10000, "Royalty max 100%");
    self.royalties.insert(&token_id, &percent_basis_points);
}
\`\`\`

**Why u16?** Basis points range from 0 to 10000, which fits comfortably in a u16 (max 65535). Using u16 saves storage compared to u32 or u64.

**How marketplaces use this:**
1. Buyer pays 100 NEAR
2. Marketplace checks royalty: 500 bps (5%)
3. 5 NEAR sent to the original creator
4. 95 NEAR sent to the seller

**NEP-199 standard:** Royalties use a \`Payout\` struct with AccountId → u128 (in yoctoNEAR) mappings. This example simplifies to a percentage, but production contracts should implement full NEP-199 for marketplace compatibility.`,
  },
  {
    title: 'Setting and Getting Royalties',
    content: `The API is simple — owner-only write, public read:

\`\`\`rust
pub fn set_royalty(&mut self, token_id: String, percent_basis_points: u16) {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner can set royalty");
    require!(percent_basis_points <= 10000, "Royalty max 100%");
    self.royalties.insert(&token_id, &percent_basis_points);
}

pub fn get_royalty(&self, token_id: String) -> Option<u16> {
    self.royalties.get(&token_id)
}
\`\`\`

**Design decisions:**
- **Owner-only write** — prevents anyone from claiming royalties on tokens they don't own
- **Max 100%** — prevents setting impossible royalty rates
- **Per-token** — each token can have a different royalty (e.g., rare tokens get higher royalties)
- **One-time or mutable** — this example allows updates; some implementations make royalties immutable after first set

**Marketplace reads \`get_royalty\` during buy flow:**
1. Buyer sends payment
2. Marketplace queries \`get_royalty(token_id)\`
3. If royalty exists: split payment between creator and seller
4. If no royalty: full payment goes to seller

**Per-account royalties:** Advanced implementations use \`LookMap<AccountId, u16>\` per token to support multiple royalty recipients (e.g., 2% to artist, 1% to gallery). This example sticks to a single percentage for simplicity.`,
  },
  {
    title: 'Marketplace Integration',
    content: `Here's how a marketplace typically integrates royalties:

\`\`\`rust
// Pseudocode — marketplace's buy function
pub fn buy(&mut self, token_id: String, sale_price: NearToken) {
    let sale = self.sales.get(&token_id).expect("Not listed");
    require!(env::attached_deposit() >= sale_price, "Insufficient");

    // Check for royalties on the NFT contract
    let royalty_bps = nft_contract::get_royalty(token_id, /* ... */);
    if let Some(royalty) = royalty_bps {
        let royalty_amount = sale_price * royalty / 10000;
        // Send royalty to creator
        Promise::new(creator).transfer(royalty_amount);
        // Send rest to seller
        Promise::new(seller).transfer(sale_price - royalty_amount);
    } else {
        // No royalty, full amount to seller
        Promise::new(seller).transfer(sale_price);
    }

    // Transfer the NFT
    // nft_transfer_from(...)
}
\`\`\`

**Note for this example:** The marketplace integration happens OFF this contract. This contract only stores and retrieves royalty percentages. The actual payment split happens in the marketplace contract.

**Important:** The \`owner_id\` in this contract is set to \`env::current_account_id()\` — the contract itself. In production, you might set this to the deployer or a multi-sig. The owner controls which tokens have royalties.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Royalties are the most requested feature from NFT creators. They ensure ongoing revenue from secondary sales. Without royalties, creators only profit from initial mints, and collectors capture all future value.

But royalties are NOT enforced by the NEAR protocol itself. They're enforced by MARKETPLACES. If a marketplace chooses to ignore royalties, the creator gets nothing. There's no on-chain enforcement.

**The "royalty problem":**
- Royalties depend on marketplace honesty
- Some marketplaces offer "zero fee" by ignoring royalties
- Creators must choose marketplaces that respect NEP-199

**Storage cost:** Each royalty entry adds ~35 bytes of storage. For 10,000 tokens, that's ~350KB — not negligible.

**Basis points is a good enough precision:**
- 1 bps granularity (0.01%) is sufficient for most use cases
- No floating-point issues
- Integer math is exact and predictable`,
  },
  {
    title: "Don't Do This!",
    content: `Using percentage (0-100) instead of basis points (0-10000):

\`\`\`rust
// BAD: Integer division problems with percentages
pub fn set_royalty(&mut self, token_id: String, percent: u8) {
    require!(percent <= 100, "Max 100%");
    self.royalties.insert(&token_id, &percent);
}

// Later, in the marketplace:
let royalty_amount = sale_price * percent / 100;  // Works, but imprecise
// With basis points:
let royalty_amount = sale_price * bps / 10000;  // More granular
\`\`\`

**The precision problem:** With percentages, you can only do 1% increments (5%, 10%, etc.). With basis points, you can do 0.01% increments (5.25%, 10.50%, etc.). For high-value NFTs, this matters.

**Another mistake:** Not setting the max bound:

\`\`\`rust
// BAD: No upper bound — anyone could set 99999%
pub fn set_royalty(&mut self, token_id: String, bps: u16) {
    self.royalties.insert(&token_id, &bps);
}
\`\`\`

A malicious or compromised owner could set 65535 bps (655%), meaning a sale would try to pay more than the token is worth. Always enforce \`<= 10000\`.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Implement per-token royalty percentages using basis points.

**Code Snippet:**
\`\`\`rust
pub fn set_royalty(&mut self, token_id: String, percent_basis_points: u16) {
    // TODO: Require caller is owner
    // TODO: Require percent_basis_points <= 10000
    // TODO: Insert into royalties map
}
\`\`\`

**Solution Hints:**
- Owner check: \`require!(env::predecessor_account_id() == self.owner_id, "Only owner can set royalty");\`
- Max check: \`require!(percent_basis_points <= 10000, "Royalty max 100%");\`
- Store: \`self.royalties.insert(&token_id, &percent_basis_points);\`
- View: \`self.royalties.get(&token_id)\`

**Owner initialization:**
\`\`\`rust
Self {
    owner_id: env::current_account_id(),
    royalties: UnorderedMap::new(b"r"),
}
\`\`\`

**Basis point conversion:**
- 5% = 500 bps
- 10% = 1000 bps
- 12.5% = 1250 bps
- Max = 10000 bps (100%)

[Learn more about NEP-199 →](https://docs.near.org/build/contracts/nfts/royalty)`,
  },
];

export default nftRoyaltiesExplanation;
