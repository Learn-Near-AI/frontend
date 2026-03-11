export const upgradePatternExplanation = [
  {
    title: 'The Evolution!',
    content: `Popular dApps use upgrade patterns to add features while preserving user data.

In games, your character evolves. New abilities, better stats, cooler gear. Your contract can do something similar!

The **Upgrade Pattern** lets you update your contract while keeping its data. It's like:
- Patching a bug without losing progress
- Adding new features to an existing game
- Improving performance over time

> ⚠️ **CRITICAL WARNING:** NEVER delete fields when upgrading, or you'll lose data forever! This is the most important rule.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A game character that can evolve is essential for long-term play. You can fix bugs without starting over, add new abilities over time, maintain your progress because the same character keeps leveling up, and push emergency balance patches fast.

But here's the thing: you lose true predictability. The developer controls evolution, so players have to trust they won't change things in bad ways. You also lose immutable guarantees, and players can't rely on their builds being forever viable because the meta might change.

If the developer goes rogue, they can change anything about how characters evolve. And players might lose trust if they feel like the rules can change anytime. Complex skill tree migrations between expansions can also break builds if you're not careful.

One more thing: never delete abilities from the skill tree. Always keep old skills and transform them if needed. That's the golden rule.

For maximum trust, consider time locks on major evolutions or eventually making characters immutable.

**When NOT to use Upgrade Pattern:** If you want true immutability where no one can ever change it, skip the upgrade pattern. Some games want to be forever unchanged, and that's when you lock the character at max level!`,
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
\`\`\`

**⚠️ Critical: The panic you're about to see on mainnet**

You added \`new_field: String\` to your struct and redeployed. Now every call panics with:

\`\`\`
Thread 'main' panicked at 'Cannot deserialize the contract state.'
\`\`\`

Here's the fix — before/after:

\`\`\`rust
// BEFORE: No ignore_state → PANIC on every call!
pub fn migrate(&mut self) {
    self.version += 1;  // 💥 "Cannot deserialize the contract state."
}

// AFTER: Use ignore_state to bypass broken deserialization
#[init(ignore_state)]
pub fn migrate() -> Self {
    let old: OldContract = env::state_read().expect("No state");
    Self {
        owner_id: old.owner_id,                 // preserve old data
        version: old.version + 1,               // bump version
        new_field: "default".to_string(),        // initialize new field
    }
}
\`\`\`

This is the exact error and fix — bookmark this page if you're deploying to mainnet!`,
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
    /// Initial deployment - uses default #[init]
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

    /// Migration: call after code upgrade when struct stays the same
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
    title: 'Learn More',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/release/upgrade)`,
  },
];

export default upgradePatternExplanation;
