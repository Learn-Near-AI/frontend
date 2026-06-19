export const testingExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a counter contract and write unit tests that verify its behavior — testing state initialization, increment/decrement operations, access control, and edge cases.

**Requirements:**
- Store \`counter: u64\` initialized to 0
- Implement \`increment()\` — adds 1 to counter (owner only)
- Implement \`decrement()\` — subtracts 1 from counter (owner only, check for underflow)
- Implement \`get_counter() -> u64\` — view method
- Store \`owner_id: AccountId\` set to deployer in \`new()\`
- Write unit tests covering: initialization, increment, decrement, underflow protection, access control

**Test:** All tests must pass — the contract should compile and tests should run with \`cargo test\`!`,
  },
  {
    title: 'The Safety Net!',
    content: `Unit tests on NEAR are your **safety net** — they catch bugs before deployment and ensure your contract behaves correctly under all conditions.

Think of tests as a **flight simulator** for pilots. Before flying a real plane (deploying to mainnet), pilots practice in a simulator (test environment) where crashes cost nothing. Every scenario is tested: takeoff (init), normal flight (increment/decrement), emergencies (underflow), and who's allowed in the cockpit (access control).

**Why testing matters:**
- **Prevent loss** — a bug in production can drain user funds
- **Document behavior** — tests show how your contract is supposed to work
- **Enable refactoring** — change code with confidence that tests catch regressions
- **Gas estimation** — tests reveal expensive operations

**NEAR testing tools:**
- \`near-sdk\` provides \`#[test]\` macro and test helpers
- \`VMContextBuilder\` sets up test context (predecessor, attached deposit, etc.)
- Tests run in a simulated NEAR runtime — no actual blockchain needed`,
  },
  {
    title: 'Writing Tests',
    content: `NEAR unit tests use the \`near-sdk\` testing infrastructure:

\`\`\`rust
#[cfg(test)]
mod tests {
    use super::*;
    use near_sdk::test_utils::VMContextBuilder;
    use near_sdk::{testing_env, AccountId};

    fn get_context(predecessor: AccountId) -> VMContextBuilder {
        let mut builder = VMContextBuilder::new();
        builder.predecessor_account_id(predecessor);
        builder
    }

    #[test]
    fn test_initial_counter() {
        let alice: AccountId = "alice.testnet".parse().unwrap();
        testing_env!(get_context(alice.clone()).build());
        let contract = Contract::new();
        assert_eq!(contract.get_counter(), 0, "Counter should start at 0");
    }
}
\`\`\`

**Key test components:**
- \`#[cfg(test)]\` — ensures test code is only compiled during testing
- \`testing_env!()\` — sets the execution context (predecessor, deposit, block height, etc.)
- \`VMContextBuilder\` — builder pattern for constructing test contexts
- \`assert_eq! / assert!\` — standard Rust assertions

**The test flow:**
1. Set up context (who is calling, how much gas, etc.)
2. Initialize the contract with \`Contract::new()\`
3. Call methods and assert expected results
4. Repeat with different contexts for different scenarios`,
  },
  {
    title: 'Testing Access Control',
    content: `Access control tests verify that only authorized users can call restricted methods:

\`\`\`rust
#[test]
#[should_panic(expected = "Only owner can call this method")]
fn test_non_owner_cannot_increment() {
    let alice: AccountId = "alice.testnet".parse().unwrap();
    let bob: AccountId = "bob.testnet".parse().unwrap();

    // Deploy as alice
    testing_env!(get_context(alice.clone()).build());
    let mut contract = Contract::new();

    // Bob tries to increment — should panic
    testing_env!(get_context(bob).build());
    contract.increment();
}
\`\`\`

**\`#[should_panic]\`** — asserts that the method panics with the expected message. This is how you test access control:
- Set context to the non-owner
- Call the restricted method
- Expect a panic with the exact error message

**Testing underflow:**
\`\`\`rust
#[test]
#[should_panic(expected = "Underflow: counter cannot go below 0")]
fn test_decrement_underflow() {
    let alice: AccountId = "alice.testnet".parse().unwrap();
    testing_env!(get_context(alice.clone()).build());
    let mut contract = Contract::new();
    contract.decrement(); // Counter is 0, decrement should panic
}
\`\`\`

Always test that error conditions produce the correct panic messages. Indexers and frontends may depend on parsing these messages.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Testing gives you confidence, but not all tests are created equal:

**Advantages:**
- **Fast** — unit tests run in milliseconds, no blockchain needed
- **Deterministic** — same inputs always produce same outputs
- **Comprehensive** — test every method, every branch, every edge case
- **Free** — no gas costs for running tests

**Limitations:**
- **Simulated environment** — not identical to real network conditions
- **No cross-contract** — testing cross-contract calls requires integration tests
- **No front-running** — tests don't simulate MEV or race conditions
- **Mock context** — can't perfectly replicate all real-world scenarios

**When to unit test:**
- Every public method should have at least one test
- Every access control check should have a success and failure test
- Every mathematical operation should test edge cases (overflow, underflow, zero)
- Every state initialization should be tested

**When to add integration tests:**
- Cross-contract call flows
- Multi-transaction scenarios
- Real-world gas profiling`,
  },
  {
    title: "Don't Do This!",
    content: `Not testing edge cases:

\`\`\`rust
// BAD: Only testing the happy path
#[test]
fn test_increment() {
    let mut contract = Contract::new();
    contract.increment();
    assert_eq!(contract.get_counter(), 1);
}
// Missing: test decrement, test underflow, test access control!
\`\`\`

**Testing with wrong context:**

\`\`\`rust
// BAD: Inconsistent context — using alice for both deployment and action
#[test]
fn test_increment() {
    let alice: AccountId = "alice.testnet".parse().unwrap();
    testing_env!(get_context(alice.clone()).build());
    let mut contract = Contract::new(); // Deployed by alice
    // Context still alice — this passes but doesn't test access control!
    contract.increment();
    assert_eq!(contract.get_counter(), 1);
}
\`\`\`

**Vague assertion messages:**

\`\`\`rust
// BAD: No message — hard to tell which assertion failed
assert_eq!(contract.get_counter(), 1);
// GOOD: Descriptive message
assert_eq!(contract.get_counter(), 1, "Counter should be 1 after one increment");
\`\`\`

Always include descriptive assertion messages. When a test fails, you want to know WHY without reading the test code.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Implement a counter contract with owner access control, underflow protection, and comprehensive tests.

**Code Snippet:**
\`\`\`rust
pub fn increment(&mut self) {
    // TODO: Assert caller is owner
    // TODO: Increment counter
}

pub fn decrement(&mut self) {
    // TODO: Assert caller is owner
    // TODO: Check for underflow, then decrement
}
\`\`\`

**Solution Hints:**
- \`require!(env::predecessor_account_id() == self.owner_id, "Only owner can call this method")\`
- \`self.counter += 1\`
- \`require!(self.counter > 0, "Underflow: counter cannot go below 0")\`
- \`self.counter -= 1\`
- Write tests for: init (counter == 0), increment (counter == 1), decrement (counter == 0), underflow (panic), non-owner (panic)

**JavaScript version:**
\`\`\`javascript
increment() {
    if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can call this method");
    this.counter++;
}

decrement() {
    if (near.predecessorAccountId() !== this.owner_id) near.panic("Only owner can call this method");
    if (this.counter === 0) near.panic("Underflow: counter cannot go below 0");
    this.counter--;
}
\`\`\`

[Learn more about NEAR unit testing →](https://docs.near.org/sdk/rust/testing/unit)`,
  },
];
