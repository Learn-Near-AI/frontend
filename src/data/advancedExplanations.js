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
      title: 'The Scoreboard Structure',
      content: `Here's a map in action:

\`\`\`rust
balances: UnorderedMap::new(b"b")
\`\`\`

**Translation:**
- \`UnorderedMap\` = the leaderboard type
- \`b"b"\` = the storage label (short for "balances")
- Key type: AccountId (like "player123.near")
- Value type: u64 (their balance/score)

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

Instant lookups, no matter how many players!`,
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

| Game Thing | Use |
|-----------|-----|
| High scores | Map |
| Chat history | Vector |
| Player inventory | Map |
| Quest log | Vector |
| Item owners | Map |

Choose wisely!`,
    },
  ],
  events: [
    {
      title: 'The Town Crier!',
      content: `In old towns, the crier would shout important news for everyone to hear: "Hear ye! The king has announced..."

**Events** in NEAR are exactly that - your contract shouting news to the world!

When something important happens (a transfer, a purchase, a achievement), your contract can EMIT an event. Special tools called **indexers** listen for these and keep track.

Without events, apps would have to scan EVERY transaction ever made. With events? They just listen for the shouts!`,
    },
    {
      title: 'How To Shout (The Easy Way)',
      content: `Modern NEAR contracts use a special macro:

\`\`\`rust
#[near(event_json(standard = "mygame", version = "1.0.0"))]
enum Event {
    LevelUp { player: AccountId, new_level: u32 },
}

impl Contract {
    pub fn gain_xp(&mut self, player: AccountId, xp: u32) {
        // ... game logic ...
        self.emit(Event::LevelUp { player: player.clone(), new_level: self.levels.get(&player).unwrap_or(1) });
    }
}
\`\`\`

**Why this rocks:**
1. The code writes the format for you
2. Can't mess up the JSON
3. Follows standards automatically
4. Type-safe!`,
    },
    {
      title: 'What Happens Behind The Scenes',
      content: `Here's the journey of an event:

1. Your contract calls \`emit()\`
2. NEAR converts it to special JSON
3. Written to the transaction receipt
4. Receipt gets processed
5. **Indexers** pick it up (they watch EVERY receipt!)
6. Indexers parse and store it
7. Your app queries the indexer instead of scanning

**The NEP-297 standard:**
\`\`\`json
{
  "standard": "mygame",
  "version": "1.0.0",
  "event": "level_up",
  "data": { "player": "alice.near", "new_level": 5 }
}
\`\`\`

Consistent format = everyone can understand!`,
    },
    {
      title: 'Why Events Matter',
      content: `Events make blockchain usable:

**Without events:**
- Wallet checks balance → scans millions of transactions → slow!
- Marketplace sees sale → scans everything → expensive!

**With events:**
- Wallet listens for "transfer" events → instant!
- Marketplace listens for "sale" events → fast!

Events turn "read everything" into "hear the news." That's the difference between a usable app and one that nobody wants to use!`,
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
      title: 'How The Guard Works',
      content: `The owner is set when the contract is born:

\`\`\`rust
#[init]
pub fn new() -> Self {
    Self {
        owner_id: env::current_account_id(),  // The deployer!
    }
}
\`\`\`

Then you check before doing owner-only things:

\`\`\`rust
fn assert_owner(&self) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only the owner can do this!"
    );
}
\`\`\`

**NEAR magic:**
- \`env::current_account_id()\` = "who deployed me"
- \`env::predecessor_account_id()\` = "who just called me"
- Match them = proven owner!`,
    },
    {
      title: 'Try It Yourself',
      content: `Your mission: finish the owner check!

\`\`\`rust
fn assert_owner(&self) {
    // TODO: require! that predecessor == owner_id
    // Hint: env::predecessor_account_id() and self.owner_id
}
\`\`\`

**The answer:**
\`\`\`rust
fn assert_owner(&self) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only owner can call this"
    );
}
\`\`\`

Once you add this, try calling the function from a different account. You should get a clear error!`,
    },
    {
      title: 'When To Use Owner Pattern',
      content: `Perfect for:
- Simple dApps with one admin
- Personal tools
- Contracts where you alone should control upgrades

**Not great for:**
- DAOs (too centralized)
- Multi-user protocols (need more flexibility)
- Games where players should have some control

Start simple. Add complexity only when you need it!`,
    },
  ],
  'role-based-access': [
    {
      title: 'Guild Roles!',
      content: `In an RPG, a guild has different roles:
- **Guild Master** - runs everything, can promote others
- **Officers** - manage members, run events
- **Veterans** - trusted players, can help newcomers
- **Members** - regular players

That's **Role-Based Access Control (RBAC)** - multiple levels of permission!

The owner pattern gives power to ONE person. RBAC spreads it around. Much more flexible!`,
    },
    {
      title: 'Building Your Guild',
      content: `Here's a guild with two roles:

\`\`\`rust
pub struct Contract {
    owner_id: AccountId,
    officers: UnorderedSet<AccountId>,
}
\`\`\`

**Who can do what:**
- **Owner:** everything, including promoting to officer
- **Officers:** certain admin tasks
- **Everyone else:** only basic features

The key is checking roles BEFORE doing important things:

\`\`\`rust
require!(
    caller == self.owner_id || self.officers.contains(&caller),
    "Only owner or officers can do this"
);
\`\`\``,
    },
    {
      title: 'Managing Roles',
      content: `You can add and remove roles dynamically:

\`\`\`rust
pub fn add_officer(&mut self, account: AccountId) {
    // Only owner or existing officers can add
    let caller = env::predecessor_account_id();
    require!(
        caller == self.owner_id || self.officers.contains(&caller),
        "Not authorized"
    );
    
    self.officers.insert(&account);
}

pub fn remove_officer(&mut self, account: AccountId) {
    // Only owner can remove (for safety!)
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    self.officers.remove(&account);
}
\`\`\`

**The pattern:** make adding flexible, removing restrictive!`,
    },
    {
      title: 'Scaling To More Roles',
      content: `Want more roles? Easy!

\`\`\`rust
pub struct Contract {
    owners: UnorderedSet<AccountId>,      // Full power
    moderators: UnorderedSet<AccountId>,  // Can delete content
    verifiers: UnorderedSet<AccountId>,  // Can approve KYC
    minter: UnorderedSet<AccountId>,     // Can mint tokens
}
\`\`\`

Each role gets:
- Its own set to track members
- Helper functions like \`is_moderator()\`
- Specific permissions in different functions

**The insight:** roles are just named groups of accounts!`,
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
      title: 'Only Owner Can Press The Button',
      content: `The pause/unpause functions are owner-only:

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

**Critical:** only the owner should have this power. Anyone else hitting the emergency button would be bad!`,
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

**What should be guarded?**
- ✅ Transfers, withdrawals
- ✅ State changes
- ✅ Anything valuable

**What should NOT be guarded?**
- ❌ View methods (reading is always safe)
- ❌ Public information

The pause button protects your users when things go wrong!`,
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
      title: "The Safe's Data",
      content: `Here's what a multi-sig needs:

\`\`\`rust
pub struct Contract {
    signers: UnorderedSet<AccountId>,
    required: u32,
    approvals: UnorderedSet<String>,
    last_action: Option<String>,
}
\`\`\`

**Design:**
- 3 signers, require 2 = any 2 of 3 must approve
- Approvals stored as "action:signer" to prevent duplicates
- Keep history for transparency`,
    },
    {
      title: 'Adding Signers',
      content: `Only signers (or the first deployer) can add new signers:

\`\`\`rust
pub fn add_signer(&mut self, account: AccountId) {
    let caller = env::predecessor_account_id();
    require!(
        (self.signers.is_empty() && caller == env::current_account_id())
        || self.signers.contains(&caller),
        "Not authorized to add signers"
    );
    self.signers.insert(&account);
}
\`\`\`

**The rule:**
- First signer = deployer (can start the system)
- After that, existing signers vote in new ones
- No single person can take over!`,
    },
    {
      title: 'The Approval System',
      content: `Signers approve actions by adding their approval:

\`\`\`rust
pub fn approve(&mut self, action: String) {
    require!(self.signers.contains(&env::predecessor_account_id()), "Not a signer");
    let key = format!("{}:{}", action, env::predecessor_account_id());
    self.approvals.insert(&key);
}
\`\`\`

**To execute:**
\`\`\`rust
pub fn execute(&mut self, action: String) {
    require!(self.has_enough_approvals(&action), "Need more approvals");
    // Do the thing!
    self.approvals.clear_for_action(&action);
}
\`\`\`

This way, no single signer can sneak something through!`,
    },
  ],
  'upgrade-pattern': [
    {
      title: 'The Evolution!',
      content: `In games, your character evolves. New abilities, better stats, cooler gear. Your contract can do something similar!

The **Upgrade Pattern** lets you update your contract's code while keeping its data. It's like:
- Patching a bug without losing progress
- Adding new features to an existing game
- Improving performance over time

**The catch:** with great power comes great responsibility. Users must trust you not to abuse it!`,
    },
    {
      title: 'The Proxy Pattern',
      content: `The classic upgrade pattern uses TWO contracts:

1. **Proxy** - holds all the data, delegates calls
2. **Implementation** - has the actual code

\`\`\`rust
// Proxy (never changes!)
pub struct Proxy {
    owner_id: AccountId,
    implementation: AccountId,  // Points to current code
}

// Implementation (can swap this!)
pub struct GameV1 {
    score: u64,
    players: Vector<String>,
}
\`\`\`

When users call the proxy, it forwards to the implementation. Swap the implementation = instant upgrade!`,
    },
    {
      title: 'NEAR Upgrades',
      content: `NEAR makes upgrades easier:

\`\`\`rust
#[private]
pub fn upgrade(&mut self, code: Vec<u8>) {
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    
    Promise::new(env::current_account_id())
        .deploy_contract(code)
        .then(Self::ext(env::current_account_id()).on_upgraded())
        .as_self();
}

pub fn on_upgraded(&mut self) {
    // Migration logic if needed
}
\`\`\`

**Flow:**
1. Owner calls upgrade() with new WASM code
2. Contract deploys new code to itself
3. Next call uses new code!
4. Old data stays intact (unless you migrate)`,
    },
    {
      title: 'Data Migration',
      content: `When upgrading, you might need to handle data changes:

\`\`\`rust
#[private]
pub fn migrate(&mut self, from_version: u32) {
    match from_version {
        1 => {
            // Add new field, give it a default
            self.new_field = "default".to_string();
        }
        _ => {},
    }
}
\`\`\`

**Golden rules:**
- ALWAYS version your contract
- Keep old fields when adding new ones
- Test migrations on testnet first
- Consider a timelock (users can see what's coming)

**Never delete fields** or you'll lose data forever!`,
    },
  ],
};

export const getAdvancedDetailedExplanation = (exampleId) =>
  advancedDetailedExplanations[exampleId] ?? null;
