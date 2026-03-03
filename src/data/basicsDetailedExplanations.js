// Detailed explanations for Basics examples only (Ethernaut/CryptoZombies style).
// Each entry is an array of { title, content } for expandable modal sections. Content is markdown.

export const BASICS_EXAMPLE_IDS = [
  'intro',
  'hello-world',
  'contract-structure',
  'view-methods',
  'change-methods',
  'state-management',
  'input-validation',
  'error-handling',
  'events',
  'collections-vector',
  'collections-map',
];

export const isBasicsExample = (exampleId) => BASICS_EXAMPLE_IDS.includes(exampleId);

export const basicsDetailedExplanations = {
  intro: [
    {
      title: 'What is this all about?',
      content: `Hey! Welcome. We're building something a bit different here — a place where you can actually **play around with code** and see what happens. Most tutorials assume you already know things, which isn't fair if you're just starting out.

This tool has 15 working examples right now. We're building more as fast as we can.

**How it works:**
- Each example shows you some code
- You can edit it, run it, and see what happens
- If you get stuck, there's a "Show solution" button
- The Explanation tab breaks things down step by step

**Why we built this:**
We wanted somewhere you could learn by doing — not just reading and hoping it makes sense. Every example has Rust and JavaScript, so pick whichever feels more familiar.

Don't worry about getting everything perfect the first time. Breaking things is part of learning!`,
    },
    {
      title: 'The learning path we recommend',
      content: `Here's the order we think works best. But honestly? You're the boss. Jump around if you want.

1. **Hello World** — The simplest possible contract. Just returns a greeting.
2. **Contract Structure** — Adds some state (data that sticks around).
3. **View Methods** — Reading data without paying anything.
4. **Change Methods** — Writing data (this costs a little gas).
5. **State Management** — Keeping data between calls.
6. **Input Validation** — Making sure people's input is safe.
7. **Error Handling** — What to do when things go wrong.
8. **Events** — Telling the outside world something happened.
9. **Collections** — Lists and key-value stores.
10. Then tackle Security, Cross-Contract calls, NFTs, and more.

Each one builds on the last. But hey, if something interests you more, go for it!`,
    },
    {
      title: 'Learn More',
      content: `Want to dig deeper? Here's where we learned this stuff:

- **NEAR Docs (for beginners):** [docs.near.org/develop/contracts/overview](https://docs.near.org/develop/contracts/overview) — Great starting point for understanding how contracts work.
- **Nomicon (the technical stuff):** [nomicon.io](https://nomicon.io/) — The nitty-gritty protocol specs if you really want to understand what's happening under the hood.

We're still learning too. If something doesn't make sense, that's on us — let us know!`,
    },
  ],

  'hello-world': [
    {
      title: 'What is this contract doing?',
      content: `This is the simplest NEAR contract you can write. It does exactly one thing: returns the text "Hello, NEAR!" when you ask it nicely.

Think of it like a tiny website with just one page. That page always says "Hello, NEAR!" No matter who visits, no matter when they visit.

**Why this matters:**
Every smart contract on NEAR follows this same pattern. You got a struct (the contract), some methods (things it can do), and that's it. Once you get this, you can build on it.

**The cool part:**
This is a "view method" — it's read-only. That means anyone can ask for the greeting without paying anything. No gas fees, no wallet needed, no signatures. Just a quick question and an answer.`,
    },
    {
      title: 'Breaking it down line by line',
      content: `Let me walk you through what each part does:

**Lines 1-2:** We're importing stuff from the NEAR SDK. The SDK handles all the complicated blockchain stuff so you don't have to.

**Lines 4-5:** The \`#[near(contract_state)]\` and \`#[derive(PanicOnDefault)]\` — this marks our struct as the contract's memory. The "PanicOnDefault" part means if someone tries to use the contract without setting it up first, it crashes. That's actually a good thing — it prevents bugs.

**Line 6:** \`pub struct Contract {}\` — This is our contract. It's empty right now because we don't need to store any data.

**Lines 8-11:** The \`#[init]\` function. This runs exactly once when the contract is first deployed. It sets everything up.

**Lines 14-17:** The \`hello_world\` method. See how it takes \`&self\`? That means it's just looking at things, not changing anything. That's why it's free to call.

**Line 15:** Returns "Hello, NEAR!" — simple as that.`,
    },
    {
      title: 'Why is this important?',
      content: `This tiny contract teaches you three really big ideas:

**1. The struct pattern:** Every NEAR contract is a Rust struct with some special marks (\`#[near(contract_state)]\`). The SDK handles all the messy serialization stuff.

**2. View methods:** Methods that just read data and don't change anything. They're free because they don't need the blockchain to reach agreement — everyone can just check the answer themselves.

**3. The #[init] thing:** Contracts need to be set up once before they work. This is that setup.

These three ideas show up in every single NEAR contract, no matter how complex. Master these, and you're halfway to understanding everything else.`,
    },
    {
      title: 'Learn More',
      content: `If you want to read more about this stuff, here are some good places:

- **Beginner-friendly docs:** [docs.near.org/develop/contracts/overview](https://docs.near.org/develop/contracts/overview) — Walks through contract basics in a way that's easier to follow.

- **Technical reference:** [docs.near.org/develop/contracts/anatomy](https://docs.near.org/develop/contracts/anatomy) — Goes deeper into the parts we touched on here.

- **Nomicon (for the brave):** [nomicon.io/Principles](https://nomicon.io/Principles) — This is the actual protocol specification. It's heavy reading, but if you want to understand exactly how things work at the protocol level, this is it.

Hope this helped! Let us know if anything is still unclear.`,
    },
  ],

  'contract-structure': [
    {
      title: 'What are we building here?',
      content: `Now we're getting somewhere! This contract actually **stores something** — the account ID of whoever deployed it. We call this person the "owner."

Think of it like a house. The contract is the house, and the owner_id is like knowing who built it. Later, we can use this to say "only the owner can do X" — like a spare key that only works for one person.

**Why would you want this?**
Pretty much every real app needs some kind of "admin" or "owner" who can do special things. Maybe only the owner can update prices, pause the contract, or change settings. This example shows you the foundation for that.

**What's new here:**
We added state — a field in the struct that sticks around between calls. This is the big leap from "hello world" to "actually useful."`,
    },
    {
      title: 'Walking through the code',
      content: `Let me explain each piece:

**Lines 3-4:** We're importing \`env\` and \`AccountId\`. The \`env\` part lets us talk to the blockchain environment (find out who called us, what account we're on, etc.). \`AccountId\` is just the type for NEAR account names (like "alice.testnet").

**Line 7:** \`owner_id: AccountId\` — This is our state. We're storing the owner's account ID. This persists on-chain until someone changes it.

**Lines 10-12:** The \`#[init]\` function. See how we call \`env::current_account_id()\`? That gives us the account where this contract is deployed. So whoever deploys this contract becomes the owner automatically. Pretty handy!

**Lines 14-16:** A simple view method that just returns the owner. Since it's \`&self\` (not \`&mut self\`), it can't change anything — it's just reading.

**The key insight:**
The \`owner_id\` set in \`new()\` never changes unless we add code to change it. That's what makes this an "owner pattern" — the deployer gets special powers by default.`,
    },
    {
      title: 'Why does this matter?',
      content: `This is where things get real. Once you can:

1. Store data on-chain (the owner_id)
2. Read that data back (get_owner)
3. Check who's calling (we'll get to this)

...you can build all sorts of access control. Here are some things you could do with this foundation:

- **Ownable contracts:** Only the owner can call certain methods
- **Admin roles:** A list of accounts that can do admin things
- **Multi-sig:** Require multiple people to approve something
- **Pausable contracts:** Owner can hit the "emergency stop" button

All of these start with storing an account ID and checking who's calling. You're now equipped to learn all of them!`,
    },
    {
      title: 'Learn More',
      content: `Here's where to read more:

- **Contract anatomy:** [docs.near.org/develop/contracts/anatomy](https://docs.near.org/develop/contracts/anatomy) — Breaks down the different parts of a contract. Pretty helpful for seeing the big picture.

- **Serialization (what's happening under the hood):** [docs.near.org/develop/contracts/serialization](https://docs.near.org/develop/contracts/serialization) — Explains how NEAR turns your data into bytes and back. This is what \`#[near(contract_state)]\` handles for you.

- **The Nomicon stuff:** [nomicon.io/RuntimeSpec/Components/Storage](https://nomicon.io/RuntimeSpec/Components/Storage) — If you really want to understand how the storage layer works at a protocol level.

We promise the docs aren't as scary as they look! Start with the first link, then branch out.`,
    },
  ],

  'view-methods': [
    {
      title: 'What is a view method?',
      content: `A view method is just a question you ask the contract. It can look at all the stored data, but it can't change anything. And here's the cool part — **it's free**.

Why is it free? Well, imagine you and a friend are looking at the same piece of paper. You can read what's on it without needing to negotiate or agree on anything. That's a view method. Everyone can see the same answer, so there's no need for the blockchain to reach consensus.

**Real-world examples:**
- "What's my balance?" — That's a view method
- "Who owns this NFT?" — Also a view
- "What is the current price?" — You guessed it

Any time a dApp shows you information, it's probably calling a view method behind the scenes.`,
    },
    {
      title: 'Looking at our example',
      content: `This contract stores a greeting message and gives us two ways to look at it:

**The greeting field:**
\`greeting: String\` — This is stored on-chain. It persists between calls.

**get_greeting:**
Takes \`&self\` (not \`&mut self\`). That little ampersand is the key — it means "I'm just looking, not touching." The compiler makes sure view methods can't change state.

**get_greeting_length:**
Returns how long the greeting is. Notice it does some math (\`.len()\`) and returns a number. View methods can return almost anything — strings, numbers, lists, even complex data structures.

**The flow:**
1. Contract gets initialized with a greeting (in \`new()\`)
2. Anyone can call \`get_greeting\` or \`get_greeting_length\` whenever they want, for free
3. Nothing ever changes on-chain from these calls`,
    },
    {
      title: 'How this works in the real world',
      content: `Here's where it gets practical. Every NEAR dApp you've ever used works like this:

**Step 1:** The contract gets deployed with some state (balances, NFT ownership, game state, whatever)

**Step 2:** Your wallet calls view methods to show you information:
- "Your balance is 10 NEAR"
- "You own these 3 NFTs"
- "The current poll results are..."

**Step 3:** When you do something (transfer, vote, buy), that's a **change method** — which costs gas

The whole dApp experience is just view methods showing you stuff, and change methods letting you do stuff. Now you understand the basics!`,
    },
    {
      title: 'Learn More',
      content: `Dive deeper with these links:

- **Calling contracts:** [docs.near.org/develop/contracts/calling](https://docs.near.org/develop/contracts/calling) — Explains the difference between view and change calls from the user's perspective.

- **The RPC stuff:** [docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts) — This is how your code actually talks to the blockchain. View methods become RPC calls.

- **Nomicon on methods:** [nomicon.io/Standards/Storage](https://nomicon.io/RuntimeSpec/Architecture/Transactions) — If you want to understand the transaction lifecycle, start here. It's pretty dense but shows you exactly what happens when you call a method.

View methods are the "reading" of smart contracts. Next up: the "writing"!`,
    },
  ],

  'change-methods': [
    {
      title: 'What makes a method "change"?',
      content: `A change method is when you actually do something — you modify state, update data, move tokens around. Unlike view methods, these **cost money** (in the form of "gas").

Think of it this way:
- **View method:** Asking someone what time it is. They answer. Nothing changed.
- **Change method:** Asking someone to write down a new time. They do work. The paper now says something different.

**Why does it cost?**
When you change data on the blockchain, every node in the network has to agree that the change happened. That takes computation, and computation costs gas. It's like how you pay for electricity — the network is doing work for you.

**What you need:**
- A signed transaction (your wallet signs it)
- Enough gas to cover the work
- The method takes \`&mut self\` so it can make changes`,
    },
    {
      title: 'Our example explained',
      content: `This contract does three things:

**get_greeting:**
A view method. Just returns what's stored. Free!

**set_greeting:**
A change method. Takes \`&mut self\` (the mut means "I'm going to change stuff"). When you call this:
1. Your wallet signs the transaction
2. The contract receives your new greeting
3. It saves it to \`self.greeting\`
4. The change is recorded on-chain
5. Next time someone calls get_greeting, they see your new message

**append_suffix:**
Another change method. Takes the existing greeting and adds to it. See how we use \`push_str\` in Rust or \`+=\` in JS? That's modifying the string.

**The key insight:**
State changes persist. Once you call \`set_greeting("Hello")\`, that's there until someone changes it again. This is what makes smart contracts "smart" — the data sticks around.`,
    },
    {
      title: 'Gas: what you actually pay',
      content: `Let's talk about money, because this confuses a lot of people.

**What is gas?**
Gas is a unit of computation. Every operation (save a value, run a loop, call a function) costs gas. The more complex your code, the more gas it needs.

**How much does it cost?**
- On NEAR, gas is measured in "TGas" (TerraGas). 1 TGas = 10^12 gas units.
- A simple change method might use 10-50 TGas
- A complex one could use 300+ TGas
- 1 NEAR = 10^24 yoctoNEAR (the smallest unit)
- Gas price fluctuates based on network demand

**The user experience:**
Your wallet estimates the gas, shows you the cost, and if you have enough balance, it signs the transaction. If something goes wrong mid-way, the whole transaction reverts — your data doesn't get saved. That's called "atomicity" and it's actually pretty great.`,
    },
    {
      title: 'Learn More',
      content: `Want to understand this better? Check these out:

- **Transactions overview:** [docs.near.org/concepts/transactions/overview](https://docs.near.org/concepts/transactions/overview) — Gives you the full picture of what happens when you call a change method.

- **Gas docs:** [docs.near.org/concepts/gas](https://docs.near.org/concepts/gas) — Explains gas, fees, and how NEAR's fee model works.

- **Nomicon on execution:** [nomicon.io/RuntimeSpec/Transaction](https://nomicon.io/RuntimeSpec/Transaction) — The technical specification for how transactions work. Not for the faint of heart, but thorough!

Change methods are the "doing" part of smart contracts. Combined with view methods (the "looking"), you've now got the complete picture!`,
    },
  ],

  'state-management': [
    {
      title: 'What is state management?',
      content: `This is where things get real. Now we're not just reading data — we're **storing** it so it sticks around.

Think of it like a whiteboard. Before, we could only show people what was written. Now we can actually write something down, and it stays there for the next person who comes along.

**Our example:** A counter. It starts at 0. Every time someone calls \`increment\`, it goes up by 1. When someone calls \`get_counter\`, they see the current value.

**Why this matters:**
Every useful app needs state. Token balances, NFT ownership, game scores, poll results — all of this is just data that gets stored and updated. The counter pattern is the simplest version of this.

**The lifecycle:**
1. \`new()\` — Sets the initial value (0)
2. \`get_counter\` — Reads the current value (view, free)
3. \`increment\` — Changes the value (change, costs gas)

That's the full loop. Init → read → update. You'll see this pattern everywhere.`,
    },
    {
      title: 'How our counter works',
      content: `Let me walk you through what's happening:

**The state:**
\`counter: u64\` — We're storing a plain number. In Rust, \`u64\` is an unsigned 64-bit integer (0 to about 18 quintillion). That's plenty for a counter.

**The init:**
\`new() -> Self\` creates the contract with \`counter: 0\`. This runs once when you deploy.

**The view method:**
\`get_counter(&self) -> u64\` just returns whatever's in \`self.counter\`. It's \`&self\` (not \`&mut self\`) so it can't change anything.

**The change method:**
\`increment(&mut self)\` adds 1 to the counter. The \`&mut self\` is what lets us modify state. Each call adds exactly 1 — no more, no less.

**The key idea:**
State persists. Once you set \`counter = 5\`, it stays 5 until someone calls \`increment\` again. This is the foundation of every smart contract that "remembers" anything.`,
    },
    {
      title: 'Where you see this pattern',
      content: `The counter is one of those "simple but everywhere" patterns. Here are places you'd see it:

**Token balances:**
Your balance is just a counter. When you receive tokens, increment. When you send, decrement. The whole crypto ecosystem runs on this idea.

**Vote counting:**
Each option has a counter. Someone votes for A? Increment A's counter. Simple, but powers everything from DAOs to polls.

**Supply tracking:**
How many NFTs have been minted? That's a counter. What about the next token ID? Also a counter.

**Game scores:**
High scores, kill counts, points — all counters under the hood.

Once you get that "store a number, update it later" concept, you've got the building block for almost every smart contract out there.`,
    },
    {
      title: 'Learn More',
      content: `Dig deeper with these resources:

- **Contract storage:** [docs.near.org/develop/contracts/storage](https://docs.near.org/develop/contracts/storage) — Explains how data gets stored on-chain.

- **State models:** [docs.near.org/develop/contracts/modeling](https://docs.near.org/develop/contracts/modeling) — How to think about organizing your contract's data.

- **Nomicon on storage:** [nomicon.io/RuntimeSpec/Components/Storage](https://nomicon.io/RuntimeSpec/Components/Storage) — The technical deep-dive on how NEAR handles storage at the protocol level.

State is what makes smart contracts "smart" — they remember things!`,
    },
  ],

  'input-validation': [
    {
      title: 'Why validate inputs?',
      content: `Here's a scary thought: what if someone sends your contract a message that's a million characters long? Or nothing at all? Or tries to break your math by dividing by zero?

That's where **input validation** comes in. Before you let any data into your contract's precious state, you check it first.

**Our example:**
We accept a message, but only if it's:
- Not empty (at least 1 character)
- Not too long (100 characters or fewer)

If someone tries something weird, we reject it before it can cause problems.

**Why this matters:**
Your contract is only as safe as its weakest input. Every bug, every hack, almost always comes down to "the developer didn't expect this weird input." Validation is your first line of defense.

Think of it like a bouncer at a club. The contract says "these are the rules" and the bouncer (your validation code) makes sure nobody sketchy gets in.`,
    },
    {
      title: 'How we validate in our contract',
      content: `Let's look at the Rust code:

\`\`\`rust
require!(message.len() > 0, "Message cannot be empty");
require!(message.len() <= 100, "Message too long (max 100 chars)");
self.message = message;
\`\`\`

**The require! macro:**
This is like an assert. You say "this must be true" and if it's not, the contract **panics** — which means the whole transaction fails and nothing changes.

**What's happening:**
1. Someone calls \`set_message("hello")\`
2. We check: is length > 0? Yes. Continue.
3. We check: is length <= 100? Yes. Continue.
4. We save the message. Done!

But if someone calls \`set_message("")\`, step 2 fails, the contract panics, and nothing gets saved. The state stays exactly as it was.

**The key insight:**
Validation failures don't silently fail — they explicitly crash the transaction. This is actually good! It tells the caller "hey, your input was bad, fix it and try again."`,
    },
    {
      title: 'Types of validation to think about',
      content: `There are lots of ways inputs can go wrong. Here's what to think about:

**Length checks:**
- Strings: not empty, not too long
- Arrays/lists: not empty, not too big
- Numbers: within a reasonable range

**Format checks:**
- Is this actually an email? A valid address?
- Does this JSON parse correctly?
- Is this a number when it should be?

**Business logic:**
- Does this user have enough balance?
- Is the auction still active?
- Has this voter already voted?

**The golden rule:**
Never trust input. Assume every piece of data that comes in could be malicious. Check everything. It's way easier to prevent problems than to fix them after they're in your state.

Also, error messages matter! "Your input is bad" is useless. "Your message must be between 1 and 100 characters" is helpful. Be nice to your users.`,
    },
    {
      title: 'Learn More',
      content: `Here's where to read more:

- **Validation best practices:** [docs.near.org/develop/contracts/best-practices](https://docs.near.org/develop/contracts/best-practices) — General security tips for contracts.

- **Security considerations:** [docs.near.org/develop/contracts/security](https://docs.near.org/develop/contracts/security) — Goes deeper into what can go wrong.

- **Nomicon on errors:** [nomicon.io/RuntimeSpec/FunctionCall/Policy](https://nomicon.io/RuntimeSpec/FunctionCall/Policy) — Technical details on how panics work.

Validation is like handwashing — it's simple, it takes a second, and it prevents a lot of problems.`,
    },
  ],

  'error-handling': [
    {
      title: 'Two ways things can go wrong',
      content: `Sometimes things fail in ways you expect, and sometimes they fail in ways that shouldn't happen. Smart contracts handle both differently.

**The two categories:**

**1. Recoverable errors:**
These are expected failures. The user might send bad input, or conditions might not be right. You handle these gracefully — return \`None\` or an error, and let the caller decide what to do.

**2. Unrecoverable errors:**
These are things that should never happen. The code is broken, an invariant was violated, something fundamental went wrong. When this happens, you **panic** — the whole transaction stops, nothing gets saved.

**Our example shows both:**
- \`try_parse_number\`: If the user sends "abc" and asks us to parse it as a number, we return \`None\`. Recoverable — they just need to try again with valid input.
- \`assert_positive\`: If somehow a negative number gets through, that's a bug. We panic. The transaction fails completely.

**The rule of thumb:**
If a user can reasonably cause it, handle it gracefully. If it's a code bug or invariant violation, panic.`,
    },
    {
      title: 'Looking at the code',
      content: `Let me break down our four functions:

**try_parse_number:**
\`\`\`rust
s.parse().ok()
\`\`\`
Rust's \`.parse()\` returns a \`Result\`. We convert it to an \`Option\` with \`.ok()\`. If parsing fails, we return \`None\` instead of crashing. The caller can check: \`match result { Some(n) => ..., None => ... }\`.

**safe_divide:**
\`\`\`rust
if b == 0 { return None; }
Some(a / b)
\`\`\`
Division by zero would crash, so we check first. If \`b\` is 0, return \`None\`. Otherwise, return the result wrapped in \`Some\`.

**assert_positive:**
\`\`\`rust
require!(value > 0, "Value must be positive");
\`\`\`
This uses the \`require!\` macro. If the condition is false, it panics with the message. This is for things that should NEVER happen in normal operation.

**strict_check:**
\`\`\`rust
env::panic_str("ZERO_NOT_ALLOWED")
\`\`\`
Sometimes you want to panic with a specific string instead of using \`require!\`. This is the manual way to do it.

**The pattern:**
- Option/Result for "might fail" → caller handles it
- require!/panic for "should never fail" → crash the transaction`,
    },
    {
      title: 'When to use what',
      content: `Here's a quick guide for when to use each approach:

**Use Option/Result when:**
- User provides parseable data that might be invalid
- You're looking something up that might not exist
- The operation could reasonably fail in normal use

**Use require! when:**
- Checking preconditions (is the caller authorized?)
- Validating input (did they send enough?)
- Business rules that must be followed

**Use panic_str when:**
- Something is deeply wrong (corrupted state, impossible condition)
- You need a specific error message
- require! isn't flexible enough

**The big picture:**
The difference is about who should handle the failure. If it's something the caller can fix and try again, use Option/Result. If it's something that shouldn't happen and indicates a bug, panic.

Also remember: when a contract panics, the ENTIRE transaction reverts. Nothing gets saved. This is important for security — it prevents partial state updates that could leave things in a bad place.`,
    },
    {
      title: 'Learn More',
      content: `Explore these resources:

- **Error handling in Rust:** [docs.near.org/develop/contracts/rust/intro](https://docs.near.org/develop/contracts/rust/intro) — Has a section on handling errors the Rust way.

- **Panic vs Result:** [nomicon.io/RuntimeSpec/FunctionCall/VMInternals](https://nomicon.io/RuntimeSpec/FunctionCall/VMInternals) — What actually happens when a contract panics.

- **Rust's error handling:** [doc.rust-lang.org/book/ch09-00-error-handling.html](https://doc.rust-lang.org/book/ch09-00-error-handling.html) — The canonical guide to Rust's error handling if you want to go deeper.

Getting errors right makes your contract much more pleasant to use. No one likes cryptic error messages!`,
    },
  ],

  events: [
    {
      title: 'What are events and why do we need them?',
      content: `Alright, here's a concept that doesn't get enough love: **events**.

When your contract does something important — someone bought something, voted, transferred tokens — how does the outside world know about it?

**The problem:**
Smart contracts live on the blockchain. They're isolated. Unless someone specifically calls your contract to ask "what happened?", there's no way for them to know. That's where events come in.

**What events do:**
Events are like your contract shouting to the world "hey, something happened!" They're stored in the transaction receipt, and special tools called **indexers** listen for these events and keep track of them.

**Why this matters:**
- **Wallets** listen for transfer events to update balances
- **Marketplaces** listen for NFT events to show what's for sale
- **Analytics** listen to build dashboards and activity feeds
- **Your app** can react to things happening in the contract

Without events, every time you opened a wallet or dApp, it would have to scan every single transaction ever made. Events make that unnecessary — indexers already know what happened because the contract told them!`,
    },
    {
      title: 'The high-level way to do events (Rust)',
      content: `Here's the thing — you *can* manually format JSON strings (and for a long time, that's all anyone did). But there's a better way now.

**The modern approach uses the \`#[near(event_json(...))]\` macro:**

\`\`\`rust
#[near(event_json(standard = "example", version = "1.0.0"))]
enum Event {
    MessageUpdated { new_message: String },
}

impl Contract {
    pub fn set_message(&mut self, message: String) {
        // ... do your logic ...
        
        // Emit the event - easy!
        self.emit(Event::MessageUpdated { new_message: message });
    }
}
\`\`\`

**Why this is better:**
1. The macro handles all the JSON formatting for you
2. It's type-safe — the compiler catches mistakes
3. It follows NEP-297 automatically
4. Less room for bugs in your formatting code

The \`emit()\` method takes your enum variant and automatically formats it as proper NEP-297 JSON. Way cleaner than doing it yourself!

**What's NEP-297?**
It's just a standard that says events should look a certain way — with \`standard\`, \`version\`, \`event\`, and \`data\` fields. Following the standard means indexers know how to parse your events.`,
    },
    {
      title: 'What actually happens',
      content: `When you emit an event, here's the journey:

**1. In your contract:**
You call \`self.emit(Event::MessageUpdated { ... })\`. The macro turns it into a JSON string that looks like:
\`\`\`json
{"standard":"example","version":"1.0.0","event":"MessageUpdated","data":{"new_message":"hello"}}
\`\`\`

**2. The prefix:**
This string gets prefixed with \`EVENT_JSON:\` and logged via \`env::log_str()\`. This is the low-level part that's always happening under the hood.

**3. In the receipt:**
The event is stored as part of the transaction receipt. Receipts are permanent — once a transaction is finalized, the events are there forever.

**4. Indexers pick it up:**
Tools like QueryAPI, The Graph (on other chains), or custom indexers scan receipts for \`EVENT_JSON:\` strings. When they see yours, they parse it and update their databases.

**5. dApps query the indexer:**
When you open a wallet or dApp, it asks the indexer "what events happened?" instead of scanning millions of transactions.

**The flow:**
Contract → Receipt → Indexer → Your dApp

Events are the bridge between your contract and the rest of the world!`,
    },
    {
      title: 'Common event patterns',
      content: `Here are events you'll see in almost every real contract:

**For tokens (NEP-141/171):**
- \`ft_transfer\` — someone sent tokens
- \`nft_transfer\` — someone transferred an NFT
- \`mint\` — new tokens/NFTs were created

**For marketplaces:**
- \`list\` — something was listed for sale
- \`purchase\` — something was bought
- \`cancel\` — a listing was canceled

**For voting/games:**
- \`vote\` — someone voted
- \`game_over\` — a game ended
- \`score_submitted\` — a new high score

**Best practices:**
- Use standard event names when possible (helps indexers)
- Include relevant data (who, what, when)
- Don't emit events for every tiny thing — save them for important state changes
- Version your events so you can upgrade later

Also, events don't cost extra gas — they're already being stored in the receipt. So use them liberally!`,
    },
    {
      title: 'Learn More',
      content: `Here's where to learn more:

- **NEP-297 (the standard):** [nomicon.io/Standards/Tokens/Event](https://nomicon.io/Standards/Tokens/Event) — The official specification. It's what makes all this work.

- **Events in docs:** [docs.near.org/develop/contracts/events](https://docs.near.org/develop/contracts/events) — The beginner-friendly docs page.

- **near-contract-tools:** [docs.rs/near-contract-tools/latest/near_contract_tools/](https://docs.rs/near-contract-tools/latest/near_contract_tools/) — If you want an even nicer way to do events (and other patterns), this crate has derive macros for everything.

- **Real-world examples:** Check out the near-sdk-rs test files on GitHub — they have great examples of how events are used in production contracts.

Events are how your contract talks to the world. Once you get comfortable with them, you'll start seeing all sorts of possibilities!`,
    },
  ],

  'collections-vector': [
    {
      title: 'What is a Vector?',
      content: `A **Vector** is just a fancy name for a list — an ordered collection of things where each item has a position (0, 1, 2, and so on).

Think of it like:
- A to-do list
- A playlist of songs
- A stack of cards

**When to use vectors:**
- When order matters (first in, first out)
- When you need to access things by position
- When you want a simple list of items

**Our example:**
We have two vectors — one for "items" and one for "tags". Each is just a list of strings. You can add items, get them by index, or remove them.

**The key thing:**
NEAR's vectors are special because they live in **storage** (on-chain). Regular Rust vectors (\`Vec\`) would disappear when the function ends. These persist!`,
    },
    {
      title: 'The storage prefix thing',
      content: `This is one of the trickiest parts of NEAR development, but you only need to understand it once.

**The problem:**
The blockchain stores data as key-value pairs. When you create a Vector, it needs to know where to store its data. If you have two vectors and they both try to use the same storage keys, they'll overwrite each other!

**The solution:**
Each collection needs a **unique prefix** — just a few bytes that identify "this is MY data, not yours."

\`\`\`rust
items: Vector::new(b"i"),   // prefix: "i"
tags: Vector::new(b"t"),    // prefix: "t" - different!
\`\`\`

The \`b"i"\` is just a byte literal — "i" as a single byte. You can use anything: \`b"a"\`, \`b"mylist"\`, whatever. Just make sure:
1. Each collection in your contract has a unique prefix
2. You never change it after deployment (or your data becomes inaccessible)

**The rule:**
One prefix per collection. Two vectors = two different prefixes. Easy!`,
    },
    {
      title: 'Common operations',
      content: `Here's what you can do with a vector:

**Adding items:**
\`\`\`rust
self.items.push(&item);
\`\`\`
Adds to the end. Simple.

**Getting items:**
\`\`\`rust
self.items.get(index)  // Returns Option<T> - None if index is out of bounds
\`\`\`

**Getting all items:**
\`\`\`rust
self.items.iter().collect::<Vec<_>>()
\`\`\`
The \`.iter()\` gives you an iterator, and \`.collect()\` turns it into a regular Rust Vec.

**Removing items:**
\`\`\`rust
self.items.swap_remove(index)
\`\`\`
This is the fast way! It swaps the item at \`index\` with the last item, then removes the last one. O(1) — constant time, no matter how big the list!

Why is this important? Because removing from the middle of an array normally requires shifting everything. The swap trick avoids that entirely. The tradeoff: the order changes (the last item takes the removed position).

**When to use what:**
- Just adding? Use \`push\`
- Need to find something? Loop through with \`iter()\`
- Need to delete but don't care about order? Use \`swap_remove\``,
    },
    {
      title: 'Where you see this',
      content: `Vectors show up in tons of real contracts:

**Todo lists:**
A vector of todo items. Each has text, completion status, maybe a due date. Vector because you want them in a specific order.

**User posts:**
A social network might store posts as a vector, newest first. Adding a post = \`push\`. Viewing feed = iterate the vector.

**Token allowlists:**
Lists of approved addresses. Order doesn't matter much, but you need to check if someone is in the list.

**NFT token IDs:**
Some contracts store all token IDs in a vector to keep track of what's been minted.

**The pattern:**
Any time you have "a bunch of things" and you care about them as a list — that's a vector. When you instead need to look something up by a key (like "find alice's balance"), that's when you'd use a Map instead.`,
    },
    {
      title: 'Learn More',
      content: `Check out these resources:

- **Collections docs:** [docs.near.org/develop/contracts/collections](https://docs.near.org/develop/contracts/collections) — Official docs on all the collection types.

- **Vector API:** [docs.rs/near-sdk/latest/near_sdk/collections/struct.Vector.html](https://docs.rs/near-sdk/latest/near_sdk/collections/struct.Vector.html) — Full API reference.

- **Storage:** [nomicon.io/RuntimeSpec/Components/Storage](https://nomicon.io/RuntimeSpec/Components/Storage) — Deep dive into how NEAR storage works under the hood.

Vectors are your go-to for ordered data. Once you get comfortable with prefixes and the basic operations, you'll use them all the time!`,
    },
  ],

  'collections-map': [
    {
      title: 'What is a Map?',
      content: `A **Map** (sometimes called a dictionary or hash table) stores **key-value pairs**. Instead of accessing things by position (0, 1, 2), you access them by a key — like looking up a word in a dictionary.

Think of it like:
- A phone book: name → phone number
- A dictionary: word → definition
- A user table: user ID → profile

**When to use maps:**
- When you need to look things up by a specific identifier
- When order doesn't matter
- When you want fast lookups

**Our example:**
We store \`AccountId → u64\` — basically "each user's balance." If you give me an account ID, I can instantly tell you their balance. No searching through a list!

**The key insight:**
Maps give you O(1) lookups — instant, no matter how big. That's because of how they work internally (hash tables), but you just get to enjoy the speed.`,
    },
    {
      title: 'The storage prefix (again)',
      content: `Same deal as vectors: every map needs its own unique storage prefix.

\`\`\`rust
balances: UnorderedMap::new(b"b")
\`\`\`

The \`b"b"\` is our prefix. If we had another map (say, user profiles), we'd need a different prefix like \`b"p"\` for profiles.

**Quick rules:**
1. Each collection gets ONE prefix
2. Different collections = different prefixes
3. Pick something short and memorable (\`b"b"\` for balances, \`b"u"\` for users)
4. Once you pick it, don't change it (or your data becomes unreadable)

NEAR's storage is a key-value store, and prefixes are how different collections avoid stepping on each other's toes.`,
    },
    {
      title: 'Common operations',
      content: `Here's the map toolkit:

**Insert or update:**
\`\`\`rust
self.balances.insert(&account_id, &amount);
\`\`\`
If the key exists, it updates. If not, it creates new.

**Get:**
\`\`\`rust
self.balances.get(&account_id)  // Returns Option<u64>
\`\`\`
Returns \`None\` if the key doesn't exist. Returns \`Some(value)\` if it does.

**Remove:**
\`\`\`rust
self.balances.remove(&account_id);
\`\`\`
Deletes the entry entirely.

**Check existence:**
\`\`\`rust
self.balances.contains_key(&account_id)
\`\`\`
Returns true/false without returning the value.

**Get all keys or values:**
\`\`\`rust
self.balances.keys().collect::<Vec<_>>()
self.balances.values().collect::<Vec<_>>()
\`\`\`

**The pattern:**
Maps are perfect when you have "for each X, there's a Y" relationships. Each user has a balance. Each NFT has an owner. Each address has a permission level. Maps!`,
    },
    {
      title: 'Map vs Vector: when to use which?',
      content: `Here's the simple rule:

**Use a Vector when:**
- Order matters (first, second, third...)
- You need to iterate through everything
- You want a simple list

**Use a Map when:**
- You look things up by a specific key
- You don't care about order
- You have "for each X, there's a Y" relationships

**Real examples:**

| What you're storing | Use... |
|-------------------|--------|
| List of to-dos | Vector |
| User balances | Map |
| All posts in a feed (ordered) | Vector |
| User profiles | Map |
| Token IDs owned by someone | Vector (or Set) |
| NFT owner for each token | Map |

**Hybrid approach:**
Real contracts often use BOTH. For example:
- A Map: \`token_id → owner\` (quick lookup: who owns token #5?)
- A Vector: \`owner → Vec<token_id>\` (quick lookup: what tokens does alice own?)

Both work together!`,
    },
    {
      title: 'Learn More',
      content: `Resources for going deeper:

- **Collections overview:** [docs.near.org/develop/contracts/collections](https://docs.near.org/develop/contracts/collections) — Compare all collection types.

- **UnorderedMap docs:** [docs.rs/near-sdk/latest/near_sdk/collections/struct.UnorderedMap.html](https://docs.rs/near-sdk/latest/near_sdk/collections/struct.UnorderedMap.html) — Full API.

- **LookupMap (faster reads):** [docs.rs/near-sdk/latest/near_sdk/collections/struct.LookupMap.html](https://docs.rs/near-sdk/latest/near_sdk/collections/struct.LookupMap.html) — Simpler, slightly faster for read-mostly use cases.

- **Nomicon storage:** [nomicon.io/RuntimeSpec/Components/Storage](https://nomicon.io/RuntimeSpec/Components/Storage) — The nitty-gritty on how this all works.

Maps are essential for almost every real contract. Once you get comfortable with them, you'll see "key → value" relationships everywhere!`,
    },
  ],
};

export const getBasicsDetailedExplanation = (exampleId) =>
  basicsDetailedExplanations[exampleId] ?? null;
