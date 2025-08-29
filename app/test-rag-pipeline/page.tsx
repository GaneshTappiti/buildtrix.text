"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { RAGContextInjector } from '@/services/ragContextInjector';
import { RAGTool } from '@/types/ideaforge';
import { CheckCircle, AlertCircle, Loader2, TestTube } from 'lucide-react';

/**
 * RAG Enhancement Pipeline Test Page
 * Tests the complete RAG integration across all stages
 */
export default function TestRAGPipelinePage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');

  const testScenarios = [
    {
      name: 'Tool Selection Enhancement',
      stage: 'tool_selection' as const,
      toolId: 'lovable' as RAGTool,
      appIdea: 'A social media app for developers',
      expected: ['toolSpecificContext', 'bestPractices']
    },
    {
      name: 'Blueprint Generation Enhancement',
      stage: 'blueprint_generation' as const,
      toolId: 'cursor' as RAGTool,
      appIdea: 'An e-commerce platform with AI recommendations',
      expected: ['architecturePatterns', 'optimizationTips']
    },
    {
      name: 'Prompt Generation Enhancement',
      stage: 'prompt_generation' as const,
      toolId: 'v0' as RAGTool,
      appIdea: 'A task management app with real-time collaboration',
      screenName: 'Dashboard',
      expected: ['codeExamples', 'bestPractices']
    },
    {
      name: 'Flow Generation Enhancement',
      stage: 'flow_generation' as const,
      toolId: 'bolt' as RAGTool,
      appIdea: 'A fitness tracking app with social features',
      expected: ['architecturePatterns', 'bestPractices']
    }
  ];

  const runRAGPipelineTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    for (const scenario of testScenarios) {
      setCurrentTest(scenario.name);
      
      try {
        const startTime = Date.now();
        
        const ragContext = await RAGContextInjector.getContextForStage({
          stage: scenario.stage,
          toolId: scenario.toolId,
          appIdea: scenario.appIdea,
          appType: 'web-app',
          platforms: ['web'],
          screenName: scenario.screenName
        });
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        // Validate expected properties
        const hasExpectedProps = scenario.expected.every(prop => {
          const value = (ragContext as any)[prop];
          return value && (Array.isArray(value) ? value.length > 0 : value.length > 0);
        });
        
        const result = {
          name: scenario.name,
          status: hasExpectedProps ? 'success' : 'warning',
          duration,
          context: ragContext,
          details: {
            toolId: scenario.toolId,
            stage: scenario.stage,
            contextSize: JSON.stringify(ragContext).length,
            hasToolContext: !!ragContext.toolSpecificContext,
            hasArchPatterns: !!ragContext.architecturePatterns,
            bestPracticesCount: ragContext.bestPractices?.length || 0,
            codeExamplesCount: ragContext.codeExamples?.length || 0,
            optimizationTipsCount: ragContext.optimizationTips?.length || 0,
            constraintsCount: ragContext.constraints?.length || 0
          }
        };
        
        setTestResults(prev => [...prev, result]);
        
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        const result = {
          name: scenario.name,
          status: 'error',
          duration: 0,
          error: error instanceof Error ? error.message : 'Unknown error',
          details: {
            toolId: scenario.toolId,
            stage: scenario.stage
          }
        };
        
        setTestResults(prev => [...prev, result]);
      }
    }
    
    setCurrentTest('');
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TestTube className="h-6 w-6 text-green-400" />
              RAG Enhancement Pipeline Test Suite
            </CardTitle>
            <p className="text-gray-400">
              Comprehensive testing of RAG context injection across all MVP Studio stages
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                onClick={runRAGPipelineTests}
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  'Run RAG Pipeline Tests'
                )}
              </Button>
              
              {isRunning && currentTest && (
                <div className="text-sm text-gray-400">
                  Currently testing: <span className="text-white">{currentTest}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {testResults.map((result, index) => (
              <Card key={index} className={`bg-black/40 backdrop-blur-sm border-white/10 ${getStatusColor(result.status)}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      {getStatusIcon(result.status)}
                      {result.name}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {result.details.toolId}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {result.duration}ms
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.error ? (
                    <div className="text-red-400 text-sm">
                      Error: {result.error}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Stage:</span>
                          <span className="text-white ml-2">{result.details.stage}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Context Size:</span>
                          <span className="text-white ml-2">{result.details.contextSize} chars</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Best Practices:</span>
                          <span className="text-white ml-2">{result.details.bestPracticesCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Code Examples:</span>
                          <span className="text-white ml-2">{result.details.codeExamplesCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Optimization Tips:</span>
                          <span className="text-white ml-2">{result.details.optimizationTipsCount}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Constraints:</span>
                          <span className="text-white ml-2">{result.details.constraintsCount}</span>
                        </div>
                      </div>
                      
                      {result.context && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-white">RAG Context Preview:</h4>
                          <Textarea
                            value={JSON.stringify(result.context, null, 2)}
                            readOnly
                            className="min-h-[150px] text-xs bg-black/40 backdrop-blur-sm border-white/10 text-gray-300 font-mono"
                          />
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        {testResults.length > 0 && !isRunning && (
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Test Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {testResults.filter(r => r.status === 'success').length}
                  </div>
                  <div className="text-sm text-gray-400">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {testResults.filter(r => r.status === 'warning').length}
                  </div>
                  <div className="text-sm text-gray-400">Warnings</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-400">
                    {testResults.filter(r => r.status === 'error').length}
                  </div>
                  <div className="text-sm text-gray-400">Failed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length)}ms
                  </div>
                  <div className="text-sm text-gray-400">Avg Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
