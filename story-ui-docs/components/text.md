# Text & Typography Components
Source: https://mantine.dev/core/text/

## Import
```tsx
import { Text, Title, Anchor, Code, Highlight, Mark } from '@mantine/core';
```

## Text Component

Displays text content with customizable styling options. Polymorphic component with `<p>` as default element.

### Size Options
```tsx
<Text size="xs">Extra small (12px)</Text>
<Text size="sm">Small (14px)</Text>
<Text size="md">Medium (16px) - default</Text>
<Text size="lg">Large (18px)</Text>
<Text size="xl">Extra large (20px)</Text>
```

### Font Weight
```tsx
<Text fw={400}>Normal</Text>
<Text fw={500}>Medium (semibold)</Text>
<Text fw={700}>Bold</Text>
```

### Color
```tsx
<Text>Default color</Text>
<Text c="dimmed">Dimmed/secondary text</Text>
<Text c="blue">Blue text</Text>
<Text c="red">Red text</Text>
<Text c="teal.4">Teal shade 4</Text>
```

### Text Styling
```tsx
<Text fs="italic">Italic text</Text>
<Text td="underline">Underlined text</Text>
<Text td="line-through">Strikethrough text</Text>
<Text tt="uppercase">Uppercase text</Text>
<Text tt="capitalize">Capitalized text</Text>
```

### Alignment
```tsx
<Text ta="left">Left aligned (default)</Text>
<Text ta="center">Center aligned</Text>
<Text ta="right">Right aligned</Text>
```

### Truncation
```tsx
// Single line truncation with ellipsis
<Text truncate="end">
  Long text that will be truncated at the end...
</Text>

// Multi-line clamping (uses CSS -webkit-line-clamp)
<Text lineClamp={2}>
  Text that spans multiple lines will be clamped
  to 2 lines maximum with ellipsis...
</Text>
```

### Gradient Text
```tsx
<Text
  variant="gradient"
  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
  fw={700}
  size="xl"
>
  Gradient Text
</Text>
```

### Inheritance
Use `inherit` prop to preserve parent element's font styles:
```tsx
<Title order={1}>
  Title with <Text inherit c="blue" span>highlighted</Text> word
</Title>
```

### Span Shorthand
Use `span` prop as shorthand for `component="span"`:
```tsx
<Text span>Inline text</Text>
// Equivalent to:
<Text component="span">Inline text</Text>
```

## Title Component

For headings, use Title with `order` prop (1-6):

```tsx
<Title order={1}>H1 Heading (34px)</Title>
<Title order={2}>H2 Heading (26px)</Title>
<Title order={3}>H3 Heading (22px)</Title>
<Title order={4}>H4 Heading (18px)</Title>
<Title order={5}>H5 Heading (16px)</Title>
<Title order={6}>H6 Heading (14px)</Title>

// Override visual size while keeping semantic level
<Title order={2} size="h1">H2 with H1 styling</Title>
```

## Anchor Component

For links:
```tsx
<Anchor href="https://example.com">External link</Anchor>
<Anchor href="/page" underline="hover">Underline on hover</Anchor>
<Anchor href="/page" underline="always">Always underlined</Anchor>
<Anchor href="/page" underline="never">Never underlined</Anchor>
```

## Code Component

For inline and block code:
```tsx
// Inline code
<Code>npm install @mantine/core</Code>
<Code color="blue">const x = 1;</Code>

// Code block
<Code block>
{`function hello() {
  console.log("Hello World");
}`}
</Code>
```

## Highlight Component

Highlight specific text:
```tsx
<Highlight highlight="important">
  This is important text that should stand out.
</Highlight>

// Multiple highlights
<Highlight highlight={["first", "second"]}>
  Highlight first and second words.
</Highlight>
```

## Mark Component

For marked/highlighted inline text:
```tsx
<Text>
  This has <Mark>marked text</Mark> inside.
</Text>
```

## Common Patterns

### Page Header
```tsx
<Stack gap="xs">
  <Title order={1}>Page Title</Title>
  <Text size="lg" c="dimmed">
    A brief description of what this page contains.
  </Text>
</Stack>
```

### Section Header
```tsx
<Stack gap={4}>
  <Title order={3}>Section Title</Title>
  <Text size="sm" c="dimmed">
    Additional context for this section.
  </Text>
</Stack>
```

### Label + Value
```tsx
<Group gap="xs">
  <Text size="sm" c="dimmed">Status:</Text>
  <Text size="sm" fw={500}>Active</Text>
</Group>
```
