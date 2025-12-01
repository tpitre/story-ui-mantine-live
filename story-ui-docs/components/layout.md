# Layout Components
Source: https://mantine.dev/core/stack/, https://mantine.dev/core/group/

## Import
```tsx
import { Stack, Group, Flex, Container, Grid, SimpleGrid } from '@mantine/core';
```

## Stack Component

Vertical flex container for composing elements and components vertically.

### Basic Usage
```tsx
<Stack gap="md">
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</Stack>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| gap | xs \| sm \| md \| lg \| xl | md | Spacing between children |
| align | string | stretch | Vertical alignment (stretch, center, flex-start, flex-end) |
| justify | string | flex-start | Space distribution (center, flex-start, flex-end, space-between, space-around) |

### Example
```tsx
<Stack
  h={300}
  bg="var(--mantine-color-body)"
  align="stretch"
  justify="center"
  gap="md"
>
  <Button>Item 1</Button>
  <Button>Item 2</Button>
  <Button>Item 3</Button>
</Stack>
```

## Group Component

Horizontal flex container for composing elements and components. For vertical layouts, use Stack instead.

### Basic Usage
```tsx
<Group>
  <Button variant="default">First</Button>
  <Button variant="default">Second</Button>
  <Button variant="default">Third</Button>
</Group>
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| gap | xs \| sm \| md \| lg \| xl | md | Spacing between children |
| justify | string | flex-start | Horizontal alignment |
| grow | boolean | false | Allow children to expand and fill space |
| wrap | string | wrap | Whether children wrap to new lines ('nowrap' to disable) |
| preventGrowOverflow | boolean | true | Limit each child to (1/children.length) × 100% of parent width |

### Justify Options
```tsx
<Group justify="flex-start">Left aligned (default)</Group>
<Group justify="center">Center aligned</Group>
<Group justify="space-between">Space between</Group>
<Group justify="flex-end">Right aligned</Group>
```

### Grow Behavior
```tsx
// Children expand to fill available space
<Group grow>
  <Button>First</Button>
  <Button>Second</Button>
</Group>

// With preventGrowOverflow={false}, children grow based on content
<Group grow preventGrowOverflow={false}>
  <Button>Short</Button>
  <Button>Much Longer Button Text</Button>
</Group>
```

### Important Constraints

Group requires actual React elements. **Strings, numbers, fragments may have incorrect styles if grow prop is set.**

```tsx
// ❌ Avoid with grow
<Group grow>
  Some text
  <Button>Button</Button>
</Group>

// ✅ Correct
<Group grow>
  <Text>Some text</Text>
  <Button>Button</Button>
</Group>
```

## Flex Component

Advanced flex control for complex layouts:

```tsx
<Flex
  gap="md"
  justify="space-between"
  align="center"
  direction="row"
  wrap="wrap"
>
  <Text>Left content</Text>
  <Button>Right button</Button>
</Flex>
```

## Container Component

Centers content with max-width:

```tsx
<Container size="md">
  {/* Content centered with max-width */}
</Container>

// Available sizes: xs, sm, md, lg, xl
```

## Grid Component

Responsive grid layout:

```tsx
<Grid>
  <Grid.Col span={6}>Half width</Grid.Col>
  <Grid.Col span={6}>Half width</Grid.Col>
</Grid>

// Responsive columns
<Grid>
  <Grid.Col span={{ base: 12, sm: 6, lg: 4 }}>
    Responsive column
  </Grid.Col>
</Grid>
```

## SimpleGrid Component

Equal-width columns:

```tsx
<SimpleGrid cols={3} spacing="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</SimpleGrid>

// Responsive columns
<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</SimpleGrid>
```

## Browser Support Note

Stack and Group use flexbox gap. In older browsers, children may not have spacing. Install flex-gap-polyfill PostCSS plugin for legacy browser support.
