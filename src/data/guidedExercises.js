// Guided exercises (Starklings / CryptoZombies style): ~50% code completion, hints, "Put it to the test"
// Basics (10) + Access Control & Security (5) + Collections & Data (5) + NFTs (7). Fails if instructions not followed.

export const BASIC_GUIDED_EXAMPLES = [
  // Basics
  'greeting',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'events',
  'collections-vector',
  'collections-map',
  'basics-code-exercise',
  // Access Control & Security
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
  'advanced-code-exercise',
  // Collections & Data
  'todo-list',
  'user-profiles',
  'voting-system',
  'simple-marketplace',
  'batch-operations',
  'collections-code-exercise',
  // NFTs
  'nft-standard',
  'nft-metadata',
  'nft-minting',
  'nft-approval',
  'nft-enumeration',
  'nft-royalties',
  'nft-marketplace',
  // Cross-Contract
  'simple-calls',
  'callbacks',
  'cross-call-ft',
  'cross-call-nft',
  'batch-calls',
  // Chain Signatures
  'chain-signatures-basics',
  'signature-verification',
  'signature-requests',
  'multi-chain-signing',
  'cross-chain-auth',
  'signature-callbacks',
  // Indexing
  'indexer-data',
  // Advanced Patterns
  'testing',
];

export const isGuidedExample = (exampleId) => BASIC_GUIDED_EXAMPLES.includes(exampleId);

// "Put it to the test" section content (markdown) for ExplanationTab
export const putItToTheTest = {
  greeting: `### Put it to the test

- Complete the **\`greet\`** method so it returns the string **"Greetings, Adventurer!"**.
- Run the contract; it should compile and the view method should return that greeting.`,

  'contract-structure': `### Put it to the test

- Add **\`owner_id: AccountId\`** and **\`greeting: String\`** to the contract struct.
- In **\`new\`**, set **\`owner_id\`** to **\`env::predecessor_account_id()\`** (the deployer).
- Implement **\`get_owner\`** and **\`get_greeting\`** as view methods.
- Implement **\`set_greeting\`** with:
  - Access control: require predecessor == owner_id
  - Validation: require greeting is not empty
- Run to verify: anyone can read, only owner can write!`,

  'view-methods': `### Put it to the test

- Implement **\`get_my_greeting\`**: Use \`env::predecessor_account_id()\` to get caller, then lookup in user_greetings (or return default).
- Implement **\`get_default_greeting_length\`**: Return \`default_greeting.len() as u64\`.
- Implement **\`has_custom_greeting(account)\`**: Use \`user_greetings.contains_key(&account)\`.
- All are FREE view methods — run and call them without a wallet!`,

  'change-methods': `### Put it to the test

- Implement **\`set_message\`**: Add require! for owner (predecessor == owner_id), validate not empty, update message.
- Implement **\`append_to_message\`**: Add require! for owner, validate not empty, use push_str.
- Implement **\`reset_message\`**: Add require! for owner, set back to "Welcome, traveler!".
- Run to compile; test that owner can change, non-owner cannot!`,

  'state-management': `### Put it to the test

- Add a **\`counter\`** state field (e.g. \`u64\` / number), initialized to **0** in \`new\`.
- Implement **\`increment\`** to add 1 to \`counter\`.
- Implement **\`get_counter\`** to return the current \`counter\`.
- Run and verify; after increment, get_counter should return the new value.`,

  'input-validation': `### Put it to the test

- In **\`set_message\`**, add **\`require!\`** (Rust) or **\`near.panic\`** (JS): message must be **non-empty** and **max 100** characters.
- Run to compile; calling set_message with empty or too-long string should fail with your message.`,

  'error-handling': `### Put it to the test

- Implement **\`try_parse_number\`** to return \`Option<u64>\` / \`number | null\`: \`Some(n)\` if the string parses, else \`None\`.
- Implement **\`safe_divide(a, b)\`** to return \`Option\`: result if \`b != 0\`, else \`None\`.
- Run (and run tests in Rust) so the contract compiles and tests pass.`,

  events: `### Put it to the test

- Define a **\`#[near(event_json(standard = "learn-near-message"))]\`** enum with **\`MessageUpdated\`** variant containing \`old_message\`, \`new_message\`, and \`updated_by\`.
- In **\`set_message\`**, update state first, then emit the event using **\`self.emit()\`** AFTER.
- Add the **\`updated_by: AccountId\`** field using **\`near_sdk::env::predecessor_account_id()\`**.
- Run to compile; calling set_message should emit the NEP-297 event.`,

  'collections-vector': `### Put it to the test

- Add a **\`Vector<String>\`** (or array in JS) with a **unique storage prefix** (e.g. \`b"i"\` / \`"i"\`).
- Implement **\`add_item\`**, **\`get_item(index)\`**, and **\`get_items\`** (return all). Optionally **\`remove_item(index)\`** (swap-remove for O(1) in Rust).
- Run to compile and verify add/get behavior.`,

  'collections-map': `### Put it to the test

- Add a **map** from \`AccountId\` to \`u64\` (or account → number in JS) with a unique prefix.
- Implement **\`set_balance(account, amount)\`**, **\`get_balance(account)\`**, and **\`remove_balance(account)\`**.
- Run to compile and verify get/set/remove.`,

  // Access Control & Security
  'owner-pattern': `### Put it to the test

- Implement **\`assert_owner\`**: require that \`env::predecessor_account_id() == self.owner_id\` (Rust) or \`near.predecessorAccountId() === this.owner_id\` (JS); otherwise panic with "Only owner can call this method".
- In **\`set_value\`**, call \`assert_owner\` before updating \`value\`. Run; only the owner account should be able to set_value.`,

  'role-based-access': `### Put it to the test

- In **\`add_admin\`**, require that the caller is either \`owner_id\` or already in \`admins\`; then insert the new account into \`admins\`.
- In **\`admin_only_action\`**, require that \`env::predecessor_account_id()\` (or predecessor) is in \`admins\`. Run; non-admins must not be able to call admin_only_action.`,

  'pausable-contract': `### Put it to the test

- Implement **\`pause\`** and **\`unpause\`** so only \`owner_id\` can call them; set \`paused\` to \`true\` / \`false\`.
- In **\`action\`**, require \`!self.paused\` (or \`!this.paused\`) or panic "Contract is paused". Run; when paused, action must fail.`,

  'multi-signature': `### Put it to the test

- In **\`approve\`**, require the caller is in \`signers\`; then insert a key like \`action:signer\` into \`approvals\`.
- In **\`can_execute\`**, count how many signers have approved this action; return true if count >= \`required_signatures\`.
- In **\`execute\`**, require \`can_execute\`; then clear those approvals and set \`last_executed_action\`. Run; execute must fail until enough approvals.`,

  'upgrade-pattern': `### Put it to the test

- Store **\`owner_id\`** and **\`version\`** in state; set in \`new()\`.
- **\`migrate\`**: require caller is owner; increment \`version\` and log. Run; only owner should be able to call migrate.`,

  // Collections & Data
  'todo-list': `### Put it to the test

- **\`add_todo\`**: validate non-empty title; create a todo with \`next_id\`, \`owner = predecessor\`, push to storage and \`todo_ids\`; increment \`next_id\`.
- **\`complete_todo\`** / **\`update_todo\`** / **\`delete_todo\`**: require the todo exists and \`todo.owner == predecessor\`; then update or remove. Run; only the owner of a todo can complete/update/delete it.`,

  'user-profiles': `### Put it to the test

- **\`set_profile(name, bio)\`**: set \`profiles[predecessor] = { name, bio, created_at: block_timestamp }\`.
- **\`get_profile(account)\`**: return the profile for that account or None. Run; get_profile must return what was set.`,

  'voting-system': `### Put it to the test

- **\`vote(choice)\`**: require the predecessor has not voted (not in \`voters\`); insert into \`voters\`; increment \`votes_yes\` or \`votes_no\` by choice.
- **\`get_results\`**: return \`(votes_yes, votes_no)\`. Run; double-voting must fail; get_results must match votes cast.`,

  'simple-marketplace': `### Put it to the test

- **\`list_item\`**: store a listing (seller, nft_contract_id, token_id, price) keyed by \`listing_id\`.
- **\`buy\`**: require listing exists and attached deposit >= price; remove listing; transfer payment to seller and call NFT \`nft_transfer_from\` (use callback to send payment only if NFT transfer succeeds). Run; buy must fail if payment too low.`,

  'batch-operations': `### Put it to the test

- **\`add_many(items)\`**: require \`items.len() <= MAX_BATCH\` (e.g. 100); push each item to storage.
- **\`get_all\`** / **\`len\`**: return all items and length. Run; add_many with > MAX_BATCH must fail.`,

  'collections-code-exercise': `### Put it to the test

This contract combines all collection patterns. Fix the **8 bugs**:

- **Bug 1 — Todo**: \`add_todo\` doesn't validate that title is non-empty.
- **Bug 2 — Todo**: \`complete_todo\` doesn't check that the caller owns the todo.
- **Bug 3 — Profiles**: \`set_profile\` accepts \`account\` param instead of using predecessor.
- **Bug 4 — Profiles**: \`set_profile\` doesn't record \`created_at\` using \`block_timestamp\`.
- **Bug 5 — Voting**: \`vote\` doesn't check if the caller has already voted.
- **Bug 6 — Voting**: \`vote\` doesn't increment \`votes_yes\` or \`votes_no\`.
- **Bug 7 — Marketplace**: \`buy\` doesn't check that \`attached_deposit >= price\`.
- **Bug 8 — Batch**: \`add_many\` doesn't validate \`items.len() <= MAX_BATCH\`.

Compile after each fix. Deploy when all bugs are fixed!`,

  // NFTs
  'nft-standard': `### Put it to the test

- **\`nft_transfer\`**: require attached deposit == 1 yoctoNEAR; require token exists and \`token.owner_id == predecessor\`; set \`token.owner_id = receiver_id\` and save.
- **\`nft_token(token_id)\`**: return (token_id, owner_id, metadata) or None. Run; transfer must fail without 1 yoctoNEAR and if not owner.`,

  'nft-metadata': `### Put it to the test

- **\`set_metadata(token_id, title, description, media)\`**: build a \`TokenMetadata\` and insert into \`metadata\` map.
- **\`get_metadata(token_id)\`**: return the metadata or None. Run; get_metadata must return what was set.`,

  'nft-minting': `### Put it to the test

- **\`mint(receiver_id)\`**: require caller is \`owner_id\`; create a new token with \`next_id\`, assign \`owner_id = receiver_id\`; increment \`next_id\`; return token_id.
- **\`get_token\`**: return token_id and owner. Run; only owner can mint; get_token must return correct owner.`,

  'nft-approval': `### Put it to the test

- **\`approve(token_id, account_id)\`**: require token exists and \`token.owner_id == predecessor\`; set \`approved_account_id = Some(account_id)\`.
- **\`transfer_from\`**: require owner or approved account is predecessor; move token to receiver and clear approval. Run; transfer_from must fail if not owner or approved.`,

  'nft-enumeration': `### Put it to the test

- **\`mint(receiver_id)\`**: owner-only; insert token into \`tokens\` and push \`token_id\` to \`token_ids\`; increment \`next_id\`.
- **\`nft_tokens(from_index, limit)\`**: return a page of (token_id, owner_id) from \`token_ids\`. **\`nft_total_supply\`**: return \`token_ids.len()\`. Run; supply and list must match mints.`,

  'nft-royalties': `### Put it to the test

- **\`set_royalty(token_id, percent_basis_points)\`**: require caller is owner; require percent_basis_points <= 10000; insert into \`royalties\`.
- **\`get_royalty(token_id)\`**: return the value or None. Run; only owner can set_royalty; get_royalty must return set value.`,

  'nft-marketplace': `### Put it to the test

- **\`list\`**: store a sale (token_id, seller, nft_contract_id, price) with a unique listing_id.
- **\`buy\`**: require sale exists and attached deposit >= price; remove sale; call NFT \`nft_transfer_from\` and on success send payment to seller (callback pattern). Run; buy must fail if underpaid.`,

  // Cross-Contract
  'simple-calls': `### Put it to the test

- **\`call_other_contract\`**: Create a \`Promise::new(contract_id)\` and call \`.function_call(method_name, empty_args, 0 deposit, 5 TGas)\`. Return the promise.
- Run; call_other_contract must not panic on a valid target.`,

  'callbacks': `### Put it to the test

- **\`call_then_callback\`**: Call \`get_value\` on external contract, then chain \`.then()\` to call \`on_result\` on self.
- **\`on_result\`**: Read \`env::promise_result(0)\`, return the u64 value on success, 0 on failure.
- Run; the callback must execute and return a value.`,

  'cross-call-ft': `### Put it to the test

- **\`ft_transfer_call\`**: Format args as JSON with \`receiver_id\`, \`amount\` (string), \`memo\` (null). Call \`ft_transfer\` on the token contract with 1 yoctoNEAR deposit and 10 TGas.
- Run; the FT transfer must complete successfully.`,

  'cross-call-nft': `### Put it to the test

- **\`nft_transfer_call\`**: Format args as JSON with \`receiver_id\`, \`token_id\`, \`memo\` (null), \`msg\` (""). Call \`nft_transfer_call\` on the NFT contract with 1 yoctoNEAR deposit and 10 TGas.
- Run; the NFT transfer must succeed (ensure approval was set first).`,

  'batch-calls': `### Put it to the test

- **\`batch_call\`**: Call \`get_value\` on contract_a, then chain \`.then()\` to call \`get_value\` on contract_b. Use \`Gas::from_tgas(10)\` per call.
- Run; contract_a must execute before contract_b.`,

  'basics-code-exercise': `### Put it to the test

This contract has **8 bugs** from your Basics learning. Find and fix them all!

---

**Bug 1 — State Management**
- \`get_counter\` currently returns \`99\` → Fix it to return \`self.counter\`

---

**Bug 2 — View Methods**  
- \`get_greeting\` returns a \`u64\` → Change return type to \`String\` and fix the default to \`"Hello".to_string()\`

---

**Bug 3 — Change Methods (Access Control)**
- \`set_counter\` → Add \`require!(env::predecessor_account_id() == self.owner_id, "...")\`
- \`reset_counter\` → Add the same owner check

---

**Bug 4 — Input Validation**
- \`add_record\` → Add \`require!(!record.is_empty(), "Record cannot be empty")\`

---

**Bug 5 — Input Validation**
- \`get_record\` → Add bounds check: panic if \`index >= self.records.len()\`

---

**Bug 6 — Error Handling**
- \`safe_add\` → Change return type to \`Option<u64>\` and use \`checked_add\` to return \`None\` on overflow

---

**Bug 7 — Error Handling**
- \`try_parse\` → Implement: return \`Some(parsed_value)\` if parse succeeds, \`None\` if it fails

---

Compile after each fix. Deploy when all bugs are fixed!`,

  'advanced-code-exercise': `### Put it to the test

This contract has **8 bugs** from your Advanced learning. Find and fix them all!

---

**Bug 1 — Owner Pattern**
- \`get_owner\` currently returns \`self.owner_id\` → Fix: Should clone the AccountId

---

**Bug 2 — Pausable Contract**
- \`get_paused\` returns \`self.is_paused\` → Fix: Should check if paused before any state change

---

**Bug 3 — Role-Based Access**
- \`is_admin\` has wrong logic → Fix: Only owner or existing admins should be able to add admins

---

**Bug 4 — Events**
- \`get_items\` returns all items → Fix: Should emit an event when adding items

---

**Bug 5 — Collections: Map**
- \`get_balance\` uses \`unwrap_or(0)\` → Fix: Should use checked arithmetic for deposits/withdrawals

---

**Bug 6 — Collections: Vector**
- \`add_item\` doesn't validate → Fix: Add require! to check contract is not paused

---

**Bug 7 — Multi-Signature**
- \`vote\` has no access control → Fix: Only signers (admins) should be able to vote

---

**Bug 8 — Error Handling**
- All methods should handle errors properly and log events where appropriate

---

Compile after each fix. Deploy when all bugs are fixed!`,
};

// Hints per example (by language). Shown in order; "Show solution" reveals full code.
export const exerciseHints = {
  greeting: {
    Rust: [
      'The method should return a String. In Rust use `.to_string()` on a string literal.',
      'The exact string to return is "Greetings, Adventurer!" (with the comma and exclamation mark).',
    ],
    JavaScript: [
      'Use a view method (no state change). Return a string from the method.',
      'The exact string to return is "Greetings, Adventurer!"',
    ],
  },
  'contract-structure': {
    Rust: [
      'Add owner_id and greeting to the struct. Use #[near(contract_state)] for serialization.',
      'In new(), use env::predecessor_account_id() for owner, initial_greeting.unwrap_or_else for greeting.',
      'In set_greeting, use require!(env::predecessor_account_id() == self.owner_id, "...") for access control.',
    ],
    JavaScript: [
      'Store owner_id using near.predecessorAccountId() and greeting in constructor.',
      'In set_greeting, use require(near.predecessorAccountId() === this.owner_id, "...").',
    ],
  },
  'view-methods': {
    Rust: [
      'get_my_greeting: Use env::predecessor_account_id() to get caller, then user_greetings.get(&caller).unwrap_or_else(|| default_greeting.clone()).',
      'get_default_greeting_length: Return self.default_greeting.len() as u64.',
      'has_custom_greeting: Use user_greetings.contains_key(&account).',
    ],
    JavaScript: [
      'get_my_greeting: Use near.predecessorAccountId() to get caller, return this.user_greetings[caller] || this.default_greeting.',
      'get_default_greeting_length: Return this.default_greeting.length.',
      'has_custom_greeting: Return account in this.user_greetings.',
    ],
  },
  'change-methods': {
    Rust: [
      'set_message: require!(env::predecessor_account_id() == self.owner_id, "..."), require!(!new_message.is_empty(), "..."), then assign.',
      'append_to_message: require! for owner, require! for not empty, then self.message.push_str(&addition).',
      'reset_message: require! for owner, then self.message = "Welcome, traveler!".to_string().',
    ],
    JavaScript: [
      'set_message: require(near.predecessorAccountId() === this.owner_id, "..."), require(new_message.length > 0, "..."), then this.message = new_message.',
      'append_to_message: require + this.message += addition.',
      'reset_message: require + this.message = "Welcome, traveler!".',
    ],
  },
  'state-management': {
    Rust: [
      'Add counter: u64 to the struct. In new() set counter: 0. increment: self.counter += 1. get_counter: return self.counter.',
    ],
    JavaScript: [
      'Store counter in constructor (default 0). increment: this.counter += 1. get_counter: return this.counter.',
    ],
  },
  'input-validation': {
    Rust: ['Use require!(condition, "message"). Check message.len() > 0 and message.len() <= 100.'],
    JavaScript: [
      'Use near.panic("message") when invalid. Check message.length === 0 and message.length > 100.',
    ],
  },
  'error-handling': {
    Rust: [
      'try_parse_number: s.parse().ok(). safe_divide: if b == 0 { return None; } else { Some(a / b) }.',
    ],
    JavaScript: [
      'Return null for invalid parse or division by zero. Use parseInt and isNaN, or check b === 0.',
    ],
  },
  events: {
    Rust: [
      'Define #[near(event_json(standard: "learn-near-message"))] enum Event with #[event_version("1.0.0")] MessageUpdated { old_message, new_message, updated_by }.',
      'In set_message: update state first, then emit Event::MessageUpdated { old_message, new_message, updated_by }.emit().',
      'Remember to import near_sdk::env if using predecessor_account_id().',
    ],
    JavaScript: [
      'In set_message: update this.message first, then emit using near.log("EVENT_JSON:" + JSON.stringify(...)).',
    ],
  },
  'collections-vector': {
    Rust: [
      'Use Vector::new(b"i") for the prefix. push, get(index), iter().collect() for get_items. swap_remove for remove.',
    ],
    JavaScript: [
      'Use an array in state. push for add_item, [index] for get_item, spread or slice for get_items.',
    ],
  },
  'collections-map': {
    Rust: [
      'Use IterableMap::new(StorageKey::Balances). insert/get/remove. set_balance/add_balance/subtract_balance: require!(pred == owner_id). add: checked_add, subtract: checked_sub. transfer: check caller balance >= amount, subtract from sender, add to receiver. get_balances: iter().skip().take().collect().',
    ],
    JavaScript: [
      'Use object: this.balances[account]. set/add/subtract: check near.predecessorAccountId() === this.owner_id. add/sub: overflow/underflow check. get_balances: Object.entries, slice(start, start+limit).',
    ],
  },
  // Access Control & Security
  'owner-pattern': {
    Rust: [
      'assert_owner: require!(env::predecessor_account_id() == self.owner_id, "Only owner..."). set_value: call self.assert_owner() then self.value = value.',
    ],
    JavaScript: [
      'assert_owner: if (near.predecessorAccountId() !== this.owner_id) near.panic("..."). set_value: call this.assert_owner() then set this.value.',
    ],
  },
  'role-based-access': {
    Rust: [
      'add_admin: require!(pred == owner_id || admins.contains(&pred)). admins.insert(&account). admin_only_action: require!(is_admin(env::predecessor_account_id())).',
    ],
    JavaScript: [
      'add_admin: check pred === owner_id || admins.includes(pred); then push account. admin_only_action: require is_admin(predecessor).',
    ],
  },
  'pausable-contract': {
    Rust: [
      'pause/unpause: require predecessor == owner_id; set self.paused = true/false. action: require!(!self.paused, "Contract is paused").',
    ],
    JavaScript: [
      'pause/unpause: check owner; set this.paused. action: if (this.paused) near.panic("Contract is paused").',
    ],
  },
  'multi-signature': {
    Rust: [
      'propose: increment proposal_id, return id. approve: require signers.contains(&predecessor); approvals.insert(&format!("{}:{}:{}", proposal_id, action, signer)). can_execute: count approvals. execute: clear approvals, log action, set last_executed_action. get_signers/get_approvals: view methods.',
    ],
    JavaScript: [
      'propose: this.proposal_id++, return id. approve: signers.includes(signer); push `${proposal_id}:${action}:${signer}`. can_execute: count >= required_signatures. execute: clear approvals, log, set last_executed_action. get_signers/get_approvals: return signers/filtered signers.',
    ],
  },
  'upgrade-pattern': {
    Rust: [
      'new: set owner_id and version. migrate: require!(predecessor == owner_id); self.version += 1; env::log_str(...).',
    ],
    JavaScript: [
      'Store owner_id, version. migrate: if (predecessor !== owner_id) near.panic(...); this.version += 1.',
    ],
  },
  // Collections & Data
  'todo-list': {
    Rust: [
      'add_todo: require! title; create Todo { id: next_id, owner: env::predecessor_account_id() }; insert and push; next_id += 1. complete_todo: get todo, require todo.owner == predecessor, set completed = true, insert.',
    ],
    JavaScript: [
      'add_todo: push { id, title, completed, owner: predecessor }; next_id++. complete_todo: find todo, require owner, set completed = true.',
    ],
  },
  'user-profiles': {
    Rust: [
      'set_profile: profiles.insert(&env::predecessor_account_id(), &Profile { name, bio, created_at: env::block_timestamp() }). get_profile: profiles.get(&account).',
    ],
    JavaScript: [
      'set_profile: this.profiles[predecessor] = { name, bio, created_at: near.blockTimestamp() }. get_profile: return this.profiles[account].',
    ],
  },
  'voting-system': {
    Rust: [
      'vote: require!(!voters.contains(&voter)); voters.insert(&voter); if choice { votes_yes += 1 } else { votes_no += 1 }. get_results: (votes_yes, votes_no).',
    ],
    JavaScript: [
      'vote: if (voters.includes(voter)) panic; push voter; increment votes_yes or votes_no. get_results: [votes_yes, votes_no].',
    ],
  },
  'simple-marketplace': {
    Rust: [
      'list_item: insert Listing { seller, nft_contract_id, token_id, price }. buy: require deposit >= price; remove listing; Promise::new(seller).transfer(price) and function_call nft_transfer_from.',
    ],
    JavaScript: [
      'list_item: this.listings[id] = { seller_id, nft_contract_id, token_id, price }. buy: check deposit; delete listing; NearPromise.functionCall nft_transfer_from, then transfer.',
    ],
  },
  'batch-operations': {
    Rust: [
      'add_many: require!(items.len() <= MAX_BATCH); for item in items { self.items.push(&item) }. get_all: self.items.iter().collect().',
    ],
    JavaScript: [
      'add_many: if (items.length > MAX_BATCH) panic; items.forEach(i => this.items.push(i)). get_all: return this.items.',
    ],
  },
  'collections-code-exercise': {
    Rust: [
      'Bug 1: add_todo: require!(title.len() > 0, "...").',
      'Bug 2: complete_todo: Get owner from todo_owners, require!(owner == env::predecessor_account_id()).',
      'Bug 3: set_profile: Use env::predecessor_account_id() instead of the account parameter; remove account param from signature.',
      'Bug 4: set_profile: Add created_at: env::block_timestamp().',
      'Bug 5: vote: require!(!self.voters.contains(&voter), "Already voted").',
      'Bug 6: vote: if choice { self.votes_yes += 1 } else { self.votes_no += 1 }.',
      'Bug 7: buy: require!(env::attached_deposit() >= price, "Insufficient payment").',
      'Bug 8: add_many: require!(items.len() <= MAX_BATCH as usize, "Batch too large").',
    ],
    JavaScript: [
      'Bug 1: add_todo: Check title.length === 0.',
      'Bug 2: complete_todo: Check todo_owners[id] === near.predecessorAccountId().',
      'Bug 3: set_profile: Use near.predecessorAccountId() instead of the account param.',
      'Bug 4: set_profile: Add created_at: near.blockTimestamp().',
      'Bug 5: vote: Check this.voters.includes(near.predecessorAccountId()).',
      'Bug 6: vote: Increment this.votes_yes or this.votes_no based on choice.',
      'Bug 7: buy: Check near.attachedDeposit() >= price.',
      'Bug 8: add_many: Check items.length > MAX_BATCH.',
    ],
  },
  // NFTs
  'nft-standard': {
    Rust: [
      'nft_transfer: require!(env::attached_deposit() == 1); get token, require token.owner_id == predecessor; token.owner_id = receiver_id; insert. nft_token: tokens.get(&token_id).',
    ],
    JavaScript: [
      'nft_transfer: if (near.attachedDeposit() !== 1n) panic; get token, check owner; set token.owner_id = receiver_id. nft_token: return this.tokens[token_id].',
    ],
  },
  'nft-metadata': {
    Rust: [
      'set_metadata: TokenMetadata { title: Some(title), description, media, ... }; metadata.insert(&token_id, &meta). get_metadata: metadata.get(&token_id).',
    ],
    JavaScript: [
      'set_metadata: this.metadata[token_id] = { title, description, media, ... }. get_metadata: return this.metadata[token_id].',
    ],
  },
  'nft-minting': {
    Rust: [
      'mint: require!(env::predecessor_account_id() == self.owner_id); token_id = next_id.to_string(); insert Token { token_id, owner_id: receiver_id }; next_id += 1; return token_id.',
    ],
    JavaScript: [
      'mint: if (predecessor !== this.owner_id) panic; token_id = String(next_id); this.tokens[token_id] = { token_id, owner_id: receiver_id }; next_id++; return token_id.',
    ],
  },
  'nft-approval': {
    Rust: [
      'approve: get token, require token.owner_id == predecessor; token.approved_account_id = Some(account_id); insert. transfer_from: require owner or approved == predecessor; update owner, clear approval.',
    ],
    JavaScript: [
      'approve: require token.owner_id === predecessor; token.approved_account_id = account_id. transfer_from: require owner or approved; update owner, clear approval.',
    ],
  },
  'nft-enumeration': {
    Rust: [
      'mint: owner check; insert token; token_ids.push(&token_id); next_id += 1. nft_tokens: token_ids.iter().skip(from_index).take(limit).filter_map(|id| tokens.get(id)). nft_total_supply: token_ids.len().',
    ],
    JavaScript: [
      'mint: push to token_ids. nft_tokens: token_ids.slice(from_index, from_index + limit).map(id => tokens[id]). nft_total_supply: token_ids.length.',
    ],
  },
  'nft-royalties': {
    Rust: [
      'set_royalty: require predecessor == owner_id; require percent_basis_points <= 10000; royalties.insert(&token_id, &percent). get_royalty: royalties.get(&token_id).',
    ],
    JavaScript: [
      'set_royalty: check owner (add if missing); require percent <= 10000; this.royalties[token_id] = percent. get_royalty: return this.royalties[token_id].',
    ],
  },
  'nft-marketplace': {
    Rust: [
      'list: insert Sale { token_id, seller_id, nft_contract_id, price }. buy: require deposit >= price; remove sale; Promise nft_transfer_from + transfer to seller; use callback to send payment after NFT transfer.',
    ],
    JavaScript: [
      'list: sales[listing_id] = { token_id, seller_id, nft_contract_id, price }. buy: require deposit; delete sale; NearPromise nft_transfer_from then on_payment_sent to transfer.',
    ],
  },
  // Cross-Contract
  'simple-calls': {
    Rust: [
      'Use Promise::new(contract_id).function_call(method_name, args, deposit, gas).',
      'Args: b"{}".to_vec(), Deposit: NearToken::from_yoctonear(0), Gas: Gas::from_tgas(5).',
      'The method return type is Promise — just return the .function_call() result.',
    ],
    JavaScript: [
      'Use NearPromise.new(contract_id).functionCall(method_name, bytes(JSON.stringify({})), 0n, gas).',
      'Gas: BigInt(Math.floor(Number(near.prepaidGas()) / 2)).',
      'Don\'t forget .asReturn() at the end.',
    ],
  },
  'callbacks': {
    Rust: [
      'External call: Promise::new(contract_id).function_call("get_value", b"{}".to_vec(), 0 yocto, 10 TGas).',
      'Chain callback: .then(Promise::new(env::current_account_id()).function_call("on_result", b"{}".to_vec(), 0 yocto, 10 TGas)).',
      'Read result: env::promise_result(0); use match to handle Successful(data) vs Failed.',
      'Deserialize: u64::try_from_slice(&data).unwrap_or(0). Import BorshDeserialize.',
    ],
    JavaScript: [
      'Chain: NearPromise.new(contract_id).functionCall("get_value", args, 0n, gas).then(NearPromise.new(near.currentAccountId()).functionCall("on_result", args, 0n, gas)).asReturn().',
      'Read result: try { near.promiseResultRaw(0); ... } catch (_) { return 0; }.',
      'Parse u64: new DataView(result.buffer, result.byteOffset, 8).getBigUint64(0, true).',
    ],
  },
  'cross-call-ft': {
    Rust: [
      'Args format: format!(r#"{{"receiver_id":"{}","amount":"{}","memo":null}}"#, receiver_id, amount).',
      'Call ft_transfer with NearToken::from_yoctonear(1) deposit (required by NEP-141).',
      'Gas: Gas::from_tgas(10).',
    ],
    JavaScript: [
      'Args: bytes(JSON.stringify({ receiver_id, amount, memo: null })).',
      'Deposit: 1n (1 yoctoNEAR). Gas: Math.floor(prepaidGas / 2).',
      'Use .functionCall("ft_transfer", args, 1n, gas).asReturn().',
    ],
  },
  'cross-call-nft': {
    Rust: [
      'Args format: format!(r#"{{"receiver_id":"{}","token_id":"{}","memo":null,"msg":""}}"#, receiver_id, token_id).',
      'Call nft_transfer_call with NearToken::from_yoctonear(1) deposit (required by NEP-171).',
      'Gas: Gas::from_tgas(10). Ensure the owner has approved your contract first.',
    ],
    JavaScript: [
      'Args: bytes(JSON.stringify({ receiver_id, token_id, memo: null, msg: "" })).',
      'Deposit: 1n. Gas: Math.floor(prepaidGas / 2).',
      'Use .functionCall("nft_transfer_call", args, 1n, gas).asReturn().',
    ],
  },
  'batch-calls': {
    Rust: [
      'First: Promise::new(contract_a).function_call("get_value", b"{}".to_vec(), 0 yocto, gas_per_call).',
      'Chain: .then(Promise::new(contract_b).function_call("get_value", b"{}".to_vec(), 0 yocto, gas_per_call)).',
      'Set gas_per_call = Gas::from_tgas(10) before the chain.',
    ],
    JavaScript: [
      'Gas: BigInt(Math.floor(Number(near.prepaidGas()) / 3)) — 3 parts (this exec + call A + call B).',
      'Chain: NearPromise.new(contract_a).functionCall("get_value", args, 0n, gas).then(NearPromise.new(contract_b).functionCall("get_value", args, 0n, gas)).asReturn().',
    ],
  },
  // Chain Signatures
  'chain-signatures-basics': `### Put it to the test

- Implement **\`request_signature\`**: Create a \`SignRequest { payload, path, key_version }\` and call \`mpc::ext(MPC_CONTRACT).with_static_gas(GAS).with_attached_deposit(DEPOSIT).sign(request)\`.
- Mark the method as **\`#[payable]\`** and return the \`Promise\`.
- Run; the MPC contract must receive and process the signature request!`,

  'signature-verification': `### Put it to the test

- Implement **\`validate_payload\`**: Return \`payload.len() == 32\`.
- Implement **\`hash_for_signing\`**: Return \`env::keccak256_array(&message)\`.
- Run; validate_payload must reject non-32-byte inputs; hash_for_signing must return 32 bytes!`,

  'signature-requests': `### Put it to the test

- Implement **\`create_request\`**: Store a \`RequestRecord\` with status "pending" in \`requests\`.
- Implement **\`get_request\`**: Return the request from \`requests\` or \`None\`.
- Implement **\`sign_request\`**: Look up the request, create a \`SignRequest\`, call MPC's \`sign\`.
- Run; get_request must return the created request; sign_request must forward the correct payload!`,

  'multi-chain-signing': `### Put it to the test

- Implement **\`set_chain_path\`**: Insert the path into \`chain_paths\`.
- Implement **\`get_chain_path\`**: Return the path or \`None\`.
- Implement **\`sign_for_chain\`**: Look up the path for the chain (default "ethereum-1"), create \`SignRequest\`, call MPC.
- Run; sign_for_chain must use the correct path for each chain!`,

  'cross-chain-auth': `### Put it to the test

- Implement **\`authorize_cross_chain\`**: Insert into \`authorized\` set and log.
- Implement **\`revoke_cross_chain\`**: Remove from \`authorized\` set.
- Implement **\`is_authorized\`**: Check if the identity is in the set.
- Implement **\`require_authorized\`**: Panic if not authorized.
- Run; only authorized identities pass require_authorized; revoked identities are rejected!`,

  'signature-callbacks': `### Put it to the test

- Implement **\`request_sign_and_store\`**: Call MPC then chain \`.then()\` to \`on_signature_ready\`.
- Implement **\`on_signature_ready\`**: Read \`env::promise_result(0)\`, store signature on success.
- Implement **\`get_signature\`**: Return the stored signature or \`None\`.
- Run; the signature must be stored after the MPC call completes successfully!`,

  // Indexing
  'indexer-data': `### Put it to the test

- Implement **\`set_record\`**: Insert the record into \`records\`, then emit \`EVENT_JSON\` with standard "example", version "1.0.0", event "record_updated", and data including key, value, and whether it was replaced.
- Implement **\`get_record\`**: Return the record or \`None\`.
- Run; indexers must be able to parse the event and track state changes!`,

  // Advanced Patterns
  'testing': `### Put it to the test

- Implement **\`increment\`**: Assert caller is owner, then add 1 to counter.
- Implement **\`decrement\`**: Assert caller is owner, check for underflow, then subtract 1.
- Implement **\`get_counter\`**: Return the current counter value.
- Write tests for: initialization (counter == 0), increment (counter == 1), decrement (counter == 0), underflow protection (panic), access control (non-owner panic).
- Run \`cargo test\`; all tests must pass!`,

  'basics-code-exercise': {
    Rust: [
      'get_counter: Return self.counter, not a hardcoded value.',
      'get_greeting: Use LookupMap instead of HashMap. Return default greeting string, not u64.',
      'set_counter: Add require!(env::predecessor_account_id() == self.owner_id).',
      'reset_counter: Add owner check with require!().',
      'add_record: Add require!(!record.is_empty(), "...").',
      'get_record: Use self.records.len() to check bounds, panic if out of range.',
      'safe_add: Check for overflow using checked_add, return None if overflows.',
      'try_parse: Use s.parse::<u64>().ok() to convert and return Option.',
    ],
    JavaScript: [
      'get_counter: Return this.counter.',
      'get_greeting: Return this.users[account] || "Default greeting".',
      'set_counter: Add require(near.predecessorAccountId() === this.owner_id).',
      'reset_counter: Add owner check.',
      'add_record: Add if (record.length === 0) near.panic("...").',
      'get_record: Check if index < this.records.length, return null or panic if invalid.',
      'safe_add: Check if a + b exceeds Number.MAX_SAFE_INTEGER, return null on overflow.',
      'try_parse: Use parseInt(s) and isNaN() to return number or null.',
    ],
  },
  'advanced-code-exercise': {
    Rust: [
      'get_owner: Clone the AccountId before returning: self.owner_id.clone()',
      'get_paused: Add require!(!self.is_paused) to methods that modify state.',
      'is_admin: Check if predecessor is owner OR if they are already an admin.',
      'get_items: Add Event emission when items are added: Event::ItemAdded { item }.emit()',
      'get_balance: Use checked_add for deposits, ensure sufficient balance for withdrawals.',
      'add_item: Add require!(!self.is_paused, "Contract is paused") at the start.',
      'vote: Add require! to check predecessor is in admins map.',
    ],
    JavaScript: [
      'get_owner: Return this.owner_id directly.',
      'get_paused: Check this.is_paused before state changes.',
      'is_admin: Check if near.predecessorAccountId() is owner or in this.admins.',
      'get_items: Emit event using near.log("EVENT_JSON:...") when adding items.',
      'get_balance: Use checked addition/subtraction for balance operations.',
      'add_item: Add if (this.is_paused) near.panic("Contract is paused").',
      'vote: Check if near.predecessorAccountId() is an admin before voting.',
    ],
  },
  // Chain Signatures
  'chain-signatures-basics': {
    Rust: [
      'Define SignRequest struct with payload, path, key_version.',
      'Define MPC trait with #[ext_contract(mpc)] and sign method.',
      'request_signature: Create SignRequest, call mpc::ext(MPC_CONTRACT).with_static_gas(GAS).with_attached_deposit(DEPOSIT).sign(request).',
      'Import ext_contract: use near_sdk::ext_contract.',
      'Mark method as #[payable] and return Promise.',
    ],
    JavaScript: [
      'Create request object with payload, path, key_version.',
      'Call NearPromise.new(MPC_CONTRACT).functionCall("sign", bytes(JSON.stringify(request)), MPC_DEPOSIT, MPC_GAS).asReturn().',
      'Use @call({ payable: true }) decorator.',
    ],
  },
  'signature-verification': {
    Rust: [
      'validate_payload: payload.len() == 32.',
      'hash_for_signing: env::keccak256_array(&message).',
      'Both are &self view methods — no state changes, no gas cost.',
    ],
    JavaScript: [
      'validate_payload: Array.isArray(payload) && payload.length === 32.',
      'hash_for_signing: Array.from(near.keccak256(msg)).',
    ],
  },
  'signature-requests': {
    Rust: [
      'create_request: self.requests.insert(&request_id, &RequestRecord { payload, path, status: "pending".to_string() }).',
      'get_request: self.requests.get(&request_id).',
      'sign_request: Look up record, create SignRequest, call mpc::ext(...).sign(req).',
      'Use #[near(serializers = [json, borsh])] for RequestRecord.',
    ],
    JavaScript: [
      'create_request: Validate payload is 32 bytes, store with status "pending".',
      'get_request: return this.requests[request_id] ?? null.',
      'sign_request: Look up record, create NearPromise to MPC.functionCall("sign", ...).',
    ],
  },
  'multi-chain-signing': {
    Rust: [
      'new(): Initialize UnorderedMap with default paths (ethereum-1, bitcoin-1, solana-1).',
      'set_chain_path: self.chain_paths.insert(&chain_id, &path).',
      'get_chain_path: self.chain_paths.get(&chain_id).',
      'sign_for_chain: self.chain_paths.get(&chain_id).unwrap_or_else(|| "ethereum-1".to_string()).',
    ],
    JavaScript: [
      'Constructor: this.chain_paths = { ethereum: "ethereum-1", bitcoin: "bitcoin-1", solana: "solana-1" }.',
      'set_chain_path: this.chain_paths[chain_id] = path.',
      'get_chain_path: return this.chain_paths[chain_id] ?? null.',
      'sign_for_chain: Look up path (default "ethereum-1"), call MPC.',
    ],
  },
  'cross-chain-auth': {
    Rust: [
      'authorize: self.authorized.insert(&external_id); env::log_str(...).',
      'revoke: self.authorized.remove(&external_id).',
      'is_authorized: self.authorized.contains(&external_id).',
      'require_authorized: near_sdk::require!(self.authorized.contains(&external_id), "Not authorized...").',
    ],
    JavaScript: [
      'authorize: Push to this.authorized array if not already included; near.log(...).',
      'revoke: this.authorized = this.authorized.filter((x) => x !== external_id).',
      'is_authorized: return this.authorized.includes(external_id).',
      'require_authorized: near.panic(...) if not authorized.',
    ],
  },
  'signature-callbacks': {
    Rust: [
      'request_sign_and_store: Create SignRequest, call MPC, chain .then(Promise::new(account).function_call("on_signature_ready", ...)).',
      'on_signature_ready: match env::promise_result(0) { Successful(sig) => signatures.insert, _ => log failure }.',
      'get_signature: signatures.get(&request_id).',
      'Use LookupMap<String, Vec<u8>> with prefix b"s".',
    ],
    JavaScript: [
      'request_sign_and_store: NearPromise.new(MPC).functionCall("sign", ...).then(NearPromise.new(account).functionCall("on_signature_ready", ...)).asReturn().',
      'on_signature_ready: near.promiseResult(0); check length > 0; store in this.signatures[request_id].',
      'get_signature: return this.signatures[request_id] ?? null.',
    ],
  },
  // Indexing
  'indexer-data': {
    Rust: [
      'set_record: Get prev value with self.records.get(&key), insert new value, build JSON with format!(), log with env::log_str(&format!("EVENT_JSON:{}", json)).',
      'get_record: self.records.get(&key).',
      'Escape quotes in user input: .replace(\'"\', "\\\\\\"").',
      'JSON format: {"standard":"example","version":"1.0.0","event":"record_updated","data":{"key":"...","value":"...","replaced":true/false}}.',
    ],
    JavaScript: [
      'set_record: Check if key exists (replaced), store, build event object, near.log("EVENT_JSON:" + JSON.stringify(event)).',
      'get_record: return this.records[key] ?? null.',
      'Use JSON.stringify for safe escaping.',
    ],
  },
  // Advanced Patterns
  'testing': {
    Rust: [
      'increment: require!(env::predecessor_account_id() == self.owner_id, "..."); self.counter += 1.',
      'decrement: require!(owner); require!(self.counter > 0, "Underflow..."); self.counter -= 1.',
      'Tests: Use VMContextBuilder and testing_env!.',
      'Test init: assert_eq!(contract.get_counter(), 0).',
      'Test increment: increment(), assert_eq!(contract.get_counter(), 1).',
      'Test non-owner: Use #[should_panic(expected = "...")] with different predecessor.',
      'Test underflow: #[should_panic(expected = "Underflow...")] on decrement from 0.',
    ],
    JavaScript: [
      'increment: if (predecessor !== this.owner_id) near.panic(...); this.counter++.',
      'decrement: check owner; if (this.counter === 0) near.panic(...); this.counter--.',
      'Tests: Use NEAR JS SDK test framework with near.test.each or similar.',
    ],
  },
};
