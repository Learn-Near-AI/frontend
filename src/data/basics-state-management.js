export const stateManagementDetailedExplanation = {
  'state-management': [
    {
      title: 'Your Inventory Awaits!',
      content: `Token contracts store balances in state to track ownership.

In games, your inventory is what makes you unique. Your sword, your potions, your treasure - it's all stored somewhere.

In NEAR contracts, **state** is your inventory. It's the data that sticks around between calls.

Without state, every time you called a contract, it would forget everything. Like a game that crashes every time you save!

**What you'll build:**
A counter contract - the simplest example of state that changes! This pattern is the foundation for:
- Voting systems
- Token balances
- User inventories
- Anything that counts!`,
    },
    {
      title: 'How State Persists',
      content: `Here's the magic: the counter STICKS AROUND.

Every time someone calls your contract, it remembers. That's because:

1. Someone calls the contract
2. NEAR loads up the contract's state (counter = 5, for example)
3. Your code runs with that state
4. If it's a change method, NEAR saves the new state back
5. Next time, it loads the updated value!

It's like a game that auto-saves after every action. Pretty cool, right?

**Try it:**
Call increment, then call get_counter. Does it remember? You bet it does!

**Why does this matter?**
State persistence is what makes smart contracts powerful. The data survives even when you're not using the app. It's like having a database that never goes down!`,
    },
    {
      title: "Don't Do This!",
      content: `What if state wasn't persisted?

\`\`\`rust
// BAD: State resets every call!
fn increment(counter: u64) -> u64 {
    counter + 1
}
// Every time you call, counter is 0!
// Like a game that never saves!
\`\`\`

**The problem:**
- No memory between calls
- Can't build anything useful
- Every call starts fresh
- Not a real smart contract!

You NEED persisted state to build real apps!`,
    },
    {
      title: 'The Contract Brain - Counter Edition',
      content: `Here's a contract with state:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    counter: u64,      // A number that goes up only (for now!)
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { counter: 0 }  // Start at zero!
    }
}
\`\`\`

> **Fun fact:** u64 can store values from 0 to 18,446,744,073,709,551,615 — that's 18 quintillion! Plenty for any counter.

**What's happening:**
- \`counter: u64\` = An unsigned 64-bit integer
- In the constructor, we initialize it to 0

**Why u64?**
- It can store HUGE numbers (sufficient for most counters)
- It's efficient - NEAR knows exactly how much space it takes
- No negative numbers (use i64 if you need negatives)

Think of it like a save file in a game. The contract loads this up every time someone calls it!`,
    },
    {
      title: 'Real World Inventories',
      content: `Big apps have HUGE inventories:

**A banking app might track:**
- User balances (millions of accounts!)
- Total money in system
- Is the bank paused?

**An NFT game might track:**
- Player's characters
- Each character's stats
- Items in inventory
- Quest progress

**A voting system might track:**
- Total votes
- Who voted (to prevent double-voting)
- Proposal status

Understanding state is key to building anything useful. Your inventory is your power!`,
    },
    {
      title: 'Reading And Changing The Counter',
      content: `Here's the full contract with methods:

\`\`\`rust
// View method - read the counter (free!)
pub fn get_counter(&self) -> u64 {
    self.counter
}

// Change method - add 1 to the counter (costs gas)
pub fn increment(&mut self) {
    self.counter += 1;
}
\`\`\`

**Breaking it down:**

**View method (\`get_counter\`):**
- Uses \`&self\` - read-only, no changes
- Returns \`u64\` - just the number
- Free to call!
- **Note:** No \`.clone()\` needed here! Numbers copy automatically in Rust, but strings need \`.clone()\` to avoid moving them. (Remember that from the View Methods lesson?)

**Change method (\`increment\`):**
- Uses \`&mut self\` - can modify state
- \`+= 1\` means "add 1 to myself"
- Same as \`self.counter = self.counter + 1\`

**Why does this matter?**
The counter pattern is everywhere! Token supplies, vote counts, user scores - they all work this way. One method reads, one method changes. Simple!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/storage)`,
    },
  ],
};

export const getStateManagementDetailedExplanation = (exampleId) =>
  stateManagementDetailedExplanation[exampleId] ?? null;
