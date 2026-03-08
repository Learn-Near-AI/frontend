export const ownerPatternExplanation = [
  {
    title: 'The Castle Guard!',
    content: `NFT contracts use owner patterns to restrict minting and burning.

Every castle needs someone in charge. Someone who can open the gates, change the rules, or guard the treasure.

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
  {
    title: 'Learn More',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/best-practices)`,
  },
];

export default ownerPatternExplanation;
