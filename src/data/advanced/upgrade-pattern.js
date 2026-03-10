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

**⚠️ Critical: When struct shape changes (#[init(ignore_state)])**

If you ADD or REMOVE fields from your struct, the default init will panic! The old state can't be deserialized into the new shape.

Use \`#[init(ignore_state)]\` to skip deserialization:

\`\`\`rust
#[near]
impl Contract {
    /// For upgrades when struct shape changes!
    #[init(ignore_state)]
    pub fn migrate() -> Self {
        Self {
            owner_id: env::current_account_id(),
            version: 2,
            new_field: "default".to_string(),  // Set defaults for NEW fields
        }
    }
}
\`\`\`

**When you NEED ignore_state:**
- Adding new fields (struct has more fields now)
- Removing fields (struct has fewer fields)
- Changing field types (incompatible)
- Reordering fields

**Warning:** With \`ignore_state\`, you lose access to old state during migration! Read it BEFORE returning the new Self, or use the \`&mut self\` migrate pattern for same-shape upgrades instead.`,
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
  {
    title: 'Learn More',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/release/upgrade)`,
  },
];

export default upgradePatternExplanation;
