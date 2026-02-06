// NFT examples
export const nftsCode = {
  'nft-standard': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    pub token_id: String,
    pub owner_id: AccountId,
    pub metadata: Option<TokenMetadata>,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { tokens: UnorderedMap::new(b"t") }
    }

    pub fn nft_transfer(&mut self, receiver_id: AccountId, token_id: String) {
        require!(env::attached_deposit() == 1, "Requires exactly 1 yoctoNEAR (NEP-171)");
        let mut token = self.tokens.get(&token_id).expect("Token not found");
        require!(token.owner_id == env::predecessor_account_id(), "Not owner");
        token.owner_id = receiver_id;
        self.tokens.insert(&token_id, &token);
    }

    pub fn nft_token(&self, token_id: String) -> Option<(String, AccountId, Option<TokenMetadata>)> {
        self.tokens.get(&token_id).map(|t| (t.token_id.clone(), t.owner_id.clone(), t.metadata.clone()))
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
    if (near.attachedDeposit() !== 1n) near.panic("Requires exactly 1 yoctoNEAR (NEP-171)");
    const token = this.tokens[token_id];
    if (!token) near.panic("Token not found");
    if (token.owner_id !== near.predecessorAccountId()) near.panic("Not owner");
    token.owner_id = receiver_id;
    this.tokens[token_id] = { ...token, owner_id: receiver_id };
  }
}

`,
  },
  'nft-metadata': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::PanicOnDefault;
use near_contract_standards::non_fungible_token::metadata::TokenMetadata;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    metadata: UnorderedMap<String, TokenMetadata>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { metadata: UnorderedMap::new(b"m") }
    }

    pub fn set_metadata(&mut self, token_id: String, title: String, description: String, media: String) {
        let meta = TokenMetadata {
            title: Some(title),
            description: Some(description),
            media: Some(media),
            media_hash: None,
            copies: None,
            issued_at: None,
            expires_at: None,
            starts_at: None,
            updated_at: None,
            extra: None,
            reference: None,
            reference_hash: None,
        };
        self.metadata.insert(&token_id, &meta);
    }

    pub fn get_metadata(&self, token_id: String) -> Option<TokenMetadata> {
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
    this.metadata[token_id] = {
      title: title ?? null,
      description: description ?? null,
      media: media ?? null,
      media_hash: null,
      copies: null,
      issued_at: null,
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference: null,
      reference_hash: null,
    };
  }
}

`,
  },
  'nft-minting': {
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    next_id: u64,
    owner_id: AccountId,
}

#[near]
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

    pub fn get_token(&self, token_id: String) -> Option<(String, AccountId)> {
        self.tokens.get(&token_id).map(|t| (t.token_id.clone(), t.owner_id.clone()))
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    owner_id: AccountId,
    approved_account_id: Option<AccountId>,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
}

#[near]
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{UnorderedMap, Vector};
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Token {
    token_id: String,
    owner_id: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    tokens: UnorderedMap<String, Token>,
    token_ids: Vector<String>,
    next_id: u64,
    owner_id: AccountId,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            tokens: UnorderedMap::new(b"t"),
            token_ids: Vector::new(b"i"),
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
        self.token_ids.push(&token_id);
        self.next_id += 1;
        token_id
    }

    pub fn nft_total_supply(&self) -> u64 {
        self.token_ids.len()
    }

    pub fn nft_tokens(&self, from_index: Option<u64>, limit: Option<u64>) -> Vec<(String, AccountId)> {
        let start = from_index.unwrap_or(0) as usize;
        let limit = limit.unwrap_or(50) as usize;
        self.token_ids.iter()
            .skip(start)
            .take(limit)
            .filter_map(|id| self.tokens.get(&id).map(|t| (t.token_id.clone(), t.owner_id.clone())))
            .collect()
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near } from "near-sdk-js";

@NearBindgen({})
class Contract {
  constructor({ tokens, token_ids, next_id, owner_id } = {
    tokens: {},
    token_ids: [],
    next_id: 1,
    owner_id: near.currentAccountId()
  }) {
    this.tokens = tokens || {};
    this.token_ids = token_ids || [];
    this.next_id = next_id ?? 1;
    this.owner_id = owner_id || near.currentAccountId();
  }

  @call({})
  mint({ receiver_id }) {
    if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can mint");
    const token_id = String(this.next_id);
    this.tokens[token_id] = { token_id, owner_id: receiver_id };
    this.token_ids.push(token_id);
    this.next_id += 1;
    return token_id;
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owner_id: AccountId,
    royalties: UnorderedMap<String, u16>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {
            owner_id: env::current_account_id(),
            royalties: UnorderedMap::new(b"r"),
        }
    }

    pub fn set_royalty(&mut self, token_id: String, percent_basis_points: u16) {
        require!(env::predecessor_account_id() == self.owner_id, "Only owner can set royalty");
        require!(percent_basis_points <= 10000, "Royalty max 100%");
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
    Rust: `use near_sdk::near;
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, AccountId, require};
use near_sdk::PanicOnDefault;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Sale {
    token_id: String,
    seller_id: AccountId,
    nft_contract_id: AccountId,
    price: u128,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    sales: UnorderedMap<String, Sale>,
}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self { sales: UnorderedMap::new(b"s") }
    }

    /// Seller must approve this contract on the NFT contract before listing.
    pub fn list(&mut self, nft_contract_id: AccountId, token_id: String, price: u128) {
        let listing_id = format!("{}:{}", env::predecessor_account_id(), token_id);
        self.sales.insert(&listing_id, &Sale {
            token_id,
            seller_id: env::predecessor_account_id(),
            nft_contract_id,
            price,
        });
    }

    #[payable]
    pub fn buy(&mut self, listing_id: String) -> near_sdk::Promise {
        let sale = self.sales.get(&listing_id).expect("Sale not found");
        require!(env::attached_deposit() >= sale.price, "Insufficient payment");
        let seller = sale.seller_id.clone();
        let nft_contract = sale.nft_contract_id.clone();
        let token_id = sale.token_id.clone();
        let price = sale.price;
        let buyer = env::predecessor_account_id();
        self.sales.remove(&listing_id);
        env::log_str(&format!("NFT sale {} to {}", listing_id, buyer));
        let args = format!(r#"{{"owner_id":"{}","receiver_id":"{}","token_id":"{}"}}"#, seller, buyer, token_id);
        let nft_promise = near_sdk::Promise::new(nft_contract)
            .function_call(b"nft_transfer_from", args.into_bytes(), 1, env::prepaid_gas() / 2);
        let transfer_promise = near_sdk::Promise::new(seller).transfer(price);
        near_sdk::Promise::and(nft_promise, transfer_promise)
    }

    pub fn get_sale(&self, listing_id: String) -> Option<(String, AccountId, AccountId, u128)> {
        self.sales.get(&listing_id).map(|s| (s.token_id.clone(), s.seller_id.clone(), s.nft_contract_id.clone(), s.price))
    }
}`,
    JavaScript: `import { NearBindgen, view, call, near, NearPromise, bytes } from "near-sdk-js";

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
  list({ nft_contract_id, token_id, price }) {
    const listing_id = near.predecessorAccountId() + ":" + token_id;
    this.sales[listing_id] = {
      token_id,
      seller_id: near.predecessorAccountId(),
      nft_contract_id,
      price,
    };
  }

  @call({ payable: true })
  buy({ listing_id }) {
    const sale = this.sales[listing_id];
    if (!sale) near.panic("Sale not found");
    if (near.attachedDeposit() < sale.price) near.panic("Insufficient payment");
    const seller = sale.seller_id;
    const nft_contract = sale.nft_contract_id;
    const token_id = sale.token_id;
    const price = sale.price;
    const buyer = near.predecessorAccountId();
    delete this.sales[listing_id];
    near.log("NFT sale " + listing_id + " to " + buyer);
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
}

