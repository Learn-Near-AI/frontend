export const signatureRequestsExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a signature request tracking system — storing requests with metadata, then processing them through the MPC contract.

**Requirements:**
- Store \`requests: UnorderedMap<String, RequestRecord>\`
- Define \`RequestRecord\` with \`payload: [u8; 32]\`, \`path: String\`, \`status: String\`
- Implement \`create_request(request_id, payload, path)\` — stores a new request with status "pending"
- Implement \`get_request(request_id)\` — view method returning the request or None
- Implement \`sign_request(request_id, key_version)\` — \`#[payable]\`, looks up request, calls MPC to sign

**Test:** get_request must return the created request; sign_request must forward the correct payload to MPC!`,
  },
  {
    title: 'The Request Queue!',
    content: `When you need to sign many messages, you can't just fire-and-forget MPC calls. You need a **request queue** — a system that tracks each request from creation to completion.

Think of this as a **ticket system** at a government office. You submit a ticket (create_request) with your documents (payload and path). Then you wait for processing (sign_request). Each ticket has a status so you know where it is in the pipeline.

**Why track requests?**
- **Audit trail** — know who requested what and when
- **Status tracking** — is it pending, processing, or complete?
- **Idempotency** — prevent duplicate MPC calls for the same request
- **Error recovery** — retry failed requests without losing data

**The flow:**
1. User calls \`create_request(id, payload, path)\` — stores the request
2. Off-chain process or user calls \`sign_request(id, key_version)\` — sends to MPC
3. MPC returns signature (or fails)
4. Status is updated (handled via callback in the callbacks example)`,
  },
  {
    title: 'Tracking Requests with State',
    content: `Requests are stored in an \`UnorderedMap\` keyed by a user-provided ID:

\`\`\`rust
#[near(serializers = [json, borsh])]
pub struct RequestRecord {
    pub payload: [u8; 32],
    pub path: String,
    pub status: String,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    requests: UnorderedMap<String, RequestRecord>,
}
\`\`\`

**Why \`#[near(serializers = [json, borsh])]\`?** This struct is used both for storage (Borsh-serialized) and as a return value from view methods (JSON-serialized). The dual serializer annotation handles both.

**Creating a request:**
\`\`\`rust
pub fn create_request(&mut self, request_id: String, payload: [u8; 32], path: String) {
    self.requests.insert(&request_id, &RequestRecord {
        payload,
        path: path.clone(),
        status: "pending".to_string(),
    });
}
\`\`\`

**Viewing a request:**
\`\`\`rust
pub fn get_request(&self, request_id: String) -> Option<RequestRecord> {
    self.requests.get(&request_id)
}
\`\`\`

**Key design decisions:**
- User provides \`request_id\` — gives flexibility to use meaningful IDs
- Status is a String — simple and extensible (could use an enum)
- \`payload\` is stored as \`[u8; 32]\` — validated at create time`,
  },
  {
    title: 'Processing with MPC',
    content: `When the request is ready to sign, \`sign_request\` looks it up and forwards to MPC:

\`\`\`rust
#[payable]
pub fn sign_request(&mut self, request_id: String, key_version: u32) -> Promise {
    let record = self.requests.get(&request_id).expect("Request not found");
    let req = SignRequest {
        payload: record.payload,
        path: record.path,
        key_version,
    };
    mpc::ext("v1.signer-prod.testnet".parse().unwrap())
        .with_static_gas(Gas::from_tgas(250))
        .with_attached_deposit(NearToken::from_yoctonear(50_000_000_000_000_000_000_000))
        .sign(req)
}
\`\`\`

**The look-before-leap pattern:**
1. Look up the request from storage
2. Validate it exists (\`.expect("Request not found")\`)
3. Build the MPC \`SignRequest\` from the stored data
4. Forward to MPC with gas and deposit

**Why use the stored \`payload\` and \`path\`?** The request was validated when created. Reusing stored data ensures consistency — the MPC call uses exactly what was approved.

**The deposit** comes from the caller of \`sign_request\` (forwarded via \`#[payable]\`). The user pays the MPC fee at processing time, not creation time. This decouples request creation (free) from MPC execution (costly).`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A request tracking system gives you control and auditability over signature operations. It's essential for any non-trivial chain signatures use case.

**Advantages:**
- **Separation of concerns** — create requests freely, pay for MPC only when processing
- **Audit trail** — every request is recorded with its status
- **Idempotent** — same request_id prevents duplicate entries
- **Flexible** — user-chosen IDs work with existing systems

**Limitations:**
- **Storage cost** — each request occupies storage (paid by the contract)
- **No automatic status updates** — status doesn't change when MPC completes (use callbacks)
- **No expiration** — requests live forever unless explicitly cleaned up
- **User-chosen IDs** — must be unique; collisions cause overwrites

**When to use request tracking:**
- Multiple pending signatures
- Need to audit what was signed
- Decoupling creation from execution

**When to skip:**
- Simple one-off signatures (use the direct approach)
- Already have off-chain tracking
- Storage costs are a concern`,
  },
  {
    title: "Don't Do This!",
    content: `Validating payload again in sign_request when it was already validated in create_request:

\`\`\`rust
// BAD: Redundant validation — payload was already validated in create_request
pub fn sign_request(&mut self, request_id: String, key_version: u32) -> Promise {
    let record = self.requests.get(&request_id).expect("Request not found");
    assert_eq!(record.payload.len(), 32, "Payload must be 32 bytes");  // Always true!
}
\`\`\`

Once stored, the payload is a fixed \`[u8; 32]\` — it can't change. Validating it again is pointless. Validate at creation, trust at execution.

**Not checking if request exists before MPC call:**
\`\`\`rust
// BAD: Unwrap will panic if request doesn't exist
let record = self.requests.get(&request_id).unwrap();
\`\`\`

Use \`.expect("message")\` with a clear error message. This helps debugging and provides useful feedback to the user.

**Overwriting an existing request:**
\`\`\`rust
// BAD: Silently overwrites existing request
pub fn create_request(&mut self, request_id: String, payload: [u8; 32], path: String) {
    self.requests.insert(&request_id, &RequestRecord { ... });
}
\`\`\`

Consider checking if the ID already exists and panicking with a clear message. Or use \`insert\` which overwrites — but document this behavior.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Create a request tracking system for MPC signature requests.

**Code Snippet:**
\`\`\`rust
pub fn create_request(&mut self, request_id: String, payload: [u8; 32], path: String) {
    // TODO: Insert RequestRecord with status "pending"
}

pub fn get_request(&self, request_id: String) -> Option<RequestRecord> {
    // TODO: Look up and return request
}

#[payable]
pub fn sign_request(&mut self, request_id: String, key_version: u32) -> Promise {
    // TODO: Get request, build SignRequest, call MPC
}
\`\`\`

**Solution Hints:**
- Create: \`self.requests.insert(&request_id, &RequestRecord { payload, path, status: "pending".to_string() })\`
- Get: \`self.requests.get(&request_id)\`
- Sign: get record, build \`SignRequest { payload: record.payload, path: record.path, key_version }\`, call MPC
- Imports: \`UnorderedMap\`, \`ext_contract\`, \`Gas\`, \`NearToken\`

**JavaScript version:**
\`\`\`javascript
create_request({ request_id, payload, path }) {
    this.requests[request_id] = { payload, path: path || "ethereum-1", status: "pending" };
}

get_request({ request_id }) {
    return this.requests[request_id] ?? null;
}

sign_request({ request_id, key_version }) {
    const r = this.requests[request_id];
    if (!r) near.panic("Request not found");
    const req = { payload: r.payload, path: r.path, key_version: key_version ?? 0 };
    return NearPromise.new("v1.signer-prod.testnet")
        .functionCall("sign", bytes(JSON.stringify(req)), MPC_DEPOSIT, MPC_GAS)
        .asReturn();
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default signatureRequestsExplanation;
