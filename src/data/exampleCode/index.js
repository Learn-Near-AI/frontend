// Main export file for all example code
import { basicsCode } from './basics.js';
import { collectionsCode } from './collections.js';
import advancedCode from './advanced/index.js';
import { crossContractCode } from './crossContract.js';
import { nftsCode } from './nfts.js';
import { chainSignaturesCode } from './chainSignatures.js';
import { indexingCode } from './indexing.js';
import { advancedPatternsCode } from './advancedPatterns.js';
import { COMING_SOON_TEMPLATE } from '../constants.jsx';

// List of example IDs that have working implementations (full learning UI, incl. Intro path)
export const WORKING_EXAMPLES = [
  // Basics (10)
  'intro',
  'greeting',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'collections-vector',
  'basics-code-exercise',
  // Advanced (8)
  'collections-map',
  'events',
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
  'advanced-code-exercise',
  // Collections & Data (5)
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
  'collections-code-exercise',
  // NFTs (7)
  'nft-standard',
  'nft-metadata',
  'nft-minting',
  'nft-approval',
  'nft-enumeration',
  'nft-royalties',
  'nft-marketplace',
  // Cross-Contract (5)
  'simple-calls',
  'callbacks',
  'cross-call-ft',
  'cross-call-nft',
  'batch-calls',
  // Chain Signatures (6)
  'chain-signatures-basics',
  'signature-verification',
  'signature-requests',
  'multi-chain-signing',
  'cross-chain-auth',
  'signature-callbacks',
  // Indexing (1)
  'indexer-data',
  // Advanced Patterns (1)
  'testing',
];

// Examples that require all basics to be completed
export const BASICS_EXAMPLES = [
  'intro',
  'greeting',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'collections-vector',
];

// Advanced examples that require completion before advanced-code-exercise
export const ADVANCED_EXAMPLES = [
  'collections-map',
  'events',
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
];

// Collections & Data examples
export const COLLECTIONS_EXAMPLES = [
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
];

// Combine all code examples
const allCode = {
  ...basicsCode,
  ...collectionsCode,
  ...advancedCode,
  ...crossContractCode,
  ...nftsCode,
  ...chainSignaturesCode,
  ...indexingCode,
  ...advancedPatternsCode,
};

// Export exampleCode with coming soon template for missing examples
export const exampleCode = new Proxy(allCode, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    // Return coming soon template for examples without code
    return COMING_SOON_TEMPLATE;
  },
});
