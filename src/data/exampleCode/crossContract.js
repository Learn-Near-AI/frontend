// Cross-contract call examples - uses NearPromise API (near-sdk-js)
export const crossContractCode = {
  'simple-calls': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise, NearToken, Gas};  // ✅ Add NearToken and Gas

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
    Rust: `use near_sdk::near;
use near_sdk::borsh::BorshDeserialize;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise, NearToken, Gas};  

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Call external contract, then callback to process the result.
    pub fn call_then_callback(&self, contract_id: AccountId) -> Promise {
        Promise::new(contract_id.clone())
            .function_call(
                "get_value".to_string(),           
                b"{}".to_vec(),                    
                NearToken::from_yoctonear(0),      
                Gas::from_tgas(10)                 
            )
            .then(                                  
                Promise::new(env::current_account_id())
                    .function_call(
                        "on_result".to_string(),    
                        b"{}".to_vec(),             
                        NearToken::from_yoctonear(0), 
                        Gas::from_tgas(10)          
                    )
            )
    }

    /// Callback: read promise_result(0), handle success/failure, return value.
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
    // Callback: read promise_result(0), handle success/failure like Rust
    try {
      const result = near.promiseResultRaw(0);
      if (result && result.length >= 8) {
        return Number(new DataView(result.buffer, result.byteOffset, 8).getBigUint64(0, true));
      }
    } catch (_) {
      // promiseResultRaw throws on failed promise
    }
    return 0;
  }
}

`,
  },
  'cross-call-ft': {
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise, NearToken, Gas};  

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
use near_sdk::{env, AccountId, Promise, NearToken, Gas};

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
    Rust: `use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::{env, AccountId, Promise, NearToken, Gas};  // ✅ Add NearToken and Gas

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Chained calls: execute contract_a, then contract_b (when first completes).
    /// Use then for sequential calls; use Promise::and for parallel.
    pub fn batch_call(&self, contract_a: AccountId, contract_b: AccountId) -> Promise {
        let gas_per_call = Gas::from_tgas(10);  // ✅ Changed from env::prepaid_gas() / 3
        
        Promise::new(contract_a)
            .function_call(
                "get_value".to_string(),          // ✅ Changed from b"get_value"
                b"{}".to_vec(),                   // ✅ Changed from b"{}" to Vec
                NearToken::from_yoctonear(0),     // ✅ Changed from 0
                gas_per_call
            )
            .then(                                 // ✅ Changed from and_then to then
                Promise::new(contract_b)
                    .function_call(
                        "get_value".to_string(),   // ✅ Changed from b"get_value"
                        b"{}".to_vec(),            // ✅ Changed from b"{}" to Vec
                        NearToken::from_yoctonear(0), // ✅ Changed from 0
                        gas_per_call
                    )
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

