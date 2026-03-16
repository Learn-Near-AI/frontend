export const collectionsMapCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::store::IterableMap;
use near_sdk::{AccountId, PanicOnDefault, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Leaderboard,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    leaderboard: IterableMap<AccountId, u64>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            leaderboard: IterableMap::new(StorageKey::Leaderboard),
        }
    }

    pub fn set_score(&mut self, account: AccountId, score: u64) {
        self.leaderboard.insert(account, score);
    }

    pub fn get_score(&self, account: AccountId) -> Option<u64> {
        self.leaderboard.get(&account).copied()
    }

    pub fn get_top_scores(&self, limit: u64) -> Vec<(AccountId, u64)> {
        let mut scores: Vec<(AccountId, u64)> = self
            .leaderboard
            .iter()
            .map(|(k, v)| (k.clone(), *v))
            .collect();
        scores.sort_by(|a, b| b.1.cmp(&a.1));
        scores.into_iter().take(limit as usize).collect()
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::store::IterableMap;
use near_sdk::{AccountId, PanicOnDefault, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Leaderboard,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    leaderboard: IterableMap<AccountId, u64>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            leaderboard: IterableMap::new(StorageKey::Leaderboard),
        }
    }

    pub fn set_score(&mut self, account: AccountId, score: u64) {
        self.leaderboard.insert(account, score);
    }

    pub fn get_score(&self, account: AccountId) -> Option<u64> {
        self.leaderboard.get(&account).copied()
    }

    pub fn get_top_scores(&self, limit: u64) -> Vec<(AccountId, u64)> {
        let mut scores: Vec<(AccountId, u64)> = self
            .leaderboard
            .iter()
            .map(|(k, v)| (k.clone(), *v))
            .collect();
        scores.sort_by(|a, b| b.1.cmp(&a.1));
        scores.into_iter().take(limit as usize).collect()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_set_and_get_score() {
        let mut contract = Contract::new();
        let account: AccountId = "player.near".parse().unwrap();
        contract.set_score(account.clone(), 100);
        assert_eq!(contract.get_score(account), Some(100));
    }

    #[test]
    fn test_top_scores_order() {
        let mut contract = Contract::new();
        contract.set_score("alice.near".parse().unwrap(), 50);
        contract.set_score("bob.near".parse().unwrap(), 100);
        let top = contract.get_top_scores(2);
        assert_eq!(top[0].1, 100);
        assert_eq!(top[1].1, 50);
    }
}`,
};

export default collectionsMapCode;
