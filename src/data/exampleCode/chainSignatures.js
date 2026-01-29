// Chain Signatures examples - NEAR chain signatures / MPC
export const chainSignaturesCode = {
  'chain-signatures-basics': {
    Rust: `use near_sdk::{near_bindgen, env, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    /// Placeholder: in production you verify a chain signature payload
    pub fn verify_request(&self, _payload: Vec<u8>) -> bool {
        env::log_str("Chain signature verification placeholder");
        true
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  verify_request({ payload }) {
    near.log("Chain signature verification placeholder");
    return true;
  }
}

`,
  },
  'signature-verification': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn check_signature(&self, message: Vec<u8>, _signature: Vec<u8>) -> bool {
        near_sdk::env::log_str(&format!("Verifying message len {}", message.len()));
        message.len() > 0
    }
}`,
    JavaScript: `import { NearBindgen, view, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  check_signature({ message, signature }) {
    near.log(\`Verifying message len \${message?.length ?? 0}\`);
    return (message?.length ?? 0) > 0;
  }
}

`,
  },
  'signature-requests': {
    Rust: `use near_sdk::{near_bindgen, env, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    requests: UnorderedMap<String, Vec<u8>>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            requests: UnorderedMap::new(b"r"),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            requests: UnorderedMap::new(b"r"),
        }
    }

    pub fn create_request(&mut self, request_id: String, payload: Vec<u8>) {
        self.requests.insert(&request_id, &payload);
        env::log_str("Signature request created");
    }

    pub fn get_request(&self, request_id: String) -> Option<Vec<u8>> {
        self.requests.get(&request_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ requests } = { requests: {} }) {
    this.requests = requests || {};
  }

  @view({})
  get_request({ request_id }) {
    return this.requests[request_id] ?? null;
  }

  @call({})
  create_request({ request_id, payload }) {
    this.requests[request_id] = payload;
    near.log("Signature request created");
  }
}

`,
  },
  'multi-chain-signing': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn sign_for_chain(&self, chain_id: String, message: Vec<u8>) -> bool {
        near_sdk::env::log_str(&format!("Multi-chain sign: chain={} len={}", chain_id, message.len()));
        true
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  sign_for_chain({ chain_id, message }) {
    near.log(\`Multi-chain sign: chain=\${chain_id} len=\${message?.length ?? 0}\`);
    return true;
  }
}

`,
  },
  'cross-chain-auth': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedSet;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    authorized: UnorderedSet<String>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            authorized: UnorderedSet::new(b"a"),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            authorized: UnorderedSet::new(b"a"),
        }
    }

    pub fn authorize_cross_chain(&mut self, external_id: String) {
        self.authorized.insert(&external_id);
        env::log_str("Cross-chain identity authorized");
    }

    pub fn is_authorized(&self, external_id: String) -> bool {
        self.authorized.contains(&external_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ authorized } = { authorized: [] }) {
    this.authorized = authorized || [];
  }

  @view({})
  is_authorized({ external_id }) {
    return this.authorized.includes(external_id);
  }

  @call({})
  authorize_cross_chain({ external_id }) {
    if (!this.authorized.includes(external_id)) {
      this.authorized.push(external_id);
    }
    near.log("Cross-chain identity authorized");
  }
}

`,
  },
  'signature-callbacks': {
    Rust: `use near_sdk::{near_bindgen, env, borsh::{self, BorshDeserialize, BorshSerialize}};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct Contract {}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn on_signature_ready(&self, request_id: String, success: bool) {
        env::log_str(&format!("Signature callback: {} success={}", request_id, success));
    }
}`,
    JavaScript: `import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  on_signature_ready({ request_id, success }) {
    near.log(\`Signature callback: \${request_id} success=\${success}\`);
  }
}

`,
  },
};
