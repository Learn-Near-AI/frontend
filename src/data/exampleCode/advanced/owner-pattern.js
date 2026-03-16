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

  JavaScriptExercise: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

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
};

export default ownerPatternCode;
