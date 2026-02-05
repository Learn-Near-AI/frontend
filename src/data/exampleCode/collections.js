// Collections and data structure examples
export const collectionsCode = {
  'storage-keys': {
    Rust: `// Storage keys: unique prefixes namespace each collection to avoid collisions
use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    items: Vector<String>,   // prefix b"i"
    tags: Vector<String>,    // prefix b"t" - different key, no collision
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
        self.items.push(&item);
    }

    pub fn add_tag(&mut self, tag: String) {
        self.tags.push(&tag);
    }

    pub fn get_items(&self) -> Vec<String> {
        self.items.iter().collect()
    }

    pub fn get_tags(&self) -> Vec<String> {
        self.tags.iter().collect()
    }
}`,
    JavaScript: `// Storage keys: unique prefixes namespace each collection
import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items, tags } = { items: [], tags: [] }) {
    this.items = items || [];
    this.tags = tags || [];
  }

  @view({})
  get_items() {
    return this.items;
  }

  @view({})
  get_tags() {
    return this.tags;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }

  @call({})
  add_tag({ tag }) {
    this.tags.push(tag);
  }
}

`,
  },
  'todo-list': {
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
        let idx = self.todo_ids.iter().position(|&i| i == id).expect("Todo id not in list") as u64;
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: u128,
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
    pub fn list_item(&mut self, listing_id: String, nft_contract_id: AccountId, token_id: String, price: u128) {
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
            .function_call(b"nft_transfer_from", args.into_bytes(), 1, env::prepaid_gas() / 2);
        near_sdk::Promise::and(transfer_promise, nft_promise)
    }

    pub fn get_listing(&self, listing_id: String) -> Option<(AccountId, AccountId, u128, String)> {
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
    return NearPromise.new(seller_id).transfer(BigInt(amount)).asReturn();
  }
}

`,
  },
  'batch-operations': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
use near_sdk::PanicOnDefault;

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

    pub fn add_many(&mut self, items: Vec<String>) {
        for item in items {
            self.items.push(&item);
        }
    }

    pub fn get_all(&self) -> Vec<String> {
        self.items.iter().collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ items } = { items: [] }) {
    this.items = items || [];
  }

  @view({})
  get_all() {
    return this.items;
  }

  @call({})
  add_many({ items }) {
    for (const item of items) {
      this.items.push(item);
    }
  }
}

`,
  },
}

