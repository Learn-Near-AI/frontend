export const collectionsMapExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a leaderboard using IterableMap.

**Requirements:**
- Store \`leaderboard: IterableMap<AccountId, u64>\` with StorageKey
- Implement \`set_score(account: AccountId, score: u64)\` - public, updates score
- Implement \`get_score(account: AccountId)\` - public view
- Implement \`get_top_scores(limit: u64)\` - returns top N scores sorted descending
- Implement \`get_rank(account: AccountId)\` - returns position in leaderboard

**Test:** Setting a higher score moves user up in top scores!`,
  },
  {
    title: 'The Leaderboard!',
    content: `Token contracts store balances in maps for instant lookups.

Imagine a scoreboard in an arcade. Every player has a score. You can look up ANY player's score instantly.

That's exactly what a **Map** does!

Unlike vectors (where you find things by position: 0, 1, 2...), maps let you find things by KEY. Like:
- Player name → their score
- Player name → their level
- Item ID → who owns it

**Super fast:** Finding a value by key takes the same time no matter how big the list is!`,
  },
  {
    title: 'Which Collections API?',
    content: `NEAR has two generations of collections:

**near_sdk::collections** — older API, still works, uses \`b"prefix"\` byte literals
**near_sdk::store** — newer API, lazy caching, uses BorshStorageKey enums, supports true pagination

This lesson uses near_sdk::store because:
- Official docs recommend it for pagination
- Safer (Drop flush behavior catches more bugs)
- What new NEAR contracts should use going forward

If you see \`collections::UnorderedMap\` in older examples, the concepts are the same but initialization differs.

Honestly, the old \`collections\` API isn't going anywhere — it's stable and tons of live contracts use it. But for LEARNING? Start with \`store\`. It's what the docs push, it makes pagination actually work efficiently, and you'll thank yourself later when your leaderboard doesn't burn all your gas on iteration.`,
  },
  {
    title: 'The Scoreboard Structure',
    content: `Here's a map in action:

\`\`\`rust
use near_sdk::near;
use near_sdk::AccountId;
use near_sdk::store::IterableMap;
use near_sdk::PanicOnDefault;
use near_sdk::BorshStorageKey;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Balances,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    balances: IterableMap<AccountId, u64>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            balances: IterableMap::new(StorageKey::Balances),
        }
    }
}
\`\`\`

**Translation:**
- \`IterableMap<AccountId, u64>\` = the leaderboard type (supports true O(k) pagination!)
- Key: AccountId (like "player123.near")
- Value: u64 (their balance/score)
- \`IterableMap::new(StorageKey::Balances)\` = storage prefix from enum

Think of it like: "For each account ID, store a number."`,
  },
  {
    title: 'Watch Out: Prefix Collisions!',
    content: `NEAR stores all contract state in a flat key-value store. Each collection's storage prefix becomes part of every key it writes. Two collections sharing a prefix = silent data corruption. No compiler error. No panic. Just wrong values appearing in your contract and no idea why.

This is the most insidious bug in NEAR development. It literally compiles, deploys, runs — and your balances map starts returning completely wrong numbers. Debugging this is a nightmare.

**BAD — collision ahead:**
\`\`\`rust
struct Contract {
    balances: UnorderedMap<AccountId, u64>,  // prefix b"b"
    bids: UnorderedMap<AccountId, u64>,      // also b"b" ← BOOM!
}
\`\`\`

**GOOD — unique prefixes:**
\`\`\`rust
#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Balances,
    Bids,
}

struct Contract {
    balances: IterableMap<AccountId, u64>,  // StorageKey::Balances
    bids: IterableMap<AccountId, u64>,      // StorageKey::Bids
}
\`\`\`

Why StorageKey enum? The derive macro guarantees each variant serializes to a unique byte sequence. Just... always use it. Don't try to be clever with \`b"b"\`, \`b"c"\`, \`b"d"\`. You'll forget one day and then boom.`,
  },
  {
    title: 'Leaderboard Operations',
    content: `Here's what you can do:

**Set or update a score:**
\`\`\`rust
self.balances.insert(&account_id, &amount);
\`\`\`

**Check a player's score:**
\`\`\`rust
let score = self.balances.get(&account_id);  // Option<u64>
\`\`\`

**Remove a player:**
\`\`\`rust
self.balances.remove(&account_id);
\`\`\`

**Check if they exist:**
\`\`\`rust
self.balances.contains_key(&account_id)
\`\`\`

**Get ALL players:**
\`\`\`rust
self.balances.keys().collect::<Vec<_>>()
\`\`\`

⚠️ Gas trap warning: Collecting all keys with \`keys().collect()\` is expensive for large maps. Fine for ~100 items. After that? Pagination. Your frontend will thank you.`,
  },
  {
    title: 'Overflow Protection',
    content: `Balances need safe math — u64 can overflow!

**Adding to a balance:**
\`\`\`rust
pub fn add_balance(&mut self, account: AccountId, amount: u64) {
    let current = self.balances.get(&account).unwrap_or(0);
    let new_balance = current.checked_add(amount)
        .expect("Overflow: balance too large");
    self.balances.insert(&account, &new_balance);
}
\`\`\`

**Subtracting from a balance:**
\`\`\`rust
pub fn subtract_balance(&mut self, account: AccountId, amount: u64) {
    let current = self.balances.get(&account).unwrap_or(0);
    let new_balance = current.checked_sub(amount)
        .expect("Underflow: insufficient balance");
    self.balances.insert(&account, &new_balance);
}
\`\`\`

In Rust, unchecked integer overflow has undefined behavior. Always use \`checked_add\`, \`checked_sub\`, \`saturating_add\`, or \`overflowing_add\`.

Here's the fun part: in debug mode, overflow panics (nice, catches bugs early). In release mode? It wraps around silently. Your balance of 100 + 10 might become 14. For a financial contract, that's not a bug — it's a security vulnerability. Someone just stole 96 tokens from you without even trying hard.

So: always check. Always.`,
  },
  {
    title: 'Pagination for Large Maps',
    content: `Listing all keys crashes on big maps. Use pagination — but do it RIGHT.

Wrong way (O(n) — defeats the purpose):
\`\`\`rust
// BAD: Collects ALL keys first, then slices
let keys: Vec<AccountId> = self.balances.keys().collect();
keys[start..start+limit]
\`\`\`

Right way (O(k) — true pagination):
\`\`\`rust
pub fn get_balances(&self, limit: Option<u64>, start_index: Option<u64>) -> Vec<(AccountId, u64)> {
    let limit = limit.unwrap_or(50).min(100);
    let start = start_index.unwrap_or(0) as usize;
    
    self.balances
        .iter()
        .skip(start)
        .take(limit)
        .collect()
}
\`\`\`

The key insight: \`IterableMap\` from \`near_sdk::store\` has lazy iterators that cache reads. Call \`skip()\` and \`take()\` on the iterator (NOT on a collected Vec). It lazily skips — stops reading after reaching your offset. This is O(k) where k = limit, not O(n) where n = total keys.

Frontend calls with increasing \`start_index\` to load pages.`,
  },
  {
    title: 'Access Control on Maps',
    content: `Who can modify balances? Add guards!

**Owner-only operations:**
\`\`\`rust
use near_sdk::require;

pub fn set_balance(&mut self, account: AccountId, amount: u64) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only owner can set balances"
    );
    self.balances.insert(&account, &amount);
}
\`\`\`

**Public read, owner/minter write:**
- \`get_balance\`: \`&self\` (view method, anyone can call)
- \`set_balance\`: \`&mut self\` + owner check (minting tokens)
- \`transfer\`: \`&mut self\` + caller verification (anyone can transfer their own tokens)

**Token contract pattern:**
\`\`\`rust
pub fn ft_transfer(&mut self, receiver_id: AccountId, amount: u128) {
    let caller = env::predecessor_account_id();
    let caller_balance = self.balances.get(&caller).unwrap_or(0);
    
    require!(caller_balance >= amount, "Insufficient balance");
    
    self.balances.insert(&caller, &(caller_balance - amount));
    let receiver_balance = self.balances.get(&receiver_id).unwrap_or(0);
    self.balances.insert(&receiver_id, &(receiver_balance + amount));
}
\`\`\`

**Common patterns:**
- Token contracts: owner mints, anyone transfers their own tokens
- Scoreboards: owner sets scores
- Voting: anyone votes, owner tallies`,
  },
  {
    title: 'Map vs Vector - When To Use Which?',
    content: `Quick guide:

**Use VECTOR when:**
- Order matters (chat messages, to-do lists)
- You need to go through everything
- It's a simple list

**Use MAP when:**
- You look things up by name/ID
- Order doesn't matter
- It's a "for each X, there's a Y" situation

Choose wisely!`,
  },
  {
    title: 'The Design Insight',
    content: `**Why maps are so fast: Hashing!**

When you insert "player123" with score 500, the map doesn't just store it linearly. It runs "player123" through a special function:

\`\`\`
"player123" → [HASH FUNCTION] → 0x7a2f...
\`\`\`

That hash becomes the STORAGE LOCATION. It's like:
- Regular list: books scattered on a desk, must search each one
- Map: magic bookshelf where "Harry Potter" jumps to shelf 7 automatically!

**The magic:**
- Same name → always same spot (deterministic)
- Different names → different spots (usually!)
- Finding something = calculate spot → go there = instant!`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A leaderboard gives you instant lookups. It doesn't matter how many players are in your arcade, finding a score by player name takes the same time. Adding new high scores is fast too. But here's the catch: there's no guaranteed leaderboard order, and reading through every single score to rank everyone is more expensive than just scanning a simple list.

A simple high score list is the opposite. It preserves the order scores were submitted, which matters for some use cases, and it's easy to iterate when you need to see everything. But looking up a specific player's score is slow, because you have to scan through the whole list to find it.

So when do you use which? If you're constantly looking up individual player stats by name, the leaderboard wins. If you need things in submission order or you're showing all recent scores, the simple list wins. For very small datasets with just a few scores, the simple list is easier. And if storage is super tight, the list uses less space.

Choose based on your actual use case, not on what seems cooler.

**When NOT to use a Map:** If you need things in a specific order or are only ever processing ALL items sequentially, just use a Vector!`,
  },
  {
    title: "Don't Do This!",
    content: `Imagine a newbie trying to build a leaderboard WITHOUT maps:

\`\`\`rust
// BAD: Using a vector for lookups!
struct BadLeaderboard {
    players: Vec<Player>,  // Just a list!
}

struct Player {
    name: String,
    score: u64,
}

impl BadLeaderboard {
    fn find_score(&self, name: &str) -> Option<u64> {
        // Every single time, scan the ENTIRE list!
        for player in &self.players {
            if player.name == name {
                return Some(player.score);
            }
        }
        None
    }
}
\`\`\`

**The problem:**
- 10 players? Okay, maybe tolerable.
- 100 players? Getting slow...
- 1,000 players? Painful.
- 1,000,000 players? Game over!

This is O(n) - time grows with size. Maps are O(1) - instant regardless of size!`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
You need a leaderboard with fast lookups by account. Use IterableMap with StorageKey.

**Code Snippet:**
\`\`\`rust
// How to define storage keys?

#[near(contract_state)]
pub struct Contract {
    // What collection type for leaderboard?
}

impl Contract {
    pub fn set_score(&mut self, account: AccountId, score: u64) {
        // How to insert or update a score?
    }

    pub fn get_top_scores(&self, limit: u64) -> Vec<(AccountId, u64)> {
        // How to get all scores? How to sort? How to limit?
    }

    pub fn get_rank(&self, account: AccountId) -> u64 {
        // How to calculate rank (position in sorted list)?
    }
}
\`\`\`

**Solution Hints:**
- StorageKey: \`#[derive(BorshStorageKey, BorshSerialize)] enum StorageKey { Leaderboard }\`
- Collection: \`IterableMap<AccountId, u64>\` initialized with \`StorageKey::Leaderboard\`
- Insert/update: \`self.leaderboard.insert(&account, score)\`
- Get: \`self.leaderboard.get(&account).copied()\`
- Top scores: collect to Vec, sort descending, take(limit)
- Rank: count entries where score > target score, add 1

**Sorting:**
\`\`\`rust
let mut scores: Vec<_> = self.leaderboard.iter().collect();
scores.sort_by(|a, b| b.1.cmp(a.1)); // descending by score
scores.iter().take(limit).map(|(k, v)| (k.clone(), *v)).collect()
\`\`\`

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/collections#lookupmap)`,
  },
];

export default collectionsMapExplanation;
