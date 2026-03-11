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
    title: 'Transfer Ownership',
    content: `**Every production owner pattern needs this:**

Without it, if the owner key is compromised or the team changes, the contract is permanently locked to the wrong owner.

\`\`\`rust
pub fn transfer_ownership(&mut self, new_owner: AccountId) {
    self.assert_owner();
    self.owner_id = new_owner;
}
\`\`\`

**Usage:**
\`\`\`bash
near call <contract-id> transfer_ownership '{"new_owner": "new_owner.near"}' --accountId <current-owner>
\`\`\`

This 6-line function moves the module from tutorial to production-usable.`,
  },
  {
    title: 'The current_account_id Trap',
    content: `**The mistake developers make:**

\`\`\`rust
// WRONG: Using predecessor in new()
#[init]
pub fn new() -> Self {
    Self {
        // This makes the DEPLOYER the owner, not the contract!
        owner_id: env::predecessor_account_id(),
        value: 0,
    }
}
\`\`\`

**What happens:** Whoever deploys the contract becomes owner. Later, if you call the contract with a different account, the owner check fails because predecessor != stored owner.

---

\`\`\`rust
// CORRECT: Using current_account_id in new()
#[init]
pub fn new() -> Self {
    Self {
        // The contract account itself is the owner
        owner_id: env::current_account_id(),
        value: 0,
    }
}
\`\`\`

**Why this matters:**
- \`current_account_id()\` = the account WHERE this contract lives
- \`predecessor_account_id()\` = whoever called the function (the deployer at initialization)

Use \`current_account_id()\` in \`new()\` so the contract owns itself. Then anyone can call owner-protected methods using the contract account as --accountId.`,
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
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A castle with one guard is simple to manage but has real tradeoffs. The owner pattern is dead simple to implement and easy to understand. One guard has full control, which makes decisions fast and clear. But here's the thing: you only get one guard. If that person loses their key, the castle is frozen forever with no way in. If they go rogue, there's nothing stopping them from opening the gates to anyone. And when your team grows, you can't just give everyone guard level access — that's a security nightmare.

So use this for personal projects and simple contracts where you truly are the only one who should make calls. But the moment you need multiple trusted people involved, or different access levels for different roles, you need something more sophisticated. That's where role based access or multi signature comes in.

**When NOT to use Owner Pattern:** If you're building a DAO, team treasury, or any project where multiple people should have different access levels — use RBAC or multi signature instead!`,
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
    title: 'Learn More',
    content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/best-practices)`,
  },
];

export default ownerPatternExplanation;
