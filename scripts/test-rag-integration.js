/**
 * Test script for RAG integration
 * Tests the complete RAG flow with sample tools
 */

const { RAGDocumentationReader } = require('../app/services/ragDocumentationReader');
const { generateRAGEnhancedPrompt } = require('../app/services/ragEnhancedGenerator');

async function testRAGIntegration() {
  console.log('🚀 Testing RAG Integration with Sample Tools...\n');

  // Test tools
  const testTools = ['lovable', 'framer', 'flutterflow'];
  
  // Sample wizard data
  const sampleWizardData = {
    step1: {
      appName: 'TaskMaster Pro',
      appType: 'web-app'
    },
    step2: {
      theme: 'dark',
      designStyle: 'minimal',
      selectedTool: 'lovable'
    },
    step3: {
      platforms: ['web']
    },
    step4: {
      selectedAI: 'gemini'
    },
    userPrompt: 'A comprehensive task management application with real-time collaboration, project tracking, and team productivity analytics.'
  };

  for (const toolId of testTools) {
    console.log(`\n📋 Testing ${toolId.toUpperCase()}:`);
    console.log('=' .repeat(50));

    try {
      // Test 1: Check if documentation exists
      console.log('1. Checking documentation availability...');
      const documentation = await RAGDocumentationReader.getToolDocumentation(toolId);
      
      console.log(`   ✅ Main Prompt: ${documentation.mainPrompt ? 'Available' : 'Missing'}`);
      console.log(`   ✅ System Prompt: ${documentation.systemPrompt ? 'Available' : 'Missing'}`);
      console.log(`   ✅ Guides: ${documentation.guides?.length || 0} files`);
      console.log(`   ✅ Tools Config: ${documentation.tools ? 'Available' : 'Missing'}`);

      // Test 2: Generate RAG context
      console.log('2. Generating RAG context...');
      const ragContext = await RAGDocumentationReader.generateRAGContext(
        toolId,
        sampleWizardData.step1.appType,
        sampleWizardData.step3.platforms,
        sampleWizardData.userPrompt
      );

      console.log(`   ✅ Optimization Tips: ${ragContext.optimizationTips.length}`);
      console.log(`   ✅ Constraints: ${ragContext.constraints.length}`);
      console.log(`   ✅ Best Practices: ${ragContext.bestPractices.length}`);
      console.log(`   ✅ Common Pitfalls: ${ragContext.commonPitfalls.length}`);

      // Test 3: Generate enhanced framework prompt
      console.log('3. Generating enhanced framework prompt...');
      const testWizardData = {
        ...sampleWizardData,
        step2: { ...sampleWizardData.step2, selectedTool: toolId }
      };

      const frameworkResult = await generateRAGEnhancedPrompt({
        type: 'framework',
        wizardData: testWizardData,
        selectedTool: toolId,
        additionalContext: {
          userPrompt: sampleWizardData.userPrompt
        }
      });

      console.log(`   ✅ Framework Prompt Generated: ${frameworkResult.prompt.length} characters`);
      console.log(`   ✅ Confidence Score: ${frameworkResult.confidence}`);
      console.log(`   ✅ Tool Context Available: ${frameworkResult.toolContext ? 'Yes' : 'No'}`);

      // Test 4: Generate enhanced page prompt
      console.log('4. Generating enhanced page prompt...');
      const pageResult = await generateRAGEnhancedPrompt({
        type: 'page',
        wizardData: testWizardData,
        selectedTool: toolId,
        additionalContext: {
          pageName: 'Dashboard',
          pageData: {
            description: 'Main dashboard with task overview and analytics',
            components: ['TaskList', 'Analytics', 'QuickActions'],
            layout: 'grid'
          }
        }
      });

      console.log(`   ✅ Page Prompt Generated: ${pageResult.prompt.length} characters`);
      console.log(`   ✅ Tool-Specific Optimizations: ${pageResult.toolSpecificOptimizations.length}`);

      // Test 5: Generate enhanced linking prompt
      console.log('5. Generating enhanced linking prompt...');
      const linkingResult = await generateRAGEnhancedPrompt({
        type: 'linking',
        wizardData: testWizardData,
        selectedTool: toolId,
        additionalContext: {
          pageNames: ['Dashboard', 'Projects', 'Tasks', 'Analytics', 'Settings']
        }
      });

      console.log(`   ✅ Linking Prompt Generated: ${linkingResult.prompt.length} characters`);

      // Show sample optimization tips
      console.log('\n📝 Sample Optimization Tips:');
      ragContext.optimizationTips.slice(0, 3).forEach((tip, index) => {
        console.log(`   ${index + 1}. ${tip}`);
      });

      console.log(`\n✅ ${toolId.toUpperCase()} integration test PASSED`);

    } catch (error) {
      console.error(`\n❌ ${toolId.toUpperCase()} integration test FAILED:`, error.message);
    }
  }

  // Test 6: Available tools detection
  console.log('\n\n🔍 Testing Available Tools Detection:');
  console.log('=' .repeat(50));
  
  try {
    const availableTools = RAGDocumentationReader.getAvailableToolsWithDocs();
    console.log(`✅ Found ${availableTools.length} tools with documentation:`);
    availableTools.forEach(tool => {
      console.log(`   - ${tool}`);
    });
  } catch (error) {
    console.error('❌ Failed to detect available tools:', error.message);
  }

  console.log('\n🎉 RAG Integration Testing Complete!');
}

// Run the test if this script is executed directly
if (require.main === module) {
  testRAGIntegration().catch(console.error);
}

module.exports = { testRAGIntegration };
