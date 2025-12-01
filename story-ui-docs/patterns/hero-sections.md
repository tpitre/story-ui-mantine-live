# Hero Section Patterns
Source: https://mantine.dev/core/container/

## Simple Hero

```tsx
<Container size="md" py="xl">
  <Stack align="center" gap="lg">
    <Title order={1} ta="center">Welcome to Our Platform</Title>
    <Text size="lg" c="dimmed" ta="center" maw={600}>
      Build amazing products with our powerful tools.
    </Text>
    <Group>
      <Button size="lg">Get Started</Button>
      <Button size="lg" variant="light">Learn More</Button>
    </Group>
  </Stack>
</Container>
```

## Hero with Split Layout

```tsx
<Container size="xl" py="xl">
  <Grid gutter="xl" align="center">
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Stack gap="lg">
        <Title order={1}>Build Better Products</Title>
        <Text size="lg" c="dimmed">{description}</Text>
        <Group>
          <Button>Start Free Trial</Button>
          <Button variant="outline">Watch Demo</Button>
        </Group>
      </Stack>
    </Grid.Col>
    <Grid.Col span={{ base: 12, md: 6 }}>
      <Image src={heroImage} alt="Hero" radius="md" />
    </Grid.Col>
  </Grid>
</Container>
```
