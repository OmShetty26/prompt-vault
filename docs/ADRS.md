# `docs/ADRS.md`

## ADR-001 — Use Tiptap for Prompt Editing

**Status:** Accepted

**Context:** Variables such as `{{company}}` must behave as interactive editor elements.

**Decision:** Use Tiptap/ProseMirror with custom Variable nodes and React NodeViews.

**Why:** Gives structured editor state and extensible interactive variables.

**Alternatives:** Plain textarea; manually managed `contentEditable`.

**Tradeoff:** More editor/library complexity.

---

## ADR-002 — Persist Plain Prompt Templates

**Status:** Accepted

**Context:** Tiptap internally uses structured nodes, but backend storage should remain simple.

**Decision:** Store prompts as plain `{{variable}}` text and deserialize them when loading.

**Why:** Keeps persistence independent from Tiptap and human-readable.

**Alternatives:** Store Tiptap JSON.

**Tradeoff:** Requires custom serialization/deserialization.

---

## ADR-003 — Keep Variable Values Transient

**Status:** Accepted

**Context:** Filled variable values belong to one compilation session, not the reusable template.

**Decision:** Persist variable names but not entered values.

**Why:** Prevents old values from contaminating future uses.

**Tradeoff:** Values disappear when the editor session resets.

---

## ADR-004 — Use One Prompt State

**Status:** Accepted

**Context:** Pinned/Recent views contain the same underlying prompts.

**Decision:** Store one `prompts` array and derive other views.

**Why:** Prevents duplicated state and synchronization bugs.

**Alternative:** Separate pinned/recent state arrays.

**Tradeoff:** Small derived computations occur on render.

---

## ADR-005 — Separate Auth Pages from App Layout

**Status:** Accepted

**Context:** Login/Register require full-screen layouts while app pages require a persistent sidebar.

**Decision:** Use public auth routes plus a protected shared `AppLayout`.

**Why:** Keeps layout responsibilities clean and avoids manually hiding the sidebar.

**Tradeoff:** Requires nested/layout routing.

---

## ADR-006 — Use Explicit Authentication Status

**Status:** Accepted

**Context:** On refresh, React does not yet know whether a valid cookie exists.

**Decision:** Use `checking / authenticated / unauthenticated` plus `currentUser`.

**Why:** Prevents incorrect redirects and UI flashing.

**Alternative:** Infer authentication only from `currentUser`.

**Tradeoff:** Slightly more state.
