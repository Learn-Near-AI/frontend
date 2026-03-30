export const getBasicsCodeExerciseDetailedExplanation = () => [
  {
    title: 'Code Exercise — Fix the Bugs!',
    content: `This exercise combines everything you've learned from the Basics section. The contract below has **8 bugs** that you need to find and fix.

Each bug relates to a specific topic you covered:

---

**Bug 1 — State Management**
The \`get_counter\` method returns a hardcoded \`99\` instead of the actual counter value.

---

**Bug 2 — View Methods**
The \`get_greeting\` method has the wrong return type (\`u64\` instead of \`String\`) and returns a number instead of a greeting string.

---

**Bug 3 & 4 — Change Methods (Access Control)**
Both \`set_counter\` and \`reset_counter\` allow anyone to call them. Only the contract owner should be able to modify the counter.

---

**Bug 5 — Input Validation**
The \`add_record\` method accepts empty strings. Add validation to reject empty records.

---

**Bug 6 — Input Validation**
The \`get_record\` method doesn't check if the index is valid. Add bounds checking and panic if out of range.

---

**Bug 7 — Error Handling**
The \`safe_add\` method doesn't handle overflow. Change the return type to \`Option<u64>\` and return \`None\` when overflow occurs.

---

**Bug 8 — Error Handling**
The \`try_parse\` method always returns \`None\`. Implement proper parsing that returns \`Some(value)\` when successful.

---

**How to Complete:**
1. Read each method carefully
2. Identify what's wrong
3. Fix the bugs (compile after each fix to check)
4. Deploy when all bugs are fixed

Good luck!`,
  },
];
