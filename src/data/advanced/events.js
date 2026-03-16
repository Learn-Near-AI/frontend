export const eventsExplanation = [
  {
    title: 'The Town Crier!',
    content: `Wallets listen for transfer events to update balances in real-time.

In old towns, the crier would shout important news for everyone to hear: "Hear ye! The king has announced..."

**Events** in NEAR are exactly that - your contract shouting news to the world!

When something important happens (a transfer, a purchase, a message), your contract can EMIT an event. Special tools called **indexers** listen for these and keep track.

Without events, apps would have to scan EVERY transaction ever made. With events? They just listen for the shouts!

This is honestly one of the most underappreciated parts of blockchain development. Without events, you're basically asking every single app to personally watch the entire chain 24/7. That's not scalable, that's not practical, that's just painful. Events fix that.`,
  },
  {
    title: 'How To Shout (The Easy Way)',
    content: `Modern NEAR contracts use a special macro — it's clean, type-safe, and NEP-297 compliant out of the box:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;
use near_sdk::AccountId;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    message: String,
}

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
        
        // Update state first
        self.message = new_message.clone();

        // Then emit event AFTER state change
        // This ensures indexers only record events for successful state changes
        Event::MessageUpdated {
            old_message,
            new_message,
            updated_by: near_sdk::env::predecessor_account_id(),
        }
        .emit();
    }
}
\`\`\`

This is so much better than the old way. Previously you had to manually serialize JSON strings. Now? The macro does it all for you. Type-safe, versioned, auto-generated emit() method. Just... define the enum and go.

One more thing: ALWAYS emit AFTER state changes. If you emit first and then your code panics, the event is already written but the state didn't change. Your indexer just recorded garbage. Emit after. Always.`,
  },
  {
    title: 'What Happens Behind The Scenes',
    content: `Here's the journey of an event:

1. Your contract calls \`Event::MessageUpdated { ... }.emit()\`
2. The macro converts it to JSON
3. Written to the transaction receipt
4. Receipt gets processed
5. **Indexers** pick it up (they watch EVERY receipt!)
6. Indexers parse and store it
7. Your app queries the indexer instead of scanning

The NEP-297 standard is what makes this work — it's just JSON but everyone's agreed on the format:
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

Standardization means you don't have to wonder "how do I parse this?" Every indexer knows the format. That's the power of NEP-297.`,
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
    // NEP-297 events are prefixed with "EVENT_JSON:"
    if (!log.startsWith('EVENT_JSON:')) continue;
    
    try {
      const event = JSON.parse(log.slice('EVENT_JSON:'.length));
      
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

> ⚠️ Important: NEP-297 events are prefixed with \`EVENT_JSON:\` in the logs. Your indexer MUST check for this prefix or it'll try to parse non-JSON lines and fail!

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
    content: `This is the gotcha that kills production systems. Seriously. I've seen it happen.

Versioning exists because developers change events and break indexers silently. Here's how it goes wrong:

You deployed v1.0.0 with MessageUpdated. Months later, you refactor the code — rename "old_message" to "previous_message" because it reads better. You forgot to bump the version, so it's still 1.0.0.

Now your old indexer is expecting \`old_message\` but receives \`previous_message\`. What happens? It either crashes or stores null. Either way, your dashboard is broken and you have no idea why.

**The scenario:**
\`\`\`rust
// You deploy v1.0.0
#[event_version("1.0.0")]
MessageUpdated {
    old_message: String,
    new_message: String,
}

// Later, you refactor (without bumping version!)
#[event_version("1.0.0")]  // Still 1.0.0 — FORGOT TO BUMP
MessageUpdated {
    previous_message: String,  // Renamed!
    new_message: String,
}
\`\`\`

**The fix is simple:**
\`\`\`rust
#[event_version("2.0.0")]  // Bump the version!
MessageUpdated {
    previous_message: String,
    new_message: String,
}
\`\`\`

Rule: Change the shape of an event (rename, add, remove fields)? Bump the version. Old indexers ignore unknown versions gracefully. They crash on changed field names.`,
  },
  {
    title: 'Why MessageReported is 1.1.0',
    content: `Look at the code again:

\`\`\`rust
#[event_version("1.1.0")]
MessageReported {
    reported_message: String,
    reason: String,
    reported_by: AccountId,
},
\`\`\`

This is exactly why versioning exists. You deployed v1.0.0 with MessageUpdated and MessageDeleted. Months later, you add a new feature: MessageReported.

Without versioning, your old indexers try to parse this new event they don't understand. Crash. Garbage data. Broken dashboards.

With versioning (1.1.0)? Old indexers see "1.1.0" — don't understand it — skip it gracefully. Your new v1.1.0 indexer picks it up. Everyone keeps working.

That's the whole point: versioning lets you ADD new events without breaking old indexers. The version field isn't decoration — it's a contract.`,
  },
  {
    title: 'The Design Insight',
    content: `Here's the thing most tutorials miss: events aren't stored on-chain in some special place. They're just... JSON in a receipt.

The flow:
1. Your contract calls \`Event::MessageUpdated { ... }.emit()\`
2. Macro transforms to NEP-297 JSON
3. Written to transaction receipt
4. **Indexers** — special services — watch EVERY receipt
5. They parse and store it
6. Frontend queries the indexer instead of scanning chain

It's like the difference between:
- Without indexers: every app personally watches the blockchain 24/7 (exhausting)
- With indexers: one service watches, everyone subscribes to it (sustainable)

One important thing to remember: events are notifications, NOT state. If you need authoritative data, query the contract directly. Events complement on-chain data — they don't replace it.`,
  },
  {
    title: 'Events vs Polling - When To Use Which?',
    content: `Quick guide:

Use EVENTS when:
- You need real-time updates
- Many users need the same data (wallets, marketplaces)
- You want to notify external systems

Use POLLING (direct contract calls) when:
- You only need occasional data
- Exact on-chain data is critical
- The data changes rarely

Simple way to think about it: Events = push (be told when things happen). Polling = pull (go check yourself). Events scale way better for popular dApps!`,
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
    fn get_recent_sales(&self) -> Vec<Sale> {
        // Would need access to blockchain history
        // Scan millions of transactions...
        // Hope you have time to wait!
    }
}
\`\`\`

The problem is obvious:
- 10 transactions? Fine.
- 1,000 transactions? Getting slow...
- 1,000,000 transactions? Game over.

This is literally what apps did before events existed. Scan everything. Expensive. Slow. Painful. Don't do this.`,
  },
  {
    title: 'Hints',
    content: `[Learn more about this topic →](https://github.com/near/NEPs/blob/master/neps/nep-0297.md)`,
  },
];

export default eventsExplanation;
