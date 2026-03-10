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
}`,
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
        // TODO: Set greeting from initial_greeting or default
        Self {
            owner_id: env::predecessor_account_id(),
            greeting: "Hello from NEAR!".to_string(),
        }
    }

    @view({})
    pub fn get_owner(&self) -> AccountId {
        // TODO: Return the stored owner_id
        self.owner_id.clone()
    }

    @view({})
    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }

    @call({})
    pub fn set_greeting(&mut self, new_greeting: String) {
        // TODO: Add access control - only owner can call this
        // Hint: require!(env::predecessor_account_id() == self.owner_id, "...")
        
        // TODO: Add validation - greeting cannot be empty
        // Hint: require!(!new_greeting.is_empty(), "...")
        
        self.greeting = new_greeting;
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
}`,
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

    // TODO: Return greeting for caller (or default)
    pub fn get_my_greeting(&self) -> String {
        let caller = env::predecessor_account_id();
        // Hint: user_greetings.get(&caller).unwrap_or_else(|| default_greeting.clone())
        self.default_greeting.clone()
    }

    // TODO: Return length of default greeting
    pub fn get_default_greeting_length(&self) -> u64 {
        0 // TODO: implement
    }

    // TODO: Check if user has custom greeting
    pub fn has_custom_greeting(&self, account: AccountId) -> bool {
        false // TODO: implement
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
  get_my_greeting() {
    // TODO: Return user_greetings[caller] or default_greeting
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

    pub fn get_my_greeting(&self) -> String {
        let caller = env::predecessor_account_id();
        self.user_greetings
            .get(&caller)
            .unwrap_or_else(|| self.default_greeting.clone())
    }

    pub fn get_default_greeting_length(&self) -> u64 {
        self.default_greeting.len() as u64
    }

    pub fn has_custom_greeting(&self, account: AccountId) -> bool {
        self.user_greetings.contains_key(&account)
    }
}`,
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
  get_my_greeting() {
    const caller = near.predecessorAccountId();
    return this.user_greetings[caller] || this.default_greeting;
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

    // View methods (free)
    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    pub fn get_owner(&self) -> AccountId {
        self.owner_id.clone()
    }

    // Change methods — add require! for owner-only access

    // TODO: set_message — require owner, validate not empty, update message
    pub fn set_message(&mut self, new_message: String) {
        // Hint: require!(env::predecessor_account_id() == self.owner_id, "...")
        // Hint: require!(!new_message.is_empty(), "...")
    }

    // TODO: append_to_message — require owner, validate not empty, push_str
    pub fn append_to_message(&mut self, addition: String) {
    }

    // TODO: reset_message — require owner, set back to default
    pub fn reset_message(&mut self) {
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
}`,
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
}`,
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
    counter: u64,
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
        // Validate: message must be non-empty and at most 100 characters, then store it.
        let _: u64 = ();
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
        // Return Some(parsed value) if the string parses as u64, otherwise None.
        ()
    }

    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        // Return None if b is 0, otherwise Some(a / b).
        ()
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
        // TODO: Emit the MessageUpdated event before updating
        // Hint: Use self.emit(Event::MessageUpdated { ... })
        
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

// 100/100 NEP-297 Events – modern best practice
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

        // Emit clean NEP-297 event (macro handles everything!)
        Event::MessageUpdated {
            old_message,
            new_message: new_message.clone(),
            updated_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();

        self.message = new_message;
    }

    pub fn delete_message(&mut self) {
        let deleted_message = self.message.clone();

        Event::MessageDeleted {
            deleted_message,
            deleted_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();

        self.message = String::new();
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
      standard: "learn-near-message",
      version: "1.0.0",
      event: "MessageUpdated",
      data: { 
        old_message: this.message,
        new_message: message,
        updated_by: near.sender,
      },
    };
    near.log("EVENT_JSON:" + JSON.stringify(event));
    this.message = message;
  }
}

`,
  },
  'collections-vector': {
    RustExercise: `// Use a Vector<String> with a unique storage prefix. Implement add_item, get_item, get_items.
use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(b"i"),
        }
    }

    pub fn add_item(&mut self, item: String) {
        self.items.push(&item);
    }

    pub fn remove_item(&mut self, index: u64) {
        require!(index < self.items.len(), "Index out of bounds");
        self.items.swap_remove(index);
    }

    pub fn get_item(&self, index: u64) -> Option<String> {
        // Return the item at the given index, or None if out of bounds.
        ()
    }

    pub fn get_items(&self) -> Vec<String> {
        // Return all items (collect the vector's iterator).
        ()
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
    RustExercise: `// Use an UnorderedMap from AccountId to u64 with a unique prefix. Implement:
// - set_balance (owner only, with overflow check)
// - add_balance (owner only, with checked_add)
// - subtract_balance (owner only, with checked_sub)  
// - get_balance (public view)
// - get_balances (paginated, limit & start_index)

use near_sdk::near;
use near_sdk::AccountId;
use near_sdk::collections::UnorderedMap;
use near_sdk::PanicOnDefault;
use near_sdk::require;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    balances: UnorderedMap<AccountId, u64>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            balances: UnorderedMap::new(b"b"),
        }
    }

    pub fn set_balance(&mut self, account: AccountId, amount: u64) {
        // TODO: require owner only
        self.balances.insert(&account, &amount);
    }

    pub fn add_balance(&mut self, account: AccountId, amount: u64) {
        // TODO: require owner only
        // TODO: get current, use checked_add, insert new balance
    }

    pub fn subtract_balance(&mut self, account: AccountId, amount: u64) {
        // TODO: require owner only
        // TODO: get current, use checked_sub, insert new balance
    }

    pub fn get_balance(&self, account: AccountId) -> Option<u64> {
        // Return the balance for the account, or None if not in the map.
        ()
    }

    pub fn get_balances(&self, limit: Option<u64>, start_index: Option<u64>) -> Vec<(AccountId, u64)> {
        // TODO: paginate with skip/take, return Vec of (account, balance)
        ()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, balances } = { owner_id: "", balances: {} }) {
    this.owner_id = owner_id || near.currentAccountId();
    this.balances = balances || {};
  }

  @view({})
  get_balance({ account }) {
    // Return balance or null
    ()
  }

  @view({})
  get_balances({ limit, start_index }) {
    // TODO: paginate - convert Object.entries, slice from start_index, take limit
    ()
  }

  @call({})
  set_balance({ account, amount }) {
    // TODO: require predecessor == this.owner_id, then set this.balances[account]
  }

  @call({})
  add_balance({ account, amount }) {
    // TODO: require owner, get current, add with overflow check, set
  }

  @call({})
  subtract_balance({ account, amount }) {
    // TODO: require owner, get current, subtract with underflow check, set
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::AccountId;
use near_sdk::collections::UnorderedMap;
use near_sdk::PanicOnDefault;
use near_sdk::{require, env};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    balances: UnorderedMap<AccountId, u64>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            balances: UnorderedMap::new(b"b"),
        }
    }

    pub fn set_balance(&mut self, account: AccountId, amount: u64) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can set balances"
        );
        self.balances.insert(&account, &amount);
    }

    pub fn add_balance(&mut self, account: AccountId, amount: u64) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can add balances"
        );
        let current = self.balances.get(&account).unwrap_or(0);
        let new_balance = current.checked_add(amount)
            .expect("Overflow: balance too large");
        self.balances.insert(&account, &new_balance);
    }

    pub fn subtract_balance(&mut self, account: AccountId, amount: u64) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can subtract balances"
        );
        let current = self.balances.get(&account).unwrap_or(0);
        let new_balance = current.checked_sub(amount)
            .expect("Underflow: insufficient balance");
        self.balances.insert(&account, &new_balance);
    }

    pub fn get_balance(&self, account: AccountId) -> Option<u64> {
        self.balances.get(&account)
    }

    pub fn get_balances(&self, limit: Option<u64>, start_index: Option<u64>) -> Vec<(AccountId, u64)> {
        let limit = limit.unwrap_or(50).min(100);
        let start = start_index.unwrap_or(0);
        
        self.balances.keys()
            .skip(start as usize)
            .take(limit as usize)
            .map(|key| (key, self.balances.get(&key).unwrap_or(0)))
            .collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, balances } = { owner_id: "", balances: {} }) {
    this.owner_id = owner_id || near.currentAccountId();
    this.balances = balances || {};
  }

  @view({})
  get_balance({ account }) {
    return this.balances[account] ?? null;
  }

  @view({})
  get_balances({ limit, start_index }) {
    const entries = Object.entries(this.balances);
    const start = start_index ?? 0;
    const size = Math.min(limit ?? 50, 100);
    return entries.slice(start, start + size).map(([key, val]) => [key, val]);
  }

  @call({})
  set_balance({ account, amount }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can set balances");
    }
    this.balances[account] = amount;
  }

  @call({})
  add_balance({ account, amount }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can add balances");
    }
    const current = this.balances[account] ?? 0;
    const newBalance = current + amount;
    if (newBalance > Number.MAX_SAFE_INTEGER) {
      near.panic("Overflow: balance too large");
    }
    this.balances[account] = newBalance;
  }

  @call({})
  subtract_balance({ account, amount }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can subtract balances");
    }
    const current = this.balances[account] ?? 0;
    if (current < amount) {
      near.panic("Underflow: insufficient balance");
    }
    this.balances[account] = current - amount;
  }
}

`,
  },
};
