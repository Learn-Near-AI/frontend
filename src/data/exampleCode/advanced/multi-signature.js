export const multiSignatureCode = {
  RustExercise: `use near_sdk::near;
use near_sdk::store::{UnorderedSet, IterableMap};
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey, NearToken};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshStorageKey)]
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
        owners.insert(initial_owner);
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
        // TODO: Require caller is owner
        // TODO: Insert account into owners
        todo!()
    }

    pub fn propose(&mut self, transaction: String) -> u64 {
        // TODO: Require caller is owner
        // TODO: Get current proposal id, then increment next_proposal_id
        // TODO: Insert new Proposal with empty approvals and executed = false
        // TODO: Return the proposal id
        todo!()
    }

    pub fn approve(&mut self, proposal_id: u64) {
        // TODO: Require caller is owner
        // TODO: Require proposal exists and is not already executed
        // TODO: Add caller to approvals only if not already present
        todo!()
    }

    pub fn execute(&mut self, proposal_id: u64) {
        // TODO: Require caller is owner
        // TODO: Require proposal exists and is not already executed
        // TODO: Require at least 2 approvals
        // TODO: Mark proposal as executed
        todo!()
    }

    #[payable]
    pub fn deposit(&mut self) {
        // TODO: Get attached_deposit() and add it to self.balance
        todo!()
    }

    pub fn get_proposal(&self, proposal_id: u64) -> Option<(String, usize, bool)> {
        // TODO: Return (transaction, approvals.len(), executed) for the proposal
        todo!()
    }

    pub fn get_balance(&self) -> NearToken {
        self.balance
    }
}`,

  Rust: `use near_sdk::near;
use near_sdk::store::{UnorderedSet, IterableMap};
use near_sdk::{env, AccountId, PanicOnDefault, require, BorshStorageKey, NearToken};
use borsh::{BorshSerialize, BorshDeserialize};

#[derive(BorshSerialize, BorshStorageKey)]
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
        owners.insert(initial_owner);  // by value, not reference
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
        self.owners.insert(account);  // by value, not reference
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

`,

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

  TheChallenge: `Your task is to implement a 2-of-N multi-signature wallet.

**Requirements:**
- Store \`owners: UnorderedSet<AccountId>\`, \`proposals: IterableMap<u64, Proposal>\`, \`balance: NearToken\`
- Implement \`new(initial_owner: AccountId)\` - sets first owner
- Implement \`add_owner(account: AccountId)\` - owner-only
- Implement \`propose(transaction: String) -> u64\` - owner creates proposal
- Implement \`approve(proposal_id: u64)\` - owner approves, prevent duplicates
- Implement \`execute(proposal_id: u64)\` - execute if 2+ approvals
- Implement \`deposit()\` - #[payable], add attached_deposit() to balance (NearToken)
- Implement \`get_proposal()\` and \`get_balance()\` - view methods

**Key:** 
- Use \`store::UnorderedSet\` and \`store::IterableMap\` (not collections)
- Proposal needs \`BorshSerialize/BorshDeserialize\` for IterableMap storage
- \`UnorderedSet::insert\` takes ownership (by value, not reference)
- Use \`NearToken\` for balance (not u128)`,

  Hints: `**The Problem:**
You need multiple owners to approve a transaction before it executes.

**Code Snippet:**
\`\`\`rust
#[derive(BorshSerialize, BorshDeserialize)]
pub struct Proposal {
    pub transaction: String,
    pub approvals: Vec<AccountId>,
    pub executed: bool,
}
\`\`\`

**Solution Hints:**
- Imports: \`use near_sdk::store::{UnorderedSet, IterableMap}\`
- StorageKey: \`#[derive(BorshStorageKey)]\` enum with Proposals, Owners variants
- UnorderedSet: \`self.owners.insert(account)\` (takes ownership, not reference)
- Proposal: \`self.proposals.insert(id, Proposal { ... })\`
- Approve: \`proposal.approvals.contains(&caller)\` to check duplicates
- Execute: \`require!(proposal.approvals.len() >= 2, "Need 2+ approvals")\`
- Deposit: \`let amount = env::attached_deposit();\` returns NearToken

**Threshold:**
- 2-of-N: require 2+ approvals

[Learn more about this topic →](https://github.com/near/core-contracts/tree/master/multisig)`,
};

export default multiSignatureCode;
