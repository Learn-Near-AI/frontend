export const errorHandlingDetailedExplanation = {
  'error-handling': [
    {
      title: 'The Challenge',
      content: `Your task is to implement different error handling patterns in a contract.

**Requirements:**
- Implement \`try_parse_number(s: String) -> Option<u64>\` - returns Some(parsed) if valid, None if invalid
- Implement \`safe_divide(a: u64, b: u64) -> Option<u64>\` - returns None if b is 0
- Implement \`parse_with_default(s: String, default: u64) -> u64\` - uses unwrap_or for fallback
- Implement \`assert_positive(value: i64)\` - panics if not positive using require!
- Implement \`strict_check(value: u64)\` - panics if value is 0 using env::panic_str

**Test:**
Call these with invalid inputs and see how each handles errors differently!`,
    },
    {
      title: 'Hints',
      content: `**The Problem:**
Sometimes things fail. Parsing can fail. Division by zero exists. You need different strategies for different failure modes.

**Code Snippet:**
\`\`\`rust
use near_sdk::near;
use near_sdk::{env, require, PanicOnDefault};

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }

    pub fn try_parse_number(&self, s: String) -> Option<u64> {
        // Try to parse, return None if it fails
    }

    pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
        // Check for zero first
    }

    pub fn parse_with_default(&self, s: String, default: u64) -> u64 {
        // Parse with fallback
    }

    pub fn assert_positive(&self, value: i64) {
        // Panic if not positive
    }

    pub fn strict_check(&self, value: u64) {
        // Panic if zero - critical error
    }
}
\`\`\`

**Solution Hints:**
- Parse: \`s.parse().ok()\` returns Option
- Safe divide: check \`b == 0\` first, return None if true
- Default: \`.parse().unwrap_or(default)\`
- Assert: \`require!(value > 0, "message")\`
- Strict: \`if value == 0 { env::panic_str("ZERO_NOT_ALLOWED") }\`

**When to use what:**
Option/None is for "might not have a value" - caller decides what to do. require! is for "you violated a rule" - user error, clear message. env::panic_str is for "this should NEVER happen" - critical failure.

The difference between i64 and u64? i64 can be negative. That's why assert_positive uses i64 - to catch when someone accidentally passes -5. For counters and most things, use u64 because negatives don't make sense.

And division by zero? In Rust it PANICS. The whole contract crashes. That's why you MUST check first. Never assume input is valid.

---

[Learn more about this topic →](https://docs.near.org/smart-contracts/security/welcome)`,
    },
  ],
};

export const getErrorHandlingDetailedExplanation = (exampleId) =>
  errorHandlingDetailedExplanation[exampleId] ?? null;
