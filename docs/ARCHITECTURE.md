# `docs/ARCHITECTURE.md`

## Stack
- React + Vite
- React Router
- Tailwind CSS
- Tiptap / ProseMirror
- Lucide React

## Application Layout

Public auth pages:

```text
/login
/register
```

Authenticated application:

```text
AppLayout
├── Sidebar
└── Main routed content
    ├── /
    ├── /create
    └── /prompt/:id
```

Login/Register should use the full viewport without the sidebar.

## Prompt State

Keep one source of truth:

```js
prompts
```

Derive:

```js
pinnedPrompts
recentPrompts
```

UI-only state includes:

```text
openMenuId
editingPromptId
renameValue
```

## Editor

Backend stores plain templates:

```text
Write to {{company}} about {{topic}}.
```

Frontend converts them into structured Tiptap nodes.

```text
template text
→ Tiptap JSON
→ Variable nodes
→ React VariableChip NodeViews
```

Variable attributes:

```text
name  = persistent
value = temporary
```

Normal serialization preserves `{{variable}}`.

Compile serialization replaces variables with temporary values.

## Authentication — Current Direction

Global state:

```text
authStatus:
- checking
- authenticated
- unauthenticated

currentUser:
- null
- { id, username }
```

On application startup:

```text
GET /auth/me
→ 200: restore user
→ 401: unauthenticated
```

Authenticated requests must use:

```js
credentials: "include"
```

PV-18 frontend authentication is currently being implemented.

## Styling

PromptVault uses:
- dark neutral productivity UI
- restrained colors
- consistent spacing/radii
- workspace layout rather than excessive cards
- explicit hover/focus/loading/error states
- restrained motion

Frontend styling should follow `docs/UI_STYLE_GUIDE.md`.