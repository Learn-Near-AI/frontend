export const inputValidationDetailedExplanation = {
  'input-validation': [
    {
      title: 'Meet The Gatekeeper!',
      content: `DeFi protocols validate deposit amounts before processing transactions.

Every good castle has a **gatekeeper** - the person who checks who's allowed in and what they're carrying.

In your contracts, YOU are the gatekeeper. You decide what data gets in and what gets rejected.

Why does this matter? Because on the blockchain, anyone can call your contract. Nice users. Mean users. Curious hackers. You need to check EVERYTHING.

**What you'll build:**
A message board where users can set a message - but with rules! Messages must be 1-100 characters.`,
    },
    {
      title: 'Common Guard Patterns',
      content: `Here are moves every gatekeeper should know:

**Check if empty (using length):**
\`\`\`rust
require!(string.len() > 0, "Required field");
\`\`\`

**Check the size:**
\`\`\`rust
require!(amount <= max_limit, "Too big!");
\`\`\`

**Check for valid numbers:**
\`\`\`rust
require!(value > 0, "Must be positive");
\`\`\`

**Check account IDs:**
For account IDs, use NEAR's built-in validation — no manual string checks needed! You'll see this in the Owner Pattern lesson.

**The pattern:**
\`require!(condition, "error message")\`

If condition is false → panic with message!
If condition is true → continue normally`,
    },
    {
      title: "Don't Do This!",
      content: `What if you accepted ANY input?

\`\`\`rust
// BAD: No validation!
pub fn set_message(&mut self, message: String) {
    // Accepts empty strings
    // Accepts 1 million characters
    // Accepts anything!
    self.message = message;
}
\`\`\`

**The problem:**
- Empty messages clutter your app
- Massive strings eat storage
- Hackers can exploit bad data
- Contract becomes unreliable

Always validate input!`,
    },
    {
      title: 'The Contract Setup',
      content: `First, let's set up the contract with state:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,      // The message users set
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            message: String::new(),  // Same as "".to_string()
        }
    }

    // View method - read the message
    pub fn get_message(&self) -> String {
        self.message.clone()
    }
}
\`\`\`

**Note:** \`String::new()\` is just Rust's way of creating an empty string — same thing as \`"".to_string()\` that you saw in earlier lessons.

We have a simple message field and a getter. Now let's add the validation!`,
    },
    {
      title: 'Why Validation Matters',
      content: `On the blockchain, validation is your best friend:

**Security:**
- Prevent hackers from injecting malicious data
- Stop users from breaking your contract's logic
- Protect user funds

**Data Quality:**
- No empty messages cluttering your app
- No massive strings eating up storage
- Consistent data makes your app reliable

**Cost Savings:**
- Validation happens BEFORE saving
- Invalid data doesn't get stored
- Saves users gas!

**Your turn:**
Try setting an empty message or one that's too long. See how the contract protects itself!`,
    },
    {
      title: 'The Guard Code - Using require!',
      content: `Here's how you guard your contract:

\`\`\`rust
// Change method with validation
pub fn set_message(&mut self, message: String) {
    // Validate: message must be non-empty
    require!(message.len() > 0, "Message cannot be empty");
    // Validate: message must be at most 100 characters
    require!(message.len() <= 100, "Message too long (max 100 chars)");
    
    // If we get here, the validation passed!
    self.message = message;
}
\`\`\`

**How require! works:**
- If the check FAILS, the whole transaction stops
- The error message tells the user what went wrong
- Nothing gets saved to state
- The user loses the gas they spent (fair!)

It's like the gatekeeper saying "Sorry, that won't fit through the gate!"

**Why require!?**
It's the standard way to validate in Rust NEAR contracts. Simple, clear, and stops bad data before it gets saved!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/security/welcome)`,
    },
  ],
};

export const getInputValidationDetailedExplanation = (exampleId) =>
  inputValidationDetailedExplanation[exampleId] ?? null;
