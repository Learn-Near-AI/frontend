export const chainSignaturesBasicsExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a cross-chain signature request — calling the NEAR MPC (Multi-Party Computation) contract to sign a payload for another blockchain.

**Requirements:**
- Define a \`SignRequest\` struct with \`payload: [u8; 32]\`, \`path: String\`, \`key_version: u32\`
- Define an \`MPC\` trait via \`#[ext_contract(mpc)]\` with a \`sign\` method
- Implement \`request_signature(payload, path, key_version)\` — marked \`#[payable]\`
- Call \`mpc::ext(MPC_CONTRACT).with_static_gas(GAS).with_attached_deposit(DEPOSIT).sign(request)\`
- Use GAS = 250 TGas and DEPOSIT = 0.05 NEAR for MPC fee

**Test:** The MPC contract must receive and process the signature request!`,
  },
  {
    title: 'The Cross-Chain Signer!',
    content: `Chain signatures let your NEAR contract create valid signatures for OTHER blockchains — Ethereum, Bitcoin, Solana, and more. Your NEAR account becomes a cross-chain identity.

Think of the MPC (Multi-Party Computation) contract as a **master key maker**. You provide the key material (a 32-byte payload hash) and the chain path (e.g., "ethereum-1"), and the MPC produces a signature valid on that chain.

**The flow:**
1. Your contract calls the MPC contract (\`v1.signer-prod.testnet\`)
2. MPC computes a signature using threshold cryptography (no single party has the full key)
3. The signature is returned and can be posted to the target chain

**Use cases:**
- Cross-chain DeFi (trade NEAR assets on Ethereum)
- Unified accounts (one NEAR account controls addresses on any chain)
- Bridge operations (verify NEAR state on other chains)
- Multi-chain authentication (sign in to dApps on any chain)`,
  },
  {
    title: 'MPC Architecture',
    content: `The MPC contract uses threshold ECDSA (Elliptic Curve Digital Signature Algorithm) to produce signatures:

\`\`\`rust
const MPC_CONTRACT: &str = "v1.signer-prod.testnet";
const GAS: Gas = Gas::from_tgas(250);
const ATTACHED_DEPOSIT: NearToken = NearToken::from_yoctonear(50_000_000_000_000_000_000_000);

#[derive(Serialize, BorshSerialize)]
pub struct SignRequest {
    pub payload: [u8; 32],
    pub path: String,
    pub key_version: u32,
}

#[near]
trait MPC {
    fn sign(&self, request: SignRequest) -> Promise;
}
\`\`\`

**The components:**
- \`payload\` — a 32-byte hash (typically keccak256 of the message you want to sign)
- \`path\` — a derivation path like \`"ethereum-1"\` or \`"bitcoin-1"\` that determines which chain key is used
- \`key_version\` — allows key rotation; start at 0
- \`MPC_CONTRACT\` — the deployed MPC contract address (different for testnet vs mainnet)
- \`ATTACHED_DEPOSIT\` — MPC charges a fee (~0.05 NEAR) for each signature

**The \`#[near]\` attribute** on the trait enables it for cross-contract calls. \`MPC::ext(address)\` returns a builder that configures gas, deposit, and the method call.

**Why 250 TGas?** MPC computation is intensive — it requires multiple nodes to communicate and reach consensus on the signature. Lower gas values may cause the call to fail.`,
  },
  {
    title: 'Attaching the MPC Fee',
    content: `The MPC contract requires a fee for each signature request:

\`\`\`rust
#[payable]
pub fn request_signature(&mut self, payload: [u8; 32], path: String, key_version: u32) -> Promise {
    let request = SignRequest { payload, path, key_version };
    mpc::ext(MPC_CONTRACT.parse().unwrap())
        .with_static_gas(GAS)
        .with_attached_deposit(ATTACHED_DEPOSIT)
        .sign(request)
}
\`\`\`

**Key details:**
- The method is \`#[payable]\` — the caller must attach NEAR to cover the MPC fee
- \`ATTACHED_DEPOSIT = 50_000_000_000_000_000_000_000 yoctoNEAR ≈ 0.05 NEAR\`
- The deposit is forwarded to the MPC contract as payment
- \`MPC_CONTRACT.parse().unwrap()\` converts the string address to an \`AccountId\`
- \`with_static_gas(GAS)\` sets a fixed gas amount (not a percentage of prepaid)

**The caller must attach at least 0.05 NEAR.** If they attach less, the MPC contract rejects the request. The caller should attach exactly 0.05 NEAR (the MPC fee) plus a small margin for your contract's execution.

**Testnet vs Mainnet:**
- Testnet: \`v1.signer-prod.testnet\`
- Mainnet: \`v1.signer\`

Always use testnet for development. Mainnet requires real NEAR for the MPC fee.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Chain signatures give your NEAR contract the power to act on ANY blockchain. This is one of the most powerful features in the NEAR ecosystem.

**Advantages:**
- **Cross-chain composability** — one contract controls actions on multiple chains
- **Threshold security** — no single party holds the private key; it's distributed across MPC nodes
- **Unified identity** — your NEAR account is your cross-chain identity
- **No bridging** — sign directly for other chains without moving assets

**Limitations:**
- **High gas cost** — 250 TGas per signature is significant
- **MPC fee** — 0.05 NEAR per signature adds up for high-volume use
- **Payload size** — limited to 32 bytes (a hash); you can't sign arbitrary data directly
- **Latency** — MPC requires multiple rounds of node communication, adding delay

**When to use chain signatures:**
- You need cross-chain actions from a NEAR contract
- The 0.05 NEAR fee is acceptable for your use case
- You can hash your message to 32 bytes

**When to avoid:**
- You only need signatures on NEAR itself (use native NEAR accounts)
- You need to sign large payloads
- Latency-sensitive operations`,
  },
  {
    title: "Don't Do This!",
    content: `Calling the MPC contract without enough deposit:

\`\`\`rust
// BAD: Attaching 0 deposit — MPC contract will reject
mpc::ext(MPC_CONTRACT)
    .with_attached_deposit(NearToken::from_yoctonear(0))
    .sign(request)
\`\`\`

The MPC contract checks that the attached deposit covers its fee. Without enough deposit, the call fails with \`PromiseResult::Failed\`.

**Forgetting #[payable]:**
\`\`\`rust
// BAD: Missing #[payable] — callers can't attach deposit
pub fn request_signature(&mut self, payload: [u8; 32], path: String, key_version: u32) -> Promise {
    // Even if the code attaches deposit, callers without #[payable] can't send NEAR
}
\`\`\`

Without \`#[payable]\`, any attached NEAR is rejected before your method even executes. Always mark methods that forward deposit as \`#[payable]\`.

**Wrong MPC contract address:**
\`\`\`rust
// BAD: Using mainnet address on testnet
const MPC_CONTRACT: &str = "v1.signer";  // Mainnet!
\`\`\`

The mainnet MPC contract won't work on testnet and vice versa. Use the correct address for your network. Using the wrong address results in a "contract not found" error.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Call the NEAR MPC contract to sign a cross-chain payload.

**Code Snippet:**
\`\`\`rust
#[payable]
pub fn request_signature(&mut self, payload: [u8; 32], path: String, key_version: u32) -> Promise {
    // TODO: Create SignRequest
    // TODO: Call mpc::ext with gas, deposit, and sign
}
\`\`\`

**Solution Hints:**
- SignRequest: \`SignRequest { payload, path, key_version }\`
- MPC call: \`mpc::ext(MPC_CONTRACT.parse().unwrap()).with_static_gas(GAS).with_attached_deposit(ATTACHED_DEPOSIT).sign(request)\`
- Import ext_contract: \`use near_sdk::ext_contract;\`
- The method must return \`Promise\` and be \`#[payable]\`

**JavaScript version:**
\`\`\`javascript
request_signature({ payload, path, key_version }) {
    const request = { payload, path: path || "ethereum-1", key_version: key_version ?? 0 };
    return NearPromise.new(MPC_CONTRACT)
        .functionCall("sign", bytes(JSON.stringify(request)), MPC_DEPOSIT, MPC_GAS)
        .asReturn();
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default chainSignaturesBasicsExplanation;
