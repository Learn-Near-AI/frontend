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
        // TODO: insert account and score into leaderboard
    }

    pub fn get_score(&self, account: AccountId) -> Option<u64> {
        // TODO: return the score for account, or None if not found
        None
    }

    pub fn get_top_scores(&self, limit: u64) -> Vec<(AccountId, u64)> {
        // TODO: get all scores, sort by score descending, return top 'limit' results
        vec![]
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

  JavaScriptExercise: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ leaderboard } = { leaderboard: {} }) {
    this.leaderboard = leaderboard || {};
  }

  @call({})
  set_score({ account, score }) {
    // TODO: set this.leaderboard[account] = score
  }

  @view({})
  get_score({ account }) {
    // TODO: return this.leaderboard[account] or null
    return null;
  }

  @view({})
  get_top_scores({ limit }) {
    // TODO: get all entries, sort by score descending, return top 'limit'
    return [];
  }
}`,

  JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ leaderboard } = { leaderboard: {} }) {
    this.leaderboard = leaderboard || {};
  }

  @call({})
  set_score({ account, score }) {
    this.leaderboard[account] = score;
  }

  @view({})
  get_score({ account }) {
    return this.leaderboard[account] ?? null;
  }

  @view({})
  get_top_scores({ limit }) {
    const entries = Object.entries(this.leaderboard);
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, limit).map(([account, score]) => [account, score]);
  }
}`,

  TheChallenge: `Your task is to implement a leaderboard using IterableMap.

**Requirements:**
- Store \`leaderboard: IterableMap<AccountId, u64>\` using StorageKey enum
- Implement \`set_score(account: AccountId, score: u64)\` - inserts or updates score
- Implement \`get_score(account: AccountId) -> Option<u64>\` - returns score or None
- Implement \`get_top_scores(limit: u64) -> Vec<(AccountId, u64>\` - returns sorted top scores (highest first)

**Test:** Set multiple scores, verify get_top_scores returns them in descending order`,

  Hints: `**The Problem:**
You need to store key-value pairs (account -> score) and retrieve top scores sorted by value.

**Code Snippet:**
\`\`\`rust
use near_sdk::store::IterableMap;
use near_sdk::{AccountId, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Leaderboard,
}

pub struct Contract {
    leaderboard: IterableMap<AccountId, u64>,
}
\`\`\`

**Solution Hints:**
- Insert: \`self.leaderboard.insert(account, score)\`
- Get: \`self.leaderboard.get(&account).copied()\` returns Option<u64>
- Get all and sort: \`self.leaderboard.iter().map(|(k,v)| (k.clone(), *v)).collect::<Vec<_>>()\`
- Sort descending: \`.sort_by(|a, b| b.1.cmp(&a.1))\`
- Take top: \`.take(limit as usize).collect()\`

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/collections#unorderedmap)`,
};

export default collectionsMapCode;
