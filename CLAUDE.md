# quints-ui

React + TypeScript UI component library (portfolio project), published as the unscoped `quints-ui` npm package. Themeable via CSS custom properties — consumers rebrand by overriding tokens, no JS ThemeProvider.

## Tech Stack

- React 18/19 + TypeScript, built with `tsdown` (ESM+CJS+`.d.ts`; CSS bundled via `@tsdown/css`)
- Plain CSS per component, `--q-` prefixed design tokens in `src/styles/tokens.css`
- Vitest (jsdom) + React Testing Library + `user-event` + `jest-dom` + `vitest-axe`
- Storybook (`@storybook/react-vite`) for docs/showcase

## Component Convention

Each component lives in its own folder under `src/components/<kebab-case-name>/`, containing four files: `Component.tsx`, `Component.css`, `Component.test.tsx`, `Component.stories.tsx`. `src/components/button/` is the reference implementation — follow its pattern for new components. Public API is re-exported from `src/index.ts`.

Established API pattern: `variant`/`size` props, `forwardRef` to the underlying DOM element, consumer `className` merged after generated classes (never overridden), native attributes extended via the relevant `*HTMLAttributes<T>` interface.

## Design Tokens

Brand colors (primary/secondary) each have base/`-hover`/`-active`/`-contrast` variants. Status colors (success/warning/alert/info) currently only have a base value — add `-hover`/`-contrast` tokens as soon as a component's variant actually needs them (already done for `alert`).

## Radix UI Scope

This is an ongoing, expandable library, not a fixed six-component set — new components get added over time. For each new component, check whether Radix Primitives has a matching one: if it does and the component has genuine non-trivial interaction logic (focus trap, roving tabindex, positioning, keyboard nav), use it as the behavioral base (real runtime `dependency`, since it executes in the consumer's app) and hand-build styling/markup/tests/stories on top, as done for Dialog/Tabs. If no matching primitive exists (e.g. Button — Radix doesn't ship one since native HTML already covers its behavior), hand-build the component fully. Don't assume a component is Radix-based or hand-built just because an earlier one was — check each time.

## Testing Gotchas

- `vitest.config.ts` has `test.globals` disabled, so RTL doesn't auto-cleanup between tests — `afterEach(cleanup)` is registered explicitly in `src/test/setup.ts`. Omitting this causes "found multiple elements" failures as DOM output accumulates across tests.
- `vitest-axe` (v0.1.0) has broken TypeScript types for its `toHaveNoViolations()` matcher against the current Vitest version. Assert `(await axe(container)).violations` has length 0 instead of using the matcher.
- `@testing-library/jest-dom` is wired via the `@testing-library/jest-dom/vitest` subpath import in `src/test/setup.ts`.
- A file outside `src/` needing a `*.css` side-effect import (e.g. `.storybook/preview.tsx`) must be added to `tsconfig.json`'s `include` — the ambient `declare module "*.css"` (`src/css.d.ts`) only applies within the same TS program.

## Workflow

One component = one git branch = one PR. Tests must pass before merge — enforced by GitHub Actions CI (`lint`, `typecheck`, `build`, `test`, `format:check`) as a required status check on `main`.
