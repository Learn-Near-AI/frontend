export const ownerPatternCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            value: 0,
        }
    }

    pub fn set_value(&mut self, value: u64) {
        // TODO: Require caller is owner
        // TODO: Set self.value to value
        todo!()
    }

    pub fn get_value(&self) -> u64 {
        // TODO: Return self.value
        todo!()
    }

    pub fn transfer_ownership(&mut self, new_owner: AccountId) {
        // TODO: Require caller is owner
        // TODO: Update owner_id to new_owner
        todo!()
    }
}`,

  JavaScriptExercise: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  owner_id = near.currentAccountId();
  value = 0;

  @call({})
  setValue({ value }) {
    // TODO: require caller is owner, then set this.value
  }

  @view({})
  getValue() {
    // TODO: return this.value
    return 0;
  }

  @call({})
  transferOwnership({ new_owner }) {
    // TODO: require caller is owner, then update this.owner_id
  }
}`,

  Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            value: 0,
        }
    }

    pub fn set_value(&mut self, value: u64) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.value = value;
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }

    pub fn transfer_ownership(&mut self, new_owner: AccountId) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.owner_id = new_owner;
    }
}`,

  JavaScript: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  owner_id = near.currentAccountId();
  value = 0;

  @call({})
  setValue({ value }) {
    require(near.predecessorAccountId() === this.owner_id, "Only owner");
    this.value = value;
  }

  @view({})
  getValue() {
    return this.value;
  }

  @call({})
  transferOwnership({ new_owner }) {
    require(near.predecessorAccountId() === this.owner_id, "Only owner");
    this.owner_id = new_owner;
  }
}`,

  TheChallenge: `Your task is to implement an owner pattern contract.

**Requirements:**
- Store \`owner_id: AccountId\` and \`value: u64\`
- Implement \`new()\` - sets owner to current account
- Implement \`set_value(value: u64)\` - owner only
- Implement \`get_value() -> u64\` - public view
- Implement \`transfer_ownership(new_owner: AccountId)\` - owner only

**Test:** Only owner can set_value and transfer_ownership`,

  Hints: `**The Problem:**
You need to restrict certain methods to only the contract owner.

**Solution Hints:**
- Get current account: \`env::current_account_id()\` (Rust) / \`near.currentAccountId()\` (JS)
- Get predecessor: \`env::predecessor_account_id()\` (Rust) / \`near.predecessorAccountId()\` (JS)
- Require: \`require!(condition, "error message")\` (Rust) / \`require(condition, "error message")\` (JS)

**Rust:**
\`\`\`rust
require!(env::predecessor_account_id() == self.owner_id, "Only owner");
\`\`\`

**JavaScript:**
\`\`\`javascript
require(near.predecessorAccountId() === this.owner_id, "Only owner");
\`\`\`

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/access-control)`,
};

export default ownerPatternCode;
