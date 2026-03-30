// Gamified explanations for Advanced examples - unique themes for each!

import {
  collectionsMapExplanation,
  eventsExplanation,
  ownerPatternExplanation,
  roleBasedAccessExplanation,
  pausableContractExplanation,
  multiSignatureExplanation,
  upgradePatternExplanation,
} from './advanced/index.js';
import { advancedCodeExerciseExplanation } from './advanced-code-exercise.js';

export const ADVANCED_EXAMPLE_IDS = [
  'collections-map',
  'events',
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
  'advanced-code-exercise',
];

export const isAdvancedExample = (exampleId) => ADVANCED_EXAMPLE_IDS.includes(exampleId);

export const advancedDetailedExplanations = {
  'collections-map': collectionsMapExplanation,
  events: eventsExplanation,
  'owner-pattern': ownerPatternExplanation,
  'role-based-access': roleBasedAccessExplanation,
  'pausable-contract': pausableContractExplanation,
  'multi-signature': multiSignatureExplanation,
  'upgrade-pattern': upgradePatternExplanation,
  'advanced-code-exercise': advancedCodeExerciseExplanation,
};

export const getAdvancedDetailedExplanation = (exampleId) =>
  advancedDetailedExplanations[exampleId] ?? null;
