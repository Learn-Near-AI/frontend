// Security and access control examples
export const securityCode = {
  'owner-pattern': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    pub fn new() -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures: 2,
            approvals: UnorderedSet::new(b"ap"),
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

    pub fn can_execute(&self, action: &String) -> bool {
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
        self.last_executed_action = Some(action.clone());
        env::log_str(&format!("Executed: {}", action));
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
}

`,
  },
  'upgrade-pattern': {
    Rust: `// Upgrade pattern: init, PanicOnDefault, and migration for post-upgrade schema changes
use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
}

