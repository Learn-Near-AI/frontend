// Basic examples code - Foundation to Intermediate
export const basicsCode = {
  intro: {
    Intro: `═══════════════════════════════════════════════════════════════
  WELCOME TO NEARbyExample — Your Adventure Awaits!
  ════════════════════════════════════════════════════════════════

  Imagine a digital universe where you build things that last forever.
  That's NEARbyExample — your personal quest to master NEAR smart contracts!

  We've crafted a learning path just for you. Think of it like unlocking
  new levels in a game — each example builds on the last, and you'll
  gain new powers (skills) along the way.

  Ready to begin? Let's go!

  ════════════════════════════════════════════════════════════════
  THE BASICS ⚔️ — Start Your Quest Here!
  ════════════════════════════════════════════════════════════════

  These are your first dungeons. Master them to unlock the Advanced
  world. Each one teaches something essential:

    1. Greetings             — Meet your first robot friend
    2. Contract Structure    — Build your base of operations
    3. View Methods          — Scout ahead and observe (free!)
    4. Change Methods        — Start crafting and modifying
    5. State Management      — Your inventory system
    6. Input Validation      — The gatekeeper stands guard
    7. Error Handling        — Build your safety net
    8. Collections           — Unlock the treasure chest

  ════════════════════════════════════════════════════════════════
  ADVANCED 🛡️ — For Brave Explorers
  ════════════════════════════════════════════════════════════════

  Conquered the basics? The advanced world opens up:

    9. Collections: Map  — Scoreboards & leaderboards
   10. Events            — The town crier announces news
   11. Owner Pattern     — Castle guard for your contracts
   12. Role-Based Access — Guilds with different powers
   13. Pausable Contract — The big red button
   14. Multi-Signature   — Need multiple heroes to agree
   15. Upgrade Pattern   — Magic code that evolves

  ════════════════════════════════════════════════════════════════
  UNDER DEVELOPMENT 🚧 — Coming Soon!
  ════════════════════════════════════════════════════════════════

  More dungeons are being built:

    • Collections & Data     — Todo lists, voting, marketplaces
    • NFTs                   — Digital collectibles & marketplaces
    • Cross-Contract         — Team up with other contracts
    • Chain Signatures       — Sign messages for other chains
    • Indexing               — Listen for events
    • Advanced Patterns     — Unit testing & more

  We're building these as fast as we can. Check back often!

  ════════════════════════════════════════════════════════════════

  Pick "Greetings" from the sidebar to begin your quest.
  Each example has Rust and JavaScript versions — choose your weapon!
  Try the code, break it, fix it — that's how heroes are made.

  See you in NEARbyExample, adventurer!
`,
  },
  greeting: {
    RustExercise: `use near_sdk::near;
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

    pub fn greet(&self) -> String {
        // Return the greeting string that the test expects.
        ()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  hello_world() {
    // TODO: Return the string "Greetings, Adventurer!"
    return "";
  }
}
`,
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

    pub fn greet(&self) -> String {
        "Greetings, Adventurer!".to_string()
    }
}

`,
    JavaScript: `import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  hello_world() {
    return "Greetings, Adventurer!";
  }
}

`,
  },
  'contract-structure': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::require;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    greeting: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_greeting: Option<String>) -> Self {
        // TODO: Set owner_id to the deployer (predecessor_account_id)
        // TODO: Set greeting from initial_greeting, or default to "Hello from NEAR!"
        todo!()
    }

    pub fn get_owner(&self) -> AccountId {
        // TODO: Return the stored owner_id
        todo!()
    }

    pub fn get_greeting(&self) -> String {
        // TODO: Return the stored greeting
        todo!()
    }

    pub fn set_greeting(&mut self, new_greeting: String) {
        // TODO: Only the owner can call this (require! + predecessor_account_id)
        // TODO: Greeting cannot be empty (require!)
        // TODO: Store the new greeting
        todo!()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, greeting } = { owner_id: near.predecessorAccountId(), greeting: "Hello from NEAR!" }) {
    // TODO: Store owner_id and greeting
    this.owner_id = owner_id;
    this.greeting = greeting;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ new_greeting }) {
    // TODO: Add access control - only owner can call this
    // Hint: require(near.predecessorAccountId() === this.owner_id, "...")
    
    this.greeting = new_greeting;
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::require;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    greeting: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_greeting: Option<String>) -> Self {
        let owner = env::predecessor_account_id();
        let greeting = initial_greeting.unwrap_or_else(|| "Hello from NEAR!".to_string());

        Self {
            owner_id: owner,
            greeting,
        }
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }

    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    pub fn set_greeting(&mut self, new_greeting: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can change the greeting"
        );

        require!(!new_greeting.is_empty(), "Greeting cannot be empty");

        self.greeting = new_greeting;
    }
}


`,
    JavaScript: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, greeting } = { owner_id: near.predecessorAccountId(), greeting: "Hello from NEAR!" }) {
    this.owner_id = owner_id;
    this.greeting = greeting;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @view({})
  get_greeting() {
    return this.greeting;
  }

  @call({})
  set_greeting({ new_greeting }) {
    require(near.predecessorAccountId() === this.owner_id, "Only the owner can change the greeting");
    require(new_greeting.length > 0, "Greeting cannot be empty");
    this.greeting = new_greeting;
  }
}`,
  },
  'view-methods': {
    RustExercise: `use near_sdk::near;
use near_sdk::{AccountId, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    default_greeting: String,
    user_greetings: LookupMap<AccountId, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            default_greeting: "Hello, NEAR explorer!".to_string(),
            user_greetings: LookupMap::new(b"g"),
        }
    }

    pub fn get_greeting(&self, account: AccountId) -> String {
        // TODO: Return the greeting for account if it exists, otherwise return default_greeting
        todo!()
    }

    pub fn get_default_greeting_length(&self) -> u64 {
        // TODO: Return the length of default_greeting as u64
        todo!()
    }

    pub fn has_custom_greeting(&self, account: AccountId) -> bool {
        // TODO: Return true if account has a custom greeting in user_greetings
        todo!()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ default_greeting, user_greetings } = { 
    default_greeting: "Hello, NEAR explorer!",
    user_greetings: {} 
  }) {
    this.default_greeting = default_greeting;
    this.user_greetings = user_greetings;
  }

  @view({})
  get_greeting({ account }) {
    // TODO: Return user_greetings[account] or default_greeting
    return this.default_greeting;
  }

  @view({})
  get_default_greeting_length() {
    // TODO: Return this.default_greeting.length
    return 0;
  }

  @view({})
  has_custom_greeting({ account }) {
    // TODO: Return whether account exists in user_greetings
    return false;
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    default_greeting: String,
    user_greetings: LookupMap<AccountId, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            default_greeting: "Hello, NEAR explorer!".to_string(),
            user_greetings: LookupMap::new(b"g"),
        }
    }

    pub fn get_greeting(&self, account: AccountId) -> String {
        self.user_greetings
            .get(&account)
            .unwrap_or_else(|| self.default_greeting.clone())
    }

    pub fn get_default_greeting_length(&self) -> u64 {
        self.default_greeting.len() as u64
    }

    pub fn has_custom_greeting(&self, account: AccountId) -> bool {
        self.user_greetings.contains_key(&account)
    }
}

`,
    JavaScript: `import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ default_greeting, user_greetings } = { 
    default_greeting: "Hello, NEAR explorer!",
    user_greetings: {} 
  }) {
    this.default_greeting = default_greeting;
    this.user_greetings = user_greetings;
  }

  @view({})
  get_greeting({ account }) {
    return this.user_greetings[account] || this.default_greeting;
  }

  @view({})
  get_default_greeting_length() {
    return this.default_greeting.length;
  }

  @view({})
  has_custom_greeting({ account }) {
    return account in this.user_greetings;
  }
}`,
  },
  'change-methods': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, require, AccountId, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    message: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_message: Option<String>) -> Self {
        let owner = env::predecessor_account_id();
        let message = initial_message.unwrap_or_else(|| "Welcome, traveler!".to_string());

        Self {
            owner_id: owner,
            message,
        }
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    pub fn get_owner(&self) -> AccountId {
        // TODO: Return the stored owner_id
        todo!()
    }

    pub fn get_message_length(&self) -> u64 {
        // TODO: Return the length of message as u64
        todo!()
    }

    pub fn set_message(&mut self, new_message: String) {
        // TODO: Only the owner can call this (require!)
        // TODO: Message cannot be empty (require!)
        // TODO: Store the new message
        todo!()
    }

    pub fn append_to_message(&mut self, addition: String) {
        // TODO: Only the owner can call this (require!)
        // TODO: Addition cannot be empty (require!)
        // TODO: Append addition to the existing message
        todo!()
    }

    pub fn reset_message(&mut self) {
        // TODO: Only the owner can call this (require!)
        // TODO: Reset message back to "Welcome, traveler!"
        todo!()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, message } = { 
    owner_id: near.predecessorAccountId(),
    message: "Welcome, traveler!"
  }) {
    this.owner_id = owner_id;
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @call({})
  set_message({ new_message }) {
    // TODO: require(near.predecessorAccountId() === this.owner_id, "...")
    // TODO: require(new_message.length > 0, "...")
    this.message = new_message;
  }

  @call({})
  append_to_message({ addition }) {
    // TODO: require + this.message += addition
  }

  @call({})
  reset_message() {
    // TODO: require + this.message = "Welcome, traveler!"
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::{env, require, AccountId, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    message: String,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_message: Option<String>) -> Self {
        let owner = env::predecessor_account_id();
        let message = initial_message.unwrap_or_else(|| "Welcome, traveler!".to_string());

        Self {
            owner_id: owner,
            message,
        }
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }

    pub fn get_message_length(&self) -> u64 {
        self.message.len() as u64
    }

    pub fn set_message(&mut self, new_message: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can change the message"
        );
        require!(!new_message.is_empty(), "Message cannot be empty");
        self.message = new_message;
    }

    pub fn append_to_message(&mut self, addition: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can modify the message"
        );
        require!(!addition.is_empty(), "Addition cannot be empty");
        self.message.push_str(&addition);
    }

    pub fn reset_message(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can reset the message"
        );
        self.message = "Welcome, traveler!".to_string();
    }
}


`,
    JavaScript: `import { NearBindgen, view, call, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, message } = { 
    owner_id: near.predecessorAccountId(),
    message: "Welcome, traveler!"
  }) {
    this.owner_id = owner_id;
    this.message = message;
  }

  @view({})
  get_message() {
    return this.message;
  }

  @view({})
  get_owner() {
    return this.owner_id;
  }

  @view({})
  get_message_length() {
    return this.message.length;
  }

  @call({})
  set_message({ new_message }) {
    require(near.predecessorAccountId() === this.owner_id, "Only the owner can change the message");
    require(new_message.length > 0, "Message cannot be empty");
    this.message = new_message;
  }

  @call({})
  append_to_message({ addition }) {
    require(near.predecessorAccountId() === this.owner_id, "Only the owner can modify the message");
    require(addition.length > 0, "Addition cannot be empty");
    this.message += addition;
  }

  @call({})
  reset_message() {
    require(near.predecessorAccountId() === this.owner_id, "Only the owner can reset the message");
    this.message = "Welcome, traveler!";
  }
}`,
  },
  'state-management': {
    RustExercise: `use near_sdk::near;
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
        // TODO: Add 1 to counter
    }

    pub fn get_counter(&self) -> u64 {
        // TODO: Return counter
        0
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter ?? 0;
  }

  @call({})
  increment() {
    // TODO: Add 1 to this.counter
  }

  @view({})
  get_counter() {
    // TODO: Return this.counter
    return 0;
  }
}`,
    Rust: `use near_sdk::near;
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
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_increment() {
        let mut c = Contract::new();
        c.increment();
        c.increment();
        assert_eq!(c.get_counter(), 2);
    }
}

`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter ?? 0;
  }

  @call({})
  increment() {
    this.counter += 1;
  }

  @view({})
  get_counter() {
    return this.counter;
  }
}`,
  },
  'state-management': {
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    // TODO: Add counter: u64
    
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { counter: 0 }
    }

    pub fn increment(&mut self) {
        // Add 1 to the counter.
        let _: u64 = ();
    }

    pub fn get_counter(&self) -> u64 {
        // Return the current counter value.
        ()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ counter } = { counter: 0 }) {
    this.counter = counter ?? 0;
  }

  @view({})
  get_counter() {
    return this.counter;
  }

  @call({})
  increment() {
    // TODO: Increment this.counter by 1
  }
}
`,
    Rust: `use near_sdk::near;
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
    RustExercise: `use near_sdk::near;
use near_sdk::require;
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
        // TODO: Reject if message is empty
        // TODO: Reject if message is longer than 100 characters
        // TODO: Store the message
        todo!()
    }

    pub fn get_message(&self) -> String {
        self.message.clone()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

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
    // TODO: panic if message.length === 0 or message.length > 100
    this.message = message;
  }
}
`,
    Rust: `use near_sdk::near;
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
    RustExercise: `use near_sdk::near;
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

    pub fn try_parse_number(&self, s: String) -> Option<u64> {
        // TODO: Parse s as u64, return Some(value) if valid, None if invalid
        todo!()
    }

    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        // TODO: Return None if b is 0, otherwise return Some(a / b)
        todo!()
    }

    pub fn parse_with_default(&self, s: String, default: u64) -> u64 {
        // TODO: Parse s as u64, return default if parsing fails
        todo!()
    }

    pub fn assert_positive(&self, value: i64) {
        // TODO: Panic with require! if value is not positive
        todo!()
    }

    pub fn strict_check(&self, value: u64) {
        // TODO: Panic using env::panic_str if value is 0
        todo!()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  try_parse_number({ s }) {
    // TODO: Return parsed number or null if invalid (parseInt, isNaN)
    return null;
  }

  @view({})
  safe_divide({ a, b }) {
    // TODO: Return null if b === 0, else a / b
    return null;
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

    pub fn try_parse_number(&self, s: String) -> Option<u64> {
        s.parse().ok()
    }

    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        if b == 0 { return None; }
        Some(a / b)
    }

    pub fn parse_with_default(&self, s: String, default: u64) -> u64 {
        s.parse().unwrap_or(default)
    }

    pub fn assert_positive(&self, value: i64) {
        require!(value > 0, "Value must be positive");
    }

    pub fn strict_check(&self, value: u64) {
        if value == 0 {
            env::panic_str("ZERO_NOT_ALLOWED");
        }
    }
}

`,
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
  events: {
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::AccountId;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

// TODO: Define events using #[near(event_json(...))] macro
// Hint: Use standard = "learn-near-message", version = "1.0.0"
// Hint: Define MessageUpdated event with old_message, new_message, updated_by fields

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

    pub fn set_message(&mut self, new_message: String) {
        // TODO: Update state first, then emit the MessageUpdated event AFTER
        // Hint: Event::MessageUpdated { old_message, new_message, updated_by }.emit()
        
        self.message = new_message;
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "initial" }) {
    this.message = message;
  }

  @call({})
  set_message({ message }) {
    // TODO: Emit an event using the #[near(event_json(...))] macro
    this.message = message;
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::AccountId;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

#[near(event_json(standard = "learn-near-message"))]
pub enum Event {
    #[event_version("1.0.0")]
    MessageUpdated {
        old_message: String,
        new_message: String,
        updated_by: AccountId,
    },

    #[event_version("1.0.0")]
    MessageDeleted {
        deleted_message: String,
        deleted_by: AccountId,
    },

    #[event_version("1.1.0")]
    MessageReported {
        reported_message: String,
        reason: String,
        reported_by: AccountId,
    },
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

    pub fn set_message(&mut self, new_message: String) {
        let old_message = self.message.clone();
        self.message = new_message.clone();

        Event::MessageUpdated {
            old_message,
            new_message,
            updated_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();
    }

    pub fn delete_message(&mut self) {
        let deleted_message = self.message.clone();
        self.message = String::new();

        Event::MessageDeleted {
            deleted_message,
            deleted_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();
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
    // Update state first
    const old_message = this.message;
    this.message = message;
    
    const event = {
      standard: "learn-near-message",
      version: "1.0.0",
      event: "MessageUpdated",
      data: { 
        old_message,
        new_message: message,
        updated_by: near.sender,
      },
    };
    near.log("EVENT_JSON:" + JSON.stringify(event));
  }
}

`,
  },
  'collections-vector': {
    RustExercise: `use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Items,
    Tags,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
    tags: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(StorageKey::Items),
            tags: Vector::new(StorageKey::Tags),
        }
    }

    pub fn add_item(&mut self, item: String) {
        // TODO: Push item to the items vector
        todo!()
    }

    pub fn add_tag(&mut self, tag: String) {
        // TODO: Push tag to the tags vector
        todo!()
    }

    pub fn remove_item(&mut self, index: u64) {
        // TODO: Check index is within bounds, then remove using swap_remove
        todo!()
    }

    pub fn get_item(&self, index: u64) -> Option<String> {
        // TODO: Return the item at index, or None if out of bounds
        todo!()
    }

    pub fn get_items(&self) -> Vec<String> {
        // TODO: Return all items using iter().collect()
        todo!()
    }

    pub fn get_tags(&self) -> Vec<String> {
        // TODO: Return all tags using iter().collect()
        todo!()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_item({ index }) {
    return this.items[index] ?? null;
  }

  @view({})
  get_items() {
    return this.items;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }

  @call({})
  remove_item({ index }) {
    if (index >= this.items.length) near.panic("Index out of bounds");
    this.items.splice(index, 1);
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Items,
    Tags,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
    tags: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(StorageKey::Items),
            tags: Vector::new(StorageKey::Tags),
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
}


`,
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
    [this.items[index], this.items[this.items.length - 1]] = [this.items[this.items.length - 1], this.items[index]];
    this.items.pop();
  }
}

`,
  },
};
