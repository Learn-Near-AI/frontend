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
};

export default eventsCode;
