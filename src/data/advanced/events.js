export const eventsExplanation = [
  {
    title: 'The Town Crier!',
    content: `Wallets listen for transfer events to update balances in real-time.

In old towns, the crier would shout important news for everyone to hear: "Hear ye! The king has announced..."

**Events** in NEAR are exactly that - your contract shouting news to the world!

When something important happens (a transfer, a purchase, a message), your contract can EMIT an event. Special tools called **indexers** listen for these and keep track.

Without events, apps would have to scan EVERY transaction ever made. With events? They just listen for the shouts!`,
  },
  {
    title: "The Naive Approach (Don't Do This!)",
    content: `Imagine trying to build a marketplace WITHOUT events:

\`\`\`rust
// BAD: No events, force everyone to scan!
struct BadMarketplace {
    items: Vector<Item>,
}

impl BadMarketplace {
    // Every time someone wants to know "what was sold lately?"
    // They have to scan EVERY transaction, ever!
    fn get_recent_sales(&self) -> Vec<Sale> {
        // Would need access to blockchain history
        // Scan millions of transactions...
        // Hope you have time to wait!
    }
}
\`\`\`

**The problem:**
- 10 transactions? Okay, maybe tolerable.
- 1,000 transactions? Getting slow...
- 1,000,000 transactions? Game over!

This is what apps did before events - scan everything. Expensive, slow, painful!`,
  },
  {
    title: 'How To Shout (The Easy Way)',
    content: `Modern NEAR contracts use a special macro:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::AccountId;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

// 100/100 NEP-297 Events – modern best practice
#[near(event_json(standard = "learn-near-message"))]
pub enum Event {
    #[event_version("1.0.0")]
    MessageUpdated {
        old_message: String,
        new_message: String,
        updated_by: AccountId,
    },

    #[event_version("1.0.0")]
    MessageDeleted {
        deleted_message: String,
        deleted_by: AccountId,
    },

    #[event_version("1.1.0")]
    MessageReported {
        reported_message: String,
        reason: String,
        reported_by: AccountId,
    },
}

#[near]
impl Contract {
    pub fn set_message(&mut self, new_message: String) {
        let old_message = self.message.clone();

        // Emit clean NEP-297 event (macro handles everything!)
        Event::MessageUpdated {
            old_message,
            new_message: new_message.clone(),
            updated_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();

        self.message = new_message;
    }
}
\`\`\`

**Why this rocks:**
1. \`#[near(event_json(...))]\` macro → auto-generates \`emit()\` method
2. \`#[event_version(...)]\` → versions each event variant
3. Type-safe → compiler catches mistakes
4. NEP-297 compliant → indexers love it!`,
  },
  {
    title: 'What Happens Behind The Scenes',
    content: `Here's the journey of an event:

1. Your contract calls \`Event::MessageUpdated { ... }.emit()\`
2. The macro converts it to special JSON
3. Written to the transaction receipt
4. Receipt gets processed
5. **Indexers** pick it up (they watch EVERY receipt!)
6. Indexers parse and store it
7. Your app queries the indexer instead of scanning

**The NEP-297 standard:**
\`\`\`json
{
  "standard": "learn-near-message",
  "version": "1.0.0",
  "event": "MessageUpdated",
  "data": { 
    "old_message": "Hello", 
    "new_message": "Hi there!",
    "updated_by": "user.near"
  }
}
}
\`\`\`

Consistent format = everyone can understand!`,
  },
  {
    title: 'Events vs Polling - When To Use Which?',
    content: `Quick guide:

**Use EVENTS when:**
- You need real-time updates
- Many users need the same data (wallets, marketplaces)
- You want to notify external systems
- Speed matters

**Use POLLING (direct contract calls) when:**
- You only need occasional data
- Exact on-chain data is critical
- The data changes rarely
- Simplicity is more important than speed

**The insight:** Events = push (be told when things happen). Polling = pull (go check yourself). Events scale better for popular dApps!`,
  },
  {
    title: 'The Design Insight',
    content: `**Why events work: Indexers!**

Events aren't stored directly on-chain in some special place. Instead:

1. Your contract emits an event via \`Event::MessageUpdated { ... }.emit()\`
2. The macro transforms it into NEP-297 JSON format
3. The event gets written to the transaction receipt
4. **Indexers** - special services - watch EVERY receipt
5. When they see your event, they parse and store it
6. Your frontend queries the indexer (fast!) instead of scanning chain (slow!)

It's like:
- Without indexers: every app personally watches the blockchain 24/7
- With indexers: one service watches, everyone subscribes to it

This separation of concerns is what makes blockchain usable!

> ⚠️ **Important:** Events are notifications, NOT state. If you need authoritative data, query the contract state directly. Events do NOT replace on-chain data!`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Events are powerful, but know the costs:

**EVENTS give you:**
- ⚡ Fast queries (from indexer, not chain)
- Real-time updates via subscriptions
- Scalability (one indexer serves many apps)

**EVENTS don't give you:**
- ❌ Direct on-chain access (go through indexer)
- ❌ Guaranteed delivery (indexer might miss)
- ❌ Historical data before event was added

**When events hurt you:**
- Need guaranteed accuracy? Query contract directly.
- Historical data from before you started emitting? Can't get it.
- Indexer downtime? You're blind until it recovers.

**The insight:** Events are the bridge between blockchain and real-time apps. But always have a fallback to direct contract calls when precision matters!

**When NOT to use Events:** If you're building something where every detail must be verified on-chain, or you only need occasional data - just poll the contract directly!`,
  },
  {
    title: 'Learn More',
    content: `[Learn more about this topic →](https://github.com/near/NEPs/blob/master/neps/nep-0297.md)`,
  },
];

export default eventsExplanation;
