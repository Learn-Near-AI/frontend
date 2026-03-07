export const errorHandlingDetailedExplanation = {
  'error-handling': [
    {
      title: 'Building Your Safety Net',
      content: `Even with the best gatekeeper (validation), sometimes things go wrong. Maybe:
- User sends "abc" when you expect a number
- User tries to divide by zero
- Something totally unexpected happens

That's where **error handling** comes in. It's your safety net - catching problems before they become disasters.

**What you'll build:**
A contract with different error handling patterns - returning Option, using require!, and panicking when needed!`,
    },
    {
      title: "The Naive Approach (Don't Do This!)",
      content: `What if you ignored errors?

\`\`\`rust
// BAD: No error handling!
pub fn divide(&self, a: u64, b: u64) -> u64 {
    // b could be 0 → PANIC!
    a / b
}
\`\`\`

**The problem:**
- Division by zero crashes contract
- No graceful failure
- User gets cryptic error
- Bad UX!

Handle errors explicitly!`,
    },
    {
      title: 'The Contract Setup',
      content: `Here's the contract we'll use - it's empty because we're focusing on error handling:

\`\`\`rust
use near_sdk::near;
use near_sdk::PanicOnDefault;

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct Contract {}

#[near]
impl Contract {
    #[init]
    pub fn new() -> Self {
        Self {}
    }
}
\`\`\`

No state needed! We're just exploring different ways to handle errors.`,
    },
    {
      title: 'Option<T> - The Graceful Way',
      content: `Sometimes a function might not have a value to return. That's where **Option** comes in:

\`\`\`rust
// Returns Some(value) if parsing succeeds, None if it fails
pub fn try_parse_number(&self, s: String) -> Option<u64> {
    s.parse().ok()
}
\`\`\`

**What's happening:**
- \`Option<u64>\` means "maybe a number, maybe nothing"
- \`.parse().ok()\` tries to parse the string; if it fails, returns None
- Caller can check: \`if let Some(n) = result { ... }\`

**How to use Option in your code:**
\`\`\`rust
let result = contract.try_parse_number("42".to_string());

if let Some(number) = result {
    // Success! number is now a u64
    near::log!("We got: {}", number);
} else {
    // Failed! result was None
    near::log!("Couldn't parse that!");
}
\`\`\`

**Why Option?**
- Graceful failure - doesn't crash, just says "I couldn't do that"
- Caller decides what to do with nothing
- Perfect for expected failures!`,
    },
    {
      title: 'Safe Division - Avoiding Crashes',
      content: `Division by zero is a classic error. Here's how to handle it:

\`\`\`rust
// Returns None if b is 0, otherwise Some(a / b)
pub fn safe_divide(&self, a: u64, b: u64) -> Option<u64> {
    if b == 0 { return None; }
    Some(a / b)
}
\`\`\`

**Why not just divide?**
In Rust, division by zero PANICS - the whole contract crashes! That's bad.

**The solution:** Check first, then divide. Return None if we can't do it safely.

**Alternative - with unwrap_or:**
\`\`\`rust
pub fn parse_with_default(&self, s: String, default: u64) -> u64 {
    s.parse().unwrap_or(default)
}
\`\`\`
If parsing fails, use the default value instead!`,
    },
    {
      title: 'require! - Panic With A Message',
      content: `Sometimes you WANT to panic - when something should NEVER happen:

\`\`\`rust
use near_sdk::{env, require};

// Panic if value is not positive
pub fn assert_positive(&self, value: i64) {
    require!(value > 0, "Value must be positive");
}

// Panic for critical failures
pub fn strict_check(&self, value: u64) {
    if value == 0 {
        env::panic_str("ZERO_NOT_ALLOWED");
    }
}
\`\`\`

> **Why i64 here?** We use \`i64\` (signed integer) for \`assert_positive\` because it allows NEGATIVE values! This lets us catch when someone accidentally passes a negative number. All other examples use \`u64\` (unsigned) because negative numbers don't make sense for counters, balances, etc.

**When to use each:**

**require!(condition, "message"):**
- For validation errors
- User's fault - they gave bad input
- Clear message helps them fix it

**env::panic_str("message"):**
- For programmer errors
- Something that should NEVER happen
- Critical failures that need attention`,
    },
    {
      title: 'Which One To Use?',
      content: `Here's when to use each approach:

**Option<T> (return None):**
- Expected failures - might work, might not
- Caller decides what to do
- Parsing, looking up data

**require! (panic with message):**
- Contract rules that must be followed
- User's fault
- "You can't do that" situations

**env::panic_str (hard panic):**
- Critical failures
- Something is seriously wrong
- The contract should NOT continue

**Golden rule:**
Fail gracefully when you can. Panic when you must. Always give clear error messages!`,
    },
    {
      title: 'The Design Insight',
      content: `**Why different error types?**

Different situations need different handling:

**Option<T>:**
- Expected to sometimes fail
- Caller handles None case
- Like searching: might find, might not

**require!:**
- Should not happen if input is valid
- But user might give bad input
- Clear message helps them fix it

**panic_str:**
- Should NEVER happen
- Bug in contract
- Need to investigate

Match the error type to the situation!`,
    },
    {
      title: 'Tradeoffs (Nothing Is Perfect!)',
      content: `Error handling has tradeoffs:

**OPTION gives you:**
- ✅ Graceful failures
- ✅ Caller decides what to do
- ✅ No crashes

**OPTION doesn't give you:**
- ❌ More code to handle None
- ❌ Might forget to check!

**REQUIRE gives you:**
- ✅ Clear error messages
- ✅ Stops bad data
- ✅ Simple to use

**PANIC gives you:**
- ✅ Catches critical bugs
- ✅ No continuing in bad state

**The insight:** Match error handling to the situation. Don't over-handle or under-handle!

**When NOT to use error handling:** When you're 100% sure the input is valid (internal calls) - but always at public boundaries!`,
    },
  ],
};

export const getErrorHandlingDetailedExplanation = (exampleId) =>
  errorHandlingDetailedExplanation[exampleId] ?? null;
