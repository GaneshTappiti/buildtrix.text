"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Clock, Star, Zap, Globe, Brain, Code, Layers } from 'lucide-react';

interface MVPResults {
  id?: string;
  title?: string;
  description?: string;
  status?: string;
  createdAt?: string;
  prompts?: {
    framework?: string;
    screens?: Array<{
      name: string;
      prompt: string;
    }>;
    features?: string[];
  };
  blueprint?: {
    screens?: any[];
    features?: string[];
    techStack?: string[];
    architecture?: string;
  };
  metadata?: {
    generatedAt?: string;
    version?: string;
    confidence?: number;
  };
}

interface MVPResultsDisplayProps {
  results?: MVPResults;
}

const MVPResultsDisplay: React.FC<MVPResultsDisplayProps> = ({ results }) => {
  const { toast } = useToast();

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  if (!results) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No results to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">MVP Results</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(JSON.stringify(results, null, 2))}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/10">
          <TabsTrigger value="overview" className="text-white data-[state=active]:bg-green-600">
            Overview
          </TabsTrigger>
          <TabsTrigger value="prompts" className="text-white data-[state=active]:bg-green-600">
            Prompts
          </TabsTrigger>
          <TabsTrigger value="details" className="text-white data-[state=active]:bg-green-600">
            Details
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Info */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Brain className="h-4 w-4 text-blue-400" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">
                  {results.description || results.title || "No description available"}
                </p>
                {results.createdAt && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    {new Date(results.createdAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-400" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="border-green-500/30 bg-green-500/10 text-green-400">
                  {results.status || "Generated"}
                </Badge>
                {results.metadata?.confidence && (
                  <div className="mt-2 text-xs text-gray-400">
                    Confidence: {Math.round(results.metadata.confidence * 100)}%
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-black/20 border-white/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span>Screens:</span>
                    <span>{results.blueprint?.screens?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Features:</span>
                    <span>{results.blueprint?.features?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Tech Stack:</span>
                    <span>{results.blueprint?.techStack?.length || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Architecture Overview */}
          {results.blueprint?.architecture && (
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-400" />
                  Architecture Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm">{results.blueprint.architecture}</p>
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          {results.blueprint?.features && results.blueprint.features.length > 0 && (
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-base">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {results.blueprint.features.map((feature, index) => (
                    <Badge key={index} className="bg-white/10 text-gray-300 border-white/20">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          {results.prompts ? (
            <div className="space-y-4">
              {/* Framework Prompt */}
              {results.prompts.framework && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-400" />
                      Framework Prompt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                        {results.prompts.framework}
                      </pre>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(results.prompts?.framework || '')}
                      className="mt-2 border-white/20 text-white hover:bg-white/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Framework Prompt
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Screen Prompts */}
              {results.prompts.screens && results.prompts.screens.length > 0 && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      Screen Prompts ({results.prompts.screens.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {results.prompts.screens.map((screen, index) => (
                      <div key={index} className="border border-white/10 rounded-lg p-4 bg-black/20">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-white">{screen.name}</h5>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(screen.prompt)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-black/40 p-3 rounded border border-white/10">
                          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                            {screen.prompt}
                          </pre>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Features List */}
              {results.prompts.features && results.prompts.features.length > 0 && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base">Feature Prompts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {results.prompts.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-black/20 rounded border border-white/10">
                          <span className="text-gray-300 text-sm">{feature}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopy(feature)}
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No prompts available</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {results.blueprint ? (
            <div className="space-y-4">
              {/* Screens Details */}
              {results.blueprint.screens && results.blueprint.screens.length > 0 && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-400" />
                      Screen Details ({results.blueprint.screens.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {results.blueprint.screens.map((screen: any, index: number) => (
                        <div key={index} className="border border-white/10 rounded-lg p-4 bg-black/20">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium text-white">{screen.name || `Screen ${index + 1}`}</h5>
                            {screen.type && (
                              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                                {screen.type}
                              </Badge>
                            )}
                          </div>
                          {screen.purpose && (
                            <p className="text-sm text-gray-400 mb-2">{screen.purpose}</p>
                          )}
                          {screen.components && screen.components.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs text-gray-400 block mb-1">Components:</span>
                              <div className="flex flex-wrap gap-1">
                                {screen.components.map((component: string, idx: number) => (
                                  <Badge key={idx} className="bg-white/10 text-gray-300 border-white/20 text-xs">
                                    {component}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {screen.navigation && screen.navigation.length > 0 && (
                            <div>
                              <span className="text-xs text-gray-400 block mb-1">Navigation:</span>
                              <div className="flex flex-wrap gap-1">
                                {screen.navigation.map((nav: string, idx: number) => (
                                  <Badge key={idx} className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                    {nav}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Tech Stack Details */}
              {results.blueprint.techStack && results.blueprint.techStack.length > 0 && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Code className="h-4 w-4 text-purple-400" />
                      Technology Stack
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {results.blueprint.techStack.map((tech, index) => (
                        <div key={index} className="p-3 bg-black/20 rounded border border-white/10">
                          <span className="text-gray-300 text-sm">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata */}
              {results.metadata && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-base flex items-center gap-2">
                      <Brain className="h-4 w-4 text-cyan-400" />
                      Generation Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {results.metadata.generatedAt && (
                        <div>
                          <span className="text-gray-400 block">Generated At:</span>
                          <span className="text-gray-300">{new Date(results.metadata.generatedAt).toLocaleString()}</span>
                        </div>
                      )}
                      {results.metadata.version && (
                        <div>
                          <span className="text-gray-400 block">Version:</span>
                          <span className="text-gray-300">{results.metadata.version}</span>
                        </div>
                      )}
                      {results.metadata.confidence && (
                        <div>
                          <span className="text-gray-400 block">Confidence:</span>
                          <span className="text-gray-300">{Math.round(results.metadata.confidence * 100)}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Raw Data Export */}
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-base">Raw Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/40 p-4 rounded-lg border border-white/10 max-h-64 overflow-y-auto">
                    <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                      {JSON.stringify(results, null, 2)}
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(JSON.stringify(results, null, 2))}
                    className="mt-2 border-white/20 text-white hover:bg-white/10"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Raw Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No detailed data available</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MVPResultsDisplay;
