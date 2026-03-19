export const roleBasedAccessCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::store::UnorderedSet;
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey};
use near_sdk::borsh::BorshSerialize;

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    Owners,
    Admins,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    admins: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(StorageKey::Owners);
        owners.insert(initial_owner);
        Self {
            owners,
            admins: UnorderedSet::new(StorageKey::Admins),
        }
    }

    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    fn is_admin(&self, account: &AccountId) -> bool {
        self.admins.contains(account) || self.is_owner(account)
    }

    pub fn add_owner(&mut self, account: AccountId) {
        // TODO: Require caller is owner
        // TODO: Insert account into owners
        todo!()
    }

    pub fn remove_owner(&mut self, account: AccountId) {
        // TODO: Require caller is owner
        // TODO: Require cannot remove last owner
        // TODO: Remove account from owners
        todo!()
    }

    pub fn add_admin(&mut self, account: AccountId) {
        // TODO: Require caller is owner
        // TODO: Insert account into admins
        todo!()
    }

    pub fn remove_admin(&mut self, account: AccountId) {
        // TODO: Require caller is owner
        // TODO: Remove account from admins
        todo!()
    }

    pub fn admin_only_action(&mut self) {
        // TODO: Require caller is admin or owner
        todo!()
    }

    pub fn get_owners(&self) -> Vec<AccountId> {
        // TODO: Return all owners
        todo!()
    }

    pub fn get_admins(&self) -> Vec<AccountId> {
        // TODO: Return all admins
        todo!()
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::store::UnorderedSet;
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey};
use near_sdk::borsh::BorshSerialize;

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    Owners,
    Admins,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    admins: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(StorageKey::Owners);
        owners.insert(initial_owner);
        Self {
            owners,
            admins: UnorderedSet::new(StorageKey::Admins),
        }
    }

    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    fn is_admin(&self, account: &AccountId) -> bool {
        self.admins.contains(account) || self.is_owner(account)
    }

    pub fn add_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.owners.insert(account);
    }

    pub fn remove_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        require!(self.owners.len() > 1, "Cannot remove last owner");
        self.owners.remove(&account);
    }

    pub fn add_admin(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.admins.insert(account);
    }

    // ADDED: was in task, missing from code
    pub fn remove_admin(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.admins.remove(&account);
    }

    pub fn admin_only_action(&mut self) {
        require!(self.is_admin(&env::predecessor_account_id()), "Admin or owner only");
    }

    pub fn get_owners(&self) -> Vec<AccountId> {
        self.owners.iter().cloned().collect()
    }

    // ADDED: was in task, missing from code
    pub fn get_admins(&self) -> Vec<AccountId> {
        self.admins.iter().cloned().collect()
    }
}

`,

  JavaScriptExercise: `import { NearBindgen, call, view, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owners, admins } = { owners: [], admins: [] }) {
    this.owners = owners || [];
    this.admins = admins || [];
  }

  @call({})
  init({ initial_owner }) {
    this.owners.push(initial_owner);
  }

  is_owner(account) {
    return this.owners.includes(account);
  }

  is_admin(account) {
    return this.admins.includes(account) || this.is_owner(account);
  }

  @call({})
  add_owner({ account }) {
    // TODO: require caller is owner using near.predecessorAccountId()
    // TODO: add account to owners if not already present
  }

  @call({})
  remove_owner({ account }) {
    // TODO: require caller is owner
    // TODO: require can't remove last owner
    // TODO: remove account from owners
  }

  @call({})
  add_admin({ account }) {
    // TODO: require caller is owner
    // TODO: add account to admins if not already present
  }

  @call({})
  remove_admin({ account }) {
    // TODO: require caller is owner
    // TODO: remove account from admins
  }

  @call({})
  admin_only_action() {
    // TODO: require caller is admin OR owner
  }

  @view({})
  get_owners() {
    // TODO: return this.owners
    return [];
  }

  @view({})
  get_admins() {
    // TODO: return this.admins
    return [];
  }
}`,

  JavaScript: `import { NearBindgen, call, view, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owners, admins } = { owners: [], admins: [] }) {
    this.owners = owners || [];
    this.admins = admins || [];
  }

  @call({})
  init({ initial_owner }) {
    this.owners.push(initial_owner);
  }

  is_owner(account) {
    return this.owners.includes(account);
  }

  is_admin(account) {
    return this.admins.includes(account) || this.is_owner(account);
  }

  @call({})
  add_owner({ account }) {
    const caller = near.predecessorAccountId();
    require(this.is_owner(caller), "Only owner");
    if (!this.owners.includes(account)) {
      this.owners.push(account);
    }
  }

  @call({})
  remove_owner({ account }) {
    const caller = near.predecessorAccountId();
    require(this.is_owner(caller), "Only owner");
    require(this.owners.length > 1, "Cannot remove last owner");
    const index = this.owners.indexOf(account);
    if (index > -1) {
      this.owners.splice(index, 1);
    }
  }

  @call({})
  add_admin({ account }) {
    const caller = near.predecessorAccountId();
    require(this.is_owner(caller), "Only owner");
    if (!this.admins.includes(account)) {
      this.admins.push(account);
    }
  }

  @call({})
  remove_admin({ account }) {
    const caller = near.predecessorAccountId();
    require(this.is_owner(caller), "Only owner");
    const index = this.admins.indexOf(account);
    if (index > -1) {
      this.admins.splice(index, 1);
    }
  }

  @call({})
  admin_only_action() {
    const caller = near.predecessorAccountId();
    require(this.is_admin(caller), "Admin or owner only");
  }

  @view({})
  get_owners() {
    return this.owners;
  }

  @view({})
  get_admins() {
    return this.admins;
  }
}`,

  TheChallenge: `Your task is to implement a role-based access control (RBAC) contract.

**Requirements:**
- Store \`owners: UnorderedSet<AccountId>\` and \`admins: UnorderedSet<AccountId>\` using store API
- Implement \`new(initial_owner: AccountId)\` - sets first owner
- Implement \`add_owner(account: AccountId)\` - owner-only
- Implement \`remove_owner(account: AccountId)\` - owner-only, cannot remove last owner
- Implement \`add_admin(account: AccountId)\` - owner-only
- Implement \`remove_admin(account: AccountId)\` - owner-only
- Implement \`admin_only_action()\` - admin or owner can call
- Implement \`get_owners() -> Vec<AccountId>\` - view method
- Implement \`get_admins() -> Vec<AccountId>\` - view method

**Helper methods:**
- \`is_owner(account: &AccountId) -> bool\`
- \`is_admin(account: &AccountId) -> bool\` (admin OR owner)

**Test:** Verify only owners can add owners, admins can use admin_only_action`,

  Hints: `**The Problem:**
You need different access levels for different actions. Owners can do everything, admins can do some things, regular users can only do public actions.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::store::UnorderedSet;
use near_sdk::{env, AccountId, require, BorshStorageKey};
use near_sdk::PanicOnDefault;
use near_sdk::borsh::BorshSerialize;

#[derive(BorshSerialize, BorshStorageKey)]
#[borsh(crate = "near_sdk::borsh")]
pub enum StorageKey {
    Owners,
    Admins,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    admins: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(StorageKey::Owners);
        owners.insert(initial_owner);
        Self {
            owners,
            admins: UnorderedSet::new(StorageKey::Admins),
        }
    }

    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    fn is_admin(&self, account: &AccountId) -> bool {
        self.admins.contains(account) || self.is_owner(account)
    }

    pub fn add_owner(&mut self, account: AccountId) {
        // How to verify caller is owner first?
    }

    pub fn add_admin(&mut self, account: AccountId) {
        // How to verify caller is owner first?
    }

    pub fn admin_only_action(&mut self) {
        // How to check if caller is admin OR owner?
    }
}
\`\`\`

**Solution Hints:**
- Use \`store::UnorderedSet<AccountId>\` for each role (not collections API)
- Use \`BorshStorageKey\` enum with \`#[derive(BorshSerialize, BorshStorageKey)]\` and \`#[borsh(crate = "near_sdk::borsh")]\`
- Helper: \`fn is_owner(&self, account: &AccountId) -> bool { self.owners.contains(account) }\`
- Add: \`self.owners.insert(account)\` (takes ownership, not reference)
- Remove: \`self.owners.remove(&account)\` (remove takes reference)
- Get all: \`self.owners.iter().cloned().collect()\`
- Check: \`self.owners.contains(&account)\`

**Access patterns:**
- Owner-only: \`require!(self.is_owner(&env::predecessor_account_id()), "Only owner")\`
- Admin-or-owner: \`require!(self.is_admin(&env::predecessor_account_id()), "Admin or owner only")\`
- Public: no require needed

---

**Extension:** Add \`is_admin(account: AccountId)\` view method that returns whether the account has admin role.

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/best-practices)`,
};

export default roleBasedAccessCode;
