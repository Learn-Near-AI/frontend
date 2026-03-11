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

    // This is a NEW event added in v1.1.0 — old indexers gracefully ignore it!
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

        //  CRITICAL: Emit BEFORE state change!
        // Events are fire-and-forget — if you panic after emit(),
        // the event is already written to the receipt!
        Event::MessageUpdated {
            old_message,
            new_message: new_message.clone(),
            updated_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();

        // NOW update state — if this panics, indexer still has the event
        self.message = new_message;
    }
}
\`\`\`

**Why this rocks:**
1. \`#[near(event_json(...))]\` macro → auto-generates \`emit()\` method
2. \`#[event_version(...)]\` → versions each event variant
3. Type-safe → compiler catches mistakes
4. NEP-297 compliant → indexers love it!

>  **Fire-and-forget warning:** Events are emitted BEFORE your function completes. If your code panics at line 20, the event at line 15 is ALREADY in the receipt. Your indexer will record "MessageUpdated" but the state never changed. Always emit first, modify state second.`,
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
\`\`\`

Consistent format = everyone can understand!`,
  },
  {
    title: 'Consuming Events (The Missing Link)',
    content: `Here's where most tutorials stop — but here's what happens NEXT:

**JavaScript indexer that reads your events:**
\`\`\`javascript
// This is what your indexer does when it sees a NEAR receipt
function processReceipt(receipt) {
  // Look for event JSON in the receipt logs
  const logs = receipt.receipt.outcome.logs;
  
  for (const log of logs) {
    try {
      const event = JSON.parse(log);
      
      if (event.standard === 'learn-near-message') {
        // Version-aware parsing!
        if (event.version === '1.0.0' && event.event === 'MessageUpdated') {
          const { old_message, new_message, updated_by } = event.data;
          console.log(\`\${updated_by} changed message: \${old_message} → \${new_message}\`);
          // Store in your database...
        }
        
        // v1.1.0+ indexer handles new event types
        if (event.version === '1.1.0' && event.event === 'MessageReported') {
          // Gracefully ignore or handle new event
          console.log(\`Report: \${event.data.reason}\`);
        }
      }
    } catch (e) {
      // Not an event, skip
    }
  }
}
\`\`\`

**Frontend queries the indexer, not the chain:**
\`\`\`javascript
// React component subscribing to events
useEffect(() => {
  subscribe('MessageUpdated', (event) => {
    setMessages(prev => [...prev, event.data]);
  });
}, []);
\`\`\`

This is the full loop: Contract emits → Receipt → Indexer parses → Frontend subscribes.`,
  },
  {
    title: 'The Versioning Trap',
    content: ` **This is the gotcha that kills production systems.**

Versioning exists because developers change events and break indexers silently.

**The scenario:**
\`\`\`rust
// You deploy v1.0.0
#[event_version("1.0.0")]
MessageUpdated {
    old_message: String,
    new_message: String,
}

// Later, you refactor (without bumping version!)
#[event_version("1.0.0")]  // Still 1.0.0 — BIG MISTAKE
MessageUpdated {
    previous_message: String,  // Renamed!
    new_message: String,
}
\`\`\`

**What breaks:**
\`\`\`json
// Old indexer expects:
{ "old_message": "Hello", "new_message": "Hi" }

// But receives:
{ "previous_message": "Hello", "new_message": "Hi" }

// Result: old_message is UNDEFINED → indexer crashes or stores null
\`\`\`

**The fix:**
\`\`\`rust
#[event_version("2.0.0")]  // Bump the version!
MessageUpdated {
    previous_message: String,  // Now safe — different version
    new_message: String,
}
\`\`\`

>  **Rule:** If you change the shape of an event — rename, add, or remove fields — you MUST bump the version. Old indexers ignore unknown versions gracefully. They crash on changed field names.`,
  },
  {
    title: 'Why MessageReported is 1.1.0',
    content: `Look at this line in the code:

\`\`\`rust
#[event_version("1.1.0")]
MessageReported {
    reported_message: String,
    reason: String,
    reported_by: AccountId,
},
\`\`\`

**This is exactly why versioning exists.**

You deployed v1.0.0 with MessageUpdated and MessageDeleted. Months later, you add a new feature: MessageReported. 

**Without versioning:**
- Old indexers try to parse MessageReported
- They don't know the fields
- They crash or store garbage

**With versioning (1.1.0):**
- Old indexers see version "1.1.0"
- They don't understand it → **gracefully skip it**
- Your new v1.1.0 indexer picks it up
- Everyone keeps working!

That's the whole point: **versioning lets you add new events without breaking old indexers.** The version field isn't decoration — it's a compatibility contract.`,
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

>  **Important:** Events are notifications, NOT state. If you need authoritative data, query the contract state directly. Events do NOT replace on-chain data!`,
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
    title: 'Benchmark: Solidity Events vs NEAR',
    content: `**How Solidity handles events:**

Solidity has native event emission that looks similar:

\`\`\`solidity
// Solidity
emit Transfer(msg.sender, to, amount);
\`\`\`

Indexed fields go into a bloom filter for searching:

\`\`\`solidity
event Transfer(address indexed from, address indexed to, uint256 amount);
\`\`\`

**Key differences:**
- **NEAR:** NEP-297 standard, versioned enums, auto-serialization
- **Solidity:** Indexed fields = bloom filter optimization, manual topics

**When Solidity wins:**
- EVM ecosystem compatibility
- Many existing tools (Ethers.js, Hardhat)

**When NEAR wins:**
- Versioned events (1.0.0, 1.1.0) = easy migrations
- Type-safe event definitions
- Built-in standard = indexers work out of box`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A town crier is how you bridge blockchain with real time applications. The big win is speed: you listen for the shouts, not search through every record yourself, so it's way faster. You get real time updates through subscriptions, and one town crier can serve many citizens, so it scales well.

But you're not reading directly from the source. You go through the crier, who might miss an announcement or take a break. And you have no historical news from before the crier started working. If the crier has a day off, you're out of the loop until they come back.

So use events for real time feeds and dashboards. But always have a fallback to direct contract calls when precision matters. If you're building something where every detail must be verified on chain, or you only need occasional data, just poll the contract directly.

**When NOT to use Events:** If you're building something where every detail must be verified on-chain, or you only need occasional data — just poll the contract directly!`,
  },
  {
    title: "Don't Do This!",
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
    title: 'Learn More',
    content: `[Learn more about this topic →](https://github.com/near/NEPs/blob/master/neps/nep-0297.md)`,
  },
];

export default eventsExplanation;
