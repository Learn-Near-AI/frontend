// Cross-contract call examples - uses NearPromise API (near-sdk-js)
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
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_other_contract({ contract_id, method_name }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(contract_id)
      .functionCall(method_name, bytes(JSON.stringify({})), 0n, gas)
      .asReturn();
  }
}

`,
  },
  'callbacks': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::BorshDeserialize;
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

    /// Callback: read result from promise_result(0), deserialize, and return
    pub fn on_result(&self) -> u64 {
        match env::promise_result(0) {
            near_sdk::PromiseResult::Successful(data) => {
                u64::try_from_slice(&data).unwrap_or(0)
            }
            _ => 0,
        }
    }
}`,
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_then_callback({ contract_id }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 3));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_id)
      .functionCall("get_value", args, 0n, gas)
      .then(NearPromise.new(near.currentAccountId()).functionCall("on_result", args, 0n, gas))
      .asReturn();
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

    /// NEP-141: amount must be string in smallest unit (e.g. "1000000" for 1 token, 6 decimals)
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
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  ft_transfer_call({ token_contract, receiver_id, amount }) {
    // NEP-141: amount must be string in smallest unit (e.g. "1000000" for 1 token, 6 decimals)
    const args = bytes(JSON.stringify({ receiver_id, amount, memo: null }));
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(token_contract)
      .functionCall("ft_transfer", args, 1n, gas)
      .asReturn();
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
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  nft_transfer_call({ nft_contract, receiver_id, token_id }) {
    const args = bytes(JSON.stringify({
      receiver_id,
      token_id,
      memo: null,
      msg: "",
    }));
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(nft_contract)
      .functionCall("nft_transfer_call", args, 1n, gas)
      .asReturn();
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
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_and_check({ contract_id }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_id)
      .functionCall("get_value", args, 0n, gas)
      .then(NearPromise.new(near.currentAccountId()).functionCall("handle_result", args, 0n, gas))
      .asReturn();
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
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  chain_promises({ contract_id }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 4));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_id)
      .functionCall("step1", args, 0n, gas)
      .then(NearPromise.new(contract_id).functionCall("step2", args, 0n, gas))
      .asReturn();
  }
}

`,
  },
}

