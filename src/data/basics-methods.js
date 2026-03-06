export const methodsDetailedExplanation = {
  'view-methods': [
    {
      title: 'Become The Scout',
      content: `In every good game, you need a **scout** - someone who looks around and reports what they see. That's what view methods are!

A view method only LOOKS at stuff. It never changes anything. It's like:
- Checking your inventory
- Reading a sign
- Looking at a map

Free to use. No cost. Just looking.

**What you'll build:**
A contract with state that can be read — with TWO view methods to show different ways to read data!`,
    },
    {
      title: 'The Contract With State',
      content: `First, let's set up the contract with some state to read:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    greeting: String,      // The message we want to store
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            greeting: "hello".to_string(),  // Default greeting
        }
    }
}
\`\`\`

**What's happening:**
- \`greeting: String\` = The contract remembers ONE message (stored on-chain!)
- In the constructor, we set a default value: "hello"
- Every time the contract loads, it remembers this greeting

**Why state matters:**
Hello World (the first lesson) had NO state — it always returned the same thing. That's great for learning, but boring! With state, your contract can remember things between calls — user data, votes, balances, anything!`,
    },
    {
      title: 'The Scout Code - View Methods',
      content: `Here's how your scout reads data:

\`\`\`rust
// View method #1: Return the whole greeting
pub fn get_greeting(&self) -> String {
    self.greeting.clone()
}

// View method #2: Return just the length
pub fn get_greeting_length(&self) -> u64 {
    self.greeting.len() as u64
}
\`\`\`

**The secret is in the &self:**
- \`&\` means "borrow" - use without taking ownership
- \`self\` means "the contract's state"

Together: "Borrow the contract state just for looking." That's why it's free - you're not making any changes!

The \`.clone()\` is just Rust being careful. It means "give me a copy" so we don't break anything. For \`.len()\`, we don't need clone because it just reads the length (a number), not the actual data.`,
    },
    {
      title: 'View vs Change - Big Difference',
      content: `This is super important:

**VIEW methods:**
- Use \`&self\` (one ampersand)
- Only read data
- Free to call (no gas fees!)
- \`pub fn get_something(&self)\`

**CHANGE methods:**
- Use \`&mut self\` (one ampersand + mut to allow changes)
- Modify data
- Cost a tiny bit of NEAR (gas)
- \`pub fn set_something(&mut self)\`

The \`mut\` means "allow changes." Without it, Rust says "nope, can't change anything!"

This difference is huge. View methods are like checking a map (free). Change methods are like picking up an item (costs something because the game world changed).

**Why does this matter?**
NEAR (and other blockchains) separate these for good reasons:
1. **Saving money** - Reading data is free because it doesn't bother the validators
2. **Speed** - View calls happen instantly, no waiting for blockchain
3. **Trust** - Anyone can verify what's stored without paying

Most apps let you view a LOT for free, and only charge when you change something. That's why dApps feel snappy!`,
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

They cost a tiny bit of NEAR (like gas in a car) because you're actually changing something on the blockchain.

**What you'll build:**
A contract with TWO change methods - one to set a greeting and one to add to it!`,
    },
    {
      title: 'The Contract Setup',
      content: `First, let's set up the contract with state to modify:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    greeting: String,      // The message we want to change
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            greeting: "hello".to_string(),
        }
    }

    // View method - read the greeting (free!)
    pub fn get_greeting(&self) -> String {
        self.greeting.clone()
    }
}
\`\`\`

Notice we have a view method (\`get_greeting\`) to READ the state. Every good contract should let users read what they need!`,
    },
    {
      title: 'The Builder Code - Change Methods',
      content: `Here's a change method:

\`\`\`rust
// Change method #1: Set the entire greeting
pub fn set_greeting(&mut self, greeting: String) {
    self.greeting = greeting;
}

// Change method #2: Add to the existing greeting
pub fn add_to_greeting(&mut self, suffix: String) {
    self.greeting.push_str(&suffix);
}
\`\`\`

**Key differences from view methods:**
- \`&mut self\` - "I need to CHANGE things" (mut = mutable)
- \`greeting: String\` - Takes a parameter from the caller
- This example doesn't return anything, but change methods CAN return values if needed

When someone calls \`set_greeting\`, they supply a new greeting, and BAM - the contract updates!

**Why does this matter?**
Change methods are how users interact with your contract. They can update balances, mint NFTs, vote on proposals - anything that modifies state.`,
    },
    {
      title: 'What Happens When You Call It',
      content: `Here's the journey of a change method call:

1. **Your wallet signs** the transaction (proves it's you)
2. **NEAR finds** the contract on the blockchain
3. **The contract wakes up** and loads its memory (state)
4. **Your code runs** - changes the greeting
5. **NEAR saves** the new memory back to the blockchain
6. **Receipt arrives** - proof it worked

All of this happens in seconds. And the validator computers that run this get a small fee. Fair trade!

**The #[near(contract_state)] magic:**
You might wonder how NEAR saves your data. The \`#[near(contract_state)]\` macro automatically handles serializing your state to bytes for storage, and deserializing it back when needed. You don't need to worry about it!`,
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
};

export const getMethodsDetailedExplanation = (exampleId) =>
  methodsDetailedExplanation[exampleId] ?? null;
