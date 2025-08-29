import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, ExternalLink, Layers, Rocket, Eye, Navigation, Target, Zap } from 'lucide-react';
import type { FullPromptExport } from '../../types/ideaforge';
interface PromptResultsDisplayProps {
  results: FullPromptExport;
}

export default function PromptResultsDisplay({ results }: PromptResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState('master');
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to Clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const downloadPrompt = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `${filename} is being downloaded.`,
    });
  };

  const formatTokenCount = (tokens: number) => {
    if (tokens < 1000) return `${tokens} tokens`;
    return `${(tokens / 1000).toFixed(1)}k tokens`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-green-600" />
                Prompts Generated Successfully!
              </CardTitle>
              <CardDescription>
                Your AI-ready prompts for {results.builderInfo.name} are ready to use.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {results.targetBuilder}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{results.screenPrompts.length}</div>
              <div className="text-sm text-gray-600">Screens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatTokenCount(results.metadata.totalTokens)}
              </div>
              <div className="text-sm text-gray-600">Total Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{results.metadata.estimatedBuildTime}</div>
              <div className="text-sm text-gray-600">Est. Build Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{results.metadata.complexity}</div>
              <div className="text-sm text-gray-600">Complexity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="master" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Master Prompt
          </TabsTrigger>
          <TabsTrigger value="screens" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Screen Prompts
          </TabsTrigger>
          <TabsTrigger value="segmented" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Segmented
          </TabsTrigger>
          <TabsTrigger value="blueprint" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Blueprint
          </TabsTrigger>
        </TabsList>

        {/* Master Prompt Tab */}
        <TabsContent value="master" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Complete Application Prompt</CardTitle>
                  <CardDescription>
                    A comprehensive prompt that includes all screens, navigation, and features.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(results.masterPrompt.content, 'Master Prompt')}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPrompt(results.masterPrompt.content, `${results.appBlueprint.appName}-master-prompt.txt`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {formatTokenCount(results.masterPrompt.estimatedTokens)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {results.targetBuilder} optimized
                  </span>
                </div>
                <ScrollArea className="h-96 w-full border rounded-md p-4">
                  <pre className="text-sm whitespace-pre-wrap">{results.masterPrompt.content}</pre>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Screen Prompts Tab */}
        <TabsContent value="screens" className="space-y-4">
          <div className="grid gap-4">
            {results.screenPrompts.map((screen, index) => (
              <Card key={screen.screenId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{screen.screenName}</CardTitle>
                      <CardDescription>
                        Components: {screen.components.join(', ')}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {formatTokenCount(screen.estimatedTokens)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(screen.prompt, `${screen.screenName} Prompt`)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 w-full border rounded-md p-3">
                    <pre className="text-sm whitespace-pre-wrap">{screen.prompt}</pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Segmented Prompts Tab */}
        <TabsContent value="segmented" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Setup & Configuration</CardTitle>
                <CardDescription>Initial project setup and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">{results.segmentedPrompts.setup}</pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(results.segmentedPrompts.setup, 'Setup Prompt')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Setup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation & Flow</CardTitle>
                <CardDescription>App navigation and user flow logic</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">{results.segmentedPrompts.navigation}</pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(results.segmentedPrompts.navigation, 'Navigation Prompt')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Navigation
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Styling & Theme</CardTitle>
                <CardDescription>Visual design and styling instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">{results.segmentedPrompts.styling}</pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(results.segmentedPrompts.styling, 'Styling Prompt')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Styling
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deployment</CardTitle>
                <CardDescription>Deployment and hosting instructions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32 w-full border rounded-md p-3">
                  <pre className="text-sm whitespace-pre-wrap">{results.segmentedPrompts.deployment}</pre>
                </ScrollArea>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(results.segmentedPrompts.deployment, 'Deployment Prompt')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Deployment
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Blueprint Tab */}
        <TabsContent value="blueprint" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Blueprint</CardTitle>
              <CardDescription>
                Structured overview of your application architecture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">App Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span> {results.appBlueprint.appName}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {results.appBlueprint.appType}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Description:</span> {results.appBlueprint.description}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Screens ({results.appBlueprint.screens.length})</h3>
                  <div className="grid gap-2">
                    {results.appBlueprint.screens.map((screen, index) => (
                      <div key={screen.id} className="p-3 border rounded-lg">
                        <div className="font-medium">{screen.name}</div>
                        <div className="text-sm text-gray-600">{screen.purpose}</div>
                        <div className="flex gap-1 mt-2">
                          {screen.components.map((component, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {component}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.appBlueprint.authRequired ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Authentication
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${results.appBlueprint.dataModels.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      Database
                    </div>
                  </div>
                </div>

                {results.appBlueprint.dataModels.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Data Models</h3>
                      <div className="space-y-2">
                        {results.appBlueprint.dataModels.map((model, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                            {JSON.stringify(model, null, 2)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => copyToClipboard(results.masterPrompt.content, 'Master Prompt')}
              className="flex-1 min-w-[200px]"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Master Prompt
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadPrompt(
                JSON.stringify(results, null, 2),
                `${results.appBlueprint.appName}-complete-export.json`
              )}
              className="flex-1 min-w-[200px]"
            >
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
            {results.builderInfo.integrationUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(results.builderInfo.integrationUrl, '_blank')}
                className="flex-1 min-w-[200px]"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open {results.builderInfo.name}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
