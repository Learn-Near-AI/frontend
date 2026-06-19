export const indexerDataExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a contract that emits NEP-297 standard events for off-chain indexers to track state changes.

**Requirements:**
- Store \`records: UnorderedMap<String, String>\` for key-value data
- Implement \`set_record(key, value)\` — stores the record and emits an \`EVENT_JSON\` log
- Implement \`get_record(key)\` — view method returning the value or None
- The event must follow NEP-297 format: \`EVENT_JSON:{"standard":"example","version":"1.0.0","event":"record_updated","data":{...}}\`

**Test:** Indexers must be able to parse the event and track state changes!`,
  },
  {
    title: 'The Lighthouse!',
    content: `Events on NEAR are like **lighthouse beacons** — they broadcast signals into the dark, guiding indexers to track what's happening inside your contract.

Think of your contract as a **library**. When a book is added or updated (set_record), a notice is posted on the bulletin board (EVENT_JSON). Off-chain indexers (like librarians) read these notices to keep their catalog in sync.

**The NEP-297 standard** formalizes how events are emitted:
- Every event log starts with \`EVENT_JSON:\` prefix
- The payload is a JSON string containing \`standard\`, \`version\`, \`event\`, and \`data\`
- Multiple events can be batched in a single log

**Why events matter:**
- Indexers can track state changes without scanning all transactions
- Events provide structured data that's easy to parse
- Off-chain services (QueryAPI, NEAR Indexer Framework) rely on events
- Users get real-time updates without polling`,
  },
  {
    title: 'Emitting NEP-297 Events',
    content: `The event format follows a strict structure:

\`\`\`rust
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
\`\`\`

**Breakdown:**
- \`env::log_str\` — NEAR's built-in logging function. Logs appear in transaction receipts.
- \`EVENT_JSON:\` prefix — tells indexers this is a standard event (not a debug log)
- \`standard\` — the namespace for your events (e.g., \`"nep171"\` for NFTs, \`"example"\` for custom)
- \`version\` — schema version for forward compatibility
- \`event\` — the event type (e.g., \`"record_updated"\`)
- \`data\` — the payload; can be an object or array of objects

**Escape user input!** Always escape double quotes in user-provided strings using \`.replace('"', '\\\\"')\` — otherwise malformed input can break the JSON structure.`,
  },
  {
    title: 'Event Schema Design',
    content: `Good event design makes your contract indexer-friendly:

**Do:**
- Include all relevant state change info (old value, new value, who changed it)
- Use descriptive event names (\`record_updated\`, \`record_deleted\`)
- Version your schema so indexers can handle changes
- Keep data flat and simple

**Don't:**
- Include secrets or private data (events are public)
- Emit events for intermediate state changes inside a method
- Use dynamic field names that change between versions

**The JS version:**
\`\`\`javascript
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
\`\`\`

JavaScript's \`JSON.stringify\` handles escaping automatically — one less thing to worry about!`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Events are powerful but come with tradeoffs:

**Advantages:**
- **Standardized** — NEP-297 is widely supported by indexers, wallets, and explorers
- **Structured** — JSON format is easy to parse and query
- **Efficient** — logs are cheap (much cheaper than storing data on-chain)
- **Real-time** — indexers can process events as they're emitted

**Limitations:**
- **Log size limit** — each log entry is limited to 16KB (enough for most use cases)
- **No indexing** — the runtime doesn't index logs; it's up to indexers to parse them
- **One-way** — contracts can't read their own event logs
- **No guarantees** — indexers might miss events if they go offline

**When to use events:**
- You want indexers to track state changes
- You need to notify off-chain services of on-chain activity
- You want wallet UIs to display real-time updates

**When to avoid:**
- You need the contract to read its own logs (store the data instead)
- You're emitting tiny amounts of data (a simple return value might suffice)
- You need guaranteed delivery (events are best-effort)`,
  },
  {
    title: "Don't Do This!",
    content: `Forgetting the EVENT_JSON: prefix:

\`\`\`javascript
// BAD: Missing prefix — indexers won't recognize this as an event
near.log(JSON.stringify({ standard: "example", version: "1.0.0", event: "record_updated", data: {...} }));
\`\`\`

Without the \`EVENT_JSON:\` prefix, the log is treated as a plain debug message and ignored by indexers.

**Malformed JSON from unescaped input:**

\`\`\`rust
// BAD: No escaping — user input with quotes breaks the JSON
let json = format!(
    r#"{{"standard":"example","version":"1.0.0","event":"record_updated","data":{{"key":"{}"}}}}"#,
    key  // If key contains ", the JSON is broken!
);
\`\`\`

Always escape double quotes in user-provided values. In Rust, use \`.replace('"', "\\\\\\"")\`. In JS, use \`JSON.stringify\` which handles this automatically.

**Emitting before state change:**

\`\`\`rust
// BAD: Emit event before state change — indexer sees wrong state
env::log_str(&format!("EVENT_JSON:{}", json));
self.records.insert(&key, &value);  // Already emitted the event!
\`\`\`

Always update state first, then emit. This ensures that if the state change fails (panics), no misleading event is emitted.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Store records and emit NEP-297 events for off-chain indexers.

**Code Snippet:**
\`\`\`rust
pub fn set_record(&mut self, key: String, value: String) {
    // TODO: Get previous value
    // TODO: Insert new value
    // TODO: Build EVENT_JSON string
    // TODO: Log with env::log_str
}

pub fn get_record(&self, key: String) -> Option<String> {
    // TODO: Return record from storage
}
\`\`\`

**Solution Hints:**
- \`self.records.get(&key)\` to get previous value
- \`self.records.insert(&key, &value)\` to update
- Format: \`EVENT_JSON:{"standard":"example","version":"1.0.0","event":"record_updated","data":{"key":"...","value":"...","replaced":true/false}}\`
- Use \`env::log_str(&format!("EVENT_JSON:{}", json))\`
- Escape quotes with \`.replace('"', "\\\\\\"")\`

**JavaScript version:**
\`\`\`javascript
set_record({ key, value }) {
    const replaced = key in this.records;
    this.records[key] = value;
    const event = { standard: "example", version: "1.0.0", event: "record_updated", data: { key, value, replaced } };
    near.log("EVENT_JSON:" + JSON.stringify(event));
}

get_record({ key }) {
    return this.records[key] ?? null;
}
\`\`\`

[Learn more about NEP-297 Events →](https://docs.near.org/build/contracts/spec/events)`,
  },
];
