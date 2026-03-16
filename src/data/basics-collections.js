export const collectionsDetailedExplanation = {
  'collections-vector': [
    {
      title: 'The Challenge',
      content: `Your task is to create a list manager using Vectors with unique storage prefixes.

**Requirements:**
- Store \`items: Vector<String>\` with prefix b"i"
- Store \`tags: Vector<String>\` with prefix b"t" (different prefix!)
- Implement \`add_item(item: String)\` - pushes to the end of items
- Implement \`remove_item(index: u64)\` - removes item at index using swap_remove
- Implement \`get_item(index: u64) -> Option<String>\` - returns item or None if out of bounds
- Implement \`get_items() -> Vec<String>\` - returns all items using iter().collect()

**Important:** Each Vector needs a unique storage prefix to avoid data collisions!

**Test:**
Add multiple items, remove one by index, then get all items - order should be maintained (except for swap_remove behavior)!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
You need to store lists, not single values. Multiple lists need separate storage prefixes or they collide.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::require;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
    tags: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(b"i"),
            tags: Vector::new(b"t"),
        }
    }

    pub fn add_item(&mut self, item: String) {
        // Add to end of list
    }

    pub fn remove_item(&mut self, index: u64) {
        // Check bounds, then remove
    }

    pub fn get_item(&self, index: u64) -> Option<String> {
        // Return item or None
    }

    pub fn get_items(&self) -> Vec<String> {
        // Return all items
    }
}
\`\`\`

**Solution Hints:**
- Add: \`self.items.push(&item)\`
- Remove: \`require!(index < self.items.len(), "bounds error"); self.items.swap_remove(index)\`
- Get one: \`self.items.get(index)\` returns Option
- Get all: \`self.items.iter().collect()\`
- Prefix: b"i" for items, b"t" for tags - MUST be different!

**Storage prefix:**
Using the same prefix for two collections overwrites data silently. No error. No warning. Tags become items and vice versa. The contract appears to work but returns garbage.

Use at least 2 bytes for prefixes: b"it", b"ta", etc. The prefix is how NEAR knows where to store/retrieve data. Same prefix = same storage location = corrupted data.

And swap_remove? It doesn't preserve order. [A, B, C] removing index 0 becomes [C, B]. Fast (O(1)) but unordered. If you need order, use a different method or accept this behavior.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/collections#vector)`,
    },
  ],
};

export const getCollectionsDetailedExplanation = (exampleId) =>
  collectionsDetailedExplanation[exampleId] ?? null;
