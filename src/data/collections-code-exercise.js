export const collectionsCodeExerciseExplanation = [
  {
    title: 'Collections Code Exercise — Master Challenge!',
    content: `This exercise combines everything you've learned from the Collections & Data section. The contract below has **8 bugs** that you need to find and fix.

Each bug relates to a specific collection pattern you covered:

---

**Bug 1 — Todo List (Input Validation)**
The \`add_todo\` method doesn't validate that the title is non-empty.

---

**Bug 2 — Todo List (Owner Check)**
The \`complete_todo\` method doesn't check that the caller owns the todo.

---

**Bug 3 — User Profiles (Self-Write)**
The \`set_profile\` method accepts an \`account\` parameter instead of using the caller's account.

---

**Bug 4 — User Profiles (Timestamp)**
The \`set_profile\` method doesn't record \`created_at\` using \`block_timestamp\`.

---

**Bug 5 — Voting System (Double-Vote)**
The \`vote\` method doesn't check if the caller has already voted.

---

**Bug 6 — Voting System (Counter)**
The \`vote\` method doesn't properly increment \`votes_yes\` or \`votes_no\`.

---

**Bug 7 — Simple Marketplace (Payment)**
The \`buy\` method doesn't check that \`attached_deposit >= price\`.

---

**Bug 8 — Batch Operations (Size Limit)**
The \`add_many\` method doesn't validate that \`items.len() <= MAX_BATCH\`.

---

**How to Complete:**
1. Read each method carefully
2. Identify what's wrong
3. Fix the bugs (compile after each fix to check)
4. Deploy when all bugs are fixed

Good luck, Collections & Data Master!`,
  },
];

export default collectionsCodeExerciseExplanation;
