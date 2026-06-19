export const nftMintingExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement an NFT minting system — creating new tokens with unique IDs, restricted to the contract owner.

**Requirements:**
- Store \`tokens: UnorderedMap<String, Token>\`, \`next_id: u64\`, \`owner_id: AccountId\`
- Define \`Token\` struct with \`token_id: String\` and \`owner_id: AccountId\`
- Implement \`mint(receiver_id)\` — owner-only, creates a new token with auto-incremented ID
- Implement \`get_token(token_id)\` — view method

**Test:** Only the owner can mint; get_token must return the correct owner!`,
  },
  {
    title: 'The Minting Press!',
    content: `Game economies use minting to create new items when players earn rewards.

Think of minting as a **coin press**. Only the king (contract owner) can mint new coins. Each coin has a unique serial number. Once minted, the coin belongs to whoever the king gives it to.

Minting is the act of creating a brand new token that didn't exist before. It's different from transferring (moving an existing token) or burning (destroying a token).

The key design decisions in minting:
- **Who can mint?** Owner-only (this example) vs. public minting
- **How are IDs assigned?** Sequential (this example) vs. hash-based vs. user-chosen
- **When is metadata attached?** At mint time vs. separate step (see nft-metadata)`,
  },
  {
    title: 'The Minting Structure',
    content: `Here's the contract structure for minting:

\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    next_id: u64,
    owner_id: AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            next_id: 1,
            owner_id: env::current_account_id(),
        }
    }
}
\`\`\`

**Three state variables:**
- \`tokens\` — map of all created tokens (token_id → Token)
- \`next_id\` — counter that increments with each mint, ensuring unique IDs
- \`owner_id\` — the contract account (\`current_account_id()\`), who has minting privileges

**Why \`current_account_id()\` for owner?** This sets the contract ITSELF as the owner, not the deployer's wallet. This is intentional: for minting, the contract account is typically the "minter." In practice, you might set this to a deployer wallet or a separate trusted account. Using \`current_account_id()\` is the safest default — it means no single wallet key can mint.`,
  },
  {
    title: 'The Mint Method',
    content: `Minting creates a token and assigns ownership:

\`\`\`rust
pub fn mint(&mut self, receiver_id: AccountId) -> String {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner can mint");
    let token_id = self.next_id.to_string();
    self.tokens.insert(&token_id.clone(), &Token {
        token_id: token_id.clone(),
        owner_id: receiver_id,
    });
    self.next_id += 1;
    token_id
}
\`\`\`

**Step by step:**
1. **Owner check** — only the contract owner can mint new tokens
2. **Generate ID** — convert \`next_id\` (u64) to a string
3. **Insert token** — store the new token in the map
4. **Increment** — prepare the next unique ID
5. **Return ID** — so the caller knows what was created

**Why return the token_id?** The caller needs to know the ID of the newly minted token. Without the return value, they'd have to guess or track it separately. Returning it as a String is the standard NEP-171 pattern.

**Design choice:** This example uses simple sequential IDs (1, 2, 3...). In practice, you might use UUIDs, hash-based IDs, or user-provided IDs. Sequential is simplest for learning and guarantees uniqueness.`,
  },
  {
    title: 'Mint + Metadata Integration',
    content: `In a real contract, you'd combine minting with metadata:

\`\`\`rust
pub fn mint_with_metadata(&mut self, receiver_id: AccountId, title: String, description: String, media: String) -> String {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner can mint");
    let token_id = self.next_id.to_string();
    self.tokens.insert(&token_id, &Token {
        token_id: token_id.clone(),
        owner_id: receiver_id.clone(),
    });
    let meta = TokenMetadata {
        title: Some(title),
        description: Some(description),
        media: Some(media),
        // ... other fields None
    };
    self.token_metadata.insert(&token_id, &meta);
    self.next_id += 1;
    token_id
}
\`\`\`

This combines minting + metadata in a single transaction — the most common real-world pattern. The token is created AND visible in wallets immediately.

**Why not always combine them?** Separation of concerns. The nft-minting example focuses on ownership and IDs. The nft-metadata example focuses on metadata. Combined, they show how the pieces fit together in production.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Owner-only minting gives you control over supply. No one can create unauthorized tokens. Scarcity is enforced by the contract.

But it also means YOU are the bottleneck. Every mint requires your action. For large-scale mints (10,000 PFP project), you'll want batch minting or a whitelist contract.

Sequential IDs make tokens predictable. User A knows they'll get token #1, #2, etc. This is fine for most projects. But if you want "lucky" token IDs or need to reserve ranges, sequential doesn't work well.

**Next considerations:**
- **Allow lists** — restrict minting to approved addresses
- **Batch minting** — mint many tokens in one call (gas optimization)
- **Reveal mechanism** — mint with hidden metadata, reveal later
- **Burning** — allow token destruction (reduces supply)

The simple mint is the foundation. Everything else is built on top.`,
  },
  {
    title: "Don't Do This!",
    content: `Using \`predecessor_account_id()\` instead of \`current_account_id()\` for the contract owner:

\`\`\`rust
// BAD: Owner is the deployer's wallet, not the contract
Self {
    owner_id: env::predecessor_account_id(),  // Who deployed it
}
\`\`\`

**Problem:** If the deployer's wallet is compromised, the attacker can mint unlimited tokens. By using \`current_account_id()\`, the contract itself is the owner — minting requires a call FROM the contract, which is safer.

**Another mistake:** Not incrementing \`next_id\`:

\`\`\`rust
// BAD: Forgot to increment — every mint creates token_id "1"
let token_id = self.next_id.to_string();
self.tokens.insert(&token_id, &Token { ... });
// Missing: self.next_id += 1;
\`\`\`

Every subsequent mint overwrites token "1". The previous token is gone. Lost forever. Always increment!`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Create an owner-only mint function that generates unique token IDs.

**Code Snippet:**
\`\`\`rust
pub fn mint(&mut self, receiver_id: AccountId) -> String {
    // TODO: Require caller is owner
    // TODO: Create token with next_id, assign to receiver
    // TODO: Insert into tokens map
    // TODO: Increment next_id
    // TODO: Return token_id as String
}
\`\`\`

**Solution Hints:**
- Owner check: \`require!(env::predecessor_account_id() == self.owner_id, "Only owner can mint");\`
- Token ID: \`let token_id = self.next_id.to_string();\`
- Token creation: \`Token { token_id: token_id.clone(), owner_id: receiver_id }\`
- Insert: \`self.tokens.insert(&token_id, &token);\`
- Increment: \`self.next_id += 1;\`
- Return: \`token_id\`

**View method:**
\`\`\`rust
pub fn get_token(&self, token_id: String) -> Option<(String, AccountId)> {
    self.tokens.get(&token_id).map(|t| (t.token_id.clone(), t.owner_id.clone()))
}
\`\`\`

[Learn more about NFT minting →](https://docs.near.org/build/contracts/nfts/minting)`,
  },
];

export default nftMintingExplanation;
