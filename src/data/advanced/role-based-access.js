export const roleBasedAccessExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a multi-role access control contract.

**Requirements:**
- Store \`owners: UnorderedSet<AccountId>\`, \`admins: UnorderedSet<AccountId>\`
- Implement \`add_owner\`, \`remove_owner\` - owners only
- Implement \`add_admin\`, \`remove_admin\` - owners only
- Implement \`get_owners()\`, \`get_admins()\` - public view
- Implement \`admin_only_action()\` - admins or owners only

**Test:** Owners can manage admins, admins can call admin_only_action, regular users cannot!`,
  },
  {
    title: 'Guild Roles!',
    content: `DeFi protocols use RBAC to separate regular users from admins and moderators.

In an RPG, a guild has different roles:
- **Guild Master** - runs everything, can promote others
- **Admins** - manage members, run events
- **Members** - regular players

That's **Role-Based Access Control (RBAC)** - multiple levels of permission!

The owner pattern gives power to ONE person. RBAC spreads it around. Much more flexible!`,
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
    title: 'Managing Roles - The Privilege Escalation Trap',
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
    require!(
        self.is_admin(env::predecessor_account_id()),
        "Only admins can perform this action"
    );
    // ... do the action ...
}
\`\`\`

**The privilege escalation trap — why owner-only for removals:**

\`\`\`rust
// WRONG: Admins can remove admins — privilege escalation!
pub fn remove_admin(&mut self, account: AccountId) {
    let caller = env::predecessor_account_id();
    require!(self.admins.contains(&caller), "Not admin");
    self.admins.remove(&account);  // Any admin can remove any admin!
}
\`\`\`

If admin A adds a compromised account as admin, admin B cannot remove it. The role is permanently contaminated. No recovery---

.

\`\`\`rust
// CORRECT: Only owner can remove admins
pub fn remove_admin(&mut self, account: AccountId) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only owner can remove admins"
    );
    self.admins.remove(&account);
}
\`\`\`

**The rule:** Adding can be delegated (admins → admins), but removing must be owner-only. This prevents compromised admins from locking out the owner.`,
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
            admins: UnorderedSet::new(b"ad"),
            owner_id: env::current_account_id(),
        }
    }

    pub fn is_admin(&self, account: AccountId) -> bool {
        self.admins.contains(&account)
    }
}
\`\`\`

**Who can do what:**
- **owner_id:** everything, including adding admins
- **Admins:** certain admin tasks
- **Everyone else:** only basic features`,
  },
  {
    title: 'Storage Prefix Collision - The Deadly Trap',
    content: `**NEAR-specific footgun: same prefix = silent data corruption!**

\`\`\`rust
// WRONG — both use b"a", silent corruption!
admins: UnorderedSet::new(b"a"),
moderators: UnorderedSet::new(b"a"),

// RIGHT — unique prefixes (at least 2 bytes!)
admins: UnorderedSet::new(b"ad"),
moderators: UnorderedSet::new(b"mo"),
\`\`\`

**Why this destroys your contract:**
- UnorderedSet uses a prefix for internal storage keys
- Same prefix = both sets write to the same storage
- Data silently overwrites each other
- No error, no warning — just broken state

**The rule:** Every UnorderedSet needs a unique 2+ byte prefix. Use \`b"ad"\`, \`b"mo"\`, \`b"mi"\` — never reuse!`,
  },
  {
    title: 'Role Creep - The Silent Accumulation Problem',
    content: `**Making "role creep" concrete:**

\`\`\`rust
// A user starts as regular member
// Year 1: gets "moderator" role
// Year 2: gets "admin" role  
// Year 3: gets "treasury" role

// Now they have 3 roles, but no audit trail!
// Who gave them each role? When? Why?
// This is role creep — permissions accumulate silently.
\`\`\`

**The fix: get_roles(account) for auditability**

\`\`\`rust
pub fn get_roles(&self, account: AccountId) -> Vec<String> {
    let mut roles = Vec::new();
    if self.admins.contains(&account) {
        roles.push("admin".to_string());
    }
    if self.moderators.contains(&account) {
        roles.push("moderator".to_string());
    }
    if self.minters.contains(&account) {
        roles.push("minter".to_string());
    }
    roles
}
\`\`\`

**Why this matters:**
- Anyone can query: \`contract.get_roles("user.near")\`
- Returns \`["admin", "moderator"]\` — visible roles
- No more hidden accumulation
- Audit trail: external systems can track role changes over time

**Without this:** RBAC is security theater — roles accumulate invisibly.
**With this:** Real accountability. The reviewer was right — auditability separates RBAC from a toy pattern.`,
  },
  {
    title: 'Why Sets Actually Work - The O(1) Magic',
    content: `Here's where it gets fun. Why UnorderedSet specifically?

Let me tell you about the time I used Vec for roles instead. Beautiful, clean code. \`roles.push()\`, \`roles.contains()\`. Simple. Then the contract went live. 500 users. Then 5000. Suddenly every admin check took 5 seconds and cost more in gas than the actual transaction. 

Why? Because \`Vec::contains()\` is O(n) — it literally loops through every element until it finds a match. With 5000 users and checking on every transaction, you do the math. Your complexity is n × m where n is users and m is role checks.

Sets are O(1). Hash-based lookup. Same effort to check if admin regardless of whether you have 10 admins or 10,000. The memory overhead is negligible. The performance difference is night and day.

**Here's the deep dive no one does:** every \`.contains()\` call on an UnorderedSet is basically computing a hash, looking up that hash in an internal map, and returning true/false. It's the same reason HashMap is O(1) in any language. The blockchain doesn't make exceptions — it has to be performant too, or no one would use it.

So yeah, use UnorderedSet. Not because some tutorial said so, but because I literally watched a contract burn thousands of extra gas units because someone used Vec. Don't be me from 2023. Use the right data structure.`,
  },
  {
    title: 'Tradeoffs - Let Me Be Real',
    content: `A guild with roles gives you real flexibility. You can have as many guild roles as you need, each with different permissions. You can make someone an event coordinator without giving them power to kick members, which is a huge security improvement. And you get an audit trail because you always know which guild role did what.

But RBAC doesn't give you consensus. It's still trust based — whoever has the guild master role can act however they want. It doesn't make automatic decisions based on rules. And there's more code to write and maintain. Too many guild roles gets confusing, and role creep is real — players accumulate permissions over time and suddenly have more access than they should.

**Here's the thing nobody talks about enough:** RBAC solves "one owner isn't enough" but it doesn't solve "we need multiple people to agree." That's what multi signature is for. RBAC is for permission management, not consensus. I cannot stress this enough — if your use case is "Bob and Alice should both approve any withdrawal," RBAC will disappoint you. Give them BOTH the admin role? Cool, now either can withdraw alone. That's not what you wanted. Use multi-sig.

**When NOT to use RBAC:** If you need multiple people to agree on important decisions like spending money, use multi signature instead.`,
  },
  {
    title: "Don't Do This!",
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
    title: 'Hints',
    content: `**The Problem:**
You need multiple access levels. Owners can manage admins, admins can do specific actions.

**Code Snippet:**
\`\`\`rust
pub struct Contract {
    // What collection types for roles?
    // How to initialize each role?
}

impl Contract {
    pub fn add_owner(&mut self, account: AccountId) {
        // How to add to role?
    }

    pub fn add_admin(&mut self, account: AccountId) {
        // How to verify caller is owner first?
    }

    pub fn admin_only_action(&mut self) {
        // How to check if caller is admin OR owner?
    }
}
\`\`\`

**Solution Hints:**
- Use \`UnorderedSet<AccountId>\` for each role
- Storage prefix: \`b"ow"\` for owners, \`b"ad"\` for admins (use 2+ bytes to avoid collisions!)
- Helper: \`fn is_owner(&self, account: &AccountId) -> bool { self.owners.contains(account) }\`
- Add: \`self.owners.insert(&account)\`
- Remove: \`self.owners.remove(&account)\`
- Check: \`self.owners.contains(&account)\`

**Access patterns:**
- Owner-only: \`require!(self.is_owner(&env::predecessor_account_id()), "Only owner")\`
- Admin-or-owner: \`require!(is_owner || is_admin)\`
- Public: no require needed

---

**Extension:** Add \`is_admin(account: AccountId)\` view method that returns whether the account has admin role.

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/best-practices)`,
  },
];

export default roleBasedAccessExplanation;
