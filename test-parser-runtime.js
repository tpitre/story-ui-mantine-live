// Runtime test for the JSX parser with actual imports
import { parseStoryUIToBuilder, extractJSXFromStory } from './src/visual-builder/utils/storyToBuilder.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testParser() {
  console.log('🧪 Testing Updated JSX Parser');
  console.log('=' .repeat(50));
  
  try {
    // Read the story file
    const storyPath = path.join(__dirname, 'src/stories/generated/recipe-card-a4e6603b.stories.tsx');
    const storyContent = fs.readFileSync(storyPath, 'utf8');
    
    console.log('📖 Story file loaded, length:', storyContent.length);
    
    // Test the parser
    const result = parseStoryUIToBuilder(storyContent);
    
    console.log('📊 Parse Results:');
    console.log('  Components found:', result.components.length);
    console.log('  Errors:', result.errors.length);
    console.log('  Warnings:', result.warnings.length);
    
    if (result.errors.length > 0) {
      console.log('❌ Errors:');
      result.errors.forEach(error => console.log('   ', error));
    }
    
    if (result.warnings.length > 0) {
      console.log('⚠️ Warnings:');
      result.warnings.forEach(warning => console.log('   ', warning));
    }
    
    // Analyze component structure
    function analyzeStructure(components, depth = 0) {
      const indent = '  '.repeat(depth);
      let totalCount = 0;
      
      components.forEach(comp => {
        console.log(`${indent}📦 ${comp.type} (${comp.id}) - children: ${comp.children?.length || 0}`);
        totalCount++;
        
        if (comp.children && comp.children.length > 0) {
          totalCount += analyzeStructure(comp.children, depth + 1);
        }
      });
      
      return totalCount;
    }
    
    if (result.components.length > 0) {
      console.log('\n🌳 Component Tree Structure:');
      const totalComponents = analyzeStructure(result.components);
      console.log(`\n📈 Total components in tree: ${totalComponents}`);
      
      // Verify the specific nesting we expect
      const rootCard = result.components[0];
      if (rootCard && rootCard.type === 'Card') {
        console.log('\n✅ Found root Card component');
        
        if (rootCard.children && rootCard.children.length >= 2) {
          console.log('✅ Card has child components:', rootCard.children.map(c => c.type));
          
          const cardSection = rootCard.children.find(c => c.type === 'CardSection');
          const stack = rootCard.children.find(c => c.type === 'Stack'); 
          
          if (cardSection) {
            console.log('✅ Found CardSection with children:', cardSection.children?.length || 0);
          } else {
            console.log('❌ CardSection not found');
          }
          
          if (stack) {
            console.log('✅ Found Stack with children:', stack.children?.length || 0);
          } else {
            console.log('❌ Stack not found');
          }
        } else {
          console.log('❌ Card has no children or insufficient children');
        }
      } else {
        console.log('❌ Root component is not Card:', rootCard?.type || 'none');
      }
    } else {
      console.log('❌ No components parsed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testParser();