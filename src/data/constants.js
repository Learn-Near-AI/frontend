// Category order based on learning complexity (basic to advanced)
export const categoryOrder = [
  'Basics',
  'Access Control & Security',
  'Collections & Data',
  'NFTs',
  'Cross-Contract',
  'Chain Signatures',
  'Indexing',
  'Advanced Patterns',
]

export const categoryIcons = {
  'Basics': '/assets/images/basics.png',
  'Access Control & Security': '/assets/images/access.png',
  'Collections & Data': '/assets/images/collection.png',
  'Advanced Patterns': '/assets/images/advanced.png',
  'Fungible Tokens': '/assets/images/fungible.png',
  'NFTs': '/assets/images/nft.png',
  'Cross-Contract': '/assets/images/contract.png',
  'Chain Signatures': '/assets/images/chain.png',
  'Indexing': '/assets/images/indexing.png',
  'Real-World': '/assets/images/realworld.png',
}

export const difficultyColors = {
  'Beginner': 'bg-green-500/20 text-green-500 border-green-500/30',
  'Intermediate': 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
  'Advanced': 'bg-red-500/20 text-red-500 border-red-500/30',
}

export const languageIcons = {
  'Rust': '📜',
  'JS': '📜',
  'JavaScript': '📜',
  'Intro': '📖',
}

// Audited examples: production-safe, no known issues (from content audit)
// Experimental: exploratory examples; may have edge cases or need verification
export const AUDITED_EXAMPLES = [
  // Basics (10)
  'hello-world', 'contract-structure', 'view-methods', 'change-methods',
  'state-management', 'input-validation', 'error-handling', 'events',
  'collections-vector', 'collections-map',
  // Access Control & Security (5)
  'owner-pattern', 'role-based-access', 'pausable-contract', 'multi-signature', 'upgrade-pattern',
  // Collections & Data (5)
  'todo-list', 'user-profiles', 'voting-system', 'simple-marketplace', 'batch-operations',
  // Cross-Contract (5)
  'simple-calls', 'callbacks', 'cross-call-ft', 'cross-call-nft', 'batch-calls',
  // NFTs (6) — nft-royalties excluded: JS has owner-check bug
  'nft-standard', 'nft-metadata', 'nft-minting', 'nft-approval', 'nft-enumeration', 'nft-marketplace',
  // Chain Signatures (1) — JS uses JSON; MPC may expect Borsh; cross-chain-auth has no access control
  'signature-verification',
  // Indexing (1)
  'indexer-data',
  // Advanced (1)
  'testing',
]

export const isAuditedExample = (exampleId) =>
  AUDITED_EXAMPLES.includes(exampleId)

// Coming soon template for examples without code
export const COMING_SOON_TEMPLATE = {
  Rust: `// Coming Soon
// This example is under development.
// Check back soon for a complete implementation!

use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn placeholder(&self) -> String {
        "Coming soon!".to_string()
    }
}`,
  JavaScript: `// Coming Soon
// This example is under development.
// Check back soon for a complete implementation!

import { NearBindgen, view } from "near-sdk-js";

@NearBindgen({})
class Contract {
  @view({})
  placeholder() {
    return "Coming soon!";
  }
}`,
}

