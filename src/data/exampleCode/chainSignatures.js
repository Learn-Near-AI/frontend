// Chain Signatures examples - NEAR MPC-based cross-chain signing
// MPC contract: v1.signer (mainnet) / v1.signer-prod.testnet (testnet)
export const chainSignaturesCode = {
  'chain-signatures-basics': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::Serialize;
use near_sdk::{env, ext_contract, Gas, NearToken, PanicOnDefault, Promise};

const MPC_CONTRACT: &str = "v1.signer-prod.testnet";
const GAS: Gas = Gas::from_tgas(250);
const ATTACHED_DEPOSIT: NearToken = NearToken::from_yoctonear(50_000_000_000_000_000_000_000);

#[derive(Serialize, BorshSerialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[ext_contract(mpc)]
trait MPC {
    fn sign(&self, request: SignRequest) -> Promise;
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Request MPC to sign a 32-byte payload. Path derives the target chain address.
    /// Caller must attach ~0.05 NEAR for MPC fee. Returns a Promise that resolves to the signature.
    #[payable]
    pub fn request_signature(&mut self, payload: [u8; 32], path: String, key_version: u32) -> Promise {
        let request = SignRequest { payload, path, key_version };
        mpc::ext(MPC_CONTRACT.parse().unwrap())
            .with_static_gas(GAS)
            .with_attached_deposit(ATTACHED_DEPOSIT)
            .sign(request)
    }
}`,
    JavaScript: `import { NearBindgen, call, near, NearPromise, bytes } from "near-sdk-js";

// Chain signatures: call MPC contract to sign payloads for other chains.
// MPC: v1.signer-prod.testnet (testnet) / v1.signer (mainnet)
// Caller must attach ~0.05 NEAR for MPC fee.
const MPC_CONTRACT = "v1.signer-prod.testnet";
const MPC_DEPOSIT = BigInt("50000000000000000000000");
const MPC_GAS = BigInt("250000000000000");

@NearBindgen({})
class Contract {
  @call({ payable: true })
  request_signature({ payload, path, key_version }) {
    const request = { payload, path: path || "ethereum-1", key_version: key_version ?? 0 };
    return NearPromise.new(MPC_CONTRACT)
      .functionCall("sign", bytes(JSON.stringify(request)), MPC_DEPOSIT, MPC_GAS)
      .asReturn();
  }
}`,
  },
  'signature-verification': {
    Rust: `use near_sdk::near;
use near_sdk::{env, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Validate payload before sending to MPC: must be exactly 32 bytes (e.g. keccak256 hash).
    pub fn validate_payload(&self, payload: Vec<u8>) -> bool {
        payload.len() == 32
    }

    /// Hash a message for signing. MPC signs the hash; verification happens on the destination chain.
    pub fn hash_for_signing(&self, message: Vec<u8>) -> [u8; 32] {
        env::keccak256_array(&message)
    }
}`,
    JavaScript: `import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  validate_payload({ payload }) {
    return Array.isArray(payload) && payload.length === 32;
  }

  @view({})
  hash_for_signing({ message }) {
    // MPC signs the 32-byte hash; verification happens on the destination chain
    const msg = message ? new Uint8Array(message) : new Uint8Array(0);
    return Array.from(near.keccak256(msg));
  }
}`,
  },
  'signature-requests': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::{Serialize, Deserialize};
use near_sdk::{env, ext_contract, Gas, NearToken, PanicOnDefault, Promise};

#[derive(Serialize, BorshSerialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[near(serializers = [json, borsh])]
pub struct RequestRecord {
    pub payload: [u8; 32],
    pub path: String,
    pub status: String,
}

#[ext_contract(mpc)]
trait MPC {
    fn sign(&self, request: SignRequest) -> Promise;
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    requests: UnorderedMap<String, RequestRecord>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { requests: UnorderedMap::new(b"r") }
    }

    pub fn create_request(&mut self, request_id: String, payload: [u8; 32], path: String) {
        self.requests.insert(&request_id, &RequestRecord {
            payload,
            path: path.clone(),
            status: "pending".to_string(),
        });
    }

    pub fn get_request(&self, request_id: String) -> Option<RequestRecord> {
        self.requests.get(&request_id)
    }

    #[payable]
    pub fn sign_request(&mut self, request_id: String, key_version: u32) -> Promise {
        let record = self.requests.get(&request_id).expect("Request not found");
        let req = SignRequest { payload: record.payload, path: record.path, key_version };
        mpc::ext("v1.signer-prod.testnet".parse().unwrap())
            .with_static_gas(Gas::from_tgas(250))
            .with_attached_deposit(NearToken::from_yoctonear(50_000_000_000_000_000_000_000))
            .sign(req)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ requests } = { requests: {} }) {
    this.requests = requests || {};
  }

  @call({})
  create_request({ request_id, payload, path }) {
    if (!payload || !Array.isArray(payload) || payload.length !== 32) near.panic("Payload must be 32 bytes");
    this.requests[request_id] = { payload, path: path || "ethereum-1", status: "pending" };
  }

  @view({})
  get_request({ request_id }) {
    return this.requests[request_id] ?? null;
  }

  @call({ payable: true })
  sign_request({ request_id, key_version }) {
    const r = this.requests[request_id];
    if (!r) near.panic("Request not found");
    const req = { payload: r.payload, path: r.path, key_version: key_version ?? 0 };
    return NearPromise.new("v1.signer-prod.testnet")
      .functionCall("sign", bytes(JSON.stringify(req)), BigInt("50000000000000000000000"), BigInt("250000000000000"))
      .asReturn();
  }
}`,
  },
  'multi-chain-signing': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::serde::Serialize;
use near_sdk::{ext_contract, Gas, NearToken, PanicOnDefault, Promise};

#[derive(Serialize, BorshSerialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[ext_contract(mpc)]
trait MPC {
    fn sign(&self, request: SignRequest) -> Promise;
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    chain_paths: UnorderedMap<String, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        let mut paths = UnorderedMap::new(b"p");
        paths.insert(&"ethereum".to_string(), &"ethereum-1".to_string());
        paths.insert(&"bitcoin".to_string(), &"bitcoin-1".to_string());
        paths.insert(&"solana".to_string(), &"solana-1".to_string());
        Self { chain_paths: paths }
    }

    pub fn set_chain_path(&mut self, chain_id: String, path: String) {
        self.chain_paths.insert(&chain_id, &path);
    }

    pub fn get_chain_path(&self, chain_id: String) -> Option<String> {
        self.chain_paths.get(&chain_id)
    }

    #[payable]
    pub fn sign_for_chain(&mut self, chain_id: String, payload: [u8; 32], key_version: u32) -> Promise {
        let path = self.chain_paths.get(&chain_id).unwrap_or_else(|| "ethereum-1".to_string());
        let req = SignRequest { payload, path, key_version };
        mpc::ext("v1.signer-prod.testnet".parse().unwrap())
            .with_static_gas(Gas::from_tgas(250))
            .with_attached_deposit(NearToken::from_yoctonear(50_000_000_000_000_000_000_000))
            .sign(req)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ chain_paths } = { chain_paths: {} }) {
    this.chain_paths = chain_paths || { ethereum: "ethereum-1", bitcoin: "bitcoin-1", solana: "solana-1" };
  }

  @call({})
  set_chain_path({ chain_id, path }) {
    this.chain_paths[chain_id] = path;
  }

  @view({})
  get_chain_path({ chain_id }) {
    return this.chain_paths[chain_id] ?? null;
  }

  @call({ payable: true })
  sign_for_chain({ chain_id, payload, key_version }) {
    const path = this.chain_paths[chain_id] || "ethereum-1";
    const req = { payload, path, key_version: key_version ?? 0 };
    return NearPromise.new("v1.signer-prod.testnet")
      .functionCall("sign", bytes(JSON.stringify(req)), BigInt("50000000000000000000000"), BigInt("250000000000000"))
      .asReturn();
  }
}`,
  },
  'cross-chain-auth': {
    Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    authorized: UnorderedSet<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { authorized: UnorderedSet::new(b"a") }
    }

    pub fn authorize_cross_chain(&mut self, external_id: String) {
        self.authorized.insert(&external_id);
        env::log_str("Cross-chain identity authorized");
    }

    pub fn revoke_cross_chain(&mut self, external_id: String) {
        self.authorized.remove(&external_id);
    }

    pub fn is_authorized(&self, external_id: String) -> bool {
        self.authorized.contains(&external_id)
    }

    /// Gate: only authorized external identities can trigger cross-chain actions.
    pub fn require_authorized(&self, external_id: String) {
        near_sdk::require!(self.authorized.contains(&external_id), "Not authorized for cross-chain");
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ authorized } = { authorized: [] }) {
    this.authorized = authorized || [];
  }

  @call({})
  authorize_cross_chain({ external_id }) {
    if (!this.authorized.includes(external_id)) this.authorized.push(external_id);
    near.log("Cross-chain identity authorized");
  }

  @call({})
  revoke_cross_chain({ external_id }) {
    this.authorized = this.authorized.filter((x) => x !== external_id);
  }

  @view({})
  is_authorized({ external_id }) {
    return this.authorized.includes(external_id);
  }

  require_authorized(external_id) {
    if (!this.authorized.includes(external_id)) near.panic("Not authorized for cross-chain");
  }
}`,
  },
  'signature-callbacks': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::LookupMap;
use near_sdk::serde::Serialize;
use near_sdk::{env, ext_contract, Gas, NearToken, PanicOnDefault, Promise};

#[derive(Serialize, BorshSerialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[ext_contract(mpc)]
trait MPC {
    fn sign(&self, request: SignRequest) -> Promise;
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signatures: LookupMap<String, Vec<u8>>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { signatures: LookupMap::new(b"s") }
    }

    /// Request sign, then callback to store the result. MPC returns signature bytes.
    #[payable]
    pub fn request_sign_and_store(&mut self, request_id: String, payload: [u8; 32], path: String, key_version: u32) -> Promise {
        let req = SignRequest { payload, path, key_version };
        let account = env::current_account_id();
        let args = format!(r#"{{"request_id":"{}"}}"#, request_id.replace('"', "\\\""));  // ✅ Fixed escape
        
        mpc::ext("v1.signer-prod.testnet".parse().unwrap())
            .with_static_gas(Gas::from_tgas(250))
            .with_attached_deposit(NearToken::from_yoctonear(50_000_000_000_000_000_000_000))
            .sign(req)
            .then(  
                Promise::new(account)
                    .function_call(
                        "on_signature_ready".to_string(),  
                        args.as_bytes().to_vec(),          
                        NearToken::from_yoctonear(0),      
                        Gas::from_tgas(50)
                    )
            )
    }

    /// Callback: MPC returns raw signature bytes. If MPC format differs (e.g. JSON),
    /// adjust deserialization accordingly.
    pub fn on_signature_ready(&mut self, request_id: String) {
        match near_sdk::env::promise_result(0) {
            near_sdk::PromiseResult::Successful(sig) if !sig.is_empty() => {
                self.signatures.insert(&request_id, &sig);
                env::log_str("Signature stored");
            }
            _ => env::log_str("Signature failed"),
        }
    }

    pub fn get_signature(&self, request_id: String) -> Option<Vec<u8>> {
        self.signatures.get(&request_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ signatures } = { signatures: {} }) {
    this.signatures = signatures || {};
  }

  @call({})
  request_sign_and_store({ request_id, payload, path, key_version }) {
    const req = { payload, path: path || "ethereum-1", key_version: key_version ?? 0 };
    const account = near.currentAccountId();
    const gas = BigInt("50000000000000");
    const deposit = BigInt("50000000000000000000000");
    const mpcGas = BigInt("250000000000000");
    return NearPromise.new("v1.signer-prod.testnet")
      .functionCall("sign", bytes(JSON.stringify(req)), deposit, mpcGas)
      .then(NearPromise.new(account).functionCall("on_signature_ready", bytes(JSON.stringify({ request_id })), 0n, gas))
      .asReturn();
  }

  @call({})
  on_signature_ready({ request_id }) {
    // MPC returns raw signature bytes; if format differs (e.g. JSON), adjust parsing
    const result = near.promiseResult(0);
    if (result && (result.length ?? result.byteLength ?? 0) > 0) {
      this.signatures[request_id] = Array.isArray(result) ? result : Array.from(new Uint8Array(result));
      near.log("Signature stored");
    } else {
      near.log("Signature failed");
    }
  }

  @view({})
  get_signature({ request_id }) {
    return this.signatures[request_id] ?? null;
  }
}`,
  },
}
