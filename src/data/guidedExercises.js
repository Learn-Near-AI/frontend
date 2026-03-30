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
  // NFTs
  'nft-standard',
  'nft-metadata',
  'nft-minting',
  'nft-approval',
  'nft-enumeration',
  'nft-royalties',
  'nft-marketplace',
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
};
