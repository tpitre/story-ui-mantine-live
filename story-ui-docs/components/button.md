# Button Component
Source: https://mantine.dev/core/button/

## Import
```tsx
import { Button } from '@mantine/core';
```

## Overview
The Button component renders interactive button or link elements with support for multiple variants, sizes, colors, and states.

## Variants

| Variant | Description | Code |
|---------|-------------|------|
| filled | Default solid button | `variant="filled"` |
| light | Lighter background | `variant="light"` |
| outline | Border only, no fill | `variant="outline"` |
| subtle | Minimal background | `variant="subtle"` |
| transparent | No background | `variant="transparent"` |
| white | White background | `variant="white"` |
| gradient | Gradient background | `variant="gradient"` |

## Sizes

```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Compact variants have reduced padding
<Button size="compact-xs">Compact XS</Button>
<Button size="compact-sm">Compact Small</Button>
<Button size="compact-md">Compact Medium</Button>
<Button size="compact-lg">Compact Large</Button>
<Button size="compact-xl">Compact XL</Button>
```

## Colors

Uses theme colors. Default is `blue`:
```tsx
<Button color="blue">Primary (default)</Button>
<Button color="green">Success</Button>
<Button color="red">Danger</Button>
<Button color="yellow">Warning</Button>
<Button color="gray">Neutral</Button>
```

## Key Props

| Prop | Type | Description |
|------|------|-------------|
| disabled | boolean | Prevents interactions and applies disabled styling |
| loading | boolean | Shows loader overlay and disables interaction |
| fullWidth | boolean | Expands to 100% parent width |
| leftSection | ReactNode | Adds icon/element on left side |
| rightSection | ReactNode | Adds icon/element on right side |
| justify | string | Controls alignment of sections (e.g., `space-between`) |
| component | ElementType | Polymorphic prop to render as different elements |
| autoContrast | boolean | Adjusts text color for sufficient contrast with background |

## States

### Loading State
```tsx
<Button loading>Submitting...</Button>
<Button loading loaderProps={{ type: 'dots' }}>
  Custom loader
</Button>
```

### Disabled State
```tsx
// Use disabled prop for true disabled buttons
<Button disabled>Disabled Button</Button>

// Use data-disabled for link elements or when needing Tooltip integration
<Button data-disabled onClick={(e) => e.preventDefault()}>
  Data Disabled
</Button>
```

## Sections

When a section is added, padding on the corresponding side is reduced. Sections flip automatically in RTL mode.

```tsx
import { IconArrowRight, IconDownload } from '@tabler/icons-react';

// Left section
<Button leftSection={<IconDownload size={14} />}>
  Download
</Button>

// Right section
<Button rightSection={<IconArrowRight size={14} />}>
  Continue
</Button>

// Spread sections across button width
<Button
  leftSection={<IconDownload size={14} />}
  justify="space-between"
  fullWidth
>
  Download
</Button>
```

## Gradient Variant

```tsx
<Button
  variant="gradient"
  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
>
  Gradient Button
</Button>
```

## Button.Group

Group multiple buttons together. Child buttons must be direct children (no wrapper elements):

```tsx
<Button.Group>
  <Button variant="default">First</Button>
  <Button variant="default">Second</Button>
  <Button variant="default">Third</Button>
</Button.Group>

// Vertical orientation
<Button.Group orientation="vertical">
  <Button variant="default">First</Button>
  <Button variant="default">Second</Button>
</Button.Group>
```

## As Link (Polymorphic)

```tsx
// As anchor
<Button component="a" href="/page">
  Link Button
</Button>

// With Next.js Link
import Link from 'next/link';
<Button component={Link} href="/page">
  Next.js Link
</Button>
```

## Styles API

Target these elements with `classNames` prop:
- `root` - Root button element
- `loader` - Loader overlay
- `inner` - Inner wrapper
- `section` - Left/right section wrapper
- `label` - Button text label
