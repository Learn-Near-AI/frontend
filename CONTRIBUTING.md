# Contributing to NEAR by Building

Thank you for contributing! This guide covers how to add and improve examples, and the content review process.

---

## Content Review Checklist (Required for New Examples)

**Before submitting a PR that adds or significantly changes an example**, complete this checklist. Maintainers will use it during review.

### 1. Correctness

- [ ] **Compiles**: Rust and JavaScript/TypeScript code compiles without errors
- [ ] **Runs**: Example deploys and executes correctly on NEAR TestNet (or equivalent)
- [ ] **NEAR-specific**: Uses current NEAR SDK patterns (e.g. `#[near]` macro, not deprecated `#[near_bindgen]`)
- [ ] **No invalid patterns**: Does not teach patterns that are wrong for NEAR (e.g. EVM-style reentrancy guards on NEAR; see [NEAR reentrancy docs](https://docs.near.org/smart-contracts/security/reentrancy))
- [ ] **API accuracy**: Uses correct SDK APIs (e.g. `env::predecessor_account_id()`, `Promise::new()`, etc.)

### 2. No Duplication

- [ ] **Unique concept**: The example teaches a distinct concept not already covered
- [ ] **Checked existing examples**: Searched `src/data/exampleCode/` and `examplesData.js` for overlap
- [ ] **Differentiation**: If similar to an existing example, the learning goal and implementation are clearly different (e.g. "Simple Calls" vs "Callbacks" vs "Promise Results")

### 3. Clear Learning Goal

- [ ] **Single focus**: Each example focuses on one main concept
- [ ] **Explanation**: Added or updated entry in `src/data/contractExplanations.js` that describes what the example teaches
- [ ] **Metadata**: `examplesData.js` has correct `difficulty`, `language`, and `category`

### 4. Completeness

- [ ] **Fully functional**: All methods referenced in the example are implemented (e.g. if `nft_tokens` reads from `token_ids`, there must be a way to populate `token_ids`)
- [ ] **No placeholders**: No "TODO" or fake logic (e.g. returning `true` instead of actually verifying a signature)
- [ ] **Both languages**: Rust and JavaScript implementations are provided and equivalent in behavior

### 5. Security (for Security-Related Examples)

- [ ] **No vulnerabilities**: Access control, input validation, and state updates follow secure patterns
- [ ] **No self-exploits**: Methods like `add_admin` must be restricted (e.g. only owner or existing admins)

### 6. Standards Compliance (for NFT/FT Examples)

- [ ] **NEP alignment**: NFT examples align with NEP-171; FT examples with NEP-141
- [ ] **Deposit checks**: Transfer methods that require 1 yoctoNEAR for full-access-key proof use `require!` for attached deposit where applicable

---

## Adding a New Example

### Step 1: Add Metadata

In `src/data/examplesData.js`, add an entry under the appropriate category:

```javascript
{ id: 'my-example', name: 'My Example', difficulty: 'Intermediate', language: 'Rust' },
```

### Step 2: Add Code

Create or extend a file in `src/data/exampleCode/` (e.g. `basics.js`, `security.js`). Export an object with `Rust` and `JavaScript` keys:

```javascript
'my-example': {
  Rust: `...`,
  JavaScript: `...`,
},
```

### Step 3: Register as Working (if complete)

In `src/data/exampleCode/index.js`, add the example ID to `WORKING_EXAMPLES`:

```javascript
export const WORKING_EXAMPLES = [
  // ...
  'my-example',
]
```

### Step 4: Add Explanation

In `src/data/contractExplanations.js`, add a short explanation (under ~100 words):

```javascript
'my-example': 'This example demonstrates X. It shows how to Y and Z.',
```

### Step 5: Run Content Review Checklist

Complete the [Content Review Checklist](#content-review-checklist-required-for-new-examples) above before opening a PR.

---

## Editing Existing Examples

- **Bug fixes**: Correctness fixes are always welcome. Ensure the fix does not change the intended learning goal.
- **Refactors**: Prefer clarity over cleverness. Keep both Rust and JavaScript in sync.
- **Removals**: If removing an example, remove it from:
  - `examplesData.js`
  - The relevant file in `exampleCode/`
  - `WORKING_EXAMPLES` in `exampleCode/index.js`
  - `contractExplanations.js`

---

## Code Quality

- Run `npm run lint` and `npm run format` before committing
- Run `npm run test` to ensure tests pass
- Follow existing code style (Prettier, ESLint)

---

## Pull Request Checklist

- [ ] Content Review Checklist completed (for new/changed examples)
- [ ] Lint passes (`npm run lint`)
- [ ] Formatting applied (`npm run format`)
- [ ] Tests pass (`npm run test`)
- [ ] No duplicate examples introduced
- [ ] `contractExplanations.js` updated if the example teaches something new

---

## Questions?

Open an [issue](https://github.com/Learn-Near-AI/near-by-example/issues) for questions or discussions.
