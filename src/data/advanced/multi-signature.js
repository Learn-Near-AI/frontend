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
    title: 'Inspecting State',
    content: `**View methods to see what's happening (critical for testing!):**

\`\`\`rust
/// Get all signers
pub fn get_signers(&self) -> Vec<AccountId> {
    self.signers.iter().collect()
}

/// Get approvals for a specific action
pub fn get_approvals(&self, action: String) -> Vec<AccountId> {
    self.signers.iter()
        .filter(|s| self.approvals.contains(&format!("{}:{}", action, s)))
        .collect()
}

pub fn get_last_action(&self) -> Option<String> {
    self.last_executed_action.clone()
}
\`\`\`

These are essential for debugging — without them, the contract is a black box!`,
  },
  {
    title: 'Bootstrapping The Multi-Sig',
    content: `**The initial setup flow:**

When you deploy a multi-sig contract, it starts empty. Here's how to set it up:

1. **Deploy** the contract with \`new(required_signatures)\`
2. **The contract account itself** is the only "authorized" caller initially (because \`signers.is_empty()\` is true)
3. **Call add_signer** using the contract account as the --accountId (not your deployer wallet!)

\`\`\`bash
# Step 1: Deploy the contract
near deploy <account-id> --wasmFile contract.wasm

# Step 2: Initialize with threshold
near call <account-id> new '{"required_signatures": 2}' --accountId <account-id>

# Step 3: Add signers using the CONTRACT ACCOUNT (not your wallet!)
# This is the key - predecessor must equal current_account_id
near call <account-id> add_signer '{"account": "signer1.near"}' --accountId <account-id>
near call <account-id> add_signer '{"account": "signer2.near"}' --accountId <account-id>
near call <account-id> add_signer '{"account": "signer3.near"}' --accountId <account-id>
\`\`\`

**Why is this tricky?** The condition \`self.signers.is_empty() && pred == env::current_account_id()\` means only the contract itself can add the first signer. This is a security feature — it prevents anyone but the contract from adding signers until signers exist.

**To add the first signer**, you call the contract with --accountId set to THE CONTRACT ACCOUNT (not your wallet). This makes the predecessor = current_account_id. After signers exist, you can call normally with your wallet.

> ⚠️ **Pro tip:** Use a batch transaction to set everything up in one go, or use a deploy script that schedules the initial signer additions as callbacks!`,
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
    pub fn new(required_signatures: u32) -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures,
            approvals: UnorderedSet::new(b"a"),
            last_executed_action: None,
        }
    }
}
\`\`\`

**Design:**
- 3 signers, require 2 = any 2 of 3 must approve
- Approvals stored as "action:signer" to prevent duplicates
- Keep history (last_executed_action) for transparency

> ⚠️ **Production tip:** Pass \`required_signatures\` as a constructor parameter! Hardcoding thresholds is an anti-pattern — different teams may need different consensus levels (e.g., 3-of-5 for treasuries, 2-of-3 for operations).`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A safe with two keys is the gold standard for decentralization. No single person can open the safe alone. Both owners have to agree, which means you don't need to trust any one person. And there's clear accountability — you know exactly who approved what with both keys.

But here's the tradeoff: it's slow. You need both people to turn their keys, which means emergency decisions take time. It's also more complex than a simple lock, with more mechanisms and more places for things to go wrong. And it's still manual — both owners have to show up, there's no automatic opening based on rules.

So use multi signature for treasuries and high value, low frequency decisions. For everyday operations that need to be fast, it's too much overhead. And if both key holders go unresponsive, the safe stays locked forever.

**When NOT to use Multi-sig:** If you need fast automated decisions, or single user operations, use owner pattern or RBAC instead. Multi signature is for high value, low frequency decisions!`,
  },
  {
    title: 'Deadlock Warning & Threshold Design',
    content: `**The Sharpest Edge Case: Deadlock**

If all signers lose access to their keys or become unresponsive, the contract is frozen forever. No recovery path. This is the harsh reality of multi-sig that tutorials rarely mention.

**Why threshold design matters:**

| Setup | Risk |
|-------|------|
| 2-of-2 | ONE key lost → funds frozen forever |
| 2-of-3 | ONE key lost → still operational |
| 3-of-5 | TWO keys lost → still operational |

**3-of-5 beats 2-of-2 for resilience:**
- Tolerates 2 of 5 keys lost (40% failure tolerance)
- 2-of-2 has ZERO fault tolerance — losing either key is fatal
- More signers = more distribution = harder for attackers
- But too many signers = slower decisions

**The heuristic:**
- **Treasuries:** 3-of-5 or 4-of-7 (high value, tolerate some slowness)
- **Operations:** 2-of-3 (balance of speed and safety)
- **Avoid:** 2-of-2 for any real funds — it's a time bomb

The threshold isn't just a number — it's your risk tolerance made concrete. Choose like you mean it.`,
  },
  {
    title: 'Multi-sig Operations',
    content: `**The Action Collision Fix: Nonce-based Keys**

The vulnerability: if two "transfer" actions are proposed at different times, approvals from the first could apply to the second. The fix: use a monotonically incrementing \`proposal_id\`.

**State with nonce:**
\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<String>,     // Stored as "proposal_id:action:signer"
    last_executed_action: Option<String>,
    proposal_id: u64,                     // Increment per proposal
}
\`\`\`

**The key insight:** key = \`"proposal_id:action:signer"\` not \`"action:signer"\`. Each proposal gets its own namespace.

---

**Proposing an action (creates a new proposal):**
\`\`\`rust
pub fn propose(&mut self, action: String) -> u64 {
    let pred = env::predecessor_account_id();
    require!(self.signers.contains(&pred), "Not a signer");
    
    let proposal_id = self.proposal_id;
    self.proposal_id += 1;
    
    env::log_str(&format!("Proposal {} created: {}", proposal_id, action));
    proposal_id
}
\`\`\`

**Approving a specific proposal:**
\`\`\`rust
pub fn approve(&mut self, proposal_id: u64, action: String) {
    let signer = env::predecessor_account_id();
    require!(self.signers.contains(&signer), "Not a signer");
    require!(proposal_id < self.proposal_id, "Invalid proposal");
    
    let key = format!("{}:{}:{}", proposal_id, action, signer);
    self.approvals.insert(&key);
}
\`\`\`

**Checking & Executing with nonce:**
\`\`\`rust
fn can_execute(&self, proposal_id: u64, action: &str) -> bool {
    let count = self.signers.iter()
        .filter(|s| self.approvals.contains(&format!("{}:{}:{}", proposal_id, action, s)))
        .count();
    count >= self.required_signatures as usize
}

pub fn execute(&mut self, proposal_id: u64, action: String) {
    require!(self.can_execute(proposal_id, &action), "Not enough approvals");
    
    for signer in self.signers.iter() {
        let key = format!("{}:{}:{}", proposal_id, action, signer);
        self.approvals.remove(&key);
    }
    
    self.last_executed_action = Some(action);
    env::log_str(&format!("Executed proposal {}: {}", proposal_id, action));
}
\`\`\`

**Why this works:** Each proposal gets a unique ID. Approvals are scoped to that specific proposal. Even if two proposals have the same action string, they're isolated by proposal_id.`,
  },
  {
    title: 'Real Treasury Execute: NEAR Transfer',
    content: `**Making execute() do something real: a NEAR token transfer**

The simple execute() above just logs. Here's how to actually transfer NEAR using a Promise:

\`\`\`rust
use near_sdk::Promise;

pub fn execute(&mut self, proposal_id: u64, action: String) {
    require!(self.can_execute(proposal_id, &action), "Not enough approvals");
    
    // Clear approvals
    for signer in self.signers.iter() {
        let key = format!("{}:{}:{}", proposal_id, action, signer);
        self.approvals.remove(&key);
    }
    
    // Parse action: "transfer:amount:recipient"
    let parts: Vec<&str> = action.split(':').collect();
    require!(parts.len() == 3 && parts[0] == "transfer", "Invalid action");
    
    let amount: u128 = parts[1].parse().expect("Invalid amount");
    let recipient: AccountId = parts[2].parse().expect("Invalid recipient");
    
    // Execute the transfer via Promise
    Promise::new(recipient).transfer(amount);
    
    self.last_executed_action = Some(action);
    env::log_str(&format!("Executed transfer of {} NEAR to {}", amount, recipient));
}
\`\`\`

**How signers use it:**

\`\`\`rust
// Signer 1 proposes
let proposal_id = contract.propose("transfer:100:alice.near".to_string());

// Signer 2 approves
contract.approve(proposal_id, "transfer:100:alice.near".to_string());

// Signer 3 approves  
contract.approve(proposal_id, "transfer:100:alice.near".to_string());

// Execute! (if 2-of-3 threshold)
contract.execute(proposal_id, "transfer:100:alice.near".to_string());
\`\`\`

**Key points:**
- \`Promise::new(recipient).transfer(amount)\` is the native NEAR transfer
- Action string encodes all needed data: \`action:amount:recipient\`
- This pattern extends to any contract call, not just transfers

This is what every multi-sig treasury actually needs — the rest is just accounting!`,
  },
  {
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
    title: 'Learn More',
    content: `[Learn more about this topic →](https://github.com/near/core-contracts/tree/master/multisig)`,
  },
];

export default multiSignatureExplanation;
