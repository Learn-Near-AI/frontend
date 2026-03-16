// Advanced patterns and testing examples
export const advancedCode = {
  'owner-pattern': {
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
        // TODO: Set owner_id to current_account_id (not predecessor!)
        Self {
            owner_id: env::current_account_id(),
            value: 0,
        }
    }

    // TODO: Implement set_value - owner only
    pub fn set_value(&mut self, value: u64) {
    }

    // TODO: Implement get_value - public view
    pub fn get_value(&self) -> u64 {
        0
    }

    // TODO: Implement transfer_ownership - owner only
    pub fn transfer_ownership(&mut self, new_owner: AccountId) {
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, value } = { owner_id: near.currentAccountId(), value: 0 }) {
    this.owner_id = owner_id;
    this.value = value;
  }

  // TODO: Implement setValue - owner only
  @call({})
  setValue({ value }) {
  }

  // TODO: Implement getValue - public view
  @view({})
  getValue() {
    return 0;
  }

  // TODO: Implement transferOwnership - owner only
  @call({})
  transferOwnership({ new_owner }) {
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
  constructor({ owner_id, value } = { owner_id: near.currentAccountId(), value: 0 }) {
    this.owner_id = owner_id;
    this.value = value;
  }

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
  },
  'pausable-contract': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            counter: 0,
        }
    }

    // TODO: pause - owner only, set paused = true
    pub fn pause(&mut self) {
    }

    // TODO: unpause - owner only, set paused = false
    pub fn unpause(&mut self) {
    }

    // TODO: increment - change method, panic if paused
    pub fn increment(&mut self) {
    }

    // TODO: get_counter - view, works even when paused
    pub fn get_counter(&self) -> u64 {
        0
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, counter } = { 
    owner_id: near.currentAccountId(), 
    paused: false, 
    counter: 0 
  }) {
    this.owner_id = owner_id;
    this.paused = paused;
    this.counter = counter;
  }

  // TODO: pause - owner only
  @call({})
  pause() {
  }

  // TODO: unpause - owner only
  @call({})
  unpause() {
  }

  // TODO: increment - panic if paused
  @call({})
  increment() {
  }

  // TODO: getCounter - works even when paused
  @view({})
  getCounter() {
    return 0;
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            counter: 0,
        }
    }

    pub fn pause(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.paused = true;
    }

    pub fn unpause(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.paused = false;
    }

    pub fn increment(&mut self) {
        require!(!self.paused, "Contract is paused");
        self.counter += 1;
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, counter } = { 
    owner_id: near.currentAccountId(), 
    paused: false, 
    counter: 0 
  }) {
    this.owner_id = owner_id;
    this.paused = paused;
    this.counter = counter;
  }

  @call({})
  pause() {
    require(near.predecessorAccountId() === this.owner_id, "Only owner");
    this.paused = true;
  }

  @call({})
  unpause() {
    require(near.predecessorAccountId() === this.owner_id, "Only owner");
    this.paused = false;
  }

  @call({})
  increment() {
    if (this.paused) near.panic("Contract is paused");
    this.counter += 1;
  }

  @view({})
  getCounter() {
    return this.counter;
  }
}`,
  },
  testing: {
    Rust: `use near_sdk::near;
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

    pub fn add(&self, a: u64, b: u64) -> u64 {
        a + b
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        let contract = Contract::new();
        assert_eq!(contract.add(2, 3), 5);
    }
}`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor() {}

  @view({})
  add({ a, b }) {
    return a + b;
  }
}
`,
  },
};
