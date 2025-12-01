# Mantine Component Usage Guidelines
Source: https://mantine.dev/getting-started/

## Import Pattern

Always import from `@mantine/core`:
```tsx
import { Button, Text, Card, Group, Stack } from '@mantine/core';
```

## Required Provider

All components must be wrapped with MantineProvider:
```tsx
import { MantineProvider } from '@mantine/core';

<MantineProvider>
  {/* Your app */}
</MantineProvider>
```

## Common Style Props

All components support these inline style props:
- Margin: `m`, `mt`, `mb`, `ml`, `mr`, `mx`, `my`
- Padding: `p`, `pt`, `pb`, `pl`, `pr`, `px`, `py`
- Width/Height: `w`, `h`, `miw`, `maw`, `mih`, `mah`
- Color: `c` (text color), `bg` (background)

## Responsive Props

Use object syntax for responsive values:
```tsx
<Button size={{ base: 'sm', md: 'md', lg: 'lg' }}>
  Responsive Button
</Button>
```

## Polymorphic Components

Many components support `component` prop:
```tsx
<Button component="a" href="/page">Link Button</Button>
<Card component="article">Article Card</Card>
```
