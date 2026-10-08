# `docs/ENGINEERING_MEMORY.md`

## Tiptap Variables
- **Problem:** Turn `{{variables}}` into interactive chips.
- **Approach:** Plain template → Variable nodes → React NodeViews.
- **Key concept:** Persistent variable name vs transient value.
- **Biggest bug:** Editor updates/reset behavior could preserve stale state.
- **Tradeoff:** More complexity for much stronger editor behavior.

## Compile & Copy
- **Problem:** Produce final prompt text only when variables are ready.
- **Approach:** Traverse nodes + custom compile serializer.
- **Key concept:** Stored template and compiled output are different representations.
- **Biggest bug:** Readiness/editing state could desync.
- **Tradeoff:** Temporary values remain frontend-only.

## Sidebar / Prompt State
- **Problem:** Keep Pinned/Recent synchronized.
- **Approach:** One `prompts` state; derive lists.
- **Key concept:** Single source of truth.
- **Biggest bug:** API response mismatch caused `/prompt/undefined`.
- **Tradeoff:** Derive data instead of storing duplicates.

## Frontend Auth
- **Problem:** Restore login state and protect application pages.
- **Approach:** `authStatus + currentUser`, `/auth/me`, protected layout.
- **Key concept:** "Not checked yet" differs from "logged out."
- **Biggest bug to avoid:** Missing `credentials: "include"`.
- **Tradeoff:** Slight global-state complexity for reliable auth behavior.