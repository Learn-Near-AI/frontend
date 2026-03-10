export const collectionsMapExplanation = [
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
    title: "The Naive Approach (Don't Do This!)",
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
    title: 'The Scoreboard Structure',
    content: `Here's a map in action:

\`\`\`rust
use near_sdk::near;
use near_sdk::AccountId;
use near_sdk::collections::UnorderedMap;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    balances: UnorderedMap<AccountId, u64>,
}
\`\`\`

**Translation:**
- \`UnorderedMap<AccountId, u64>\` = the leaderboard type
- Key: AccountId (like "player123.near")
- Value: u64 (their balance/score)
- \`UnorderedMap::new(b"b")\` = storage prefix "b" for "balances"

Think of it like: "For each account ID, store a number."`,
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

> ⚠️ **Gas trap warning:** Collecting all keys can be expensive for large maps! Works fine for small lists (~100), but for bigger ones consider pagination.`,
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

**Why this matters:** In Rust, u64 wrapping is disabled in debug mode (panics) but allowed in release. Use \`checked_add\`, \`checked_sub\`, \`saturating_add\`, or \`overflowing_add\` for safety!`,
  },
  {
    title: 'Pagination for Large Maps',
    content: `Listing all keys crashes on big maps. Use pagination!

**Paginated key listing:**
\`\`\`rust
pub fn get_balances(&self, limit: Option<u64>, start_index: Option<u64>) -> Vec<(AccountId, u64)> {
    let limit = limit.unwrap_or(50).min(100);  // Cap at 100
    let start = start_index.unwrap_or(0);
    
    let keys: Vec<AccountId> = self.balances.keys()
        .skip(start as usize)
        .take(limit as usize)
        .collect();
    
    keys.into_iter()
        .map(|key| {
            let value = self.balances.get(&key).unwrap_or(0);
            (key, value)
        })
        .collect()
}
\`\`\`

**The pattern:** Use \`skip\` + \`take\` to paginate. Frontend calls with increasing \`start_index\` to load more!`,
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

**Public read, owner write:**
- \`get_balance\`: \`&self\` (view method, anyone can call)
- \`set_balance\`: \`&mut self\` + owner check (callable by owner only)

**Common patterns:**
- Token contracts: owner mints, anyone transfers
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
    content: `Maps are awesome, but know the costs:

**MAP gives you:**
- ⚡ Instant lookups (same speed no matter size)
- Fast inserts
- ❌ No order guarantee
- ⚠️ More expensive to iterate everything

**VECTOR gives you:**
- Fast inserts
- ✅ Order preserved
- ✅ Easy to iterate everything
- 🐢 Slow lookups (scan through everything)

**When maps hurt you:**
- Need to process everything in order? Vectors win!
- Storage is super tight? Vectors use less.
- Very small datasets? Vectors simpler!

**The insight:** Maps shine when you have data to look up by key. Vectors shine when order matters or you're processing everything. Choose based on YOUR use case!

**When NOT to use a Map:** If you need things in a specific order or are only ever processing ALL items sequentially - just use a Vector!`,
  },
  {
    title: 'Learn More',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/collections#lookupmap)`,
  },
];

export default collectionsMapExplanation;
