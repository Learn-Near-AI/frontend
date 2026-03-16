export const inputValidationDetailedExplanation = {
  'input-validation': [
    {
      title: 'The Challenge',
      content: `Your task is to create a message board contract with input validation.

**Requirements:**
- Store \`message: String\` in the contract state
- Implement \`get_message()\` view method
- Implement \`set_message(message: String)\` change method with validation:
  - Message must be non-empty (length > 0)
  - Message must be at most 100 characters

**Test:**
Try setting an empty message or a message over 100 chars - it should reject them!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
Your contract will be attacked. Not might be attacked - WILL be attacked. Anyone can call your functions. You need to reject bad input BEFORE it gets stored.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::require;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,  // ← stored message
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            message: String::new(),  // ← empty string ""
        }
    }

    pub fn get_message(&self) -> String {  // ← view: &self
        self.message.clone()
    }

    pub fn set_message(&mut self, message: String) {  // ← change: &mut self
        require!(message.len() > 0, "Message cannot be empty");      // ← CHECK 1
        require!(message.len() <= 100, "Message too long (max 100)"); // ← CHECK 2
        self.message = message;  // ← STORE only if valid
    }
}
\`\`\`

**Key patterns:**
- Validation ALWAYS before storing
- require! stops execution if false
- .len() returns string length
- Validation runs FIRST, before any state change

**The security mindset:**
Your contract lives on a public blockchain. Everyone can call it. Everyone. The nice user from reddit. The curious beginner. The malicious hacker looking for vulnerabilities.

Validation isn't optional - it's your first line of defense. And the beautiful thing about require! is it runs BEFORE any state change. If validation fails, nothing gets saved, nothing gets modified. Clean failure.

And the 100 character limit? That's not arbitrary. Every character stored costs real money (storage staking). Let someone store 1MB and your contract becomes expensive to maintain. Limits protect you from resource exhaustion.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/security/welcome)`,
    },
  ],
};

export const getInputValidationDetailedExplanation = (exampleId) =>
  inputValidationDetailedExplanation[exampleId] ?? null;
