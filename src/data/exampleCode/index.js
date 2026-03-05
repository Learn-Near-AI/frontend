// Main export file for all example code
import { basicsCode } from './basics.js';
import { securityCode } from './security.js';
import { collectionsCode } from './collections.js';
import { advancedCode } from './advanced.js';
import { crossContractCode } from './crossContract.js';
import { nftsCode } from './nfts.js';
import { chainSignaturesCode } from './chainSignatures.js';
import { indexingCode } from './indexing.js';
import { COMING_SOON_TEMPLATE } from '../constants.jsx';

// List of example IDs that have working implementations (full learning UI, incl. Intro path)
export const WORKING_EXAMPLES = [
  // Basics (9)
  'intro',
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'collections-vector',
  // Advanced (7)
  'collections-map',
  'events',
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
];

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
