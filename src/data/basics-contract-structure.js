export const contractStructureDetailedExplanation = {
  'contract-structure': [
    {
      title: 'Every Contract Needs A Brain',
      content: `All smart contracts store their owner address in state.

In NEARbyExample, you build **smart contracts** - the brain of your app. It lives on the blockchain and runs automatically when someone calls it.

Think of it like a vending machine: you put in money (gas), make your selection (call a method), and get what you want (result). No middleman needed.

**What you'll build:**
A simple contract that knows which account owns it. This is the foundation for access control — deciding who can do what.

**Heads up:** We're setting up owner_id now, but we won't actually use it until the "Owner Pattern" lesson. We're building the foundation early!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if your contract had NO state?

\`\`\`rust
// BAD: No state, no owner!
struct Contract {
    // Nothing here!
}

impl Contract {
    // Anyone can call anything, no ownership
    pub fn do_something() {
        // No way to know who called this!
    }
}
\`\`\`

**The problem:**
- No way to track ownership
- Anyone can do anything
- Can't protect anything
- Not a real app!

Every real contract needs state - data that persists!`,
    },
    {
      title: 'The Contract Brain',
      content: `Every contract needs a brain. In Rust, we call it a \`struct\`:

\`\`\`rust
use near_sdk::{env, AccountId};

#[near(contract_state)]      // "This is the contract's memory"
#[derive(PanicOnDefault)]    // Safety: panics if deployed without init
pub struct Contract {
    owner_id: AccountId,     // Which account owns this contract
}
\`\`\`

**What's happening:**
- \`owner_id: AccountId\` = Stores the account ID that owns this contract
- \`#[near(contract_state)]\` = Tells NEAR to save this struct on-chain — this is the contract's persistent memory
- \`#[derive(PanicOnDefault)]\` = Safety net! If someone tries to use the contract without calling \`new()\`, it panics. This prevents accidentally using an uninitialized contract.

**Why this matters:**
The contract state (memory) is what persists between calls. Every time someone interacts with your contract, NEAR loads this data, your code runs, and the updated state gets saved back.`,
    },
    {
      title: 'The Constructor - Initial Setup',
      content: `When you first deploy a contract, you need to set initial values. That's what the **constructor** does:

\`\`\`rust
#[near]
impl Contract {
    #[init]                                    // "This sets up the contract"
    pub fn new() -> Self {
        Self {
            // Set owner_id to the contract's own account
            owner_id: env::current_account_id(),
        }
    }
}
\`\`\`

**Key details:**
- \`env::current_account_id()\` = The account WHERE this contract is deployed
- \`env::predecessor_account_id()\` = The account that CALLED this method (the signer)

For now, we set owner to the contract account. Later you'll learn when to use predecessor instead!

**What #[init] does:**
- Marks this as the constructor — must be called ONCE when deploying
- \`pub fn new() -> Self\` = Creates and returns the contract instance
- \`Self { owner_id: ... }\` = Sets the initial state`,
    },
    {
      title: 'Reading The Owner - A View Method',
      content: `Let's add a way to check who's the owner:

\`\`\`rust
// View method - read-only, free to call
pub fn get_owner(&self) -> AccountId {
    self.owner_id.clone()
}
\`\`\`

**Breaking it down:**
- \`pub fn get_owner\` = The function name (what you call from outside)
- \`&self\` = Read-only! This method can LOOK at data but can't CHANGE anything
- \`-> AccountId\` = Returns the owner's account ID
- \`.clone()\` = Rust being careful — gives a copy so we don't break anything

**The View Method Superpower:**
Methods with \`&self\` are called "view methods." They're special because:
- They're **free** — no gas fees, no wallet needed
- They're **read-only** — can't change blockchain state
- Anyone can call them — like peeking through a window

Try it! Click Run to see who the owner is.`,
    },
    {
      title: 'The Design Insight',
      content: `**Why owner_id matters: Access control foundation!**

The owner_id is the foundation of access control:

\`\`\`rust
owner_id: AccountId  // Who controls this contract?
\`\`\`

Every security pattern builds on this:
- Owner Pattern: Check if caller == owner_id
- RBAC: Owner adds admins
- Multi-sig: Signers vote on actions
- Pausable: Owner can pause

**The flow:**
1. Deploy contract → owner_id set in constructor
2. Someone calls a method → env::predecessor_account_id()
3. Compare caller to owner_id → allow or reject

Simple but powerful!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Contract structure has tradeoffs:

**Having owner gives you:**
- ✅ Access control foundation
- ✅ Ability to protect operations
- ✅ Foundation for all security patterns

**Having owner doesn't give you:**
- ❌ Automatic protection (you must check it!)
- ❌ Multiple administrators
- ❌ Consensus

**When single owner hurts you:**
- Owner loses key? Stuck forever.
- Owner goes rogue? Can do anything.
- Need team decisions? Doesn't help.

**The insight:** Setting owner_id is just the BEGINNING. You still need to actually check it in your methods (covered in Owner Pattern lesson!)

**When NOT to use owner:** For fully decentralized apps where no single account should have special power - but that's advanced!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/build/smart-contracts/anatomy)`,
    },
  ],
};

export const getContractStructureDetailedExplanation = (exampleId) =>
  contractStructureDetailedExplanation[exampleId] ?? null;
