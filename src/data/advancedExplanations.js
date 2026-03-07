// Gamified explanations for Advanced examples - unique themes for each!

export const ADVANCED_EXAMPLE_IDS = [
  'collections-map',
  'events',
  'owner-pattern',
  'role-based-access',
  'pausable-contract',
  'multi-signature',
  'upgrade-pattern',
];

export const isAdvancedExample = (exampleId) => ADVANCED_EXAMPLE_IDS.includes(exampleId);

export const advancedDetailedExplanations = {
  'collections-map': [
    {
      title: 'The Leaderboard!',
      content: `Imagine a scoreboard in an arcade. Every player has a score. You can look up ANY player's score instantly.

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
  ],
  events: [
    {
      title: 'The Town Crier!',
      content: `In old towns, the crier would shout important news for everyone to hear: "Hear ye! The king has announced..."

**Events** in NEAR are exactly that - your contract shouting news to the world!

When something important happens (a transfer, a purchase, a message), your contract can EMIT an event. Special tools called **indexers** listen for these and keep track.

Without events, apps would have to scan EVERY transaction ever made. With events? They just listen for the shouts!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `Imagine trying to build a marketplace WITHOUT events:

\`\`\`rust
// BAD: No events, force everyone to scan!
struct BadMarketplace {
    items: Vector<Item>,
}

impl BadMarketplace {
    // Every time someone wants to know "what was sold lately?"
    // They have to scan EVERY transaction, ever!
    fn get_recent_sales(&self) -> Vec<Sale> {
        // Would need access to blockchain history
        // Scan millions of transactions...
        // Hope you have time to wait!
    }
}
\`\`\`

**The problem:**
- 10 transactions? Okay, maybe tolerable.
- 1,000 transactions? Getting slow...
- 1,000,000 transactions? Game over!

This is what apps did before events - scan everything. Expensive, slow, painful!`,
    },
    {
      title: 'How To Shout (The Easy Way)',
      content: `Modern NEAR contracts use a special macro:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

// Define events using the macro - this creates the emit() method!
#[near(event_json(standard = "example", version = "1.0.0"))]
enum Event {
    MessageUpdated { new_message: String },
}

#[near]
impl Contract {
    pub fn set_message(&mut self, message: String) {
        // self.emit() comes from the macro - it handles all the JSON formatting!
        self.emit(Event::MessageUpdated { new_message: message.clone() });
        self.message = message;
    }
}
\`\`\`

**Where does emit() come from?**
The \`#[near(event_json(...))]\` macro automatically generates the \`emit()\` method for you! You just call \`self.emit(...)\` and it handles all the JSON formatting.

**Why this rocks:**
1. The code writes the format for you
2. Can't mess up the JSON
3. Follows standards automatically
4. Type-safe!`,
    },
    {
      title: 'What Happens Behind The Scenes',
      content: `Here's the journey of an event:

1. Your contract calls \`self.emit()\`
2. The macro converts it to special JSON
3. Written to the transaction receipt
4. Receipt gets processed
5. **Indexers** pick it up (they watch EVERY receipt!)
6. Indexers parse and store it
7. Your app queries the indexer instead of scanning

**The NEP-297 standard:**
\`\`\`json
{
  "standard": "example",
  "version": "1.0.0",
  "event": "MessageUpdated",
  "data": { "new_message": "Hello!" }
}
\`\`\`

Consistent format = everyone can understand!`,
    },
    {
      title: 'Events vs Polling - When To Use Which?',
      content: `Quick guide:

**Use EVENTS when:**
- You need real-time updates
- Many users need the same data (wallets, marketplaces)
- You want to notify external systems
- Speed matters

**Use POLLING (direct contract calls) when:**
- You only need occasional data
- Exact on-chain data is critical
- The data changes rarely
- Simplicity is more important than speed

**The insight:** Events = push (be told when things happen). Polling = pull (go check yourself). Events scale better for popular dApps!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why events work: Indexers!**

Events aren't stored directly on-chain in some special place. Instead:

1. Your contract emits an event via \`self.emit()\`
2. The macro transforms it into NEP-297 JSON format
3. The event gets written to the transaction receipt
4. **Indexers** - special services - watch EVERY receipt
5. When they see your event, they parse and store it
6. Your frontend queries the indexer (fast!) instead of scanning chain (slow!)

It's like:
- Without indexers: every app personally watches the blockchain 24/7
- With indexers: one service watches, everyone subscribes to it

This separation of concerns is what makes blockchain usable!

> ⚠️ **Important:** Events are notifications, NOT state. If you need authoritative data, query the contract state directly. Events do NOT replace on-chain data!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Events are powerful, but know the costs:

**EVENTS give you:**
- ⚡ Fast queries (from indexer, not chain)
- Real-time updates via subscriptions
- Scalability (one indexer serves many apps)

**EVENTS don't give you:**
- ❌ Direct on-chain access (go through indexer)
- ❌ Guaranteed delivery (indexer might miss)
- ❌ Historical data before event was added

**When events hurt you:**
- Need guaranteed accuracy? Query contract directly.
- Historical data from before you started emitting? Can't get it.
- Indexer downtime? You're blind until it recovers.

**The insight:** Events are the bridge between blockchain and real-time apps. But always have a fallback to direct contract calls when precision matters!

**When NOT to use Events:** If you're building something where every detail must be verified on-chain, or you only need occasional data - just poll the contract directly!`,
    },
  ],
  'owner-pattern': [
    {
      title: 'The Castle Guard!',
      content: `Every castle needs someone in charge. Someone who can open the gates, change the rules, or guard the treasure.

That's the **Owner Pattern** - the simplest form of access control.

In your contract, you designate ONE account as the owner. Only that account can do special things:
- Change critical settings
- Withdraw collected fees
- Pause or upgrade the contract

Everyone else? They can only use the regular features.`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `Imagine a castle with NO guard at all:

\`\`\`rust
// BAD: No access control at all!
struct BadContract {
    value: u64,
    // No owner_id! Anyone can do anything!
}

impl BadContract {
    pub fn withdraw(&mut self, amount: u64) {
        // Anyone can call this!
        // Anyone can drain all the funds!
        // No checks whatsoever!
    }
}
\`\`\`

**The problem:**
- One hacker finds a bug → game over!
- No accountability → anyone can wreck things
- No way to pause or fix when attacked

This is what happens when you skip access control entirely. Every vulnerable contract looks like this!`,
    },
    {
      title: 'How The Guard Works',
      content: `Here's how it works in the actual code:

\`\`\`rust
use near_sdk::near;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    value: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),  // The contract account
            value: 0,
        }
    }

    fn assert_owner(&self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can do this!"
        );
    }
}
\`\`\`

**Important distinction:**
- \`env::current_account_id()\` = The account WHERE this contract is deployed (NOT the deployer!)
- \`env::predecessor_account_id()\` = The account that CALLED this method

In most cases, you want the contract account as owner (using current_account_id), not the deployer's wallet. This is simpler for single-admin contracts.`,
    },
    {
      title: 'Guard Operations',
      content: `Here's how to protect your functions:

\`\`\`rust
fn assert_owner(&self) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only the owner can do this!"
    );
}

// Use it to protect sensitive operations:
pub fn withdraw(&mut self, amount: u128) {
    self.assert_owner();  // Guard check!
    // ... withdrawal logic ...
}

pub fn set_config(&mut self, new_value: String) {
    self.assert_owner();  // Guard check!
    self.config = new_value;
}
\`\`\`

**The pattern:** assert_owner() at the START of any sensitive function!`,
    },
    {
      title: 'When To Use Owner Pattern',
      content: `Quick guide:

**Use OWNER PATTERN when:**
- Simple dApps with one admin
- Personal tools
- Contracts where you alone should control upgrades
- You need basic protection, nothing complex

**Use SOMETHING ELSE when:**
- Multiple people need different access levels → RBAC
- Team treasury → Multi-signature
- Community governance → DAO

Start simple. Add complexity only when you need it!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why this works: The predecessor check!**

Every transaction on NEAR has a clear "caller":

\`\`\`
User A → Contract → "Who called me?" → User A!
\`\`\`

The \`env::predecessor_account_id()\` gives you exactly that - the account that signed the transaction. It's:
- Tamper-proof (blockchain verifies it)
- Reliable (always available)
- Cheap (just a function call)

The owner pattern simply asks: "Is the caller the owner?" If yes, proceed. If no, revert. Simple but effective!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Owner pattern is simple, but has limits:

**OWNER PATTERN gives you:**
- ✅ Simple to implement
- ✅ Easy to understand
- ✅ Single point of control

**OWNER PATTERN doesn't give you:**
- ❌ Multiple administrators
- ❌ Role-based flexibility
- ❌ Consensus (one person can make mistakes)

**When owner pattern hurts you:**
- Owner loses their key? You're stuck.
- Owner goes rogue? No checks.
- Team grows? Everyone needs owner-level access → risky!

**The insight:** Owner pattern is perfect for personal projects and simple contracts. But as soon as multiple trusted people need access, consider RBAC or multi-signature!

**When NOT to use Owner Pattern:** If you're building a DAO, team treasury, or any project where multiple people should have different access levels - use RBAC or multi-signature instead!`,
    },
  ],
  'role-based-access': [
    {
      title: 'Guild Roles!',
      content: `In an RPG, a guild has different roles:
- **Guild Master** - runs everything, can promote others
- **Admins** - manage members, run events
- **Members** - regular players

That's **Role-Based Access Control (RBAC)** - multiple levels of permission!

The owner pattern gives power to ONE person. RBAC spreads it around. Much more flexible!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if you only have the owner pattern, but need multiple admins?

\`\`\`rust
// BAD: Just owner, no roles!
struct BadContract {
    owner_id: AccountId,
    // Can't add moderators, helpers, etc.
    // Everyone must go through owner!
}

impl BadContract {
    pub fn add_moderator(&mut self, account: AccountId) {
        // Can't do this! No role system!
        // Owner has to do EVERYTHING
    }
}
\`\`\`

**The problem:**
- Owner becomes bottleneck for every decision
- No way to delegate specific tasks
- All-or-nothing: either you're owner or regular user
- Can't have "temporary" elevated access

This is what happens with just owner pattern when you need more flexibility!`,
    },
    {
      title: 'Building Your Guild',
      content: `Here's how RBAC looks in the actual code:

\`\`\`rust
use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    admins: UnorderedSet<AccountId>,  // Note: uses "admins" not "officers"
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            admins: UnorderedSet::new(b"a"),
            owner_id: env::current_account_id(),
        }
    }

    pub fn is_admin(&self, account: AccountId) -> bool {
        self.admins.contains(&account)
    }
}
\`\`\`

**Who can do what:**
- **Owner:** everything, including adding admins
- **Admins:** certain admin tasks
- **Everyone else:** only basic features`,
    },
    {
      title: 'Managing Roles',
      content: `Here's how to add admins:

\`\`\`rust
pub fn add_admin(&mut self, account: AccountId) {
    // Only owner or existing admins can add
    let caller = env::predecessor_account_id();
    require!(
        caller == self.owner_id || self.admins.contains(&caller),
        "Not authorized"
    );
    
    self.admins.insert(&account);
}
\`\`\`

And how to check for admin-only actions:

\`\`\`rust
pub fn admin_only_action(&mut self) {
    let caller = env::predecessor_account_id();
    require!(
        caller == self.owner_id || self.admins.contains(&caller),
        "Only admins can do this"
    );
    // ... do the action ...
}
\`\`\`

**The pattern:** checking roles BEFORE doing important things!`,
    },
    {
      title: 'Scaling To More Roles',
      content: `Want more roles? Easy!

\`\`\`rust
pub struct Contract {
    owners: UnorderedSet<AccountId>,      // Full power
    moderators: UnorderedSet<AccountId>,  // Can delete content
    verifiers: UnorderedSet<AccountId>,  // Can approve KYC
    minters: UnorderedSet<AccountId>,    // Can mint tokens
}
\`\`\`

Each role gets:
- Its own set to track members
- Helper functions like \`is_moderator()\`
- Specific permissions in different functions

**The insight:** roles are just named groups of accounts!`,
    },
    {
      title: 'RBAC vs Owner - When To Use Which?',
      content: `Quick guide:

**Use OWNER when:**
- Single admin is sufficient
- Simple project
- You don't need role delegation

**Use RBAC when:**
- Multiple people need different access levels
- You want to delegate tasks safely
- Some actions can be done by helpers, not just boss
- Need "temporary" elevated access

**The insight:** RBAC is owner pattern with superpowers. Same mechanism, but now you can have as many roles as you need!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why sets work for roles!**

Each role is stored as an \`UnorderedSet<AccountId>\`:

\`\`\`rust
admins: UnorderedSet<AccountId>,  // "a" prefix
moderators: UnorderedSet<AccountId>,  // "m" prefix
\`\`\`

Why sets?
- Fast lookup: \`admins.contains(&account)\` = O(1)
- Easy to add/remove: \`admins.insert()\`, \`admins.remove()\`
- Scale to thousands: still fast!

The pattern is simple: "Is account X in set Y?" → if yes, they have that role. That's it!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `RBAC is powerful, but know the costs:

**RBAC gives you:**
- ✅ Flexible permissions
- ✅ Delegation without sharing owner key
- ✅ Audit trail (know who did what)

**RBAC doesn't give you:**
- ❌ Consensus (still trust-based)
- ❌ Automatic decisions
- ❌ Simplicity (more code to maintain)

**When RBAC hurts you:**
- Too many roles? Gets complex.
- Role creep? Users accumulate permissions over time.
- Still centralized? Everyone trusts someone.

**The insight:** RBAC solves "one owner isn't enough" but doesn't solve "we need consensus." That's what multi-signature is for!

**When NOT to use RBAC:** If you need multiple people to agree on important decisions (like spending money), use multi-signature instead. RBAC is for permission management, not consensus!`,
    },
  ],
  'pausable-contract': [
    {
      title: 'The Emergency Button!',
      content: `Sometimes you need to hit PAUSE. Like:
- A bug is found, need to stop attacks
- Doing maintenance
- Emergency upgrade

The **Pausable Pattern** adds a big red button to your contract. When paused:
- Certain operations stop working
- Everyone sees "temporarily disabled"
- You (the owner) fix things
- Then unpause!

It's like an emergency stop in a factory. You hope never to use it, but you're glad it's there.`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if there's no pause button?

\`\`\`rust
// BAD: No emergency stop!
struct BadContract {
    funds: u128,
    // No pause flag!
}

impl BadContract {
    pub fn transfer(&mut self, to: AccountId, amount: u128) {
        // If there's a bug, attackers keep draining funds
        // No way to stop!
        // Just watch your money disappear...
    }
}
\`\`\`

**The problem:**
- Bug found? Too bad, keep getting exploited
- Hacker draining funds? Can't stop them
- Need maintenance? Can't do it safely

This is why pausable contracts exist! When things go wrong, you need a way to stop the bleeding.`,
    },
    {
      title: 'The Pause Button',
      content: `Add a simple flag to your state:

\`\`\`rust
pub struct Contract {
    owner_id: AccountId,
    paused: bool,  // The emergency flag!
}
\`\`\`

**States:**
- \`paused: false\` = normal operation
- \`paused: true\` = emergency mode

Initialize as NOT paused:
\`\`\`rust
#[init]
pub fn new() -> Self {
    Self {
        owner_id: env::current_account_id(),
        paused: false,
    }
}
\`\`\``,
    },
    {
      title: 'Guarding Your Operations',
      content: `Now guard sensitive operations:

\`\`\`rust
pub fn transfer(&mut self, to: AccountId, amount: u128) {
    require!(!self.paused, "Contract is paused for safety");
    // ... transfer logic ...
}
\`\`\`

And the pause/unpause functions (owner-only):

\`\`\`rust
pub fn pause(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    self.paused = true;
}

pub fn unpause(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    self.paused = false;
}
\`\`\`

**What should be guarded?**
- ✅ Transfers, withdrawals
- ✅ State changes
- ✅ Anything valuable

**What should NOT be guarded?**
- ❌ View methods (reading is always safe)
- ❌ Public information`,
    },
    {
      title: 'When To Use Pausable Pattern',
      content: `Quick guide:

**Use PAUSABLE when:**
- Contract holds valuable assets
- Complex logic that could have bugs
- You need time to respond to attacks
- Regulatory compliance needs "stop button"

**The insight:** Pausable contracts give you time to react when things go wrong. Without it, you're helpless against bugs or attacks!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why a simple flag works!**

The pause mechanism is elegantly simple:

\`\`\`rust
paused: bool  // true or false
\`\`\`

Every sensitive function checks this ONE flag:
\`\`\`rust
require!(!self.paused, "Paused!");
\`\`\`

When paused = true, the check fails and the function reverts. That's it!

**The magic:**
- Instant: no complex state changes
- Reversible: just set paused = false
- Cheap: single boolean check
- Clear: users know contract state

It's like a master switch. One toggle protects everything!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Pausable is powerful, but know the costs:

**PAUSABLE gives you:**
- ✅ Emergency response capability
- ✅ Time to fix bugs
- ✅ User protection during crises

**PAUSABLE doesn't give you:**
- ❌ Automatic bug fixing (just stops usage)
- ❌ Loss recovery (pausing doesn't restore funds)
- ❌ Decentralized control (owner has the button)

**When pausable hurts you:**
- Owner goes rogue? They can freeze indefinitely!
- Pause stuck on? Users can't use contract!
- False alarm? Pausing damages trust.

**The insight:** Pausable is a safety net, not a solution. You still need to fix the actual problem. And consider time-locks instead of instant pause for more trust!

**When NOT to use Pausable:** If your contract is purely informational (no funds, no state changes), or if you want true decentralization where no single person can freeze it - skip the pause button!`,
    },
  ],
  'multi-signature': [
    {
      title: 'The Two-Key Safe!',
      content: `Imagine a safe that needs TWO keys to open. You have one key, your business partner has the other. Neither of you can open it alone!

That's a **multi-signature** contract - multiple people must approve an action before it happens.

This is crucial for:
- Team treasuries (no one person steals the money)
- High-value operations
- DAO-style governance
- Any time you need trustless consensus`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if only ONE person controls the treasury?

\`\`\`rust
// BAD: Single point of failure!
struct BadTreasury {
    owner: AccountId,
    balance: u128,
}

impl BadTreasury {
    pub fn withdraw(&mut self, to: AccountId, amount: u128) {
        // ONE person can drain everything!
        // No checks, no consensus!
        // If owner goes rogue or gets hacked → game over!
    }
}
\`\`\`

**The problem:**
- One compromised key → all funds lost
- No accountability
- No trustlessness
- Single point of failure

This is why multi-signature exists - no single person should control valuable assets!`,
    },
    {
      title: "The Safe's Data",
      content: `Here's what the actual code looks like:

\`\`\`rust
use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required_signatures: u32,      // How many approvals needed (e.g., 2)
    approvals: UnorderedSet<String>, // Stored as "action:signer"
    last_executed_action: Option<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            signers: UnorderedSet::new(b"s"),
            required_signatures: 2,
            approvals: UnorderedSet::new(b"a"),
            last_executed_action: None,
        }
    }
}
\`\`\`

**Design:**
- 3 signers, require 2 = any 2 of 3 must approve
- Approvals stored as "action:signer" to prevent duplicates
- Keep history (last_executed_action) for transparency`,
    },
    {
      title: 'Multi-sig Operations',
      content: `**Adding Signers:**
Only signers (or the first deployer) can add new signers:

\`\`\`rust
pub fn add_signer(&mut self, account: AccountId) {
    let pred = env::predecessor_account_id();
    require!(
        (self.signers.is_empty() && pred == env::current_account_id()) 
        || self.signers.contains(&pred),
        "Only deployer (when empty) or signers can add"
    );
    self.signers.insert(&account);
}
\`\`\`

**Approving Actions:**
\`\`\`rust
pub fn approve(&mut self, action: String) {
    let signer = env::predecessor_account_id();
    require!(self.signers.contains(&signer), "Not a signer");
    let key = format!("{}:{}", action, signer);
    self.approvals.insert(&key);
}
\`\`\`

**Executing:**
\`\`\`rust
pub fn execute(&mut self, action: String) {
    require!(self.can_execute(&action), "Not enough approvals");
    
    // Clear approvals after execution
    for signer in self.signers.iter() {
        let key = format!("{}:{}", action, signer);
        self.approvals.remove(&key);
    }
    
    self.last_executed_action = Some(action.clone());
}
\`\`\``,
    },
    {
      title: 'Multi-sig vs Other Patterns',
      content: `Quick guide:

**Use MULTI-SIG when:**
- Team treasury
- High-value operations
- Need consensus, not just permissions
- No single person should control funds

**Use OWNER when:**
- Single admin is fine
- Simple project

**Use RBAC when:**
- Different people need different permissions
- But consensus isn't required

**The insight:** Multi-sig is about CONSENSUS. RBAC is about PERMISSIONS. They solve different problems!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why approval tracking works!**

The system uses two key sets:

\`\`\`rust
signers: UnorderedSet<AccountId>,    // Who can approve
approvals: UnorderedSet<String>,    // "action:signer" pairs
\`\`\`

**The flow:**
1. Action proposed (as a string like "transfer:100:alice.near")
2. Signers call approve() → adds "action:signer" to approvals
3. Execute checks: count approvals ≥ required_signatures?
4. If yes, execute and clear all approvals for that action

**Why this works:**
- Each signer can only approve once per action (set prevents duplicates)
- All approvals needed = consensus achieved
- Clearing after execution prevents replay

Simple but effective consensus mechanism!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Multi-sig is powerful, but know the costs:

**MULTI-SIG gives you:**
- ✅ Consensus (no single point of failure)
- ✅ Trustlessness (doesn't require trusting one person)
- ✅ Accountability (multiple people must agree)

**MULTI-SIG doesn't give you:**
- ❌ Speed (requires multiple approvals)
- ❌ Simplicity (more complex than owner pattern)
- ❌ Automatic decisions (still manual approvals)

**When multi-sig hurts you:**
- Emergency? Too slow to react!
- Small team? Overhead not worth it.
- All signers unresponsive? Stuck!

**The insight:** Multi-sig trades speed for safety. Perfect for treasuries, not for everyday operations!

**When NOT to use Multi-sig:** If you need fast, automated decisions, or single-user operations - use owner pattern or RBAC instead. Multi-sig is for high-value, low-frequency decisions!`,
    },
  ],
  'upgrade-pattern': [
    {
      title: 'The Evolution!',
      content: `In games, your character evolves. New abilities, better stats, cooler gear. Your contract can do something similar!

The **Upgrade Pattern** lets you update your contract while keeping its data. It's like:
- Patching a bug without losing progress
- Adding new features to an existing game
- Improving performance over time

> ⚠️ **CRITICAL WARNING:** NEVER delete fields when upgrading, or you'll lose data forever! This is the most important rule.`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if you can't upgrade at all?

\`\`\`rust
// BAD: Can't upgrade, can't fix bugs!
struct BadContract {
    data: Vec<u8>,
    // Once deployed, you're stuck with it!
    // Bug found? Too bad!
    // Need new feature? Deploy NEW contract, migrate manually!
}

impl BadContract {
    // No migrate function!
    // No version tracking!
    // Just hope nothing goes wrong...
}
\`\`\`

**The problem:**
- Bug in production? Deploy from scratch!
- Want new features? New contract, new address!
- Lose all users, history, trust!
- Expensive migration every time

This is why upgrade pattern exists! Contracts MUST be able to evolve!`,
    },
    {
      title: 'The Actual Code',
      content: `Here's what the actual code looks like - much simpler than you might expect!

\`\`\`rust
use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    version: u32,  // Just a version number!
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 {
        self.version
    }

    /// Migration hook: call after code upgrade. Owner-only.
    pub fn migrate(&mut self) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only owner can migrate"
        );
        self.version += 1;
        env::log_str(&format!("Upgraded to version {}", self.version));
    }
}
\`\`\`

That's it! No proxy pattern, no Promise::new().deploy_contract(). Just a version number that increments!`,
    },
    {
      title: 'Upgrade Operations',
      content: `**The upgrade flow:**

1. **Deploy contract** → Same account, new WASM
2. **State preserved** → All your data stays!
3. **Call migrate()** → Increment version, run transformations
4. **Done!** → Users don't even notice

**Adding new fields:**
\`\`\`rust
pub fn migrate(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner");
    
    // New field gets default value
    // self.new_field = "default".to_string();
    
    self.version += 1;
}
\`\`\`

**Transforming data:**
\`\`\`rust
pub fn migrate(&mut self) {
    // Example: rename field in storage
    // self.new_name = self.old_name;
    
    self.version += 1;
}
\`\`\``,
    },
    {
      title: 'When To Use Upgrade Pattern',
      content: `Quick guide:

**Use UPGRADE when:**
- Expect bugs (all software has them!)
- Want to add features over time
- Need to fix critical issues fast
- Plan long-term project

**The insight:** All successful contracts evolve. The upgrade pattern lets you fix bugs and add features without losing your users!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why this works: NEAR's state model!**

When you deploy new WASM to the same account:
- Code changes → NEW behavior
- State stays → ALL data preserved
- Address same → Users don't need to update!

\`\`\`
Old WASM + Old State → Deploy New WASM → New WASM + Same State
\`\`\`

**The magic:**
- \`version: u32\` tracks which version running
- \`migrate()\` runs AFTER new code deployed
- Can add/transform data in migrate()
- Owner controls when to upgrade

This is why version tracking matters - you know what state you're in!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Upgrade pattern is powerful, but know the costs:

**UPGRADE gives you:**
- ✅ Fix bugs without redeploying
- ✅ Add features over time
- ✅ Maintain user relationships
- ✅ Fast emergency patches

**UPGRADE doesn't give you:**
- ❌ True decentralization (owner controls upgrades)
- ❌ Immutable guarantees
- ❌ Predictable behavior forever

**When upgrade hurts you:**
- Owner goes rogue? Can change anything!
- Users lose trust? "Can change anytime"
- Complex migrations? Break data!

> ⚠️ **THE GOLDEN RULE:** NEVER delete fields! Always keep old data and transform it if needed.

**The insight:** Upgrade pattern is essential for production contracts. But for maximum trust, consider time-locks on upgrades or eventually making the contract immutable!

**When NOT to use Upgrade Pattern:** If you want true immutability (no one can ever change it), skip the upgrade pattern. Some projects want to be forever unchanged - that's when you remove the migrate function entirely!`,
    },
  ],
};

export const getAdvancedDetailedExplanation = (exampleId) =>
  advancedDetailedExplanations[exampleId] ?? null;
