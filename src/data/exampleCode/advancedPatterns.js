// Advanced Patterns examples - Testing patterns for NEAR contracts
export const advancedPatternsCode = {
  'testing': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    counter: u64,
    owner_id: near_sdk::AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            counter: 0,
            owner_id: env::predecessor_account_id(),
        }
    }

    pub fn increment(&mut self) {
        // TODO: Assert caller is owner
        // TODO: Increment counter
        let _: u64 = ();
    }

    pub fn decrement(&mut self) {
        // TODO: Assert caller is owner
        // TODO: Check for underflow, then decrement
        let _: u64 = ();
    }

    pub fn get_counter(&self) -> u64 {
        // TODO: Return counter
        let _: u64 = ();
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context(predecessor: near_sdk::AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_initial_counter() {
        // TODO: Set up context, init contract, assert counter == 0
        let _: u64 = ();
    }

    #[test]
    fn test_increment() {
        // TODO: Set up context, init contract, increment, assert counter == 1
        let _: u64 = ();
    }

    #[test]
    #[should_panic(expected = "Only owner can call this method")]
    fn test_non_owner_cannot_increment() {
        // TODO: Set up context as non-owner, try to increment, should panic
        let _: u64 = ();
    }

    #[test]
    #[should_panic(expected = "Underflow: counter cannot go below 0")]
    fn test_decrement_underflow() {
        // TODO: Set up context, init contract, try to decrement from 0, should panic
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter, owner_id } = {}) {
    this.counter = counter ?? 0;
    this.owner_id = owner_id ?? near.predecessorAccountId();
  }

  @call({})
  increment() {
    // TODO: Assert caller is owner
    // TODO: Increment counter
  }

  @call({})
  decrement() {
    // TODO: Assert caller is owner
    // TODO: Check for underflow, then decrement
  }

  @view({})
  get_counter() {
    // TODO: Return counter
  }

  test_initial_counter() {
    // TODO: Similar to Rust tests — run in JS test framework
  }

  test_increment() {
    // TODO: Test increment logic
  }

  test_non_owner_cannot_increment() {
    // TODO: Test access control
  }

  test_decrement_underflow() {
    // TODO: Test underflow protection
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::{env, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    counter: u64,
    owner_id: near_sdk::AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            counter: 0,
            owner_id: env::predecessor_account_id(),
        }
    }

    pub fn increment(&mut self) {
        near_sdk::require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can call this method"
        );
        self.counter += 1;
    }

    pub fn decrement(&mut self) {
        near_sdk::require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can call this method"
        );
        near_sdk::require!(
            self.counter > 0,
            "Underflow: counter cannot go below 0"
        );
        self.counter -= 1;
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::testing_env;

    fn get_context(predecessor: near_sdk::AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_initial_counter() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let contract = Contract::new();
        assert_eq!(contract.get_counter(), 0, "Counter should start at 0");
    }

    #[test]
    fn test_increment() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let mut contract = Contract::new();
        contract.increment();
        assert_eq!(contract.get_counter(), 1, "Counter should be 1 after increment");
    }

    #[test]
    fn test_decrement() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let mut contract = Contract::new();
        contract.increment();
        contract.decrement();
        assert_eq!(contract.get_counter(), 0, "Counter should be 0 after increment then decrement");
    }

    #[test]
    #[should_panic(expected = "Only owner can call this method")]
    fn test_non_owner_cannot_increment() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        let bob: near_sdk::AccountId = "bob.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let mut contract = Contract::new();
        testing_env!(get_context(bob).build());
        contract.increment();
    }

    #[test]
    #[should_panic(expected = "Only owner can call this method")]
    fn test_non_owner_cannot_decrement() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        let bob: near_sdk::AccountId = "bob.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let mut contract = Contract::new();
        contract.increment();
        testing_env!(get_context(bob).build());
        contract.decrement();
    }

    #[test]
    #[should_panic(expected = "Underflow: counter cannot go below 0")]
    fn test_decrement_underflow() {
        let alice: near_sdk::AccountId = "alice.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let mut contract = Contract::new();
        contract.decrement();
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter, owner_id } = {}) {
    this.counter = counter ?? 0;
    this.owner_id = owner_id ?? near.predecessorAccountId();
  }

  @call({})
  increment() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can call this method");
    }
    this.counter++;
  }

  @call({})
  decrement() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can call this method");
    }
    if (this.counter === 0) {
      near.panic("Underflow: counter cannot go below 0");
    }
    this.counter--;
  }

  @view({})
  get_counter() {
    return this.counter;
  }
}

// Unit tests (run with NEAR JS SDK test framework):
// test_initial_counter: constructor, assert counter === 0
// test_increment: increment(), assert counter === 1
// test_decrement: increment(), decrement(), assert counter === 0
// test_non_owner_cannot_increment: set predecessor to non-owner, expect panic
// test_decrement_underflow: decrement from 0, expect panic`,
  },
};
