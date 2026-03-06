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

| Use Case | Best Choice |
|----------|-------------|
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

When something important happens (a transfer, a purchase, a message), your contract can EMIT an event. Special tools called **indexers** listen for these and keep track.

Without events, apps would have to scan EVERY transaction ever made. With events? They just listen for the shouts!`,
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
- **Admins** - manage members, run events
- **Members** - regular players

That's **Role-Based Access Control (RBAC)** - multiple levels of permission!

The owner pattern gives power to ONE person. RBAC spreads it around. Much more flexible!`,
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
      title: 'Adding Signers',
      content: `Only signers (or the first deployer) can add new signers:

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

**The rule:**
- First signer = deployer (can start the system)
- After that, existing signers vote in new ones
- No single person can take over!`,
    },
    {
      title: 'The Approval System',
      content: `Signers approve actions:

\`\`\`rust
pub fn approve(&mut self, action: String) {
    let signer = env::predecessor_account_id();
    require!(self.signers.contains(&signer), "Not a signer");
    let key = format!("{}:{}", action, signer);
    self.approvals.insert(&key);
}
\`\`\`

**Check if enough approvals:**
\`\`\`rust
pub fn can_execute(&self, action: &String) -> bool {
    let count = self.signers.iter()
        .filter(|s| self.approvals.contains(&format!("{}:{}", action, s)))
        .count();
    count >= self.required_signatures as usize
}
\`\`\`

This manually loops through signers to count approvals - no magic method!`,
    },
    {
      title: 'Executing The Action',
      content: `Execute only when enough people approved:

\`\`\`rust
pub fn execute(&mut self, action: String) {
    require!(self.can_execute(&action), "Not enough approvals for this action");
    
    // Remove all approvals for this action (loop through signers manually!)
    for signer in self.signers.iter() {
        let key = format!("{}:{}", action, signer);
        self.approvals.remove(&key);
    }
    
    self.last_executed_action = Some(action.clone());
    env::log_str(&format!("Executed: {}", action));
}
\`\`\`

**Important Note:** Notice there's NO magic method like clear_for_action()! The code manually loops through each signer and removes their approval. This is exactly what the actual code does - no shortcuts!

This way, no single signer can sneak something through!`,
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
      title: 'How It Works',
      content: `The pattern is simple:

1. **Version tracking:** You have a \`version: u32\` field
2. **Migration function:** The \`migrate()\` function increments the version
3. **Deploy new code:** When you deploy new contract code to the same account, the existing state is preserved
4. **Call migrate:** After upgrading, call \`migrate()\` to increment version (and do any data transformations if needed!)

**The flow:**
- Deploy contract (version = 1)
- Use contract for a while
- Want new features? Deploy new WASM to same account
- Call migrate() → version becomes 2
- Done! Data preserved!`,
    },
    {
      title: 'When To Use More Complex Patterns',
      content: `The simple version pattern works great for:
- Adding new features
- Bug fixes
- Minor changes

**When you need more:**
- If you ADD a new field that needs a default value, do it in migrate()
- If you CHANGE how data is stored, transform in migrate()
- If you need ZERO downtime upgrades (proxy pattern), that's a whole other level

> ⚠️ **THE GOLDEN RULE:** NEVER delete fields! Always keep old data and transform it if needed.

**Example of data migration:**
\`\`\`rust
pub fn migrate(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Only owner");
    
    // Example: if you added a new field
    // self.new_field = "default_value".to_string();
    
    self.version += 1;
}
\`\`\``,
    },
  ],
};

export const getAdvancedDetailedExplanation = (exampleId) =>
  advancedDetailedExplanations[exampleId] ?? null;
