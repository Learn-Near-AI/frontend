export const stateManagementDetailedExplanation = {
  'state-management': [
    {
      title: 'The Challenge',
      content: `Your task is to create a simple counter contract that persists state between calls.

**Requirements:**
- Store \`counter: u64\` in the contract state
- Implement \`new()\` constructor that initializes counter to 0
- Implement \`increment()\` change method that adds 1 to counter
- Implement \`get_counter()\` view method that returns the current counter value

**Test:**
Call increment multiple times, then call get_counter - the value should persist!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
State is what makes a smart contract different from a regular program. The data must survive between calls. You're storing a single number that changes over time.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    // What type for a counter?
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        // Initialize counter to 0
    }

    pub fn get_counter(&self) -> u64 {
        // Return the counter value
    }

    pub fn increment(&mut self) {
        // Add 1 to counter
    }
}
\`\`\`

**Solution Hints:**
- Use \`u64\` for the counter (unsigned 64-bit integer)
- Initialize: \`Self { counter: 0 }\`
- View (read): \`self.counter\` (no .clone() needed for numbers!)
- Change (write): \`self.counter += 1;\` or \`self.counter = self.counter + 1;\`

**Why u64? Why not i64?**
Unsigned means no negatives. Counters, balances, quantities - none of these should be negative. u64 goes from 0 to 18 quintillion. That's enough for basically anything. If you need negatives, use i64. But for a counter? u64 all the way.

And here's the Rust thing: primitive types like u64 COPY, they don't clone. So \`self.counter\` in a return statement just works. Strings? Those need \`.clone()\` because they're heap-allocated. Numbers are stack-local and cheap to copy.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/storage)`,
    },
  ],
};

export const getStateManagementDetailedExplanation = (exampleId) =>
  stateManagementDetailedExplanation[exampleId] ?? null;
