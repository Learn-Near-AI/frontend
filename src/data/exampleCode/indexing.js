// Indexing examples - Indexer setup, QueryAPI, data indexing (JS-focused; Rust = contract emitting events)
export const indexingCode = {
  'indexer-setup': {
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

    pub fn emit_event(&self, event_type: String, data: String) {
        env::log_str(&format!("EVENT_JSON:{{\"event\":\"{}\",\"data\":\"{}\"}}", event_type, data));
    }
}`,
    JavaScript: `// Indexer setup: define schema and start indexer
// Example: NEAR Indexer for Explorer / custom indexer
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  emit_event({ event_type, data }) {
    near.log(\`EVENT_JSON:{"event":"\${event_type}","data":"\${data}"}\`);
  }
}

// Indexer (external): listens to network, indexes by block/account
// QueryAPI: create indexer with schema, run queries
`,
  },
  'queryapi-basics': {
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

    pub fn log_for_index(&self, action: String, account: String) {
        env::log_str(&format!("INDEX:{}:{}", action, account));
    }
}`,
    JavaScript: `// QueryAPI: create indexer, define SQL schema, query indexed data
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  log_for_index({ action, account }) {
    near.log(\`INDEX:\${action}:\${account}\`);
  }
}

// Query example (run in QueryAPI):
// SELECT * FROM actions WHERE block_timestamp > ...
`,
  },
  'data-indexing': {
    Rust: `use near_sdk::{near_bindgen, env, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    records: UnorderedMap<String, String>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            records: UnorderedMap::new(b"r"),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            records: UnorderedMap::new(b"r"),
        }
    }

    pub fn set_record(&mut self, key: String, value: String) {
        self.records.insert(&key, &value);
        env::log_str(&format!("RECORD:{}:{}", key, value));
    }

    pub fn get_record(&self, key: String) -> Option<String> {
        self.records.get(&key)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ records } = { records: {} }) {
    this.records = records || {};
  }

  @view({})
  get_record({ key }) {
    return this.records[key] ?? null;
  }

  @call({})
  set_record({ key, value }) {
    this.records[key] = value;
    near.log(\`RECORD:\${key}:\${value}\`);
  }
}

`,
  },
  'queryapi-queries': {
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

    pub fn action(&self, name: String) {
        env::log_str(&format!("ACTION:{}", name));
    }
}`,
    JavaScript: `// QueryAPI queries: SELECT * FROM indexer_name WHERE ...
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  action({ name }) {
    near.log(\`ACTION:\${name}\`);
  }
}

// Example queries:
// - Filter by account, method, block range
// - Aggregate counts, sums
// - Join with other indexers
`,
  },
  'indexer-filters': {
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

    pub fn emit(&self, kind: String, payload: String) {
        env::log_str(&format!("FILTER:{}:{}", kind, payload));
    }
}`,
    JavaScript: `// Indexer filters: filter by account_id, method_name, block height
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  emit({ kind, payload }) {
    near.log(\`FILTER:\${kind}:\${payload}\`);
  }
}

// In indexer config: filter stream by account / method
`,
  },
  'indexer-aggregation': {
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

    pub fn add_value(&self, amount: u64) {
        env::log_str(&format!("AGG:{}", amount));
    }
}`,
    JavaScript: `// Indexer aggregation: COUNT, SUM, GROUP BY in QueryAPI
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  add_value({ amount }) {
    near.log(\`AGG:\${amount}\`);
  }
}

// Query: SELECT method_name, COUNT(*) FROM actions GROUP BY method_name
`,
  },
  'indexer-performance': {
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

    pub fn tick(&self) {
        env::log_str("TICK");
    }
}`,
    JavaScript: `// Indexer performance: batch processing, backpressure, parallel workers
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  tick() {
    near.log("TICK");
  }
}

// Best practices: index in batches, use LIMIT, avoid heavy JOINs
`,
  },
  'indexer-monitoring': {
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

    pub fn event(&self, name: String) {
        env::log_str(&format!("MONITOR:{}", name));
    }
}`,
    JavaScript: `// Indexer monitoring: health checks, lag, error alerts
import { NearBindgen, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @call({})
  event({ name }) {
    near.log(\`MONITOR:\${name}\`);
  }
}

// Monitor: indexer head vs chain head, failed blocks, query latency
`,
  },
};
