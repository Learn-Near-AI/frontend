export const methodsDetailedExplanation = {
  'view-methods': [
    {
      title: 'The Challenge',
      content: `Your task is to create a contract with user-specific greetings using a LookupMap.

**Requirements:**
- Store \`default_greeting: String\` and \`user_greetings: LookupMap<AccountId, String>\`
- Implement \`get_greeting(account: AccountId)\` - returns account's greeting or default
- Implement \`get_default_greeting_length()\` - returns length of default greeting
- Implement \`has_custom_greeting(account: AccountId)\` - checks if user has custom greeting

**Hint:** Use \`LookupMap::get()\` to retrieve stored values. Pass account as a parameter since view methods don't have a reliable predecessor.`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
You need per-user data storage. Everyone should get the default greeting UNLESS they've set their own. This is the foundation for any app with user accounts.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    default_greeting: String,
    user_greetings: LookupMap<AccountId, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            default_greeting: "Hello, NEAR explorer!".to_string(),
            user_greetings: LookupMap::new(b"g"),
        }
    }

    pub fn get_greeting(&self, account: AccountId) -> String {
        // How to lookup in map? How to fallback to default?
    }

    pub fn get_default_greeting_length(&self) -> u64 {
        // Length of the default string
    }

    pub fn has_custom_greeting(&self, account: AccountId) -> bool {
        // Check if account exists in map
    }
}
\`\`\`

**Solution Hints:**
- In view methods: pass account as a parameter (predecessor_account_id returns contract ID, not caller)
- LookupMap::get(&key) returns Option<T>
- Fallback: \`.unwrap_or_else(|| default.clone())\`
- String length: \`.len() as u64\`
- Check key existence: \`.contains_key(&key)\`

**Common pitfall:**
\`env::predecessor_account_id()\` returns the contract ID in view methods (no transaction signer), not the caller. Use a parameter instead.

---

[Learn more about this topic →](https://docs.near.org/build/smart-contracts/protocol/architecture)`,
    },
  ],
  'change-methods': [
    {
      title: 'The Challenge',
      content: `Your task is to create owner-protected change methods for message management.

**Requirements:**
- Store \`owner_id: AccountId\` and \`message: String\`
- Implement \`set_message(new_message: String)\` - owner only, validates non-empty
- Implement \`append_to_message(addition: String)\` - owner only, validates non-empty  
- Implement \`reset_message()\` - owner only, resets to default
- All change methods should use \`require!\` for access control

**Test:**
Only the owner should be able to modify the message!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
Change methods modify state. They cost gas. They need protection. You need THREE methods that all do access control the same way.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::{env, require, AccountId, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    message: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_message: Option<String>) -> Self {
        Self {
            owner_id: env::predecessor_account_id(),
            message: initial_message.unwrap_or_else(|| "Welcome, traveler!".to_string()),
        }
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    pub fn set_message(&mut self, new_message: String) {
        // require! for access control
        // require! for validation
        // update state
    }

    pub fn append_to_message(&mut self, addition: String) {
        // Same pattern - access control + validation + modify
    }

    pub fn reset_message(&mut self) {
        // Access control only, reset to default
    }
}
\`\`\`

**Solution Hints:**
- Access: \`require!(env::predecessor_account_id() == self.owner_id, "Only the owner can...")\`
- Validation: \`require!(!new_message.is_empty(), "Message cannot be empty")\`
- Append: \`self.message.push_str(&addition)\`
- Reset: \`self.message = "Welcome, traveler!".to_string()\`

**Storage costs:**
Stored data costs gas. \`require!\` checks run before state changes, so invalid data incurs no storage cost.

---

[Learn more about this topic →](https://docs.near.org/build/smart-contracts/protocol/architecture)`,
    },
  ],
};

export const getMethodsDetailedExplanation = (exampleId) =>
  methodsDetailedExplanation[exampleId] ?? null;
