export const BASICS_EXAMPLE_IDS = [
  'intro',
  'greeting',
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
      title: 'Welcome to NEARbyExample!',
      content: `Imagine a digital universe where you build things that last forever. That's NEARbyExample!

**What is this place?**
Think of NEARbyExample like a giant shared notebook that everyone can see, but only you can write in (for your own pages). Once you write something, it stays there forever. No one can rip out the page or change what you wrote.

Why should you care?
- Build apps that work like magic - no server needed
- Your code runs on computers all over the world
- Users don't need to trust you - the math protects them

**Your Learning Path:**

⚔️ **The Basics** — 8 examples to master first
🛡️ **Advanced** — 7 examples for brave explorers
🚧 **Under Development** — More coming soon!

You're about to build 15 mini-projects. Each one teaches something new. By the end, you'll know how to create real apps that thousands of people can use!`,
    },
    {
      title: 'Your Learning Quest',
      content: `Here's your path through NEARbyExample:

**⚔️ The Basics (you start here):**
1. Greeting - Meet your first robot friend
2. Contract Structure - Learn how to build a base
3. View Methods - Become a scout who observes
4. Change Methods - Start building and changing things
5. State Management - Get your first inventory
6. Input Validation - Meet the gatekeeper
7. Error Handling - Build your safety net
8. Collections: Vector - Unlock the treasure chest

**🛡️ The Advanced World (unlocked after basics):**
9. Collections: Map - Scoreboards & leaderboards
10. Events - The town crier
11. Owner Pattern - Castle guard
12. Role-Based Access - Guilds with different powers
13. Pausable Contract - The big red button
14. Multi-Signature - Need multiple heroes to agree
15. Upgrade Pattern - Magic code that evolves

**🚧 Under Development:**
- Collections & Data, NFTs, Cross-Contract
- Chain Signatures, Indexing, Advanced Patterns

Each step builds on the last. Have fun, adventurer!`,
    },
  ],
};

export const getBasicsDetailedExplanation = (exampleId) =>
  basicsDetailedExplanations[exampleId] ?? null;
