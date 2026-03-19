export const upgradePatternCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    data_version: u32,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 1,
            value: 0,
        }
    }

    // TODO: Add #[init(ignore_state)] upgrade() function that:
    // - Sets owner_id to env::current_account_id()
    // - Sets data_version to 2
    // - Sets paused to false
    // - Sets value to 0

    pub fn pause(&mut self) {
        // TODO: Require caller is owner
        // TODO: Set paused to true
        todo!()
    }

    pub fn unpause(&mut self) {
        // TODO: Require caller is owner
        // TODO: Set paused to false
        todo!()
    }

    pub fn migrate(&mut self) {
        // TODO: Require caller is owner
        // TODO: Increment data_version by 1
        todo!()
    }

    pub fn set_value(&mut self, value: u64) {
        // TODO: Require contract is not paused
        // TODO: Set self.value
        todo!()
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }

    pub fn get_version(&self) -> u32 {
        // TODO: Return data_version
        todo!()
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    data_version: u32,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 1,
            value: 0,
        }
    }

    #[init(ignore_state)]
    pub fn upgrade() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 2,
            value: 0,
        }
    }

    pub fn pause(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.paused = true;
    }

    pub fn unpause(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.paused = false;
    }

    pub fn migrate(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner");
        self.data_version += 1;
    }

    pub fn set_value(&mut self, value: u64) {
        require!(!self.paused, "Contract is paused");
        self.value = value;
    }

    pub fn get_value(&self) -> u64 {
        self.value
    }

    pub fn get_version(&self) -> u32 {
        self.data_version
    }
}

`,

  JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, data_version, value } = {}) {
    this.owner_id = owner_id || near.currentAccountId();
    this.paused = paused || false;
    this.data_version = data_version || 1;
    this.value = value || 0;
  }

  @call({})
  pause() {
    // TODO: require caller is owner, set this.paused = true
  }

  @call({})
  unpause() {
    // TODO: require caller is owner, set this.paused = false
  }

  @call({})
  migrate() {
    // TODO: require caller is owner, increment this.data_version
  }

  @call({})
  set_value({ value }) {
    // TODO: require not paused, set this.value
  }

  @view({})
  get_value() {
    return this.value;
  }

  @view({})
  get_version() {
    // TODO: return this.data_version
    return 0;
  }
}`,

  JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, data_version, value } = {}) {
    this.owner_id = owner_id || near.currentAccountId();
    this.paused = paused || false;
    this.data_version = data_version || 1;
    this.value = value || 0;
  }

  @call({})
  pause() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner");
    }
    this.paused = true;
  }

  @call({})
  unpause() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner");
    }
    this.paused = false;
  }

  @call({})
  migrate() {
    if (near.predecessorAccountId() !== this.owner_id) {
      near.panic("Only owner");
    }
    this.data_version += 1;
  }

  @call({})
  set_value({ value }) {
    if (this.paused) {
      near.panic("Contract is paused");
    }
    this.value = value;
  }

  @view({})
  get_value() {
    return this.value;
  }

  @view({})
  get_version() {
    return this.data_version;
  }
}`,

  TheChallenge: `Your task is to implement a pausable upgradeable contract.

**Requirements:**
- Store \`owner_id: AccountId\`, \`paused: bool\`, \`data_version: u32\`, \`value: u64\`
- Implement \`new()\` - initializes with data_version: 1
- Implement \`upgrade()\` with \`#[init(ignore_state)]\` - constructs fresh state with data_version: 2, paused: false, value: 0. Old state is discarded.
- Implement \`pause()\`, \`unpause()\` - owner only
- Implement \`migrate()\` - owner only, increments data_version
- Implement \`set_value()\` - only when not paused
- Implement \`get_value()\` and \`get_version()\` - view methods

**Key:** \`#[init(ignore_state)]\` goes inside the #[near] impl block!

**Test:** Call pause(), then upgrade() — data_version should be 2 and value should reset to 0!`,

  Hints: `**The Problem:**
You need a contract that can be paused for upgrades, with state migration support.

**Code Snippet:**
\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    data_version: u32,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            data_version: 1,
            value: 0,
        }
    }

    #[init(ignore_state)]
    pub fn upgrade() -> Self {
        // TODO: Return new state with updated version
    }

    pub fn pause(&mut self) {
        // TODO: require owner, set paused = true
    }

    pub fn set_value(&mut self, value: u64) {
        // TODO: require not paused
    }
}
\`\`\`

**Solution Hints:**
- Pause check: \`require!(!self.paused, "Contract is paused")\` in change methods
- Owner check: \`require!(env::predecessor_account_id() == self.owner_id, "Only owner")\`
- Upgrade: Use \`#[init(ignore_state)]\` INSIDE the #[near] impl block - state is preserved
- Migration: increment \`data_version\` in \`migrate()\` function

**Upgrade flow:**
1. Owner calls \`pause()\`
2. Deploy new WASM via \`near deploy --init-function upgrade\`
3. Owner calls \`migrate()\` if needed
4. Owner calls \`unpause()\`

**Key:** \`#[init(ignore_state)]\` allows deploying new code without re-initializing state.

---

**Extension:** Add a \`version()\` view method that returns the current data_version.

---

For production migrations that preserve existing state, see the migration pattern in docs

[Learn more about this topic →](https://docs.near.org/smart-contracts/release/upgrade)`,
};

export default upgradePatternCode;
