export const callbacksExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a cross-contract call with a callback — call an external contract, then process the result in your own contract.

**Requirements:**
- Implement \`call_then_callback(contract_id)\` — calls \`get_value\` on external contract, then calls \`on_result\` on self
- Implement \`on_result() -> u64\` — reads \`env::promise_result(0)\` and returns the value or 0
- Use \`.then()\` to chain the callback after the external call
- Us\`PromiseResult::Successful\` and \`PromiseResult::Failed\` to handle both outcomes

**Test:** If the external call succeeds, \`on_result\` returns the value; if it fails, it returns 0!`,
  },
  {
    title: 'The Boomerang!',
    content: `A callback is like throwing a **boomerang**. You throw it to a target (external contract), it hits the target, and then returns to your hand with information.

On NEAR, cross-contract calls are asynchronous. Your contract schedules the call and moves on. But what if you need the RESULT of that call? That's where callbacks come in.

**The flow:**
1. Your contract calls \`contract_a.get_value()\`
2. \`contract_a\` executes and produces a result
3. NEAR's runtime calls your \`on_result()\` callback
4. Your callback reads the result and acts on it

**Why not just return the value directly?** Because cross-contract calls are async. Your method finishes before the remote call executes. The callback pattern lets you pick up the result in a second invocation of your contract.

**This is the foundation of:**
- Oracles that fetch external data and process it
- Multi-step DeFi operations (swap → deposit → stake)
- Token transfer verification (transfer → confirm balance)
- Any flow where result B depends on call A completing`,
  },
  {
    title: 'The .then() Chain',
    content: `The \`.then()\` method chains a callback that executes after the preceding promise completes:

\`\`\`rust
pub fn call_then_callback(&self, contract_id: AccountId) -> Promise {
    Promise::new(contract_id.clone())
        .function_call(
            "get_value".to_string(),
            b"{}".to_vec(),
            NearToken::from_yoctonear(0),
            Gas::from_tgas(10)
        )
        .then(
            Promise::new(env::current_account_id())
                .function_call(
                    "on_result".to_string(),
                    b"{}".to_vec(),
                    NearToken::from_yoctonear(0),
                    Gas::from_tgas(10)
                )
        )
}
\`\`\`

**How the chain works:**
1. \`Promise::new(contract_id)\` — targets the external contract
2. \`.function_call("get_value", ...)\` — schedules the remote call
3. \`.then(...)\` — registers a callback to run after step 2 completes
4. The inner \`Promise::new(env::current_account_id())\` — targets YOUR contract for the callback
5. The callback calls \`on_result\` — the method that reads the remote result

**Key points about \`.then()\`:**
- The callback runs regardless of whether the outer promise succeeded or failed
- The callback receives the result (or error) via \`env::promise_result(0)\`
- \`promise_result(0)\` refers to the result of the FIRST promise in the chain (index 0)
- You must attach enough gas for BOTH the remote call AND the callback

**Why \`env::current_account_id()\`?** The callback needs to call a method on YOUR contract. You use \`current_account_id()\` to say "call back to me" — the contract is targeting itself for the second hop.`,
  },
  {
    title: 'Reading the Remote Result',
    content: `The callback method reads the result of the preceding promise:

\`\`\`rust
pub fn on_result(&self) -> u64 {
    match env::promise_result(0) {
        near_sdk::PromiseResult::Successful(data) => {
            u64::try_from_slice(&data).unwrap_or(0)
        }
        _ => 0,
    }
}
\`\`\`

**\`env::promise_result(0)\`** returns a \`PromiseResult\` enum with two variants:
- \`PromiseResult::Successful(Vec<u8>)\` — the remote call succeeded and returned data
- \`PromiseResult::Failed\` — the remote call failed (panicked, ran out of gas, etc.)

**The index matters.** \`promise_result(0)\` reads the result of the first promise in the chain. If you chain multiple calls, each gets a sequential index:
- Index 0: the first promise in the chain
- Index 1: the second promise (if chained)
- And so on...

**Deserializing the result:**
- The result comes as raw bytes (\`Vec<u8>\`)
- You deserialize using \`BorshDeserialize\` or manual parsing
- In this example, we expect a \`u64\` — we use \`u64::try_from_slice(&data)\`
- If deserialization fails, \`unwrap_or(0)\` provides a safe default

**The \`use near_sdk::borsh::BorshDeserialize\` import** is needed for \`try_from_slice\`. This is the only example in Cross-Contract that requires it.`,
  },
  {
    title: 'Success & Failure Handling',
    content: `Your callback must handle both success and failure of the remote call:

\`\`\`rust
match env::promise_result(0) {
    near_sdk::PromiseResult::Successful(data) => {
        // Remote call succeeded! Process the data
        u64::try_from_slice(&data).unwrap_or(0)
    }
    near_sdk::PromiseResult::Failed => {
        // Remote call failed! Handle gracefully
        // Return 0, emit an event, or panic
        0
    }
}
\`\`\`

**Why handle failures?** The remote call might fail for many reasons:
- The target contract doesn't exist
- The method name is wrong
- The target contract panicked
- The target ran out of gas
- The target was deleted

**Your options when the remote call fails:**
1. **Return a default value** (this example) — safe, but the caller doesn't know it failed
2. **Panic** — revert the ENTIRE transaction (including the caller's state changes)
3. **Emit an event** — log the failure for off-chain monitoring

**The JavaScript version** uses try/catch instead of match:

\`\`\`javascript
on_result() {
    try {
        const result = near.promiseResultRaw(0);
        if (result && result.length >= 8) {
            return Number(new DataView(result.buffer, result.byteOffset, 8).getBigUint64(0, true));
        }
    } catch (_) {
        // promiseResultRaw throws on failed promise
    }
    return 0;
}
\`\`\`

**Important:** \`near.promiseResultRaw(0)\` throws an exception if the promise failed. You must catch it to handle failures gracefully.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Callbacks give you control over cross-contract results. Without them, you'd fire-and-forget, never knowing if the remote call succeeded.

**Advantages of callbacks:**
- You can process remote results (transform, validate, store)
- You can handle failures gracefully (retry, alert, fallback)
- You can chain multiple operations (step A → step B → step C)
- You can verify state changes that happened remotely

**Disadvantages:**
- **Double the gas cost** — the remote call + the callback each consume gas
- **Two transaction phases** — the callback is a separate execution step, increasing complexity
- **State dependency** — the callback runs in a new execution context; state might have changed
- **Promise index management** — with complex chains, tracking which promise_result(index) is which gets confusing

**Callback vs. Promise::and:**
- \`.then()\` = sequential (call A completes, then callback runs)
- \`Promise::and()\` = parallel (call A and call B run concurrently)
- Use \`.then()\` when B DEPENDS on A's result
- Use \`Promise::and()\` when A and B are independent

**For this example, \`.then()\` is mandatory** because \`on_result\` needs to read the result of the \`get_value\` call. You can't read a remote result without a callback.`,
  },
  {
    title: "Don't Do This!",
    content: `Reading the wrong promise index:

\`\`\`rust
// BAD: Reading index 1 when the remote result is at index 0
pub fn on_result(&self) -> u64 {
    match env::promise_result(1) {  // Wrong index!
        // ...
    }
}
\`\`\`

\`promise_result(0)\` is ALWAYS the first promise in the current chain. If you call \`promise_result(1)\`, you're reading a result that doesn't exist — it will return \`PromiseResult::Failed\`.

**Ignoring remote failures entirely:**
\`\`\`rust
// BAD: Only handles success, panics on failure
pub fn on_result(&self) -> u64 {
    let data = match env::promise_result(0) {
        near_sdk::PromiseResult::Successful(data) => data,
        _ => panic!("Remote call failed!"),  // Reverts everything
    };
    u64::try_from_slice(&data).unwrap()
}
\`\`\`

Panicking in a callback reverts ALL state changes from the entire transaction. The external call might have succeeded, but your contract's state goes back to before it all started. Sometimes that's what you want (atomic operations). Often it's not.

**Forgetting gas for the callback:**
\`\`\`rust
// BAD: No gas allocated for the callback
.then(
    Promise::new(env::current_account_id())
        .function_call("on_result", args, deposit, Gas::from_tgas(0))  // 0 gas!
)
\`\`\`

The callback needs its OWN gas to execute. If you give it 0, it will fail with "not enough gas." Always allocate gas for both the remote call AND the callback.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Call \`get_value\` on an external contract, then process the result in a callback on your own contract.

**Code Snippet:**
\`\`\`rust
pub fn call_then_callback(&self, contract_id: AccountId) -> Promise {
    // TODO: Call get_value on contract_id
    // TODO: Chain a callback to on_result on self
}

pub fn on_result(&self) -> u64 {
    // TODO: Read promise_result(0)
    // TODO: Return u64 on success, 0 on failure
}
\`\`\`

**Solution Hints:**
- External call: \`Promise::new(contract_id).function_call("get_value".to_string(), b"{}".to_vec(), NearToken::from_yoctonear(0), Gas::from_tgas(10))\`
- Chain callback: \`.then(Promise::new(env::current_account_id()).function_call("on_result".to_string(), b"{}".to_vec(), NearToken::from_yoctonear(0), Gas::from_tgas(10)))\`
- Read result: \`match env::promise_result(0) { near_sdk::PromiseResult::Successful(data) => u64::try_from_slice(&data).unwrap_or(0), _ => 0 }\`
- Import: \`use near_sdk::borsh::BorshDeserialize;\`

**JavaScript version:**
\`\`\`javascript
call_then_callback({ contract_id }) {
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 3));
    const args = bytes(JSON.stringify({}));
    return NearPromise.new(contract_id)
        .functionCall("get_value", args, 0n, gas)
        .then(NearPromise.new(near.currentAccountId()).functionCall("on_result", args, 0n, gas))
        .asReturn();
}

on_result() {
    try {
        const result = near.promiseResultRaw(0);
        if (result && result.length >= 8) {
            return Number(new DataView(result.buffer, result.byteOffset, 8).getBigUint64(0, true));
        }
    } catch (_) {}
    return 0;
}
\`\`\`

[Learn more about cross-contract callbacks →](https://docs.near.org/build/contracts/cross-contract)`,
  },
];

export default callbacksExplanation;
