import {
  simpleCallsExplanation,
  callbacksExplanation,
  crossCallFtExplanation,
  crossCallNftExplanation,
  batchCallsExplanation,
} from './crossContract/index.js';

export const CROSS_CONTRACT_EXAMPLE_IDS = [
  'simple-calls',
  'callbacks',
  'cross-call-ft',
  'cross-call-nft',
  'batch-calls',
];

export const isCrossContractExample = (exampleId) => CROSS_CONTRACT_EXAMPLE_IDS.includes(exampleId);

export const crossContractDetailedExplanations = {
  'simple-calls': simpleCallsExplanation,
  'callbacks': callbacksExplanation,
  'cross-call-ft': crossCallFtExplanation,
  'cross-call-nft': crossCallNftExplanation,
  'batch-calls': batchCallsExplanation,
};

export const getCrossContractDetailedExplanation = (exampleId) =>
  crossContractDetailedExplanations[exampleId] ?? null;
