export const pausableContractCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            counter: 0,
        }
    }

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

    pub fn increment(&mut self) {
        // TODO: Require contract is not paused
        // TODO: Increment counter by 1
        todo!()
    }

    pub fn get_counter(&self) -> u64 {
        // TODO: Return counter
        todo!()
    }
}`,

  JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, counter } = {}) {
    this.owner_id = owner_id || near.currentAccountId();
    this.paused = paused || false;
    this.counter = counter || 0;
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
  increment() {
    // TODO: require not paused, increment this.counter
  }

  @view({})
  get_counter() {
    // TODO: return this.counter
    return 0;
  }
}`,

  Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault, require};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    paused: bool,
    counter: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            paused: false,
            counter: 0,
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

    pub fn increment(&mut self) {
        require!(!self.paused, "Contract is paused");
        self.counter += 1;
    }

    pub fn get_counter(&self) -> u64 {
        self.counter
    }
}

`,

  JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ owner_id, paused, counter } = {}) {
    this.owner_id = owner_id || near.currentAccountId();
    this.paused = paused || false;
    this.counter = counter || 0;
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
  increment() {
    if (this.paused) {
      near.panic("Contract is paused");
    }
    this.counter += 1;
  }

  @view({})
  get_counter() {
    return this.counter;
  }
}`,

  TheChallenge: `Your task is to implement a pausable contract.

**Requirements:**
- Store \`owner_id: AccountId\`, \`paused: bool\`, \`counter: u64\`
- Implement \`pause()\` - owner only, sets paused = true
- Implement \`unpause()\` - owner only, sets paused = false
- Implement \`increment()\` - only when NOT paused
- Implement \`get_counter() -> u64\` - view method

**Test:** increment works normally, but panics when paused`,

  Hints: `**The Problem:**
You need a contract that can be paused for emergencies, preventing state changes.

**Solution Hints:**
- Owner check: \`require!(env::predecessor_account_id() == self.owner_id, "Only owner")\`
- Pause check: \`require!(!self.paused, "Contract is paused")\`

**Rust:**
\`\`\`rust
pub fn increment(&mut self) {
    require!(!self.paused, "Contract is paused");
    self.counter += 1;
}
\`\`\`

**JavaScript:**
\`\`\`javascript
increment() {
    if (this.paused) {
      near.panic("Contract is paused");
    }
    this.counter += 1;
}
\`\`\`

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/access-control)`,
};

export default pausableContractCode;
