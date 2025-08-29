'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { RAGTool, MVPWizardData } from '@/types/ideaforge';
import { generateRAGEnhancedPrompt } from '@/services/ragEnhancedGenerator';
import { getAllRAGToolProfiles } from '@/services/ragToolProfiles';

/**
 * RAG Integration Test Page
 * Tests the complete RAG flow with different tools
 */

export default function TestRAGPage() {
  const [selectedTool, setSelectedTool] = useState<RAGTool>('lovable');
  const [promptType, setPromptType] = useState<'framework' | 'page' | 'linking'>('framework');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const availableTools = getAllRAGToolProfiles();

  // Sample wizard data for testing
  const sampleWizardData: MVPWizardData = {
    step1: {
      appName: 'TaskMaster Pro',
      appType: 'web-app'
    },
    step2: {
      theme: 'dark',
      designStyle: 'minimal',
      selectedTool: selectedTool
    },
    step3: {
      platforms: ['web']
    },
    step4: {
      selectedAI: 'gemini'
    },
    userPrompt: 'A comprehensive task management application with real-time collaboration, project tracking, team productivity analytics, and automated workflow management.'
  };

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const additionalContext = {
        userPrompt: sampleWizardData.userPrompt,
        ...(promptType === 'page' && {
          pageName: 'Dashboard',
          pageData: {
            description: 'Main dashboard with task overview and analytics',
            components: ['TaskList', 'Analytics', 'QuickActions', 'TeamOverview'],
            layout: 'grid'
          }
        }),
        ...(promptType === 'linking' && {
          pageNames: ['Dashboard', 'Projects', 'Tasks', 'Analytics', 'Team', 'Settings']
        })
      };

      const ragResult = await generateRAGEnhancedPrompt({
        type: promptType,
        wizardData: sampleWizardData,
        selectedTool: selectedTool,
        additionalContext
      });

      setResult(ragResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">RAG Integration Test</h1>
        <p className="text-muted-foreground">
          Test the RAG-enhanced prompt generation with different tools and documentation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Tool</label>
              <Select value={selectedTool} onValueChange={(value: RAGTool) => setSelectedTool(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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

            <div>
              <label className="text-sm font-medium mb-2 block">Prompt Type</label>
              <Select value={promptType} onValueChange={(value: any) => setPromptType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="framework">Framework Generation</SelectItem>
                  <SelectItem value="page">Page UI Design</SelectItem>
                  <SelectItem value="linking">Navigation & Linking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Sample Project Description</label>
              <Textarea
                value={sampleWizardData.userPrompt}
                readOnly
                className="min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleGeneratePrompt} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating RAG-Enhanced Prompt...
                </>
              ) : (
                'Generate RAG-Enhanced Prompt'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Results
              {result && (
                <Badge variant="outline" className="text-xs">
                  Confidence: {(result.confidence * 100).toFixed(0)}%
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                <XCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-800">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Success</p>
                    <p className="text-sm text-green-600">
                      RAG-enhanced prompt generated successfully
                    </p>
                  </div>
                </div>

                {result.toolContext && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Tool Context</h4>
                    
                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">Optimization Tips</h5>
                      <ul className="text-sm space-y-1">
                        {result.toolSpecificOptimizations.slice(0, 3).map((tip: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-muted-foreground mb-1">Sources Used</h5>
                      <p className="text-sm">{result.sources.length} documentation files</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Generated Prompt</h4>
                  <Textarea
                    value={result.prompt}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(result.prompt)}
                  >
                    Copy Prompt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResult(null)}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {!result && !error && !isGenerating && (
              <div className="text-center py-8 text-muted-foreground">
                <p>Configure your test settings and click "Generate" to test RAG integration</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tool Information */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Selected Tool Information</CardTitle>
        </CardHeader>
        <CardContent>
          {(() => {
            const toolProfile = availableTools.find(t => t.id === selectedTool);
            if (!toolProfile) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Tool Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {toolProfile.name}</p>
                    <p><strong>Category:</strong> {toolProfile.category}</p>
                    <p><strong>Complexity:</strong> {toolProfile.complexity}</p>
                    <p><strong>Pricing:</strong> {toolProfile.pricing}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Best For</h4>
                  <ul className="text-sm space-y-1">
                    {toolProfile.bestFor.slice(0, 5).map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
