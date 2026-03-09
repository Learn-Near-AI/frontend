export const contractStructureDetailedExplanation = {
  'contract-structure': [
    {
      title: 'Every Contract Needs A Brain',
      content: `All smart contracts store their owner address in state.

In NEARbyExample, you build **smart contracts** - the brain of your app. It lives on the blockchain and runs automatically when someone calls it.

Think of it like a vending machine: you put in money (gas), make your selection (call a method), and get what you want (result). No middleman needed.

**What you'll build:**
A contract with owner control AND a greeting that only the owner can change. This is the foundation for access control — deciding who can do what.`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if anyone could change your greeting?

\`\`\`rust
// BAD: No owner, anyone can change anything!
struct Contract {
    greeting: String,
}

impl Contract {
    pub fn set_greeting(&mut self, new_greeting: String) {
        // Anyone can call this!
        // No protection whatsoever!
        self.greeting = new_greeting;
    }
}
\`\`\`

**The problem:**
- Anyone can modify your contract
- No accountability
- Hackers can change anything
- Not safe!

Every real contract needs access control!`,
    },
    {
      title: 'The Contract Brain',
      content: `Every contract needs a brain. In Rust, we call it a \`struct\`:

\`\`\`rust
use near_sdk::{env, AccountId, PanicOnDefault};

#[near(contract_state)]      // "This is the contract's memory"
#[derive(PanicOnDefault)]    // Safety: panics if deployed without init
pub struct Contract {
    owner_id: AccountId,     // Who controls this contract
    greeting: String,        // A message only owner can change
}
\`\`\`

**What's happening:**
- \`owner_id: AccountId\` = The boss account
- \`greeting: String\` = Mutable state (but protected!)
- \`#[near(contract_state)]\` = Persists on-chain
- \`#[derive(PanicOnDefault)]\` = Safety net!

**Why this matters:**
The contract state is what persists between calls. This is your contract's memory!`,
    },
    {
      title: 'The Constructor - Your First Choice',
      content: `When you first deploy, YOU decide who owns it:

\`\`\`rust
#[init]
pub fn new(initial_greeting: Option<String>) -> Self {
    // Best practice: Set owner to the DEPLOYER (predecessor), not the contract itself
    let owner = env::predecessor_account_id();

    // Optional: Allow custom greeting or use default
    let greeting = initial_greeting.unwrap_or_else(|| "Hello from NEAR!".to_string());

    Self {
        owner_id: owner,
        greeting,
    }
}
\`\`\`

**Key distinction:**
- \`env::predecessor_account_id()\` = WHO DEPLOYED the contract (you!)
- \`env::current_account_id()\` = WHERE the contract lives

**Why predecessor?**
When YOU deploy, you're the "predecessor" — so you become the owner!`,
    },
    {
      title: 'Reading - View Methods',
      content: `Anyone can READ the contract (free!):

\`\`\`rust
// View: Anyone can read the owner (free)
pub fn get_owner(&self) -> AccountId {
    self.owner_id.clone()
}

// View: Anyone can read the greeting (free)
pub fn get_greeting(&self) -> String {
    self.greeting.clone()
}
\`\`\`

**Breaking it down:**
- \`&self\` = Read-only, no changes
- \`.clone()\` = Returns a copy
- View methods are **free** — no gas needed!

This is like a shop window — anyone can look, but only the owner can change things!`,
    },
    {
      title: 'Writing - Access Control',
      content: `Now for the magic: ONLY the owner can change the greeting:

\`\`\`rust
pub fn set_greeting(&mut self, new_greeting: String) {
    // Access control: Who called this?
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only the owner can change the greeting"
    );

    // Validation: Don't allow empty
    require!(!new_greeting.is_empty(), "Greeting cannot be empty");

    self.greeting = new_greeting;
}
\`\`\`

**The pattern:**
1. Get caller: \`env::predecessor_account_id()\`
2. Compare to owner: \`== self.owner_id\`
3. If match → proceed; if not → revert!

**require!** stops bad actors cold!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why this works: The predecessor check!**

Every transaction on NEAR knows who called it:

\`\`\`
User A → Contract → "Who called me?" → User A!
\`\`\`

The \`env::predecessor_account_id()\` gives you:
- Tamper-proof identity (blockchain verifies)
- Always available
- Cheap to check

**The flow:**
1. Someone calls \`set_greeting\`
2. Contract asks: "Who are you?" → \`predecessor_account_id()\`
3. Compare to \`owner_id\`
4. Match? Update! No match? Reject!

This is the foundation of ALL access control on NEAR!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `This pattern has tradeoffs:

**Having owner gives you:**
- ✅ Access control
- ✅ Accountability (know who did what)
- ✅ Foundation for all security patterns

**Having owner doesn't give you:**
- ❌ Automatic protection (you MUST check!)
- ❌ Multiple admins
- ❌ Consensus for team decisions

**When single owner hurts you:**
- Owner loses key? Stuck forever!
- Owner goes rogue? Can do anything!
- Need team input? Doesn't help!

**The insight:** Setting owner_id is just the BEGINNING. You must check it in EVERY protected method!

**When NOT to use:** For DAOs or team treasuries — you'll need multi-signature!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/build/smart-contracts/anatomy)`,
    },
  ],
};

export const getContractStructureDetailedExplanation = (exampleId) =>
  contractStructureDetailedExplanation[exampleId] ?? null;
