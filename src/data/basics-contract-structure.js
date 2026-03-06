export const contractStructureDetailedExplanation = {
  'contract-structure': [
    {
      title: 'Every Contract Needs A Brain',
      content: `In NEARbyExample, you build **smart contracts** - the brain of your app. It lives on the blockchain and runs automatically when someone calls it.

Think of it like a vending machine: you put in money (gas), make your selection (call a method), and get what you want (result). No middleman needed.

**What you'll build:**
A simple contract that knows which account owns it. This is the foundation for access control — deciding who can do what.

**Heads up:** We're setting up owner_id now, but we won't actually use it until the "Owner Pattern" lesson. We're building the foundation early!`,
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
  ],
};

export const getContractStructureDetailedExplanation = (exampleId) =>
  contractStructureDetailedExplanation[exampleId] ?? null;
