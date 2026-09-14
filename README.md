# quints-ui

A React + TypeScript UI component library with CSS-custom-property based theming.

## Stack

- **Language/UI**: React (18 & 19) + TypeScript
- **Build**: [tsdown](https://github.com/rolldown/tsdown) — ESM + CJS + `.d.ts` output
- **Styling**: plain CSS per component, custom-property design tokens (no CSS-in-JS, no CSS Modules)
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) + `@testing-library/user-event` + [`vitest-axe`](https://github.com/chaance/vitest-axe) for accessibility checks
- **Docs**: [Storybook](https://storybook.js.org) (`@storybook/react-vite`)
- **Linting/formatting**: ESLint + Prettier

## Development

```bash
npm install
npm run build
npm test
```
