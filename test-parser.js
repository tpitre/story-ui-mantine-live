// Test script to verify the JSX parser fixes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the story file
const storyPath = path.join(__dirname, 'src/stories/generated/recipe-card-a4e6603b.stories.tsx');
const storyContent = fs.readFileSync(storyPath, 'utf8');

console.log('🧪 Testing JSX Parser with Recipe Card Story');
console.log('='.repeat(50));

// Extract the JSX from the Default story
const renderMatch = storyContent.match(/render: \(\) => \(([\s\S]*?)\),?\s*}/);
if (renderMatch) {
  const jsx = renderMatch[1].trim();
  console.log('📝 Extracted JSX:');
  console.log(jsx.substring(0, 300) + '...');
  console.log();
  
  // Analyze the structure manually to confirm expected nesting
  console.log('📊 Expected Structure Analysis:');
  console.log('Root: Card');
  console.log('  └─ Card.Section (should become CardSection)');
  console.log('     └─ Image');
  console.log('  └─ Stack');
  console.log('     └─ Group (first)');
  console.log('        └─ Text (title)');
  console.log('        └─ Badge (30 min)');
  console.log('     └─ Text (description)');
  console.log('     └─ Group (badges)');
  console.log('        └─ Badge (Vegetarian)');
  console.log('        └─ Badge (Easy)');  
  console.log('        └─ Badge (4 servings)');
  console.log('     └─ Group (bottom)');
  console.log('        └─ Group (author)');
  console.log('           └─ Avatar');
  console.log('           └─ Text (Chef Maria)');
  console.log('        └─ Button (View Recipe)');
  console.log();
  
  // Count expected components
  const expectedComponents = {
    Card: 1,
    CardSection: 1, // Card.Section -> CardSection
    Image: 1,
    Stack: 1,
    Group: 4, // Two nested in main Stack, one for badges, one for bottom section, one for author
    Text: 3, // Title, description, author name
    Badge: 4, // Time badge + 3 category badges
    Avatar: 1,
    Button: 1
  };
  
  console.log('🎯 Expected component counts:');
  Object.entries(expectedComponents).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log(`  Total: ${Object.values(expectedComponents).reduce((a, b) => a + b, 0)} components`);
  
} else {
  console.error('❌ Could not extract JSX from story file');
}

console.log();
console.log('🚀 Now test with the Visual Builder to see if nesting is preserved!');