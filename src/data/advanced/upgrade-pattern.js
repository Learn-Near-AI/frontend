export const upgradePatternExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a pausable upgradeable contract.

**Requirements:**
- Store \`owner_id: AccountId\`, \`paused: bool\`, \`data_version: u32\`
- Implement \`pause()\`, \`unpause()\` - owner only
- Implement \`upgrade(code: Vec<u8>)\` - owner only, only when paused
- Implement \`migrate()\` - for state migration between versions
- When paused: all change methods should panic

**Test:** Can pause, upgrade, then unpause while preserving state!`,
  },
  {
    title: 'The Evolution!',
    content: `Popular dApps use upgrade patterns to add features while preserving user data.

In games, your character evolves. New abilities, better stats, cooler gear. Your contract can do something similar!

The **Upgrade Pattern** lets you update your contract while keeping its data. It's like:
- Patching a bug without losing progress
- Adding new features to an existing game
- Improving performance over time`,
  },
  {
    title: 'How Deploying Actually Works',
    content: `Let me pull back the curtain a bit. When you "deploy" a contract on NEAR, two things happen:

1. The **WASM bytecode** gets uploaded — this is your new code
2. The **state** (all those stored values) stays exactly where it is

Think of it like swapping the engine in a car while keeping the passengers. The car (state) is intact, you're just replacing what's under the hood (code).

\`\`\`
┌─────────────────┐     deploy new WASM      ┌─────────────────┐
│  Old Contract   │  ───────────────────►  │  New Contract   │
│  Code: v1      │                         │  Code: v2       │
│  State: {data}  │    (state preserved!) │  State: {data}  │
└─────────────────┘                         └─────────────────┘
\`\`\`

This is actually kind of magical when you think about it. Most blockchains make you choose: either upgrade OR keep data. NEAR gives you both. But this magic comes with a catch — the code expects the state to look a certain way.`,
  },
  {
    title: 'Why The Panic Happens',
    content: `Here's where it gets fun. You deployed your shiny new contract with an extra field. Everything should work, right?

Wrong. Now every single call panics with:

\`\`\`
Cannot deserialize the contract state
\`\`\`

**Why?** Because when your contract starts, NEAR tries to read the old state and fit it into your new struct. But the shapes don't match! It's like trying to put a square peg in a round hole.

The deserializer is going field by field, position by position. Old state has 2 fields, new struct has 3. Something's gotta give — and that something is your contract crashing.

This is the "broken deserialization" problem. The old state literally cannot be parsed into the new shape.`,
  },
  {
    title: 'The ignore_state Magic Explained',
    content: `So how do we fix this? Here's the thing most tutorials skip over.

When you add \`#[init(ignore_state)]\`, you're basically telling NEAR: "Don't try to deserialize the state. I'll handle it myself."

Normally, NEAR does this:
\`\`\`
1. Read bytes from storage
2. Try to deserialize into your struct
3. If it works → run your code
4. If it fails → PANIC
\`\`\`

With \`ignore_state\`, you get:
\`\`\`
1. Read bytes from storage
2. Give me (the contract) the raw bytes
3. I'll deserialize manually
4. I'll return a fully-initialized struct
\`\`\`

This is why you need that \`OldContract\` struct. You're basically saying "here's what the old data looks like, let me manually map it."

The key insight: you define \`OldContract\` yourself to match what was in storage. It's just a data struct with \`BorshDeserialize\` — not a contract.`,
  },
  {
    title: 'Upgrade Operations',
    content: `**The upgrade flow:**

1. Deploy contract → Same account, new WASM
2. State preserved → All your data stays!
3. Call migrate() → Increment version, run transformations
4. Done! → Users don't even notice

Two ways to migrate:

**Option A: Same-shape upgrade (&mut self)**
Fields haven't changed — just bumping version or transforming data. Normal deserialization works fine:

\`\`\`rust
pub fn migrate(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id);
    self.version += 1;
}
\`\`\`

**Option B: Struct shape changed (#[init(ignore_state)])**
Added or renamed fields? Then:

\`\`\`rust
#[init(ignore_state)]
pub fn migrate() -> Self {
    let old = env::state_read::<OldContract>().expect("No state");
    Self {
        owner_id: old.owner_id,
        username: old.user_name,
        version: old.version + 1,
    }
}
\`\`\`

The critical part: you're reading the OLD bytes into an OLD-shaped struct, then building a NEW struct from that data.`,
  },
  {
    title: 'The Actual Code',
    content: `Here's the complete code showing both migration scenarios:

\`\`\`rust
use near_sdk::near;
use near_sdk::{env, require};
use near_sdk::PanicOnDefault;
use near_sdk::borsh::{BorshDeserialize, BorshSerialize};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: near_sdk::AccountId,
    username: String,
    settings: String,
    version: u32,
}

// Old: had user_name instead of username
#[derive(BorshDeserialize, BorshSerialize)]
struct OldContract {
    owner_id: near_sdk::AccountId,
    user_name: String,
    version: u32,
}

// Even older: didn't have settings
#[derive(BorshDeserialize, BorshSerialize)]
struct OldContractWithSettings {
    owner_id: near_sdk::AccountId,
    username: String,
    version: u32,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            username: "".to_string(),
            settings: "".to_string(),
            version: 1,
        }
    }

    pub fn get_version(&self) -> u32 { self.version }

    pub fn migrate(&mut self) {
        require!(env::predecessor_account_id() == self.owner_id);
        self.version += 1;
    }
}

#[near]
impl Contract {
    #[init(ignore_state)]
    pub fn migrate_rename() -> Self {
        let old = env::state_read::<OldContract>().expect("No state");
        Self {
            owner_id: old.owner_id,
            username: old.user_name,
            settings: "".to_string(),
            version: old.version + 1,
        }
    }

    #[init(ignore_state)]
    pub fn migrate_add_field() -> Self {
        let old = env::state_read::<OldContractWithSettings>().expect("No state");
        Self {
            owner_id: old.owner_id,
            username: old.username,
            settings: "default".to_string(),
            version: old.version + 1,
        }
    }
}
\`\`\`

Two distinct scenarios:
- \`migrate_rename()\`: field was renamed (user_name → username)
- \`migrate_add_field()\`: new field added (settings)`,
  },
  {
    title: 'Why Deleting Fields Is A Disaster',
    content: `Here's the thing about that "never delete fields" rule — it sounds like arbitrary caution, but there's a real mechanical reason.

Borsh deserializes by POSITION, not by name. Every field gets a specific byte range:

\`\`\`rust
struct User {
    id: u64,       // bytes 0-7
    name: String,  // bytes 8-15 (length) + 16+ (actual string)
    age: u32,      // bytes 16-19
}
\`\`\`

Delete that middle \`name\` field and re-deploy:

\`\`\`rust
struct User {
    id: u64,   // bytes 0-7
    age: u32,  // Now reads bytes 8-11 which used to be String length!
}
\`\`\`

Your \`age\` just got set to whatever number was the length of the old name string. 6 billion people just became age 8. No errors. No warnings. Just garbage data silently polluting your contract.

This is why:
- Never DELETE fields — add new ones instead
- Use Option<T> if you really want to "remove" — it serializes to zero bytes
- Renaming is fine — just map old → new in migration

The rule isn't about being paranoid — it's about understanding the machine.`,
  },
  {
    title: 'Tradeoffs',
    content: `Being able to evolve a contract is genuinely powerful. You fix bugs without users losing their data, add features over time, push emergency patches when things go wrong. This is huge for production systems.

But here's the uncomfortable truth: you're essentially asking users to trust you. You control the evolution. You could change anything.

I've seen projects where the developers "evolved" the tokenomics in ways the community didn't love. Suddenly your tokens are worth less because the contract owner can mint more. The code said they could — it was in the upgradeable contract all along.

For maximum trust:
- Consider time locks on major upgrades
- Eventually make contracts immutable
- Document what can and can't change

When NOT to upgrade: If you want true immutability where NO ONE can ever change anything, skip this pattern entirely. Some things should stay forever.`,
  },
  {
    title: "Don't Do This!",
    content: `Imagine deploying without any upgrade capability:

\`\`\`rust
struct BadContract {
    data: Vec<u8>,
}

impl BadContract {
    // No migrate function!
    // No version tracking!
}
\`\`\`

Found a bug in production? Too bad — deploy from scratch. Want to add a feature? New contract, new address, migrate all users manually, hope nothing breaks.

This is the old world. It worked for Bitcoin (nothing changes ever) but for applications that need to evolve? It's a death sentence.

Upgrade pattern exists because production software needs to evolve. Smart contracts are software. They need to evolve too.`,
  },
  {
    title: 'Hints',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/release/upgrade)`,
  },
];

export default upgradePatternExplanation;
