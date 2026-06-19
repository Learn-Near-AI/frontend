export const batchCallsExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement chained (sequential) cross-contract calls — calling multiple contracts one after another, where each call waits for the previous one to complete.

**Requirements:**
- Implement \`batch_call(contract_a, contract_b)\` — calls \`get_value\` on contract_a, then on contract_b
- Use \`.then()\` to chain the second call after the first completes
- Allocate \`Gas::from_tgas(10)\` per call
- Return the chained promise

**Test:** Contract_a must execute before contract_b, and both must succeed!`,
  },
  {
    title: 'The Relay Race!',
    content: `Sequential cross-contract calls are like a **relay race**. Runner A (contract_a) runs their leg, then passes the baton (the promise result) to Runner B (contract_b), who runs their leg.

Each contract executes in order. Contract_b doesn't start until contract_a finishes. The baton pass is the \`.then()\` method — it connects the two calls.

**Why sequence calls instead of making them parallel?**
- Call B depends on Call A's result
- You need ordered execution (A must happen before B)
- You want to pass state from A to B
- You're building a pipeline (transform → validate → store)

**Real-world uses:**
- **DeFi route** — Swap token A → Swap token B → Stake LP tokens
- **Onboarding flow** — Mint NFT → Transfer to user → Update whitelist
- **Multi-sig** — Verify signature 1 → Verify signature 2 → Execute
- **Oracle pipeline** — Fetch price → Apply discount → Execute trade

Each step depends on the previous one. If any step fails, the chain stops.`,
  },
  {
    title: 'Chaining with .then()',
    content: `The \`.then()\` method chains promises sequentially:

\`\`\`rust
pub fn batch_call(&self, contract_a: AccountId, contract_b: AccountId) -> Promise {
    let gas_per_call = Gas::from_tgas(10);

    Promise::new(contract_a)
        .function_call(
            "get_value".to_string(),
            b"{}".to_vec(),
            NearToken::from_yoctonear(0),
            gas_per_call
        )
        .then(
            Promise::new(contract_b)
                .function_call(
                    "get_value".to_string(),
                    b"{}".to_vec(),
                    NearToken::from_yoctonear(0),
                    gas_per_call
                )
        )
}
\`\`\`

**How the chain executes:**
1. \`Promise::new(contract_a)\` — target the first contract
2. \`.function_call("get_value", ...)\` — describe the first call
3. \`.then(...)\` — register the second call to run after the first
4. The inner \`Promise::new(contract_b)\` — target the second contract
5. Its \`.function_call("get_value", ...)\` — describe the second call

**Execution order:** contract_a.get_value() → (completes) → contract_b.get_value() → (completes) → transaction ends

**Promise::and vs .then():**
- \`Promise::and(a, b)\` — a and b run in PARALLEL, both start at the same time
- \`.then()\` — a runs, then b runs SEQUENTIALLY, b waits for a

**For this example, \`.then()\` ensures ordering.** If we used \`Promise::and()\`, both \`get_value\` calls would execute simultaneously — not what we want when order matters.

**The JavaScript version** uses the same \`.then()\` pattern:
\`\`\`javascript
return NearPromise.new(contract_a)
    .functionCall("get_value", args, 0n, gas)
    .then(NearPromise.new(contract_b).functionCall("get_value", args, 0n, gas))
    .asReturn();
\`\`\``,
  },
  {
    title: 'Parallel vs Sequential',
    content: `Choosing between parallel and sequential execution is a key design decision:

**Parallel — \`Promise::and()\`:**
\`\`\`rust
Promise::and(
    Promise::new(contract_a).function_call("get_value", args_a, deposit, gas),
    Promise::new(contract_b).function_call("get_value", args_b, deposit, gas),
)
\`\`\`

- Both calls execute at the same time
- Total time = max(time_a, time_b)
- If either fails, the other is also reverted
- Call results are available at promise_result(0) and promise_result(1)

**Sequential — \`.then()\`:**
\`\`\`rust
Promise::new(contract_a).function_call("get_value", args, deposit, gas)
    .then(Promise::new(contract_b).function_call(...))
\`\`\`

- Calls execute one after another
- Total time = time_a + time_b
- B can use A's result (via callback)
- Callback always executes regardless of A's result; use promise_result to check success

**When to use each:**

| Scenario | Pattern |
|---|---|
| Independent calls (fetch prices from 2 oracles) | \`Promise::and()\` |
| Calls where order doesn't matter | \`Promise::and()\` |
| B depends on A's result | \`.then()\` |
| You need sequential guarantees | \`.then()\` |
| Gas optimization (shorter total time) | \`Promise::and()\` |
| Complex multi-step workflows | \`.then()\` chain |

**For this example**, we use sequential because it demonstrates the chaining pattern, even though the two \`get_value\` calls are independent. In practice, independent calls should use \`Promise::and()\` for efficiency.`,
  },
  {
    title: 'Gas Distribution',
    content: `When chaining multiple calls, gas management is critical:

\`\`\`rust
let gas_per_call = Gas::from_tgas(10);  // 10 TGas per call
// Total gas for remote calls: 10 + 10 = 20 TGas
// Remaining gas: prepaid_gas - your_execution - 20 TGas
\`\`\`

**The gas budget for a chained call:**
1. Your method's execution (validation, state reads)
2. Remote call 1 (gas you attach)
3. Remote call 2 (gas you attach)
4. ...any additional calls
5. Any callback execution

**Total remote gas = sum of all \`Gas::from_tgas(N)\`** for each call in the chain. Each call consumes gas independently — they don't share a pool.

**Safe allocation strategy:**
- Estimate each remote call's gas need (view: 3-5 TGas, write: 5-10 TGas)
- Add 20% safety margin per call
- Ensure total <= prepaid_gas - your_execution_overhead
- Leave room for callbacks if needed

**The trick with chaining:** Later calls in the chain might have LESS gas available if the earlier calls consumed more than expected. In practice, the gas you attach to \`.function_call()\` is the MAXIMUM — unused gas is NOT returned for later calls in the chain. Each call gets its own allocation.

**For the JavaScript version:**
\`\`\`javascript
const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 3));
\`\`\`

This divides the prepaid gas by 3 (one part for current execution, one per remote call), which is a simpler but less precise approach than the Rust version's explicit \`Gas::from_tgas(10)\`.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Sequential chaining gives you ordered, dependable execution across multiple contracts. It's the foundation for complex cross-contract workflows.

**Advantages:**
- **Guaranteed ordering** — each step waits for the previous one
- **No race conditions** — B can't execute before A finishes
- **Clear failure semantics** — if A fails, B never runs
- **Simple reasoning** — the execution path is linear and predictable

**Disadvantages:**
- **Slower** — total time = sum of all call times, not max
- **More gas** — each call pays its own overhead
- **Partial failure risk** — if call 2 of 5 fails, calls 1-4 already executed
- **No parallelism** — independent calls waste time running sequentially

**Sequential vs. Parallel tradeoff:**
- 2 independent calls, each 1 second: sequential = 2s, parallel = 1s
- 2 dependent calls, each 1 second: sequential = 2s, parallel = impossible
- The cost difference grows linearly with more calls

**When NOT to chain:**
- When calls are independent (use \`Promise::and()\` instead)
- When you don't need ordering guarantees
- When total gas would exceed the 300 TGas limit
- When latency matters (sequential = add the delays)

**For this example**, the two calls are independent \`get_value\` reads. In production, you'd use \`Promise::and()\` for efficiency. The sequential pattern is demonstrated here to teach the chaining mechanism — the same pattern you'd use when calls truly depend on each other.`,
  },
  {
    title: "Don't Do This!",
    content: `Running out of gas mid-chain:

\`\`\`rust
// BAD: Attaching too much gas to the first call, not enough for the second
let gas = Gas::from_tgas(200);  // 200 TGas on the first call!
Promise::new(contract_a)
    .function_call("get_value", args, deposit, gas)
    .then(Promise::new(contract_b)
        .function_call("get_value", args, deposit, gas)  // Only 100 TGas left!
    )
\`\`\`

If prepaid gas is 300 TGas and you allocate 200 to call A, you have only 100 left for call B plus your own execution. If call B needs 10 TGas but you have none left, call B fails.

**Using .then() where Promise::and() would suffice:**
\`\`\`rust
// BAD: Sequential when calls are independent — wastes time
return Promise::new(a).function_call(...)
    .then(Promise::new(b).function_call(...));
// These calls don't depend on each other!
// Use Promise::and() instead for parallel execution
\`\`\`

Every nested \`.then()\` adds latency. If call A takes 2 seconds and call B takes 2 seconds, the user waits 4 seconds instead of 2.

**Forgetting to return the chained promise:**
\`\`\`rust
// BAD: Forgot to return — chain is built but never executes!
pub fn batch_call(&self, a: AccountId, b: AccountId) -> Promise {
    let result = Promise::new(a).function_call(...)
        .then(Promise::new(b).function_call(...));
    // Missing: return result;
}
\`\`\`

The chain is constructed but never scheduled. Both calls are silently dropped. Always return the final promise from your method.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Chain two cross-contract calls sequentially using \`.then()\`.

**Code Snippet:**
\`\`\`rust
pub fn batch_call(&self, contract_a: AccountId, contract_b: AccountId) -> Promise {
    let gas_per_call = Gas::from_tgas(10);
    // TODO: Create promise to call get_value on contract_a
    // TODO: Chain a second call to get_value on contract_b via .then()
}
\`\`\`

**Solution Hints:**
- First call: \`Promise::new(contract_a).function_call("get_value".to_string(), b"{}".to_vec(), NearToken::from_yoctonear(0), gas_per_call)\`
- Chain: \`.then(Promise::new(contract_b).function_call("get_value".to_string(), b"{}".to_vec(), NearToken::from_yoctonear(0), gas_per_call))\`
- Return the chained promise
- Import: \`use near_sdk::{Promise, NearToken, Gas};\`

**JavaScript version:**
\`\`\`javascript
batch_call({ contract_a, contract_b }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 3));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_a)
        .functionCall("get_value", args, 0n, gas)
        .then(NearPromise.new(contract_b).functionCall("get_value", args, 0n, gas))
        .asReturn();
}
\`\`\`

**Key differences from callbacks example:**
- No separate \`on_result\` callback method needed
- The chain just calls the next contract without processing results
- Gas is split evenly: 3 parts (this exec + call A + call B)

[Learn more about promise chaining →](https://docs.near.org/build/contracts/cross-contract)`,
  },
];

export default batchCallsExplanation;
