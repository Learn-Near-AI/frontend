// Gamified explanations for Basics examples - each with unique theme.

export const BASICS_EXAMPLE_IDS = [
  'intro',
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'collections-vector',
];

export const isBasicsExample = (exampleId) => BASICS_EXAMPLE_IDS.includes(exampleId);

export const basicsDetailedExplanations = {
  intro: [
    {
      title: 'Welcome to NEARverse!',
      content: `Imagine a digital universe where you build things that last forever. That's NEARverse!

**What is this place?**
Think of NEARverse like a giant shared notebook that everyone can see, but only you can write in (for your own pages). Once you write something, it stays there forever. No one can rip out the page or change what you wrote.

**Why should you care?**
- Build apps that work like magic - no server needed
- Your code runs on computers all over the world
- Users don't need to trust you - the math protects them

You're about to build 9 mini-projects. Each one teaches something new. By the end, you'll know how to create real apps that thousands of people can use!`,
    },
    {
      title: 'Your Learning Quest',
      content: `Here's your path through NEARverse:

**The Basics (you start here):**
1. Hello World - Meet your first robot friend
2. Contract Structure - Learn how to build a base
3. View Methods - Become a scout who observes
4. Change Methods - Start building and changing things
5. State Management - Get your first inventory
6. Input Validation - Meet the gatekeeper
7. Error Handling - Build your safety net
8. Collections - Unlock the treasure chest

**The Advanced World (unlocked after basics):**
- Maps (like scoreboards)
- Events (the town crier)
- Access control (castle guards, guilds, safes)
- And more!

Each step builds on the last. Have fun!`,
    },
  ],
  'hello-world': [
    {
      title: 'Meet Your Robot Friend!',
      content: `Time to meet **Beep** - your first NEAR robot!

Beep lives in NEARverse. She's very simple - she only knows how to say one thing: "Hello!" Every time someone asks her what's up, she replies the same way.

**Why does this matter?**
This is the "Hello World" of smart contracts. It's the simplest thing you can build. But don't let that fool you - Beep has superpowers:

- She lives forever on the blockchain
- Anyone in the world can talk to her
- She never forgets what you tell her (until you change her code)

Your journey starts here. Let's make Beep say something cool!`,
    },
    {
      title: 'How Beep Works',
      content: `Here's Beep's brain (the code):

\`\`\`rust
#[near]
impl Contract {
    pub fn get_greeting(&self) -> String {
        "Hello".to_string()
    }
}
\`\`\`

**What each part does:**
- \`pub fn\` = Beep can answer when called
- \`get_greeting\` = Her name for this answer
- \`&self\` = She just looks at herself (doesn't change anything)
- \`-> String\` = She gives back words
- \`"Hello".to_string()\` = The actual words she says

See? Simple! She just returns the same greeting every single time.`,
    },
    {
      title: 'View Methods - Just Looking',
      content: `Beep uses something called a **view method**.

Think of it like looking through a window. You can see what's inside, but you can't change anything. That's exactly what view methods do:

- They only READ data
- They're free (no money needed)
- Anyone can call them

In the code, you know it's a view method because it uses \`&self\` (with one ampersand). That means "look but don't touch."

Try changing what Beep says! Click the code, change "Hello" to something else, and hit Run. You've already made your first change to a blockchain app!`,
    },
    {
      title: 'Your Turn!',
      content: `Here's your mission:

1. Find the line that says \`"Hello".to_string()\`
2. Change it to your own greeting
3. Click the Run button
4. See what Beep says now!

**Ideas for greetings:**
- "Welcome to my app!"
- "Greetings, traveler!"
- "Beep boop - I'm a robot!"

Go ahead. Make it yours!`,
    },
  ],
  'contract-structure': [
    {
      title: 'Building Your First Base',
      content: `In video games, you start by building a base. In NEARverse, you start by building a **smart contract** - the brain of your app.

A contract is like a building with:
- **Walls** (state) - what it remembers
- **Blueprints** (code) - how it works

The cool part? Once you build this "building," it runs by itself. No landlord needed. No maintenance crew. It just... works.

**What you'll build:**
A message board where anyone can set a message that sticks around. Like a sticky note that lives on the internet!`,
    },
    {
      title: 'The Contract Brain',
      content: `Every contract needs a brain. In Rust, we call it a \`struct\`:

\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    greeting: String,
}
\`\`\`

**What's happening:**
- \`greeting: String\` = The contract remembers ONE message
- \`pub struct\` = Other code can see this brain
- \`#[near(contract_state)]\` = "This is the contract's memory"

Think of it like a save file in a game. The contract loads this up every time someone calls it!`,
    },
    {
      title: 'The Constructor - Setting Up Camp',
      content: `When you first deploy a contract, you need to set things up. That's what the **constructor** does:

\`\`\`rust
#[init]
pub fn new(greeting: String) -> Self {
    Self { greeting }
}
\`\`\`

**Translation:**
- \`#[init]\` = "This runs ONLY once - when the contract is born"
- \`pub fn new(...) -> Self\` = "Here's how to create me"
- \`Self { greeting }\` = "Here's my starting state"

It's like pressing "New Game" - you pick your starting message, and then the contract exists forever!`,
    },
    {
      title: 'Why State Matters',
      content: `Here's the magic: the greeting STICKS AROUND.

Every time someone calls your contract, it remembers. That's because:

1. Someone calls the contract
2. NEAR loads up the contract's state (what it remembers)
3. Your code runs with that state
4. NEAR saves the state back

It's like a game that auto-saves after every action. Pretty cool, right?

**Try it:**
Set a greeting, then "call" the contract again. Does it remember what you set? You bet it does!`,
    },
  ],
  'view-methods': [
    {
      title: 'Become The Scout',
      content: `In every good game, you need a **scout** - someone who looks around and reports what they see. That's what view methods are!

A view method only LOOKS at stuff. It never changes anything. It's like:
- Checking your inventory
- Reading a sign
- Looking at a map

Free to use. No cost. Just looking.`,
    },
    {
      title: 'The Scout Code',
      content: `Here's how your scout works:

\`\`\`rust
pub fn get_greeting(&self) -> String {
    self.greeting.clone()
}
\`\`\`

**The secret is in the &self:**
- \`&\` means "borrow" - use without taking
- \`self\` means "the contract's state"

Together: "Borrow the contract state just for looking." That's why it's free - you're not making any changes!

The \`.clone()\` is just Rust being careful. It means "give me a copy" so we don't break anything.`,
    },
    {
      title: 'View vs Change - Big Difference',
      content: `This is super important:

**VIEW methods:**
- Use \`&self\` (one ampersand)
- Only read data
- Free to call
- \`pub fn get_something(&self)\`

**CHANGE methods:**
- Use \`&mut self\` (two ampersands + mut)
- Modify data
- Cost a tiny bit of NEAR
- \`pub fn set_something(&mut self)\`

The \`mut\` means "allow changes." Without it, Rust says "nope, can't change anything!"

This difference is huge. View methods are like checking a map (free). Change methods are like picking up an item (costs something because the game world changed).`,
    },
    {
      title: 'Why It Matters',
      content: `NEAR (and other blockchains) separates these for good reasons:

1. **Saving money** - Reading data is free because it doesn't bother the validators
2. **Speed** - View calls happen instantly, no waiting for blockchain
3. **Trust** - Anyone can verify what's stored without paying

Most apps let you view a LOT for free, and only charge when you change something. That's why dApps feel snappy!

Your turn: try switching between viewing and changing things. Feel the difference?`,
    },
  ],
  'change-methods': [
    {
      title: 'Time To Build!',
      content: `Scouts are great, but sometimes you need to actually DO stuff. That's where **change methods** come in.

Change methods are like:
- Picking up items in a game
- Building structures
- Casting spells that alter the world

They cost a tiny bit of NEAR (like gas in a car) because you're actually changing something on the blockchain.`,
    },
    {
      title: 'The Builder Code',
      content: `Here's a change method:

\`\`\`rust
pub fn set_greeting(&mut self, greeting: String) {
    self.greeting = greeting;
}
\`\`\`

**Key differences from view:**
- \`&mut self\` - "I need to CHANGE things" (mut = mutable)
- \`greeting: String\` - Takes a parameter
- No return type - Just does the thing

When someone calls this, they supply a new greeting, and BAM - the contract updates!`,
    },
    {
      title: 'What Happens When You Call It',
      content: `Here's the journey of a change method call:

1. **Your wallet signs** the transaction (proves it's you)
2. **NEAR finds** the contract on the blockchain
3. **The contract wakes up** and loads its memory
4. **Your code runs** - changes the greeting
5. **NEAR saves** the new memory
6. **Receipt arrives** - proof it worked

All of this happens in seconds. And the validator computers that run this get a small fee. Fair trade!`,
    },
    {
      title: 'Gas - The Fuel Of Blockchain',
      content: `Every change costs **gas** - a small fee that goes to the people running the blockchain computers.

**What affects gas:**
- How much data you read/write
- How complex your code is
- How busy the network is

**The good news:**
- NEAR fees are super low (fractions of a cent for simple stuff)
- View methods are FREE
- Most apps cover fees for users!

Think of it like:
- Viewing a website = free
- Posting something = small fee (like mailing a letter)

You're now a builder! Start changing things!`,
    },
  ],
  'state-management': [
    {
      title: 'Your Inventory Awaits!',
      content: `In games, your inventory is what makes you unique. Your sword, your potions, your treasure - it's all stored somewhere.

In NEAR contracts, **state** is your inventory. It's the data that sticks around between calls.

Without state, every time you called a contract, it would forget everything. Like a game that crashes every time you save!

Let's build a contract that remembers multiple things.`,
    },
    {
      title: 'Multiple Items In Your Inventory',
      content: `Here's a contract with multiple state fields:

\`\`\`rust
pub struct Contract {
    message: String,
    count: u64,
    enabled: bool,
}
\`\`\`

**What each holds:**
- \`message\` = a text string (like "Hello!")
- \`count\` = a number (like 0, 1, 2...)
- \`enabled\` = true or false

You can have as many fields as you want! Each one persists independently.

It's like having different slots in an inventory: one for weapons, one for armor, one for quest items...`,
    },
    {
      title: 'Updating Just One Item',
      content: `The cool part: you can update ANY field without touching the others:

\`\`\`rust
pub fn increment(&mut self) {
    self.count += 1;
}

pub fn toggle(&mut self) {
    self.enabled = !self.enabled;
}

pub fn update_message(&mut self, msg: String) {
    self.message = msg;
}
\`\`\`

Each function changes ONLY what it needs to. The other fields stay exactly as they were!

**Rust tip:** \`+= 1\` means "add 1 to myself." Same as \`self.count = self.count + 1\`.`,
    },
    {
      title: 'Real World Inventories',
      content: `Big apps have HUGE inventories:

**A banking app might track:**
- User balances (millions of accounts!)
- Total money in system
- Is the bank paused?

**An NFT game might track:**
- Player's characters
- Each character's stats
- Items in inventory
- Quest progress

Understanding state is key to building anything useful. Your inventory is your power!`,
    },
  ],
  'input-validation': [
    {
      title: 'Meet The Gatekeeper!',
      content: `Every good castle has a **gatekeeper** - the person who checks who's allowed in and what they're carrying.

In your contracts, YOU are the gatekeeper. You decide what data gets in and what gets rejected.

Why does this matter? Because on the blockchain, anyone can call your contract. Nice users. Mean users. Curious hackers. You need to check EVERYTHING.`,
    },
    {
      title: 'The Guard Code',
      content: `Here's how you guard your contract:

\`\`\`rust
pub fn set_message(&mut self, message: String) {
    require!(!message.is_empty(), "Message cannot be empty");
    require!(message.len() <= 280, "Message too long");
    
    self.message = message;
}
\`\`\`

**How require! works:**
- If the check FAILS, the whole transaction stops
- The error message tells the user what went wrong
- Nothing gets saved

It's like the gatekeeper saying "Sorry, that won't fit through the gate!"`,
    },
    {
      title: 'Common Guard Patterns',
      content: `Here are moves every gatekeeper should know:

**Check if empty:**
\`\`\`rust
require!(!string.is_empty(), "Required field");
\`\`\`

**Check the size:**
\`\`\`rust
require!(amount <= max_limit, "Too big!");
\`\`\`

**Check the math:**
\`\`\`rust
require!(balance >= amount, "Not enough!");
\`\`\`

**Check who it is:**
\`\`\`rust
require!(caller == owner, "Not the boss!");
\`\`\`

Always validate BEFORE you do anything. Fail fast, fail safe!`,
    },
    {
      title: 'Why Validation Is Your Best Friend',
      content: `Here's the truth: users WILL try weird stuff.

They'll send:
- Empty messages
- Million-character texts  
- Negative numbers where positives should be
- Crafted attacks trying to break your code

That's okay! As long as you validate EVERYTHING, nothing bad can happen.

**Golden rule:** Trust no input. Check everything. Sleep better at night.`,
    },
  ],
  'error-handling': [
    {
      title: 'Building Your Safety Net',
      content: `Even with the best gatekeeper, sometimes things go wrong. Maybe:
- A number calculation breaks
- Expected data isn't there
- Something totally unexpected happens

That's where **error handling** comes in. It's your safety net - catching problems before they become disasters.`,
    },
    {
      title: 'The Safety Net Code',
      content: `require! is also your safety net:

\`\`\`rust
pub fn withdraw(&mut self, amount: u128) {
    let balance = self.balances.get(&caller).unwrap_or(0);
    
    require!(amount <= balance, "Not enough!");
    
    // Do the withdrawal...
}
\`\`\`

**If the user doesn't have enough balance:**
- require! catches it
- Transaction stops immediately
- Clear error: "Not enough!"

No corrupted data. No broken state. Just a clear failure message.`,
    },
    {
      title: 'Option and Result - Two Tools',
      content: `Rust gives you two powerful error tools:

**Option<T>** - "Might have a value, might not:"
\`\`\`rust
let item = self.items.get(index);
// item is Some(value) OR None
\`\`\`

**Result<T, E>** - "Might succeed, might fail:"
\`\`\`rust
fn do_something() -> Result<Good, Bad> {
    if good { Ok(value) }
    else { Err(Error::BadThing) }
}
\`\`\`

Most smart contract code uses Option. If something might be missing, handle it!`,
    },
    {
      title: 'Panic vs Recover',
      content: `When should you PANIC (stop everything) vs return an error?

**PANIC when:**
- Continuing would break everything
- It's a security issue
- It's truly "this should never happen"

**Return error when:**
- The caller might want to try something else
- It's an expected failure case
- You want detailed info

For contracts: simple is better. If something's wrong, require! and fail clearly.`,
    },
  ],
  'collections-vector': [
    {
      title: 'Unlock The Treasure Chest!',
      content: `So far, you've stored single things - one message, one number. But what if you want to store a LIST of things?

That's where **Vectors** come in. Think of them like:
- A treasure chest that holds multiple items
- A to-do list with many tasks
- A playlist of songs

Vectors let you store ordered lists that persist on the blockchain. Time to upgrade your inventory!`,
    },
    {
      title: 'The Treasure Chest Type',
      content: `Here's how you create a vector:

\`\`\`rust
use near_sdk::collections::Vector;

pub struct Contract {
    items: Vector<String>,
}
\`\`\`

**Vectors can hold:**
- Strings, numbers, booleans
- Even custom types you create!
- Multiple of the same type

**Key features:**
- Ordered (first, second, third...)
- Indexed (position 0, 1, 2...)
- Can grow and shrink
- Duplicates allowed!`,
    },
    {
      title: 'The Storage Key',
      content: `Every collection needs a unique **storage prefix** - like a label for your chest:

\`\`\`rust
#[init]
pub fn new() -> Self {
    Self {
        items: Vector::new(b"i"),  // "i" for items!
    }
}
\`\`\`

**Why it matters:**
- Each collection needs its OWN prefix
- If you reuse one, data gets mixed up!
- Pick something short and memorable

**Pro tip:** One letter works! "b" for balances, "i" for items, "m" for messages.`,
    },
    {
      title: 'Vector Toolkit',
      content: `Here's what you can do with vectors:

**Add to the end:**
\`\`\`rust
self.items.push(&new_item);
\`\`\`

**Get by position:**
\`\`\`rust
let item = self.items.get(index);  // Option<String>
\`\`\`

**How many items?**
\`\`\`rust
let count = self.items.len();
\`\`\`

**Loop through all:**
\`\`\`rust
for item in self.items.iter() {
    // do something with each item
}
\`\`\`

Vectors are perfect for: to-do lists, chat messages, game logs, anything ordered!`,
    },
  ],
};

export const getBasicsDetailedExplanation = (exampleId) =>
  basicsDetailedExplanations[exampleId] ?? null;
