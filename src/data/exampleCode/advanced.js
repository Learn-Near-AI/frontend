// Advanced patterns and testing examples
export const advancedCode = {
  'testing': {
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

    #[test]
    fn test_add_zero() {
        let contract = Contract::new();
        assert_eq!(contract.add(0, 0), 0);
    }
}`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  add({ a, b }) {
    return a + b;
  }
}

`,
  },
  'panic-handling': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Returns None on division by zero instead of panicking
    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        if b == 0 {
            return None;
        }
        Some(a / b)
    }

    /// Panics with a clear message - use for unrecoverable errors
    pub fn assert_positive(&self, value: i64) {
        require!(value > 0, "Value must be positive");
    }

    /// Demonstrates env::panic_str for critical failures
    pub fn strict_check(&self, value: u64) {
        if value == 0 {
            env::panic_str("ZERO_NOT_ALLOWED");
        }
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  safe_divide({ a, b }) {
    if (b === 0) return null;
    return a / b;
  }

  @call({})
  assert_positive({ value }) {
    if (value <= 0) near.panic("Value must be positive");
  }

  @call({})
  strict_check({ value }) {
    if (value === 0) near.panic("ZERO_NOT_ALLOWED");
  }
}

`,
  },
  'initialization': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

/// PanicOnDefault: contract panics if deserialized without explicit init.
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    initialized: bool,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            initialized: true,
        }
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }

    pub fn is_initialized(&self) -> bool {
        self.initialized
    }

    /// Migration: run after code upgrade. Owner-only; use for schema changes.
    pub fn migrate(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner can migrate");
        self.initialized = true;
        env::log_str("Migration complete");
    }
}`,
    JavaScript: `import { NearBindgen, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, initialized } = {
    owner_id: near.currentAccountId(),
    initialized: true
  }) {
    this.owner_id = owner_id ?? near.currentAccountId();
    this.initialized = initialized ?? true;
  }
}

`,
  },
  'gas-optimization': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault};

const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { items: Vector::new(b"i") }
    }

    /// Gas optimization: batch inserts instead of many single-item calls
    pub fn add_many(&mut self, new_items: Vec<String>) {
        require!(new_items.len() <= MAX_BATCH as usize, "Batch too large");
        for item in new_items {
            self.items.push(&item);
        }
    }

    pub fn len(&self) -> u64 {
        self.items.len()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

const MAX_BATCH = 100;

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  len() {
    return this.items.length;
  }

  @call({})
  add_many({ new_items }) {
    if (new_items.length > MAX_BATCH) near.panic("Batch too large");
    for (const item of new_items) {
      this.items.push(item);
    }
  }
}

`,
  },
  'complete-example': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Task {
    id: u64,
    title: String,
    completed: bool,
    owner: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    tasks: UnorderedMap<u64, Task>,
    task_ids: Vector<u64>,
    next_id: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            tasks: UnorderedMap::new(b"t"),
            task_ids: Vector::new(b"i"),
            next_id: 1,
        }
    }

    pub fn add_task(&mut self, title: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can add tasks"
        );
        require!(title.len() > 0, "Title cannot be empty");
        
        let id = self.next_id;
        let task = Task {
            id,
            title,
            completed: false,
            owner: self.owner_id.clone(),
        };
        self.tasks.insert(&id, &task);
        self.task_ids.push(&id);
        self.next_id += 1;
        
        env::log_str(&format!("Task {} added", id));
    }

    pub fn complete_task(&mut self, id: u64) {
        let mut task = self.tasks.get(&id).expect("Task not found");
        require!(task.owner == env::predecessor_account_id(), "Not owner");
        task.completed = true;
        self.tasks.insert(&id, &task);
    }

    pub fn delete_task(&mut self, id: u64) {
        let task = self.tasks.get(&id).expect("Task not found");
        require!(task.owner == env::predecessor_account_id(), "Not owner");
        self.tasks.remove(&id);
        let idx = self.task_ids.iter().position(|&i| i == id).expect("Task id not in list") as u64;
        self.task_ids.swap_remove(idx);
    }

    pub fn get_task(&self, id: u64) -> Option<(u64, String, bool, AccountId)> {
        self.tasks.get(&id).map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone()))
    }

    pub fn get_task_ids(&self) -> Vec<u64> {
        self.task_ids.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, tasks, next_id } = {
    owner_id: near.currentAccountId(),
    tasks: {},
    next_id: 1
  }) {
    this.owner_id = owner_id;
    this.tasks = tasks || {};
    this.next_id = next_id;
  }

  @view({})
  get_task({ id }) {
    return this.tasks[id] || null;
  }

  @call({})
  add_task({ title }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can add tasks");
    }
    if (title.length === 0) {
      near.panic("Title cannot be empty");
    }
    
    const task = {
      id: this.next_id,
      title,
      completed: false,
      owner: this.owner_id,
    };
    this.tasks[this.next_id] = task;
    this.next_id += 1;
    
    near.log(\`Task \${task.id} added\`);
  }

  @call({})
  complete_task({ id }) {
    const task = this.tasks[id];
    if (!task) near.panic("Task not found");
    if (task.owner !== near.predecessorAccountId()) near.panic("Not owner");
    this.tasks[id] = { ...task, completed: true };
  }

  @call({})
  delete_task({ id }) {
    const task = this.tasks[id];
    if (!task) near.panic("Task not found");
    if (task.owner !== near.predecessorAccountId()) near.panic("Not owner");
    delete this.tasks[id];
  }
}

`,
  },
}

