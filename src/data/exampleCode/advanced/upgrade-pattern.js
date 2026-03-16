export const upgradePatternCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    data_version: u32,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 1,
            value: 0,
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

    pub fn migrate(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.data_version += 1;
    }

    pub fn set_value(&mut self, value: u64) {
        require!(!self.paused, "Contract is paused");
        self.value = value;
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }
}

// Separate upgrade function - outside impl block
// Use: near deploy --wasm-file new.wasm --init-function upgrade --init-args '{}'
#[init(ignore_state)]
pub fn upgrade() -> Contract {
    Contract {
        owner_id: env::current_account_id(),
        paused: false,
        data_version: 2,
        value: 0,
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    data_version: u32,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 1,
            value: 0,
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

    pub fn migrate(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.data_version += 1;
    }

    pub fn set_value(&mut self, value: u64) {
        require!(!self.paused, "Contract is paused");
        self.value = value;
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }

    pub fn get_version(&self) -> u32 {
        self.data_version
    }
}

// upgrade() is outside the impl block. #[init(ignore_state)] bypasses
// state deserialization so new code can deploy even if struct shape changed.
// Deploy with: near deploy --wasm-file new.wasm --init-function upgrade --init-args '{}'
#[init(ignore_state)]
pub fn upgrade() -> Contract {
    Contract {
        owner_id: env::current_account_id(),
        paused: false,
        data_version: 2,
        value: 0,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    #[should_panic(expected = "Contract is paused")]
    fn test_set_value_while_paused() {
        let mut contract = Contract::new();
        contract.pause();
        contract.set_value(99);
    }

    #[test]
    fn test_migrate_increments_version() {
        let mut contract = Contract::new();
        assert_eq!(contract.get_version(), 1);
        contract.migrate();
        assert_eq!(contract.get_version(), 2);
    }
}`,
};

export default upgradePatternCode;
