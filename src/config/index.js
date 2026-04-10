/**
 * Centralized application configuration.
 * All URLs and environment-dependent values should be defined here.
 */

const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';

export const config = {
  /** NEAR RPC endpoint - use proxy in dev to avoid CORS */
  rpcUrl: isDev ? '/api/near-rpc' : 'https://test.rpc.fastnear.com',

  /** NEAR network configuration */
  near: {
    networkId: 'testnet',
    walletUrl: 'https://testnet.mynearwallet.com',
    helperUrl: 'https://helper.testnet.near.org',
    explorerUrl: 'https://explorer.testnet.near.org',
  },

  /** Backend API URL - unified endpoint for all backend operations */
  backend:
    import.meta.env.VITE_BACKEND_URL ||
    (isDev ? '/api/backend' : 'https://learnnearbyexample.fly.dev'),

  /** External links */
  links: {
    docs: 'https://docs.near.org',
    github: 'https://github.com/Learn-Near-AI/near-by-example',
    githubOrg: 'https://github.com/orgs/Learn-Near-AI/repositories',
    linktree: 'https://linktr.ee/learnnear',
    explorer: 'https://explorer.testnet.near.org',
    nearBlocks: 'https://testnet.nearblocks.io',
  },
};

export const getCompileApiUrl = () => config.backend;
