import { indexerDataExplanation } from './indexing/index.js';

export const INDEXING_EXAMPLE_IDS = [
  'indexer-data',
];

export const isIndexingExample = (exampleId) => INDEXING_EXAMPLE_IDS.includes(exampleId);

export const indexingDetailedExplanations = {
  'indexer-data': indexerDataExplanation,
};

export const getIndexingDetailedExplanation = (exampleId) =>
  indexingDetailedExplanations[exampleId] ?? null;
