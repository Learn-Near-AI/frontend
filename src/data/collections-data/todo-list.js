export const todoListExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a todo list using UnorderedMap and Vector.

**Requirements:**
- Store \`todos: UnorderedMap<u64, Todo>\` and \`todo_ids: Vector<u64>\`
- Define \`Todo\` struct with \`id, title, completed, owner\`
- Implement \`add_todo(title: String)\` - validates non-empty, creates todo for caller
- Implement \`complete_todo(id: u64) / update_todo(id, title) / delete_todo(id)\` - owner-only
- Implement \`get_todos()\` - returns all todos

**Test:** Everyone can read, only the owner of each todo can modify it!`,
  },
  {
    title: 'The Task Board!',
    content: `User management systems use maps to store profile data by account ID.

Imagine a shared task board. Anyone can look at it. But only the person who wrote a task can mark it done or change it.

That's your **Todo List** contract!

We combine TWO collections for this:
- **Map** (\`UnorderedMap<u64, Todo>\`) — find any todo by its ID instantly
- **Vector** (\`Vector<u64>\`) — keep track of all todo IDs in order

This is a pattern you'll see everywhere: one collection for fast lookups, another for ordered listing. The map is your filing cabinet, the vector is your index card. Together they're unstoppable.`,
  },
  {
    title: 'The Todo Structure',
    content: `Here's how we model a todo on the blockchain:

\`\`\`rust
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Todo {
    id: u64,
    title: String,
    completed: bool,
    owner: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    todos: UnorderedMap<u64, Todo>,
    todo_ids: Vector<u64>,
    next_id: u64,
}
\`\`\`

**Why two collections?**
- \`UnorderedMap<u64, Todo>\` — maps ID → Todo for instant lookups
- \`Vector<u64>\` — ordered list of all IDs for listing and iteration
- \`next_id\` — auto-incrementing counter for unique IDs

**Translation:** "For each todo ID, store a Todo. Also keep an ordered list of all IDs so we can show them all."`,
  },
  {
    title: 'Creating Todos',
    content: `Adding a new todo requires validation and ownership:

\`\`\`rust
pub fn add_todo(&mut self, title: String) {
    require!(title.len() > 0, "Title cannot be empty");

    let id = self.next_id;
    let todo = Todo {
        id,
        title,
        completed: false,
        owner: env::predecessor_account_id(),
    };

    self.todos.insert(&id, &todo);
    self.todo_ids.push(&id);
    self.next_id += 1;
}
\`\`\`

**Key points:**
- **Validation first** — \`require!\` checks title isn't empty before doing anything
- **Owner is set to caller** — \`predecessor_account_id()\` is who called the method
- **Insert in both collections** — map for lookups, vector for listing
- **Increment next_id** — ensures every todo gets a unique ID

The insert-into-both step is critical. Forgetting to push to \`todo_ids\` means the todo exists but never shows up in the list. That's a ghost todo — exists in storage but invisible to users.`,
  },
  {
    title: 'Owner-Only Operations',
    content: `Only the person who created a todo can change it:

\`\`\`rust
pub fn complete_todo(&mut self, id: u64) {
    let mut todo = self.todos.get(&id).expect("Todo not found");
    require!(todo.owner == env::predecessor_account_id(), "Only the owner can complete this todo");
    todo.completed = true;
    self.todos.insert(&id, &todo);
}

pub fn delete_todo(&mut self, id: u64) {
    let todo = self.todos.get(&id).expect("Todo not found");
    require!(todo.owner == env::predecessor_account_id(), "Only the owner can delete this todo");
    self.todos.remove(&id);
    let idx = self.todo_ids.iter().position(|i| i == id)
        .expect("Todo id not in list") as u64;
    self.todo_ids.swap_remove(idx);
}
\`\`\`

**The pattern:**
1. Get the todo from the map (panics if not found)
2. Assert the caller is the owner
3. Modify or remove

Note \`swap_remove\` on the vector — it swaps the removed item with the last one (O(1)), but doesn't preserve order. Fine for a todo list! If order matters, use \`remove\` (O(n)).

**Design Philosophy:** Why does the owner get absolute control? Because on-chain, ownership IS authority. If someone else could tamper with your todos, the system is broken. This is the same principle behind token transfers — only the owner can move their tokens.`,
  },
  {
    title: 'Reading Todos',
    content: `View methods are free and public:

\`\`\`rust
pub fn get_todos(&self) -> Vec<(u64, String, bool, AccountId)> {
    self.todo_ids.iter()
        .filter_map(|id| self.todos.get(&id)
            .map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone())))
        .collect()
}
\`\`\`

**How it works:**
1. Iterate over all todo IDs (from the vector)
2. For each ID, look up the full todo in the map
3. Return a flat list of tuples

**Gas warning:** This loads ALL todos. Fine for personal lists (~100 items). For a global shared list with thousands of items, you'd want pagination using \`skip\` + \`take\`.

View methods with \`&self\` are free because they don't modify state. Users don't need a wallet to call them — any browser or curl request works.`,
  },
  {
    title: 'The Design Insight',
    content: `**Why combine Map + Vector? Collections are tools. Use the right tool for each job.**

The Map gives you instant lookups by ID (O(1)). The Vector gives you ordered iteration (O(n) but sequential). Together they give you both superpowers.

This pattern shows up everywhere:
- **Token contracts**: Map of AccountId → Balance + Vector of token IDs
- **Social contracts**: Map of AccountId → Profile + Vector of recent posts
- **Games**: Map of PlayerId → Score + Vector of top scorers

Every blockchain storage system faces the same tradeoff: indexing vs iteration. Maps excel at one, vectors at the other. The pros use both.`,
  },
  {
    title: 'Todo List vs Single Map - When To Use Which?',
    content: `Quick guide:

**Use Map + Vector combo when:**
- You need both lookups AND ordered listing
- Items have unique IDs
- You need to iterate in insertion order

**Use a single Map when:**
- You only need lookups by key
- Order doesn't matter
- Example: account balances, user profiles

**Use a single Vector when:**
- You only need an ordered sequence
- You never look up by ID
- Example: simple message queue, event log

The combo is actually the most common pattern in real contracts. Rarely do you need JUST lookups or JUST iteration. You almost always need both.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `A todo list on the blockchain gives you honest, verifiable task management. No one can delete your todos or fake completions. That's the super power. Everything is permanent, transparent, and belongs to you.

But there's a cost. Every \`add_todo\` costs gas — actual money. You can't edit a todo by accident: the owner check prevents that on purpose. And on a public blockchain, your todo list is public. Anyone can see your tasks, what you've completed, and when you did it.

So use the blockchain for todo lists where transparency and ownership matter (shared team tasks, public bounties, DAO action items). For your personal grocery list? Just use a text file. The blockchain is permanent. A text file is free. Choose accordingly.

**When NOT to use a contract-based todo list:** For personal, private tasks or anything where gas costs outweigh the benefits of transparency.`,
  },
  {
    title: "Don't Do This!",
    content: `Imagine a todo list that doesn't check ownership:

\`\`\`rust
// BAD: Anyone can complete anyone's todos!
pub fn complete_todo(&mut self, id: u64) {
    let mut todo = self.todos.get(&id).expect("Todo not found");
    todo.completed = true;  // No owner check!
    self.todos.insert(&id, &todo);
}
\`\`\`

**The problem:**
- User A creates a todo
- User B completes it
- User B deletes it
- User A's work is gone!

Always check ownership for write operations. The \`require!\` macro is your friend. Use it, love it, never skip it.

**Another classic mistake:** Forgetting to insert into BOTH collections:
\`\`\`rust
// BAD: Only inserts into the map
self.todos.insert(&id, &todo);
// Forgot: self.todo_ids.push(&id);
\`\`\`
The todo exists in the map but never shows up in \`get_todos\`. It's a ghost. Invisible but taking up storage.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Build a todo list where each user owns their tasks.

**Code Snippet:**
\`\`\`rust
pub fn add_todo(&mut self, title: String) {
    require!(title.len() > 0, "Title cannot be empty");
    let id = self.next_id;
    // TODO: Create Todo struct with the id, title, owner = predecessor
    // TODO: Insert into todos map
    // TODO: Push id to todo_ids
    // TODO: Increment next_id
}
\`\`\`

**Solution Hints:**
- Todo struct: \`Todo { id, title, completed: false, owner: env::predecessor_account_id() }\`
- Map insert: \`self.todos.insert(&id, &todo)\`
- Vector push: \`self.todo_ids.push(&id)\`
- Owner check: \`require!(todo.owner == env::predecessor_account_id(), "Not owner")\`
- Delete: remove from map, find index in vector, \`swap_remove\`

**Gas-Optimal Delete:**
\`\`\`rust
let index = self.todo_ids.iter().position(|i| i == id).unwrap() as u64;
self.todo_ids.swap_remove(index);
\`\`\`

\`swap_remove\` is O(1) but doesn't preserve order. For a todo list where order matters by creation time, use \`remove\` (O(n)) instead, or add a \`created_at\` field and sort by it.

[Learn more about collections →](https://docs.near.org/smart-contracts/anatomy/collections)`,
  },
];

export default todoListExplanation;
