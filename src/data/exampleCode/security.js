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
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            admins: UnorderedSet::new(b"a"),
        }
    }

    pub fn add_admin(&mut self, account: AccountId) {
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
  constructor({ admins } = { admins: [] }) {
    this.admins = admins || [];
  }

  @view({})
  is_admin({ account }) {
    return this.admins.includes(account);
  }

  @call({})
  add_admin({ account }) {
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

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,
    approvals: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures: 2,
            approvals: UnorderedSet::new(b"ap"),
        }
    }

    pub fn approve(&mut self) {
        let signer = env::predecessor_account_id();
        require!(self.signers.contains(&signer), "Not a signer");
        self.approvals.insert(&signer);
    }

    pub fn can_execute(&self) -> bool {
        self.approvals.len() >= self.required_signatures
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signers, required_signatures, approvals } = {
    signers: [],
    required_signatures: 2,
    approvals: []
  }) {
    this.signers = signers || [];
    this.required_signatures = required_signatures;
    this.approvals = approvals || [];
  }

  @view({})
  can_execute() {
    return this.approvals.length >= this.required_signatures;
  }

  @call({})
  approve() {
    const signer = near.predecessorAccountId();
    if (!this.signers.includes(signer)) {
      near.panic("Not a signer");
    }
    if (!this.approvals.includes(signer)) {
      this.approvals.push(signer);
    }
  }
}

`,
  },
  'reentrancy-guard': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    locked: bool,
    balance: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            locked: false,
            balance: 0,
        }
    }

    pub fn withdraw(&mut self, amount: u64) {
        require!(!self.locked, "Reentrancy guard: operation locked");
        require!(self.balance >= amount, "Insufficient balance");
        
        self.locked = true;
        self.balance -= amount;
        self.locked = false;
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ locked, balance } = { locked: false, balance: 0 }) {
    this.locked = locked;
    this.balance = balance;
  }

  @view({})
  get_balance() {
    return this.balance;
  }

  @call({})
  withdraw({ amount }) {
    if (this.locked) {
      near.panic("Reentrancy guard: operation locked");
    }
    if (this.balance < amount) {
      near.panic("Insufficient balance");
    }
    
    this.locked = true;
    this.balance -= amount;
    this.locked = false;
  }
}

`,
  },
  'upgrade-pattern': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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

    /// Migration hook: call after upgrade to bump version (owner only)
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

