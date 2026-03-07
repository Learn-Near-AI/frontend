export const pausableContractExplanation = [
  {
    title: 'The Emergency Button!',
    content: `Sometimes you need to hit PAUSE. Like:
- A bug is found, need to stop attacks
- Doing maintenance
- Emergency upgrade

The **Pausable Pattern** adds a big red button to your contract. When paused:
- Certain operations stop working
- Everyone sees "temporarily disabled"
- You (the owner) fix things
- Then unpause!

It's like an emergency stop in a factory. You hope never to use it, but you're glad it's there.`,
  },
  {
    title: "The Naive Approach (Don't Do This!)",
    content: `What if there's no pause button?

\`\`\`rust
// BAD: No emergency stop!
struct BadContract {
    funds: u128,
    // No pause flag!
}

impl BadContract {
    pub fn transfer(&mut self, to: AccountId, amount: u128) {
        // If there's a bug, attackers keep draining funds
        // No way to stop!
        // Just watch your money disappear...
    }
}
\`\`\`

**The problem:**
- Bug found? Too bad, keep getting exploited
- Hacker draining funds? Can't stop them
- Need maintenance? Can't do it safely

This is why pausable contracts exist! When things go wrong, you need a way to stop the bleeding.`,
  },
  {
    title: 'The Pause Button',
    content: `Add a simple flag to your state:

\`\`\`rust
pub struct Contract {
    owner_id: AccountId,
    paused: bool,  // The emergency flag!
}
\`\`\`

**States:**
- \`paused: false\` = normal operation
- \`paused: true\` = emergency mode

Initialize as NOT paused:
\`\`\`rust
#[init]
pub fn new() -> Self {
    Self {
        owner_id: env::current_account_id(),
        paused: false,
    }
}
\`\`\``,
  },
  {
    title: 'Guarding Your Operations',
    content: `Now guard sensitive operations:

\`\`\`rust
pub fn transfer(&mut self, to: AccountId, amount: u128) {
    require!(!self.paused, "Contract is paused for safety");
    // ... transfer logic ...
}
\`\`\`

And the pause/unpause functions (owner-only):

\`\`\`rust
pub fn pause(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    self.paused = true;
}

pub fn unpause(&mut self) {
    require!(env::predecessor_account_id() == self.owner_id, "Not owner");
    self.paused = false;
}
\`\`\`

**What should be guarded?**
- ✅ Transfers, withdrawals
- ✅ State changes
- ✅ Anything valuable

**What should NOT be guarded?**
- ❌ View methods (reading is always safe)
- ❌ Public information`,
  },
  {
    title: 'When To Use Pausable Pattern',
    content: `Quick guide:

**Use PAUSABLE when:**
- Contract holds valuable assets
- Complex logic that could have bugs
- You need time to respond to attacks
- Regulatory compliance needs "stop button"

**The insight:** Pausable contracts give you time to react when things go wrong. Without it, you're helpless against bugs or attacks!`,
  },
  {
    title: 'The Design Insight',
    content: `**Why a simple flag works!**

The pause mechanism is elegantly simple:

\`\`\`rust
paused: bool  // true or false
\`\`\`

Every sensitive function checks this ONE flag:
\`\`\`rust
require!(!self.paused, "Paused!");
\`\`\`

When paused = true, the check fails and the function reverts. That's it!

**The magic:**
- Instant: no complex state changes
- Reversible: just set paused = false
- Cheap: single boolean check
- Clear: users know contract state

It's like a master switch. One toggle protects everything!`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Pausable is powerful, but know the costs:

**PAUSABLE gives you:**
- ✅ Emergency response capability
- ✅ Time to fix bugs
- ✅ User protection during crises

**PAUSABLE doesn't give you:**
- ❌ Automatic bug fixing (just stops usage)
- ❌ Loss recovery (pausing doesn't restore funds)
- ❌ Decentralized control (owner has the button)

**When pausable hurts you:**
- Owner goes rogue? They can freeze indefinitely!
- Pause stuck on? Users can't use contract!
- False alarm? Pausing damages trust.

**The insight:** Pausable is a safety net, not a solution. You still need to fix the actual problem. And consider time-locks instead of instant pause for more trust!

**When NOT to use Pausable:** If your contract is purely informational (no funds, no state changes), or if you want true decentralization where no single person can freeze it - skip the pause button!`,
  },
];

export default pausableContractExplanation;
