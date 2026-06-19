export const userProfilesExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a user profile system using UnorderedMap.

**Requirements:**
- Define \`Profile\` struct with \`name, bio, created_at\`
- Store \`profiles: UnorderedMap<AccountId, Profile>\`
- Implement \`set_profile(name: String, bio: String)\` — creates/updates caller's profile
- Implement \`get_profile(account: AccountId)\` — returns profile or None
- Automatically record \`created_at\` using \`block_timestamp()\`

**Test:** Anyone can read any profile, but only the user can set their own!`,
  },
  {
    title: 'The Digital ID Card!',
    content: `Social apps store billions of user profiles — all keyed by user ID.

Think of this as a digital ID card. On the blockchain, your ID card is tied to your account — permanently, verifiably, and controlled by you.

That's what **UnorderedMap<AccountId, Profile>** is for!

Unlike the todo list (which used both map and vector), profiles only need a map. Why? Because we always look up profiles by account ID — we never need to list ALL profiles in order. The account ID IS the key, making lookups instant.

This is actually the most common pattern in blockchain development: key-value storage where the key is an AccountId. Token balances, game scores, reputation — they all use this.`,
  },
  {
    title: 'The Profile Structure',
    content: `Here's how we store user data:

\`\`\`rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Profile {
    name: String,
    bio: String,
    created_at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    profiles: UnorderedMap<AccountId, Profile>,
}
\`\`\`

**Simple!** Just a single map from account IDs to profiles.

- \`AccountId\` is the key — each user gets exactly one profile slot
- \`Profile\` is the value — name, bio, and timestamp in one struct
- \`created_at: u64\` stores the block timestamp when the profile was created

**Why block_timestamp?** It's a \`u64\` in nanoseconds since epoch. Unlike \`env::block_index()\` (which just counts blocks), this gives you actual time. Useful for showing "Member since..." on profiles.`,
  },
  {
    title: 'Setting Profiles (Self-Service)',
    content: `Users control their own data:

\`\`\`rust
pub fn set_profile(&mut self, name: String, bio: String) {
    let account = env::predecessor_account_id();
    let profile = Profile {
        name,
        bio,
        created_at: env::block_timestamp(),
    };
    self.profiles.insert(&account, &profile);
}
\`\`\`

**Key points:**
- **Predecessor is always the writer** — use \`env::predecessor_account_id()\` to get the caller
- **Auto-timestamping** — \`created_at\` is set once, not user-provided
- **Upsert behavior** — calling \`set_profile\` again updates the same profile

**Design choice:** Why not let users choose their own \`created_at\`? Because timestamps should be TRUSTED. If users could provide timestamps, they could claim they joined earlier than they did. Always use \`block_timestamp()\` for authority.

Notice there's no \`require!\` here — why? Because each user can only write to their OWN profile slot. The key IS the authentication. No one can write to your slot because they'd need to know your account ID AND be signed in as you, which is impossible. The account model handles security automatically.`,
  },
  {
    title: 'Reading Profiles (Public)',
    content: `Any profile is readable by anyone — that's the point of a public registry:

\`\`\`rust
pub fn get_profile(&self, account: AccountId) -> Option<(String, String, u64)> {
    self.profiles.get(&account)
        .map(|p| (p.name.clone(), p.bio.clone(), p.created_at))
}
\`\`\`

**What's happening here?**
- \`self.profiles.get(&account)\` returns \`Option<Profile>\`
- \`.map(...)\` transforms it to \`Option<(String, String, u64)>\` if present
- If the profile doesn't exist, returns \`None\`

**Why return a tuple instead of the struct?** Clarity for callers. The tuple format is explicit about what fields are returned. The caller knows the exact order without reading your internal struct definition.

Also note \`p.name.clone()\` — because \`get\` returns a reference to the stored value, we need to clone to return owned data. This costs a tiny bit of gas but is necessary for the type system.`,
  },
  {
    title: 'The Design Insight',
    content: `**Why is this simpler than the todo list? Because the account IS the key.**

In the todo list, we needed a map (lookup by ID) AND a vector (list all IDs). Here, we only need the map. Why?

- **Todo list:** "Show me all todos" → need iteration over IDs → need a vector
- **Profiles:** "Show me Alice's profile" → look up by key → only need a map

This is the fundamental design question for any contract: **how will users access the data?**

- Key-based access (know the ID) → Map
- Ordered listing (show me everything) → Map + Vector
- Sequential access (first, second, third...) → Vector alone

**Pro tip:** If you ever find yourself iterating over a map to find something, you chose the wrong data structure. Maps are for instant lookups. If you need to search, you need an index (a separate collection that maps search terms to keys).`,
  },
  {
    title: 'Profile Extensions',
    content: `Here are common profile features you'd add next:

**Avatar URL:**
\`\`\`rust
pub struct Profile {
    name: String,
    bio: String,
    avatar_url: Option<String>,  // Optional!
    created_at: u64,
}
\`\`\`

**Follower count:**
\`\`\`rust
pub fn follow(&mut self, account: AccountId) {
    // Add to a Set of followers...
}

pub fn followers_count(&self, account: AccountId) -> u64 {
    self.followers.get(&account).map(|s| s.len()).unwrap_or(0)
}
\`\`\`

**Last active timestamp:**
\`\`\`rust
pub fn set_profile(&mut self, name: String, bio: String) {
    // Existing code...
    self.last_active.insert(&account, &env::block_timestamp());
}
\`\`\`

Each extension uses the same AccountId-as-key pattern. This is why maps are the backbone of blockchain storage — they scale to any number of fields per user.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A profile map gives you instant access to any user's data. Looking up a profile by account is always fast, no matter how many users exist. That's the huge advantage.

But there's no guaranteed member listing. You can't easily show "all members" or "latest signups" because maps don't maintain order. And every profile update costs gas — setting your bio 50 times costs 50 transaction fees.

It's also all public. Your name and bio are visible to anyone who knows your account ID. On a permissionless blockchain, "private profile" doesn't really exist.

**When to use a profile map:** When you have user-specific data that others need to read by account ID. Think social profiles, game stats, reputation scores. If you don't need order, don't add a vector — stay simple.`,
  },
  {
    title: "Don't Do This!",
    content: `Letting users write to ANY profile:

\`\`\`rust
// BAD: Anyone can set anyone's profile!
pub fn set_profile(&mut self, account: AccountId, name: String, bio: String) {
    let profile = Profile {
        name,
        bio,
        created_at: env::block_timestamp(),
    };
    self.profiles.insert(&account, &profile);
    // No check that account == caller!
}
\`\`\`

**The problem:** Mallory calls \`set_profile("alice.near", "hacked", "evil")\` and overwrites Alice's profile. Alice's identity is stolen.

**Always use \`predecessor_account_id()\` for self-write ops.** If you need admin-controlled writes, add an owner pattern with \`require!\`.

**Another common mistake:** Using a Vector instead of a Map for profiles:
\`\`\`rust
// BAD: Scanning a vector to find a user
fn get_profile(&self, account: AccountId) -> Option<&Profile> {
    self.profiles.iter().find(|p| p.owner == account)
    // O(n) — gets slower with every new user!
}
\`\`\`
With 10 users it's fine. With 10,000 users it's unbearably slow. With maps it's O(1) always.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a profile system using UnorderedMap where users control their own data.

**Code Snippet:**
\`\`\`rust
pub fn set_profile(&mut self, name: String, bio: String) {
    // TODO: Get predecessor account
    // TODO: Create Profile with name, bio, block_timestamp
    // TODO: Insert into profiles
}

pub fn get_profile(&self, account: AccountId) -> Option<(String, String, u64)> {
    // TODO: Look up profile, return tuple or None
}
\`\`\`

**Solution Hints:**
- Predecessor: \`env::predecessor_account_id()\`
- Profile: \`Profile { name, bio, created_at: env::block_timestamp() }\`
- Insert: \`self.profiles.insert(&account, &profile)\`
- Get: \`self.profiles.get(&account).map(|p| (p.name.clone(), p.bio.clone(), p.created_at))\`

**Extension:** Add a \`delete_profile()\` method that only the profile owner can call.

[Learn more about collections →](https://docs.near.org/smart-contracts/anatomy/collections)`,
  },
];

export default userProfilesExplanation;
