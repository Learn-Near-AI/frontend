// Main export file for all example code
import { basicsCode } from './basics.js'
import { securityCode } from './security.js'
import { collectionsCode } from './collections.js'
import { advancedCode } from './advanced.js'
import { crossContractCode } from './crossContract.js'
import { nftsCode } from './nfts.js'
import { chainSignaturesCode } from './chainSignatures.js'
import { indexingCode } from './indexing.js'
import { COMING_SOON_TEMPLATE } from '../constants.js'

// List of example IDs that have working implementations (62 total → 60+ complete)
export const WORKING_EXAMPLES = [
  // Basics (12)
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'storage-basics',
  'state-management',
  'input-validation',
  'access-control',
  'error-handling',
  'events',
  'collections-vector',
  'collections-map',
  // Security (6)
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
  // Collections (6)
  'storage-keys',
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
  // Advanced (5)
  'testing',
  'panic-handling',
  'initialization',
  'gas-optimization',
  'complete-example',
  // Cross-Contract (7)
  'simple-calls',
  'callbacks',
  'cross-call-ft',
  'cross-call-nft',
  'batch-calls',
  'promise-results',
  'async-patterns',
  // NFTs (8)
  'nft-transfer',
  'nft-standard',
  'nft-metadata',
  'nft-minting',
  'nft-approval',
  'nft-enumeration',
  'nft-royalties',
  'nft-marketplace',
  // Chain Signatures (6)
  'chain-signatures-basics',
  'signature-verification',
  'signature-requests',
  'multi-chain-signing',
  'cross-chain-auth',
  'signature-callbacks',
  // Indexing (2)
  'indexer-events',
  'indexer-data',
]

// Combine all code examples
const allCode = {
  ...basicsCode,
  ...securityCode,
  ...collectionsCode,
  ...advancedCode,
  ...crossContractCode,
  ...nftsCode,
  ...chainSignaturesCode,
  ...indexingCode,
}

// Export exampleCode with coming soon template for missing examples
export const exampleCode = new Proxy(allCode, {
  get(target, prop) {
    if (prop in target) {
      return target[prop]
    }
    // Return coming soon template for examples without code
    return COMING_SOON_TEMPLATE
  }
})

