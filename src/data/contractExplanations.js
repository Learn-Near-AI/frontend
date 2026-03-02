// Contract explanations - concise explanations for each contract (markdown formatted)
export const contractExplanations = {
  intro: `Hey there! Welcome to our little corner of NEAR development.

**What's going on here?**

We put together 15 working examples to help you learn NEAR smart contracts. The rest are still being built — we're working on them as fast as we can.

**How this works**

Each example walks you through something real. Not just "here's the code" — but why it works, where the tricky parts are, and how people actually build things in the wild. We cover the basics first: writing contracts, storing data, handling errors. Then we move into things like collections, access control, and making contracts that can be upgraded.

**Why we did it this way**

Most learning material out there jumps straight to "here's a tutorial, good luck." We wanted something where you could actually play with code and see what happens. Every example has Rust and JavaScript — pick whichever feels more familiar.

**What you'll learn**

- How NEAR contracts are structured and why
- Reading and writing data on-chain
- Handling the weird edge cases (input validation, errors, events)
- Collections: vectors and maps for storing lists and key-value data
- Access control: owner patterns, roles, pausable contracts
- Upgrading contracts without losing user data

The sidebar shows all the topics. We recommend going in order — one each builds on the last. But hey, you're the boss. Jump around if you want.

If something's confusing or you find a bug, that's on us. We're still learning too. Hope this helps you get started with NEAR!

— The Team`,

  'hello-world':
    "This is the simplest NEAR smart contract and serves as the perfect entry point for learning NEAR development.\n\n- **Structure:** A contract struct with `#[near(contract_state)]` and `#[near]` on the impl block (generates serialization and contract interface boilerplate).\n- **View method:** Returns a greeting string. View methods are *read-only*, don't modify state, and are **free to call**—no transactions or gas fees.\n\nUnderstanding this basic pattern is crucial; every NEAR contract follows a similar structure.",

  'contract-structure':
    'Overview of the **fundamental structure** every NEAR smart contract must follow.\n\n- **Contract struct** — Holds state (e.g. `owner_id`). Use `#[near(contract_state)]` for serialization; *do not* manually derive `BorshDeserialize`/`BorshSerialize` for contract state.\n- **PanicOnDefault** — Recommended derive; panics if the contract is deserialized without explicit init.\n- **`#[init]`** — Explicitly initializes the contract with required values.\n\nState in the contract struct persists across all calls and transactions. Storing/retrieving account info here is the foundation for access control.',

  'view-methods':
    '**View methods** are read-only functions that query contract state without modifying it.\n\n- **Free to call** — No transactions, gas fees, or wallet signatures.\n- **Return types** — This example shows a string and a numeric value; view methods can return any serializable type (strings, numbers, structs, vectors, maps).\n- **Definition** — Use the `#[view]` attribute or omit change-method marking.\n\nUse view methods for UIs, balances, ownership checks, and any read-only contract data. They are the primary way applications read contract state.',

  'change-methods':
    '**Change methods** modify contract state and require a signed transaction with gas.\n\n- **This example:** Stores and updates a string in contract state—the foundation for all data persistence on NEAR.\n- **Storage** is persistent; data remains across transactions until explicitly modified.\n- **Marking:** Use `#[call]` for change methods.\n\nThe NEAR runtime handles Borsh serialization automatically. Change methods are the main mechanism for updating state and implementing business logic.',

  'state-management':
    '**State management** is central to smart contracts. This example uses a **counter** that can be incremented.\n\n- **Lifecycle:** Initialization → reading state (view methods) → updating state (change methods).\n- **Persistence:** The new value stays in contract state for all future calls until modified.\n- **Atomicity:** Either the whole transaction succeeds and state updates, or it fails and state is unchanged.\n\nThe counter pattern is the core of votes, balances, token supplies, and user data in real applications.',

  'input-validation':
    '**Input validation** prevents invalid or malicious data from corrupting contract state.\n\n- This example uses **`require!`** to check message length (non-empty, max 100 chars).\n- Failed validation panics with a clear message.\n- Use these patterns for bounds, formats, and business logic to prevent common vulnerabilities.\n\nUse `require!` for invariants that must never be violated.',

  'error-handling':
    '**When to use Option/Result vs panic:**\n\n- **Recoverable:** `try_parse_number`, `safe_divide` return `Option` (e.g. invalid input, division by zero). `parse_with_default` uses `unwrap_or` for fallbacks.\n- **Unrecoverable:** `assert_positive` and `strict_check` use `require!` and `env::panic_str` for invariants.\n\nUse **Option/Result** for recoverable cases; **panic** for invariants that must never be violated.',

  events:
    "**Events** let contracts emit structured logs that indexers and external systems can query.\n\n- **NEP-297** — NEAR's standard for event formatting. Events are stored on-chain in transaction receipts.\n- **Use cases:** Tracking contract activity, state changes, analytics; token transfers, ownership changes, votes.\n- **Best practices:** Define event structs with relevant data, emit at key execution points, use clear names and structure for indexing.\n\nEvents power wallet histories, DeFi analytics, and other user-facing blockchain features.",

  'collections-vector':
    '**Vectors** are dynamic arrays. Use **unique prefixes** (e.g. `b"i"`, `b"t"`) to namespace multiple collections and avoid key collisions.\n\n- This example has *items* and *tags* with different storage keys.\n- **Operations:** `add`, `swap_remove` (O(1) remove by swapping with last), iterate.\n\nPattern for multiple collections in one contract.',

  'collections-map':
    '**Maps** store key-value pairs for efficient lookups.\n\n- Use **`LookupMap`** or **`UnorderedMap`** from `near_sdk::collections`.\n- Ideal for data indexed by unique keys: user profiles, token balances.\n- **Operations:** insert, get, remove.',

  'owner-pattern':
    '**Owner pattern** — Restrict privileged operations (e.g. `set_value`) to the contract owner.\n\n- **`env::predecessor_account_id()`** — Identifies the caller.\n- **`assert_owner()`** — Guards sensitive calls.\n- Owner is set at **init**.',

  'role-based-access':
    '**Role-based access:** owner plus admins (stored in an **`UnorderedSet`**).\n\n- Owner or admins can call **`add_admin`**.\n- **`admin_only_action`** requires admin.\n- Use **`is_admin`** to gate privileged operations. More flexible than owner-only.',

  'pausable-contract':
    '**Pausable contracts** can temporarily halt operations in emergencies.\n\n- Pause/unpause is controlled by the owner.\n- When paused, critical functions revert.\n- Useful for responding to bugs or security issues without redeploying.',

  'multi-signature':
    '**Multi-signature** requires multiple approvals before executing actions.\n\n- This example collects signatures from multiple accounts and executes only when the **threshold** is met.\n- Essential for high-security operations where no single account should have full control.',

  'todo-list':
    '**Todo list** demonstrates **CRUD** with collections.\n\n- Create, read, update, and delete todo items in a vector or map.\n- Practical state management for apps that maintain lists of user data.',

  'user-profiles':
    '**User profiles** store account-specific data in a map.\n\n- Map **account IDs** to profile structs with user information.\n- Create, update, and retrieve user data.\n- Common in social or identity applications on NEAR.',

  'voting-system':
    '**Voting system** — Tally votes and track participation.\n\n- **Vote counters:** e.g. `votes_yes`, `votes_no`.\n- **`UnorderedSet`** for voters to prevent double-voting.\n- **`get_results`** returns the tally. Practical governance pattern for binary (yes/no) proposals.',

  testing:
    '**Unit testing** verifies contract logic.\n\n- **Rust:** `#[cfg(test)]` `mod tests` with `assert_eq!`; run `cargo test`.\n- **JavaScript:** For pure logic (no `near.*`), test the class with vitest; for full contract tests use *near-workspaces*.\n- Both examples test `add(2,3)==5`.',

  'simple-calls':
    '**Simple cross-contract calls** invoke methods on other contracts.\n\n- Uses **`Promise`** to call external contracts with a configurable method name.\n- Basic pattern for contract-to-contract communication, essential for composable DeFi.',

  'upgrade-pattern':
    '**Upgrade pattern:**\n\n- **init**, **PanicOnDefault** (prevents uninitialized deserialization), and **migration** for post-upgrade schema changes.\n- Migration functions upgrade contract code while preserving data.\n- Owner-only **`migrate()`** handles versioning and backward compatibility.',

  'simple-marketplace':
    '**Simple marketplace** — Buy and sell NFTs.\n\n- **`list_item`** creates listings; **`buy`** pays the seller and transfers the NFT via **`nft_transfer_from`**.\n- **`on_payment_sent`** callback checks **`promise_result`** before transferring payment—essential for safe cross-contract flows.',

  'batch-operations':
    '**Batch operations** process multiple items **atomically** in one transaction.\n\n- **Gas:** Use size limits (e.g. `MAX_BATCH`) to prevent runaway costs.\n- Reduces gas vs many single-item calls; all operations succeed or fail together.',

  'nft-standard':
    '**NEP-171** NFT core:\n\n- **`nft_transfer`** — 1 yoctoNEAR proof; **`nft_token`** view.\n- Ownership checks, standard method names, 1 yoctoNEAR deposit for transfer.\n- For approval / transfer_from, see **nft-approval**.',

  'nft-metadata':
    '**NFT metadata** — Token info (name, description, media).\n\n- Store and retrieve metadata following **NEP-177**.\n- Structure token metadata for display in wallets and marketplaces.',

  'nft-minting':
    '**NFT minting** creates new tokens.\n\n- Owner-only **`mint`** generates unique token IDs and assigns ownership.\n- Demonstrates owner check, **`next_id`** counter, and inserting into the tokens map. For metadata, see **nft-metadata**.',

  'nft-approval':
    '**NFT approval** lets others transfer tokens on your behalf.\n\n- Grant permissions, check approvals, revoke access.\n- Enables marketplace functionality where contracts can transfer tokens.',

  'nft-enumeration':
    '**NFT enumeration** — List tokens owned by accounts.\n\n- Pagination and querying token lists.\n- Efficiently retrieve token IDs and metadata for UIs.',

  'nft-royalties':
    '**NFT royalties** — Royalty percentages per token (basis points; max 10000 = 100%).\n\n- Owner-only **`set_royalty`** and **`get_royalty`**.\n- Distribution logic is typically in the marketplace on sale. *Note:* JS implementation may need owner-check alignment with Rust.',

  'nft-marketplace':
    '**NFT marketplace** — Trade NFTs.\n\n- **`list`** creates listings; **`buy`** pays the seller and transfers the NFT.\n- Uses **`nft_transfer_from`** with a callback that checks **`promise_result`** before transferring payment. Patterns: escrow, payment flow, safe cross-contract handling.',

  callbacks:
    '**Callbacks** process results from cross-contract calls.\n\n- Use **`and_then`** to chain a call with a callback.\n- Callback reads **`promise_result(0)`** or **`promiseResultRaw(0)`** to handle success (parse return) or failure (return default).\n- Essential for any async cross-contract flow.',

  'cross-call-ft':
    '**Cross-contract FT:** Call **`ft_transfer`** on a **NEP-141** token contract.\n\n- Amount as **string** in smallest unit. Attach **1 yoctoNEAR**.\n- Basic pattern for integrating with NEAR standard FT contracts.',

  'cross-call-nft':
    '**Cross-contract NFT:** Call **`nft_transfer_call`** on a **NEP-171** NFT contract.\n\n- Pass `receiver_id`, `token_id`, `memo`, `msg`. Attach **1 yoctoNEAR**.\n- Basic pattern for integrating with existing NFT contracts.',

  'batch-calls':
    '**Chained calls** — Execute cross-contract calls in sequence with **`and_then`**.\n\n- Call `contract_a`, then `contract_b` after the first completes.\n- For parallel calls use **`Promise::and`**. Use chaining when the second call depends on the first.',

  'chain-signatures-basics':
    '**Chain signatures:** Call the MPC contract (**v1.signer**) to sign 32-byte payloads for other chains.\n\n- Uses **`ext_contract`** and **`Promise`**. Path derives the target chain address (e.g. `ethereum-1`).\n- Attach **~0.05 NEAR** for MPC fee. *JS uses JSON; verify MPC expects this format (Rust uses Borsh).*',

  'signature-verification':
    '**Validate payload format** before MPC: must be **32 bytes** (e.g. keccak256 hash).\n\n- **`hash_for_signing`** produces the hash; actual signature verification happens on the destination chain.',

  'signature-requests':
    '**Track signature requests:**\n\n- **`create_request`** — stores payload and path; **`get_request`** retrieves; **`sign_request`** calls MPC.\n- Request lifecycle before and during signing. *JS uses JSON; verify MPC expects this format.*',

  'multi-chain-signing':
    '**Different derivation paths** per chain (`ethereum-1`, `bitcoin-1`, `solana-1`).\n\n- **`set_chain_path`** maps `chain_id` to path; **`sign_for_chain`** uses the path when calling MPC.\n- *JS uses JSON; verify MPC expects this format.*',

  'cross-chain-auth':
    '**Whitelist** of authorized external identities.\n\n- **`authorize_cross_chain`** adds; **`revoke_cross_chain`** removes; **`require_authorized`** gates cross-chain actions.\n- Call **`require_authorized`** from your cross-chain methods before allowing MPC sign requests. *In production,* restrict authorize/revoke to **owner-only**.',

  'signature-callbacks':
    'Request MPC sign, then **callback** to store the result.\n\n- **`and_then`** chain: MPC sign → **`on_signature_ready`**.\n- Callback reads **`promise_result(0)`** for the signature bytes. *JS uses JSON; verify MPC expects this format.*',

  'indexer-data':
    '**NEP-297 events** — Emit via **`EVENT_JSON:`** prefix (standard, version, event, data).\n\n- This example has state (**`set_record`**, **`get_record`**) and emits **`record_updated`** on changes.\n- Indexers (NEAR Indexer, QueryAPI) parse logs off-chain; setup and SQL are in NEAR docs.',
};

// Default explanation for contracts without specific explanations
export const getContractExplanation = (exampleId) => {
  return (
    contractExplanations[exampleId] ||
    `This **${exampleId.replace(/-/g, ' ')}** contract demonstrates key NEAR smart contract concepts. Explore the code to understand how it implements ${exampleId.includes('nft') ? '**NFT**' : exampleId.includes('cross') ? '**cross-contract**' : '**smart contract**'} functionality on the NEAR blockchain.`
  );
};
