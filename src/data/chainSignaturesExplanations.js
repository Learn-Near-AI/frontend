import {
  chainSignaturesBasicsExplanation,
  signatureVerificationExplanation,
  signatureRequestsExplanation,
  multiChainSigningExplanation,
  crossChainAuthExplanation,
  signatureCallbacksExplanation,
} from './chainSignatures/index.js';

export const CHAIN_SIGNATURES_EXAMPLE_IDS = [
  'chain-signatures-basics',
  'signature-verification',
  'signature-requests',
  'multi-chain-signing',
  'cross-chain-auth',
  'signature-callbacks',
];

export const isChainSignaturesExample = (exampleId) => CHAIN_SIGNATURES_EXAMPLE_IDS.includes(exampleId);

export const chainSignaturesDetailedExplanations = {
  'chain-signatures-basics': chainSignaturesBasicsExplanation,
  'signature-verification': signatureVerificationExplanation,
  'signature-requests': signatureRequestsExplanation,
  'multi-chain-signing': multiChainSigningExplanation,
  'cross-chain-auth': crossChainAuthExplanation,
  'signature-callbacks': signatureCallbacksExplanation,
};

export const getChainSignaturesDetailedExplanation = (exampleId) =>
  chainSignaturesDetailedExplanations[exampleId] ?? null;
