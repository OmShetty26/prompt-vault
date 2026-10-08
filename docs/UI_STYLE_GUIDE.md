# PromptVault UI Style Guide

Purpose: keep PromptVault visually consistent and provide a reusable checklist for professional frontend styling.

## 1. Visual Direction

- Dark, minimal productivity UI.
- Professional and restrained rather than decorative.
- Workspace feel similar to Notion; subtle Apple-like polish.
- Prefer spacing, typography and hierarchy over gradients, shadows or animation.
- Avoid unnecessary cards and visual clutter.

## 2. Core Colors

Use these as the default project palette.

```text
Main background:     #09090B / zinc-950
Elevated surface:    #18181B / zinc-900
Interactive surface: white at ~4% opacity
Hover surface:       white at ~6–8% opacity

Primary text:        zinc-100
Secondary text:      zinc-300
Muted text:          zinc-500
Disabled text:       zinc-600

Normal border:       white/10
Subtle border:       white/6
Focus border:        white/25

Error:               red-400
Success:             emerald-400
```

Do not introduce a new color unless it communicates a genuinely new meaning.

## 3. Typography

Use a small hierarchy:

```text
Page title:
text-3xl / text-4xl
font-semibold
tracking-tight
primary text

Section heading:
text-sm
font-medium
secondary text

Body:
text-sm / text-base
secondary text

Metadata/helper:
text-xs / text-sm
muted text
```

Hierarchy should come from **size + weight + contrast + spacing**, not size alone.

## 4. Spacing

Use a consistent spacing scale:

```text
4 / 8 / 12 / 16 / 24 / 32 / 48 px
```

Typical use:

```text
icon ↔ text           8px
label ↔ input         8px
related controls      12px
form fields           16px
section groups        24px
major sections        32–48px
```

Avoid choosing arbitrary spacing for every component.

## 5. Shapes

```text
Inputs/buttons:       rounded-lg
Menus/surfaces:       rounded-xl
Chips/categories:     rounded-full
```

Keep border radii consistent instead of inventing new ones per component.

## 6. Inputs and Buttons

Inputs:

```text
dark/translucent surface
subtle border
clear focus border/ring
comfortable padding
muted placeholder
visible error state
```

Primary buttons:

```text
high contrast
clear hover
disabled state
loading state
```

Secondary/icon actions should have less visual weight.

## 7. Layout

Always decide:

- What owns width?
- What owns height?
- Flex or grid?
- Which element scrolls?
- What must shrink?
- What remains fixed?

PromptVault shell:

```text
Viewport
├── persistent sidebar
└── flexible main workspace
```

Common layout tools:

```text
flex-1
min-w-0
min-h-0
shrink-0
overflow-y-auto
```

Do not add scrolling or absolute positioning without knowing which element should own it.

## 8. Component States

For every interactive component, consider:

- Default
- Hover
- Focus
- Active
- Disabled
- Loading
- Error
- Success

A professional UI is not just the default screenshot.

Examples:

```text
Input: default → focus → invalid
Button: idle → hover → loading/disabled
Prompt row: idle → hover → menu open
Copy button: idle → copied
```

## 9. Responsive Design

For every page ask:

- What stacks on smaller screens?
- What can shrink?
- What should disappear/collapse?
- Are inputs/buttons still comfortable to use?
- Does anything overflow?

Do not redesign the entire page for every breakpoint; preserve the same hierarchy.

## 10. Motion

Use motion sparingly.

```text
Typical duration: 150–250ms
```

Good uses:

- hover transitions
- menu fade/scale
- icon/state changes
- subtle opacity/position changes

Animation should clarify state changes, not decorate the page.

## 11. PromptVault-Specific Decisions

### Sidebar
- Same dark shell background.
- Subtle right divider.
- Compact rows, not individual cards.
- Low-contrast hover background.
- Pinned and Recent use muted section headings.

### Editor
- Document/workspace feel.
- No large enclosing card.
- Large prompt title.
- Category selector uses subtle pill styling.
- Editor body owns internal scrolling.

### Variable Chips
- Pill shape.
- Compact.
- Clearly distinct from normal text.
- Editing state stronger than hover state.

### Login/Register
- Full-screen dark background.
- No sidebar.
- Centered `max-w-sm` form.
- Large heading + muted description.
- Stacked fields.
- One obvious primary action.
- Errors displayed near the form.
- Avoid an oversized decorative card unless needed.

## 12. Professional UI Checklist

Before considering a page finished:

- [ ] Clear primary action
- [ ] Clear visual hierarchy
- [ ] Consistent colors
- [ ] Consistent typography
- [ ] Consistent spacing scale
- [ ] Consistent radii
- [ ] Elements align properly
- [ ] Hover/focus/disabled/loading/error states handled
- [ ] Responsive layout works
- [ ] No unnecessary colors, cards, borders or shadows
- [ ] Page looks like the same product as existing pages
- [ ] Stop polishing once it is clean and consistent

## Core Principle

Professional frontend styling is mostly:

```text
consistent system
+ clear hierarchy
+ good spacing
+ solid layout
+ complete interaction states
+ restrained polish
```

—not complex visual effects.