export const nftApprovalExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement NFT approvals — allowing a third party (approved account) to transfer a token on behalf of the owner.

**Requirements:**
- Store \`tokens: UnorderedMap<String, Token>\` where Token has \`owner_id\` and \`approved_account_id\`
- Implement \`approve(token_id, account_id)\` — owner-only, sets the approved account
- Implement \`transfer_from(owner_id, receiver_id, token_id)\` — owner OR approved can transfer
- Implement \`get_approved(token_id)\` — view method

**Test:** Only the owner or approved account can transfer; approval clears after transfer!`,
  },
  {
    title: 'The Delegated Key!',
    content: `Marketplaces use approval to let their contracts transfer NFTs on behalf of sellers — you approve the marketplace contract once, then it can list and sell your tokens.

Imagine you're at an auction house. You give the auctioneer a signed letter saying "I authorize you to sell my painting #42." The auctioneer now has temporary authority to transfer that painting to a buyer.

That's **approval**: delegating transfer authority to another account without giving up ownership.

**Why approvals exist:**
- **Marketplaces** — approve the marketplace contract to transfer tokens when a sale happens
- **Escrow** — temporary authority for trades or swaps
- **Gaming** — let a game contract move your tokens for staking or crafting

The approved account is like a limited power of attorney. They can transfer specific tokens but can't change metadata, approve others, or burn the token.`,
  },
  {
    title: 'The Approval Data Model',
    content: `We add an \`approved_account_id\` field to the Token struct:

\`\`\`rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    owner_id: AccountId,
    approved_account_id: Option<AccountId>,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}
\`\`\`

**Key design:**
- \`approved_account_id: Option<AccountId>\` — \`Some(account)\` if approved, \`None\` if not
- Only ONE approved account per token at a time (NEP-178 allows one)
- The approval is stored IN the token, not in a separate map

**Why Option<AccountId> instead of a boolean?** We need to know WHO is approved, not just whether someone is. This allows the \`transfer_from\` function to verify the caller matches the approved account.

**Why only one approval?** NEP-178 (approval management) supports single approvals per token. For multiple concurrent approvals, you'd need a \`LookupMap<AccountId, bool>\` per token. That's more complex and rarely needed.`,
  },
  {
    title: 'The Approve Flow',
    content: `Setting an approval is straightforward:

\`\`\`rust
pub fn approve(&mut self, token_id: String, account_id: AccountId) {
    let mut token = self.tokens.get(&token_id).expect("Token not found");
    require!(token.owner_id == env::predecessor_account_id(), "Not owner");
    token.approved_account_id = Some(account_id);
    self.tokens.insert(&token_id, &token);
}
\`\`\`

**Steps:**
1. Get the token (panic if not found)
2. Verify caller is the current owner
3. Set the approved account
4. Save the updated token

**Who can approve:** Only the token owner. Not the approved account, not the contract owner. The owner has absolute control over who can act on their behalf.

**Clearing an approval:** Call \`approve(token_id, account_id)\` with a new account to change it, or set \`approved_account_id = None\` to revoke. The owner can revoke at any time.

**Important:** The approved account can also transfer ownership to themselves using \`transfer_from\`. This is intentional — it's how marketplaces work (buyer pays → marketplace transfers → buyer becomes owner).`,
  },
  {
    title: 'Transfer From — The Guarded Transfer',
    content: `The \`transfer_from\` method allows either the owner OR the approved account to initiate a transfer:

\`\`\`rust
pub fn transfer_from(&mut self, owner_id: AccountId, receiver_id: AccountId, token_id: String) {
    let mut token = self.tokens.get(&token_id).expect("Token not found");
    let predecessor = env::predecessor_account_id();
    require!(
        token.owner_id == predecessor || token.approved_account_id.as_ref() == Some(&predecessor),
        "Not authorized"
    );
    token.owner_id = receiver_id;
    token.approved_account_id = None;
    self.tokens.insert(&token_id, &token);
}
\`\`\`

**The authorization check:**
- Caller is the owner → can transfer to anyone
- Caller is the approved account → can transfer to anyone (including themselves!)
- Anyone else → rejected

**After transfer, approval is cleared (\`None\`).** This is critical for security. The old approved account no longer has authority over the token under its new owner.

**Why receive \`owner_id\` as parameter?** For clarity and cross-contract compatibility. The marketplace contract knows the owner and passes it explicitly. The on-chain check against \`token.owner_id\` prevents mismatches.`,
  },
  {
    title: 'Security Considerations',
    content: `Approval is a powerful feature — it allows someone else to move your tokens. Here's what to watch for:

**Race condition (the approval trap):**
1. Owner approves Marketplace A to sell Token #1
2. Owner transfers Token #1 to User B (via \`nft_transfer\`)
3. Old approval from step 1 is now STALE — User B never approved Marketplace A
4. But some implementations might still have the old approval!

**Solution:** Always clear \`approved_account_id\` on direct transfers too. In our \`nft_transfer\` (not implemented in this example, but important), you should also set \`approved_account_id = None\`.

**Phishing risk:** Be careful what you approve. A malicious marketplace contract could transfer all your approved tokens. Only approve contracts you trust.

**The lock-in problem:** Once you approve a marketplace, your token might be locked in a listing. Some implementations add a "cancel listing" function to handle this.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Approvals are essential for a functional NFT ecosystem. Without them, marketplaces would need users to transfer tokens first (risky) or use complex escrow systems.

The single-approval model is simple but limited. If you want a token listed on multiple marketplaces simultaneously, you need a more complex approval system (see NEP-181 for advanced approval management).

Storage-wise, \`Option<AccountId>\` adds ~35 bytes per token with an approval set, and ~1 byte for \`None\`. For a collection of 10,000 tokens with all approvals set, that's ~350KB of storage — significant gas cost.

**When to use approvals:**
- Marketplace listings (the primary use case)
- Escrow for atomic swaps
- Game staking where the game contract moves tokens

**When NOT to use approvals:**
- Trustless peer-to-peer transfers (use \`nft_transfer\` directly)
- When simplicity matters more than composability`,
  },
  {
    title: "Don't Do This!",
    content: `Not clearing the approval after transfer:

\`\`\`rust
// BAD: Old approval survives the transfer!
pub fn transfer_from(&mut self, ...) {
    // ... check authorization ...
    token.owner_id = receiver_id;
    // Forgot: token.approved_account_id = None;
    self.tokens.insert(&token_id, &token);
}
\`\`\`

**The exploit:**
1. Alice owns Token #1, approves Bob
2. Bob calls \`transfer_from\` to send Token #1 to Charlie
3. Bob is still the approved account (approval was never cleared!)
4. Bob can call \`transfer_from\` again and steal Token #1 from Charlie

Always clear approvals on transfer! This is not optional — it's a security requirement of NEP-178.

**Another mistake:** Using \`unwrap()\` instead of \`expect("descriptive message")\`:
\`\`\`rust
// BAD: Panics with unhelpful message
let mut token = self.tokens.get(&token_id).unwrap();
\`\`\`
Use \`expect("Token not found")\` so users know what went wrong.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Implement approval-based transfers where an authorized account can transfer tokens.

**Code Snippet:**
\`\`\`rust
pub fn approve(&mut self, token_id: String, account_id: AccountId) {
    // TODO: Get token, require owner, set approved_account_id, save
}

pub fn transfer_from(&mut self, owner_id: AccountId, receiver_id: AccountId, token_id: String) {
    // TODO: Get token, require owner or approved, update owner, clear approval, save
}
\`\`\`

**Solution Hints:**
- \`approve\`: \`require!(token.owner_id == env::predecessor_account_id(), "Not owner"); token.approved_account_id = Some(account_id);\`
- \`transfer_from\`: Check \`token.owner_id == predecessor || token.approved_account_id.as_ref() == Some(&predecessor)\`
- Always clear approval: \`token.approved_account_id = None;\`
- View: \`self.tokens.get(&token_id).and_then(|t| t.approved_account_id)\`

**Important:** The approved account can be ANY account — including another contract! This is how marketplace contracts receive and process transfers.

[Learn more about NEP-178 →](https://docs.near.org/build/contracts/nfts/approval)`,
  },
];

export default nftApprovalExplanation;
