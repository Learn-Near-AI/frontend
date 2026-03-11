export const greetingDetailedExplanation = {
  greeting: [
    {
      title: 'Meet Your Robot Friend!',
      content: `Every smart contract starts with a simple greeting function.

Time to meet **Beep** - your first NEAR robot!

Beep lives in NEARbyExample. She's very simple - she only knows how to say one thing: "Greetings, Adventurer!" Every time someone asks her what's up, she replies the same way.

**Why does this matter?**
This is the "Hello World" of smart contracts. It's the simplest thing you can build. But don't let that fool you - Beep has superpowers:

- She lives forever on the blockchain
- Anyone in the world can talk to her
- She doesn't need anyone to run a server for her

Your journey starts here. Let's make Beep say something cool!`,
    },
    {
      title: 'Your Turn!',
      content: `Here's your mission:

1. Find the line that says \`"Greetings, Adventurer!".to_string()\`
2. Change it to your own greeting
3. Click the Run button
4. See what Beep says now!

**Ideas for greetings:**
- "Welcome to my app!"
- "Greetings, traveler!"
- "Beep boop - I'm a robot!"

Go ahead. Make it yours!`,
    },
    {
      title: 'The Constructor - Waking Up Beep',
      content: `When you first deploy a contract, you need to set things up. That's what the **constructor** does:

\`\`\`rust
#[near]
impl Contract {
    #[init]                                    // "This sets up the contract"
    pub fn new() -> Self {
        Self {}                                // Create an empty brain
    }
}
\`\`\`

**What's happening:**
- \`#[init]\` = Marks this as the constructor - must be called ONCE when deploying
- \`pub fn new() -> Self\` = Creates and returns the contract instance
- \`Self {}\` = The empty struct we defined earlier

**Why does this matter?**
In later lessons, you'll add real state here - like setting an owner, initial balance, or default message. The constructor is your one chance to set up the contract's initial values.`,
    },
    {
      title: 'Greeting - The View Method',
      content: `Now for the fun part - Beep's greeting!

\`\`\`rust
// View method - read-only, free to call (no gas fees!)
pub fn greet(&self) -> String {
    "Greetings, Adventurer!".to_string()
}
\`\`\`

**Breaking it down:**
- \`pub fn greet\` = The function name (what you call from outside)
- \`&self\` = Read-only! This method can LOOK at data but can't CHANGE anything
- \`-> String\` = Returns text
- \`"Greetings, Adventurer!".to_string()\` = The actual words she says

**The View Method Superpower:**
Methods with \`&self\` are called "view methods." They're special because:
- They're **free** - no gas fees, no wallet needed
- They're **read-only** - can't change blockchain state
- Anyone can call them - like peeking through a window

In the code, you know it's a view method because of \`&self\` (one ampersand). This means "read-only, no changes to the blockchain."

Try changing what Beep says! Click the code, change "Greetings, Adventurer!" to something else, and hit Run. You've already made your first change to a blockchain app!`,
    },
    {
      title: 'The Contract Brain',
      content: `Every contract needs a brain. In Rust, we call it a \`struct\`:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]      // "This is the contract's memory"
#[derive(PanicOnDefault)]      // Safety: panics if deployed without init
pub struct Contract {}          // The brain - empty for now!
\`\`\`

> **Note:** You'll see \`use near_sdk::...\` at the top of each code snippet. These imports bring in the NEAR SDK types you need. Don't worry about memorizing them — you'll see them repeated often enough that they'll become familiar!

**What's happening:**
- \`pub struct Contract {}\` = The contract's brain (currently empty)
- \`#[near(contract_state)]\` = Tells NEAR "save this struct's data on-chain"
- \`#[derive(PanicOnDefault)]\` = Safety net! If someone tries to use the contract without calling \`new()\`, it panics. This prevents accidentally using an uninitialized contract.

**Why does this matter?**
Think of it like a car without a key. You don't want someone driving it by accident! This pattern ensures the contract is properly set up before anyone can use it.`,
    },
    {
      title: 'Learn More',
      content: `[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy)`,
    },
  ],
};

export const getGreetingDetailedExplanation = (exampleId) =>
  greetingDetailedExplanation[exampleId] ?? null;
