#!/usr/bin/env node

/**
 * Test script to validate Visual Builder loads correct content for edited stories
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simulate the Visual Builder load process
async function testVisualBuilderLoad(fileName, isEdited) {
  console.log(`\n🔧 Testing Visual Builder load for: ${fileName}`);
  console.log(`  isEdited: ${isEdited}`);
  
  // This simulates what happens in the backend getStoryForVisualBuilder function
  const generatedStoriesPath = path.join(__dirname, 'src', 'stories', 'generated');
  
  // Clean the filename (same logic as backend)
  let cleanFileName = fileName
    .replace(/\.stories\.stories\.tsx$/, '.stories.tsx')
    .replace(/\.stories\.tsx$/, '.stories.tsx');
  
  if (!cleanFileName.endsWith('.stories.tsx')) {
    cleanFileName = cleanFileName + '.stories.tsx';
  }
  
  console.log(`  Cleaned filename: ${cleanFileName}`);
  
  let fullPath;
  
  if (isEdited) {
    // For edited stories, check edited/ directory first
    const editedDir = path.join(generatedStoriesPath, '..', 'edited');
    
    // Try multiple filename patterns
    const filenamesToTry = [
      cleanFileName,
      cleanFileName.replace('.stories.tsx', '.stories.stories.tsx'),
    ];
    
    for (const tryFileName of filenamesToTry) {
      const editedPath = path.join(editedDir, tryFileName);
      if (fs.existsSync(editedPath)) {
        fullPath = editedPath;
        console.log(`  ✅ Found in edited/: ${tryFileName}`);
        break;
      }
    }
    
    // Fallback to generated if not found
    if (!fullPath) {
      const generatedPath = path.join(generatedStoriesPath, cleanFileName);
      if (fs.existsSync(generatedPath)) {
        fullPath = generatedPath;
        console.log(`  ⚠️ Not found in edited/, using generated/`);
      }
    }
  } else {
    // For generated stories
    fullPath = path.join(generatedStoriesPath, cleanFileName);
    if (!fs.existsSync(fullPath)) {
      const editedPath = path.join(generatedStoriesPath, '..', 'edited', cleanFileName);
      if (fs.existsSync(editedPath)) {
        fullPath = editedPath;
        console.log(`  ℹ️ Found in edited/ instead of generated/`);
      }
    } else {
      console.log(`  ✅ Found in generated/`);
    }
  }
  
  if (fullPath && fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    const titleMatch = content.match(/title:\s*['"]([^'"]+)['"]/);
    const layoutMatch = content.match(/layout:\s*['"]([^'"]+)['"]/);
    
    console.log(`  📄 Loaded from: ${path.relative(__dirname, fullPath)}`);
    console.log(`  📝 Title: ${titleMatch ? titleMatch[1] : 'unknown'}`);
    console.log(`  📐 Layout: ${layoutMatch ? layoutMatch[1] : 'unknown'}`);
    
    return { success: true, path: fullPath, content };
  } else {
    console.log(`  ❌ File not found!`);
    return { success: false };
  }
}

console.log('🧪 Testing Visual Builder file loading logic...');
console.log('=' .repeat(60));

// Test cases
const testCases = [
  // Test edited story with correct extension
  { fileName: 'eco-friendly-energy-services-cta-a916b9f3.stories.tsx', isEdited: true },
  // Test edited story without extension
  { fileName: 'eco-friendly-energy-services-cta-a916b9f3', isEdited: true },
  // Test generated story
  { fileName: 'eco-friendly-energy-services-cta-a916b9f3', isEdited: false },
  // Test another edited story
  { fileName: 'food-author-profile-section-ca0e5403', isEdited: true },
];

let allPassed = true;

for (const testCase of testCases) {
  const result = await testVisualBuilderLoad(testCase.fileName, testCase.isEdited);
  
  if (testCase.isEdited) {
    // For edited stories, should load from edited/ directory
    if (result.success && result.path.includes('/edited/')) {
      console.log(`  ✅ PASS: Correctly loaded edited version`);
    } else {
      console.log(`  ❌ FAIL: Should load from edited/ directory`);
      allPassed = false;
    }
  } else {
    // For generated stories, should load from generated/ directory
    if (result.success && result.path.includes('/generated/')) {
      console.log(`  ✅ PASS: Correctly loaded generated version`);
    } else {
      console.log(`  ❌ FAIL: Should load from generated/ directory`);
      allPassed = false;
    }
  }
}

console.log('\n' + '=' .repeat(60));
if (allPassed) {
  console.log('✨ All tests passed! Visual Builder file loading is working correctly.');
} else {
  console.log('⚠️ Some tests failed. Please review the file loading logic.');
}