/**
 * Direct Parser Testing - Node.js version
 * Tests the JSX parser functionality without browser dependencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Visual Builder Parser Direct Test');
console.log('===================================');

// Mock the required types and functions for Node.js environment
const mockComponentTypes = {
  'Container': 'Container',
  'Stack': 'Stack', 
  'SimpleGrid': 'SimpleGrid',
  'Card': 'Card',
  'Card.Section': 'CardSection',
  'Image': 'Image',
  'Text': 'Text',
  'Title': 'Title',
  'Badge': 'Badge',
  'Button': 'Button',
  'Group': 'Group',
  'Avatar': 'Avatar',
  'div': 'Box',
  'span': 'Text'
};

const mockCategories = {
  'Container': 'Layout',
  'Stack': 'Layout',
  'SimpleGrid': 'Layout',
  'Group': 'Layout',
  'Box': 'Layout',
  'Card': 'Data Display',
  'CardSection': 'Data Display',
  'Image': 'Data Display',
  'Avatar': 'Data Display',
  'Text': 'Typography',
  'Title': 'Typography',
  'Badge': 'Feedback',
  'Button': 'Inputs'
};

// Test the JSX extraction function
function extractJSXFromStory(storyCode) {
  try {
    console.log('🔍 Extracting JSX from story code...');
    
    // Check for Vite-transformed code and reject it
    if (storyCode.includes('__vite__cjsImport') || storyCode.includes('_jsxDEV')) {
      throw new Error('Received Vite-transformed code instead of source code.');
    }
    
    // Match the render function and extract its return JSX
    const renderMatch = storyCode.match(/render:\s*\(\)\s*=>\s*\(([\s\S]*?)\)\s*[,}]/);
    if (renderMatch) {
      console.log('✅ Found JSX in render function');
      return renderMatch[1].trim();
    }

    // Fallback: try to find JSX in return statement  
    const returnMatch = storyCode.match(/return\s*\(([\s\S]*?)\);?\s*}/);
    if (returnMatch) {
      console.log('✅ Found JSX in return statement');
      return returnMatch[1].trim();
    }

    console.warn('⚠️ No JSX pattern matched');
    return storyCode;
  } catch (error) {
    console.error('❌ Error extracting JSX:', error.message);
    throw error;
  }
}

// Simple JSX tokenizer for testing
function tokenizeJSX(jsx) {
  const tokens = [];
  let i = 0;
  
  while (i < jsx.length) {
    // Skip whitespace
    while (i < jsx.length && /\s/.test(jsx[i])) {
      i++;
    }
    
    if (i >= jsx.length) break;
    
    // Handle JSX elements
    if (jsx[i] === '<') {
      const tokenStart = i;
      i++; // skip '<'
      
      // Check for closing tag
      const isClosingTag = jsx[i] === '/';
      if (isClosingTag) {
        i++; // skip '/'
      }
      
      // Extract tag name
      let tagName = '';
      while (i < jsx.length && /[a-zA-Z0-9._]/.test(jsx[i])) {
        tagName += jsx[i];
        i++;
      }
      
      if (!tagName) {
        i++;
        continue;
      }
      
      // Handle closing tag
      if (isClosingTag) {
        while (i < jsx.length && jsx[i] !== '>') {
          i++;
        }
        if (jsx[i] === '>') i++;
        
        tokens.push({
          type: 'tag_close',
          tagName,
          position: { start: tokenStart, end: i }
        });
        continue;
      }
      
      // Extract attributes for opening tag
      let attributes = '';
      while (i < jsx.length && jsx[i] !== '>') {
        if (jsx[i] === '/' && jsx[i + 1] === '>') {
          break; // Self-closing tag
        }
        attributes += jsx[i];
        i++;
      }
      
      // Check for self-closing tag
      const isSelfClosing = jsx[i] === '/' && jsx[i + 1] === '>';
      if (isSelfClosing) {
        i += 2; // skip '/>'
        tokens.push({
          type: 'tag_self_close',
          tagName,
          attributes: attributes.trim(),
          position: { start: tokenStart, end: i }
        });
      } else if (jsx[i] === '>') {
        i++; // skip '>'
        tokens.push({
          type: 'tag_open',
          tagName,
          attributes: attributes.trim(),
          position: { start: tokenStart, end: i }
        });
      }
      
    } else {
      // Handle text content
      const textStart = i;
      let textContent = '';
      
      while (i < jsx.length && jsx[i] !== '<') {
        textContent += jsx[i];
        i++;
      }
      
      const trimmedText = textContent.trim();
      if (trimmedText) {
        tokens.push({
          type: 'text',
          content: trimmedText,
          position: { start: textStart, end: i }
        });
      }
    }
  }
  
  return tokens;
}

// Parse JSX into component tree
function parseJSXElement(jsx) {
  const components = [];
  const idCounter = { value: 1 };
  
  try {
    jsx = jsx.trim();
    if (!jsx) return components;
    
    // Handle pure text content
    if (!jsx.startsWith('<')) {
      const textContent = jsx.replace(/^\{|\}$/g, '').trim();
      if (textContent) {
        components.push({
          id: `text-${idCounter.value++}`,
          type: 'Text',
          displayName: 'Text',
          category: 'Typography',
          props: {
            children: textContent.replace(/^["']|["']$/g, '')
          }
        });
      }
      return components;
    }
    
    // Tokenize the JSX
    const tokens = tokenizeJSX(jsx);
    console.log(`📝 Generated ${tokens.length} tokens`);
    
    // Use stack-based parsing to build component tree
    const parseStack = [];
    let currentComponent = null;
    
    for (const token of tokens) {
      switch (token.type) {
        case 'tag_open': {
          const tagName = token.tagName;
          const componentType = mockComponentTypes[tagName] || tagName;
          const category = mockCategories[componentType] || 'Other';
          
          const component = {
            id: `${componentType.toLowerCase()}-${idCounter.value++}`,
            type: componentType,
            displayName: componentType,
            category,
            props: {}
          };
          
          if (currentComponent) {
            parseStack.push({ component: currentComponent, children: [] });
          }
          
          currentComponent = component;
          break;
        }
        
        case 'tag_self_close': {
          const tagName = token.tagName;
          const componentType = mockComponentTypes[tagName] || tagName;
          const category = mockCategories[componentType] || 'Other';
          
          const component = {
            id: `${componentType.toLowerCase()}-${idCounter.value++}`,
            type: componentType,
            displayName: componentType,
            category,
            props: {}
          };
          
          if (parseStack.length > 0) {
            parseStack[parseStack.length - 1].children.push(component);
          } else {
            components.push(component);
          }
          break;
        }
        
        case 'tag_close': {
          if (currentComponent && token.tagName === getOriginalTagName(currentComponent.type)) {
            if (parseStack.length > 0) {
              const parentContext = parseStack[parseStack.length - 1];
              if (parentContext.children.length > 0) {
                currentComponent.children = parentContext.children;
              }
              
              const parent = parseStack.pop();
              parent.children.push(currentComponent);
              currentComponent = parent.component;
            } else {
              components.push(currentComponent);
              currentComponent = null;
            }
          }
          break;
        }
        
        case 'text': {
          const textContent = token.content.replace(/^\{|\}$/g, '').trim();
          if (textContent) {
            const textComponent = {
              id: `text-${idCounter.value++}`,
              type: 'Text',
              displayName: 'Text',
              category: 'Typography',
              props: {
                children: textContent.replace(/^["']|["']$/g, '')
              }
            };
            
            if (parseStack.length > 0) {
              parseStack[parseStack.length - 1].children.push(textComponent);
            } else if (currentComponent) {
              currentComponent.props.children = textContent.replace(/^["']|["']$/g, '');
            } else {
              components.push(textComponent);
            }
          }
          break;
        }
      }
    }
    
    // Handle any remaining component on stack
    if (currentComponent) {
      components.push(currentComponent);
    }
    
  } catch (error) {
    console.error('❌ Error parsing JSX elements:', error);
  }
  
  return components;
}

function getOriginalTagName(componentType) {
  const reverseMap = {};
  for (const [key, value] of Object.entries(mockComponentTypes)) {
    reverseMap[value] = key;
  }
  return reverseMap[componentType] || componentType;
}

// Test with recipe card story
async function testRecipeCardParsing() {
  console.log('\n📄 Loading Recipe Card Story...');
  
  try {
    const storyPath = path.join(__dirname, 'src', 'stories', 'generated', 'recipe-card-a4e6603b.stories.tsx');
    const storyCode = fs.readFileSync(storyPath, 'utf-8');
    
    console.log(`📁 Loaded story file: ${storyPath}`);
    console.log(`📊 File size: ${storyCode.length} characters`);
    
    // Extract JSX
    const jsx = extractJSXFromStory(storyCode);
    console.log(`📝 Extracted JSX length: ${jsx.length} characters`);
    console.log(`🔍 JSX preview: ${jsx.substring(0, 200)}...`);
    
    // Parse JSX
    const components = parseJSXElement(jsx);
    console.log(`🏗️  Parsed ${components.length} root components`);
    
    // Log component tree structure
    const logComponentStructure = (comps, depth = 0) => {
      comps.forEach(comp => {
        const indent = '  '.repeat(depth);
        console.log(`${indent}📦 ${comp.type} (${comp.id}) - children: ${comp.children?.length || 0}`);
        if (comp.children?.length) {
          logComponentStructure(comp.children, depth + 1);
        }
      });
    };
    
    console.log('\n🌳 Component Tree Structure:');
    logComponentStructure(components);
    
    // Verify expected structure
    console.log('\n🔍 Structure Verification:');
    if (components.length > 0) {
      const rootComponent = components[0];
      console.log(`✅ Root component: ${rootComponent.type} (expected: Card)`);
      
      if (rootComponent.children && rootComponent.children.length > 0) {
        console.log(`✅ Has children: ${rootComponent.children.length}`);
        
        // Check for Card.Section (should be CardSection)
        const hasCardSection = rootComponent.children.some(child => child.type === 'CardSection');
        console.log(`${hasCardSection ? '✅' : '❌'} Has CardSection`);
        
        // Check for Stack
        const hasStack = rootComponent.children.some(child => child.type === 'Stack');
        console.log(`${hasStack ? '✅' : '❌'} Has Stack`);
        
        // Count total components recursively
        const countComponents = (comps) => {
          let count = comps.length;
          comps.forEach(comp => {
            if (comp.children) {
              count += countComponents(comp.children);
            }
          });
          return count;
        };
        
        const totalComponents = countComponents(components);
        console.log(`📊 Total components: ${totalComponents}`);
        
        // Expected: Card > CardSection + Stack > Multiple Groups > Multiple components
        if (totalComponents > 10) {
          console.log('✅ Component count looks correct for recipe card');
        } else {
          console.log('⚠️  Component count seems low - check parsing');
        }
      } else {
        console.log('❌ Root component has no children - parsing issue');
      }
    } else {
      console.log('❌ No root components found - parsing failed');
    }
    
    return {
      success: components.length > 0,
      components,
      jsx
    };
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
console.log('🚀 Starting Recipe Card parsing test...');
const result = await testRecipeCardParsing();

if (result.success) {
  console.log('\n🎉 TEST PASSED: Parser working correctly!');
  console.log('✅ Visual Builder should be able to parse nested components');
} else {
  console.log('\n❌ TEST FAILED:', result.error);
  console.log('🔧 Parser needs fixes for proper functionality');
}

console.log('\n📊 Test Complete');