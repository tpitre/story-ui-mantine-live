# Mantine Accessibility Guidelines
Source: https://mantine.dev/

## Core Principles

Mantine components are built with accessibility in mind and support WCAG 2.1 AA compliance out of the box.

## Form Accessibility

Always provide labels for inputs:
```tsx
// Label prop (recommended)
<TextInput label="Email" />

// Or use aria-label
<TextInput aria-label="Email address" />
```

## Icon Buttons

Always provide aria-label for icon-only buttons:
```tsx
<ActionIcon aria-label="Close dialog">
  <IconX />
</ActionIcon>
```

## Focus Management

- All interactive components have visible focus rings by default
- Configured via `theme.focusRing` (auto | always | never)
- Use `FocusTrap` component for modals and dropdowns

## Keyboard Navigation

- All Mantine components support keyboard navigation
- `Enter` and `Space` activate buttons
- `Escape` closes modals and dropdowns
- Arrow keys navigate menus and selects
