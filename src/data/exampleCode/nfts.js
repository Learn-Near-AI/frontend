// NFT examples
export const nftsCode = {
  'nft-transfer': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
        }
    }

    pub fn transfer(&mut self, token_id: String, receiver_id: AccountId) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        require!(
            token.owner_id == env::predecessor_account_id(),
            "Only owner can transfer"
        );
        token.owner_id = receiver_id.clone();
        self.tokens.insert(&token_id, &token);
        
        env::log_str(&format!("Transferred token {} to {}", token_id, receiver_id));
    }

    pub fn get_token(&self, token_id: String) -> Option<Token> {
        self.tokens.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens } = { tokens: {} }) {
    this.tokens = tokens || {};
  }

  @view({})
  get_token({ token_id }) {
    return this.tokens[token_id] || null;
  }

  @call({})
  transfer({ token_id, receiver_id }) {
    const token = this.tokens[token_id];
    if (!token) {
      near.panic("Token not found");
    }
    if (token.owner_id !== near.predecessorAccountId()) {
      near.panic("Only owner can transfer");
    }
    token.owner_id = receiver_id;
    this.tokens[token_id] = token;
    
    near.log(\`Transferred token \${token_id} to \${receiver_id}\`);
  }
}

`,
  },
  'nft-standard': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct TokenMetadata {
    pub title: Option<String>,
    pub description: Option<String>,
    pub media: Option<String>,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub token_id: String,
    pub owner_id: AccountId,
    pub metadata: Option<TokenMetadata>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

impl Default for Contract {
    fn default() -> Self {
        Self { tokens: UnorderedMap::new(b"t") }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { tokens: UnorderedMap::new(b"t") }
    }

    pub fn nft_transfer(&mut self, receiver_id: AccountId, token_id: String) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        require!(token.owner_id == env::predecessor_account_id(), "Not owner");
        token.owner_id = receiver_id;
        self.tokens.insert(&token_id, &token);
    }

    pub fn nft_token(&self, token_id: String) -> Option<Token> {
        self.tokens.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens } = { tokens: {} }) {
    this.tokens = tokens || {};
  }

  @view({})
  nft_token({ token_id }) {
    return this.tokens[token_id] || null;
  }

  @call({})
  nft_transfer({ receiver_id, token_id }) {
    const token = this.tokens[token_id];
    if (!token) near.panic("Token not found");
    if (token.owner_id !== near.predecessorAccountId()) near.panic("Not owner");
    token.owner_id = receiver_id;
    this.tokens[token_id] = token;
  }
}

`,
  },
  'nft-metadata': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct NFTMetadata {
    pub title: String,
    pub description: String,
    pub media: String,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    metadata: UnorderedMap<String, NFTMetadata>,
}

impl Default for Contract {
    fn default() -> Self {
        Self { metadata: UnorderedMap::new(b"m") }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { metadata: UnorderedMap::new(b"m") }
    }

    pub fn set_metadata(&mut self, token_id: String, title: String, description: String, media: String) {
        self.metadata.insert(&token_id, &NFTMetadata { title, description, media });
    }

    pub fn get_metadata(&self, token_id: String) -> Option<NFTMetadata> {
        self.metadata.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ metadata } = { metadata: {} }) {
    this.metadata = metadata || {};
  }

  @view({})
  get_metadata({ token_id }) {
    return this.metadata[token_id] || null;
  }

  @call({})
  set_metadata({ token_id, title, description, media }) {
    this.metadata[token_id] = { title, description, media };
  }
}

`,
  },
  'nft-minting': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    next_id: u64,
    owner_id: AccountId,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            next_id: 1,
            owner_id: env::current_account_id(),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            next_id: 1,
            owner_id: env::current_account_id(),
        }
    }

    pub fn mint(&mut self, receiver_id: AccountId) -> String {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner can mint");
        let token_id = self.next_id.to_string();
        self.tokens.insert(&token_id.clone(), &Token {
            token_id: token_id.clone(),
            owner_id: receiver_id,
        });
        self.next_id += 1;
        token_id
    }

    pub fn get_token(&self, token_id: String) -> Option<Token> {
        self.tokens.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens, next_id, owner_id } = {
    tokens: {},
    next_id: 1,
    owner_id: near.currentAccountId()
  }) {
    this.tokens = tokens || {};
    this.next_id = next_id;
    this.owner_id = owner_id;
  }

  @view({})
  get_token({ token_id }) {
    return this.tokens[token_id] || null;
  }

  @call({})
  mint({ receiver_id }) {
    if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can mint");
    const token_id = String(this.next_id);
    this.tokens[token_id] = { token_id, owner_id: receiver_id };
    this.next_id += 1;
    return token_id;
  }
}

`,
  },
  'nft-approval': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    owner_id: AccountId,
    approved_account_id: Option<AccountId>,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

impl Default for Contract {
    fn default() -> Self {
        Self { tokens: UnorderedMap::new(b"t") }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { tokens: UnorderedMap::new(b"t") }
    }

    pub fn approve(&mut self, token_id: String, account_id: AccountId) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        require!(token.owner_id == env::predecessor_account_id(), "Not owner");
        token.approved_account_id = Some(account_id);
        self.tokens.insert(&token_id, &token);
    }

    pub fn transfer_from(&mut self, owner_id: AccountId, receiver_id: AccountId, token_id: String) {
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        let predecessor = env::predecessor_account_id();
        require!(
            token.owner_id == predecessor || token.approved_account_id.as_ref() == Some(&predecessor),
            "Not authorized"
        );
        token.owner_id = receiver_id;
        token.approved_account_id = None;
        self.tokens.insert(&token_id, &token);
    }

    pub fn get_approved(&self, token_id: String) -> Option<AccountId> {
        self.tokens.get(&token_id).and_then(|t| t.approved_account_id.clone())
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens } = { tokens: {} }) {
    this.tokens = tokens || {};
  }

  @view({})
  get_approved({ token_id }) {
    return this.tokens[token_id]?.approved_account_id ?? null;
  }

  @call({})
  approve({ token_id, account_id }) {
    const token = this.tokens[token_id];
    if (!token) near.panic("Token not found");
    if (token.owner_id !== near.predecessorAccountId()) near.panic("Not owner");
    token.approved_account_id = account_id;
    this.tokens[token_id] = token;
  }

  @call({})
  transfer_from({ owner_id, receiver_id, token_id }) {
    const token = this.tokens[token_id];
    if (!token) near.panic("Token not found");
    const pred = near.predecessorAccountId();
    const ok = token.owner_id === pred || token.approved_account_id === pred;
    if (!ok) near.panic("Not authorized");
    token.owner_id = receiver_id;
    token.approved_account_id = null;
    this.tokens[token_id] = token;
  }
}

`,
  },
  'nft-enumeration': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize, BorshStorageKey}};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::AccountId;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[derive(BorshStorageKey)]
enum StorageKey {
    Tokens,
    TokenIds,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    token_ids: Vector<String>,
}

impl Default for Contract {
    fn default() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            token_ids: Vector::new(StorageKey::TokenIds),
        }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            token_ids: Vector::new(StorageKey::TokenIds),
        }
    }

    pub fn nft_total_supply(&self) -> u64 {
        self.token_ids.len()
    }

    pub fn nft_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<Token> {
        let start = from_index.unwrap_or(0) as usize;
        let limit = limit.unwrap_or(50) as usize;
        self.token_ids.iter()
            .skip(start)
            .take(limit)
            .filter_map(|id| self.tokens.get(&id))
            .collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens, token_ids } = { tokens: {}, token_ids: [] }) {
    this.tokens = tokens || {};
    this.token_ids = token_ids || [];
  }

  @view({})
  nft_total_supply() {
    return this.token_ids.length;
  }

  @view({})
  nft_tokens({ from_index, limit }) {
    const start = from_index ?? 0;
    const n = limit ?? 50;
    return this.token_ids.slice(start, start + n).map(id => this.tokens[id]).filter(Boolean);
  }
}

`,
  },
  'nft-royalties': {
    Rust: `use near_sdk::{near_bindgen, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;
use std::collections::HashMap;
use near_sdk::AccountId;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    royalties: UnorderedMap<String, u16>,
}

impl Default for Contract {
    fn default() -> Self {
        Self { royalties: UnorderedMap::new(b"r") }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { royalties: UnorderedMap::new(b"r") }
    }

    pub fn set_royalty(&mut self, token_id: String, percent_basis_points: u16) {
        assert!(percent_basis_points <= 10000, "Royalty max 100%");
        self.royalties.insert(&token_id, &percent_basis_points);
    }

    pub fn get_royalty(&self, token_id: String) -> Option<u16> {
        self.royalties.get(&token_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ royalties } = { royalties: {} }) {
    this.royalties = royalties || {};
  }

  @view({})
  get_royalty({ token_id }) {
    return this.royalties[token_id] ?? null;
  }

  @call({})
  set_royalty({ token_id, percent_basis_points }) {
    if (percent_basis_points > 10000) throw new Error("Royalty max 100%");
    this.royalties[token_id] = percent_basis_points;
  }
}

`,
  },
  'nft-marketplace': {
    Rust: `use near_sdk::{near_bindgen, env, AccountId, require, borsh::{self, BorshDeserialize, BorshSerialize}};
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Sale {
    token_id: String,
    seller_id: AccountId,
    price: u128,
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Contract {
    sales: UnorderedMap<String, Sale>,
}

impl Default for Contract {
    fn default() -> Self {
        Self { sales: UnorderedMap::new(b"s") }
    }
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { sales: UnorderedMap::new(b"s") }
    }

    pub fn list(&mut self, token_id: String, price: u128) {
        let listing_id = format!("{}:{}", env::predecessor_account_id(), token_id);
        self.sales.insert(&listing_id, &Sale {
            token_id,
            seller_id: env::predecessor_account_id(),
            price,
        });
    }

    pub fn get_sale(&self, listing_id: String) -> Option<Sale> {
        self.sales.get(&listing_id)
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ sales } = { sales: {} }) {
    this.sales = sales || {};
  }

  @view({})
  get_sale({ listing_id }) {
    return this.sales[listing_id] || null;
  }

  @call({})
  list({ token_id, price }) {
    const listing_id = near.predecessorAccountId() + ":" + token_id;
    this.sales[listing_id] = {
      token_id,
      seller_id: near.predecessorAccountId(),
      price,
    };
  }
}

`,
  },
}

