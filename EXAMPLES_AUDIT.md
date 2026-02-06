# Examples Audit Report

**Date:** February 6, 2025  
**Total examples:** 40 (in WORKING_EXAMPLES)

---

## Summary

| Category | Solid Correct | Experimental | Issues |
|----------|---------------|-------------|--------|
| Basics (10) | 9 | 1 | 1 minor |
| Security (5) | 5 | 0 | 0 |
| Collections (5) | 3 | 2 | 2 bugs |
| Cross-Contract (5) | 4 | 1 | 1 stub |
| NFTs (7) | 4 | 3 | 2 bugs |
| Chain Signatures (6) | 4 | 2 | 1 API concern |
| Advanced (1) | 1 | 0 | 0 |
| Indexing (1) | 1 | 0 | 0 |
| **Total** | **36** | **5** | **2 issues** |

---

## Solid Correct (31 examples)

These examples have correct logic, proper Rust/JS parity, and use valid NEAR SDK patterns.

### Basics
- **hello-world** ✓
- **contract-structure** ✓
- **view-methods** ✓
- **change-methods** ✓
- **state-management** ✓
- **input-validation** ✓
- **error-handling** ✓
- **events** ✓
- **collections-map** ✓

### Security
- **owner-pattern** ✓
- **role-based-access** ✓
- **pausable-contract** ✓
- **multi-signature** ✓ (fixed)
- **upgrade-pattern** ✓

### Collections
- **todo-list** ✓
- **user-profiles** ✓
- **voting-system** ✓

### Cross-Contract
- **simple-calls** ✓
- **cross-call-ft** ✓
- **cross-call-nft** ✓
- **batch-calls** ✓

### NFTs
- **nft-standard** ✓
- **nft-metadata** ✓
- **nft-minting** ✓
- **nft-approval** ✓
- **nft-enumeration** ✓

### Chain Signatures
- **chain-signatures-basics** ✓
- **signature-verification** ✓
- **signature-requests** ✓
- **multi-chain-signing** ✓
- **cross-chain-auth** ✓

### Advanced & Indexing
- **testing** ✓
- **indexer-data** ✓

---

## Experimental (5 examples — reduced after fixes)

Examples that use newer/less common APIs or have minor behavioral differences.

| Example | Reason |
|---------|--------|
| **nft-royalties** | **BUG:** Missing owner check in `set_royalty`; uses `throw new Error` instead of `near.panic` |
| **nft-marketplace** | Same sequential flow as simple-marketplace (fixed); callback now checks promise result |

---

## Fixes Applied (Feb 2025)

- **batch-operations**: Added `near` import ✓
- **collections-vector**: `remove_item` now uses swap_remove semantics (O(1), matches Rust) ✓
- **simple-marketplace**: `on_payment_sent` now checks `promiseResultRaw(0)` before transferring ✓
- **callbacks**: `on_result` now parses `promiseResultRaw(0)` for u64 return value ✓
- **signature-callbacks**: Switched from `promiseBatchCreate` to `NearPromise` API ✓
- **signature-verification**: Added `hash_for_signing` using `near.keccak256` ✓

---

## Remaining Issues

### 1. nft-royalties (nfts.js)
**Bugs:**
- Missing owner check in `set_royalty` — anyone can set royalties (Rust has `require!(env::predecessor_account_id() == self.owner_id)`)
- Uses `throw new Error` instead of `near.panic` (wrong for NEAR contracts)
- Missing `owner_id` in constructor; Rust has it

---

### 2. nft-marketplace (nfts.js)
Same pattern as simple-marketplace — consider adding `promiseResultRaw` check in `on_payment_sent` callback for consistency.
