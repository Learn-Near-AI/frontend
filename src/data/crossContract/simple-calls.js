export const simpleCallsExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a cross-contract call — invoking a method on another NEAR contract from your contract.

**Requirements:**
- Define a contract with no state (just an empty struct)
- Implement \`call_other_contract(contract_id, method_name)\` — calls a method on another contract
- Use \`Promise::new()\` and \`.function_call()\` with empty args, 0 deposit, 5 TGas
- Return the \`Promise\` from the method

**Test:** The call must reach the target contract without panicking!`,
  },
  {
    title: 'The Handshake!',
    content: `Cross-contract calls let your contract shake hands with other contracts on the network. It's how NEAR contracts compose — like Lego bricks snapping together.

Think of it as sending a **messenger** to a neighboring kingdom. Your messenger (the promise) carries a sealed letter (the method name and arguments) and a pouch of coins (the deposit and gas). The messenger rides to the other kingdom, delivers the letter, and returns with a response.

**On NEAR, every cross-contract call is asynchronous.** Your contract doesn't wait for the response — it schedules the call and continues. The called contract executes later, in its own context, with its own state.

**The Promise API** is how you create these cross-contract calls. It's the foundation for all composability on NEAR:
- DeFi composability (swap tokens, provide liquidity)
- NFT marketplaces (transfer NFTs between contracts)
- Oracle queries (fetch price data from oracle contracts)
- Account aggregation (check balances across multiple contracts)`,
  },
  {
    title: 'Building a Promise',
    content: `A cross-contract call is a three-step process:

\`\`\`rust
Promise::new(contract_id)                    // 1. Target contract
    .function_call(                           // 2. Function call details
        method_name,                          //    Method to call
        b"{}".to_vec(),                       //    Arguments (serialized JSON)
        NearToken::from_yoctonear(0),         //    Deposit (0 for read-only)
        Gas::from_tgas(5),                    //    Gas to attach
    )                                         // 3. Returns a Promise
\`\`\`

**Step 1: Identify the target** — \`Promise::new(contract_id)\` creates a promise targeting a specific account. This can be any valid NEAR account ID.

**Step 2: Describe the call** — \`.function_call(method, args, deposit, gas)\` specifies:
- \`method\`: The method name on the target contract (e.g., \`"get_value"\`, \`"ft_transfer"\`)
- \`args\`: Serialized arguments as bytes (NEAR uses JSON serialization internally)
- \`deposit\`: NEAR tokens to attach (1 yoctoNEAR for token transfers, 0 for view-like calls)
- \`gas\`: Gas allocated to the remote call (deducted from your contract's prepaid gas)

**Step 3: Return the promise** — The \`Promise\` returned by \`.function_call()\` tells the NEAR runtime to execute this call after your current method completes.

**The calling contract MUST be marked as \`#[payable]\` or use \`&self\`** — cross-contract calls typically don't require state mutation in the caller, so \`&self\` is common.`,
  },
  {
    title: 'Gas Budgeting for Remote Calls',
    content: `Every cross-contract call consumes gas from your contract's prepaid gas. You need to budget carefully:

\`\`\`rust
// The calling contract's prepaid gas is split between:
// 1. Your method's execution (reading state, validation)
// 2. Each remote function call (gas you attach)
// 3. Any callback execution (chain processing)

pub fn call_other_contract(&self, contract_id: AccountId, method_name: String) -> Promise {
    Promise::new(contract_id)
        .function_call(
            method_name,
            b"{}".to_vec(),
            NearToken::from_yoctonear(0),
            Gas::from_tgas(5),  // 5 billion gas units
        )
}
\`\`\`

**Gas is measured in TGas (tera-gas, or 10¹² gas units):**
- \`Gas::from_tgas(5)\` = 5 TGas = 5,000,000,000,000 gas units
- A simple view call needs ~1-3 TGas
- A state-changing call needs ~5-10 TGas
- Total prepaid gas per transaction is capped at 300 TGas

**The golden rule:** Sum of all gas attached to remote calls + your execution gas must not exceed the transaction's prepaid gas. If you attach too much gas to a remote call, your own method might run out.

**Safe pattern:** Allocate no more than half your prepaid gas to remote calls. The remaining half covers your execution and any callbacks.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Cross-contract calls unlock composability — your contract can leverage any other contract on NEAR. This is the superpower of blockchain interoperability.

But cross-contract calls are:
- **Asynchronous** — you don't get the result immediately. The response comes in a separate execution step (callback). This adds complexity.
- **Gas-intensive** — each remote call costs extra gas beyond your own execution. Complex chains can hit the 300 TGas limit.
- **Failure-prone** — the remote call might fail (wrong method, wrong args, out of gas). You need error handling.

**When to use cross-contract calls:**
- Delegating to specialized contracts (token transfers, NFT operations)
- Querying data from external contracts (oracle prices, account info)
- Composing multiple DeFi operations (swap, then stake)

**When to avoid:**
- Simple lookups you could cache locally
- Operations where latency matters
- Trust-sensitive operations where external contract behavior is unpredictable

The composability tradeoff is always the same: power vs. complexity. Cross-contract calls give you superpowers, but with great power comes great gas overhead.`,
  },
  {
    title: "Don't Do This!",
    content: `Forgetting to return the Promise from your method:

\`\`\`rust
// BAD: Promise created but never returned — the call never executes!
pub fn call_other_contract(&self, contract_id: AccountId, method_name: String) {
    Promise::new(contract_id)
        .function_call(method_name, b"{}".to_vec(), NearToken::from_yoctonear(0), Gas::from_tgas(5));
    // Missing: return statement
    // The Promise is dropped, the call is never scheduled
}
\`\`\`

**Why this fails:** NEAR's runtime only executes promises that are returned from the calling method. If you create a promise but don't return it, the runtime sees no pending cross-contract calls and skips the execution.

**Wrong method signature:**
\`\`\`rust
// BAD: Returns nothing instead of a Promise
pub fn call_other_contract(&self, contract_id: AccountId, method_name: String) {
    // ...
}
\`\`\`

Always return \`Promise\` from your calling method: \`pub fn call(...) -> Promise\`.

**Another mistake:** Attaching more gas than you have available:

\`\`\`rust
// BAD: Attaching all prepaid gas, leaving nothing for your own execution
Promise::new(contract_id)
    .function_call(method_name, args, deposit, Gas::from_tgas(300))  // All 300 TGas!
\`\`\`

Your own method still needs gas to execute before and after the call. Always leave a safety margin.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Call a method on another NEAR contract using the Promise API.

**Code Snippet:**
\`\`\`rust
pub fn call_other_contract(&self, contract_id: AccountId, method_name: String) -> Promise {
    // TODO: Create a promise targeting contract_id
    // TODO: Call method_name with empty args, 0 deposit, 5 TGas
}
\`\`\`

**Solution Hints:**
- Create promise: \`Promise::new(contract_id)\`
- Add call: \`.function_call(method_name, b"{}".to_vec(), NearToken::from_yoctonear(0), Gas::from_tgas(5))\`
- Return the promise (the \`.function_call()\` return value is the promise)
- Import: \`use near_sdk::{Promise, NearToken, Gas};\`

**JavaScript version:**
\`\`\`javascript
call_other_contract({ contract_id, method_name }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(contract_id)
        .functionCall(method_name, bytes(JSON.stringify({})), 0n, gas)
        .asReturn();
}
\`\`\`

**Key difference in JS:** You must call \`.asReturn()\` on the promise. The Rust SDK handles this implicitly when you return the Promise, but JS requires the explicit call.

[Learn more about NearPromise →](https://docs.near.org/build/contracts/cross-contract)`,
  },
];

export default simpleCallsExplanation;
