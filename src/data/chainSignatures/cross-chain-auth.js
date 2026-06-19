export const crossChainAuthExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement cross-chain authorization — managing a set of authorized external identities that can trigger cross-chain actions.

**Requirements:**
- Store \`authorized: UnorderedSet<String>\` of approved external identities
- Implement \`authorize_cross_chain(external_id)\` — adds an identity to the authorized set
- Implement \`revoke_cross_chain(external_id)\` — removes an identity from the set
- Implement \`is_authorized(external_id) -> bool\` — view method checking authorization
- Implement \`require_authorized(external_id)\` — panics if not authorized

**Test:** Only authorized identities pass require_authorized; revoked identities are rejected!`,
  },
  {
    title: 'The Gatekeeper!',
    content: `Cross-chain authorization ensures that only approved external identities can trigger actions on your contract. This is the **gatekeeper pattern** — a whitelist of identities that have proven their cross-chain ownership.

Think of this as a **VIP list** at an exclusive club. The bouncer (your contract) checks each person's ID against the list. Only approved guests get in.

**Why cross-chain auth?** With chain signatures, ANY external address can claim to be your user. You need a way to:
- Verify that an external address is legitimate
- Grant and revoke access
- Audit who has access

**The flow:**
1. User proves ownership of an external address (e.g., Ethereum account)
2. Contract owner or authorized admin calls \`authorize_cross_chain(external_id)\`
3. The external identity can now trigger cross-chain actions
4. If compromised, the identity is revoked via \`revoke_cross_chain\`

**The UnorderedSet** is perfect for this — it provides O(1) insert/remove/contains operations and automatically handles deduplication.`,
  },
  {
    title: 'Managing Authorization',
    content: `Authorization is managed through a simple set interface:

\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    authorized: UnorderedSet<String>,
}

impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { authorized: UnorderedSet::new(b"a") }
    }

    pub fn authorize_cross_chain(&mut self, external_id: String) {
        self.authorized.insert(&external_id);
        env::log_str("Cross-chain identity authorized");
    }

    pub fn revoke_cross_chain(&mut self, external_id: String) {
        self.authorized.remove(&external_id);
    }

    pub fn is_authorized(&self, external_id: String) -> bool {
        self.authorized.contains(&external_id)
    }

    pub fn require_authorized(&self, external_id: String) {
        near_sdk::require!(
            self.authorized.contains(&external_id),
            "Not authorized for cross-chain"
        );
    }
}
\`\`\`

**The \`authorize\` method:**
- \`insert\` into the set (idempotent — no error if already present)
- Logs the event for auditability
- No access control in this example (add owner check in production)

**The \`revoke\` method:**
- \`remove\` from the set (also idempotent)
- No error if the identity wasn't in the set — clean and safe

**The \`is_authorized\` view method:**
- Returns boolean — free to call
- Use this before sending transactions to verify authorization

**The \`require_authorized\` gate:**
- Panics with a clear message if not authorized
- Call this at the START of any protected method`,
  },
  {
    title: 'The Authorization Gate Pattern',
    content: `The \`require_authorized\` method is your gate — place it at the top of any protected method:

\`\`\`rust
pub fn cross_chain_action(&self, external_id: String, action_data: ...) {
    // Gate: only authorized identities pass
    self.require_authorized(external_id);  // Panics if not authorized

    // If we reach here, the identity is authorized
    // Perform the cross-chain action...
}
\`\`\`

**Why a separate method instead of inline?**
- **Reusability** — call \`require_authorized\` from any method that needs protection
- **Consistency** — the error message and check are always the same
- **Auditability** — you can add logging to the gate method without touching every caller

**The JavaScript version:**
\`\`\`javascript
require_authorized(external_id) {
    if (!this.authorized.includes(external_id)) near.panic("Not authorized for cross-chain");
}
\`\`\`

**Combine with chain signatures:**
The \`external_id\` could be:
- An Ethereum address derived from the MPC path
- A Bitcoin address
- Any string that identifies an external identity
- A hash of the user's external public key

The gate ensures that only approved external identities can use the chain signature feature. This prevents unauthorized use of your contract's MPC budget.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Authorization is essential for any cross-chain system. Without it, anyone could use your contract's MPC integration.

**Advantages:**
- **Simple and effective** — insert/remove/check, no complex logic
- **Auditable** — every authorization and revocation is recorded
- **Idempotent** — calling authorize twice has the same effect as once
- **Gas efficient** — \`UnorderedSet\` operations are O(1)

**Limitations:**
- **No owner-only access** — anyone can authorize identities in this example
- **Centralized** — requires someone to manage the list
- **No expiration** — authorizations last forever unless explicitly revoked
- **Storage cost** — each authorized identity costs storage

**When to use this pattern:**
- Managing whitelisted external addresses
- Simple on/off access per identity
- Audit-friendly authorization log

**Enhancements for production:**
- Add owner-only check to \`authorize\` and \`revoke\`
- Add timestamps for authorization expiration
- Emit NEP-297 events for authorization changes
- Store the authorizer's identity for audit trail`,
  },
  {
    title: "Don't Do This!",
    content: `Using a Vector instead of UnorderedSet for authorization:

\`\`\`rust
// BAD: Vector requires O(n) scan for authorization check
pub fn is_authorized(&self, external_id: String) -> bool {
    for id in self.authorized.iter() {  // O(n) — expensive for large sets!
        if id == external_id { return true; }
    }
    false
}
\`\`\`

\`UnorderedSet\` provides O(1) \`contains\` lookups. \`Vector\` requires iterating through ALL entries — gas cost grows with every authorized identity. Always use \`UnorderedSet\` for membership checks.

**Not logging authorization changes:**
\`\`\`rust
// BAD: No audit trail — who authorized whom, and when?
pub fn authorize_cross_chain(&mut self, external_id: String) {
    self.authorized.insert(&external_id);
    // Missing: env::log_str(...)
}
\`\`\`

Without logs, you can't audit who was authorized and when. If a compromised identity is discovered, you can't trace back who authorized it.

**Silently ignoring duplicate authorization:**
\`\`\`rust
// BAD: No feedback if identity was already authorized
pub fn authorize_cross_chain(&mut self, external_id: String) {
    self.authorized.insert(&external_id);  // If already present, nothing changes
    // No log, no return — caller doesn't know if anything happened
}
\`\`\`

Consider returning a boolean indicating whether authorization was added or already existed. This helps callers understand the state change.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Manage a set of authorized cross-chain identities.

**Code Snippet:**
\`\`\`rust
pub fn authorize_cross_chain(&mut self, external_id: String) {
    // TODO: Insert into authorized set, log the event
}

pub fn revoke_cross_chain(&mut self, external_id: String) {
    // TODO: Remove from authorized set
}

pub fn is_authorized(&self, external_id: String) -> bool {
    // TODO: Check if authorized
}

pub fn require_authorized(&self, external_id: String) {
    // TODO: Panic if not authorized
}
\`\`\`

**Solution Hints:**
- Authorize: \`self.authorized.insert(&external_id); env::log_str("Cross-chain identity authorized");\`
- Revoke: \`self.authorized.remove(&external_id);\`
- Check: \`self.authorized.contains(&external_id)\`
- Gate: \`near_sdk::require!(self.authorized.contains(&external_id), "Not authorized for cross-chain");\`
- Import: \`use near_sdk::collections::UnorderedSet;\`

**JavaScript version:**
\`\`\`javascript
authorize_cross_chain({ external_id }) {
    if (!this.authorized.includes(external_id)) this.authorized.push(external_id);
    near.log("Cross-chain identity authorized");
}

revoke_cross_chain({ external_id }) {
    this.authorized = this.authorized.filter((x) => x !== external_id);
}

is_authorized({ external_id }) {
    return this.authorized.includes(external_id);
}

require_authorized(external_id) {
    if (!this.authorized.includes(external_id)) near.panic("Not authorized for cross-chain");
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default crossChainAuthExplanation;
