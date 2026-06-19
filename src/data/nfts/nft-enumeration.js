export const nftEnumerationExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement NFT enumeration (NEP-181) — listing all tokens with pagination for gas-efficient queries.

**Requirements:**
- Store \`tokens: UnorderedMap<String, Token>\`, \`token_ids: Vector<String>\`, \`next_id: u64\`, \`owner_id: AccountId\`
- Implement \`mint(receiver_id)\` — owner-only, tracks token IDs in a Vector
- Implement \`nft_total_supply()\` — returns total number of tokens
- Implement \`nft_tokens(from_index, limit)\` — returns paginated list of (token_id, owner_id)

**Test:** Supply must match mints; pagination must return correct slices!`,
  },
  {
    title: 'The Catalog!',
    content: `NFT marketplaces use paginated queries to show your collection without loading everything at once.

Imagine a museum catalog. You don't dump all 10,000 items on one page. You show 20 at a time, with "next page" and "previous page" buttons.

That's **enumeration** — the ability to list tokens efficiently. Without it, UIs would either:
- Load ALL tokens (gas disaster for large collections)
- Know nothing about what tokens exist

The NEP-181 standard defines \`nft_tokens\` and \`nft_total_supply\` as the standard way to enumerate NFTs. Wallets, marketplaces, and explorers all use these methods.`,
  },
  {
    title: 'The Pagination Model',
    content: `We add a \`Vector<String>\` to track all token IDs in order:

\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    token_ids: Vector<String>,
    next_id: u64,
    owner_id: AccountId,
}
\`\`\`

**Why a Vector for IDs?** The \`UnorderedMap\` gives O(1) lookups by ID but does NOT track insertion order or allow pagination. The \`Vector\` stores IDs in mint order, enabling:
- **Count** — \`nft_total_supply\` returns \`token_ids.len()\`
- **Pagination** — skip N, take M from the vector
- **Ordered traversal** — tokens show up in the order they were minted

**The Map + Vector combo:** This is the same pattern from the todo-list example. The map provides fast lookups by ID. The vector provides ordered iteration. Together they enable both random access and enumeration.

**Alternative approaches:**
- Single \`Vector<Token>\` — stores full tokens, no map lookup needed but slower for individual access
- Single \`UnorderedMap\` + pagination via keys — possible but \`keys()\` doesn't guarantee order

The Map + Vector combo is the gold standard.`,
  },
  {
    title: 'Minting with Tracking',
    content: `Minting now pushes the token ID to the vector:

\`\`\`rust
pub fn mint(&mut self, receiver_id: AccountId) -> String {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner can mint");
    let token_id = self.next_id.to_string();
    self.tokens.insert(&token_id, &Token {
        token_id: token_id.clone(),
        owner_id: receiver_id,
    });
    self.token_ids.push(&token_id);
    self.next_id += 1;
    token_id
}
\`\`\`

**The addition:** \`self.token_ids.push(&token_id)\` — this is the only change from the basic mint.

**Why push to vector:** The vector now contains every token ID ever created. When someone asks "list all tokens from index 0 to 50", we start from position 0 in the vector, look up each ID in the map, and return the results.

**Total supply:** \`self.token_ids.len()\` — simple and O(1). No iteration needed.

**What about burned tokens?** If you add burning (removing from map and vector), the total supply decreases and the vector shrinks. Our current example doesn't implement burning, but \`swap_remove\` on the vector would be the efficient approach (same as todo-list).`,
  },
  {
    title: 'Paginated Queries — Skip and Take',
    content: `The core enumeration method uses pagination to avoid gas traps:

\`\`\`rust
pub fn nft_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<(String, AccountId)> {
    let start = from_index.unwrap_or(0) as usize;
    let limit = limit.unwrap_or(50) as usize;
    self.token_ids.iter()
        .skip(start)
        .take(limit)
        .filter_map(|id| self.tokens.get(&id).map(|t| (t.token_id.clone(), t.owner_id.clone())))
        .collect()
}
\`\`\`

**How it works:**
1. \`from_index\` defaults to 0 (start from the beginning)
2. \`limit\` defaults to 50 (a safe batch size)
3. \`.skip(start)\` — advance to the requested starting position
4. \`.take(limit)\` — take at most \`limit\` items
5. \`.filter_map\` — look up each ID in the map, skipping any that don't exist

**Client-side usage:**
\`\`\`js
// Get first page (tokens 0-49)
const page1 = contract.nft_tokens({ from_index: 0, limit: 50 });
// Get second page (tokens 50-99)
const page2 = contract.nft_tokens({ from_index: 50, limit: 50 });
\`\`\`

**Gas-safe:** This only loads \`limit\` tokens at a time. Even for a collection of 1M tokens, a page of 50 costs the same gas. No gas traps, no timeouts.`,
  },
  {
    title: 'Gas-Aware Iteration',
    content: `Enumeration is powerful but must be used carefully:

\`\`\`rust
// BAD: No pagination — loads ALL tokens (gas bomb!)
pub fn nft_tokens(&self) -> Vec<(String, AccountId)> {
    self.token_ids.iter().filter_map(...).collect()
}

// GOOD: Paginated — safe for any collection size
pub fn nft_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<(String, AccountId)> {
    let start = from_index.unwrap_or(0) as usize;
    let limit = limit.unwrap_or(50) as usize;
    self.token_ids.iter().skip(start).take(limit).filter_map(...).collect()
}
\`\`\`

**Why pagination matters:**
- Each iteration reads from storage (expensive)
- NEAR has a 200 TGas limit per call
- Loading 10,000 tokens can easily exceed the gas limit
- Pagination guarantees predictable gas costs

**Recommended page sizes:**
- 50 tokens — safe and fast (default)
- 100 tokens — moderate
- 200+ tokens — risk of timeout for complex lookups

When building a UI, always use pagination. Load the first page immediately, then lazy-load more as the user scrolls. Never request all tokens at once.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Enumeration makes NFTs visible and discoverable. Without it, tokens are invisible — they exist on-chain but no one can list them.

The Map + Vector approach doubles your storage operations (insert in both collections). Each mint costs ~20% more gas than a map-only approach. For large-scale mints, this adds up.

Vector iteration is sequential. Skipping to position 5,000 requires reading (and discarding) the first 5,000 entries. NEAR's Vector uses linked-list-style iteration internally, so \`skip\` is O(n). For very large offsets, this can be slow.

**When pagination is critical:**
- Wallets loading user collections
- Marketplaces showing listings
- Any UI listing tokens

**When you can skip pagination:**
- Internal contract operations
- Small collections (<100 tokens)
- Admin-only views

Always default to pagination. Add non-paginated views only when you've measured gas costs and confirmed they're safe.`,
  },
  {
    title: "Don't Do This!",
    content: `Collecting the entire vector without pagination:

\`\`\`rust
// BAD: Gas bomb for large collections
pub fn nft_tokens(&self) -> Vec<String> {
    self.token_ids.iter().collect()
    // For 10,000 tokens: 10,000 storage reads!
}
\`\`\`

This works fine for 10 tokens but fails for 10,000. The gas cost grows linearly with collection size. At some point, the call simply runs out of gas and throws an error.

**Another mistake:** Using the Vector's internal \`.iter()\` without \`skip\`/\`take\`:

\`\`\`rust
// BAD: Always starts from 0, no pagination
pub fn nft_tokens(&self) -> Vec<(String, AccountId)> {
    self.token_ids.iter()
        .filter_map(|id| self.tokens.get(&id).map(...))
        .collect()
}
\`\`\`

Always provide \`from_index\` and \`limit\` parameters. Default them to safe values (\`from_index: 0\`, \`limit: 50\`). Never assume the caller will paginate correctly — your contract should enforce it.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Implement paginated NFT enumeration with mint tracking.

**Code Snippet:**
\`\`\`rust
pub fn mint(&mut self, receiver_id: AccountId) -> String {
    // TODO: Owner check
    // TODO: Create token with next_id
    // TODO: Insert into tokens map AND push to token_ids
    // TODO: Increment next_id
}

pub fn nft_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<(String, AccountId)> {
    // TODO: Default from_index to 0, limit to 50
    // TODO: Skip, take, filter_map from token_ids
}
\`\`\`

**Solution Hints:**
- Mint: \`self.token_ids.push(&token_id);\` (in addition to map insert)
- Pagination: \`let start = from_index.unwrap_or(0) as usize;\`
- Pagination: \`let limit = limit.unwrap_or(50) as usize;\`
- Iteration: \`self.token_ids.iter().skip(start).take(limit).filter_map(|id| self.tokens.get(&id).map(...)).collect()\`
- Supply: \`self.token_ids.len()\`

**Storage key collision warning:** Make sure \`UnorderedMap\` and \`Vector\` use DIFFERENT prefixes (\`b"t"\` and \`b"i"\`) — same prefix corrupts both collections!

[Learn more about NEP-181 →](https://docs.near.org/build/contracts/nfts/enumeration)`,
  },
];

export default nftEnumerationExplanation;
