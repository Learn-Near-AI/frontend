export const contractStructureDetailedExplanation = {
  'contract-structure': [
    {
      title: 'The Challenge',
      content: `Your task is to create a contract with owner control and greeting management.

**Requirements:**
- Store \`owner_id: AccountId\` and \`greeting: String\` in the contract state
- Implement \`new(initial_greeting: Option<String>)\` to set the deployer as owner
- Implement \`get_owner()\` and \`get_greeting()\` view methods
- Implement \`set_greeting(new_greeting: String)\` that ONLY the owner can call

**Test:**
After implementation, only the owner should be able to change the greeting!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
You need two pieces of state (owner and greeting), a constructor that sets the deployer as owner, read methods anyone can call, and a write method only the owner can use.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::require;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    // What fields go here?
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_greeting: Option<String>) -> Self {
        // How do you set the owner?
        // How do you handle the optional greeting?
    }

    pub fn get_owner(&self) -> AccountId {
        // Return the owner
    }

    pub fn get_greeting(&self) -> String {
        // Return the greeting
    }

    pub fn set_greeting(&mut self, new_greeting: String) {
        // How do you check if caller is owner?
        // How do you validate non-empty?
        // How do you store it?
    }
}
\`\`\`

**Solution Hints:**
- Owner: use \`env::predecessor_account_id()\` in new() to get whoever deployed the contract
- Access control: \`require!(env::predecessor_account_id() == self.owner_id, "message")\`
- Validation: \`require!(!new_greeting.is_empty(), "message")\`
- View methods use \`&self\`, change methods use \`&mut self\`
- Return strings with \`.clone()\`

**Common confusion:**
\`predecessor_account_id()\` vs \`current_account_id()\`. In new(), predecessor is the deployer. Using current_account_id() makes the contract itself the owner. 

Empty string validation prevents setting greeting to "", which could break downstream logic.

---

[Learn more about this topic →](https://docs.near.org/build/smart-contracts/anatomy)`,
    },
  ],
};

export const getContractStructureDetailedExplanation = (exampleId) =>
  contractStructureDetailedExplanation[exampleId] ?? null;
