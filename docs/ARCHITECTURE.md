# Architecture

This document describes how wallet and backend integration work in NEAR by Building, to help contributors understand the system.

## Wallet Integration

The app uses two complementary systems:

1. **near-connect-hooks** – React context for wallet state (`useNearWallet`). Used by `NavWallet` (connect/disconnect) and `FnTestingTab` (view/call methods on deployed contracts).

2. **src/near/near.js** – Low-level wallet selector setup (`@near-wallet-selector`), RPC balance fetch, and backend-proxied view/call for deployment flows. Used by `ExampleDetail` for deployment (getActiveAccountId) and by `NavWallet` balance display via `useWalletBalance`.

`NearProvider` wraps the app in `main.jsx`. Wallet connection state is shared via `near-connect-hooks`. The wallet modal uses `contractId: 'example-contract.testnet'` for the sign-in request context.

## Backend Integration

| Purpose      | Config Key              | Endpoint              | Used For                    |
|-------------|-------------------------|-----------------------|-----------------------------|
| Rust compile| `config.backend.rust`   | `POST /api/compile`   | Compiling Rust contracts    |
| JS compile  | `config.backend.js`     | `POST /api/compile`   | Compiling JS/TS contracts   |
| Deploy      | `config.backend.deploy` | `POST /api/deploy`    | Deploying via NEAR CLI      |
| View/Call   | `config.backend.deploy` | `POST /api/contract/view` | View methods, post-deploy test |

Backend URLs are configured in `src/config/index.js` and can be overridden via env vars: `VITE_RUST_COMPILE_URL`, `VITE_JS_COMPILE_URL`, `VITE_DEPLOY_URL`.

## Development Proxy

In development, Vite proxies requests to avoid CORS:

- `/api/near-rpc` → NEAR RPC (default: `https://test.rpc.fastnear.com`)
- `/api/backend-rust` → Rust compile + deploy backend (default: `https://rustendpoint.fly.dev`)
- `/api/backend-js` → JS compile backend (default: `https://learn-near-backend.fly.dev`)

Proxy targets can be overridden via:

- `VITE_RPC_PROXY_TARGET`
- `VITE_RUST_PROXY_TARGET` (or `VITE_RUST_COMPILE_URL`)
- `VITE_JS_PROXY_TARGET` (or `VITE_JS_COMPILE_URL`)

See `.env.example` for all optional variables.
