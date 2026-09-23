# quints-ui

A React + TypeScript UI component library with CSS-custom-property based theming — rebrand any consuming app by overriding design tokens, no JS `ThemeProvider` required.

**[View the live Storybook →](https://hoang0211.github.io/quints-ui/)**

## Installation

```bash
npm install quints-ui
```

```tsx
import { Button } from "quints-ui";
import "quints-ui/style.css";

function App() {
  return <Button variant="primary">Click me</Button>;
}
```

The `quints-ui/style.css` import is required — component styles and design tokens ship as a separate stylesheet, not inlined into the JS.

## Components

- **General**: Button, Badge, Alert, Card
- **Forms**: TextField, Textarea, Checkbox, RadioGroup, Toggle, Select, DateTime
- **Overlay & navigation**: Dialog, Tabs

## Stack

- **Language/UI**: React (18 & 19) + TypeScript
- **Build**: [tsdown](https://github.com/rolldown/tsdown) — ESM + CJS + `.d.ts` output
- **Styling**: plain CSS per component, `--q-` prefixed custom-property design tokens (no CSS-in-JS, no CSS Modules, no theme provider)
- **Interaction primitives**: [Radix Primitives](https://radix-ui.com/primitives) as the behavioral base for components with non-trivial focus/keyboard/positioning logic (Dialog, Tabs, Select, DateTime, RadioGroup, Checkbox, Toggle) — hand-built markup and styling on top
- **Testing**: [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) + `@testing-library/user-event` + [`vitest-axe`](https://github.com/chaance/vitest-axe) for accessibility checks
- **Docs**: [Storybook](https://storybook.js.org) (`@storybook/react-vite`), deployed to [GitHub Pages](https://hoang0211.github.io/quints-ui/)
- **Linting/formatting**: ESLint + Prettier

## Theming

Every component reads its colors, spacing, and typography from CSS custom properties defined in `src/styles/tokens.css` (prefixed `--q-`). Consumers rebrand by overriding these tokens — no JavaScript theme provider needed:

```css
:root {
  --q-color-primary: #4f46e5;
}

[data-theme="ocean"] {
  --q-color-primary: #0ea5e9;
}
```

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT — see [LICENSE](./LICENSE).
