export const methodsDetailedExplanation = {
  'view-methods': [
    {
      title: 'Become The Scout',
      content: `Wallets use view methods to display balances instantly without transactions.

In every good game, you need a **scout** - someone who looks around and reports what they see. That's what view methods are!

A view method only LOOKS at stuff. It never changes anything. It's like:
- Checking your inventory
- Reading a sign
- Looking at a map

Free to use. No cost. Just looking.

**What you'll build:**
A contract with default + user-specific greetings — THREE view methods showing different ways to read data!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if you could only have ONE greeting for everyone?

\`\`\`rust
// BAD: One size fits all!
struct Contract {
    greeting: String,  // Same for everyone!
}

impl Contract {
    // Every user sees the SAME greeting
    // No personalization possible!
}
\`\`\`

**The problem:**
- Can't personalize for users
- Everyone sees identical content
- Not realistic for real apps
- Like a billboard, not an app!

Real apps need user-specific data!`,
    },
    {
      title: 'The Contract With User Data',
      content: `Here's a contract with user-specific storage:

\`\`\`rust
use near_sdk::near;
use near_sdk::{env, AccountId, PanicOnDefault};
use near_sdk::collections::LookupMap;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    default_greeting: String,
    user_greetings: LookupMap<AccountId, String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            default_greeting: "Hello, NEAR explorer!".to_string(),
            user_greetings: LookupMap::new(b"g"),
        }
    }
}
\`\`\`

**What's happening:**
- \`default_greeting\` = Same for everyone
- \`user_greetings: LookupMap\` = Per-user storage (like a personalized dictionary!)
- \`LookupMap::new(b"g")\` = Storage prefix "g"

This is like having a shared sign AND personal notes!`,
    },
    {
      title: 'The Scout Code - View Methods',
      content: `Now the view methods that read the data:

\`\`\`rust
// Get caller's greeting (or default)
pub fn get_my_greeting(&self) -> String {
    let caller = env::predecessor_account_id();
    self.user_greetings
        .get(&caller)
        .unwrap_or_else(|| self.default_greeting.clone())
}

// Get length of default greeting
pub fn get_default_greeting_length(&self) -> u64 {
    self.default_greeting.len() as u64
}

// Check if user has custom greeting
pub fn has_custom_greeting(&self, account: AccountId) -> bool {
    self.user_greetings.contains_key(&account)
}
\`\`\`

**Breaking it down:**
- \`env::predecessor_account_id()\` = Who called (the user!)
- \`.get(&key)\` = Lookup in map
- \`unwrap_or_else(|| default)\` = Use default if not found
- \`.len()\` = String length (computed!)

These are ALL free to call — no gas needed!`,
    },
    {
      title: 'View vs Change - Big Difference',
      content: `This is super important:

**VIEW methods:**
- Use \`&self\` (one ampersand)
- Only read data
- Free to call (no gas fees!)
- Can call from browser directly

**CHANGE methods:**
- Use \`&mut self\` (one ampersand + mut)
- Modify data
- Cost gas (tiny fee!)
- Requires wallet signature

**Why this matters:**
- View = checking a map (free!)
- Change = picking up an item (costs something!)

NEAR separates these because reading doesn't burden the network, but writing does!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why LookupMap for user data!**

\`\`\`rust
user_greetings: LookupMap<AccountId, String>
\`\`\`

LookupMap = Key-Value store:
- Fast: O(1) lookups by key
- Efficient: Only loads what you need
- Scalable: Works for millions of users

**Why not Vector?**
- Vector = ordered list (find by position)
- LookupMap = dictionary (find by key)

**The pattern:**
\`\`\`
User calls → Get their key → Lookup in map → Return value
\`\`\`

This is how real apps work — personalized data per user!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `View methods have tradeoffs:

**VIEW gives you:**
- ✅ Free to call
- ✅ Fast responses
- ✅ Anyone can verify state
- ✅ Personalization via LookupMap

**VIEW doesn't give you:**
- ❌ Can't modify anything
- ❌ Stale data (might be slightly outdated)
- ❌ Can't trigger complex logic

**When view methods hurt you:**
- Need real-time updates? Use events!
- Complex calculations? Make them change methods
- Need to write? That's what change methods are for!

**The insight:** View methods for reading, change methods for writing. Pair them together!

**When NOT to use view methods:** If you need to modify state or perform complex logic - use change methods!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/build/smart-contracts/protocol/architecture)`,
    },
  ],
  'change-methods': [
    {
      title: 'Time To Build!',
      content: `Token transfers are change methods that modify user balances.

Scouts are great, but sometimes you need to actually DO stuff. That's where **change methods** come in.

Change methods are like:
- Picking up items in a game
- Building structures
- Casting spells that alter the world

They cost a tiny bit of NEAR (like gas in a car) because you're actually changing something on the blockchain.

**What you'll build:**
A contract with OWNER-PROTECTED change methods — only the owner can modify the message!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if ANYONE could change your message?

\`\`\`rust
// BAD: No protection at all!
struct Contract {
    message: String,
}

impl Contract {
    // ANYONE can change it!
    pub fn set_message(&mut self, new_message: String) {
        self.message = new_message;  // No checks!
    }
}
\`\`\`

**The problem:**
- Anyone can vandalize your contract
- No accountability
- No security at all!
- Like leaving your front door wide open!

Every real contract needs access control!`,
    },
    {
      title: 'The Contract With Protection',
      content: `Here's a contract with owner protection:

\`\`\`rust
use near_sdk::{env, require, AccountId};

pub struct Contract {
    owner_id: AccountId,
    message: String,
}

impl Contract {
    #[init]
    pub fn new(initial_message: Option<String>) -> Self {
        let owner = env::predecessor_account_id();
        let message = initial_message.unwrap_or_else(|| "Welcome, traveler!".to_string());

        Self { owner_id: owner, message }
    }

    // View methods (free!)
    pub fn get_message(&self) -> String {
        self.message.clone()
    }

    // Change method (protected!)
    pub fn set_message(&mut self, new_message: String) {
        require!(
            env::predecessor_account_id() == self.owner_id,
            "Only the owner can change the message"
        );
        require!(!new_message.is_empty(), "Message cannot be empty");
        self.message = new_message;
    }
}
\`\`\`

**Key additions:**
- \`owner_id\` stored in state
- \`require!\" for access control
- \`require!\" for validation`,
    },
    {
      title: 'The Protected Code',
      content: `Three change methods, all protected:

\`\`\`rust
// Replace entire message — owner only
pub fn set_message(&mut self, new_message: String) {
    require!(
        env::predecessor_account_id() == self.owner_id,
        "Only the owner can change the message"
    );
    require!(!new_message.is_empty(), "Message cannot be empty");
    self.message = new_message;
}

// Append to message — owner only
pub fn append_to_message(&mut self, addition: String) {
    require!(env::predecessor_account_id() == self.owner_id, "...");
    require!(!addition.is_empty(), "...");
    self.message.push_str(&addition);
}

// Reset to default — owner only
pub fn reset_message(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "...");
    self.message = "Welcome, traveler!".to_string();
}
\`\`\`

**The pattern:**
1. \`env::predecessor_account_id()\` — Who called?
2. Compare to \`self.owner_id\` — Are they the boss?
3. If yes → proceed; if no → revert!

**require!** is your bouncer!`,
    },
    {
      title: 'What Happens When You Call It',
      content: `Here's the journey of a protected change method:

1. **Your wallet signs** the transaction
2. **NEAR finds** the contract
3. **Contract checks** — "Are you the owner?"
4. **If YES:** Update the message, save state
5. **If NO:** Revert immediately, message unchanged
6. **Receipt arrives** — proof of result

**The magic of require!:**
- Stops bad actors cold
- Clear error message for users
- Nothing gets saved if check fails!

This is how real contracts stay secure!`,
    },
    {
      title: 'Gas - The Fuel Of Blockchain',
      content: `Every change costs **gas** - a small fee for the validators.

**What affects gas:**
- How much data you read/write
- How complex your code is
- How busy the network is

**The good news:**
- NEAR fees are super low (fractions of a cent!)
- View methods are FREE
- require! checks are cheap

**The insight:**
- View = checking a map (free!)
- Change = updating the map (small fee!)

You're now a builder! Build securely!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why require! works: The bouncer pattern!**

\`\`\`rust
require!(condition, "error message")
\`\`\`

**How it works:**
- Condition TRUE → continue normally
- Condition FALSE → PANIC with message!

**The flow:**
\`\`\`
Caller → Check owner → Pass? → Update → Save
                  → Fail? → Revert! → Error message
\`\`\`

**Why this matters:**
- Stops unauthorized changes
- Clear feedback to users
- Atomic: either ALL changes or NONE

This is the foundation of secure contracts!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Change methods with protection have tradeoffs:

**PROTECTED CHANGE gives you:**
- ✅ Security (only owner can modify)
- ✅ Accountability (know who called)
- ✅ Validation (prevent bad data)

**PROTECTED CHANGE doesn't give you:**
- ❌ Free (costs gas)
- ❌ Multi-user editing
- ❌ Decentralized control

**When protection hurts you:**
- Owner loses key? Stuck forever!
- Need team input? Doesn't help!
- Want open editing? Too restrictive!

**The insight:** Use protection when needed. For open apps, use other patterns!

**When NOT to use:** For DAOs or community apps - you'll need more flexible access control!`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/build/smart-contracts/protocol/architecture)`,
    },
  ],
};

export const getMethodsDetailedExplanation = (exampleId) =>
  methodsDetailedExplanation[exampleId] ?? null;
