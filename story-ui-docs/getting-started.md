# Mantine Getting Started Guide
Source: https://mantine.dev/getting-started/

## Installation Methods

### Quick Start with Templates
The easiest approach uses pre-configured templates with dependencies and settings:

**Recommended:**
- Next.js (app or pages router)
- Vite (full or minimal setup)

**Additional frameworks:**
- Gatsby, RedwoodJS, React Router

## Manual Setup Process

### 1. Install Core Dependencies
```bash
npm install @mantine/core @mantine/hooks
```

### 2. Add PostCSS Configuration
Install build tools:
```bash
npm install postcss postcss-preset-mantine postcss-simple-vars
```

Create `postcss.config.cjs`:
```javascript
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
```

### 3. Import Styles
Add to your root application file:
```typescript
import '@mantine/core/styles.css';
```

Additional packages require their own CSS imports:
- `@mantine/dates` → `import '@mantine/dates/styles.css';`
- `@mantine/dropzone` → `import '@mantine/dropzone/styles.css';`
- `@mantine/notifications` → `import '@mantine/notifications/styles.css';`

### 4. Wrap with MantineProvider
```tsx
import { createTheme, MantineProvider } from '@mantine/core';

const theme = createTheme({
  // customizations here
});

function App() {
  return (
    <MantineProvider theme={theme}>
      {/* application content */}
    </MantineProvider>
  );
}
```

### 5. Server-Side Rendering Setup
Add `ColorSchemeScript` to document head for SSR applications:
```tsx
import { ColorSchemeScript } from '@mantine/core';

// In your document head
<ColorSchemeScript />
```

## VS Code Configuration
Install PostCSS syntax highlighting extension and CSS variable autocomplete. Configure `.vscode/settings.json` to include `node_modules/@mantine/core/styles.css` for variable recognition.
