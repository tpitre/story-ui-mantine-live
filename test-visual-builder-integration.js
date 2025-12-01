#!/usr/bin/env node

/**
 * Test script to verify Visual Builder integration
 * Run this after Storybook is running on port 6006
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Visual Builder Integration...\n');

// Test 1: Check if Vite plugin endpoint is working
async function testRawSourceEndpoint() {
  console.log('📝 Test 1: Raw Source Endpoint');
  console.log('================================');
  
  try {
    const response = await fetch('http://localhost:6006/api/raw-source?file=recipe-card-a4e6603b');
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Raw source endpoint is working');
      console.log(`   - File: ${data.fileName}`);
      console.log(`   - Source length: ${data.source.length} characters`);
      console.log(`   - Has Vite transforms: ${data.source.includes('__vite__') || data.source.includes('_jsxDEV') ? 'YES ❌' : 'NO ✅'}`);
      
      // Check if it's actual JSX
      const hasJSX = data.source.includes('<') && data.source.includes('/>');
      const hasImports = data.source.includes('import');
      console.log(`   - Contains JSX: ${hasJSX ? 'YES ✅' : 'NO ❌'}`);
      console.log(`   - Contains imports: ${hasImports ? 'YES ✅' : 'NO ❌'}`);
      
      return true;
    } else {
      console.log('❌ Raw source endpoint failed');
      console.log(`   - Status: ${response.status}`);
      console.log(`   - Error: ${data.error}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Could not connect to raw source endpoint');
    console.log(`   - Error: ${error.message}`);
    console.log('   - Make sure Storybook is running on port 6006');
    return false;
  }
}

// Test 2: Check if generated stories exist
function testGeneratedStories() {
  console.log('\n📝 Test 2: Generated Stories');
  console.log('================================');
  
  const storiesDir = path.join(__dirname, 'src', 'stories', 'generated');
  
  if (!fs.existsSync(storiesDir)) {
    console.log('❌ Generated stories directory not found');
    return false;
  }
  
  const stories = fs.readdirSync(storiesDir).filter(f => f.endsWith('.stories.tsx'));
  
  if (stories.length > 0) {
    console.log(`✅ Found ${stories.length} generated stories:`);
    stories.forEach(story => {
      console.log(`   - ${story}`);
      
      // Check if story has Visual Builder decorator
      const content = fs.readFileSync(path.join(storiesDir, story), 'utf-8');
      const hasDecorator = content.includes('withVisualBuilderButton') || content.includes('visualBuilder: true');
      console.log(`     ${hasDecorator ? '✅ Has Visual Builder support' : '⚠️  Missing Visual Builder decorator'}`);
    });
    return true;
  } else {
    console.log('❌ No generated stories found');
    return false;
  }
}

// Test 3: Verify Visual Builder story exists
function testVisualBuilderStory() {
  console.log('\n📝 Test 3: Visual Builder Story');
  console.log('================================');
  
  const vbStoryPath = path.join(__dirname, 'src', 'stories', 'VisualBuilder', 'VisualBuilder.stories.tsx');
  
  if (fs.existsSync(vbStoryPath)) {
    console.log('✅ Visual Builder story exists');
    
    const content = fs.readFileSync(vbStoryPath, 'utf-8');
    
    // Check key features
    const hasSessionStorage = content.includes('sessionStorage.getItem');
    const hasTransformCheck = content.includes('__vite__') && content.includes('_jsxDEV');
    const hasImportFromStoryUI = content.includes('importFromStoryUI');
    
    console.log(`   - Session storage integration: ${hasSessionStorage ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - Transform detection: ${hasTransformCheck ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - Story import support: ${hasImportFromStoryUI ? 'YES ✅' : 'NO ❌'}`);
    
    return hasSessionStorage && hasTransformCheck && hasImportFromStoryUI;
  } else {
    console.log('❌ Visual Builder story not found');
    return false;
  }
}

// Test 4: Check parser capabilities
function testParserCapabilities() {
  console.log('\n📝 Test 4: Parser Capabilities');
  console.log('================================');
  
  const parserPath = path.join(__dirname, 'src', 'visual-builder', 'utils', 'storyToBuilder.ts');
  
  if (fs.existsSync(parserPath)) {
    console.log('✅ Parser file exists');
    
    const content = fs.readFileSync(parserPath, 'utf-8');
    
    // Check key features
    const hasTransformDetection = content.includes('isViteTransformedCode');
    const hasJSXExtraction = content.includes('extractJSXFromStory');
    const hasValidation = content.includes('validateParsedComponents');
    const hasErrorHandling = content.includes('errors:') && content.includes('warnings:');
    
    console.log(`   - Transform detection: ${hasTransformDetection ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - JSX extraction: ${hasJSXExtraction ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - Component validation: ${hasValidation ? 'YES ✅' : 'NO ❌'}`);
    console.log(`   - Error handling: ${hasErrorHandling ? 'YES ✅' : 'NO ❌'}`);
    
    return hasTransformDetection && hasJSXExtraction && hasValidation;
  } else {
    console.log('❌ Parser file not found');
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Visual Builder Integration Tests');
  console.log('============================================\n');
  
  const results = [];
  
  // Run tests
  results.push(await testRawSourceEndpoint());
  results.push(testGeneratedStories());
  results.push(testVisualBuilderStory());
  results.push(testParserCapabilities());
  
  // Summary
  console.log('\n📊 Test Summary');
  console.log('================================');
  
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log(`   Tests passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Visual Builder integration is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('   1. Navigate to a generated story in Storybook');
    console.log('   2. Click the "🎨 Edit in Visual Builder ↗" button in the upper-right corner');
    console.log('   3. Visual Builder should open in a new tab with the story loaded');
    console.log('   4. You can edit components visually and see the JSX code');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
    console.log('\n📝 Troubleshooting:');
    console.log('   1. Make sure Storybook is running: npm run storybook');
    console.log('   2. Check that all files are properly installed');
    console.log('   3. Verify the Visual Builder package is imported correctly');
  }
  
  process.exit(passed === total ? 0 : 1);
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error);
  process.exit(1);
});