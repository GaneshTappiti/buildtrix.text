'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Loader2, Play } from 'lucide-react';

// Import all the services we need to test
import { generateRAGEnhancedPrompt } from '@/services/ragEnhancedGenerator';
import { getAllRAGToolProfiles } from '@/services/ragToolProfiles';
import { geminiService } from '@/services/geminiService';
import { UniversalPromptTemplateService, DEFAULT_CONFIGS } from '@/services/universalPromptTemplate';
import { ComprehensiveResponseParser } from '@/services/comprehensiveResponseParser';
import { RAGContextInjector } from '@/services/ragContextInjector';
import { MVPWizardData, RAGTool } from '@/types/ideaforge';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function CompleteWorkflowTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'RAG Tool Profiles Loading', status: 'pending', message: 'Not started' },
    { name: 'RAG Context Generation', status: 'pending', message: 'Not started' },
    { name: 'Universal Prompt Template', status: 'pending', message: 'Not started' },
    { name: 'Gemini AI Service', status: 'pending', message: 'Not started' },
    { name: 'RAG-Enhanced Prompt Generation', status: 'pending', message: 'Not started' },
    { name: 'Comprehensive Response Parser', status: 'pending', message: 'Not started' },
    { name: 'End-to-End RAG Workflow', status: 'pending', message: 'Not started' }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(-1);
  const [results, setResults] = useState<any[]>([]);

  // Sample wizard data for testing
  const sampleWizardData: MVPWizardData = {
    step1: {
      appName: 'TaskMaster Pro',
      appType: 'web-app'
    },
    step2: {
      theme: 'dark',
      designStyle: 'minimal',
      selectedTool: 'lovable' as RAGTool
    },
    step3: {
      platforms: ['web']
    },
    step4: {
      selectedAI: 'gemini'
    },
    userPrompt: 'A comprehensive task management application with real-time collaboration, project tracking, team productivity analytics, and automated workflow management.'
  };

  const updateTest = (index: number, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, message, duration } : test
    ));
  };

  const runTest = async (index: number, testFn: () => Promise<any>) => {
    setCurrentTest(index);
    updateTest(index, 'running', 'Running...');
    
    const startTime = Date.now();
    try {
      const result = await testFn();
      const duration = Date.now() - startTime;
      updateTest(index, 'success', 'Passed', duration);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      updateTest(index, 'error', error instanceof Error ? error.message : 'Unknown error', duration);
      throw error;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    try {
      // Test 1: RAG Tool Profiles Loading
      const toolProfiles = await runTest(0, async () => {
        const profiles = getAllRAGToolProfiles();
        if (profiles.length === 0) throw new Error('No RAG tool profiles found');
        return profiles;
      });

      // Test 2: RAG Context Generation
      const ragContext = await runTest(1, async () => {
        const context = await RAGContextInjector.getContextForStage({
          stage: 'tool_selection',
          toolId: 'lovable',
          appIdea: sampleWizardData.userPrompt,
          appType: 'web-app',
          platforms: ['web']
        });
        return context;
      });

      // Test 3: Universal Prompt Template
      const universalPrompt = await runTest(2, async () => {
        const config = DEFAULT_CONFIGS['web-app'];
        const prompt = UniversalPromptTemplateService.generateUniversalPrompt(
          sampleWizardData.userPrompt,
          sampleWizardData,
          config,
          'lovable'
        );
        if (!prompt || prompt.length < 100) throw new Error('Generated prompt too short');
        return prompt;
      });

      // Test 4: Gemini AI Service
      const aiResponse = await runTest(3, async () => {
        const response = await geminiService.generateText('Test prompt for validation', {
          maxTokens: 100,
          temperature: 0.7
        });
        if (!response.text) throw new Error('No response from Gemini');
        return response;
      });

      // Test 5: RAG-Enhanced Prompt Generation
      const ragPrompt = await runTest(4, async () => {
        const result = await generateRAGEnhancedPrompt({
          type: 'framework',
          wizardData: sampleWizardData,
          selectedTool: 'lovable',
          additionalContext: {
            userPrompt: sampleWizardData.userPrompt
          }
        });
        if (!result.prompt) throw new Error('No RAG-enhanced prompt generated');
        return result;
      });

      // Test 6: Comprehensive Response Parser
      const parsedResponse = await runTest(5, async () => {
        const mockResponse = `
## SCREENS LIST

**Core Screens:**
- **Dashboard** - Main user interface with task overview
- **Task List** - Comprehensive task management
- **Project View** - Project-specific task organization

## USER ROLES
- **Admin** - Full system access and user management
- **User** - Standard task management capabilities

## COMPREHENSIVE DATA MODELS
- **Task** - Individual task with status, priority, and assignments
- **Project** - Container for related tasks and team collaboration
        `;
        
        const parsed = ComprehensiveResponseParser.parseResponse(mockResponse, sampleWizardData);
        if (parsed.screens.length === 0) throw new Error('No screens parsed');
        return parsed;
      });

      // Test 7: End-to-End RAG Workflow
      await runTest(6, async () => {
        // This simulates the complete workflow from the MVPWizard
        const config = DEFAULT_CONFIGS['web-app'];
        const prompt = UniversalPromptTemplateService.generateUniversalPrompt(
          sampleWizardData.userPrompt,
          sampleWizardData,
          config,
          'lovable'
        );
        
        const response = await geminiService.generateText(prompt, {
          maxTokens: 2000,
          temperature: 0.7
        });
        
        const parsed = ComprehensiveResponseParser.parseResponse(response.text, sampleWizardData);
        
        if (!parsed.screens || parsed.screens.length === 0) {
          throw new Error('End-to-end workflow failed: No screens generated');
        }
        
        return {
          screensGenerated: parsed.screens.length,
          userRoles: parsed.userRoles.length,
          dataModels: parsed.dataModels.length,
          confidence: parsed.metadata.confidence
        };
      });

      setResults([
        toolProfiles,
        ragContext,
        universalPrompt.substring(0, 200) + '...',
        aiResponse,
        ragPrompt,
        parsedResponse,
        'Complete workflow successful!'
      ]);

    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
      setCurrentTest(-1);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-400" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'running':
        return 'border-blue-500/50 bg-blue-500/10';
      case 'success':
        return 'border-green-500/50 bg-green-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Complete Workflow Test</h1>
        <p className="text-muted-foreground">
          Test the complete RAG-enhanced MVP Studio workflow end-to-end
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Test Results
              <div className="flex gap-2">
                <Badge variant="outline" className="text-green-600">
                  ✓ {successCount}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  ✗ {errorCount}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border transition-all ${getStatusColor(test.status)}`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
                    <div className="font-medium text-sm">{test.name}</div>
                    <div className="text-xs text-muted-foreground">{test.message}</div>
                    {test.duration && (
                      <div className="text-xs text-muted-foreground">
                        {test.duration}ms
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runAllTests}
              disabled={isRunning}
              className="w-full"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run All Tests
                </>
              )}
            </Button>

            {results.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Sample Results:</h4>
                <Textarea
                  value={JSON.stringify(results[results.length - 1], null, 2)}
                  readOnly
                  className="min-h-[200px] font-mono text-xs"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
