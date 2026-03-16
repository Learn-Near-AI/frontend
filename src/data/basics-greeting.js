export const greetingDetailedExplanation = {
  greeting: [
    {
      title: 'The Challenge',
      content: `Your task is to create a simple "Hello World" contract that returns a greeting string.

**Requirements:**
- Create a \`Contract\` struct with no state
- Implement \`new()\` constructor
- Implement a \`greet()\` view method that returns "Greetings, Adventurer!"

**Test:**
Run the code and verify it returns the greeting string!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
You need to build the simplest possible smart contract - one that just returns a greeting when called. No state needed, no complex logic. Just return a string.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn greet(&self) -> String {
        // What goes here?
    }
}
\`\`\`

**Solution Hint:**
The greet method needs to return a String. In Rust, you create strings using \`.to_string()\` on a string literal. So \`"Greetings, Adventurer!".to_string()\` gives you a String.

The key thing: view methods use \`&self\` (read-only, no gas fees), while change methods would use \`&mut self\`.

**Why this matters:**
This is the baseline. State adds complexity and storage costs. Start simple.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy)`,
    },
  ],
};

export const getGreetingDetailedExplanation = (exampleId) =>
  greetingDetailedExplanation[exampleId] ?? null;
