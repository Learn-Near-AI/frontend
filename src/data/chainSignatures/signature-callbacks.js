export const signatureCallbacksExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement signature requests with callbacks — requesting a signature from the MPC contract, then processing the result in a callback method.

**Requirements:**
- Store \`signatures: LookupMap<String, Vec<u8>>\` for storing completed signatures
- Implement \`request_sign_and_store(request_id, payload, path, key_version)\` — \`#[payable]\`, calls MPC then chains callback to \`on_signature_ready\`
- Implement \`on_signature_ready(request_id)\` — reads \`env::promise_result(0)\`, stores signature bytes on success
- Implement \`get_signature(request_id)\` — view method returning stored signature or None

**Test:** The signature must be stored in the contract after the MPC call completes successfully!`,
  },
  {
    title: 'The Signature Vault!',
    content: `The callback pattern for chain signatures combines MPC signing with automatic result processing. Instead of firing-and-forgetting, your contract requests a signature AND handles the result in one flow.

Think of this as a **vault deposit box**. You send a package to the vault (the MPC call), and when it arrives safely, the vault clerk calls you to confirm (the callback). The signature is then stored safely in your vault (the \`signatures\` map).

**Why use callbacks for signatures?**
- **Automatic storage** — no separate step to save the result
- **Error handling** — detect and log failed signatures
- **Atomic flow** — the callback runs as part of the same transaction (if gas allows)
- **User convenience** — one call to sign and store, instead of two

**The difference from the basic chain-signatures example:**
- Basic: calls MPC, returns promise, user handles the result externally
- This: calls MPC, chains callback, stores result automatically`,
  },
  {
    title: 'Request + Callback Chain',
    content: `The method chains an MPC call with a callback to store the result:

\`\`\`rust
#[payable]
pub fn request_sign_and_store(
    &mut self,
    request_id: String,
    payload: [u8; 32],
    path: String,
    key_version: u32,
) -> Promise {
    let req = SignRequest { payload, path, key_version };
    let account = env::current_account_id();
    let args = format!(r#"{{"request_id":"{}"}}"#, request_id.replace('"', "\\\""));

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
                    Gas::from_tgas(50),
                )
        )
}
\`\`\`

**The chain:**
1. Call MPC's \`sign\` method with the payload
2. \`.then()\` schedules a callback to \`on_signature_ready\` on THIS contract
3. The callback receives the MPC result via \`env::promise_result(0)\`
4. The callback stores the signature bytes

**Key details:**
- \`args\` contains the \`request_id\` so the callback knows which request this is
- The ESCAPED request_id prevents JSON injection attacks
- \`Gas::from_tgas(50)\` for the callback — enough to store the signature
- The callback receives 0 deposit (no payment needed for storing)`,
  },
  {
    title: 'Handling the MPC Result',
    content: `The callback method reads and stores the signature:

\`\`\`rust
pub fn on_signature_ready(&mut self, request_id: String) {
    match near_sdk::env::promise_result(0) {
        near_sdk::PromiseResult::Successful(sig) if !sig.is_empty() => {
            self.signatures.insert(&request_id, &sig);
            env::log_str("Signature stored");
        }
        _ => env::log_str("Signature failed"),
    }
}
\`\`\`

**What happens in the callback:**
1. \`env::promise_result(0)\` reads the result of the FIRST promise (the MPC call)
2. If successful AND the signature is non-empty, store it in \`self.signatures\`
3. Log the outcome (success or failure)

**Why check \`!sig.is_empty()\`?** A successful promise result with empty data means the MPC returned an empty response — which is effectively a failure. The extra check catches this edge case.

**The \`request_id\` is passed via args** — it's not available from the promise result itself. Always pass any context you need in the callback through the callback args.

**Storing raw signature bytes:**
\`\`\`rust
self.signatures.insert(&request_id, &sig);
\`\`\`

The MPC returns raw signature bytes. These can be posted directly to the target chain for verification. No additional processing needed.

**Retrieving signatures:**
\`\`\`rust
pub fn get_signature(&self, request_id: String) -> Option<Vec<u8>> {
    self.signatures.get(&request_id)
}
\`\`\``,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `The callback pattern for chain signatures is the most reliable way to handle MPC results. It's the production-ready pattern for any serious chain signatures integration.

**Advantages:**
- **Automatic storage** — signatures are saved without a separate transaction
- **Error handling** — failed MPC calls are logged and don't crash the contract
- **User convenience** — one transaction to sign and store
- **Audit trail** — logs show which signatures succeeded and failed

**Limitations:**
- **Double gas cost** — MPC call (250 TGas) + callback (50 TGas) = 300 TGas (near the limit)
- **Callback complexity** — error handling, context passing, promise index management
- **State mutation** — the callback modifies state, which costs additional gas
- **Partial failure** — if the callback runs out of gas, the signature is lost

**When to use callbacks:**
- You need the signature stored on-chain
- Users expect a one-click sign-and-store experience
- You're building a signature vault or registry

**When to avoid:**
- Signatures are handled off-chain (use basic request without callback)
- Gas is constrained (callback adds 50 TGas overhead)
- The caller wants the raw signature returned directly`,
  },
  {
    title: "Don't Do This!",
    content: `Forgetting to pass the request_id in the callback args:

\`\`\`rust
// BAD: Callback has no context — doesn't know which request this is for
.then(
    Promise::new(account)
        .function_call(
            "on_signature_ready".to_string(),
            b"{}".to_vec(),  // No request_id!
            NearToken::from_yoctonear(0),
            Gas::from_tgas(50),
        )
)
\`\`\`

Without \`request_id\`, the callback has no way to know which request's signature to store. Always pass identifying context through the callback arguments.

**Not checking for empty signature:**
\`\`\`rust
// BAD: Stores even empty signatures
match near_sdk::env::promise_result(0) {
    near_sdk::PromiseResult::Successful(sig) => {
        self.signatures.insert(&request_id, &sig);  // sig might be empty!
    }
    _ => {}
}
\`\`\`

The MPC call might succeed with empty data. Check \`!sig.is_empty()\` before storing to avoid filling your contract with empty entries.

**Incorrect JSON escaping:**
\`\`\`rust
// BAD: No JSON escaping — break if request_id contains quotes
let args = format!(r#"{{"request_id":"{}"}}"#, request_id);
// If request_id = 'foo"bar', the JSON breaks
\`\`\`

Always escape quotes in user-provided strings that are embedded in JSON. Use \`.replace('"', "\\\\\"")\` to prevent JSON injection.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Request an MPC signature with a callback that stores the result.

**Code Snippet:**
\`\`\`rust
#[payable]
pub fn request_sign_and_store(&mut self, request_id: String, payload: [u8; 32], path: String, key_version: u32) -> Promise {
    // TODO: Build SignRequest, call MPC, chain callback to on_signature_ready
}

pub fn on_signature_ready(&mut self, request_id: String) {
    // TODO: Read promise_result(0), store signature if successful
}
\`\`\`

**Solution Hints:**
- MPC call: \`mpc::ext("v1.signer-prod.testnet".parse().unwrap()).with_static_gas(...).with_attached_deposit(...).sign(req)\`
- Callback args: \`format!(r#"{{"request_id":"{}"}}"#, request_id.replace('"', "\\\\\""))\`
- Chain: \`.then(Promise::new(env::current_account_id()).function_call("on_signature_ready".to_string(), args.as_bytes().to_vec(), NearToken::from_yoctonear(0), Gas::from_tgas(50)))\`
- Callback: \`match near_sdk::env::promise_result(0) { near_sdk::PromiseResult::Successful(sig) if !sig.is_empty() => { self.signatures.insert(&request_id, &sig); }, _ => env::log_str("Signature failed") }\`
- View: \`self.signatures.get(&request_id)\`

**JavaScript version:**
\`\`\`javascript
request_sign_and_store({ request_id, payload, path, key_version }) {
    const req = { payload, path: path || "ethereum-1", key_version: key_version ?? 0 };
    const account = near.currentAccountId();
    return NearPromise.new("v1.signer-prod.testnet")
        .functionCall("sign", bytes(JSON.stringify(req)), deposit, mpcGas)
        .then(NearPromise.new(account).functionCall("on_signature_ready", bytes(JSON.stringify({ request_id })), 0n, gas))
        .asReturn();
}

on_signature_ready({ request_id }) {
    const result = near.promiseResult(0);
    if (result && (result.length ?? result.byteLength ?? 0) > 0) {
        this.signatures[request_id] = Array.isArray(result) ? result : Array.from(new Uint8Array(result));
        near.log("Signature stored");
    } else {
        near.log("Signature failed");
    }
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default signatureCallbacksExplanation;
