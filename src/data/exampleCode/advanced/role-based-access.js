export const roleBasedAccessCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    admins: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(b"ow");
        owners.insert(&initial_owner);
        Self {
            owners,
            admins: UnorderedSet::new(b"ad"),
        }
    }

    pub fn add_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.owners.insert(&account);
    }

    pub fn remove_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        require!(self.owners.len() > 1, "Cannot remove last owner");
        self.owners.remove(&account);
    }

    pub fn add_admin(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.admins.insert(&account);
    }

    pub fn admin_only_action(&mut self) {
        require!(self.is_admin(&env::predecessor_account_id()), "Admin or owner only");
    }

    pub fn get_owners(&self) -> Vec<AccountId> {
        self.owners.to_vec()
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    admins: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(b"ow");
        owners.insert(&initial_owner);
        Self {
            owners,
            admins: UnorderedSet::new(b"ad"),
        }
    }

    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    fn is_admin(&self, account: &AccountId) -> bool {
        self.admins.contains(account) || self.is_owner(account)
    }

    pub fn add_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.owners.insert(&account);
    }

    pub fn remove_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        require!(self.owners.len() > 1, "Cannot remove last owner");
        self.owners.remove(&account);
    }

    pub fn add_admin(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.admins.insert(&account);
    }

    pub fn admin_only_action(&mut self) {
        require!(self.is_admin(&env::predecessor_account_id()), "Admin or owner only");
    }

    pub fn get_owners(&self) -> Vec<AccountId> {
        self.owners.to_vec()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initial_owner() {
        let owner: AccountId = "owner.near".parse().unwrap();
        let contract = Contract::new(owner.clone());
        assert!(contract.is_owner(&owner));
    }

    #[test]
    #[should_panic(expected = "Cannot remove last owner")]
    fn test_cannot_remove_last_owner() {
        let owner: AccountId = "owner.near".parse().unwrap();
        let mut contract = Contract::new(owner.clone());
        contract.remove_owner(owner);
    }
}`,
};

export default roleBasedAccessCode;
