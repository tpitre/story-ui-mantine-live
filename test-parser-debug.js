#!/usr/bin/env node

// Simple test to debug the parser behavior
const fs = require('fs');
const path = require('path');

// Import the parser functions - we'll need to convert to CommonJS for testing
const testJSX = `<Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 400 }}>
  <Card.Section>
    <Image
      src="https://picsum.photos/400/200?random=1"
      height={200}
      alt="Delicious pasta dish"
    />
  </Card.Section>
  <Stack gap="md" mt="md">
    <Group justify="space-between" align="flex-start">
      <Text fw={500} size="lg">
        Creamy Mushroom Pasta
      </Text>
      <Badge color="green" variant="light">
        30 min
      </Badge>
    </Group>
  </Stack>
</Card>`;

console.log('🧪 Testing JSX Parser with Recipe Card JSX');
console.log('📝 Input JSX:');
console.log(testJSX);
console.log('\n' + '='.repeat(60) + '\n');

// We'll manually test the tokenizer and parser logic
console.log('🔍 Expected Component Tree:');
console.log('📦 Card (root)');
console.log('  ├── 📦 Card.Section');
console.log('  │   └── 📦 Image');
console.log('  └── 📦 Stack');
console.log('      └── 📦 Group');
console.log('          ├── 📦 Text');
console.log('          └── 📦 Badge');

console.log('\n⚠️  Current Parser Behavior: Single Text component with 0 children');
console.log('\n🛠️  Need to fix: parseJSXElement function stack logic');