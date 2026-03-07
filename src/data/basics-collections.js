export const collectionsDetailedExplanation = {
  'collections-vector': [
    {
      title: 'Unlock The Treasure Chest!',
      content: `So far, you've stored single things - one message, one number. But what if you want to store a LIST of things?

That's where **Vectors** come in. Think of them like:
- A treasure chest that holds multiple items
- A to-do list with many tasks
- A playlist of songs

Vectors let you store ordered lists that persist on the blockchain. Time to upgrade your inventory!

**What you'll build:**
A simple list manager with add, remove, and get operations!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if you only had single values?

\`\`\`rust
// BAD: Can't store lists!
struct Contract {
    item1: String,
    item2: String,
    item3: String,
    // Limited to 3 items!
    // What about item4, item5...?
}
\`\`\`

**The problem:**
- Fixed size - can't grow
- Wasteful if you only use a few
- Clunky to manage
- Not scalable!

Vectors solve this - dynamic, unlimited lists!`,
    },
    {
      title: 'The Contract Setup',
      content: `Here's how you create vectors in NEAR:

\`\`\`rust
use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,    // A list of strings (e.g., todo items)
    tags: Vector<String>,    // Another list for tags/labels
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(b"i"),  // "i" = items
            tags: Vector::new(b"t"),   // "t" = tags
        }
    }
}
\`\`\`

**What's happening:**
- \`Vector<String>\` = A list that holds strings
- \`Vector::new(b"i")\` = Creates the vector with storage prefix "i"
- Each collection needs its OWN unique prefix — "i" for items, "t" for tags
- If you reuse a prefix, data gets mixed up!`,
    },
    {
      title: 'Adding Items To The List',
      content: `Let's add items to our vector:

\`\`\`rust
pub fn add_item(&mut self, item: String) {
    self.items.push(&item);
}

// Same pattern for tags!
pub fn add_tag(&mut self, tag: String) {
    self.tags.push(&tag);
}
\`\`\`

**How it works:**
- \`push(&item)\` adds to the END of the list
- \`&\` is required - we're borrowing the data
- Items are added in order: first push goes to index 0, second to index 1, etc.
- Tags work exactly the same way — just with a different storage prefix!

**What about removing?**
\`\`\`rust
pub fn remove_item(&mut self, index: u64) {
    require!(index < self.items.len(), "Index out of bounds");
    self.items.swap_remove(index);
}
\`\`\`

> **⚠️ Important Gotcha:** \`swap_remove\` does NOT preserve order! It swaps the removed item with the LAST item, then removes the last position. So [A, B, C] removing index 0 becomes [C, B], not [B, C]. If order matters to you, use a different method or accept this behavior!

We MUST check bounds first - what if index is too big?
That's why we use require! to validate!`,
    },
    {
      title: 'Reading From The Vector',
      content: `Now let's read data back:

\`\`\`rust
// Get ONE item by index
pub fn get_item(&self, index: u64) -> Option<String> {
    self.items.get(index)
}

// Get ALL items
pub fn get_items(&self) -> Vec<String> {
    self.items.iter().collect()
}

// Reading tags works the same way!
pub fn get_tags(&self) -> Vec<String> {
    self.tags.iter().collect()
}
\`\`\`

**get_item:**
- Returns \`Option<String>\` - might have a value, might be None
- If index is out of bounds, returns None
- Uses borrowing (\`&self\`) - free to call!

**get_items:**
- Returns a regular Rust \`Vec<String>\`
- Uses \`.iter().collect()\` to convert
- Makes a copy of all items
- **Warning:** This is a gas trap for large lists! Works fine for small lists (under ~100 items), but for bigger ones you'll want pagination.

**get_tags:**
- Works exactly like get_items — same pattern, different collection!

**Why two methods?**
- \`get_item\` is efficient - just one item
- \`get_items\` gets everything - more work, but sometimes you need it!`,
    },
    {
      title: 'Vector Toolkit - Quick Reference',
      content: `Here's what you can do with vectors:

**Add to the end:**
\`\`\`rust
self.items.push(&new_item);
\`\`\`

**Get by position:**
\`\`\`rust
let item = self.items.get(index);  // Option<String>
\`\`\`

**Remove by position:**
\`\`\`rust
self.items.swap_remove(index);  // ⚠️ Swaps with last, doesn't preserve order!
\`\`\`

**How many items?**
\`\`\`rust
let count = self.items.len();
\`\`\`

**Loop through all:**
\`\`\`rust
for item in self.items.iter() {
    // do something with each item
}
\`\`\`

Vectors are perfect for: to-do lists, chat messages, game logs, anything ordered!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why vectors work: Indexed storage!**

Vectors store items by index:

\`\`\`
Index 0 → Item A
Index 1 → Item B
Index 2 → Item C
\`\`\`

**Benefits:**
- Order preserved (0, 1, 2...)
- Fast random access by index
- Efficient iteration

**Storage:**
- Each vector needs unique prefix
- NEAR handles serialization
- Persists on blockchain!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Vectors have tradeoffs:

**VECTOR gives you:**
- ✅ Ordered lists
- ✅ Fast index access
- ✅ Easy to iterate

**VECTOR doesn't give you:**
- ❌ Fast key lookup (use Map for that!)
- ❌ Unlimited (gas costs grow)
- ❌ Preserve order on remove (swap_remove!)

**When vectors hurt you:**
- Need key-value lookup? Use Map
- Large datasets? Pagination needed
- Frequent removals? Consider alternative

**The insight:** Vectors for ordered lists, Maps for lookups. Choose the right tool!

**When NOT to use vectors:** When you need fast lookups by key - that's what Maps are for!`,
    },
  ],
};

export const getCollectionsDetailedExplanation = (exampleId) =>
  collectionsDetailedExplanation[exampleId] ?? null;
