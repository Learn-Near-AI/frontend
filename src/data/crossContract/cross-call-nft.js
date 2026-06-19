export const crossCallNftExplanation = [
  {
    title: 'The Challenge',
    content: `Your task is to implement a cross-contract call to a NEP-171 NFT contract — transferring an NFT from one owner to another via your contract.

**Requirements:**
- Implement \`nft_transfer_call(nft_contract, receiver_id, token_id)\` — calls \`nft_transfer_call\` on an NFT contract
- Use \`Promise::new()\` and \`.function_call()\`
- Attach exactly **1 yoctoNEAR** deposit (required by NEP-171)
- Format arguments as JSON: \`receiver_id\`, \`token_id\`, \`memo\` (null), \`msg\` (empty string)
- Use \`Gas::from_tgas(10)\` for the remote call

**Test:** The NFT must be transferred after approval is granted!`,
  },
  {
    title: 'The NFT Delivery!',
    content: `Non-Fungible Tokens (NFTs) are unique digital assets — each one is different from every other. On NEAR, they follow the **NEP-171 standard**, similar to Ethereum's ERC-721.

Think of this as a **courier service** for rare collectibles. A collector (the marketplace or your contract) arranges delivery of a specific NFT from the seller to the buyer. The courier doesn't own the collectible — they just facilitate the handoff.

In this scenario:
- **Your contract** is the courier (orchestrating the transfer)
- **The NFT contract** is the vault holding the tokens
- **\`nft_transfer_call\`** is the "deliver with signature" method
- **The msg field** carries instructions for the receiver's contract

**Why \`nft_transfer_call\` instead of \`nft_transfer\`?**
- \`nft_transfer\` — simple transfer, no callback to the receiver
- \`nft_transfer_call\` — transfer + calls \`nft_on_transfer\` on the receiver (if it's a contract)
- Use \`nft_transfer_call\` when the receiver needs to react to receiving the NFT (e.g., a marketplace marking an auction as fulfilled)`,
  },
  {
    title: 'NEP-171 Transfer Call Arguments',
    content: `The \`nft_transfer_call\` method takes carefully structured arguments:

\`\`\`rust
pub fn nft_transfer_call(&self, nft_contract: AccountId, receiver_id: AccountId, token_id: String) -> Promise {
    let args = format!(
        r#"{{"receiver_id":"{}","token_id":"{}","memo":null,"msg":""}}"#,
        receiver_id, token_id
    );
    Promise::new(nft_contract)
        .function_call(
            "nft_transfer_call".to_string(),
            args.into_bytes(),
            NearToken::from_yoctonear(1),
            Gas::from_tgas(10),
        )
}
\`\`\`

**The four arguments:**
- \`receiver_id\` — who gets the NFT
- \`token_id\` — which NFT to transfer (as a string)
- \`memo\` — optional note (null in this example)
- \`msg\` — cross-contract message for the receiver's \`nft_on_transfer\` (empty string here)

**The sender** is implicitly \`env::predecessor_account_id()\` — YOUR contract account. So YOUR contract must be approved by the current owner to transfer this NFT.

**The prerequisite:** Before calling \`nft_transfer_call\`, the current owner must have called \`nft_approve(token_id, your_contract_account)\` on the NFT contract. Without approval, the NFT contract rejects the transfer.

**The return value** is a boolean (\`true\` if the receiver accepted the NFT via \`nft_on_transfer\`). In this simple example, we don't process the return — we just fire-and-forget the promise.`,
  },
  {
    title: 'The 1 yoctoNEAR Rule',
    content: `NEP-171 requires **exactly 1 yoctoNEAR** to be attached to all transfer calls:

\`\`\`rust
NearToken::from_yoctonear(1)
\`\`\`

**This is the same rule as NEP-141 (FT) transfers.** The 1 yoctoNEAR deposit serves multiple purposes:
- **Spam prevention** — each call costs the caller, making mass-transfer attacks expensive
- **Proof of account** — proves the caller controls a real account
- **Storage coverage** — compensates the network for updating ownership records
- **Standard compliance** — wallets and indexers expect this; break it and your contract won't be recognized

**This is NOT payment for the NFT.** The actual value exchange happens off-chain or in a separate transaction. The 1 yoctoNEAR is a protocol-level fee for the transfer operation itself.

**If you call \`nft_transfer\` instead of \`nft_transfer_call\`**, the 1 yoctoNEAR rule still applies. Both NEP-171 transfer methods require the deposit. The difference is only in whether the receiver gets a callback.`,
  },
  {
    title: 'Tradeoffs (Nothing Is Perfect!)',
    content: `Cross-contract NFT calls are how marketplaces, games, and DeFi protocols move NFTs between users. It's the backbone of the NFT ecosystem.

**Advantages:**
- **Standardized** — works with any NEP-171 contract
- **Secure** — the NFT contract validates ownership and approval
- **Flexible** — \`nft_transfer_call\` enables receiver-side logic
- **Auditable** — full on-chain transfer history

**\`nft_transfer\` vs \`nft_transfer_call\`:**
- \`nft_transfer\` — simpler, fewer cross-contract hops, lower gas
- \`nft_transfer_call\` — enables \`nft_on_transfer\` callback on receiver, useful for smart contract interactions

**Limitations:**
- **Pre-approval required** — the owner must approve your contract before you can transfer
- **Two-step flow** — approve, then transfer; can't be combined into one atomic transaction
- **1 yoctoNEAR overhead** — small but required per call
- **Token-specific** — each NFT contract is separate; no cross-contract batch operations

**When to use \`nft_transfer_call\`:**
- Transferring to a marketplace that needs to update listings
- Transferring to a game that needs to equip the NFT
- Transferring to an escrow contract

**When to use \`nft_transfer\`:**
- Simple transfers to user wallets
- When the receiver is a plain account (not a contract)
- Gas-optimized transfers`,
  },
  {
    title: "Don't Do This!",
    content: `Using \`nft_transfer\` instead of \`nft_transfer_call\` when the receiver expects the callback:

\`\`\`rust
// BAD: Simple transfer — the receiver contract won't know it received an NFT
Promise::new(nft_contract)
    .function_call("nft_transfer", args, deposit, gas)
\`\`\`

If the receiver is a contract that tracks owned NFTs (like a wallet or marketplace), it won't be notified. The NFT arrives silently. \`nft_transfer_call\` triggers \`nft_on_transfer\` on the receiver, letting them react.

**Wrong argument format:**
\`\`\`rust
// BAD: Missing msg field — nft_transfer_call requires it
let args = format!(
    r#"{{"receiver_id":"{}","token_id":"{}"}}"#,  // No memo, no msg!
    receiver_id, token_id
);
\`\`\`

NEP-171 expects exactly these fields: \`receiver_id\`, \`token_id\`, \`memo\` (nullable), \`msg\` (string, at least empty). Missing fields cause a JSON parse error on the NFT contract.

**Calling without approval:**
\`\`\`rust
// BAD: Sender hasn't been approved — transfer will fail
// Current owner must first call: nft_contract.approve(token_id, your_contract)
\`\`\`

The NFT contract checks \`env::predecessor_account_id()\` against the approved accounts. If YOUR contract isn't approved, the call returns \`PromiseResult::Failed\`. Always ensure approval is in place before calling the transfer.`,
  },
  {
    title: 'Hints',
    content: `**The Problem:**
Call \`nft_transfer_call\` on a NEP-171 NFT contract to transfer a token.

**Code Snippet:**
\`\`\`rust
pub fn nft_transfer_call(&self, nft_contract: AccountId, receiver_id: AccountId, token_id: String) -> Promise {
    // TODO: Format args as JSON: receiver_id, token_id, memo (null), msg ("")
    // TODO: Create promise to call nft_transfer_call with 1 yoctoNEAR deposit
}
\`\`\`

**Solution Hints:**
- Args format: \`format!(r#"{{"receiver_id":"{}","token_id":"{}","memo":null,"msg":""}}"#, receiver_id, token_id)\`
- Promise: \`Promise::new(nft_contract).function_call("nft_transfer_call".to_string(), args.into_bytes(), NearToken::from_yoctonear(1), Gas::from_tgas(10))\`
- No callback in this example (fire-and-forget)
- Pre-requisite: The NFT owner must have approved YOUR contract beforehand via \`nft_approve\`

**JavaScript version:**
\`\`\`javascript
nft_transfer_call({ nft_contract, receiver_id, token_id }) {
    const args = bytes(JSON.stringify({ receiver_id, token_id, memo: null, msg: "" }));
    const gas = BigInt(Math.floor(Number(near.prepaidGas()) / 2));
    return NearPromise.new(nft_contract)
        .functionCall("nft_transfer_call", args, 1n, gas)
        .asReturn();
}
\`\`\`

**Note:** In the JavaScript version, the arguments are passed as a destructured object (same fields: \`receiver_id\`, \`token_id\`, \`memo\`, \`msg\`).

[Learn more about NEP-171 →](https://docs.near.org/build/contracts/nfts/nep-171)`,
  },
];

export default crossCallNftExplanation;
