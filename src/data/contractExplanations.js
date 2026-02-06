// Contract explanations - concise explanations for each contract (under 100 words)
export const contractExplanations = {
  'hello-world': 'This is the simplest NEAR smart contract and serves as the perfect entry point for learning NEAR development. It demonstrates the fundamental structure: a contract struct with #[near(contract_state)] and #[near] on the impl block, which generates the boilerplate for serialization and the contract interface. The example features a single view method that returns a greeting string. View methods are read-only, don\'t modify state, and are free to call—no transactions or gas fees. Understanding this basic pattern is crucial, as every NEAR contract follows a similar structure.',
  
  'contract-structure': 'This contract provides a comprehensive overview of the fundamental structure that every NEAR smart contract must follow. It demonstrates the essential components: a contract struct that holds state variables (like owner_id), proper serialization using Borsh (Binary Object Representation Serializer for Hashing), and PanicOnDefault which panics if the contract is ever deserialized without explicit initialization—preventing accidental use of uninitialized state. The example shows how state is stored within the contract struct, which persists across all contract calls and transactions. Borsh serialization is critical because it ensures that contract state can be efficiently stored and retrieved from the blockchain\'s persistent storage. The #[init] function explicitly initializes the contract with required values. This contract also demonstrates how to store and retrieve account information, a pattern that forms the foundation for access control mechanisms. Understanding this structure is essential because all NEAR contracts build upon these core principles, and mastering them will help you write more complex and secure smart contracts.',
  
  'view-methods': 'View methods are read-only functions that provide a way to query contract state without modifying it. These methods are completely free to call - they don\'t require transactions, gas fees, or wallet signatures, making them ideal for retrieving information from contracts. This example demonstrates multiple view methods with different return types: one returns a simple string, while another performs calculations and returns a numeric value. View methods can perform any computation as long as they don\'t modify state, and they can return any serializable data type including strings, numbers, structs, vectors, and maps. This makes them perfect for building user interfaces that need to display contract data, checking balances, querying ownership, or retrieving any stored information. The example shows how view methods are defined using the #[view] attribute or by simply not marking them as change methods. Understanding view methods is crucial because they represent the primary way users and applications interact with contract data, and they\'re used extensively in every NEAR application for reading contract state.',
  
  'change-methods': 'Change methods modify contract state and require a signed transaction with gas fees. This example demonstrates storing and updating a string in contract state—the foundation for all data persistence on NEAR. Storage is persistent: data remains across transactions until explicitly modified. The NEAR runtime handles Borsh serialization automatically. Change methods are marked with #[call] and represent the primary mechanism for updating state, handling user actions, and implementing business logic.',
  
  'state-management': 'State management is one of the most crucial aspects of smart contract development, and this example demonstrates the fundamental patterns for managing mutable state in NEAR contracts. The contract implements a simple counter that can be incremented, showing how to maintain and update state variables that persist across transactions. When you increment the counter, the new value is stored in the contract\'s state and remains available for all future calls until modified again. This example illustrates the complete lifecycle of state management: initialization (setting an initial value), reading state (through view methods), and updating state (through change methods). The counter pattern is deceptively simple but represents the core pattern used in countless real-world applications - from tracking votes and balances to managing token supplies and user data. Understanding state management is essential because every meaningful application needs to maintain some form of mutable state. The example also demonstrates how state changes are atomic - either the entire transaction succeeds and state is updated, or it fails and state remains unchanged, ensuring data consistency and reliability.',
  
  'input-validation': 'Input validation is a critical security practice that prevents invalid or malicious data from corrupting contract state or causing unexpected behavior. This example demonstrates comprehensive input validation techniques, showing how to check conditions before processing user inputs and return meaningful errors when validation fails. The contract validates various aspects of input data: checking if values are within acceptable ranges, ensuring required fields are present, verifying data formats, and preventing edge cases that could lead to bugs or exploits. Proper validation is essential for secure and reliable smart contracts because once code is deployed, it cannot be easily changed, and invalid data can lead to permanent state corruption or security vulnerabilities. This example shows how to use Rust\'s Result type to return errors gracefully, providing clear feedback about what went wrong. The validation patterns demonstrated here - checking bounds, verifying formats, and ensuring business logic constraints - are used throughout production contracts to prevent common vulnerabilities like integer overflow, underflow, and invalid state transitions. Mastering input validation is fundamental to writing secure smart contracts that can handle real-world usage safely.',
  
  'error-handling': 'Error handling shows when to use Option/Result vs panic. try_parse_number and safe_divide return Option for expected failures (invalid input, division by zero). parse_with_default uses unwrap_or for fallbacks. assert_positive and strict_check demonstrate require! and env::panic_str for unrecoverable errors. Use Option/Result for recoverable cases; panic for invariants that must never be violated.',
  
  'events': 'Events are a powerful mechanism that allows contracts to emit structured logs that can be indexed, queried, and monitored by external systems. This example demonstrates how to define and emit events using NEAR\'s event system, which follows the NEP-297 standard for event formatting. Events are stored on-chain as part of transaction receipts and can be retrieved by indexers, making them perfect for tracking contract activity, state changes, and building analytics dashboards. The example shows how to define event structs with relevant data fields, emit events at appropriate points in contract execution, and structure events to be easily queryable. Events provide a way to track important contract activities without requiring external systems to poll contract state or parse transaction data manually. They\'re particularly useful for tracking token transfers, ownership changes, votes, and any other significant state transitions. The example demonstrates best practices for event design: including all relevant context, using clear naming conventions, and structuring data for efficient indexing. Understanding events is crucial because they enable the rich ecosystem of tools, dashboards, and analytics that make blockchain applications usable - from wallet transaction histories to DeFi analytics platforms, events power the user-facing features that make blockchain applications accessible.',
  
  'collections-vector': 'Vectors are dynamic arrays; use unique prefixes (b"i", b"t") to namespace multiple collections and prevent collisions. This example has items and tags with different storage keys. Demonstrates add, remove, iterate, and the pattern for multiple collections in one contract.',
  
  'collections-map': 'Maps store key-value pairs for efficient lookups. This example demonstrates using LookupMap or UnorderedMap from near_sdk::collections. Maps are ideal for storing data indexed by unique keys, like user profiles or token balances. This contract shows basic map operations: insert, get, and remove.',
  
  'owner-pattern': 'Owner pattern: restrict privileged operations (e.g. set_value) to the contract owner. Uses env::predecessor_account_id() to identify the caller; assert_owner() guards sensitive calls. Owner is set at init.',
  
  'role-based-access': 'Role-based access control allows multiple accounts with different permission levels. This example demonstrates managing roles (like admin, moderator, user) and checking permissions before operations. It\'s more flexible than the owner pattern and suitable for contracts with multiple privileged actors.',
  
  'pausable-contract': 'Pausable contracts can temporarily halt operations in emergencies. This example demonstrates a pause/unpause mechanism controlled by an owner. When paused, critical functions revert. This pattern is useful for responding to bugs or security issues without redeploying the contract.',
  
  'multi-signature': 'Multi-signature requires multiple approvals before executing actions. This example demonstrates collecting signatures from multiple accounts and executing only when threshold is met. It\'s essential for high-security operations where no single account should have full control.',
  
  'todo-list': 'A todo list demonstrates CRUD operations with collections. This example shows creating, reading, updating, and deleting todo items stored in a vector or map. It demonstrates practical state management patterns for applications that need to maintain lists of user data.',
  
  'user-profiles': 'User profiles store account-specific data in a map. This example demonstrates mapping account IDs to profile structs containing user information. It shows how to create, update, and retrieve user data. This pattern is common in social or identity applications on NEAR.',
  
  'voting-system': 'A voting system demonstrates tallying votes and tracking participation. This example shows storing votes in a map, preventing double-voting, and calculating results. It demonstrates practical governance patterns where users can cast votes on proposals or decisions.',
  
  'testing': 'Unit testing verifies contract logic with #[cfg(test)] and assert_eq!. This example shows a simple test that instantiates the contract and checks add(2,3)==5. Run with cargo test. For cross-contract or blockchain context, use near_sdk test utilities.',
  
  'simple-calls': 'Simple cross-contract calls invoke methods on other contracts. This example demonstrates using Promise to call external contracts with a configurable method name. It shows the basic pattern for contract-to-contract communication, which is essential for building composable DeFi applications.',
  
  'upgrade-pattern': 'Upgrade pattern: init, PanicOnDefault (prevents uninitialized deserialization), and migration for post-upgrade schema changes. Migration functions upgrade contract code while preserving data. Owner-only migrate() handles versioning and backward compatibility.',
  
  'simple-marketplace': 'A simple marketplace enables buying and selling items. This example demonstrates listing items, handling purchases, and managing ownership transfers. It shows basic marketplace patterns including escrow, payment processing, and item management.',
  
  'batch-operations': 'Batch operations process multiple items atomically in one transaction. Gas optimization: use size limits (MAX_BATCH) to prevent runaway costs. Reduces gas vs many single-item calls; all operations succeed or fail together.',
  
  'nft-standard': 'NEP-171 NFT standard: transfer (1 yoctoNEAR proof), approve, and view methods. Demonstrates ownership checks, standard method names, and interoperability with wallets and marketplaces.',
  
  'nft-metadata': 'NFT metadata stores token information like name, description, and media. This example demonstrates storing and retrieving metadata following NEP-177 standards. It shows how to structure token metadata for display in wallets and marketplaces.',
  
  'nft-minting': 'NFT minting creates new tokens. This example demonstrates the minting process: generating unique token IDs, assigning ownership, and storing metadata. It shows how to control who can mint and how many tokens can be created.',
  
  'nft-approval': 'NFT approval allows others to transfer tokens on your behalf. This example demonstrates the approval system: granting permissions, checking approvals, and revoking access. It enables marketplace functionality where contracts can transfer tokens.',
  
  'nft-enumeration': 'NFT enumeration lists tokens owned by accounts. This example demonstrates pagination and querying token lists. It shows how to efficiently retrieve token IDs and metadata for display in user interfaces.',
  
  'nft-royalties': 'NFT royalties store royalty percentages per token (basis points, max 10000=100%). This example demonstrates set_royalty and get_royalty. Distribution logic is typically in the marketplace contract when a sale occurs.',
  
  'nft-marketplace': 'An NFT marketplace enables trading non-fungible tokens. This example demonstrates listing, bidding, and purchasing NFTs. It shows marketplace patterns including escrow, fee collection, and royalty distribution.',
  
  'callbacks': 'Callbacks process results from cross-contract calls. Uses and_then to chain a call with a callback. The callback reads promise_result(0) to handle success (extract value) or failure (return default). Essential for any async cross-contract flow.',
  
  'cross-call-ft': 'Cross-contract FT calls interact with fungible token contracts. This example demonstrates transferring tokens between contracts, checking balances, and handling token operations. It shows how to integrate with NEAR\'s standard FT contracts.',
  
  'cross-call-nft': 'Cross-contract NFT calls interact with NFT contracts. This example demonstrates transferring NFTs between contracts, checking ownership, and handling NFT operations. It shows how to build applications that work with existing NFT contracts.',
  
  'batch-calls': 'Chained calls execute cross-contract calls in sequence using and_then. Calls contract_a, then contract_b after the first completes. For parallel calls, use Promise::and. Use chaining when the second call depends on the first.',
  
  'chain-signatures-basics': 'Chain signatures: call the MPC contract (v1.signer) to sign 32-byte payloads for other chains. Uses ext_contract and Promise. Path derives the target chain address (e.g. ethereum-1). Attach ~0.05 NEAR for MPC fee.',
  'signature-verification': 'Validate payload format before MPC: must be 32 bytes (e.g. keccak256 hash). hash_for_signing produces the hash; actual signature verification happens on the destination chain.',
  'signature-requests': 'Track signature requests: create_request stores payload and path, get_request retrieves, sign_request calls MPC. Demonstrates request lifecycle before and during signing.',
  'multi-chain-signing': 'Different derivation paths per chain (ethereum-1, bitcoin-1, solana-1). set_chain_path maps chain_id to path; sign_for_chain uses the path when calling MPC.',
  'cross-chain-auth': 'Whitelist of authorized external identities. authorize_cross_chain adds, revoke_cross_chain removes, require_authorized gates cross-chain actions. Use before allowing MPC sign requests.',
  'signature-callbacks': 'Request MPC sign, then callback to store the result. Uses and_then to chain: MPC sign -> on_signature_ready. Callback reads promise_result(0) for the signature bytes.',

  'indexer-data': 'NEP-297 events: emit via EVENT_JSON: prefix (standard, version, event, data). This example has state (set_record, get_record) and emits record_updated on changes. Indexers (NEAR Indexer, QueryAPI) parse logs off-chain; setup and SQL are in NEAR docs.',
}

// Default explanation for contracts without specific explanations
export const getContractExplanation = (exampleId) => {
  return contractExplanations[exampleId] || 
    `This ${exampleId.replace(/-/g, ' ')} contract demonstrates key NEAR smart contract concepts. Explore the code to understand how it implements ${exampleId.includes('nft') ? 'NFT' : exampleId.includes('cross') ? 'cross-contract' : 'smart contract'} functionality on the NEAR blockchain.`
}

