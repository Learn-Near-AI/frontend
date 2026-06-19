export const votingSystemExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a voting system using UnorderedSet.

**Requirements:**
- Store \`votes_yes: u64, votes_no: u64, voters: UnorderedSet<AccountId>\`
- Implement \`vote(choice: bool)\` — prevents double-voting, records choice
- Implement \`get_results()\` — returns (votes_yes, votes_no)
- Use \`require!\` to prevent double-voting
- Log the vote with \`env::log_str\`

**Test:** Each account can only vote once!`,
  },
  {
    title: 'The Ballot Box!',
    content: `Permission systems use UnorderedSet to track authorized members.

Imagine a town hall meeting. Everyone gets one vote. The ballot box ensures no one votes twice.

That's your **Voting System** contract!

The key difference from maps: with \`UnorderedSet\`, we don't store VALUES — we just store which accounts are in the set. It's like a guest list. Either you're on the list (you've voted) or you're not.

This is the perfect use case for \`UnorderedSet<AccountId>\`. We don't need to store how someone voted in the set — we just need to track WHO voted. The actual vote tally (yes/no) is stored as simple counters.`,
  },
  {
    title: 'The Voting Structure',
    content: `Simple and effective:

\`\`\`rust
#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
}
\`\`\`

**Why UnorderedSet?**
- \`voters.contains(&account)\` — check if someone already voted (O(1))
- \`voters.insert(&account)\` — record a voter
- No value to store — just membership tracking

**Simple counters for results:**
- \`votes_yes: u64\` — incremented for "yes" votes
- \`votes_no: u64\` — incremented for "no" votes

Split counters are actually more efficient than storing per-vote choices. If we stored (AccountId → bool) in a map, we'd need to iterate all entries to count. With counters, \`get_results\` is O(1) — instant.`,
  },
  {
    title: 'Casting a Vote',
    content: `One person, one vote — enforced by the contract:

\`\`\`rust
pub fn vote(&mut self, choice: bool) {
    let voter = env::predecessor_account_id();
    require!(!self.voters.contains(&voter), "Already voted");

    self.voters.insert(&voter);
    if choice {
        self.votes_yes += 1;
    } else {
        self.votes_no += 1;
    }

    env::log_str(&format!("Vote cast: {}", choice));
}
\`\`\`

**The flow:**
1. Get the voter's identity (\`predecessor_account_id()\`)
2. Check they haven't voted yet (\`require!\`)
3. Record them in the set (\`voters.insert\`)
4. Increment the right counter
5. Log the event

**Why log?** \`env::log_str\` writes to the transaction receipt. Off-chain indexers can watch for these logs to build real-time dashboards showing vote counts as they happen.

**Critical detail:** The \`require!\` check MUST come before any state changes. If you increment the counter first and THEN check, a double-voter would corrupt your tally. Always validate first, then modify — never the other way around.`,
  },
  {
    title: 'Reading Results',
    content: `View methods return results instantly and for free:

\`\`\`rust
pub fn get_results(&self) -> (u64, u64) {
    (self.votes_yes, self.votes_no)
}
\`\`\`

**That's it!** Two simple numbers. No iteration. No collection scanning. Just return the counters.

**Compare with a naive approach:**
\`\`\`rust
// BAD: Storing individual votes in a map
pub fn get_results(&self) -> (u64, u64) {
    let yes = self.votes.iter()
        .filter(|(_, choice)| *choice)
        .count() as u64;
    let no = self.votes.len() - yes;
    (yes, no)  // O(n) — slow for large elections!
}
\`\`\`

The counter approach is O(1) — always instant. The iteration approach is O(n) and gets slower with every voter.

Pro tip: If you need detailed per-voter records (for audits, transparency), store them in a map in ADDITION to the counters. The counters give you fast results, the map gives you auditability.`,
  },
  {
    title: 'The Design Insight',
    content: `**UnorderedSet is the unsung hero of NEAR collections.**

When do you use each collection?

- **Vector** — ordered list (chat messages, todo IDs, logs)
- **UnorderedMap** — key-value storage (profiles, balances, settings)
- **UnorderedSet** — membership tracking (voters, admins, whitelist)

Sets are surprisingly versatile. Beyond voting:
- **Whitelist** — \`whitelist.contains(&caller)\` for early access
- **Role tracking** — \`admins.contains(&caller)\` for RBAC
- **Used items** — \`claimed_nfts.contains(&token_id)\` to prevent double-claiming
- **Blacklist** — \`blocked_users.contains(&caller)\` for moderation

Any time you need to answer "is this thing in the group?", reach for a Set. It's the simplest, most gas-efficient way to track membership.`,
  },
  {
    title: 'Voting Extensions',
    content: `Ways to make your voting system more powerful:

**Weighted voting (one token = one vote):**
\`\`\`rust
pub fn vote(&mut self, choice: bool, amount: u64) {
    let voter = env::predecessor_account_id();
    let balance = self.balances.get(&voter).unwrap_or(0);
    require!(balance >= amount, "Insufficient voting power");
    self.votes_yes += amount * choice as u64;
    self.votes_no += amount * (!choice) as u64;
}
\`\`\`

**Timed voting (close after deadline):**
\`\`\`rust
pub fn vote(&mut self, choice: bool) {
    require!(
        env::block_timestamp() < self.deadline,
        "Voting is closed"
    );
    // ...rest of vote logic
}
\`\`\`

**Delegated voting:**
Allow account A to delegate their vote to account B. Store \`delegations: UnorderedMap<AccountId, AccountId>\`. When B votes, they vote with A's weight too.`,
  },
  {
    title: 'UnorderedSet vs UnorderedMap - When To Use Which?',
    content: `Quick guide:

**Use UnorderedSet when:**
- You only need to track membership (is X in the group?)
- No extra data per member
- Examples: voters, whitelist, blacklist

**Use UnorderedMap when:**
- Each member has associated data
- You need to store values per key
- Examples: profiles (name+bio), balances (amount)

**Memory tradeoff:**
- Set: stores just the key (cheaper per entry)
- Map: stores key + value (more expensive per entry)

If you're tracking 10,000 members and need \`contains?\` checks, a Set costs half the storage of a Map with dummy values. Choose the right tool.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A voting contract gives you a tamper-proof ballot box. Every vote is recorded on-chain forever. No one can stuff the ballot box, delete votes, or vote twice. That level of transparency and integrity is the whole point of on-chain governance.

But it comes with tradeoffs. Every vote costs gas, which can be expensive for large-scale elections. The vote is public — there's no secret ballot on a transparent blockchain. And there's no voter verification beyond holding a NEAR account. You can't ensure "one real person, one vote" without additional identity infrastructure.

And there's a practical limitation: voting can't be changed once cast. No accidental vote corrections, no changing your mind. On-chain is permanent.

**When NOT to use on-chain voting:** For private votes, for free-form polls with many options, or for situations where voter privacy is legally required. When you need the opposite of transparency.`,
  },
  {
    title: "Don't Do This!",
    content: `A voting system that lets people vote multiple times:

\`\`\`rust
// BAD: No double-voting protection!
pub fn vote(&mut self, choice: bool) {
    // Whoops — no require! check!
    if choice {
        self.votes_yes += 1;
    } else {
        self.votes_no += 1;
    }
    // Mallory calls this 1000 times and rigs the election!
}
\`\`\`

**The problem:** Without the \`require!\` check, anyone can vote any number of times. The \`UnorderedSet\` is completely unused — it's just taking up storage for no reason.

**Always check membership before counting a vote.** The validate-before-mutate pattern is non-negotiable for secure contracts.

**Another mistake:** Not using a Set at all:
\`\`\`rust
// BAD: Using a vector to track voters
pub fn vote(&mut self, choice: bool) {
    let voter = env::predecessor_account_id();
    require!(!self.voters.contains(&voter), "Already voted");  // O(n)!
    self.voters.push(voter);
    // ...
}
\`\`\`
\`.contains\` on a Vector is O(n) — it scans the entire list. With 100,000 voters, each vote check gets slower and slower. UnorderedSet.contains is O(1). Always.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a voting contract using UnorderedSet where each account can only vote once.

**Code Snippet:**
\`\`\`rust
pub fn vote(&mut self, choice: bool) {
    // TODO: Get the voter
    // TODO: Check they haven't voted yet
    // TODO: Record the voter in the set
    // TODO: Increment the right counter
    // TODO: Log the vote
}

pub fn get_results(&self) -> (u64, u64) {
    // TODO: Return (votes_yes, votes_no)
}
\`\`\`

**Solution Hints:**
- Voter: \`let voter = env::predecessor_account_id()\`
- Check: \`require!(!self.voters.contains(&voter), "Already voted")\`
- Record: \`self.voters.insert(&voter)\`
- Count: \`if choice { self.votes_yes += 1 } else { self.votes_no += 1 }\`
- Log: \`env::log_str(&format!("Vote cast: {}", choice))\`
- Results: \`(self.votes_yes, self.votes_no)\`

**Extension:** Add \`get_voter_count()\` returning the total number of voters.

[Learn more about collections →](https://docs.near.org/smart-contracts/anatomy/collections)`,
  },
];

export default votingSystemExplanation;
