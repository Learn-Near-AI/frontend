// Collections and data structure examples
export const collectionsCode = {
  'storage-keys': {
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

    pub fn add_item(&mut self, item: String) {
        self.items.push(&item);
    }

    pub fn get_items(&self) -> Vec<String> {
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
  get_items() {
    return this.items;
  }

  @call({})
  add_item({ item }) {
    this.items.push(item);
  }
}

`,
  },
  'todo-list': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::Vector;
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
    todos: Vector<Todo>,
    next_id: u64,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            todos: Vector::new(b"t"),
            next_id: 1,
        }
    }

    pub fn add_todo(&mut self, title: String) {
        require!(title.len() > 0, "Title cannot be empty");
        let todo = Todo {
            id: self.next_id,
            title,
            completed: false,
            owner: env::predecessor_account_id(),
        };
        self.todos.push(&todo);
        self.next_id += 1;
    }

    pub fn get_todos(&self) -> Vec<(u64, String, bool, AccountId)> {
        self.todos.iter().map(|t| (t.id, t.title.clone(), t.completed, t.owner.clone())).collect()
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
    if (title.length === 0) {
      near.panic("Title cannot be empty");
    }
    const todo = {
      id: this.next_id,
      title,
      completed: false,
      owner: near.predecessorAccountId(),
    };
    this.todos.push(todo);
    this.next_id += 1;
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
use near_sdk::{env, AccountId};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Listing {
    seller_id: AccountId,
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

    pub fn list_item(&mut self, listing_id: String, token_id: String, price: u128) {
        let seller = env::predecessor_account_id();
        self.listings.insert(&listing_id, &Listing {
            seller_id: seller,
            price,
            token_id,
        });
    }

    pub fn get_listing(&self, listing_id: String) -> Option<(AccountId, u128, String)> {
        self.listings.get(&listing_id).map(|l| (l.seller_id.clone(), l.price, l.token_id.clone()))
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

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
  list_item({ listing_id, token_id, price }) {
    const seller = near.predecessorAccountId();
    this.listings[listing_id] = {
      seller_id: seller,
      price,
      token_id,
    };
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

