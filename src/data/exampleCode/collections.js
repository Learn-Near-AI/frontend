// Collections and data structure examples
// Note: storage-keys merged into collections-vector (basics.js)
export const collectionsCode = {
  'todo-list': {
    RustExercise: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

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

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            todos: UnorderedMap::new(b"t"),
            todo_ids: Vector::new(b"i"),
            next_id: 1,
        }
    }

    pub fn add_todo(&mut self, title: String) {
        // Require non-empty title; create a Todo for the predecessor, insert it, push id to todo_ids, increment next_id.
        let _: u64 = ();
    }

    pub fn complete_todo(&mut self, id: u64) {
        // Get the todo, require the caller is the owner, set completed to true, and save.
        let _: u64 = ();
    }

    pub fn update_todo(&mut self, id: u64, title: String) {
        // Require non-empty title; get the todo; require owner; update title and insert.
        let _: u64 = ();
    }

    pub fn delete_todo(&mut self, id: u64) {
        // Get the todo; require owner; remove from both todos and todo_ids.
        let _: u64 = ();
    }

    pub fn get_todos(&self) -> Vec<(u64, String, bool, AccountId)> {
        self.todo_ids.iter()
            .filter_map(|id| self.todos.get(&id).map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone())))
            .collect()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ todos, next_id } = { todos: [], next_id: 1 }) {
    this.todos = todos || [];
    this.next_id = next_id;
  }

  @view({})
  get_todos() {
    return this.todos;
  }

  @call({})
  add_todo({ title }) {
    // TODO: if (!title.length) near.panic("..."); push { id: this.next_id, title, completed: false, owner: near.predecessorAccountId() }; this.next_id++
  }

  @call({})
  complete_todo({ id }) {
    // TODO: find todo; require todo.owner === predecessor; set completed = true
  }

  @call({})
  update_todo({ id, title }) { /* TODO: require owner; update title */ }
  @call({})
  delete_todo({ id }) { /* TODO: require owner; remove */ }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

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

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            todos: UnorderedMap::new(b"t"),
            todo_ids: Vector::new(b"i"),
            next_id: 1,
        }
    }

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

    pub fn complete_todo(&mut self, id: u64) {
        let mut todo = self.todos.get(&id).expect("Todo not found");
        require!(todo.owner == env::predecessor_account_id(), "Not owner");
        todo.completed = true;
        self.todos.insert(&id, &todo);
    }

    pub fn update_todo(&mut self, id: u64, title: String) {
        require!(title.len() > 0, "Title cannot be empty");
        let mut todo = self.todos.get(&id).expect("Todo not found");
        require!(todo.owner == env::predecessor_account_id(), "Not owner");
        todo.title = title;
        self.todos.insert(&id, &todo);
    }

    pub fn delete_todo(&mut self, id: u64) {
        let todo = self.todos.get(&id).expect("Todo not found");
        require!(todo.owner == env::predecessor_account_id(), "Not owner");
        self.todos.remove(&id);
        let idx = self.todo_ids.iter().position(|i| i == id).expect("Todo id not in list") as u64;
        self.todo_ids.swap_remove(idx);
    }

    pub fn get_todos(&self) -> Vec<(u64, String, bool, AccountId)> {
        self.todo_ids.iter()
            .filter_map(|id| self.todos.get(&id).map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone())))
            .collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ todos, next_id } = { todos: [], next_id: 1 }) {
    this.todos = todos || [];
    this.next_id = next_id;
  }

  @view({})
  get_todos() {
    return this.todos;
  }

  @call({})
  add_todo({ title }) {
    if (title.length === 0) near.panic("Title cannot be empty");
    this.todos.push({
      id: this.next_id,
      title,
      completed: false,
      owner: near.predecessorAccountId(),
    });
    this.next_id += 1;
  }

  @call({})
  complete_todo({ id }) {
    const todo = this.todos.find(t => t.id === id);
    if (!todo) near.panic("Todo not found");
    if (todo.owner !== near.predecessorAccountId()) near.panic("Not owner");
    todo.completed = true;
  }

  @call({})
  update_todo({ id, title }) {
    if (title.length === 0) near.panic("Title cannot be empty");
    const todo = this.todos.find(t => t.id === id);
    if (!todo) near.panic("Todo not found");
    if (todo.owner !== near.predecessorAccountId()) near.panic("Not owner");
    todo.title = title;
  }

  @call({})
  delete_todo({ id }) {
    const idx = this.todos.findIndex(t => t.id === id);
    if (idx < 0) near.panic("Todo not found");
    if (this.todos[idx].owner !== near.predecessorAccountId()) near.panic("Not owner");
    this.todos.splice(idx, 1);
  }
}

`,
  },
  'user-profiles': {
    RustExercise: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Profile {
    name: String,
    bio: String,
    created_at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    profiles: UnorderedMap<AccountId, Profile>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { profiles: UnorderedMap::new(b"p") }
    }

    pub fn set_profile(&mut self, name: String, bio: String) {
        // Store a Profile for the predecessor with name, bio, and created_at from block_timestamp.
        let _: u64 = ();
    }

    pub fn get_profile(&self, account: AccountId) -> Option<(String, String, u64)> {
        // Return the profile's (name, bio, created_at) if present.
        let _: u64 = ();
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ profiles } = { profiles: {} }) {
    this.profiles = profiles || {};
  }

  @view({})
  get_profile({ account }) {
    // TODO: Return profile for account or null
  }

  @call({})
  set_profile({ name, bio }) {
    // TODO: this.profiles[near.predecessorAccountId()] = { name, bio, created_at: near.blockTimestamp() };
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Profile {
    name: String,
    bio: String,
    created_at: u64,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    profiles: UnorderedMap<AccountId, Profile>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            profiles: UnorderedMap::new(b"p"),
        }
    }

    pub fn set_profile(&mut self, name: String, bio: String) {
        let account = env::predecessor_account_id();
        let profile = Profile {
            name,
            bio,
            created_at: env::block_timestamp(),
        };
        self.profiles.insert(&account, &profile);
    }

    pub fn get_profile(&self, account: AccountId) -> Option<(String, String, u64)> {
        self.profiles.get(&account).map(|p| (p.name.clone(), p.bio.clone(), p.created_at))
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ profiles } = { profiles: {} }) {
    this.profiles = profiles || {};
  }

  @view({})
  get_profile({ account }) {
    return this.profiles[account] || null;
  }

  @call({})
  set_profile({ name, bio }) {
    const account = near.predecessorAccountId();
    this.profiles[account] = {
      name,
      bio,
      created_at: near.blockTimestamp(),
    };
  }
}

`,
  },
  'voting-system': {
    RustExercise: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            votes_yes: 0,
            votes_no: 0,
            voters: UnorderedSet::new(b"v"),
        }
    }

    pub fn vote(&mut self, choice: bool) {
        // Require the caller has not voted; record the voter; increment votes_yes or votes_no by choice.
        let _: u64 = ();
    }

    pub fn get_results(&self) -> (u64, u64) {
        (self.votes_yes, self.votes_no)
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ votes_yes, votes_no, voters } = { votes_yes: 0, votes_no: 0, voters: [] }) {
    this.votes_yes = votes_yes;
    this.votes_no = votes_no;
    this.voters = voters || [];
  }

  @view({})
  get_results() {
    return [this.votes_yes, this.votes_no];
  }

  @call({})
  vote({ choice }) {
    // TODO: if (this.voters.includes(near.predecessorAccountId())) near.panic("Already voted"); push voter; increment votes_yes or votes_no
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            votes_yes: 0,
            votes_no: 0,
            voters: UnorderedSet::new(b"v"),
        }
    }

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

    pub fn get_results(&self) -> (u64, u64) {
        (self.votes_yes, self.votes_no)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ votes_yes, votes_no, voters } = {
    votes_yes: 0,
    votes_no: 0,
    voters: []
  }) {
    this.votes_yes = votes_yes;
    this.votes_no = votes_no;
    this.voters = voters || [];
  }

  @view({})
  get_results() {
    return [this.votes_yes, this.votes_no];
  }

  @call({})
  vote({ choice }) {
    const voter = near.predecessorAccountId();
    if (this.voters.includes(voter)) {
      near.panic("Already voted");
    }
    
    this.voters.push(voter);
    if (choice) {
      this.votes_yes += 1;
    } else {
      this.votes_no += 1;
    }
    
    near.log(\`Vote cast: \${choice}\`);
  }
}

`,
  },
  'simple-marketplace': {
    RustExercise: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require, NearToken, Gas};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: NearToken,
    token_id: String,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    listings: UnorderedMap<String, Listing>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { listings: UnorderedMap::new(b"l") }
    }

    pub fn list_item(&mut self, listing_id: String, nft_contract_id: AccountId, token_id: String, price: NearToken) {
        // Store a Listing with the predecessor as seller and the given nft_contract_id, price, token_id.
        let _: u64 = ();
    }

    #[payable]
    pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
        // Get the listing; require attached deposit >= price; remove listing; transfer price to seller and call nft_transfer_from.
        let _: u64 = ();
    }

    pub fn get_listing(&self, listing_id: String) -> Option<(AccountId, AccountId, NearToken, String)> {
        self.listings.get(&listing_id).map(|l| (l.seller_id.clone(), l.nft_contract_id.clone(), l.price, l.token_id.clone()))
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ listings } = { listings: {} }) {
    this.listings = listings || {};
  }

  @view({})
  get_listing({ listing_id }) {
    return this.listings[listing_id] || null;
  }

  @call({})
  list_item({ listing_id, nft_contract_id, token_id, price }) {
    // TODO: this.listings[listing_id] = { seller_id: near.predecessorAccountId(), nft_contract_id, price, token_id };
  }

  @call({ payable: true })
  buy({ listing_id }) {
    // TODO: require listing exists and attachedDeposit >= price; delete listing; NearPromise nft_transfer_from + transfer to seller
  }
}
`,
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require, NearToken, Gas};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: NearToken,  // ✅ Changed from u128 to NearToken
    token_id: String,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    listings: UnorderedMap<String, Listing>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            listings: UnorderedMap::new(b"l"),
        }
    }

    /// Seller must approve this contract on the NFT contract before listing.
    pub fn list_item(&mut self, listing_id: String, nft_contract_id: AccountId, token_id: String, price: NearToken) {
        let seller = env::predecessor_account_id();
        self.listings.insert(&listing_id, &Listing {
            seller_id: seller,
            nft_contract_id,
            price,
            token_id,
        });
    }

    #[payable]
    pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
        let listing = self.listings.get(&listing_id).expect("Listing not found");
        require!(env::attached_deposit() >= listing.price, "Insufficient payment");
        
        let seller = listing.seller_id.clone();
        let nft_contract = listing.nft_contract_id.clone();
        let token_id = listing.token_id.clone();
        let price = listing.price;
        let buyer = env::predecessor_account_id();
        
        self.listings.remove(&listing_id);
        env::log_str(&format!("Sold {} to {}", listing_id, buyer));
        
        let transfer_promise = near_sdk::Promise::new(seller.clone()).transfer(price);
        
        let args = format!(r#"{{"owner_id":"{}","receiver_id":"{}","token_id":"{}"}}"#, seller, buyer, token_id);
        let nft_promise = near_sdk::Promise::new(nft_contract)
            .function_call(
                "nft_transfer_from".to_string(),  // ✅ Changed from b"..." to String
                args.into_bytes(), 
                NearToken::from_yoctonear(1),     // ✅ Changed from 1 to NearToken
                Gas::from_tgas(5)                 // ✅ Changed from env::prepaid_gas() / 2
            );
        
        near_sdk::Promise::and(transfer_promise, nft_promise)
    }

    pub fn get_listing(&self, listing_id: String) -> Option<(AccountId, AccountId, NearToken, String)> {
        self.listings.get(&listing_id).map(|l| (l.seller_id.clone(), l.nft_contract_id.clone(), l.price, l.token_id.clone()))
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ listings } = { listings: {} }) {
    this.listings = listings || {};
  }

  @view({})
  get_listing({ listing_id }) {
    return this.listings[listing_id] || null;
  }

  @call({})
  list_item({ listing_id, nft_contract_id, token_id, price }) {
    const seller = near.predecessorAccountId();
    this.listings[listing_id] = {
      seller_id: seller,
      nft_contract_id,
      price,
      token_id,
    };
  }

  @call({ payable: true })
  buy({ listing_id }) {
    const listing = this.listings[listing_id];
    if (!listing) near.panic("Listing not found");
    const deposit = near.attachedDeposit();
    if (deposit < listing.price) near.panic("Insufficient payment");
    const seller = listing.seller_id;
    const nft_contract = listing.nft_contract_id;
    const token_id = listing.token_id;
    const price = listing.price;
    const buyer = near.predecessorAccountId();
    delete this.listings[listing_id];
    near.log("Sold " + listing_id + " to " + buyer);
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    const nftArgs = bytes(JSON.stringify({ owner_id: seller, receiver_id: buyer, token_id }));
    return NearPromise.new(nft_contract)
      .functionCall("nft_transfer_from", nftArgs, 1n, gas)
      .then(NearPromise.new(near.currentAccountId())
        .functionCall("on_payment_sent", bytes(JSON.stringify({ seller_id: seller, amount: price.toString() })), 0n, gas))
      .asReturn();
  }

  @call({})
  on_payment_sent({ seller_id, amount }) {
    // Only transfer if NFT transfer succeeded. promiseResultRaw throws on failed promise
    try {
      near.promiseResultRaw(0);
    } catch (_) {
      near.panic("NFT transfer failed");
    }
    return NearPromise.new(seller_id).transfer(BigInt(amount)).asReturn();
  }
}

`,
  },
  'batch-operations': {
    RustExercise: `use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault};

const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { items: Vector::new(b"i") }
    }

    pub fn add_many(&mut self, items: Vec<String>) {
        // Require items.len() <= MAX_BATCH; then push each item onto self.items.
        let _: u64 = ();
    }

    pub fn get_all(&self) -> Vec<String> {
        self.items.iter().collect()
    }

    pub fn len(&self) -> u64 {
        self.items.len()
    }
}`,
    JavaScriptExercise: `const MAX_BATCH = 100;
import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_all() {
    return this.items;
  }

  @view({})
  len() {
    return this.items.length;
  }

  @call({})
  add_many({ items }) {
    // TODO: if (items.length > MAX_BATCH) near.panic("Batch too large"); items.forEach(i => this.items.push(i));
  }
}
`,
    Rust: `// Batch operations + gas optimization: process multiple items atomically with size limits
use near_sdk::near;
use near_sdk::collections::Vector;
use near_sdk::{require, PanicOnDefault};

const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            items: Vector::new(b"i"),
        }
    }

    /// Gas optimization: batch inserts instead of many single-item calls
    pub fn add_many(&mut self, items: Vec<String>) {
        require!(items.len() <= MAX_BATCH as usize, "Batch too large");
        for item in items {
            self.items.push(&item);
        }
    }

    pub fn get_all(&self) -> Vec<String> {
        self.items.iter().collect()
    }

    pub fn len(&self) -> u64 {
        self.items.len()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

const MAX_BATCH = 100;

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_all() {
    return this.items;
  }

  @view({})
  len() {
    return this.items.length;
  }

  @call({})
  add_many({ items }) {
    if (items.length > MAX_BATCH) near.panic("Batch too large");
    for (const item of items) {
      this.items.push(item);
    }
  }
}

`,
  },
  'collections-code-exercise': {
    RustExercise: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet, Vector};
use near_sdk::{env, AccountId, require, NearToken};
use near_sdk::PanicOnDefault;

const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    todos: UnorderedMap<u64, String>,
    todo_owners: UnorderedMap<u64, AccountId>,
    next_id: u64,
    profiles: UnorderedMap<AccountId, String>,
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            todos: UnorderedMap::new(b"t"),
            todo_owners: UnorderedMap::new(b"o"),
            next_id: 1,
            profiles: UnorderedMap::new(b"p"),
            votes_yes: 0,
            votes_no: 0,
            voters: UnorderedSet::new(b"v"),
            items: Vector::new(b"i"),
        }
    }

    pub fn add_todo(&mut self, title: String) {
        // TODO: Require non-empty title; insert into todos and todo_owners
        let _: u64 = ();
    }

    pub fn complete_todo(&mut self, id: u64) {
        // TODO: Get owner from todo_owners; require caller is owner
        let _: u64 = ();
    }

    pub fn set_profile(&mut self, name: String, account: AccountId) {
        // TODO: Use predecessor_account_id instead of account param; record block_timestamp
        let _: u64 = ();
    }

    pub fn get_profile(&self, account: AccountId) -> Option<String> {
        self.profiles.get(&account)
    }

    pub fn vote(&mut self, choice: bool) {
        // TODO: Check caller hasn't voted; increment votes_yes or votes_no
        let _: u64 = ();
    }

    pub fn get_results(&self) -> (u64, u64) {
        (self.votes_yes, self.votes_no)
    }

    #[payable]
    pub fn buy(&mut self, item_id: String, price: NearToken) {
        // TODO: Verify attached_deposit >= price
        let _: u64 = ();
    }

    pub fn add_many(&mut self, items: Vec<String>) {
        // TODO: Validate items.len() <= MAX_BATCH; push each item
        let _: u64 = ();
    }

    pub fn get_all_items(&self) -> Vec<String> {
        self.items.iter().collect()
    }
}`,
    JavaScriptExercise: `import { NearBindgen, view, call, near, NearPromise } from "near-sdk-js";

const MAX_BATCH = 100;

@NearBindgen({})
class Contract {
  constructor({ todos, todo_owners, next_id, profiles, votes_yes, votes_no, voters, items } = {}) {
    this.todos = todos || {};
    this.todo_owners = todo_owners || {};
    this.next_id = next_id || 1;
    this.profiles = profiles || {};
    this.votes_yes = votes_yes || 0;
    this.votes_no = votes_no || 0;
    this.voters = voters || [];
    this.items = items || [];
  }

  @call({})
  add_todo({ title }) {
    // TODO: require non-empty title; this.todos[this.next_id] = title; this.todo_owners[this.next_id] = near.predecessorAccountId(); this.next_id++
  }

  @call({})
  complete_todo({ id }) {
    // TODO: require this.todo_owners[id] === near.predecessorAccountId(); delete this.todos[id]; delete this.todo_owners[id]
  }

  @call({})
  set_profile({ name, account }) {
    // TODO: Use predecessorAccountId instead of account param; record blockTimestamp
  }

  @view({})
  get_profile({ account }) {
    return this.profiles[account] || null;
  }

  @call({})
  vote({ choice }) {
    // TODO: Check caller hasn't voted; increment votes_yes or votes_no
  }

  @view({})
  get_results() {
    return [this.votes_yes, this.votes_no];
  }

  @call({ payable: true })
  buy({ item_id, price }) {
    // TODO: Require attachedDeposit >= price
  }

  @call({})
  add_many({ items }) {
    // TODO: Validate items.length <= MAX_BATCH; push each
  }

  @view({})
  get_all_items() {
    return this.items;
  }
}`,
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, UnorderedSet, Vector};
use near_sdk::{env, AccountId, require, NearToken};
use near_sdk::PanicOnDefault;

const MAX_BATCH: u32 = 100;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    todos: UnorderedMap<u64, String>,
    todo_owners: UnorderedMap<u64, AccountId>,
    next_id: u64,
    profiles: UnorderedMap<AccountId, String>,
    votes_yes: u64,
    votes_no: u64,
    voters: UnorderedSet<AccountId>,
    items: Vector<String>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            todos: UnorderedMap::new(b"t"),
            todo_owners: UnorderedMap::new(b"o"),
            next_id: 1,
            profiles: UnorderedMap::new(b"p"),
            votes_yes: 0,
            votes_no: 0,
            voters: UnorderedSet::new(b"v"),
            items: Vector::new(b"i"),
        }
    }

    pub fn add_todo(&mut self, title: String) {
        require!(title.len() > 0, "Title cannot be empty");
        let id = self.next_id;
        self.todos.insert(&id, &title);
        self.todo_owners.insert(&id, &env::predecessor_account_id());
        self.next_id += 1;
    }

    pub fn complete_todo(&mut self, id: u64) {
        let owner = self.todo_owners.get(&id).expect("Todo not found");
        require!(owner == env::predecessor_account_id(), "Only owner can complete");
        self.todos.remove(&id);
        self.todo_owners.remove(&id);
    }

    pub fn set_profile(&mut self, name: String) {
        let account = env::predecessor_account_id();
        self.profiles.insert(&account, &name);
        env::log_str(&format!("Profile set for {} at {}", account, env::block_timestamp()));
    }

    pub fn get_profile(&self, account: AccountId) -> Option<String> {
        self.profiles.get(&account)
    }

    pub fn vote(&mut self, choice: bool) {
        let voter = env::predecessor_account_id();
        require!(!self.voters.contains(&voter), "Already voted");
        self.voters.insert(&voter);
        if choice {
            self.votes_yes += 1;
        } else {
            self.votes_no += 1;
        }
    }

    pub fn get_results(&self) -> (u64, u64) {
        (self.votes_yes, self.votes_no)
    }

    #[payable]
    pub fn buy(&mut self, item_id: String, price: NearToken) {
        require!(env::attached_deposit() >= price, "Insufficient payment");
        env::log_str(&format!("Purchased {}", item_id));
    }

    pub fn add_many(&mut self, items: Vec<String>) {
        require!(items.len() <= MAX_BATCH as usize, "Batch too large");
        for item in items {
            self.items.push(&item);
        }
    }

    pub fn get_all_items(&self) -> Vec<String> {
        self.items.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise } from "near-sdk-js";

const MAX_BATCH = 100;

@NearBindgen({})
class Contract {
  constructor({ todos, todo_owners, next_id, profiles, votes_yes, votes_no, voters, items } = {}) {
    this.todos = todos || {};
    this.todo_owners = todo_owners || {};
    this.next_id = next_id || 1;
    this.profiles = profiles || {};
    this.votes_yes = votes_yes || 0;
    this.votes_no = votes_no || 0;
    this.voters = voters || [];
    this.items = items || [];
  }

  @call({})
  add_todo({ title }) {
    if (title.length === 0) near.panic("Title cannot be empty");
    const id = this.next_id;
    this.todos[id] = title;
    this.todo_owners[id] = near.predecessorAccountId();
    this.next_id++;
  }

  @call({})
  complete_todo({ id }) {
    const owner = this.todo_owners[id];
    if (!owner) near.panic("Todo not found");
    if (owner !== near.predecessorAccountId()) near.panic("Only owner can complete");
    delete this.todos[id];
    delete this.todo_owners[id];
  }

  @call({})
  set_profile({ name }) {
    const account = near.predecessorAccountId();
    this.profiles[account] = name;
    near.log("Profile set for " + account + " at " + near.blockTimestamp());
  }

  @view({})
  get_profile({ account }) {
    return this.profiles[account] || null;
  }

  @call({})
  vote({ choice }) {
    const voter = near.predecessorAccountId();
    if (this.voters.includes(voter)) near.panic("Already voted");
    this.voters.push(voter);
    if (choice) {
      this.votes_yes += 1;
    } else {
      this.votes_no += 1;
    }
  }

  @view({})
  get_results() {
    return [this.votes_yes, this.votes_no];
  }

  @call({ payable: true })
  buy({ item_id, price }) {
    const deposit = near.attachedDeposit();
    if (deposit < price) near.panic("Insufficient payment");
    near.log("Purchased " + item_id);
  }

  @call({})
  add_many({ items }) {
    if (items.length > MAX_BATCH) near.panic("Batch too large");
    for (const item of items) {
      this.items.push(item);
    }
  }

  @view({})
  get_all_items() {
    return this.items;
  }
}`,
  },
}

