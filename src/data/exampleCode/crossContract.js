// Cross-contract call examples - uses NearPromise API (near-sdk-js)
export const crossContractCode = {
  'simple-calls': {
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        // TODO: Create Promise::new(contract_id).function_call(method_name, empty_args, 0 deposit, 5 TGas)
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_other_contract({ contract_id, method_name }) {
    // TODO: Create NearPromise.new(contract_id).functionCall(method_name, empty_args, 0n, gas)
    // TODO: Return the promise with .asReturn()
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
                method_name,
                b"{}".to_vec(),
                NearToken::from_yoctonear(0),
                Gas::from_tgas(5),
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
    RustExercise: `use near_sdk::near;
use near_sdk::borsh::BorshDeserialize;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        // TODO: Call get_value on contract_id
        // TODO: Chain a callback to on_result on self via .then()
        let _: u64 = ();
    }

    pub fn on_result(&self) -> u64 {
        // TODO: Read env::promise_result(0)
        // TODO: Return the u64 value on success, 0 on failure
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  call_then_callback({ contract_id }) {
    // TODO: Create NearPromise.new(contract_id).functionCall("get_value", args, 0n, gas)
    // TODO: Chain .then(NearPromise.new(near.currentAccountId()).functionCall("on_result", args, 0n, gas))
    // TODO: Return with .asReturn()
  }

  @call({})
  on_result() {
    // TODO: Read near.promiseResultRaw(0) and parse u64
    // TODO: Return 0 on failure
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::borsh::BorshDeserialize;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
            .function_call(
                "get_value".to_string(),
                b"{}".to_vec(),
                NearToken::from_yoctonear(0),
                Gas::from_tgas(10),
            )
            .then(
                Promise::new(env::current_account_id())
                    .function_call(
                        "on_result".to_string(),
                        b"{}".to_vec(),
                        NearToken::from_yoctonear(0),
                        Gas::from_tgas(10),
                    ),
            )
    }

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
    try {
      const result = near.promiseResultRaw(0);
      if (result && result.length >= 8) {
        return Number(new DataView(result.buffer, result.byteOffset, 8).getBigUint64(0, true));
      }
    } catch (_) {}
    return 0;
  }
}

`,
  },
  'cross-call-ft': {
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        // TODO: Format args as JSON: receiver_id, amount (string), memo (null)
        // TODO: Call ft_transfer on token_contract with 1 yoctoNEAR deposit
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  ft_transfer_call({ token_contract, receiver_id, amount }) {
    // TODO: Format args as JSON: receiver_id, amount, memo (null)
    // TODO: Create NearPromise.new(token_contract).functionCall("ft_transfer", args, 1n, gas)
    // TODO: Return with .asReturn()
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        let args = format!(
            r#"{{"receiver_id":"{}","amount":"{}","memo":null}}"#,
            receiver_id, amount
        );
        Promise::new(token_contract)
            .function_call(
                "ft_transfer".to_string(),
                args.into_bytes(),
                NearToken::from_yoctonear(1),
                Gas::from_tgas(10),
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  ft_transfer_call({ token_contract, receiver_id, amount }) {
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
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        // TODO: Format args as JSON: receiver_id, token_id, memo (null), msg ("")
        // TODO: Call nft_transfer_call on nft_contract with 1 yoctoNEAR deposit
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  nft_transfer_call({ nft_contract, receiver_id, token_id }) {
    // TODO: Format args as JSON: receiver_id, token_id, memo (null), msg ("")
    // TODO: Create NearPromise.new(nft_contract).functionCall("nft_transfer_call", args, 1n, gas)
    // TODO: Return with .asReturn()
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
                "nft_transfer_call".to_string(),
                args.into_bytes(),
                NearToken::from_yoctonear(1),
                Gas::from_tgas(10),
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
    RustExercise: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        // TODO: Call get_value on contract_a
        // TODO: Chain a second call to get_value on contract_b via .then()
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  batch_call({ contract_a, contract_b }) {
    // TODO: Create NearPromise.new(contract_a).functionCall("get_value", args, 0n, gas)
    // TODO: Chain .then(NearPromise.new(contract_b).functionCall("get_value", args, 0n, gas))
    // TODO: Return with .asReturn()
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Gas, NearToken, Promise};

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
        let gas_per_call = Gas::from_tgas(10);

        Promise::new(contract_a)
            .function_call(
                "get_value".to_string(),
                b"{}".to_vec(),
                NearToken::from_yoctonear(0),
                gas_per_call,
            )
            .then(
                Promise::new(contract_b)
                    .function_call(
                        "get_value".to_string(),
                        b"{}".to_vec(),
                        NearToken::from_yoctonear(0),
                        gas_per_call,
                    ),
            )
    }
}`,
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  batch_call({ contract_a, contract_b }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 3));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_a)
      .functionCall("get_value", args, 0n, gas)
      .then(NearPromise.new(contract_b).functionCall("get_value", args, 0n, gas))
      .asReturn();
  }
}

`,
  },
}
