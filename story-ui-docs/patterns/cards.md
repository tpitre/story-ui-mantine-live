# Card Patterns
Source: https://mantine.dev/core/card/

## Product Card

```tsx
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Card.Section>
    <Image src={imageUrl} height={180} alt={productName} />
  </Card.Section>

  <Group justify="space-between" mt="md" mb="xs">
    <Text fw={500}>{productName}</Text>
    <Badge color="pink">On Sale</Badge>
  </Group>

  <Text size="sm" c="dimmed">{description}</Text>

  <Button fullWidth mt="md">Add to Cart</Button>
</Card>
```

## Feature Card

```tsx
<Card shadow="sm" padding="xl" radius="md">
  <ThemeIcon size={50} radius="md" color="blue" mb="md">
    <IconStar size={26} />
  </ThemeIcon>
  <Text fw={500} size="lg">{title}</Text>
  <Text size="sm" c="dimmed" mt="xs">{description}</Text>
</Card>
```

## Card Grid

```tsx
<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
  <Card>Card 1</Card>
  <Card>Card 2</Card>
  <Card>Card 3</Card>
</SimpleGrid>
```
