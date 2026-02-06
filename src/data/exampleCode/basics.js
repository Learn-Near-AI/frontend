// Basic examples code - Foundation to Intermediate
export const basicsCode = {
  'hello-world': {
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

    pub fn hello_world(&self) -> String {
        "Hello, NEAR!".to_string()
    }
}`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  hello_world() {
    return "Hello, NEAR!";
  }
}

`,
  },
  'contract-structure': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, AccountId};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
        }
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id } = { owner_id: near.currentAccountId() }) {
    this.owner_id = owner_id;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }
}

`,
  },
  'view-methods': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    greeting: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            greeting: "hello".to_string(),
        }
    }

    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    pub fn get_greeting_length(&self) -> u64 {
        self.greeting.len() as u64
    }
}`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ greeting } = { greeting: "hello" }) {
    this.greeting = greeting;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @view({})
  get_greeting_length() {
    return this.greeting.length;
  }
}

`,
  },
  'change-methods': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    greeting: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            greeting: "hello".to_string(),
        }
    }

    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    pub fn set_greeting(&mut self, greeting: String) {
        self.greeting = greeting;
    }

    pub fn append_suffix(&mut self, suffix: String) {
        self.greeting.push_str(&suffix);
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ greeting } = { greeting: "hello" }) {
    this.greeting = greeting;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ greeting }) {
    near.log(\`Setting greeting to \${greeting}\`);
    this.greeting = greeting;
  }

  @call({})
  append_suffix({ suffix }) {
    this.greeting = this.greeting + suffix;
  }
}

`,
  },
  'state-management': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { counter: 0 }
    }

    pub fn increment(&mut self) {
        self.counter += 1;
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
  increment() {
    this.counter += 1;
  }
}

`,
  },
  'input-validation': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            message: String::new(),
        }
    }

    pub fn set_message(&mut self, message: String) {
        require!(message.len() > 0, "Message cannot be empty");
        require!(message.len() <= 100, "Message too long (max 100 chars)");
        self.message = message;
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "" }) {
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @call({})
  set_message({ message }) {
    if (message.length === 0) {
      near.panic("Message cannot be empty");
    }
    if (message.length > 100) {
      near.panic("Message too long (max 100 chars)");
    }
    this.message = message;
  }
}

`,
  },
  'error-handling': {
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

    /// Returns Option - graceful handling for expected failures
    pub fn try_parse_number(&self, s: String) -> Option<u64> {
        s.parse().ok()
    }

    /// Returns None on division by zero instead of panicking
    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        if b == 0 { return None; }
        Some(a / b)
    }

    /// Uses unwrap_or for fallback when Option is None
    pub fn parse_with_default(&self, s: String, default: u64) -> u64 {
        s.parse().unwrap_or(default)
    }

    /// Panic for unrecoverable errors - use require! for clear messages
    pub fn assert_positive(&self, value: i64) {
        require!(value > 0, "Value must be positive");
    }

    /// Demonstrates env::panic_str for critical failures
    pub fn strict_check(&self, value: u64) {
        if value == 0 {
            env::panic_str("ZERO_NOT_ALLOWED");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_try_parse_number() {
        let contract = Contract::new();
        assert_eq!(contract.try_parse_number("42".to_string()), Some(42));
        assert_eq!(contract.try_parse_number("abc".to_string()), None);
    }

    #[test]
    fn test_safe_divide() {
        let contract = Contract::new();
        assert_eq!(contract.safe_divide(10, 2), Some(5));
        assert_eq!(contract.safe_divide(10, 0), None);
    }

    #[test]
    fn test_parse_with_default() {
        let contract = Contract::new();
        assert_eq!(contract.parse_with_default("10".to_string(), 0), 10);
        assert_eq!(contract.parse_with_default("x".to_string(), 99), 99);
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  try_parse_number({ s }) {
    const n = parseInt(s, 10);
    return isNaN(n) ? null : n;
  }

  @view({})
  safe_divide({ a, b }) {
    if (b === 0) return null;
    return a / b;
  }

  @view({})
  parse_with_default({ s, default: d }) {
    const n = parseInt(s, 10);
    return isNaN(n) ? d : n;
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
  'events': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::env;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            message: "initial".to_string(),
        }
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    pub fn set_message(&mut self, message: String) {
        let json = format!(
            r#"{{"standard":"example","version":"1.0.0","event":"MessageUpdated","data":{{"new_message":"{}"}}}}"#,
            message.replace('"', "\\\"")
        );
        env::log_str(&format!("EVENT_JSON:{}", json));
        self.message = message;
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "initial" }) {
    this.message = message;
  }

  @call({})
  set_message({ message }) {
    const event = {
      standard: "example",
      version: "1.0.0",
      event: "MessageUpdated",
      data: { new_message: message },
    };
    near.log("EVENT_JSON:" + JSON.stringify(event));
    this.message = message;
  }
}

`,
  },
  'collections-vector': {
    Rust: `// Vector + storage keys: unique prefixes (b"i", b"t") namespace collections to avoid collisions
use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,   // prefix b"i"
    tags: Vector<String>,    // prefix b"t" - different key, no collision
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(b"i"),
            tags: Vector::new(b"t"),
        }
    }

    pub fn add_item(&mut self, item: String) {
        self.items.push(&item);
    }

    pub fn add_tag(&mut self, tag: String) {
        self.tags.push(&tag);
    }

    pub fn remove_item(&mut self, index: u64) {
        require!(index < self.items.len(), "Index out of bounds");
        self.items.swap_remove(index);
    }

    pub fn get_item(&self, index: u64) -> Option<String> {
        self.items.get(index)
    }

    pub fn get_items(&self) -> Vec<String> {
        self.items.iter().collect()
    }

    pub fn get_tags(&self) -> Vec<String> {
        self.tags.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items, tags } = { items: [], tags: [] }) {
    this.items = items || [];
    this.tags = tags || [];
  }

  @view({})
  get_item({ index }) {
    return this.items[index] || null;
  }

  @view({})
  get_items() {
    return this.items;
  }

  @view({})
  get_tags() {
    return this.tags;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }

  @call({})
  add_tag({ tag }) {
    this.tags.push(tag);
  }

  @call({})
  remove_item({ index }) {
    if (index >= this.items.length) near.panic("Index out of bounds");
    // swap_remove: swap with last, then pop (O(1) like Rust)
    [this.items[index], this.items[this.items.length - 1]] = [this.items[this.items.length - 1], this.items[index]];
    this.items.pop();
  }
}

`,
  },
  'collections-map': {
    Rust: `use near_sdk::near;
use near_sdk::AccountId;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    balances: UnorderedMap<AccountId, u64>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            balances: UnorderedMap::new(b"b"),
        }
    }

    pub fn set_balance(&mut self, account: AccountId, amount: u64) {
        self.balances.insert(&account, &amount);
    }

    pub fn remove_balance(&mut self, account: AccountId) {
        self.balances.remove(&account);
    }

    pub fn get_balance(&self, account: AccountId) -> Option<u64> {
        self.balances.get(&account)
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ balances } = { balances: {} }) {
    this.balances = balances || {};
  }

  @view({})
  get_balance({ account }) {
    return this.balances[account] ?? null;
  }

  @call({})
  set_balance({ account, amount }) {
    this.balances[account] = amount;
  }

  @call({})
  remove_balance({ account }) {
    delete this.balances[account];
  }
}

`,
  },
}

