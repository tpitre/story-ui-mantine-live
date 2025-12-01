# Input Components
Source: https://mantine.dev/core/text-input/, https://mantine.dev/core/select/

## Import
```tsx
import {
  TextInput,
  PasswordInput,
  NumberInput,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Switch
} from '@mantine/core';
```

## TextInput

Capture string input from user. Extends Input and Input.Wrapper functionality.

### Basic Usage
```tsx
<TextInput
  label="Username"
  placeholder="Enter username"
/>
```

### Full Example
```tsx
<TextInput
  label="Email"
  description="We'll never share your email"
  placeholder="your@email.com"
  error="Invalid email format"
  required
  withAsterisk
/>
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| label | string | Input label |
| description | string | Descriptive text below label |
| placeholder | string | Hint text inside input |
| error | boolean \| string | Error state or message |
| disabled | boolean | Disables user interaction |
| required | boolean | Marks as required |
| withAsterisk | boolean | Shows asterisk in label |
| variant | 'default' \| 'filled' \| 'unstyled' | Visual style |
| size | xs \| sm \| md \| lg \| xl | Input size |
| radius | xs \| sm \| md \| lg \| xl | Border radius |

### With Sections (Icons)
```tsx
import { IconAt, IconLock } from '@tabler/icons-react';

// Left section (e.g., icon)
<TextInput
  label="Email"
  placeholder="your@email.com"
  leftSection={<IconAt size={16} />}
  leftSectionPointerEvents="none"
/>

// Right section
<TextInput
  label="Password"
  rightSection={<IconLock size={16} />}
  rightSectionPointerEvents="none"
/>
```

### Accessibility
- Always pair with `label` prop or set `aria-label` attribute
- Input requires label association for proper screen reader announcement

## Select

Capture user input from predefined suggestions. Unlike Autocomplete, it doesn't permit custom values.

### Basic Usage
```tsx
<Select
  label="Country"
  placeholder="Select country"
  data={['USA', 'Canada', 'UK', 'Germany']}
/>
```

### Data Formats
```tsx
// Simple string array
data={['React', 'Angular', 'Vue']}

// Object format with value/label
data={[
  { value: 'react', label: 'React' },
  { value: 'angular', label: 'Angular', disabled: true },
  { value: 'vue', label: 'Vue' },
]}

// Grouped options
data={[
  { group: 'Frontend', items: ['React', 'Vue'] },
  { group: 'Backend', items: ['Node', 'Python'] },
]}
```

### Key Props

| Prop | Type | Description |
|------|------|-------------|
| searchable | boolean | Enables filtering by typing |
| clearable | boolean | Shows clear button |
| allowDeselect | boolean | Allow clicking selected to deselect (default: true) |
| nothingFoundMessage | string | Message when search yields no results |
| limit | number | Max options to render (for large datasets) |
| maxDropdownHeight | number | Scrollable dropdown height |
| checkIconPosition | 'left' \| 'right' | Position of check icon |

### Searchable Select
```tsx
<Select
  label="Search countries"
  placeholder="Type to search"
  data={countries}
  searchable
  nothingFoundMessage="No matches found"
/>
```

### Clearable Select
```tsx
<Select
  label="Optional selection"
  data={options}
  clearable
/>
```

### Large Dataset Performance
```tsx
// Limit rendered options for 100,000+ items
<Select
  label="Select item"
  data={largeDataset}
  limit={5}
  searchable
/>
```

## Checkbox

```tsx
// Single checkbox
<Checkbox label="I agree to terms" />

// Checkbox group
<Checkbox.Group
  label="Select features"
  description="Choose all that apply"
  value={selected}
  onChange={setSelected}
>
  <Stack mt="xs">
    <Checkbox value="feature1" label="Feature 1" />
    <Checkbox value="feature2" label="Feature 2" />
    <Checkbox value="feature3" label="Feature 3" />
  </Stack>
</Checkbox.Group>
```

## Radio

```tsx
<Radio.Group
  label="Select option"
  value={value}
  onChange={setValue}
>
  <Stack mt="xs">
    <Radio value="option1" label="Option 1" />
    <Radio value="option2" label="Option 2" />
    <Radio value="option3" label="Option 3" />
  </Stack>
</Radio.Group>
```

## Switch

```tsx
<Switch label="Enable notifications" />

<Switch
  label="Dark mode"
  onLabel="ON"
  offLabel="OFF"
  size="md"
/>
```

## Styles API

Target these elements with `classNames` prop:
- `wrapper` - Root wrapper
- `input` - Input element
- `section` - Left/right section
- `root` - Component root
- `label` - Label text
- `required` - Required asterisk
- `description` - Description text
- `error` - Error message
