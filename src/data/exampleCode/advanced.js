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

    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        if b == 0 {
            env::panic_str("Division by zero");
        }
        Some(a / b)
    }

    pub fn assert_positive(&self, value: i64) {
        require!(value > 0, "Value must be positive");
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  safe_divide({ a, b }) {
    if (b === 0) {
      near.panic("Division by zero");
    }
    return a / b;
  }

  @call({})
  assert_positive({ value }) {
    if (value <= 0) {
      near.panic("Value must be positive");
    }
  }
}

`,
  },
  'event-patterns': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    balance: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { balance: 0 }
    }

    pub fn deposit(&mut self, amount: u64) {
        self.balance += amount;
        env::log_str(&format!(
            "EVENT_JSON:{{\\\"event\\\":\\\"Deposit\\\",\\\"account\\\":\\\"{}\\\",\\\"amount\\\":{}}}",
            env::predecessor_account_id(),
            amount
        ));
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ balance } = { balance: 0 }) {
    this.balance = balance;
  }

  @view({})
  get_balance() {
    return this.balance;
  }

  @call({})
  deposit({ amount }) {
    this.balance += amount;
    near.log(
      JSON.stringify({
        event: "Deposit",
        account: near.predecessorAccountId(),
        amount,
      })
    );
  }
}

`,
  },
  'initialization': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId};
use near_sdk::PanicOnDefault;

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
}`,
    JavaScript: `import { NearBindgen, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, initialized } = {}) {
    if (near.isInitialized()) {
      this.owner_id = owner_id || near.currentAccountId();
      this.initialized = initialized !== undefined ? initialized : true;
    } else {
      this.owner_id = owner_id || near.currentAccountId();
      this.initialized = true;
    }
  }
}

`,
  },
  'gas-optimization': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    // Store only minimal data on-chain to save gas
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { counter: 0 }
    }

    pub fn bulk_increment(&mut self, times: u32) {
        // Simple loop; in real code you should cap times to avoid out-of-gas
        for _ in 0..times {
            self.counter += 1;
        }
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter;
  }

  @view({})
  get_counter() {
    return this.counter;
  }

  @call({})
  bulk_increment({ times }) {
    // In production, always validate "times" to avoid excessive gas usage
    for (let i = 0; i < times; i += 1) {
      this.counter += 1;
    }
  }
}

`,
  },
  'complete-example': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
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
    next_id: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            tasks: UnorderedMap::new(b"t"),
            next_id: 1,
        }
    }

    pub fn add_task(&mut self, title: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can add tasks"
        );
        require!(title.len() > 0, "Title cannot be empty");
        
        let task = Task {
            id: self.next_id,
            title,
            completed: false,
            owner: self.owner_id.clone(),
        };
        self.tasks.insert(&self.next_id, &task);
        self.next_id += 1;
        
        env::log_str(&format!("Task {} added", task.id));
    }

    pub fn get_task(&self, id: u64) -> Option<(u64, String, bool, AccountId)> {
        self.tasks.get(&id).map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone()))
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
}

`,
  },
}

