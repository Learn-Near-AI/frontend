import {
  BASICS_EXAMPLE_IDS,
  isBasicsExample,
  basicsDetailedExplanations,
  getBasicsDetailedExplanation,
} from './basics-intro.js';
import { getGreetingDetailedExplanation } from './basics-greeting.js';
import { getContractStructureDetailedExplanation } from './basics-contract-structure.js';
import { getMethodsDetailedExplanation } from './basics-methods.js';
import { getStateManagementDetailedExplanation } from './basics-state-management.js';
import { getInputValidationDetailedExplanation } from './basics-input-validation.js';
import { getErrorHandlingDetailedExplanation } from './basics-error-handling.js';
import { getCollectionsDetailedExplanation } from './basics-collections.js';

export {
  BASICS_EXAMPLE_IDS,
  isBasicsExample,
  basicsDetailedExplanations,
  getBasicsDetailedExplanation,
};

export const getDetailedExplanation = (exampleId) => {
  if (exampleId === 'intro') {
    return getBasicsDetailedExplanation(exampleId);
  }
  if (exampleId === 'greeting') {
    return getGreetingDetailedExplanation(exampleId);
  }
  if (exampleId === 'contract-structure') {
    return getContractStructureDetailedExplanation(exampleId);
  }
  if (exampleId === 'view-methods' || exampleId === 'change-methods') {
    return getMethodsDetailedExplanation(exampleId);
  }
  if (exampleId === 'state-management') {
    return getStateManagementDetailedExplanation(exampleId);
  }
  if (exampleId === 'input-validation') {
    return getInputValidationDetailedExplanation(exampleId);
  }
  if (exampleId === 'error-handling') {
    return getErrorHandlingDetailedExplanation(exampleId);
  }
  if (exampleId === 'collections-vector') {
    return getCollectionsDetailedExplanation(exampleId);
  }
  return null;
};
