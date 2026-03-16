export const pausableContractCode = {
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
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_increment_when_active() {
        let mut contract = Contract::new();
        contract.increment();
        assert_eq!(contract.get_counter(), 1);
    }

    #[test]
    #[should_panic(expected = "Contract is paused")]
    fn test_increment_when_paused() {
        let mut contract = Contract::new();
        contract.pause();
        contract.increment();
    }
}`,
};

export default pausableContractCode;
