---
name: new-component
description: Scaffold a new quints-ui component (Component.tsx, .css, .test.tsx, .stories.tsx) following the Button reference pattern, then wire its export into src/index.ts. Use when starting a new component milestone (e.g. Badge, Card, Input, Dialog, Tabs).
disable-model-invocation: true
---

## Arguments

The component name in PascalCase, e.g. `/new-component Badge`. If not given, ask for it.

## Instructions

1. Check the current git branch (`git branch --show-current`). If it's `main` (or `master`), stop and tell the user to create/checkout a feature branch first (per the one-component-one-PR workflow) before scaffolding anything — do not create the branch yourself, and do not proceed with generating files while on `main`.

2. Confirm the component name (PascalCase) and derive the kebab-case folder name (e.g. `Badge` → `badge`).

3. Read `src/components/button/Button.tsx`, `Button.css`, `Button.test.tsx`, and `Button.stories.tsx` as the reference pattern — structure, `forwardRef` usage, `className` merging, test coverage (rendering, variant/size classes, interactive behavior, disabled/loading-equivalent states, ref forwarding, the `vitest-axe` a11y check using `(await axe(container)).violations` per CLAUDE.md's testing gotchas — not the broken `toHaveNoViolations()` matcher), and story coverage (one story per variant/size/state).

4. Ask the user briefly what this specific component needs — variants, props, states. Don't assume: each component differs (e.g. Badge likely needs `removable`+`onRemove`+`icon`; Card likely needs compound sub-components; Input likely needs validation/error states; Dialog/Tabs need Radix). The milestone roadmap in project memory has rough sketches, but confirm before generating.

5. Check `src/styles/tokens.css` for whether any new variant needs design tokens that don't exist yet (status colors currently only have a base value — see CLAUDE.md's Design Tokens section) and add them following the existing `-hover`/`-contrast` pattern, same as was done for `alert`.

6. Check whether Radix Primitives (radix-ui.com/primitives) offers something matching this component (Dialog, Tabs, Accordion, Popover, Tooltip, Select, Checkbox, Radio Group, Switch, Slider, Dropdown Menu, etc.). If a matching primitive exists **and** the component has genuine non-trivial interaction logic (focus trapping, roving tabindex, positioning, keyboard navigation — not just visual styling), use it as the behavioral base: install the matching `@radix-ui/react-*` package as a real runtime `dependency` (not `devDependency` — it executes in the consumer's app, unlike every other tool in this repo), and hand-build styling/markup/tests/stories on top of it, same pattern as Dialog/Tabs. If no matching primitive exists (e.g. Button — Radix deliberately doesn't ship one since native HTML already covers its behavior), hand-build the component fully. Confirm with the user before installing any new dependency.

7. Generate the four files directly: `src/components/<kebab-name>/<Name>.tsx`, `<Name>.css`, `<Name>.test.tsx`, `<Name>.stories.tsx`. This skill is a deliberate, explicit exception to the project's usual "user writes implementation code" working model — direct generation is fine here specifically because the user invoked this skill to get that.

8. Update `src/index.ts` to export the new component and its exported types, matching the Button export pattern.

9. Run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm test`. Fix anything that fails before finishing.

10. Stop there. Branch creation, opening the PR, and merging are left to the user per the standing one-component-one-PR workflow — do not run git commands beyond what's needed to verify the working tree, and do not open a PR yourself.
