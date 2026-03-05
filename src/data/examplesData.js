// Examples metadata - organized from basic to advanced
export const examplesData = {
  Basics: [
    { id: 'intro', name: 'Intro', difficulty: 'Beginner', language: 'Intro' },
    { id: 'hello-world', name: 'Hello World', difficulty: 'Beginner', language: 'Rust' },
    {
      id: 'contract-structure',
      name: 'Contract Structure',
      difficulty: 'Beginner',
      language: 'Rust',
    },
    { id: 'view-methods', name: 'View Methods', difficulty: 'Beginner', language: 'Rust' },
    { id: 'change-methods', name: 'Change Methods', difficulty: 'Beginner', language: 'Rust' },
    { id: 'state-management', name: 'State Management', difficulty: 'Beginner', language: 'Rust' },
    { id: 'input-validation', name: 'Input Validation', difficulty: 'Beginner', language: 'Rust' },
    { id: 'error-handling', name: 'Error Handling', difficulty: 'Intermediate', language: 'Rust' },
    {
      id: 'collections-vector',
      name: 'Collections: Vector',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
  ],
  Advanced: [
    {
      id: 'collections-map',
      name: 'Collections: Map',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    { id: 'events', name: 'Events', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'owner-pattern', name: 'Owner Pattern', difficulty: 'Intermediate', language: 'Rust' },
    {
      id: 'role-based-access',
      name: 'Role-Based Access',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    {
      id: 'pausable-contract',
      name: 'Pausable Contract',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    { id: 'multi-signature', name: 'Multi-Signature', difficulty: 'Advanced', language: 'Rust' },
    { id: 'upgrade-pattern', name: 'Upgrade Pattern', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Collections & Data': [
    // Intermediate - Data Structures and Applications
    { id: 'todo-list', name: 'Todo List', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'user-profiles', name: 'User Profiles', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'voting-system', name: 'Voting System', difficulty: 'Intermediate', language: 'Rust' },
    {
      id: 'simple-marketplace',
      name: 'Simple Marketplace',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    // Advanced - Complex Operations
    { id: 'batch-operations', name: 'Batch Operations', difficulty: 'Advanced', language: 'Rust' },
  ],
  NFTs: [
    // Intermediate - NFT Operations (NEP-171 transfer + standard methods)
    { id: 'nft-standard', name: 'NFT Standard', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-metadata', name: 'NFT Metadata', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-minting', name: 'NFT Minting', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'nft-approval', name: 'NFT Approval', difficulty: 'Intermediate', language: 'Rust' },
    {
      id: 'nft-enumeration',
      name: 'NFT Enumeration',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    // Advanced - Complex NFT Features
    { id: 'nft-royalties', name: 'NFT Royalties', difficulty: 'Advanced', language: 'Rust' },
    { id: 'nft-marketplace', name: 'NFT Marketplace', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Cross-Contract': [
    // Beginner - Basic Cross-Contract Calls
    { id: 'simple-calls', name: 'Simple Calls', difficulty: 'Beginner', language: 'Rust' },
    // Intermediate - Callbacks and Token Calls
    { id: 'callbacks', name: 'Callbacks', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'cross-call-ft', name: 'Cross-Call FT', difficulty: 'Intermediate', language: 'Rust' },
    { id: 'cross-call-nft', name: 'Cross-Call NFT', difficulty: 'Intermediate', language: 'Rust' },
    // Advanced - Chained Calls
    { id: 'batch-calls', name: 'Chained Calls', difficulty: 'Advanced', language: 'Rust' },
  ],
  'Chain Signatures': [
    // Intermediate - Chain Signatures Basics
    {
      id: 'chain-signatures-basics',
      name: 'Chain Signatures Basics',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    {
      id: 'signature-verification',
      name: 'Signature Verification',
      difficulty: 'Intermediate',
      language: 'Rust',
    },
    // Advanced - Complex Chain Signature Patterns
    {
      id: 'signature-requests',
      name: 'Signature Requests',
      difficulty: 'Advanced',
      language: 'Rust',
    },
    {
      id: 'multi-chain-signing',
      name: 'Multi-chain Signing',
      difficulty: 'Advanced',
      language: 'Rust',
    },
    { id: 'cross-chain-auth', name: 'Cross-Chain Auth', difficulty: 'Advanced', language: 'Rust' },
    {
      id: 'signature-callbacks',
      name: 'Signature Callbacks',
      difficulty: 'Advanced',
      language: 'Rust',
    },
  ],
  Indexing: [
    // Contract side: NEP-297 events + state (indexer setup is off-chain)
    { id: 'indexer-data', name: 'NEP-297 Events', difficulty: 'Intermediate', language: 'Rust' },
  ],
  'Advanced Patterns': [
    // Intermediate - Testing and Patterns
    { id: 'testing', name: 'Unit Testing', difficulty: 'Intermediate', language: 'Rust' },
  ],
};
