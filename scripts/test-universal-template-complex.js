/**
 * Comprehensive Test Suite for Universal Prompt Template
 * Tests complex app ideas to ensure 15+ screens with proper flows, roles, and edge cases
 */

const { UniversalPromptTemplateService } = require('../app/services/universalPromptTemplate');
const { ComprehensiveResponseParser } = require('../app/services/comprehensiveResponseParser');

// Complex app test cases
const complexAppTestCases = [
  {
    name: 'Enterprise Project Management Platform',
    idea: 'A comprehensive enterprise project management platform with real-time collaboration, advanced analytics, resource allocation, time tracking, budget management, client portals, automated reporting, AI-powered insights, multi-tenant architecture, role-based permissions, integration with 20+ third-party tools, custom workflows, and advanced security features.',
    expectedScreens: 25,
    expectedRoles: 5,
    expectedModels: 8,
    appType: 'saas-tool',
    complexity: 'production'
  },
  {
    name: 'Healthcare Management System',
    idea: 'A complete healthcare management system for hospitals with patient records, appointment scheduling, doctor availability, medical history tracking, prescription management, billing integration, insurance processing, lab results, imaging integration, telemedicine capabilities, emergency protocols, staff scheduling, inventory management, and compliance reporting.',
    expectedScreens: 30,
    expectedRoles: 6,
    expectedModels: 12,
    appType: 'web-app',
    complexity: 'production'
  },
  {
    name: 'E-learning Platform with AI',
    idea: 'An advanced e-learning platform with AI-powered personalized learning paths, video streaming, interactive quizzes, progress tracking, peer collaboration, instructor tools, content creation suite, analytics dashboard, certification management, payment processing, mobile app, offline content, gamification, and social learning features.',
    expectedScreens: 22,
    expectedRoles: 4,
    expectedModels: 10,
    appType: 'web-app',
    complexity: 'advanced'
  },
  {
    name: 'Multi-Vendor E-commerce Marketplace',
    idea: 'A comprehensive multi-vendor e-commerce marketplace with vendor onboarding, product catalog management, inventory tracking, order processing, payment gateway integration, shipping management, customer reviews, analytics dashboard, dispute resolution, commission tracking, marketing tools, mobile apps, and advanced search with AI recommendations.',
    expectedScreens: 28,
    expectedRoles: 5,
    expectedModels: 15,
    appType: 'web-app',
    complexity: 'production'
  },
  {
    name: 'Smart City Management Platform',
    idea: 'A smart city management platform with IoT device monitoring, traffic management, utility tracking, citizen services portal, emergency response coordination, environmental monitoring, public transportation integration, budget allocation, permit processing, complaint management, data visualization, predictive analytics, and mobile citizen app.',
    expectedScreens: 35,
    expectedRoles: 7,
    expectedModels: 20,
    appType: 'saas-tool',
    complexity: 'production'
  }
];

// Test configuration variations
const testConfigurations = [
  {
    name: 'MVP Configuration',
    config: {
      includeErrorStates: false,
      includeBackendModels: false,
      includeUIComponents: false,
      includeModalsPopups: false,
      appDepth: 'mvp',
      appType: 'web'
    }
  },
  {
    name: 'Advanced Configuration',
    config: {
      includeErrorStates: true,
      includeBackendModels: true,
      includeUIComponents: true,
      includeModalsPopups: true,
      appDepth: 'advanced',
      appType: 'web'
    }
  },
  {
    name: 'Production Configuration',
    config: {
      includeErrorStates: true,
      includeBackendModels: true,
      includeUIComponents: true,
      includeModalsPopups: true,
      appDepth: 'production',
      appType: 'web'
    }
  }
];

// RAG tools to test with
const testTools = ['lovable', 'framer', 'flutterflow', 'bubble'];

async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive Universal Template Tests...\n');
  
  const results = {
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    testResults: []
  };

  for (const testCase of complexAppTestCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log('=' .repeat(60));

    for (const config of testConfigurations) {
      for (const tool of testTools) {
        results.totalTests++;
        
        try {
          const testResult = await runSingleTest(testCase, config, tool);
          
          if (testResult.passed) {
            results.passedTests++;
            console.log(`✅ ${config.name} + ${tool}: PASSED`);
          } else {
            results.failedTests++;
            console.log(`❌ ${config.name} + ${tool}: FAILED - ${testResult.reason}`);
          }
          
          results.testResults.push({
            testCase: testCase.name,
            config: config.name,
            tool,
            ...testResult
          });

        } catch (error) {
          results.failedTests++;
          console.log(`❌ ${config.name} + ${tool}: ERROR - ${error.message}`);
          
          results.testResults.push({
            testCase: testCase.name,
            config: config.name,
            tool,
            passed: false,
            reason: error.message,
            metrics: {}
          });
        }
      }
    }
  }

  // Generate comprehensive report
  generateTestReport(results);
  
  console.log('\n🎉 Comprehensive Testing Complete!');
  console.log(`📊 Results: ${results.passedTests}/${results.totalTests} tests passed (${Math.round(results.passedTests/results.totalTests*100)}%)`);
  
  return results;
}

async function runSingleTest(testCase, config, tool) {
  // Create sample wizard data
  const wizardData = {
    step1: {
      appName: testCase.name,
      appType: testCase.appType
    },
    step2: {
      theme: 'modern',
      designStyle: 'professional',
      selectedTool: tool
    },
    step3: {
      platforms: testCase.appType === 'mobile-app' ? ['ios', 'android'] : ['web']
    },
    step4: {
      selectedAI: 'gemini'
    },
    userPrompt: testCase.idea
  };

  // Generate universal prompt
  const universalPrompt = UniversalPromptTemplateService.generateUniversalPrompt(
    testCase.idea,
    wizardData,
    { ...config.config, appDepth: testCase.complexity },
    tool
  );

  // Simulate AI response parsing (in real scenario, this would be AI-generated)
  const mockAIResponse = generateMockAIResponse(testCase, config.config);
  
  // Parse the response
  const blueprint = ComprehensiveResponseParser.parseResponse(mockAIResponse, wizardData);

  // Validate results
  const validation = validateTestResults(blueprint, testCase, config.config);

  return {
    passed: validation.passed,
    reason: validation.reason,
    metrics: {
      promptLength: universalPrompt.length,
      screenCount: blueprint.screens.length,
      roleCount: blueprint.userRoles.length,
      modelCount: blueprint.dataModels.length,
      modalCount: blueprint.modals.length,
      stateCount: blueprint.states.length,
      integrationCount: blueprint.integrations.length,
      confidence: blueprint.metadata.confidence,
      complexity: blueprint.metadata.complexity,
      estimatedDevTime: blueprint.metadata.estimatedDevTime
    },
    blueprint
  };
}

function generateMockAIResponse(testCase, config) {
  // Generate a comprehensive mock response that simulates what AI would return
  const screenCount = Math.max(testCase.expectedScreens, config.appDepth === 'mvp' ? 12 : config.appDepth === 'advanced' ? 18 : 25);
  
  let response = `# ${testCase.name} - Comprehensive App Blueprint\n\n`;
  
  // 1. Screens Section
  response += `## 1. 🖥️ **COMPREHENSIVE SCREENS LIST** (${screenCount} screens)\n\n`;
  response += `**Core Screens:**\n`;
  response += `- **Landing Page**: Main entry point with hero section and feature overview\n`;
  response += `- **Dashboard**: Main user interface with overview and quick actions\n`;
  response += `- **User Profile**: Personal information and account management\n`;
  response += `- **Settings**: Application configuration and preferences\n\n`;
  
  response += `**Authentication Flow:**\n`;
  response += `- **Login**: User authentication with email/password and social login\n`;
  response += `- **Register**: New user registration with email verification\n`;
  response += `- **Forgot Password**: Password recovery flow\n`;
  response += `- **Reset Password**: Password reset with secure token\n\n`;
  
  response += `**Administrative:**\n`;
  response += `- **Admin Dashboard**: Administrator control panel with system overview\n`;
  response += `- **User Management**: Manage user accounts and permissions\n`;
  response += `- **Analytics**: Detailed analytics and reporting dashboard\n\n`;
  
  if (config.includeErrorStates) {
    response += `**Edge Cases:**\n`;
    response += `- **404 Not Found**: Page not found error with navigation\n`;
    response += `- **500 Server Error**: Server error page with retry options\n`;
    response += `- **Maintenance Mode**: Scheduled maintenance notification\n\n`;
    
    response += `**Empty States:**\n`;
    response += `- **No Data Available**: Empty state with call-to-action\n`;
    response += `- **First Time User**: Onboarding empty state\n\n`;
    
    response += `**Loading States:**\n`;
    response += `- **Data Loading**: Loading spinner and progress indicators\n`;
    response += `- **Processing**: Long-running operation feedback\n\n`;
  }

  // 2. Navigation Section
  response += `## 2. 🧭 **DETAILED PAGE FLOW & NAVIGATION**\n\n`;
  response += `**Navigation Structure**: Hierarchical with sidebar navigation\n`;
  response += `**User Journey Mapping**:\n`;
  response += `- Landing → Registration/Login → Dashboard → Feature Pages\n`;
  response += `- Dashboard → Quick Actions → Detail Views → Back to Dashboard\n\n`;

  // 3. User Roles Section
  response += `## 3. 🧑‍🤝‍🧑 **USER ROLES & PERMISSIONS**\n\n`;
  response += `- **Guest**: Limited access to public pages and registration\n`;
  response += `- **User**: Standard user with access to personal data and features\n`;
  response += `- **Admin**: Full system access with user management capabilities\n`;
  response += `- **Moderator**: Content moderation and user support permissions\n\n`;

  // 4. Data Models Section
  if (config.includeBackendModels) {
    response += `## 4. 🗃️ **COMPREHENSIVE DATA MODELS**\n\n`;
    response += `- **User**: User account information with authentication data\n`;
    response += `- **Profile**: Extended user profile with preferences\n`;
    response += `- **Session**: User session management and tracking\n`;
    response += `- **Analytics**: User behavior and system metrics\n`;
    response += `- **Settings**: Application configuration and user preferences\n\n`;
  }

  // 5. Modals Section
  if (config.includeModalsPopups) {
    response += `## 5. 💬 **MODALS & INTERACTIVE ELEMENTS**\n\n`;
    response += `- **Confirmation Dialog**: Delete and destructive action confirmations\n`;
    response += `- **Edit Form Modal**: Quick edit forms for inline editing\n`;
    response += `- **Image Viewer**: Full-screen image and media viewer\n`;
    response += `- **Help Tooltip**: Contextual help and guidance\n\n`;
  }

  // 6. States Section
  if (config.includeErrorStates) {
    response += `## 6. 🧪 **STATES & EDGE CASES**\n\n`;
    response += `- **Loading State**: Data fetching with progress indicators\n`;
    response += `- **Error State**: Network and validation error handling\n`;
    response += `- **Empty State**: No data available with helpful actions\n`;
    response += `- **Success State**: Confirmation of completed actions\n\n`;
  }

  // 7. Integrations Section
  response += `## 7. 🧩 **THIRD-PARTY INTEGRATIONS**\n\n`;
  response += `- **Authentication**: OAuth providers (Google, GitHub, etc.)\n`;
  response += `- **Analytics**: User behavior tracking and insights\n`;
  response += `- **Storage**: Cloud file storage and CDN\n`;
  response += `- **Notifications**: Email and push notification services\n\n`;

  // 8. Architecture Section
  response += `## 8. 🏗️ **ARCHITECTURE PATTERN**\n\n`;
  response += `**Pattern Choice**: Clean Architecture with feature-based modules\n`;
  response += `**Reasoning**: Scalable, maintainable, and testable structure\n`;
  response += `**Folder Structure**: Organized by features with shared components\n\n`;

  return response;
}

function validateTestResults(blueprint, testCase, config) {
  const issues = [];

  // Validate screen count
  const minScreens = config.appDepth === 'mvp' ? 10 : config.appDepth === 'advanced' ? 15 : 20;
  if (blueprint.screens.length < minScreens) {
    issues.push(`Expected at least ${minScreens} screens, got ${blueprint.screens.length}`);
  }

  // Validate user roles
  if (blueprint.userRoles.length < 2) {
    issues.push(`Expected at least 2 user roles, got ${blueprint.userRoles.length}`);
  }

  // Validate data models (if enabled)
  if (config.includeBackendModels && blueprint.dataModels.length < 3) {
    issues.push(`Expected at least 3 data models, got ${blueprint.dataModels.length}`);
  }

  // Validate states (if enabled)
  if (config.includeErrorStates && blueprint.states.length < 2) {
    issues.push(`Expected at least 2 app states, got ${blueprint.states.length}`);
  }

  // Validate modals (if enabled)
  if (config.includeModalsPopups && blueprint.modals.length < 1) {
    issues.push(`Expected at least 1 modal, got ${blueprint.modals.length}`);
  }

  // Validate confidence score
  if (blueprint.metadata.confidence < 0.7) {
    issues.push(`Low confidence score: ${blueprint.metadata.confidence}`);
  }

  return {
    passed: issues.length === 0,
    reason: issues.length > 0 ? issues.join('; ') : 'All validations passed',
    issues
  };
}

function generateTestReport(results) {
  console.log('\n📊 COMPREHENSIVE TEST REPORT');
  console.log('=' .repeat(80));
  
  // Summary by test case
  const testCaseSummary = {};
  results.testResults.forEach(result => {
    if (!testCaseSummary[result.testCase]) {
      testCaseSummary[result.testCase] = { passed: 0, total: 0 };
    }
    testCaseSummary[result.testCase].total++;
    if (result.passed) testCaseSummary[result.testCase].passed++;
  });

  console.log('\n📋 Test Case Summary:');
  Object.entries(testCaseSummary).forEach(([testCase, summary]) => {
    const percentage = Math.round(summary.passed / summary.total * 100);
    console.log(`  ${testCase}: ${summary.passed}/${summary.total} (${percentage}%)`);
  });

  // Summary by configuration
  const configSummary = {};
  results.testResults.forEach(result => {
    if (!configSummary[result.config]) {
      configSummary[result.config] = { passed: 0, total: 0 };
    }
    configSummary[result.config].total++;
    if (result.passed) configSummary[result.config].passed++;
  });

  console.log('\n⚙️ Configuration Summary:');
  Object.entries(configSummary).forEach(([config, summary]) => {
    const percentage = Math.round(summary.passed / summary.total * 100);
    console.log(`  ${config}: ${summary.passed}/${summary.total} (${percentage}%)`);
  });

  // Average metrics
  const passedResults = results.testResults.filter(r => r.passed && r.metrics);
  if (passedResults.length > 0) {
    const avgMetrics = {
      screenCount: Math.round(passedResults.reduce((sum, r) => sum + r.metrics.screenCount, 0) / passedResults.length),
      roleCount: Math.round(passedResults.reduce((sum, r) => sum + r.metrics.roleCount, 0) / passedResults.length),
      modelCount: Math.round(passedResults.reduce((sum, r) => sum + r.metrics.modelCount, 0) / passedResults.length),
      confidence: Math.round(passedResults.reduce((sum, r) => sum + r.metrics.confidence, 0) / passedResults.length * 100) / 100
    };

    console.log('\n📈 Average Metrics (Passed Tests):');
    console.log(`  Screens: ${avgMetrics.screenCount}`);
    console.log(`  User Roles: ${avgMetrics.roleCount}`);
    console.log(`  Data Models: ${avgMetrics.modelCount}`);
    console.log(`  Confidence: ${avgMetrics.confidence}`);
  }

  // Failed test details
  const failedTests = results.testResults.filter(r => !r.passed);
  if (failedTests.length > 0) {
    console.log('\n❌ Failed Test Details:');
    failedTests.forEach(test => {
      console.log(`  ${test.testCase} (${test.config} + ${test.tool}): ${test.reason}`);
    });
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runComprehensiveTests().catch(console.error);
}

module.exports = { runComprehensiveTests, complexAppTestCases };
