#!/usr/bin/env node

/**
 * Validation script to ensure edited stories are correctly configured
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const editedPath = path.join(__dirname, 'src', 'stories', 'edited');
const generatedPath = path.join(__dirname, 'src', 'stories', 'generated');

console.log('🔍 Validating edited stories configuration...\n');

// Check all edited stories
const editedFiles = fs.readdirSync(editedPath).filter(f => f.endsWith('.stories.tsx'));
let issues = 0;
let validated = 0;

editedFiles.forEach(file => {
  const filePath = path.join(editedPath, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  console.log(`📄 Checking: ${file}`);
  
  // Check for double extensions in fileName parameter
  if (content.includes('.stories.stories.tsx')) {
    console.log(`  ❌ Contains double extension in fileName parameter`);
    issues++;
  } else {
    console.log(`  ✅ Correct fileName extension`);
  }
  
  // Check for isEdited flag
  if (content.includes('isEdited: true')) {
    console.log(`  ✅ Has isEdited flag`);
  } else {
    console.log(`  ⚠️  Missing isEdited flag`);
  }
  
  // Check title starts with "Edited/"
  const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
  if (titleMatch && titleMatch[1].startsWith('Edited/')) {
    console.log(`  ✅ Title starts with "Edited/"`);
  } else {
    console.log(`  ⚠️  Title doesn't start with "Edited/"`);
  }
  
  // Check if corresponding generated file exists
  const generatedFile = path.join(generatedPath, file);
  if (fs.existsSync(generatedFile)) {
    console.log(`  ✅ Has corresponding generated file`);
    
    // Compare to ensure they're different
    const generatedContent = fs.readFileSync(generatedFile, 'utf-8');
    if (generatedContent !== content) {
      console.log(`  ✅ Content differs from generated version`);
    } else {
      console.log(`  ❌ Content is identical to generated version`);
      issues++;
    }
  } else {
    console.log(`  ℹ️  No corresponding generated file (might be a new story)`);
  }
  
  validated++;
  console.log('');
});

console.log('📊 Summary:');
console.log(`  Total edited stories: ${validated}`);
console.log(`  Issues found: ${issues}`);
if (issues === 0) {
  console.log(`\n✨ All edited stories are correctly configured!`);
} else {
  console.log(`\n⚠️  Found ${issues} issue(s) that need attention.`);
}