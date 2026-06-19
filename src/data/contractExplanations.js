// Contract explanations - concise explanations for each contract (markdown formatted)
export const contractExplanations = {
  intro: `Welcome to NEARbyExample, brave adventurer!

**What's this place?**

Think of NEARbyExample like a giant shared notebook that everyone can see, but only you can write in (for your own pages). Once you write something, it stays there forever. No one can rip out the page or change what you wrote.

**Your Quest Begins Here**

We've built a learning path that works like unlocking new levels in a game. Each example builds on the last, and you'll gain new skills along the way:

**The Basics ⚔️**
Your first dungeons! Master these 8 examples to unlock the Advanced world:
- Hello World, Contract Structure, View Methods, Change Methods
- State Management, Input Validation, Error Handling, Collections: Vector

**Advanced 🛡️**
For brave explorers who've conquered the basics:
- Maps, Events, Owner Pattern, Role-Based Access
- Pausable Contract, Multi-Signature, Upgrade Pattern

**Under Development 🚧**
More dungeons being built:
- Collections & Data, NFTs, Cross-Contract, Chain Signatures, Indexing, Advanced Patterns

**Why We Did This**

Most tutorials assume you already know things. We don't think that's fair. So we made this — a place where you can actually play with code and see what happens. Every example has Rust and JavaScript versions. Pick your weapon and start questing!

> **Note on code:** You'll see \`use near_sdk::...\` imports in the code. These bring in the NEAR SDK types you need. Don't worry about memorizing them — they become familiar quickly!

**What You'll Learn**

- How NEAR contracts are structured (the foundation)
- Reading and writing data on-chain (your superpowers)
- Handling edge cases (your safety net)
- Collections for lists and key-value data (your inventory)
- Access control patterns (castle guards & guilds)
- Upgrading contracts without losing data (magic evolution)

The sidebar shows all your quests. We recommend going in order — each one unlocks the next. But hey, you're the hero. Choose your own path!

If something's confusing or you find a bug, that's on us. We're still learning too. Hope this helps you on your quest!

— The NEARbyExample Team`,

  greeting:
    'Meet **Beep** — your first NEAR robot! She lives on the blockchain and always says "Greetings, Adventurer!" — no server needed.\n\n- **Structure:** A contract struct with `#[near(contract_state)]` and `#[derive(PanicOnDefault)]` for safety. The `#[init]` constructor ensures proper setup.\n- **View method:** The `greet` function uses `&self`, making it a read-only view method—**free to call** with no gas fees or wallet signature needed.\n- **PanicOnDefault:** Prevents the contract from being used without proper initialization—a good safety habit.\n\nUnderstanding this basic pattern is crucial; every NEAR contract follows a similar structure. Your journey starts here!',

  'contract-structure':
    'Every contract needs a brain. Think of it like a **vending machine**: you put in money (gas), make your selection (call a method), and get what you want (result). No middleman needed!\n\n- **Contract struct** — Holds `owner_id` and `greeting` state. Use `#[near(contract_state)]` for serialization.\n- **Owner** — Set via `env::predecessor_account_id()` in constructor (the deployer becomes owner!)\n- **Access control** — `require!(env::predecessor_account_id() == self.owner_id)` gates write operations.\n- **View methods** — `get_owner`, `get_greeting` use `&self` for free read-only access.\n\n**Key distinction:** `predecessor_account_id()` = who called, `current_account_id()` = where contract lives.\n\nThis is the foundation for ALL security patterns on NEAR. Set owner early, check often!',

  'view-methods':
    "Become **The Scout**! A scout only LOOKS at stuff — never changes anything. That's what view methods do!\n\n- **This example:** Default greeting + user-specific greetings via `LookupMap`.\n- **get_my_greeting:** Returns caller's greeting (or default) — shows `predecessor_account_id()` for personalization.\n- **get_default_greeting_length:** Computed view — calculates on the fly.\n- **has_custom_greeting:** Boolean check — shows `contains_key` usage.\n\nView methods use `&self` for free read-only access. Change methods use `&mut self` for writes. Use views for UIs, balances, profiles — anything read-only!",

  'change-methods':
    'Time to **build**! Change methods modify state — but only for authorized users!\n\n- **This example:** Owner-protected message with `set_message`, `append_to_message`, `reset_message`.\n- **Access control:** `require!(env::predecessor_account_id() == self.owner_id)` gates all writes.\n- **Validation:** `require!(!new_message.is_empty())` prevents empty messages.\n- **Marking:** Use `&mut self` for change methods.\n\nChange methods cost gas because they modify blockchain state. View methods use `&self` for free reads. Pair them: views for UIs, changes for actions!',

  'state-management':
    'Your **inventory** awaits! In games, your inventory is what makes you unique. In contracts, **state** is your inventory — the data that sticks around between calls.\n\n- **This example:** A counter that goes up! Uses `increment` to add 1.\n- **Contract struct:** `counter: u64` stores an unsigned 64-bit integer.\n- **Lifecycle:** Initialization → reading (view) → updating (change).\n- **Persistence:** The new value stays until modified again.\n\nThe counter pattern is everywhere — votes, token balances, user scores. One method reads, one method changes. Simple!',

  'input-validation':
    'Meet **The Gatekeeper**! Every good castle has one — the person who checks what\'s allowed in. In your contracts, YOU are the gatekeeper.\n\n- This example uses **`require!`** to check message length (non-empty, max 100 chars).\n- **Storage:** Uses `String::new()` for empty initial state (same as `"".to_string()`).\n- **How it works:** If the check FAILS, the whole transaction stops — nothing gets saved.\n\nOn the blockchain, anyone can call your contract. Nice users. Mean users. Hackers. You need to check EVERYTHING!',

  'error-handling':
    "Even with the best gatekeeper, sometimes things go wrong. That's where **error handling** comes in — your safety net!\n\n- **Option<T>** for recoverable errors: `try_parse_number` returns `Some(value)` or `None`, `safe_divide` returns `Some(result)` or `None`.\n- **unwrap_or** for fallbacks: `parse_with_default` uses `s.parse().unwrap_or(default)`.\n- **require!** for validation: `assert_positive` checks `value > 0`.\n- **env::panic_str** for critical failures: `strict_check` for invariants that must never be violated.\n\n**Golden rule:** Fail gracefully when you can. Panic when you must. Always give clear error messages!",

  'collections-vector':
    'Unlock **The Treasure Chest**! Vectors let you store ordered lists that persist on the blockchain — like a to-do list, chat messages, or game logs.\n\n- **Storage prefix:** Each vector needs a unique prefix (e.g. `b"i"` for items, `b"t"` for tags) to avoid key collisions.\n- **This example:** Has `items: Vector<String>` with prefix `b"i"` and `tags: Vector<String>` with prefix `b"t"`.\n- **Operations:** `push` adds to end, `get` returns Option, `swap_remove` removes O(1) by swapping with last.\n\n> ** Gotcha:** `swap_remove` does NOT preserve order! It swaps the removed item with the LAST item. If order matters, be careful!\n\n> ** Gas warning:** `get_items` that collects everything is a gas trap for large lists. Works fine for small lists (~100 items), use pagination for bigger ones.',

  events:
    'The **Town Crier**! In old towns, the crier shouted news for everyone to hear. Events work the same — your contract shouts to the world!\n\n- **This example:** Uses modern `#[near(event_json(...))]` macro for 100/100 NEP-297 compliance.\n- **Event enum:** `MessageUpdated { old_message, new_message, updated_by }` with versioned variants.\n- **Emit:** `self.emit(Event::MessageUpdated { ... })` — macro handles JSON formatting!\n- **Indexers** listen for events to power real-time UIs without scanning the chain.\n\n> **Important:** Events are notifications, NOT state. Query contract directly for authoritative data!',

  'collections-map':
    'The **Leaderboard**! Imagine a scoreboard in an arcade. Every player has a score. You can look up ANY player\'s score instantly.\n\n- **UnorderedMap<AccountId, u64>** = the scoreboard type\n- **Storage prefix:** Use unique prefixes (e.g. `b"b"` for balances)\n- **Operations:** `insert`, `get`, `remove`, `contains_key`, `keys().collect()`\n- **Overflow protection:** Use `checked_add`/`checked_sub` for balance changes\n- **Pagination:** Use `skip` + `take` on keys to avoid gas traps on large maps\n- **Access control:** Owner-only modifications with `require!(predecessor == owner_id)`\n\n>  **Gas trap warning:** Collecting all keys with `keys().collect()` can be expensive for large maps! Works fine for small lists (~100), pagination for bigger ones.\n\nUnlike vectors (position: 0, 1, 2...), maps find things by KEY — super fast no matter how big the list!',

  'owner-pattern':
    'The **Castle Guard**! Every castle needs someone in charge — someone who can open the gates, change the rules, or guard the treasure.\n\n- **Set at init:** `owner_id: env::current_account_id()` = the contract account (not deployer!)\n- **Check:** `env::predecessor_account_id()` = who CALLED the method\n- **Guard:** `assert_owner()` checks predecessor == owner\n\n> **Key distinction:** `current_account_id()` = where contract lives, `predecessor_account_id()` = who called the method. Usually you want contract as owner, not deployer wallet!\n\nOnly the owner can do special things — change settings, withdraw fees, pause/upgrade. Everyone else uses regular features.',

  'role-based-access':
    "The **Guild Roles**! In an RPG guild: Guild Master runs everything, Admins manage members, Members are regular players. That's RBAC — multiple permission levels!\n\n- **This example:** Owner + admins (stored in `UnorderedSet<AccountId>`)\n- **add_admin:** Owner or existing admins can add\n- **is_admin:** Check if account is admin\n- **admin_only_action:** Guarded by owner OR admin\n\nMore flexible than owner-only! One person isn't the bottleneck for everything.",

  'pausable-contract':
    'The **Emergency Button**! Sometimes you need to hit PAUSE — bug found, emergency upgrade, maintenance. The pausable pattern adds a big red button!\n\n- **Flag:** `paused: bool` in state\n- **Owner-only:** `pause()` and `unpause()` functions\n- **Guard:** `require!(!self.paused, "Contract is paused")`\n\nWhen paused: critical operations stop, everyone sees "temporarily disabled", you fix things, then unpause! Like an emergency stop in a factory — hope never to use it, but glad it\'s there.',

  'multi-signature':
    'The **Two-Key Safe**! Imagine a safe needing TWO keys to open. Neither person can open it alone — both must approve!\n\n- **This example:** 3 signers, require 2 approvals (`required_signatures: 2`)\n- **Approvals:** Stored as `"action:signer"` to prevent duplicates\n- **execute:** Loops through signers MANUALLY (no magic `clear_for_action`!)\n\n\nCrucial for team treasuries, high-value ops, DAO-style governance. No single person can sneak something through!',

  'upgrade-pattern':
    ">  **CRITICAL WARNING:** NEVER delete fields when upgrading, or you'll lose data forever!\n\nThe **Evolution**! In games your character evolves. Your contract can too — update code while keeping data!\n\n- **Simple pattern:** Just `version: u32` + `migrate()` function\n- **How it works:** Deploy new WASM to same account, state is preserved\n- **migrate():** Increments version (and transforms data if needed!)\n\nNo proxy pattern, no Promise::new().deploy_contract(). Just version += 1! The actual code is much simpler than you might expect.",

  'todo-list':
    '**Todo list** — Per-user task management on-chain.\n\n- **`add_todo`** validates non-empty title and assigns caller as owner.\n- **`complete_todo`/`update_todo`/`delete_todo`** require caller == todo owner.\n- Uses **UnorderedMap** for fast lookups and **Vector** for ordered listing.',

  'user-profiles':
    '**User profiles** — Self-managed identity on-chain.\n\n- **`set_profile`** stores name, bio, and timestamp keyed by caller\'s account.\n- **`get_profile`** returns profile data or None.\n- Uses **UnorderedMap<AccountId, Profile>** for instant key-based lookups.',

  'voting-system':
    '**Voting system** — One-person-one-vote on-chain.\n\n- **`vote`** uses **UnorderedSet** to prevent double-voting.\n- **`get_results`** returns vote tallies O(1).\n- Uses simple counters for instant results without iteration.',

  'simple-marketplace':
    '**Simple marketplace** — Buy and sell NFTs.\n\n- **`list_item`** creates listings; **`buy`** pays the seller and transfers the NFT via **`nft_transfer_from`**.\n- **`on_payment_sent`** callback checks **`promise_result`** before transferring payment—essential for safe cross-contract flows.',

  'batch-operations':
    '**Batch operations** process multiple items **atomically** in one transaction.\n\n- **Gas:** Use size limits (e.g. `MAX_BATCH`) to prevent runaway costs.\n- Reduces gas vs many single-item calls; all operations succeed or fail together.',

  'nft-standard':
    '**NEP-171** NFT core:\n\n- **`nft_transfer`** — 1 yoctoNEAR proof; **`nft_token`** view.\n- Ownership checks, standard method names, 1 yoctoNEAR deposit for transfer.\n- For approval / transfer_from, see **nft-approval**.',

  'nft-metadata':
    '**NFT metadata** — Token info (name, description, media).\n\n- Store and retrieve metadata following **NEP-177**.\n- Structure token metadata for display in wallets and marketplaces.',

  'nft-minting':
    '**NFT minting** creates new tokens.\n\n- Owner-only **`mint`** generates unique token IDs and assigns ownership.\n- Demonstrates owner check, **`next_id`** counter, and inserting into the tokens map. For metadata, see **nft-metadata**.',

  'nft-approval':
    '**NFT approval** lets others transfer tokens on your behalf.\n\n- Grant permissions, check approvals, revoke access.\n- Enables marketplace functionality where contracts can transfer tokens.',

  'nft-enumeration':
    '**NFT enumeration** — List tokens owned by accounts.\n\n- Pagination and querying token lists.\n- Efficiently retrieve token IDs and metadata for UIs.',

  'nft-royalties':
    '**NFT royalties** — Royalty percentages per token (basis points; max 10000 = 100%).\n\n- Owner-only **`set_royalty`** and **`get_royalty`**.\n- Distribution logic is typically in the marketplace on sale. *Note:* JS implementation may need owner-check alignment with Rust.',

  'nft-marketplace':
    '**NFT marketplace** — Trade NFTs.\n\n- **`list`** creates listings; **`buy`** pays the seller and transfers the NFT.\n- Uses **`nft_transfer_from`** with a callback that checks **`promise_result`** before transferring payment. Patterns: escrow, payment flow, safe cross-contract handling.',

  callbacks:
    '**Callbacks** process results from cross-contract calls.\n\n- Use **`and_then`** to chain a call with a callback.\n- Callback reads **`promise_result(0)`** or **`promiseResultRaw(0)`** to handle success (parse return) or failure (return default).\n- Essential for any async cross-contract flow.',

  'cross-call-ft':
    '**Cross-contract FT:** Call **`ft_transfer`** on a **NEP-141** token contract.\n\n- Amount as **string** in smallest unit. Attach **1 yoctoNEAR**.\n- Basic pattern for integrating with NEAR standard FT contracts.',

  'cross-call-nft':
    '**Cross-contract NFT:** Call **`nft_transfer_call`** on a **NEP-171** NFT contract.\n\n- Pass `receiver_id`, `token_id`, `memo`, `msg`. Attach **1 yoctoNEAR**.\n- Basic pattern for integrating with existing NFT contracts.',

  'batch-calls':
    '**Chained calls** — Execute cross-contract calls in sequence with **`and_then`**.\n\n- Call `contract_a`, then `contract_b` after the first completes.\n- For parallel calls use **`Promise::and`**. Use chaining when the second call depends on the first.',

  'chain-signatures-basics':
    '**Chain signatures:** Call the MPC contract (**v1.signer**) to sign 32-byte payloads for other chains.\n\n- Uses **`ext_contract`** and **`Promise`**. Path derives the target chain address (e.g. `ethereum-1`).\n- Attach **~0.05 NEAR** for MPC fee. *JS uses JSON; verify MPC expects this format (Rust uses Borsh).*',

  'signature-verification':
    '**Validate payload format** before MPC: must be **32 bytes** (e.g. keccak256 hash).\n\n- **`hash_for_signing`** produces the hash; actual signature verification happens on the destination chain.',

  'signature-requests':
    '**Track signature requests:**\n\n- **`create_request`** — stores payload and path; **`get_request`** retrieves; **`sign_request`** calls MPC.\n- Request lifecycle before and during signing. *JS uses JSON; verify MPC expects this format.*',

  'multi-chain-signing':
    '**Different derivation paths** per chain (`ethereum-1`, `bitcoin-1`, `solana-1`).\n\n- **`set_chain_path`** maps `chain_id` to path; **`sign_for_chain`** uses the path when calling MPC.\n- *JS uses JSON; verify MPC expects this format.*',

  'cross-chain-auth':
    '**Whitelist** of authorized external identities.\n\n- **`authorize_cross_chain`** adds; **`revoke_cross_chain`** removes; **`require_authorized`** gates cross-chain actions.\n- Call **`require_authorized`** from your cross-chain methods before allowing MPC sign requests. *In production,* restrict authorize/revoke to **owner-only**.',

  'signature-callbacks':
    'Request MPC sign, then **callback** to store the result.\n\n- **`and_then`** chain: MPC sign → **`on_signature_ready`**.\n- Callback reads **`promise_result(0)`** for the signature bytes. *JS uses JSON; verify MPC expects this format.*',

  'indexer-data':
    '**NEP-297 events** — Emit via **`EVENT_JSON:`** prefix (standard, version, event, data).\n\n- This example has state (**`set_record`**, **`get_record`**) and emits **`record_updated`** on changes.\n- Indexers (NEAR Indexer, QueryAPI) parse logs off-chain; setup and SQL are in NEAR docs.',
};

// Default explanation for contracts without specific explanations
export const getContractExplanation = (exampleId) => {
  return (
    contractExplanations[exampleId] ||
    `This **${exampleId.replace(/-/g, ' ')}** contract demonstrates key NEAR smart contract concepts. Explore the code to understand how it implements ${exampleId.includes('nft') ? '**NFT**' : exampleId.includes('cross') ? '**cross-contract**' : '**smart contract**'} functionality on the NEAR blockchain.`
  );
};
