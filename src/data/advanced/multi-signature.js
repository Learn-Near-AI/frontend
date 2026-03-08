export const multiSignatureExplanation = [
  {
    title: 'The Two-Key Safe!',
    content: `DAOs use multi-sig contracts to secure treasuries requiring multiple approvals.

Imagine a safe that needs TWO keys to open. You have one key, your business partner has the other. Neither of you can open it alone!

That's a **multi-signature** contract - multiple people must approve an action before it happens.

This is crucial for:
- Team treasuries (no one person steals the money)
- High-value operations
- DAO-style governance
- Any time you need trustless consensus`,
  },
  {
    title: "The Naive Approach (Don't Do This!)",
    content: `What if only ONE person controls the treasury?

\`\`\`rust
// BAD: Single point of failure!
struct BadTreasury {
    owner: AccountId,
    balance: u128,
}

impl BadTreasury {
    pub fn withdraw(&mut self, to: AccountId, amount: u128) {
        // ONE person can drain everything!
        // No checks, no consensus!
        // If owner goes rogue or gets hacked → game over!
    }
}
\`\`\`

**The problem:**
- One compromised key → all funds lost
- No accountability
- No trustlessness
- Single point of failure

This is why multi-signature exists - no single person should control valuable assets!`,
  },
  {
    title: "The Safe's Data",
    content: `Here's what the actual code looks like:

\`\`\`rust
use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,      // How many approvals needed (e.g., 2)
    approvals: UnorderedSet<String>, // Stored as "action:signer"
    last_executed_action: Option<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures: 2,
            approvals: UnorderedSet::new(b"a"),
            last_executed_action: None,
        }
    }
}
\`\`\`

**Design:**
- 3 signers, require 2 = any 2 of 3 must approve
- Approvals stored as "action:signer" to prevent duplicates
- Keep history (last_executed_action) for transparency`,
  },
  {
    title: 'Multi-sig Operations',
    content: `**Adding Signers:**
Only signers (or the first deployer) can add new signers:

\`\`\`rust
pub fn add_signer(&mut self, account: AccountId) {
    let pred = env::predecessor_account_id();
    require!(
        (self.signers.is_empty() && pred == env::current_account_id()) 
        || self.signers.contains(&pred),
        "Only deployer (when empty) or signers can add"
    );
    self.signers.insert(&account);
}
\`\`\`

**Approving Actions:**
\`\`\`rust
pub fn approve(&mut self, action: String) {
    let signer = env::predecessor_account_id();
    require!(self.signers.contains(&signer), "Not a signer");
    let key = format!("{}:{}", action, signer);
    self.approvals.insert(&key);
}
\`\`\`

**Executing:**
\`\`\`rust
pub fn execute(&mut self, action: String) {
    require!(self.can_execute(&action), "Not enough approvals");
    
    // Clear approvals after execution
    for signer in self.signers.iter() {
        let key = format!("{}:{}", action, signer);
        self.approvals.remove(&key);
    }
    
    self.last_executed_action = Some(action.clone());
}
\`\`\``,
  },
  {
    title: 'Multi-sig vs Other Patterns',
    content: `Quick guide:

**Use MULTI-SIG when:**
- Team treasury
- High-value operations
- Need consensus, not just permissions
- No single person should control funds

**Use OWNER when:**
- Single admin is fine
- Simple project

**Use RBAC when:**
- Different people need different permissions
- But consensus isn't required

**The insight:** Multi-sig is about CONSENSUS. RBAC is about PERMISSIONS. They solve different problems!`,
  },
  {
    title: 'The Design Insight',
    content: `**Why approval tracking works!**

The system uses two key sets:

\`\`\`rust
signers: UnorderedSet<AccountId>,    // Who can approve
approvals: UnorderedSet<String>,    // "action:signer" pairs
\`\`\`

**The flow:**
1. Action proposed (as a string like "transfer:100:alice.near")
2. Signers call approve() → adds "action:signer" to approvals
3. Execute checks: count approvals ≥ required_signatures?
4. If yes, execute and clear all approvals for that action

**Why this works:**
- Each signer can only approve once per action (set prevents duplicates)
- All approvals needed = consensus achieved
- Clearing after execution prevents replay

Simple but effective consensus mechanism!`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Multi-sig is powerful, but know the costs:

**MULTI-SIG gives you:**
- ✅ Consensus (no single point of failure)
- ✅ Trustlessness (doesn't require trusting one person)
- ✅ Accountability (multiple people must agree)

**MULTI-SIG doesn't give you:**
- ❌ Speed (requires multiple approvals)
- ❌ Simplicity (more complex than owner pattern)
- ❌ Automatic decisions (still manual approvals)

**When multi-sig hurts you:**
- Emergency? Too slow to react!
- Small team? Overhead not worth it.
- All signers unresponsive? Stuck!

**The insight:** Multi-sig trades speed for safety. Perfect for treasuries, not for everyday operations!

**When NOT to use Multi-sig:** If you need fast, automated decisions, or single-user operations - use owner pattern or RBAC instead. Multi-sig is for high-value, low-frequency decisions!`,
  },
  {
    title: 'Learn More',
    content: `[Learn more about this topic →](https://github.com/near/core-contracts/tree/master/multisig)`,
  },
];

export default multiSignatureExplanation;
