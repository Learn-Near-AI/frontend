// Indexing examples - Contract side: NEP-297 event emission
// Indexer setup, QueryAPI, filters, aggregation are off-chain; see NEAR docs for indexer configuration.
export const indexingCode = {
  'indexer-data': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, PanicOnDefault};

/// NEP-297 events: standard, version, event, data. Emit via EVENT_JSON: prefix.
/// Indexers (NEAR Indexer, QueryAPI) parse logs off-chain.
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    records: UnorderedMap<String, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            records: UnorderedMap::new(b"r"),
        }
    }

    pub fn set_record(&mut self, key: String, value: String) {
        let prev = self.records.get(&key);
        self.records.insert(&key, &value);
        let replaced = if prev.is_some() { "true" } else { "false" };
        let json = format!(
            r#"{{"standard":"example","version":"1.0.0","event":"record_updated","data":{{"key":"{}","value":"{}","replaced":{}}}}}"#,
            key.replace('"', "\\\""),
            value.replace('"', "\\\""),
            replaced
        );
        env::log_str(&format!("EVENT_JSON:{}", json));
    }

    pub fn get_record(&self, key: String) -> Option<String> {
        self.records.get(&key)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

// Contract with state + NEP-297 events. Indexers track both state and events.
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
    const replaced = key in this.records;
    this.records[key] = value;
    const event = {
      standard: "example",
      version: "1.0.0",
      event: "record_updated",
      data: { key, value, replaced },
    };
    near.log("EVENT_JSON:" + JSON.stringify(event));
  }
}

// Indexers: filter by account_id, method_name; aggregate with SQL (COUNT, SUM, etc.).`,
  },
}
