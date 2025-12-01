# Form Patterns
Source: https://mantine.dev/form/use-form/

## Basic Form Layout

```tsx
import { TextInput, Button, Stack } from '@mantine/core';

<form onSubmit={handleSubmit}>
  <Stack gap="md">
    <TextInput label="Email" placeholder="your@email.com" />
    <TextInput label="Name" placeholder="Your name" />
    <Button type="submit">Submit</Button>
  </Stack>
</form>
```

## Form with Validation (useForm)

```tsx
import { useForm } from '@mantine/form';

const form = useForm({
  initialValues: { email: '', name: '' },
  validate: {
    email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
  },
});

<form onSubmit={form.onSubmit(handleSubmit)}>
  <TextInput
    label="Email"
    {...form.getInputProps('email')}
  />
</form>
```

## Form in Card

```tsx
<Card shadow="sm" padding="lg" radius="md" withBorder>
  <Stack gap="md">
    <Title order={3}>Contact Us</Title>
    <TextInput label="Email" />
    <Textarea label="Message" />
    <Button>Send</Button>
  </Stack>
</Card>
```
