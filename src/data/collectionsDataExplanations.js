import {
  todoListExplanation,
  userProfilesExplanation,
  votingSystemExplanation,
  simpleMarketplaceExplanation,
  batchOperationsExplanation,
} from './collections-data/index.js';
import { collectionsCodeExerciseExplanation } from './collections-code-exercise.js';

export const COLLECTIONS_EXAMPLE_IDS = [
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
  'collections-code-exercise',
];

export const isCollectionsExample = (exampleId) => COLLECTIONS_EXAMPLE_IDS.includes(exampleId);

export const collectionsDetailedExplanations = {
  'todo-list': todoListExplanation,
  'user-profiles': userProfilesExplanation,
  'voting-system': votingSystemExplanation,
  'simple-marketplace': simpleMarketplaceExplanation,
  'batch-operations': batchOperationsExplanation,
  'collections-code-exercise': collectionsCodeExerciseExplanation,
};

export const getCollectionsDetailedExplanation = (exampleId) =>
  collectionsDetailedExplanations[exampleId] ?? null;
