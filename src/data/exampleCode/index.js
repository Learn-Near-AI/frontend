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

// List of example IDs that have working implementations
export const WORKING_EXAMPLES = [
  // Basics (10)
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'events',
  'collections-vector',
  'collections-map',
  // Security (5)
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
  // Collections (5)
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
  // Advanced (1)
  'testing',
  // Cross-Contract (5)
  'simple-calls',
  'callbacks',
  'cross-call-ft',
  'cross-call-nft',
  'batch-calls',
  // NFTs (7)
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
  // Indexing (1)
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

