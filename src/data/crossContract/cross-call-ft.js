export const crossCallFtExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a cross-contract call to a NEP-141 Fungible Token contract — transferring tokens from your contract to a receiver.

**Requirements:**
- Implement \`ft_transfer_call(token_contract, receiver_id, amount)\` — calls \`ft_transfer\` on a token contract
- Use \`Promise::new()\` and \`.function_call()\`
- Attach exactly **1 yoctoNEAR** deposit (required by NEP-141)
- Format arguments as JSON: \`receiver_id\`, \`amount\` (as string), \`memo\` (null)
- Use \`Gas::from_tgas(10)\` for the remote call

**Test:** The FT transfer must complete successfully with sufficient balance!`,
  },
  {
    title: 'The Token Transfer!',
    content: `Fungible tokens (FTs) are interchangeable digital assets — like dollars, where every unit is the same. On NEAR, they follow the **NEP-141 standard**, similar to Ethereum's ERC-20.

Think of your contract as a **bank teller** helping a customer transfer money to another bank. The teller doesn't use their own money — they facilitate the transfer between accounts.

In this scenario:
- **Your contract** is the teller (facilitating the transfer)
- **The token contract** is the bank holding the balances
- **The receiver** is the customer receiving the funds
- **The amount** is... well, the amount

**Why call from your contract instead of directly?** Your contract might be:
- A marketplace paying sellers
- A DeFi protocol moving user funds
- A DAO distributing tokens
- A game awarding prizes

In all these cases, your contract orchestrates the transfer, calling the token contract on behalf of the user.`,
  },
  {
    title: 'NEP-141 FT Transfer',
    content: `The \`ft_transfer\` method transfers tokens from one account to another:

\`\`\`rust
pub fn ft_transfer_call(&self, token_contract: AccountId, receiver_id: AccountId, amount: String) -> Promise {
    let args = format!(
        r#"{{"receiver_id":"{}","amount":"{}","memo":null}}"#,
        receiver_id, amount
    );
    Promise::new(token_contract)
        .function_call(
            "ft_transfer".to_string(),
            args.into_bytes(),
            NearToken::from_yoctonear(1),
            Gas::from_tgas(10),
        )
}
\`\`\`

**The arguments format is critical:**
- \`receiver_id\` — the account receiving the tokens (as a JSON string)
- \`amount\` — the token amount as a **string** (to handle large numbers without precision loss)
- \`memo\` — optional note (can be null or a string)
- The args are JSON-serialized and passed as bytes (\`args.into_bytes()\`)

**Why \`amount\` is a String, not a number:**
- Token amounts can have many decimal places (often 18+)
- JSON numbers lose precision beyond ~2^53
- As a string, "1000000000000000000" preserves the exact value
- The token contract parses it into its internal representation (typically u128)

**Who is the sender?** NEP-141 \`ft_transfer\` uses \`env::predecessor_account_id()\` as the sender. So YOUR contract's account must have sufficient token balance. The user must first transfer tokens to your contract's account.`,
  },
  {
    title: 'The 1 yoctoNEAR Deposit',
    content: `NEP-141 requires **exactly 1 yoctoNEAR** to be attached to \`ft_transfer\` calls:

\`\`\`rust
NearToken::from_yoctonear(1)  // Exactly 1 yoctoNEAR!
\`\`\`

**Why 1 yoctoNEAR?** It's the "skin in the game" pattern:
- Proves the caller is a real account (not a replay attack)
- Covers storage costs for the balance change
- Makes spam attacks expensive (each spam call costs at least 1 yoctoNEAR)
- Standardized across all NEP-141 implementations

**1 yoctoNEAR ≈ 10⁻²⁴ NEAR** — it's essentially free for legitimate use. The gas cost of the transaction itself is far more expensive.

**Important:** If you attach 0 yoctoNEAR, the token contract WILL reject your call. If you attach more than 1 yoctoNEAR, some implementations might also reject (strict equality check). Always attach exactly 1.

**This is NOT payment for the tokens.** The 1 yoctoNEAR is a protocol fee, not the transfer amount. The actual tokens being transferred are determined by the \`amount\` argument.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Cross-contract FT transfers let your contract move token balances on behalf of users. This is essential for any DeFi, marketplace, or rewards system.

**Advantages:**
- **Standardized** — any NEP-141 token works the same way
- **Composable** — your contract can work with thousands of tokens
- **Safe** — the token contract validates the transfer, not your contract
- **Auditable** — every transfer is recorded on the token contract

**Limitations:**
- **Pre-approval needed** — the user must transfer tokens TO your contract first (your contract can't pull from their wallet)
- **One token per call** — you can't batch-transfer multiple token types in one call
- **1 yoctoNEAR overhead** — tiny but still an extra requirement
- **String amounts** — error-prone when handling decimal conversions client-side

**Resolved vs. raw amounts:**
- User-facing: "1.5 TOKEN"
- Contract-level: "1500000000000000000" (18 decimals)
- Your contract MUST use the raw amount (already resolved from user input)

**FT vs. NEAR transfers:**
- FT transfer: requires 1 yoctoNEAR, uses \`ft_transfer\`, amount as string
- NEAR transfer: no deposit needed, uses \`Promise::new(receiver).transfer(amount)\`, amount as NearToken

Choose FT when you need a specific token standard. Use native NEAR for the simplest value transfer.`,
  },
  {
    title: "Don't Do This!",
    content: `Sending the amount as a number instead of a string:

\`\`\`rust
// BAD: amount as u128, not string — JSON serialization will fail!
let args = format!(
    r#"{{"receiver_id":"{}","amount":{},"memo":null}}"#,
    receiver_id, amount_u128  // No quotes around amount!
);
\`\`\`

**Why it breaks:** NEP-141 expects \`"amount": "1000000"\` (string), not \`"amount": 1000000\` (number). The token contract will reject the call with a deserialization error.

**Forgetting the 1 yoctoNEAR deposit:**
\`\`\`rust
// BAD: No deposit — NEP-141 requires exactly 1 yoctoNEAR
Promise::new(token_contract)
    .function_call("ft_transfer", args, NearToken::from_yoctonear(0), gas)  // 0 deposit!
\`\`\`

The token contract's \`ft_transfer\` will panic immediately because \`env::attached_deposit() != 1 yoctoNEAR\`. The call fails silently (you get \`PromiseResult::Failed\`).

**Wrong method name:**
\`\`\`rust
// BAD: "transfer" is wrong — it's "ft_transfer"!
.function_call("transfer", args, deposit, gas)
//               ^^^^^^^^^ wrong name
\`\`\`

NEP-141 defines specific method names: \`ft_transfer\`, \`ft_transfer_call\`, \`ft_balance_of\`, \`ft_total_supply\`. Using wrong names will silently fail — the token contract simply has no matching method.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Call \`ft_transfer\` on a NEP-141 token contract to send tokens to a receiver.

**Code Snippet:**
\`\`\`rust
pub fn ft_transfer_call(&self, token_contract: AccountId, receiver_id: AccountId, amount: String) -> Promise {
    // TODO: Format args as JSON: receiver_id, amount (string), memo (null)
    // TODO: Create promise to call ft_transfer with 1 yoctoNEAR deposit
}
\`\`\`

**Solution Hints:**
- Args format: \`format!(r#"{{"receiver_id":"{}","amount":"{}","memo":null}}"#, receiver_id, amount)\`
- Promise: \`Promise::new(token_contract).function_call("ft_transfer".to_string(), args.into_bytes(), NearToken::from_yoctonear(1), Gas::from_tgas(10))\`
- The method returns \`Promise\` (no callback in this example)
- Import: \`use near_sdk::{Promise, NearToken, Gas};\`

**JavaScript version:**
\`\`\`javascript
ft_transfer_call({ token_contract, receiver_id, amount }) {
    const args = bytes(JSON.stringify({ receiver_id, amount, memo: null }));
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(token_contract)
        .functionCall("ft_transfer", args, 1n, gas)
        .asReturn();
}
\`\`\`

**Note:** The \`amount\` is already a string in the JavaScript version (received as a string from the caller).

[Learn more about NEP-141 →](https://docs.near.org/build/contracts/tokens/ft)`,
  },
];

export default crossCallFtExplanation;
