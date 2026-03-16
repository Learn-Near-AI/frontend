export const multiSignatureCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::store::IterableMap;
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey, NearToken};
use borsh::{BorshSerialize, BorshDeserialize};
use near_sdk::Promise;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Proposals,
    Owners,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    pub transaction: String,
    pub approvals: Vec<AccountId>,
    pub executed: bool,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    proposals: IterableMap<u64, Proposal>,
    next_proposal_id: u64,
    balance: NearToken,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(StorageKey::Owners);
        owners.insert(&initial_owner);
        Self {
            owners,
            proposals: IterableMap::new(StorageKey::Proposals),
            next_proposal_id: 0,
            balance: NearToken::from_yoctonear(0),
        }
    }

    // Helper: returns true if account is in the owners set
    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    // TODO: propose - require caller is owner, insert Proposal with empty approvals,
    //       increment next_proposal_id, return the new proposal id
    pub fn propose(&mut self, transaction: String) -> u64 {
        0
    }

    // TODO: approve - require caller is owner, require proposal exists and not executed,
    //       push caller to approvals only if not already present (no duplicates)
    pub fn approve(&mut self, proposal_id: u64) {
    }

    // TODO: execute - require caller is owner, require 2+ approvals, mark executed = true
    pub fn execute(&mut self, proposal_id: u64) {
    }

    // TODO: deposit - mark #[payable], add env::attached_deposit() to self.balance
    //       Note: attached_deposit() returns NearToken, use .as_yoctonear() to do math
    //       or use NearToken::from_yoctonear(self.balance.as_yoctonear() + amount.as_yoctonear())
    #[payable]
    pub fn deposit(&mut self) {
    }

    pub fn get_proposal(&self, proposal_id: u64) -> Option<(String, usize, bool)> {
        self.proposals.get(&proposal_id).map(|p| {
            (p.transaction.clone(), p.approvals.len(), p.executed)
        })
    }

    pub fn get_balance(&self) -> NearToken {
        self.balance
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::collections::UnorderedSet;
use near_sdk::store::IterableMap;
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey, NearToken};
use borsh::{BorshSerialize, BorshDeserialize};
use near_sdk::Promise;

#[derive(BorshStorageKey, BorshSerialize)]
enum StorageKey {
    Proposals,
    Owners,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    pub transaction: String,
    pub approvals: Vec<AccountId>,
    pub executed: bool,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {
    owners: UnorderedSet<AccountId>,
    proposals: IterableMap<u64, Proposal>,
    next_proposal_id: u64,
    // NearToken instead of u128 — type-safe, matches near-sdk 5.x attached_deposit() return type
    balance: NearToken,
}

#[near]
impl Contract {
    #[init]
    pub fn new(initial_owner: AccountId) -> Self {
        let mut owners = UnorderedSet::new(StorageKey::Owners);
        owners.insert(&initial_owner);
        Self {
            owners,
            proposals: IterableMap::new(StorageKey::Proposals),
            next_proposal_id: 0,
            balance: NearToken::from_yoctonear(0),
        }
    }

    fn is_owner(&self, account: &AccountId) -> bool {
        self.owners.contains(account)
    }

    pub fn add_owner(&mut self, account: AccountId) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        self.owners.insert(&account);
    }

    pub fn propose(&mut self, transaction: String) -> u64 {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        let id = self.next_proposal_id;
        self.next_proposal_id += 1;
        self.proposals.insert(id, Proposal {
            transaction,
            approvals: vec![],
            executed: false,
        });
        id
    }

    pub fn approve(&mut self, proposal_id: u64) {
        let caller = env::predecessor_account_id();
        require!(self.is_owner(&caller), "Only owner");
        let proposal = self.proposals
            .get_mut(&proposal_id)
            .expect("Proposal not found");
        require!(!proposal.executed, "Already executed");
        // Prevent duplicate approvals from the same owner
        if !proposal.approvals.contains(&caller) {
            proposal.approvals.push(caller);
        }
    }

    pub fn execute(&mut self, proposal_id: u64) {
        require!(self.is_owner(&env::predecessor_account_id()), "Only owner");
        let proposal = self.proposals
            .get_mut(&proposal_id)
            .expect("Proposal not found");
        require!(!proposal.executed, "Already executed");
        require!(proposal.approvals.len() >= 2, "Need 2+ approvals");
        proposal.executed = true;
    }

    #[payable]
    pub fn deposit(&mut self) {
        // env::attached_deposit() returns NearToken in near-sdk 5.x (not u128)
        // env::prepaid_gas() is for gas units — completely different from NEAR tokens
        let amount = env::attached_deposit();
        self.balance = NearToken::from_yoctonear(
            self.balance.as_yoctonear() + amount.as_yoctonear()
        );
    }

    pub fn get_proposal(&self, proposal_id: u64) -> Option<(String, usize, bool)> {
        self.proposals.get(&proposal_id).map(|p| {
            (p.transaction.clone(), p.approvals.len(), p.executed)
        })
    }

    pub fn get_balance(&self) -> NearToken {
        self.balance
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_propose_and_approve() {
        let owner: AccountId = "owner.near".parse().unwrap();
        let mut contract = Contract::new(owner.clone());
        let id = contract.propose("transfer 100 NEAR".to_string());
        assert_eq!(id, 0);
        contract.approve(0);
        let (_, approvals, executed) = contract.get_proposal(0).unwrap();
        assert_eq!(approvals, 1);
        assert!(!executed);
    }

    #[test]
    #[should_panic(expected = "Need 2+ approvals")]
    fn test_execute_requires_two_approvals() {
        let owner: AccountId = "owner.near".parse().unwrap();
        let mut contract = Contract::new(owner);
        contract.propose("transfer".to_string());
        contract.approve(0);
        contract.execute(0);
    }

    #[test]
    fn test_next_proposal_id_increments() {
        let owner: AccountId = "owner.near".parse().unwrap();
        let mut contract = Contract::new(owner);
        let id0 = contract.propose("action one".to_string());
        let id1 = contract.propose("action two".to_string());
        assert_eq!(id0, 0);
        assert_eq!(id1, 1);
    }
}`,

  JavaScriptExercise: `import { NearBindgen, call, view, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  owners = [];
  proposals = {};
  next_proposal_id = 0;
  balance = BigInt(0);

  @call({})
  init({ initial_owner }) {
    this.owners.push(initial_owner);
  }

  // TODO: propose - require caller is in owners, push new proposal object,
  //       increment next_proposal_id, return the new id
  @call({})
  propose({ transaction }) {
    return 0;
  }

  // TODO: approve - require caller is owner, require proposal exists and not executed,
  //       push caller to approvals only if not already present
  @call({})
  approve({ proposal_id }) {
  }

  // TODO: execute - require caller is owner, require 2+ approvals, mark executed = true
  @call({})
  execute({ proposal_id }) {
  }

  // TODO: deposit - add near.attachedDeposit() to this.balance
  //       near.attachedDeposit() returns BigInt (yoctoNEAR)
  @call({ payable: true })
  deposit() {
  }

  @view({})
  get_proposal({ proposal_id }) {
    return this.proposals[proposal_id] ?? null;
  }

  @view({})
  get_balance() {
    return this.balance.toString();
  }
}`,

  JavaScript: `import { NearBindgen, call, view, near, require } from "near-sdk-js";

@NearBindgen({})
class Contract {
  owners = [];
  proposals = {};
  next_proposal_id = 0;
  // BigInt for yoctoNEAR — JS numbers lose precision beyond 2^53
  balance = BigInt(0);

  @call({})
  init({ initial_owner }) {
    this.owners.push(initial_owner);
  }

  propose({ transaction }) {
    const caller = near.predecessorAccountId();
    require(this.owners.includes(caller), "Only owner");
    const id = this.next_proposal_id;
    this.next_proposal_id += 1;
    this.proposals[id] = { transaction, approvals: [], executed: false };
    return id;
  }

  @call({})
  approve({ proposal_id }) {
    const caller = near.predecessorAccountId();
    require(this.owners.includes(caller), "Only owner");
    const proposal = this.proposals[proposal_id];
    require(proposal !== undefined, "Proposal not found");
    require(!proposal.executed, "Already executed");
    if (!proposal.approvals.includes(caller)) {
      proposal.approvals.push(caller);
    }
  }

  @call({})
  execute({ proposal_id }) {
    const caller = near.predecessorAccountId();
    require(this.owners.includes(caller), "Only owner");
    const proposal = this.proposals[proposal_id];
    require(proposal !== undefined, "Proposal not found");
    require(!proposal.executed, "Already executed");
    require(proposal.approvals.length >= 2, "Need 2+ approvals");
    proposal.executed = true;
  }

  @call({ payable: true })
  deposit() {
    // near.attachedDeposit() returns BigInt yoctoNEAR in near-sdk-js
    this.balance += near.attachedDeposit();
  }

  @view({})
  get_proposal({ proposal_id }) {
    return this.proposals[proposal_id] ?? null;
  }

  @view({})
  get_balance() {
    // Return as string — BigInt doesn't serialize to JSON directly
    return this.balance.toString();
  }
}`,
};

export default multiSignatureCode;