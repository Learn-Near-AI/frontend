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
        // Require that the caller is the owner; otherwise panic with a clear message.
        let _: u64 = ();
    }

    pub fn set_value(&mut self, value: u64) {
        // Call assert_owner, then update self.value.
        let _: u64 = ();
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
        // Require that the caller is the owner or an existing admin, then insert the account.
        let _: u64 = ();
    }

    pub fn is_admin(&self, account: AccountId) -> bool {
        self.admins.contains(&account)
    }

    pub fn admin_only_action(&mut self) {
        // Require that the caller is an admin; otherwise panic.
        let _: u64 = ();
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
        // Require that the caller is the owner, then set paused to true.
        let _: u64 = ();
    }

    pub fn unpause(&mut self) {
        // Require that the caller is the owner, then set paused to false.
        let _: u64 = ();
    }

    pub fn is_paused(&self) -> bool {
        self.paused
    }

    pub fn action(&mut self) {
        // Require that the contract is not paused; otherwise panic.
        let _: u64 = ();
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

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<String>,
    last_executed_action: Option<String>,
    stored_value: Option<String>,
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
            stored_value: None,
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

    pub fn approve(&mut self, action: String) {
        // TODO: require that the caller is a signer; record an approval for this action (e.g. action:signer key).
    }

    pub fn can_execute(&self, action: &String) -> bool {
        // TODO: Return true if at least required_signatures signers have approved this action.
    }

    pub fn execute(&mut self, action: String) {
        // TODO: require can_execute for this action
        // TODO: clear approvals for this action
        // TODO: parse set_value:xxx and set stored_value
        // TODO: set last_executed_action
    }

    pub fn get_stored_value(&self) -> Option<String> {
        // TODO: return stored_value
    }

    pub fn get_last_action(&self) -> Option<String> {
        self.last_executed_action.clone()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signers = [], required_signatures = 2, approvals = [], last_executed_action = null } = {}) {
    this.signers = signers;
    this.required_signatures = required_signatures;
    this.approvals = approvals;
    this.last_executed_action = last_executed_action;
  }

  @view({})
  can_execute({ action }) {
    // TODO: count this.signers where approvals includes action:signer; return count >= required_signatures
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
  approve({ action }) {
    // TODO: require signer; push action:signer to approvals
  }

  @call({})
  execute({ action }) {
    // TODO: require can_execute; remove approvals for action; set last_executed_action
  }

  @view({})
  get_last_action() {
    return this.last_executed_action;
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

/// Approvals are scoped per action: key "action:signer" means signer approved action.
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<String>,
    last_executed_action: Option<String>,
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

    /// Approve a specific action. Each action requires its own approvals.
    pub fn approve(&mut self, action: String) {
        let signer = env::predecessor_account_id();
        require!(self.signers.contains(&signer), "Not a signer");
        let key = format!("{}:{}", action, signer);
        self.approvals.insert(&key);
    }

    pub fn can_execute(&self, action: &str) -> bool {
        let count = self.signers.iter()
            .filter(|s| self.approvals.contains(&format!("{}:{}", action, s)))
            .count();
        count >= self.required_signatures as usize
    }

    pub fn execute(&mut self, action: String) {
        require!(self.can_execute(&action), "Not enough approvals for this action");
        for signer in self.signers.iter() {
            let key = format!("{}:{}", action, signer);
            self.approvals.remove(&key);
        }
        // Demo: log the action (in production: transfer, config change, etc.)
        env::log_str(&format!("Executed: {}", action));
        self.last_executed_action = Some(action);
    }

    pub fn get_signers(&self) -> Vec<AccountId> {
        self.signers.iter().collect()
    }

    pub fn get_approvals(&self, action: String) -> Vec<AccountId> {
        self.signers.iter()
            .filter(|s| self.approvals.contains(&format!("{}:{}", action, s)))
            .collect()
    }

    pub fn get_last_action(&self) -> Option<String> {
        self.last_executed_action.clone()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signers = [], required_signatures = 2, approvals = [], last_executed_action = null } = {}) {
    this.signers = signers;
    this.required_signatures = required_signatures;
    this.approvals = approvals;
    this.last_executed_action = last_executed_action;
  }

  @view({})
  can_execute({ action }) {
    const count = this.signers.filter((s) => this.approvals.includes(\`\${action}:\${s}\`)).length;
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
  approve({ action }) {
    const signer = near.predecessorAccountId();
    if (!this.signers.includes(signer)) near.panic("Not a signer");
    const key = \`\${action}:\${signer}\`;
    if (!this.approvals.includes(key)) this.approvals.push(key);
  }

  @call({})
  execute({ action }) {
    if (!this.can_execute({ action })) near.panic("Not enough approvals for this action");
    for (const signer of this.signers) {
      const key = \`\${action}:\${signer}\`;
      const idx = this.approvals.indexOf(key);
      if (idx >= 0) this.approvals.splice(idx, 1);
    }
    this.last_executed_action = action;
    near.log("Executed: " + action);
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
  get_approvals({ action }) {
    return this.signers.filter((s) => this.approvals.includes(\`\${action}:\${s}\`));
  }
}

`,
  },
  'upgrade-pattern': {
    RustExercise: `use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    version: u32,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 {
        self.version
    }

    pub fn migrate(&mut self) {
        // Require that the caller is the owner; increment version and log the upgrade.
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, version } = { owner_id: near.currentAccountId(), version: 1 }) {
    this.owner_id = owner_id;
    this.version = version;
  }

  @view({})
  get_version() {
    return this.version;
  }

  @call({})
  migrate() {
    // TODO: if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can migrate");
    // TODO: this.version += 1; near.log("Upgraded to version " + this.version);
  }
}
`,
    Rust: `// Upgrade pattern: init, PanicOnDefault, and migration for post-upgrade schema changes
use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;

/// PanicOnDefault: contract panics if deserialized without explicit init—prevents uninitialized state.
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    version: u32,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 {
        self.version
    }

    /// Migration hook: call after code upgrade. Owner-only; use for schema changes.
    pub fn migrate(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can migrate"
        );
        self.version += 1;
        env::log_str(&format!("Upgraded to version {}", self.version));
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, version } = {
    owner_id: near.currentAccountId(),
    version: 1
  }) {
    this.owner_id = owner_id;
    this.version = version;
  }

  @view({})
  get_version() {
    return this.version;
  }

  @call({})
  migrate() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner can migrate");
    }
    this.version += 1;
    near.log(\`Upgraded to version \${this.version}\`);
  }
}

`,
  },
};
