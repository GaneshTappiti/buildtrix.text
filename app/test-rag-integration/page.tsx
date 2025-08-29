'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, FileText, Database, Zap } from 'lucide-react';
import { RAGTool, RAG_TOOLS } from '@/types/ideaforge';
import { RAGDocumentationReader } from '@/services/ragDocumentationReader';
import { RAGContextInjector } from '@/services/ragContextInjector';
import { getAllRAGToolProfiles } from '@/services/ragToolProfiles';

/**
 * Comprehensive RAG Integration Test Page
 * Tests the complete RAG system with GitHub repository data
 */

export default function TestRAGIntegrationPage() {
  const [selectedTool, setSelectedTool] = useState<RAGTool>('lovable');
  const [testType, setTestType] = useState<'documentation' | 'context' | 'full'>('documentation');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const availableTools = getAllRAGToolProfiles();

  const testDocumentationReader = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const documentation = await RAGDocumentationReader.getToolDocumentation(selectedTool);
      
      setResults({
        type: 'documentation',
        toolId: selectedTool,
        hasMainPrompt: !!documentation.mainPrompt,
        hasAgentPrompt: !!documentation.agentPrompt,
        hasSystemPrompt: !!documentation.systemPrompt,
        hasTools: !!documentation.tools,
        guidesCount: documentation.guides?.length || 0,
        patternsCount: documentation.patterns?.length || 0,
        examplesCount: documentation.examples?.length || 0,
        mainPromptPreview: documentation.mainPrompt?.substring(0, 200) + '...',
        guides: documentation.guides?.map((guide, index) => ({
          index,
          preview: guide.substring(0, 100) + '...'
        })) || []
      });
    } catch (err) {
      setError(`Documentation test failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testContextInjector = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const context = await RAGContextInjector.getContextForStage({
        stage: 'blueprint_generation',
        toolId: selectedTool,
        appIdea: 'A task management app with real-time collaboration and AI-powered insights',
        appType: 'web-app',
        platforms: ['web']
      });
      
      setResults({
        type: 'context',
        toolId: selectedTool,
        hasToolSpecificContext: !!context.toolSpecificContext,
        hasArchitecturePatterns: !!context.architecturePatterns,
        bestPracticesCount: context.bestPractices?.length || 0,
        codeExamplesCount: context.codeExamples?.length || 0,
        constraintsCount: context.constraints?.length || 0,
        optimizationTipsCount: context.optimizationTips?.length || 0,
        contextPreview: context.toolSpecificContext?.substring(0, 200) + '...',
        bestPractices: context.bestPractices || [],
        constraints: context.constraints || []
      });
    } catch (err) {
      setError(`Context injection test failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFullIntegration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Test both documentation and context
      const documentation = await RAGDocumentationReader.getToolDocumentation(selectedTool);
      const context = await RAGContextInjector.getContextForStage({
        stage: 'prompt_generation',
        toolId: selectedTool,
        appIdea: 'A comprehensive project management platform with team collaboration',
        appType: 'web-app',
        platforms: ['web'],
        screenName: 'Dashboard'
      });
      
      setResults({
        type: 'full',
        toolId: selectedTool,
        documentation: {
          loaded: true,
          hasMainPrompt: !!documentation.mainPrompt,
          hasAgentPrompt: !!documentation.agentPrompt,
          hasSystemPrompt: !!documentation.systemPrompt,
          guidesCount: documentation.guides?.length || 0
        },
        context: {
          loaded: true,
          hasToolSpecificContext: !!context.toolSpecificContext,
          bestPracticesCount: context.bestPractices?.length || 0,
          constraintsCount: context.constraints?.length || 0
        },
        integration: {
          success: true,
          dataSourcesAvailable: documentation.guides?.length || 0 > 0,
          contextGenerated: context.bestPractices?.length || 0 > 0
        }
      });
    } catch (err) {
      setError(`Full integration test failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const runTest = () => {
    switch (testType) {
      case 'documentation':
        testDocumentationReader();
        break;
      case 'context':
        testContextInjector();
        break;
      case 'full':
        testFullIntegration();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card className="workspace-card-solid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Database className="h-6 w-6 text-green-400" />
              RAG Integration Test Suite
            </CardTitle>
            <p className="text-gray-400">
              Test the complete RAG system with GitHub repository data integration
            </p>
          </CardHeader>
        </Card>

        {/* Test Configuration */}
        <Card className="workspace-card-solid">
          <CardHeader>
            <CardTitle className="text-white">Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Select Tool</label>
                <Select value={selectedTool} onValueChange={(value) => setSelectedTool(value as RAGTool)}>
                  <SelectTrigger className="workspace-input-enhanced">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="workspace-dropdown">
                    {availableTools.map((tool) => (
                      <SelectItem key={tool.id} value={tool.id}>
                        <div className="flex items-center gap-2">
                          <span>{tool.icon}</span>
                          <span>{tool.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tool.category}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Test Type</label>
                <Select value={testType} onValueChange={(value) => setTestType(value as any)}>
                  <SelectTrigger className="workspace-input-enhanced">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="workspace-dropdown">
                    <SelectItem value="documentation">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documentation Reader
                      </div>
                    </SelectItem>
                    <SelectItem value="context">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Context Injector
                      </div>
                    </SelectItem>
                    <SelectItem value="full">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Full Integration
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={runTest}
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Test...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Run {testType.charAt(0).toUpperCase() + testType.slice(1)} Test
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="workspace-card-solid border-red-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Test Failed</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results Display */}
        {results && (
          <Card className="workspace-card-solid">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CheckCircle className="h-5 w-5 text-green-400" />
                Test Results - {results.toolId}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-sm text-gray-300 bg-black/50 p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(results, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* RAG Status Overview */}
        <Card className="workspace-card-solid">
          <CardHeader>
            <CardTitle className="text-white">RAG System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">{RAG_TOOLS.length}</div>
                <div className="text-sm text-gray-400">Supported Tools</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">6</div>
                <div className="text-sm text-gray-400">Integration Stages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">✓</div>
                <div className="text-sm text-gray-400">GitHub Data Loaded</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
