export const signatureVerificationExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement payload validation and hashing for chain signatures — preparing data before sending it to the MPC contract.

**Requirements:**
- Implement \`validate_payload(payload) -> bool\` — returns true if payload is exactly 32 bytes
- Implement \`hash_for_signing(message) -> [u8; 32]\` — hashes a message using keccak256
- Both are view methods (no state changes, free to call)
- Use \`env::keccak256_array(&message)\` for hashing

**Test:** validate_payload must reject non-32-byte inputs; hash_for_signing must return 32 bytes!`,
  },
  {
    title: 'The Validator!',
    content: `Before sending a payload to the MPC contract, you MUST validate and hash it. The MPC only accepts exactly 32 bytes — this is the hash that will be signed.

Think of this as a **quality control checkpoint** at a factory. Every product (payload) must be inspected before it goes to the shipping department (MPC). Products that don't meet specifications (wrong size) are rejected.

**Why validate before sending?**
- The MPC contract charges 0.05 NEAR per call — you don't want to waste money on invalid payloads
- The MPC expects exactly 32 bytes; anything else causes a failed call
- Validation is free (view method), so you check before you spend

**The hashing step** converts an arbitrary message into the 32-byte format the MPC expects. \`keccak256\` (Ethereum's hashing algorithm) is used because chain signatures target EVM-compatible chains.`,
  },
  {
    title: 'Payload Validation',
    content: `The first line of defense is checking payload size:

\`\`\`rust
pub fn validate_payload(&self, payload: Vec<u8>) -> bool {
    payload.len() == 32
}
\`\`\`

**Simple but essential.** The MPC contract's \`sign\` method expects \`payload: [u8; 32]\` — a fixed-size array of exactly 32 bytes. If you pass a different size, the MPC call fails.

**What if your data is shorter than 32 bytes?** Pad it. Common padding strategies:
- **Zero-padding** — fill remaining bytes with 0
- **Hash the data** — even short data hashes to 32 bytes
- **Combine with nonce** — create a unique 32-byte value

**What if your data is longer than 32 bytes?** Hash it. The \`hash_for_signing\` method handles this — it takes any-length input and produces exactly 32 bytes.

**The JS version handles arrays differently:**
\`\`\`javascript
validate_payload({ payload }) {
    return Array.isArray(payload) && payload.length === 32;
}
\`\`\`

Note the \`Array.isArray\` check — JavaScript receives the payload as an array, not a typed array. Always check both that it's an array AND that it has the right length.`,
  },
  {
    title: 'Hashing for Signing',
    content: `Convert any message into a 32-byte hash:

\`\`\`rust
pub fn hash_for_signing(&self, message: Vec<u8>) -> [u8; 32] {
    env::keccak256_array(&message)
}
\`\`\`

**\`env::keccak256_array\`** is a NEAR SDK built-in that computes the keccak256 (SHA-3) hash. It takes any \`&[u8]\` and returns a fixed 32-byte array.

**Why use keccak256 specifically?**
- It's the standard hash for Ethereum and EVM chains
- The MPC contract derives keys and signs messages using ECDSA, which uses keccak256 internally
- If you used SHA-256, the signature wouldn't verify on EVM chains

**The flow:**
1. User provides a message (any length)
2. You hash it to 32 bytes
3. You validate it (32 bytes — checks pass)
4. You send it to MPC for signing
5. MPC returns a signature valid on the target chain

**The JS version:**
\`\`\`javascript
hash_for_signing({ message }) {
    const msg = message ? new Uint8Array(message) : new Uint8Array(0);
    return Array.from(near.keccak256(msg));
}
\`\`\`

\`near.keccak256()\` returns a typed array; we convert to a regular array for JSON serialization. This allows the result to be passed as arguments to other methods.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Validation and hashing are essential preprocessing steps. They prevent waste and ensure compatibility.

**Advantages:**
- **Free** — view methods cost no gas
- **Prevents waste** — catch invalid payloads before spending 0.05 NEAR on MPC
- **Standardizes input** — any message becomes a 32-byte hash
- **Composable** — use these methods before any MPC call

**Limitations:**
- **One-way hashing** — you can't recover the original message from the hash
- **Fixed size only** — the MPC only accepts 32 bytes; no flexibility
- **keccak256 specific** — if you need to target non-EVM chains, you might need different hashing

**When to validate:**
- Always before any MPC call
- Even if the caller claims they've already validated
- As a safety net, not a replacement for client-side validation

**When to hash:**
- Always before MPC signing
- Even if the data is already 32 bytes (double-hashing is safe)
- As the standard preprocessing step for all chain signature requests`,
  },
  {
    title: "Don't Do This!",
    content: `Using a different hash function:

\`\`\`rust
// BAD: SHA-256 instead of keccak256 — won't verify on EVM chains
pub fn hash_for_signing(&self, message: Vec<u8>) -> [u8; 32] {
    env::sha256_array(&message)  // Wrong! Use keccak256
}
\`\`\`

The MPC contract uses keccak256 internally. If you SHA-256 the message, the signature won't verify on Ethereum or other EVM chains. Always use \`env::keccak256_array\` for EVM targets.

**Skipping validation:**
\`\`\`rust
// BAD: Sending payload directly without checking size
pub fn request_signature(&mut self, payload: Vec<u8>, ...) -> Promise {
    // Payload might not be 32 bytes! The MPC call will fail silently.
    let request = SignRequest { payload: payload.try_into().unwrap(), ... };
}
\`\`\`

\`try_into().unwrap()\` panics if the payload isn't exactly 32 bytes. Always validate before converting to a fixed-size array.

**Assuming validation isn't needed:**
\`\`\`javascript
// BAD: No validation, just pass through
hash_for_signing({ message }) {
    return near.keccak256(message ? new Uint8Array(message) : new Uint8Array(0));
}
\`\`\`

Always validate the payload before hashing and signing. The validation step is your safety net against malformed input.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Validate and hash data before sending to the MPC contract.

**Code Snippet:**
\`\`\`rust
pub fn validate_payload(&self, payload: Vec<u8>) -> bool {
    // TODO: Check payload length is 32
}

pub fn hash_for_signing(&self, message: Vec<u8>) -> [u8; 32] {
    // TODO: Hash message with keccak256
}
\`\`\`

**Solution Hints:**
- Validation: \`payload.len() == 32\`
- Hashing: \`env::keccak256_array(&message)\`
- Both are \`&self\` view methods — no state changes, no gas cost
- Import: \`use near_sdk::env;\`

**JavaScript version:**
\`\`\`javascript
validate_payload({ payload }) {
    return Array.isArray(payload) && payload.length === 32;
}

hash_for_signing({ message }) {
    const msg = message ? new Uint8Array(message) : new Uint8Array(0);
    return Array.from(near.keccak256(msg));
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default signatureVerificationExplanation;
