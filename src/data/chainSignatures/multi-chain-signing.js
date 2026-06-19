export const multiChainSigningExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement multi-chain signing — managing signature paths for different blockchains and signing payloads for any of them.

**Requirements:**
- Store \`chain_paths: UnorderedMap<String, String>\` mapping chain IDs to MPC paths
- Implement \`set_chain_path(chain_id, path)\` — register or update a chain's derivation path
- Implement \`get_chain_path(chain_id)\` — view method returning the path or None
- Implement \`sign_for_chain(chain_id, payload, key_version)\` — \`#[payable]\`, looks up path, calls MPC
- Initialize with defaults: \`"ethereum" → "ethereum-1"\`, \`"bitcoin" → "bitcoin-1"\`, \`"solana" → "solana-1"\`

**Test:** sign_for_chain must use the correct path for each chain!`,
  },
  {
    title: 'The Multi-Chain Bridge!',
    content: `The NEAR MPC can sign for any blockchain, but each chain uses a different **derivation path**. Multi-chain signing manages these paths so your contract can sign for Ethereum, Bitcoin, Solana, and any other chain with a single interface.

Think of this as a **universal remote** that controls your TV, sound system, and streaming device. Each device needs its own settings (the path), but the remote (your contract) handles all of them through one interface.

**Chain paths defined:**
- \`"ethereum-1"\` — EVM-compatible chains (Ethereum, Polygon, Arbitrum, etc.)
- \`"bitcoin-1"\` — Bitcoin and Bitcoin-like chains
- \`"solana-1"\` — Solana chain
- New paths can be added as new chains are supported

**The path determines the derived address.** The same NEAR account can control addresses on every supported chain. Your users get a unified cross-chain identity.`,
  },
  {
    title: 'Managing Chain Paths',
    content: `Chain paths are stored in a map and initialized in the constructor:

\`\`\`rust
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
}
\`\`\`

**Setting and getting paths:**
\`\`\`rust
pub fn set_chain_path(&mut self, chain_id: String, path: String) {
    self.chain_paths.insert(&chain_id, &path);
}

pub fn get_chain_path(&self, chain_id: String) -> Option<String> {
    self.chain_paths.get(&chain_id)
}
\`\`\`

**Key design points:**
- Paths are initialized in \`new()\` — ready to use immediately after deploy
- \`set_chain_path\` is unrestricted (anyone can add paths) — in production, add access control
- \`get_chain_path\` is a view method — free to call
- The map key is a human-readable chain name, not an ID — makes it easy to use

**Why store paths on-chain instead of hardcoding?** Flexibility. New chains are added regularly. On-chain storage allows the contract owner to add new chain paths without redeploying.`,
  },
  {
    title: 'Signing for Any Chain',
    content: `The \`sign_for_chain\` method looks up the path and calls MPC:

\`\`\`rust
#[payable]
pub fn sign_for_chain(&mut self, chain_id: String, payload: [u8; 32], key_version: u32) -> Promise {
    let path = self.chain_paths.get(&chain_id).unwrap_or_else(|| "ethereum-1".to_string());
    let req = SignRequest { payload, path, key_version };
    mpc::ext("v1.signer-prod.testnet".parse().unwrap())
        .with_static_gas(Gas::from_tgas(250))
        .with_attached_deposit(NearToken::from_yoctonear(50_000_000_000_000_000_000_000))
        .sign(req)
}
\`\`\`

**The path resolution:**
1. Look up the chain in \`chain_paths\`
2. If found, use that path
3. If not found, default to \`"ethereum-1"\` — a safe fallback for unknown chains
4. Build \`SignRequest\` with payload + resolved path + key_version
5. Forward to MPC

**The default fallback** ensures the method never panics from a missing path. In production, you might want to panic with a clearer message like "Unsupported chain — call set_chain_path first."

**The caller must attach ~0.05 NEAR** for the MPC fee, just like the other signature examples. The method is \`#[payable]\` to accept this deposit.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Multi-chain signing gives your contract cross-chain superpowers. One contract, many blockchains.

**Advantages:**
- **Single interface** — \`sign_for_chain\` works for all supported chains
- **Extensible** — add new chains by calling \`set_chain_path\`, no redeploy needed
- **User-friendly** — human-readable chain names like "ethereum" instead of derivation paths
- **Safe defaults** — fallback path prevents silent failures

**Limitations:**
- **No access control** — anyone can add or change paths in this example
- **Path discovery** — users need to know which chain IDs are available
- **Default fallback** — "ethereum-1" might be wrong for unknown chains
- **Storage overhead** — each path entry costs storage

**When to use multi-chain signing:**
- Your dApp supports multiple target chains
- You want to add chains without redeploying
- Users need a unified interface for all chains

**When to keep it simple:**
- Only targeting one chain
- Chain paths are fixed and never change
- Low storage budget`,
  },
  {
    title: "Don't Do This!",
    content: `Hardcoding paths instead of using the map:

\`\`\`rust
// BAD: Hardcoded paths — require redeploy to add new chains
pub fn sign_for_chain(&mut self, chain_id: String, payload: [u8; 32], key_version: u32) -> Promise {
    let path = match chain_id.as_str() {
        "ethereum" => "ethereum-1",
        "bitcoin" => "bitcoin-1",
        _ => panic!("Unknown chain"),
    };
}
\`\`\`

If a new chain is supported, you must redeploy the contract. Using the map pattern allows adding chains without redeploying.

**Panicking instead of defaulting:**
\`\`\`rust
// BAD: Panics on unknown chain — user loses their MPC deposit
let path = self.chain_paths.get(&chain_id).expect("Chain not configured");
\`\`\`

If the user attached 0.05 NEAR for MPC and the chain isn't configured, the panics causes the deposit to be lost. Better to return an error or use a default.

**No initialization of default paths:**
\`\`\`rust
// BAD: Contract deploys with empty chain_paths map
pub fn new() -> Self {
    Self { chain_paths: UnorderedMap::new(b"p") }
}
\`\`\`

Without defaults, the first user of every new chain will get a panic. Always initialize with the most common chains. Users can override later.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Manage chain paths and sign payloads for multiple blockchains.

**Code Snippet:**
\`\`\`rust
pub fn set_chain_path(&mut self, chain_id: String, path: String) {
    // TODO: Insert or update path
}

pub fn get_chain_path(&self, chain_id: String) -> Option<String> {
    // TODO: Look up and return path
}

#[payable]
pub fn sign_for_chain(&mut self, chain_id: String, payload: [u8; 32], key_version: u32) -> Promise {
    // TODO: Look up path, build SignRequest, call MPC
}
\`\`\`

**Solution Hints:**
- Set: \`self.chain_paths.insert(&chain_id, &path)\`
- Get: \`self.chain_paths.get(&chain_id)\`
- Sign: \`let path = self.chain_paths.get(&chain_id).unwrap_or_else(|| "ethereum-1".to_string());\`
- Default paths in new(): \`paths.insert(&"ethereum".to_string(), &"ethereum-1".to_string());\` etc.

**JavaScript version:**
\`\`\`javascript
set_chain_path({ chain_id, path }) {
    this.chain_paths[chain_id] = path;
}

get_chain_path({ chain_id }) {
    return this.chain_paths[chain_id] ?? null;
}

sign_for_chain({ chain_id, payload, key_version }) {
    const path = this.chain_paths[chain_id] || "ethereum-1";
    const req = { payload, path, key_version: key_version ?? 0 };
    return NearPromise.new("v1.signer-prod.testnet")
        .functionCall("sign", bytes(JSON.stringify(req)), MPC_DEPOSIT, MPC_GAS)
        .asReturn();
}
\`\`\`

[Learn more about NEAR Chain Signatures →](https://docs.near.org/build/chain-signatures)`,
  },
];

export default multiChainSigningExplanation;
