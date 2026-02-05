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
}

// Audited examples: production-safe, no known issues (from content audit)
// Experimental: exploratory examples; may have edge cases or need verification
export const AUDITED_EXAMPLES = [
  'hello-world', 'contract-structure', 'view-methods', 'change-methods',
  'storage-basics', 'state-management', 'input-validation', 'access-control',
  'owner-pattern', 'role-based-access', 'upgrade-pattern',
  'storage-keys', 'user-profiles', 'voting-system', 'batch-operations',
  'nft-transfer', 'nft-metadata', 'nft-minting', 'nft-approval', 'nft-enumeration',
  'simple-calls', 'cross-call-ft', 'cross-call-nft', 'promise-results', 'async-patterns',
  'gas-optimization', 'panic-handling',
  'indexer-events', 'indexer-data',
  'chain-signatures-basics', 'signature-verification', 'signature-requests',
  'multi-chain-signing', 'cross-chain-auth',
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

