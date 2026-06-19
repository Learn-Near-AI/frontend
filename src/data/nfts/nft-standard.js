export const nftStandardExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement the core NFT standard (NEP-171) — a contract that can mint unique tokens that users can transfer.

**Requirements:**
- Store \`tokens: UnorderedMap<String, Token>\`
- Define \`Token\` struct with \`token_id, owner_id, metadata\`
- Implement \`nft_transfer(receiver_id, token_id)\` — requires exactly 1 yoctoNEAR deposit (NEP-171), caller must be owner
- Implement \`nft_token(token_id)\` — view method returning token info

**Test:** Transfer must fail without 1 yoctoNEAR and if caller is not the owner!`,
  },
  {
    title: 'The Digital Collectible!',
    content: `Marketplaces use \`nft_transfer\` to move tokens between accounts when a sale occurs.

Think of an NFT as a digital trading card. Each card is unique, has an owner, and can be traded. The **NEP-171** standard defines how these trades work on NEAR.

**The key rule:** To transfer an NFT, you must prove you own it by:
1. Attaching exactly **1 yoctoNEAR** (the smallest unit of NEAR) — this proves you're a real account, not a bot
2. Showing your signature matches the current owner

This is different from Ethereum where ERC-721 uses \`transferFrom\` with a separate approval step. NEAR combines proof-of-ownership with the transfer in one call. Simple and elegant.

**Why 1 yoctoNEAR?** It prevents spam attacks. Without it, anyone could call \`nft_transfer\` on your NFTs and waste your gas. With 1 yoctoNEAR attached, the caller pays. It's the "skin in the game" pattern.`,
  },
  {
    title: 'The Token Structure',
    content: `Here's how we model an NFT on NEAR:

\`\`\`rust
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require, NearToken};
use near_sdk::PanicOnDefault;
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub token_id: String,
    pub owner_id: AccountId,
    pub metadata: Option<TokenMetadata>,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}
\`\`\`

**What's going on:**
- **Token struct** — holds the token ID, current owner, and optional metadata
- **UnorderedMap<String, Token>** — maps token_id → Token for O(1) lookups
- **TokenMetadata** — from \`near_contract_standards\`, includes title, description, media URL, etc.

The map approach means finding any token by ID is instant. No matter if you have 10 tokens or 10 million.`,
  },
  {
    title: 'NEP-171 Transfer — The 1 yoctoNEAR Rule',
    content: `Transferring an NFT requires three checks and a state update:

\`\`\`rust
pub fn nft_transfer(&mut self, receiver_id: AccountId, token_id: String) {
    require!(
        env::attached_deposit() == NearToken::from_yoctonear(1),
        "Requires exactly 1 yoctoNEAR (NEP-171)"
    );
    let mut token = self.tokens.get(&token_id).expect("Token not found");
    require!(token.owner_id == env::predecessor_account_id(), "Not owner");
    token.owner_id = receiver_id;
    self.tokens.insert(&token_id, &token);
}
\`\`\`

**The three checks:**
1. **1 yoctoNEAR deposit** — proves caller is a real account and covers gas costs
2. **Token exists** — \`.expect()\` panics with a clear message if not found
3. **Caller is owner** — only the current owner can transfer their NFT

After checks, we update the owner and save. That's it! The token now belongs to someone else. Forever.

**NEP-171 update rule:** The metadata stored in the Token struct should NOT be modified by \`nft_transfer\`. Only ownership changes. If you want to update metadata, that's a separate concern (see nft-metadata example).`,
  },
  {
    title: 'View Methods — Free and Public',
    content: `Reading token data costs nothing:

\`\`\`rust
pub fn nft_token(&self, token_id: String) -> Option<(String, AccountId, Option<TokenMetadata>)> {
    self.tokens.get(&token_id).map(|t| (t.token_id.clone(), t.owner_id.clone(), t.metadata.clone()))
}
\`\`\`

This view method:
- Uses \`&self\` — read-only, no gas fee
- Returns \`Option\` — returns \`None\` if token doesn't exist (no panic!)
- Returns a tuple — flat structure for easy parsing on the client side

**Why a tuple instead of the Token struct?** View methods need to return types that implement \`near_sdk::serde::Serialize\`. Cloning the Token struct fields into a tuple is a simple way to avoid complex serialization issues. NEAR's SDK handles tuples natively.

In production contracts, you'd typically implement full NEP-171 with \`nft_metadata\`, \`nft_tokens\`, etc. But this minimal version teaches the core concept: ownership + transfer.`,
  },
  {
    title: 'The Ownership Model',
    content: `Every NFT has exactly ONE owner at any time. That owner is stored in \`Token.owner_id\`. Ownership means:

- **Transfer rights** — only you can send the token to someone else
- **Exclusive control** — no one else can modify or transfer your NFT
- **Verifiable provenance** — the entire ownership history is on-chain

**What ownership does NOT mean:**
- You can't burn someone else's NFT
- You can't change an NFT's metadata without explicit permission (see nft-metadata)
- The contract owner can't seize your NFT (unless specifically coded to)

This is the foundation of digital ownership on NEAR. Your tokens are YOURS. Not the contract owner's. Not the network's. Yours.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `An NFT on NEAR gives you true digital ownership. No one can take your token. No one can fake a transfer. The 1 yoctoNEAR rule prevents spam while keeping transfers accessible.

But every transfer costs gas. Trading NFTs frequently adds up. And since all token data is public, your entire collection is visible to anyone — there's no privacy.

The 1 yoctoNEAR requirement also means you need NEAR in your wallet just to receive an NFT. For onboarding new users, this friction is real. Some projects solve this with meta-transactions or welcome wallets.

**So use NFTs when:**
- Digital ownership matters (art, collectibles, game items)
- Provenance tracking is valuable
- Community recognition through ownership

**Use something else when:**
- You need private ownership
- Gas costs for frequent trading are prohibitive
- Onboarding users without NEAR is a blocker`,
  },
  {
    title: "Don't Do This!",
    content: `Skipping the 1 yoctoNEAR check is the most common NFT mistake:

\`\`\`rust
// BAD: No deposit check — anyone can transfer tokens, draining gas
pub fn nft_transfer(&mut self, receiver_id: AccountId, token_id: String) {
    let mut token = self.tokens.get(&token_id).expect("Token not found");
    token.owner_id = receiver_id;  // No owner check either!
    self.tokens.insert(&token_id, &token);
}
\`\`\`

**Without the 1 yoctoNEAR check:**
- Attackers can spam transfers on your contract
- You pay the gas, they waste your money
- NEP-171 compliance is broken — wallets and marketplaces will reject your contract

**Without the owner check:**
- Anyone can steal any NFT
- Your collection is worthless

Always check BOTH conditions. Always. NEP-171 exists for a reason — every marketplace, every wallet, every indexer expects it. Break the standard and your NFTs become invisible to the ecosystem.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build the core NFT standard (NEP-171) — tokens with ownership and transfer.

**Code Snippet:**
\`\`\`rust
pub fn nft_transfer(&mut self, receiver_id: AccountId, token_id: String) {
    // TODO: Require exactly 1 yoctoNEAR attached
    // TODO: Get the token (panic if not found)
    // TODO: Require caller is the owner
    // TODO: Update owner and save
}
\`\`\`

**Solution Hints:**
- Deposit check: \`require!(env::attached_deposit() == NearToken::from_yoctonear(1), "Requires exactly 1 yoctoNEAR")\`
- Get token: \`let mut token = self.tokens.get(&token_id).expect("Token not found");\`
- Owner check: \`require!(token.owner_id == env::predecessor_account_id(), "Not owner");\`
- Update: \`token.owner_id = receiver_id; self.tokens.insert(&token_id, &token);\`
- View method: \`self.tokens.get(&token_id).map(|t| (t.token_id.clone(), t.owner_id.clone(), t.metadata.clone()))\`

**Common Pitfall:** Using \`env::current_account_id()\` instead of \`env::predecessor_account_id()\` for the owner check. \`current_account_id()\` is the CONTRACT, not the caller!

[Learn more about NEP-171 →](https://docs.near.org/build/contracts/nfts/nep-171)`,
  },
];

export default nftStandardExplanation;
