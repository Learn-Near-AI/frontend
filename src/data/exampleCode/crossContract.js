// Cross-contract call examples
export const crossContractCode = {
  'simple-calls': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn call_other_contract(&self, contract_id: AccountId, method_name: String) -> Promise {
        Promise::new(contract_id)
            .function_call(
                method_name.as_bytes(),
                b"{}",
                0,
                env::prepaid_gas() / 2,
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_other_contract({ contract_id, method_name }) {
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall(
        method_name,
        JSON.stringify({}),
        0,
        near.prepaidGas() / 2
      ));
  }
}

`,
  },
  'promises': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn create_promise(&self, contract_id: AccountId) -> Promise {
        Promise::new(contract_id)
            .function_call(
                b"get_value",
                b"{}",
                0,
                env::prepaid_gas() / 2,
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  create_promise({ contract_id }) {
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall(
        "get_value",
        JSON.stringify({}),
        0,
        near.prepaidGas() / 2
      ));
  }
}

`,
  },
  'callbacks': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn call_then_callback(&self, contract_id: AccountId) -> Promise {
        Promise::new(contract_id.clone())
            .function_call(b"get_value", b"{}", 0, env::prepaid_gas() / 3)
            .and_then(
                Promise::new(env::current_account_id())
                    .function_call(b"on_result", b"{}", 0, env::prepaid_gas() / 3),
            )
    }

    pub fn on_result(&self) -> u64 {
        env::value_return(b"1");
        1
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_then_callback({ contract_id }) {
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall("get_value", "{}", 0, near.prepaidGas() / 3))
      .then(near.promiseBatchCreate(near.currentAccountId()))
      .then(near.promiseBatchActionFunctionCall("on_result", "{}", 0, near.prepaidGas() / 3));
  }

  @call({})
  on_result() {
    return 1;
  }
}

`,
  },
  'cross-call-ft': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn ft_transfer_call(&self, token_contract: AccountId, receiver_id: AccountId, amount: String) -> Promise {
        let args = format!(r#"{{"receiver_id":"{}","amount":"{}","memo":null}}"#, receiver_id, amount);
        Promise::new(token_contract)
            .function_call(
                b"ft_transfer",
                args.into_bytes(),
                1,
                env::prepaid_gas() / 2,
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  ft_transfer_call({ token_contract, receiver_id, amount }) {
    const args = JSON.stringify({ receiver_id, amount, memo: null });
    return near.promiseBatchCreate(token_contract)
      .then(near.promiseBatchActionFunctionCall("ft_transfer", args, 1, near.prepaidGas() / 2));
  }
}

`,
  },
  'cross-call-nft': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn nft_transfer_call(&self, nft_contract: AccountId, receiver_id: AccountId, token_id: String) -> Promise {
        let args = format!(
            r#"{{"receiver_id":"{}","token_id":"{}","memo":null,"msg":""}}"#,
            receiver_id, token_id
        );
        Promise::new(nft_contract)
            .function_call(
                b"nft_transfer_call",
                args.into_bytes(),
                1,
                env::prepaid_gas() / 2,
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  nft_transfer_call({ nft_contract, receiver_id, token_id }) {
    const args = JSON.stringify({
      receiver_id,
      token_id,
      memo: null,
      msg: "",
    });
    return near.promiseBatchCreate(nft_contract)
      .then(near.promiseBatchActionFunctionCall("nft_transfer_call", args, 1, near.prepaidGas() / 2));
  }
}

`,
  },
  'batch-calls': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn batch_call(&self, contract_a: AccountId, contract_b: AccountId) -> Promise {
        let gas_per_call = env::prepaid_gas() / 3;
        Promise::new(contract_a)
            .function_call(b"get_value", b"{}", 0, gas_per_call)
            .and_then(
                Promise::new(contract_b)
                    .function_call(b"get_value", b"{}", 0, gas_per_call),
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  batch_call({ contract_a, contract_b }) {
    const gas = Math.floor(near.prepaidGas() / 3);
    return near.promiseBatchCreate(contract_a)
      .then(near.promiseBatchActionFunctionCall("get_value", "{}", 0, gas))
      .then(near.promiseBatchCreate(contract_b))
      .then(near.promiseBatchActionFunctionCall("get_value", "{}", 0, gas));
  }
}

`,
  },
  'promise-results': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn call_and_check(&self, contract_id: AccountId) -> Promise {
        Promise::new(contract_id)
            .function_call(b"get_value", b"{}", 0, env::prepaid_gas() / 2)
            .then(
                Promise::new(env::current_account_id())
                    .function_call(b"handle_result", b"{}", 0, env::prepaid_gas() / 2),
            )
    }

    pub fn handle_result(&self) -> bool {
        match env::promise_result(0) {
            near_sdk::PromiseResult::Successful(_) => true,
            _ => false,
        }
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_and_check({ contract_id }) {
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall("get_value", "{}", 0, near.prepaidGas() / 2))
      .then(near.promiseBatchCreate(near.currentAccountId()))
      .then(near.promiseBatchActionFunctionCall("handle_result", "{}", 0, near.prepaidGas() / 2));
  }

  @call({})
  handle_result() {
    const result = near.promiseResult(0);
    return result !== null && result !== undefined;
  }
}

`,
  },
  'async-patterns': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn chain_promises(&self, contract_id: AccountId) -> Promise {
        let gas = env::prepaid_gas() / 4;
        Promise::new(contract_id.clone())
            .function_call(b"step1", b"{}", 0, gas)
            .and_then(
                Promise::new(contract_id)
                    .function_call(b"step2", b"{}", 0, gas),
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  chain_promises({ contract_id }) {
    const gas = Math.floor(near.prepaidGas() / 4);
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall("step1", "{}", 0, gas))
      .then(near.promiseBatchCreate(contract_id))
      .then(near.promiseBatchActionFunctionCall("step2", "{}", 0, gas));
  }
}

`,
  },
  'callback-patterns': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn call_with_callback(&self, target: AccountId) -> Promise {
        let current = env::current_account_id();
        Promise::new(target)
            .function_call(b"compute", b"{}", 0, env::prepaid_gas() / 2)
            .and_then(
                Promise::new(current)
                    .function_call(b"on_compute_done", b"{}", 0, env::prepaid_gas() / 2),
            )
    }

    pub fn on_compute_done(&self) {
        env::log_str("Callback received");
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_with_callback({ target }) {
    const current = near.currentAccountId();
    return near.promiseBatchCreate(target)
      .then(near.promiseBatchActionFunctionCall("compute", "{}", 0, near.prepaidGas() / 2))
      .then(near.promiseBatchCreate(current))
      .then(near.promiseBatchActionFunctionCall("on_compute_done", "{}", 0, near.prepaidGas() / 2));
  }

  @call({})
  on_compute_done() {
    near.log("Callback received");
  }
}

`,
  },
  'error-propagation': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn call_may_fail(&self, contract_id: AccountId) -> Promise {
        Promise::new(contract_id)
            .function_call(b"risky", b"{}", 0, env::prepaid_gas() / 2)
            .then(
                Promise::new(env::current_account_id())
                    .function_call(b"on_result", b"{}", 0, env::prepaid_gas() / 2),
            )
    }

    pub fn on_result(&self) -> bool {
        match env::promise_result(0) {
            near_sdk::PromiseResult::Successful(_) => true,
            near_sdk::PromiseResult::Failed => false,
            _ => false,
        }
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_may_fail({ contract_id }) {
    return near.promiseBatchCreate(contract_id)
      .then(near.promiseBatchActionFunctionCall("risky", "{}", 0, near.prepaidGas() / 2))
      .then(near.promiseBatchCreate(near.currentAccountId()))
      .then(near.promiseBatchActionFunctionCall("on_result", "{}", 0, near.prepaidGas() / 2));
  }

  @call({})
  on_result() {
    try {
      const r = near.promiseResult(0);
      return r !== null && r !== undefined;
    } catch {
      return false;
    }
  }
}

`,
  },
}

