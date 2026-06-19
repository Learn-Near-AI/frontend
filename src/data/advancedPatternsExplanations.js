import { testingExplanation } from './advancedPatterns/index.js';

export const ADVANCED_PATTERNS_EXAMPLE_IDS = [
  'testing',
];

export const isAdvancedPatternsExample = (exampleId) => ADVANCED_PATTERNS_EXAMPLE_IDS.includes(exampleId);

export const advancedPatternsDetailedExplanations = {
  'testing': testingExplanation,
};

export const getAdvancedPatternsDetailedExplanation = (exampleId) =>
  advancedPatternsDetailedExplanations[exampleId] ?? null;
