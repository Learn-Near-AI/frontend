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

  /** Backend API URLs - use proxy in development */
  backend: {
    rust: import.meta.env.VITE_RUST_COMPILE_URL || (isDev ? '/api/backend-rust' : 'https://rustendpoint.fly.dev'),
    js: import.meta.env.VITE_JS_COMPILE_URL || (isDev ? '/api/backend-js' : 'https://learn-near-backend.fly.dev'),
    deploy: import.meta.env.VITE_DEPLOY_URL || (isDev ? '/api/backend-rust' : 'https://rustendpoint.fly.dev'),
  },

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

export const getCompileApiUrl = (language) =>
  language === 'Rust' ? config.backend.rust : config.backend.js;
