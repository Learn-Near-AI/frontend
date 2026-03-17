export const collectionsDetailedExplanation = {
  'collections-vector': [
    {
      title: 'The Challenge',
      content: `Your task is to create a list manager using Vectors with StorageKey enum.

**Requirements:**
- Store \`items: Vector<String>\`, \`tags: Vector<String>\` using StorageKey enum
- Implement \`add_item(item: String)\` - pushes to the end of items
- Implement \`add_tag(tag: String)\` - pushes to the end of tags
- Implement \`remove_item(index: u64)\` - removes item at index using swap_remove
- Implement \`get_item(index: u64) -> Option<String>\` - returns item or None if out of bounds
- Implement \`get_items() -> Vec<String>\` - returns all items using iter().collect()
- Implement \`get_tags() -> Vec<String>\` - returns all tags using iter().collect()

**Important:** Use the BorshStorageKey enum pattern for unique storage keys!

**Test:**
Add multiple items and tags, remove one by index, then get all items - order should be maintained (except for swap_remove behavior)!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
You need to store lists, not single values. Multiple lists need separate storage keys or they collide.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::require;
use near_sdk::{PanicOnDefault, BorshStorageKey};
use borsh::BorshSerialize;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Items,
    Tags,
}

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
            items: Vector::new(StorageKey::Items),
            tags: Vector::new(StorageKey::Tags),
        }
    }

    pub fn add_item(&mut self, item: String) {
        // Add to end of list
    }

    pub fn add_tag(&mut self, tag: String) {
        // Add tag to tags vector
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

    pub fn get_tags(&self) -> Vec<String> {
        // Return all tags
    }
}
\`\`\`

**Solution Hints:**
- Add item: \`self.items.push(&item)\`
- Add tag: \`self.tags.push(&tag)\`
- Remove: \`require!(index < self.items.len(), "bounds error"); self.items.swap_remove(index)\`
- Get one: \`self.items.get(index)\` returns Option
- Get all items: \`self.items.iter().collect()\`
- Get all tags: \`self.tags.iter().collect()\`
- StorageKey: Use enum with BorshStorageKey for type-safe storage keys

**Storage key pattern:**
The StorageKey enum with BorshStorageKey derive provides unique, type-safe prefixes. Each variant becomes a unique storage key automatically - no more raw byte prefixes!

And swap_remove? It doesn't preserve order. [A, B, C] removing index 0 becomes [C, B]. Fast (O(1)) but unordered. If you need order, use a different method or accept this behavior.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/anatomy/collections#vector)`,
    },
  ],
};

export const getCollectionsDetailedExplanation = (exampleId) =>
  collectionsDetailedExplanation[exampleId] ?? null;
