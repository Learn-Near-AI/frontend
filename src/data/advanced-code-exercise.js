export const advancedCodeExerciseExplanation = [
  {
    title: 'Advanced Code Exercise — Master Challenge!',
    content: `This exercise combines everything you've learned from the Advanced section. The contract below has **8 bugs** that you need to find and fix.

Each bug relates to a specific advanced topic you covered:

---

**Bug 1 — Owner Pattern**
The \`get_owner\` method needs to properly clone the AccountId before returning.

---

**Bug 2 — Pausable Contract**
The contract should check if it's paused before allowing state changes.

---

**Bug 3 — Role-Based Access**
The \`is_admin\` method should properly check if the predecessor is owner or admin.

---

**Bug 4 — Events**
When adding items, an event should be emitted to notify external systems.

---

**Bug 5 — Collections: Map**
Balance operations should use safe arithmetic to prevent overflow/underflow.

---

**Bug 6 — Collections: Vector**
Item additions should check if the contract is paused.

---

**Bug 7 — Multi-Signature**
The \`vote\` method should only allow authorized signers (admins) to vote.

---

**Bug 8 — Error Handling**
All methods should properly handle errors and emit appropriate events.

---

**How to Complete:**
1. Read each method carefully
2. Identify what's wrong
3. Fix the bugs (compile after each fix to check)
4. Deploy when all bugs are fixed

Good luck, Advanced Developer!`,
  },
];
