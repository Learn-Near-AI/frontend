// Detailed explanations for Basics examples only (Ethernaut/CryptoZombies style).
// Each entry is an array of { title, content } for expandable modal sections. Content is markdown.

export const BASICS_EXAMPLE_IDS = [
  'intro',
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'events',
  'collections-vector',
  'collections-map',
];

export const isBasicsExample = (exampleId) => BASICS_EXAMPLE_IDS.includes(exampleId);

export const basicsDetailedExplanations = {
  intro: [
    {
      title: 'Learning path',
      content: `Follow this order for a smooth introduction to NEAR smart contracts:

1. **Hello World** — Minimal contract and a view method.
2. **Contract Structure** — State, \`#[near(contract_state)]\`, \`#[init]\`.
3. **View Methods** — Read-only, free to call.
4. **Change Methods** — State-changing, require gas and signer.
5. **State Management** — Counter pattern; persistence.
6. **Input Validation** — \`require!\` and safety.
7. **Error Handling** — Option/Result vs panic.
8. **Events** — NEP-297; indexable logs.
9. **Collections** — Vector and Map.
10. Then Security, Cross-Contract, NFTs.

Use the sidebar to open each example. The **Explanation** tab and **Put it to the test** section guide you; use **Hint** and **Show solution** in the editor when stuck.`,
    },
  ],

  'hello-world': [
    {
      title: 'Overview',
      content: `This is the **simplest NEAR smart contract**. It has no state and a single **view method** that returns a greeting.

- **View methods** are read-only: they don't modify contract state and are **free to call** (no gas, no transaction, no wallet).
- The contract is a **struct** with \`#[near(contract_state)]\` and an **impl** block with \`#[near]\` — the SDK generates serialization and the contract interface from these.`,
    },
    {
      title: 'Line-by-line (Rust)',
      content: `- **Lines 1–2** — \`use near_sdk::near; use near_sdk::PanicOnDefault;\` — Import the NEAR SDK macros and \`PanicOnDefault\` (recommended derive so uninitialized state panics).
- **Lines 4–5** — \`#[near(contract_state)]\` and \`#\[derive(PanicOnDefault)]\` — Marks the struct as the contract state; the SDK will derive serialization (Borsh) for it.
- **Line 6** — \`pub struct Contract {}\` — The contract has no fields; no persistent state.
- **Line 8** — \`#[near]\` on \`impl\` — Tells the SDK to expose the impl methods as contract methods.
- **Lines 10–12** — \`#[init] pub fn new() -> Self\` — The **initializer**: called once when the contract is deployed. Returns an empty \`Contract {}\`.
- **Lines 14–16** — \`pub fn hello_world(&self) -> String\` — **View method**: \`&self\` means read-only. Returns a \`String\`. The method name becomes \`hello_world\` in the contract API.
- **Line 15** — \`"Hello, NEAR!".to_string()\` — The actual return value. View methods can return any serializable type.

**Summary:** Struct + \`#[near]\` impl + \`#[init]\` + view method = minimal NEAR contract.`,
    },
    {
      title: 'Key concepts',
      content: `- **View vs change:** View = read-only, free. Change = modifies state, costs gas, requires a signed transaction.
- **\`#[init]\`** is required and called once at deployment.
- Every NEAR contract you write will follow this pattern: state struct, \`#[near]\` impl, init, and methods.`,
    },
  ],

  'contract-structure': [
    {
      title: 'Overview',
      content: `This contract shows the **standard structure** of a NEAR smart contract: a **state struct**, an **initializer**, and **methods**. Here the state is a single field \`owner_id\` (the account that "owns" the contract).

- **Contract struct** holds all persistent state; the SDK serializes it automatically.
- **\`#[init]\`** sets the initial \`owner_id\` to the current account (the deployer).
- **\`get_owner\`** is a view method that returns the stored owner.`,
    },
    {
      title: 'Line-by-line (Rust)',
      content: `- **Struct** — \`pub struct Contract { owner_id: AccountId }\` — **State**: one field. \`AccountId\` is the type for NEAR account names. This is persisted on-chain.
- **\`#[near(contract_state)]\`** — On the struct — The SDK derives Borsh (de)serialization. **Do not** manually add \`BorshSerialize\`/\`BorshDeserialize\` for the whole state.
- **\`PanicOnDefault\`** — In derive — If the contract is ever deserialized without going through \`#[init]\`, it panics. Prevents using uninitialized state.
- **\`new()\`** — \`owner_id: env::current_account_id()\` — **Init**: the deployer is the owner. \`env::current_account_id()\` is the contract's own account ID.
- **\`get_owner\`** — \`self.owner_id.clone()\` — Returns a copy of the stored \`AccountId\`. View method, so no \`mut\`, no state change.

**Tip:** \`env::predecessor_account_id()\` (the caller) is often used with \`owner_id\` for access control (e.g. "only owner can call this").`,
    },
    {
      title: 'Key concepts',
      content: `- **State** lives in the contract struct and persists across calls.
- **Init** runs once at deployment; all required state must be set there.
- **Owner pattern** (storing \`owner_id\`) is the basis for restricting sensitive methods to one account.`,
    },
  ],

  'view-methods': [
    {
      title: 'Overview',
      content: `**View methods** are read-only: they can read contract state and return values but **cannot change** state. They are **free** to call (no gas, no transaction).

This example has:
- A state field \`greeting\` (a string).
- \`get_greeting\` — returns the string.
- \`get_greeting_length\` — returns its length (e.g. \`u64\` in Rust).`,
    },
    {
      title: 'Line-by-line',
      content: `- **Struct:** \`greeting: String\` — persistent state.
- **\`#[init]\`:** Sets \`greeting = "hello"\` (or similar) by default.
- **\`get_greeting(&self)\`:** Returns \`self.greeting.clone()\`. No \`mut self\`, so the compiler enforces read-only.
- **\`get_greeting_length(&self)\`:** Returns \`self.greeting.len() as u64\` (Rust) or \`this.greeting.length\` (JS). View methods can return any serializable type (numbers, structs, vectors, maps).`,
    },
    {
      title: 'Key concepts',
      content: `- View = **no state change**, **free to call**. Use for UIs, balances, ownership checks.
- In Rust, view methods take \`&self\` (not \`&mut self\`).
- In JS, use \`@view({})\` and no state-modifying code.`,
    },
  ],

  'change-methods': [
    {
      title: 'Overview',
      content: `**Change methods** modify contract state. They require a **signed transaction** and **gas**.

This example stores a \`greeting\` string and provides:
- \`get_greeting\` — view, returns current greeting.
- \`set_greeting\` — change, updates the string.
- \`append_suffix\` — change, appends to the string.`,
    },
    {
      title: 'Line-by-line',
      content: `- **\`set_greeting(&mut self, greeting: String)\`:** \`&mut self\` allows mutation. Assign \`self.greeting = greeting\`. Marked with \`#[call]\` (Rust) or \`@call({})\` (JS).
- **\`append_suffix(&mut self, suffix: String)\`:** Use \`self.greeting.push_str(&suffix)\` (Rust) or \`this.greeting += suffix\` (JS).
- **Storage:** Data in the contract struct is persistent; it stays until you change it in a later transaction.`,
    },
    {
      title: 'Key concepts',
      content: `- Change methods use \`&mut self\` (Rust) or \`@call\` (JS) and cost gas.
- The NEAR runtime handles Borsh serialization; you just read/write fields.
- This pattern (view to read, change to write) is the basis for all stateful contracts.`,
    },
  ],

  'state-management': [
    {
      title: 'Overview',
      content: `This example implements a **counter**: a single number that can be **incremented** and **read**. It shows the full lifecycle: **init** (set initial value), **read** (view), **update** (change method).`,
    },
    {
      title: 'Line-by-line',
      content: `- **State:** \`counter: u64\` (or number in JS). In \`new()\`, set \`counter: 0\`.
- **\`increment(&mut self)\`:** \`self.counter += 1\` (or \`this.counter += 1\`). Change method.
- **\`get_counter(&self)\`:** Return \`self.counter\`. View method.
- **Atomicity:** Either the whole transaction (e.g. one \`increment\`) succeeds and state updates, or it fails and state is unchanged.`,
    },
    {
      title: 'Key concepts',
      content: `- The counter pattern is used everywhere: votes, balances, token supplies.
- State is **persistent** and **atomic** per transaction.`,
    },
  ],

  'input-validation': [
    {
      title: 'Overview',
      content: `**Input validation** prevents invalid or malicious data from corrupting state. This contract stores a \`message\` string but only if it is **non-empty** and **at most 100 characters**.`,
    },
    {
      title: 'Line-by-line',
      content: `- **\`set_message(&mut self, message: String)\`:** Before assigning, check:
  - **Rust:** \`require!(message.len() > 0, "Message cannot be empty");\` and \`require!(message.len() <= 100, "Message too long");\`
  - **JS:** \`if (message.length === 0) near.panic("...");\` and same for \`length > 100\`.
- If the check fails, the contract **panics** and the transaction is reverted (no state change).
- Use \`require!\` or \`near.panic\` for invariants that must never be violated.`,
    },
    {
      title: 'Key concepts',
      content: `- Always validate inputs: length, format, and business rules.
- Failed validation = panic = reverted transaction.`,
    },
  ],

  'error-handling': [
    {
      title: 'Overview',
      content: `Two styles of handling failures:
- **Recoverable:** Return \`Option\`/ \`Result\` (e.g. invalid input, division by zero) — the caller can handle \`None\` or \`Err\`.
- **Unrecoverable:** Use \`require!\` or \`env::panic_str\` for invariants (e.g. "value must be positive") — the transaction reverts.`,
    },
    {
      title: 'Line-by-line',
      content: `- **\`try_parse_number(s)\`:** Return \`s.parse().ok()\` (Rust) or \`parseInt\` + \`isNaN\` check (JS). Returns \`Option<u64>\` / number | null.
- **\`safe_divide(a, b)\`:** If \`b == 0\` return \`None\`/null; else return \`Some(a/b)\` / result.
- **\`assert_positive(value)\`:** \`require!(value > 0, "Value must be positive")\` — panic if violated.
- **\`strict_check(value)\`:** \`env::panic_str("ZERO_NOT_ALLOWED")\` for critical failures.`,
    },
    {
      title: 'Key concepts',
      content: `- **Option/Result** for expected failures; **panic** for invariants.
- Panic = entire transaction reverted, no state change.`,
    },
  ],

  'events': [
    {
      title: 'Overview',
      content: `**Events** let the contract emit **structured logs** that indexers (and UIs) can read. NEAR uses **NEP-297**: events are logged as strings with an \`EVENT_JSON:\` prefix followed by JSON.`,
    },
    {
      title: 'Line-by-line',
      content: `- When **updating state** (e.g. in \`set_message\`), after changing \`self.message\`, **emit an event**:
  - **Rust:** \`env::log_str(&format!("EVENT_JSON:{}", json))\` where \`json\` contains \`standard\`, \`version\`, \`event\`, \`data\`.
  - **JS:** \`near.log("EVENT_JSON:" + JSON.stringify({ standard, version, event, data }))\`
- **\`data\`** typically includes the new value (e.g. \`new_message\`) so indexers can store it.
- Events are stored in transaction receipts; they don't change contract state.`,
    },
    {
      title: 'Key concepts',
      content: `- NEP-297: \`EVENT_JSON:\` + JSON with \`standard\`, \`version\`, \`event\`, \`data\`.
- Use events for activity feeds, analytics, and UIs that react to contract actions.`,
    },
  ],

  'collections-vector': [
    {
      title: 'Overview',
      content: `**Vectors** are dynamic arrays. In NEAR you use \`Vector<T>\` from \`near_sdk::collections\` with a **unique byte prefix** (e.g. \`b"i"\`) so multiple collections in one contract don't collide in storage.`,
    },
    {
      title: 'Line-by-line',
      content: `- **\`Vector::new(b"i")\`** — Create a vector with storage prefix \`b"i"\`. Use a different prefix (e.g. \`b"t"\`) for another vector in the same contract.
- **\`push(&item)\`** — Append. **\`get(index)\`** — Get by index. **\`iter().collect()\`** — Get all items.
- **\`swap_remove(index)\`** — Remove by swapping with the last element (O(1)); then length decreases by 1.`,
    },
    {
      title: 'Key concepts',
      content: `- Every collection needs a **unique prefix** to avoid key collisions.
- \`swap_remove\` is O(1); use when order doesn't matter.`,
    },
  ],

  'collections-map': [
    {
      title: 'Overview',
      content: `**Maps** store key-value pairs (e.g. \`AccountId -> u64\` for balances). Use \`UnorderedMap\` or \`LookupMap\` from \`near_sdk::collections\` with a **unique prefix**.`,
    },
    {
      title: 'Line-by-line',
      content: `- **\`UnorderedMap::new(b"b")\`** — Map with prefix \`b"b"\`.
- **\`insert(&account, &amount)\`** — Set balance. **\`get(&account)\`** — Get balance (\`Option<u64>\`). **\`remove(&account)\`** — Remove entry.
- In JS, a plain object \`this.balances[account] = amount\` is often used for simplicity; the Rust types are the reference for production.`,
    },
    {
      title: 'Key concepts',
      content: `- Maps are for key-value storage (balances, profiles, etc.).
- Always use a **unique prefix** per collection.`,
    },
  ],
};

export const getBasicsDetailedExplanation = (exampleId) =>
  basicsDetailedExplanations[exampleId] ?? null;
