import {
  nftStandardExplanation,
  nftMetadataExplanation,
  nftMintingExplanation,
  nftApprovalExplanation,
  nftEnumerationExplanation,
  nftRoyaltiesExplanation,
  nftMarketplaceExplanation,
} from './nfts/index.js';

export const NFTS_EXAMPLE_IDS = [
  'nft-standard',
  'nft-metadata',
  'nft-minting',
  'nft-approval',
  'nft-enumeration',
  'nft-royalties',
  'nft-marketplace',
];

export const isNftsExample = (exampleId) => NFTS_EXAMPLE_IDS.includes(exampleId);

export const nftsDetailedExplanations = {
  'nft-standard': nftStandardExplanation,
  'nft-metadata': nftMetadataExplanation,
  'nft-minting': nftMintingExplanation,
  'nft-approval': nftApprovalExplanation,
  'nft-enumeration': nftEnumerationExplanation,
  'nft-royalties': nftRoyaltiesExplanation,
  'nft-marketplace': nftMarketplaceExplanation,
};

export const getNftsDetailedExplanation = (exampleId) =>
  nftsDetailedExplanations[exampleId] ?? null;
