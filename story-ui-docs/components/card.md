# Card Component
Source: https://mantine.dev/core/card/

## Import
```tsx
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
```

## Overview
The Card component is a wrapper around the Paper component with additional styling and the `Card.Section` component for dividing content into sections. For simpler use cases without sections, use the Paper component instead.

## Basic Usage
```tsx
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Text>Card content</Text>
</Card>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| shadow | xs \| sm \| md \| lg \| xl | - | Card shadow depth |
| padding | xs \| sm \| md \| lg \| xl | md | Inner padding |
| radius | xs \| sm \| md \| lg \| xl | md | Border radius |
| withBorder | boolean | false | Adds border to Card.Section elements based on position |

## Card.Section Component

`Card.Section` removes Card padding from its children while maintaining horizontal spacing from other elements.

### Margin Behavior
- **First child**: Negative top, left, and right margins
- **Last child**: Negative bottom, left, and right margins
- **Middle child**: Negative left and right margins only

### Card.Section Props

| Prop | Type | Description |
|------|------|-------------|
| inheritPadding | boolean | Applies same left/right padding as parent Card |
| withBorder | boolean | Adds top/bottom borders depending on section position |
| component | ElementType | Polymorphic prop to render as different element |

```tsx
// Inherit padding from card
<Card.Section inheritPadding>
  <Text>Padded section content</Text>
</Card.Section>

// Add border
<Card.Section withBorder>
  <Text>Bordered section content</Text>
</Card.Section>

// As link
<Card.Section component="a" href="#">
  Clickable section
</Card.Section>
```

## Important Constraints

Card relies on mapping direct children—you **cannot** wrap `Card.Section` elements in fragments or additional divs. This will prevent proper margin calculations.

```tsx
// ❌ WRONG - fragments break margin calculations
<Card>
  <>
    <Card.Section>...</Card.Section>
  </>
</Card>

// ✅ CORRECT - direct children
<Card>
  <Card.Section>...</Card.Section>
  <Text>Content</Text>
</Card>
```

## Common Patterns

### Product Card
```tsx
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Card.Section>
    <Image
      src="https://example.com/product.jpg"
      height={180}
      alt="Product name"
    />
  </Card.Section>

  <Group justify="space-between" mt="md" mb="xs">
    <Text fw={500}>Product Name</Text>
    <Badge color="pink">On Sale</Badge>
  </Group>

  <Text size="sm" c="dimmed">
    Product description goes here with details about the item.
  </Text>

  <Button color="blue" fullWidth mt="md" radius="md">
    Buy Now
  </Button>
</Card>
```

### Feature Card
```tsx
<Card shadow="sm" padding="xl" radius="md">
  <ThemeIcon size={50} radius="md" color="blue" mb="md">
    <IconRocket size={26} />
  </ThemeIcon>

  <Text fw={500} size="lg" mb="xs">
    Feature Title
  </Text>

  <Text size="sm" c="dimmed">
    Feature description explaining the benefit.
  </Text>
</Card>
```

### Card as Link (Polymorphic)
```tsx
<Card
  shadow="sm"
  padding="lg"
  radius="md"
  component="a"
  href="/details"
>
  <Text>Click entire card to navigate</Text>
</Card>
```

## Recommended Defaults

For most cards, use:
```tsx
<Card shadow="sm" padding="lg" radius="md" withBorder>
```
