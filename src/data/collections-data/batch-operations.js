export const batchOperationsExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement batch operations with gas optimization.

**Requirements:**
- Store \`items: Vector<String>\`
- Define \`MAX_BATCH: u32 = 100\`
- Implement \`add_many(items: Vec<String>)\` — validates batch size, inserts all items
- Implement \`get_all()\` — returns all items
- Implement \`len()\` — returns item count

**Test:** Adding more than MAX_BATCH items must fail!`,
  },
  {
    title: 'The Assembly Line!',
    content: `Gas optimization is critical for contract scalability.

Think of a factory assembly line. Adding items one-by-one is like sending each widget down the line separately — tons of setup overhead. But batching them together? One shipment, one processing step, way more efficient.

That's **Batch Operations**!

The key insight: multiple operations in a single transaction cost WAY less gas than the same operations spread across many transactions. The base transaction cost is paid once instead of N times.

This is critical for any contract that processes bulk data — token mints, NFT drops, list imports, data migrations.`,
  },
  {
    title: 'The Batch Structure',
    content: `Simple and focused:

\`\`\`rust
const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
}
\`\`\`

**Just a Vector!** No map needed here — we're just maintaining an ordered list of strings. Batch operations shine when you need to insert or process many items in one go.

**\`MAX_BATCH\`** is a safety constant — a hard limit on how many items can be processed in a single transaction. Why? Because:
1. Each item costs gas
2. A malicious user could pass 10,000 items and drain your contract's prepaid gas
3. Even legitimately, huge batches risk exceeding the block gas limit

Set \`MAX_BATCH\` based on your contract's gas budget. 100 is a safe starting point. Test with your specific contract to find the sweet spot.`,
  },
  {
    title: 'The Batch Insert',
    content: `Inserting multiple items atomically:

\`\`\`rust
pub fn add_many(&mut self, items: Vec<String>) {
    require!(items.len() <= MAX_BATCH as usize, "Batch too large");
    for item in items {
        self.items.push(&item);
    }
}
\`\`\`

**Why this is better than individual calls:**
- **One transaction fee** instead of N
- **One signature** instead of N
- **Atomic** — all insert or none (no partial failure)
- **Faster** — no waiting for N separate blocks

**Gas savings:**
- Single \`add_item\` call: ~0.001 NEAR (base fee + storage + execution)
- \`add_many\` with 100 items: ~0.003 NEAR (one base fee + 100x storage)
- 100 individual calls: ~0.1 NEAR (100x base fee!)

That's a 33x savings for batching! The base transaction fee dominates for small operations, so batching is hugely beneficial.

**Storage costs:** Each \`.push\` writes to blockchain storage, which costs NEAR (storage staking). The storage cost is the same whether batched or individual — but the transaction fees are drastically different.`,
  },
  {
    title: 'Reading Batch Data',
    content: `View methods for checking state:

\`\`\`rust
pub fn get_all(&self) -> Vec<String> {
    self.items.iter().collect()
}

pub fn len(&self) -> u64 {
    self.items.len()
}
\`\`\`

**Gas warning:** \`get_all\` collects ALL items into a Vec. For small lists (< 1000), this is fine. For large lists with millions of items, you'd need pagination.

**Pagination version (for scale):**
\`\`\`rust
pub fn get_items(&self, from_index: u64, limit: u64) -> Vec<String> {
    let from = from_index as usize;
    let to = std::cmp::min(from + limit as usize, self.items.len() as usize);
    (from..to).filter_map(|i| self.items.get(i)).collect()
}
\`\`\`

This loads only one page at a time. Your frontend calls \`get_items(0, 50)\`, then \`get_items(50, 50)\`, etc. Efficient even for massive datasets.`,
  },
  {
    title: 'Gas Optimization Patterns',
    content: `Beyond simple batching, here are advanced gas-saving techniques:

**1. Batch reads with callbacks:**
\`\`\`rust
// Single call that reads 100 items
pub fn get_batch(&self, indices: Vec<u64>) -> Vec<Option<String>> {
    indices.iter().map(|i| self.items.get(*i)).collect()
}
\`\`\`

**2. Conditional batching (process only if needed):**
\`\`\`rust
pub fn add_many_if_unique(&mut self, items: Vec<String>) {
    require!(items.len() <= MAX_BATCH as usize, "Batch too large");
    for item in items {
        if !self.items.iter().any(|i| i == item) {
            self.items.push(&item);
        }
    }
}
\`\`\`

**3. Storage refund optimization:**
When deleting items, storage is refunded. Batch deletes can recover significant NEAR:
\`\`\`rust
pub fn delete_many(&mut self, indices: Vec<u64>) {
    require!(indices.len() <= MAX_BATCH as usize, "Batch too large");
    // Sort descending so swap_remove doesn't shift earlier indices
    let mut sorted = indices.clone();
    sorted.sort_unstable_by(|a, b| b.cmp(a));
    for i in sorted {
        // Storage refund returned to caller
        self.items.swap_remove(i);
    }
}
\`\`\`

Sorting indices descending before deletion ensures \`swap_remove\` doesn't invalidate later indices. A common mistake.`,
  },
  {
    title: 'The Design Insight',
    content: `**Batch operations are the difference between a contract that works and a contract that scales.**

Without batching:
- Adding 1000 items = 1000 separate transactions
- Each costs base fee + storage fee
- Total: expensive, slow, impractical at scale

With batching:
- Adding 1000 items = 10 transactions of 100 items each
- 10 base fees instead of 1000
- Total: 99% reduction in transaction fees

The principle extends beyond inserts:
- **Batch reads** — reduce RPC calls
- **Batch deletes** — reduce transaction count
- **Batch cross-contract calls** — reduce latency

Every scaling solution starts with batching. It's not glamorous, but it's the foundation of gas-efficient contract design.

**Pro tip:** Always expose both single and batch methods. Single for UX (users adding one todo item), batch for migration scripts and power users. Your contract should serve both.`,
  },
  {
    title: 'Single vs Batch - When To Use Which?',
    content: `Quick guide:

**Use batch when:**
- Processing multiple items in one logical operation
- Importing/migrating data
- Gas efficiency matters
- Operations should be atomic

**Use single operations when:**
- Individual user actions (one todo, one vote)
- User expects immediate confirmation per item
- Different users trigger different items

**Hybrid approach:**
\`\`\`rust
pub fn add_item(&mut self, item: String) {
    self.items.push(&item);
}

pub fn add_many(&mut self, items: Vec<String>) {
    require!(items.len() <= MAX_BATCH as usize, "Batch too large");
    for item in items {
        self.items.push(&item);
    }
}
\`\`\`

Expose both. Let users choose based on their use case. The single method is one function call. The batch method calls the same underlying logic but saves gas when adding multiple items. Smart contracts should be flexible.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Batch operations give you massive gas savings and atomicity. Processing 100 items in one call costs about the same as processing 1 item — you just pay one extra base fee instead of 100.

The tradeoff is complexity. Error handling is all-or-nothing: one bad item in a batch of 100 fails the entire batch. The transaction time is longer (more execution), so your RPC timeout needs to be higher. And debugging failed batches is harder than debugging a single item.

Storage is also a concern. A batch insert writes all items to storage in one transaction, which means a large storage cost all at once. Your contract needs enough NEAR attached for storage staking.

**When NOT to batch:** When items come from different sources (different users' todo items), when partial success is better than all-or-nothing, when the batch is too large to fit in a single transaction's gas limit. Know your limits and always validate.`,
  },
  {
    title: "Don't Do This!",
    content: `A batch method with no size limit:

\`\`\`rust
// BAD: No MAX_BATCH check!
pub fn add_many(&mut self, items: Vec<String>) {
    for item in items {
        self.items.push(&item);
        // A user sends 1,000,000 items
        // Gas runs out halfway through
        // Contract is in inconsistent state
    }
}
\`\`\`

**The problem:** Without a batch size limit, a user (or attacker) can send a huge vector that either:
a) Exceeds prepaid gas and fails mid-way (partial state change!)
b) Exceeds block gas limit and fails entirely
c) Works but costs you way more in storage than expected

**Always validate batch size.** It's one line of \`require!\` that saves you from production nightmares.

**Another common mistake:** Processing items in a batch that depend on each other:
\`\`\`rust
// BAD: Second item depends on first being processed
for (i, item) in items.iter().enumerate() {
    if i > 0 && items[i] == items[i-1] {
        // This runs AFTER first insert, but what if first insert failed?
    }
}
\`\`\`
If the batch fails mid-way, items before the failure are committed. Dependent operations break. Keep batch items independent.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a batch operations contract that inserts items in bulk with size limits.

**Code Snippet:**
\`\`\`rust
pub fn add_many(&mut self, items: Vec<String>) {
    // TODO: Require items.len() <= MAX_BATCH
    // TODO: Push each item onto self.items
}

pub fn get_all(&self) -> Vec<String> {
    // TODO: Return all items
}

pub fn len(&self) -> u64 {
    // TODO: Return item count
}
\`\`\`

**Solution Hints:**
- MAX_BATCH check: \`require!(items.len() <= MAX_BATCH as usize, "Batch too large")\`
- Push loop: \`for item in items { self.items.push(&item); }\`
- Get all: \`self.items.iter().collect()\`
- Length: \`self.items.len()\`

**Extension:** Add \`delete_many(indices: Vec<u64>)\` that removes multiple items and handles index shifting correctly.

[Learn more about gas optimization →](https://docs.near.org/concepts/gas/overview)`,
  },
];

export default batchOperationsExplanation;
