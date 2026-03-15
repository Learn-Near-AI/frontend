// Security and access control examples
export const securityCode = {
  'owner-pattern': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            value: 0,
        }
    }

    fn assert_owner(&self) {
        // TODO: require that the caller is the owner
        // Hint: require!(env::predecessor_account_id() == self.owner_id, "Only owner can call this");
    }

    pub fn set_value(&mut self, value: u64) {
        // TODO: call assert_owner() first
        // TODO: then update self.value
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, value } = { owner_id: near.currentAccountId(), value: 0 }) {
    this.owner_id = owner_id;
    this.value = value;
  }

  assert_owner() {
    // TODO: if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can call this method");
  }

  @view({})
  get_value() {
    return this.value;
  }

  @call({})
  set_value({ value }) {
    // TODO: call this.assert_owner() before updating
    this.value = value;
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            value: 0,
        }
    }

    fn assert_owner(&self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can call this method"
        );
    }

    pub fn set_value(&mut self, value: u64) {
        self.assert_owner();
        self.value = value;
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, value } = { 
    owner_id: near.currentAccountId(), 
    value: 0 
  }) {
    this.owner_id = owner_id;
    this.value = value;
  }

  assert_owner() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can call this method");
    }
  }

  @view({})
  get_value() {
    return this.value;
  }

  @call({})
  set_value({ value }) {
    this.assert_owner();
    this.value = value;
  }
}

`,
  },
  'role-based-access': {
    RustExercise: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    admins: UnorderedSet<AccountId>,
    owner_id: AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            admins: UnorderedSet::new(b"a"),
            owner_id: env::current_account_id(),
        }
    }

    pub fn add_admin(&mut self, account: AccountId) {
        // TODO: require that the caller is the owner or an existing admin
        // Hint: check predecessor against owner_id AND admins.contains(&predecessor)
        // TODO: then insert the account into admins
    }

    pub fn is_admin(&self, account: AccountId) -> bool {
        self.admins.contains(&account)
    }

    pub fn admin_only_action(&mut self) {
        // TODO: require that the caller is an admin
        // Hint: use self.is_admin(env::predecessor_account_id())
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ admins, owner_id } = { admins: [], owner_id: near.currentAccountId() }) {
    this.admins = admins || [];
    this.owner_id = owner_id || near.currentAccountId();
  }

  @view({})
  is_admin({ account }) {
    return this.admins.includes(account);
  }

  @call({})
  add_admin({ account }) {
    // TODO: require predecessor is owner or in admins
    if (!this.admins.includes(account)) this.admins.push(account);
  }

  @call({})
  admin_only_action() {
    // TODO: if (!this.is_admin({ account: near.predecessorAccountId() })) near.panic("Only admins...");
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    admins: UnorderedSet<AccountId>,
    owner_id: AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            admins: UnorderedSet::new(b"a"),
            owner_id: env::current_account_id(),
        }
    }

    pub fn add_admin(&mut self, account: AccountId) {
        require!(
            env::predecessor_account_id() == self.owner_id || self.admins.contains(&env::predecessor_account_id()),
            "Only owner or existing admins can add admins"
        );
        self.admins.insert(&account);
    }

    pub fn is_admin(&self, account: AccountId) -> bool {
        self.admins.contains(&account)
    }

    pub fn admin_only_action(&mut self) {
        require!(
            self.is_admin(env::predecessor_account_id()),
            "Only admins can perform this action"
        );
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ admins, owner_id } = { admins: [], owner_id: near.currentAccountId() }) {
    this.admins = admins || [];
    this.owner_id = owner_id || near.currentAccountId();
  }

  @view({})
  is_admin({ account }) {
    return this.admins.includes(account);
  }

  @call({})
  add_admin({ account }) {
    const pred = near.predecessorAccountId();
    if (pred !== this.owner_id && !this.admins.includes(pred)) {
      near.panic("Only owner or existing admins can add admins");
    }
    if (!this.admins.includes(account)) {
      this.admins.push(account);
    }
  }

  @call({})
  admin_only_action() {
    if (!this.is_admin({ account: near.predecessorAccountId() })) {
      near.panic("Only admins can perform this action");
    }
  }
}

`,
  },
  'pausable-contract': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
        }
    }

    pub fn pause(&mut self) {
        // TODO: require that the caller is the owner
        // TODO: set self.paused = true
    }

    pub fn unpause(&mut self) {
        // TODO: require that the caller is the owner
        // TODO: set self.paused = false
    }

    pub fn is_paused(&self) -> bool {
        self.paused
    }

    pub fn action(&mut self) {
        // TODO: require that the contract is NOT paused
        // Hint: require!(!self.paused, "Contract is paused");
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused } = { owner_id: near.currentAccountId(), paused: false }) {
    this.owner_id = owner_id;
    this.paused = paused;
  }

  @view({})
  is_paused() {
    return this.paused;
  }

  @call({})
  pause() {
    // TODO: if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can pause");
    this.paused = true;
  }

  @call({})
  unpause() {
    // TODO: require owner
    this.paused = false;
  }

  @call({})
  action() {
    // TODO: if (this.paused) near.panic("Contract is paused");
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
        }
    }

    pub fn pause(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can pause"
        );
        self.paused = true;
    }

    pub fn unpause(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can unpause"
        );
        self.paused = false;
    }

    pub fn is_paused(&self) -> bool {
        self.paused
    }

    pub fn action(&mut self) {
        require!(!self.paused, "Contract is paused");
        // Action logic here
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused } = {
    owner_id: near.currentAccountId(),
    paused: false
  }) {
    this.owner_id = owner_id;
    this.paused = paused;
  }

  @view({})
  is_paused() {
    return this.paused;
  }

  @call({})
  pause() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can pause");
    }
    this.paused = true;
  }

  @call({})
  unpause() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can unpause");
    }
    this.paused = false;
  }

  @call({})
  action() {
    if (this.paused) {
      near.panic("Contract is paused");
    }
  }
}

`,
  },
  'multi-signature': {
    RustExercise: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;
use near_sdk::Promise;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<String>,
    last_executed_action: Option<String>,
    proposal_id: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new(required_signatures: u32) -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures,
            approvals: UnorderedSet::new(b"a"),
            last_executed_action: None,
            proposal_id: 0,
        }
    }

    pub fn add_signer(&mut self, account: AccountId) {
        // Note: First signer must be added using the contract account as --accountId
        // (e.g., near call <contract> add_signer ... --accountId <contract>)
        // This makes predecessor = currentAccountId, allowing bootstrapping.
        let pred = env::predecessor_account_id();
        require!(
            (self.signers.is_empty() && pred == env::current_account_id()) || self.signers.contains(&pred),
            "Only contract (bootstrapping) or signers can add"
        );
        self.signers.insert(&account);
    }

    pub fn propose(&mut self, action: String) -> u64 {
        // TODO: require that the caller is a signer
        // TODO: get current proposal_id, increment it
        // TODO: log and return the new proposal_id
        0
    }

    pub fn approve(&mut self, proposal_id: u64, action: String) {
        // TODO: require that the caller is a signer
        // TODO: require proposal_id is valid (less than current proposal_id)
        // TODO: record approval with key format "proposal_id:action:signer"
    }

    fn can_execute(&self, proposal_id: u64, action: &str) -> bool {
        // TODO: Return true if at least required_signatures signers have approved this proposal_id
        false
    }

    pub fn execute(&mut self, proposal_id: u64, action: String) {
        // TODO: require can_execute for this proposal_id
        // TODO: clear approvals for this proposal_id after execution
        // TODO: parse action (format: "transfer:amount:recipient") and execute Promise transfer
        // TODO: set last_executed_action
    }

    pub fn get_signers(&self) -> Vec<AccountId> {
        self.signers.to_vec()
    }

    pub fn get_proposal_count(&self) -> u64 {
        self.proposal_id
    }

    pub fn get_last_action(&self) -> Option<String> {
        self.last_executed_action.clone()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signers = [], required_signatures = 2, approvals = [], last_executed_action = null, proposal_id = 0 } = {}) {
    this.signers = signers;
    this.required_signatures = required_signatures;
    this.approvals = approvals;
    this.last_executed_action = last_executed_action;
    this.proposal_id = proposal_id;
  }

  can_execute({ proposal_id, action }) {
    // TODO: count approvals with key format "proposal_id:action:signer"
    // return count >= required_signatures
    return false;
  }

  @call({})
  add_signer({ account }) {
    const pred = near.predecessorAccountId();
    const ok = (this.signers.length === 0 && pred === near.currentAccountId()) || this.signers.includes(pred);
    if (!ok) near.panic("Only deployer (when empty) or signers can add");
    if (!this.signers.includes(account)) this.signers.push(account);
  }

  @call({})
  propose({ action }) {
    // TODO: require signer; get current proposal_id, increment; log and return
    return 0;
  }

  @call({})
  approve({ proposal_id, action }) {
    // TODO: require signer; require valid proposal_id; push "proposal_id:action:signer" to approvals
  }

  @call({})
  execute({ proposal_id, action }) {
    // TODO: require can_execute; parse "transfer:amount:recipient"; execute Promise transfer
    // set last_executed_action
  }

  @view({})
  get_last_action() {
    return this.last_executed_action;
  }

  @view({})
  get_signers() {
    return this.signers;
  }

  @view({})
  get_proposal_count() {
    return this.proposal_id;
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;
use near_sdk::Promise;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<String>,
    last_executed_action: Option<String>,
    proposal_id: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new(required_signatures: u32) -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures,
            approvals: UnorderedSet::new(b"a"),
            last_executed_action: None,
            proposal_id: 0,
        }
    }

    pub fn add_signer(&mut self, account: AccountId) {
        let pred = env::predecessor_account_id();
        require!(
            (self.signers.is_empty() && pred == env::current_account_id()) || self.signers.contains(&pred),
            "Only deployer (when empty) or signers can add"
        );
        self.signers.insert(&account);
    }

    pub fn propose(&mut self, action: String) -> u64 {
        let pred = env::predecessor_account_id();
        require!(self.signers.contains(&pred), "Not a signer");
        
        let proposal_id = self.proposal_id;
        self.proposal_id += 1;
        
        env::log_str(&format!("Proposal {} created: {}", proposal_id, action));
        proposal_id
    }

    pub fn approve(&mut self, proposal_id: u64, action: String) {
        let signer = env::predecessor_account_id();
        require!(self.signers.contains(&signer), "Not a signer");
        require!(proposal_id < self.proposal_id, "Invalid proposal");
        
        let key = format!("{}:{}:{}", proposal_id, action, signer);
        self.approvals.insert(&key);
    }

    fn can_execute(&self, proposal_id: u64, action: &str) -> bool {
        let count = self.signers.iter()
            .filter(|s| self.approvals.contains(&format!("{}:{}:{}", proposal_id, action, s)))
            .count();
        count >= self.required_signatures as usize
    }

    pub fn execute(&mut self, proposal_id: u64, action: String) {
        require!(self.can_execute(proposal_id, &action), "Not enough approvals");
        
        for signer in self.signers.iter() {
            let key = format!("{}:{}:{}", proposal_id, action, signer);
            self.approvals.remove(&key);
        }
        
        let parts: Vec<&str> = action.split(':').collect();
        
        if parts.len() == 3 && parts[0] == "transfer" {
            let amount: u128 = parts[1].parse().expect("Invalid amount");
            let recipient: AccountId = parts[2].parse().expect("Invalid recipient");
            Promise::new(recipient).transfer(amount);
            env::log_str(&format!("Executed transfer of {} NEAR to {}", amount, recipient));
        } else {
            env::log_str(&format!("Executed proposal {}: {}", proposal_id, action));
        }
        
        self.last_executed_action = Some(action);
    }

    pub fn get_signers(&self) -> Vec<AccountId> {
        self.signers.iter().collect()
    }

    pub fn get_proposal_count(&self) -> u64 {
        self.proposal_id
    }

    pub fn get_last_action(&self) -> Option<String> {
        self.last_executed_action.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signers = [], required_signatures = 2, approvals = [], last_executed_action = null, proposal_id = 0 } = {}) {
    this.signers = signers;
    this.required_signatures = required_signatures;
    this.approvals = approvals;
    this.last_executed_action = last_executed_action;
    this.proposal_id = proposal_id;
  }

  can_execute({ proposal_id, action }) {
    const count = this.signers.filter((s) => this.approvals.includes(\`\${proposal_id}:\${action}:\${s}\`)).length;
    return count >= this.required_signatures;
  }

  @call({})
  add_signer({ account }) {
    const pred = near.predecessorAccountId();
    const ok = (this.signers.length === 0 && pred === near.currentAccountId()) || this.signers.includes(pred);
    if (!ok) near.panic("Only deployer (when empty) or signers can add");
    if (!this.signers.includes(account)) this.signers.push(account);
  }

  @call({})
  propose({ action }) {
    const pred = near.predecessorAccountId();
    if (!this.signers.includes(pred)) near.panic("Not a signer");
    
    const proposal_id = this.proposal_id;
    this.proposal_id += 1;
    
    near.log("Proposal " + proposal_id + " created: " + action);
    return proposal_id;
  }

  @call({})
  approve({ proposal_id, action }) {
    const signer = near.predecessorAccountId();
    if (!this.signers.includes(signer)) near.panic("Not a signer");
    if (proposal_id >= this.proposal_id) near.panic("Invalid proposal");
    
    const key = \`\${proposal_id}:\${action}:\${signer}\`;
    if (!this.approvals.includes(key)) this.approvals.push(key);
  }

  @call({})
  execute({ proposal_id, action }) {
    if (!this.can_execute({ proposal_id, action })) near.panic("Not enough approvals");
    
    for (const signer of this.signers) {
      const key = \`\${proposal_id}:\${action}:\${signer}\`;
      const idx = this.approvals.indexOf(key);
      if (idx >= 0) this.approvals.splice(idx, 1);
    }
    
    const parts = action.split(':');
    if (parts.length === 3 && parts[0] === "transfer") {
      const amount = parts[1];
      const recipient = parts[2];
      near.log("Executed transfer of " + amount + " NEAR to " + recipient);
    } else {
      near.log("Executed proposal " + proposal_id + ": " + action);
    }
    }
    
    this.last_executed_action = action;
  }

  @view({})
  get_last_action() {
    return this.last_executed_action;
  }

  @view({})
  get_signers() {
    return this.signers;
  }

  @view({})
  get_proposal_count() {
    return this.proposal_id;
  }
}
`,
  },

  'upgrade-pattern': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    username: String,
    settings: String,  // Added in v3
    version: u32,
}

// TODO: Define OldContract struct (user_name instead of username, no settings)
// TODO: Define OldContractWithSettings struct (has username, no settings)
// Both need BorshDeserialize, BorshSerialize derives

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            username: "".to_string(),
            settings: "".to_string(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 {
        self.version
    }

    /// Simple migration: struct shape stays the same
    pub fn migrate(&mut self) {
        // TODO: require that the caller is the owner
        // Hint: require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        // TODO: increment self.version
        // TODO: log: env::log_str(&format!("Upgraded to version {}", self.version))
    }
}

// ============================================================
// Second impl block for #[init(ignore_state)] - struct shape changed!
// ============================================================
#[near]
impl Contract {
    /// Migration: rename field (user_name -> username)
    #[init(ignore_state)]
    pub fn migrate_rename() -> Self {
        // TODO: Read old state: let old = env::state_read::<OldContract>();
        // TODO: Map old.user_name to username, add settings with default, bump version
    }

    /// Migration: add brand new field (settings)
    #[init(ignore_state)]
    pub fn migrate_add_field() -> Self {
        // TODO: Read old state: let old = env::state_read::<OldContractWithSettings>();
        // TODO: Keep username, add settings with "default", bump version
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, version, new_field } = { 
    owner_id: near.currentAccountId(), 
    version: 1,
    new_field: "" 
  }) {
    this.owner_id = owner_id;
    this.version = version;
    // Add new_field in constructor for schema migration
    this.new_field = new_field || "";
  }

  @view({})
  get_version() {
    return this.version;
  }

  @call({})
  migrate() {
    // TODO: require that caller is owner
    // Hint: if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can migrate");
    // TODO: increment this.version
    // TODO: log: near.log("Upgraded to version " + this.version);
  }

  // Note: In JS SDK, migrations that add new fields typically:
  // 1. Bump version in constructor
  // 2. Add new field with default value
  // 3. Migrate function handles data transformation if needed
}
`,
    Rust: `// Upgrade pattern: init, PanicOnDefault, and migration for post-upgrade schema changes
use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};

/// PanicOnDefault: contract panics if deserialized without explicit init—prevents uninitialized state.
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    username: String,
    settings: String,  // Added in v3
    version: u32,
}

/// Old contract: had user_name instead of username
#[derive(BorshDeserialize, BorshSerialize)]
struct OldContract {
    owner_id: near_sdk::AccountId,
    user_name: String,
    version: u32,
}

/// Even older contract: didn't have settings field
#[derive(BorshDeserialize, BorshSerialize)]
struct OldContractWithSettings {
    owner_id: near_sdk::AccountId,
    username: String,
    version: u32,
}

// ============================================================
// First impl block: regular contract methods (uses &self or &mut self)
// ============================================================
#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            username: "".to_string(),
            settings: "".to_string(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 {
        self.version
    }

    /// Migration hook: call after code upgrade when struct shape stays the same.
    /// Uses &mut self - old state deserializes fine into new struct shape.
    pub fn migrate(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can migrate"
        );
        self.version += 1;
        env::log_str(&format!("Upgraded to version {}", self.version));
    }
}

// ============================================================
// Second impl block: #[init(ignore_state)] methods
// When struct shape CHANGES (added/renamed fields), old state can't deserialize.
// Solution: use ignore_state to skip deserialization, then manually read old state.
// ============================================================
#[near]
impl Contract {
    /// Migration: rename field (user_name -> username)
    #[init(ignore_state)]
    pub fn migrate_rename() -> Self {
        let old = env::state_read::<OldContract>().expect("No state");
        Self {
            owner_id: old.owner_id,
            username: old.user_name,  // Rename: preserve the data
            settings: "".to_string(),  // New field gets default
            version: old.version + 1,
        }
    }

    /// Migration: add brand new field (settings) - already has username
    #[init(ignore_state)]
    pub fn migrate_add_field() -> Self {
        let old = env::state_read::<OldContractWithSettings>().expect("No state");
        Self {
            owner_id: old.owner_id,
            username: old.username,  // Keep existing data
            settings: "default".to_string(),  // NEW field gets default
            version: old.version + 1,
        }
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  // Constructor with default values for new fields - handles schema migration automatically
  constructor({ owner_id, version, new_field } = {
    owner_id: near.currentAccountId(),
    version: 1,
    new_field: ""
  }) {
    this.owner_id = owner_id;
    this.version = version || 1;
    // New fields get defaults; old state is preserved
    this.new_field = new_field || "";
  }

  @view({})
  get_version() {
    return this.version;
  }

  /// Basic migration: increment version (same-shape upgrade)
  @call({})
  migrate() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can migrate");
    }
    this.version += 1;
    near.log(\`Upgraded to version \${this.version}\`);
  }

  /// Migration when adding new fields:
  /// In JS SDK, simply add the new field to constructor with a default value.
  /// The old state is preserved, new field gets default.
  /// Then call migrate() to bump version and handle any data transformation.
}

// Example: migration that transforms data
@NearBindgen({})
class ContractV2 {
  constructor({ owner_id, username, version } = { 
    owner_id: near.currentAccountId(),
    username: "",
    version: 2 
  }) {
    this.owner_id = owner_id;
    this.username = username || "";  // Renamed from user_name
    this.version = version;
  }

  /// Migration from V1: rename user_name -> username
  @call({})
  migrate_from_v1({ old_user_name }) {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can migrate");
    }
    // Transform old field to new field
    this.username = old_user_name;
    this.version = 3;
    near.log(\`Migrated to version 3\`);
  }
}

`,
  },
};
