export const pausableContractExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement an Emergency Stop mechanism for a contract.

**Requirements:**
- Store \`owner_id: AccountId\`, \`paused: bool\`, \`counter: u64\`
- In \`new()\`, set owner to \`env::current_account_id()\`, paused to false
- Implement \`pause()\`, \`unpause()\` - owner only
- Implement \`increment()\` - change method, panics if paused
- Implement \`get_counter()\` - view, works even when paused
- When paused, increment should return "Contract is paused" error

**Test:** Can pause, verify increment fails, unpause, verify it works!`,
  },
  {
    title: 'The Emergency Button!',
    content: `Stablecoin protocols pause transfers when vulnerabilities are discovered.

Sometimes you need to hit PAUSE. Like:
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
    title: 'War Story: Ronin Bridge — $625M Heist',
    content: `In March 2022, the Ronin Bridge (Axie Infinity's cross-chain bridge) was hacked for $625M — one of the biggest DeFi exploits ever.

**What happened:**
- Attackers compromised 5 of 9 validator keys (the root cause)
- No pause mechanism = no way to stop the drain once discovered
- Validators couldn't freeze the bridge even after detecting the breach
- $625M in ETH and USDC drained in a single transaction

**The consequence:**
- Axie Infinity's DAO treasury lost nearly all its funds
- Sky Mavis had to personally repay users $225M
- The team spent months recovering, eventually raising $125M to make users whole
- Faith in cross-chain bridges shattered

**The lesson:**
- The root cause was key compromise, not missing pause — but a pause mechanism would have limited the damage window
- Centralized bridges with few validators are honeypots
- ALWAYS have a pause mechanism for large-value bridges
- Multi-sig isn't enough — you need time-locks so users can exit during suspicious activity
- The cost of NOT having a pause button is orders of magnitude higher than the inconvenience of having one

This is why pausable exists — it's your emergency brake when everything goes wrong.`,
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
Transfers, withdrawals, state changes, and anything valuable.

**What should NOT be guarded?**
View methods are always safe to call since they don't modify anything, and public information doesn't need protection.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `An emergency stop button gives you a powerful brake. When something goes wrong, you can hit the button and stop everything instantly to buy time to fix the bug or respond to an attack. Factory workers feel safer knowing there's a way to protect themselves during a crisis.

But here's the catch: the button doesn't actually fix anything. It just stops the machines. If something already broke, hitting the button doesn't undo the damage. And the owner has all the power — they can keep the factory shut down forever if they go rogue or just decide not to restart it. False alarms are also costly, because every time you hit the button for the wrong reason, workers lose trust in management.

So treat pausable as a safety net, not a solution. You still need to fix the actual problem. And for more trust, consider time locks instead of instant pause.

**When NOT to use Pausable:** If your contract is purely informational (no funds, no state changes), or if you want true decentralization where no single person can freeze it - skip the pause button!`,
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
    title: 'Hints',
    content: `[Learn more about this topic →](https://docs.rs/near-contract-tools/latest/near_contract_tools/pause/index.html)`,
  },
];

export default pausableContractExplanation;
