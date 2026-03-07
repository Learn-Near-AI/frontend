export const roleBasedAccessExplanation = [
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
    owner,
    admins:_id: AccountId UnorderedSet<AccountId>,  // Note: uses "admins" not "officers"
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
];

export default roleBasedAccessExplanation;
