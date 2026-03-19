export const eventsCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};

#[near(event_json(standard = "my-project"))]
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
}

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

    pub fn set_message(&mut self, msg: String) {
        // TODO: Store the old message
        // TODO: Update message to new value
        // TODO: Emit MessageUpdated event with old_message, new_message, updated_by
        todo!()
    }

    pub fn delete_message(&mut self) {
        // TODO: Store the deleted message
        // TODO: Clear message to empty string
        // TODO: Emit MessageDeleted event with deleted_message, deleted_by
        todo!()
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};

#[near(event_json(standard = "my-project"))]
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
}

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

    pub fn set_message(&mut self, msg: String) {
        let old = self.message.clone();
        self.message = msg.clone();
        Event::MessageUpdated {
            old_message: old,
            new_message: msg,
            updated_by: env::predecessor_account_id(),
        }.emit();
    }

    pub fn delete_message(&mut self) {
        let deleted = self.message.clone();
        self.message = String::new();
        Event::MessageDeleted {
            deleted_message: deleted,
            deleted_by: env::predecessor_account_id(),
        }.emit();
    }
}`,

  JavaScriptExercise: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "initial" }) {
    this.message = message || "initial";
  }

  @call({})
  set_message({ msg }) {
    // TODO: store old message, update this.message
    // TODO: emit event with near.log(JSON.stringify({...}))
  }

  @call({})
  delete_message() {
    // TODO: store deleted message, clear this.message
    // TODO: emit event
  }
}`,

  JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ message } = { message: "initial" }) {
    this.message = message || "initial";
  }

  @call({})
  set_message({ msg }) {
    const old = this.message;
    this.message = msg;
    near.log(JSON.stringify({
      standard: "my-project",
      version: "1.0.0",
      event: "message_updated",
      data: { old_message: old, new_message: msg, updated_by: near.predecessorAccountId() }
    }));
  }

  @call({})
  delete_message() {
    const deleted = this.message;
    this.message = "";
    near.log(JSON.stringify({
      standard: "my-project",
      version: "1.0.0",
      event: "message_deleted",
      data: { deleted_message: deleted, deleted_by: near.predecessorAccountId() }
    }));
  }
}`,

  TheChallenge: `Your task is to implement events for a contract.

**Requirements:**
- Define Event enum with \`#[near(event_json(standard = "..."))]\`
- Implement \`MessageUpdated\` event with old_message, new_message, updated_by
- Implement \`MessageDeleted\` event with deleted_message, deleted_by
- Implement \`set_message(msg: String)\` - updates message and emits event
- Implement \`delete_message()\` - clears message and emits event

**Key:** Use \`.emit()\` on the event variant to log it`,

  Hints: `**The Problem:**
You need to emit events when state changes so off-chain applications can track them.

**Code Snippet:**
\`\`\`rust
#[near(event_json(standard = "my-project"))]
pub enum Event {
    #[event_version("1.0.0")]
    MessageUpdated {
        old_message: String,
        new_message: String,
        updated_by: AccountId,
    },
}
\`\`\`

**Solution Hints:**
- Define enum with \`#[near(event_json(standard = "name"))]\`
- Each variant needs \`#[event_version("x.y.z")]\`
- Emit: \`Event::Variant { fields }.emit()\`
- Get caller: \`env::predecessor_account_id()\`
- Clone before modifying: \`let old = self.message.clone()\`

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/events)`,
};

export default eventsCode;
