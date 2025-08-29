"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, ExternalLink, Layers, Rocket, Eye, Navigation, Target, Zap } from 'lucide-react';

interface PromptResultsDisplayProps {
  results: any;
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

  const downloadAllPrompts = () => {
    const allPrompts = Object.entries(results.prompts || {})
      .map(([key, value]) => `=== ${key.toUpperCase()} ===\n\n${value}\n\n`)
      .join('');
    
    const content = `App: ${results.appName}\nDescription: ${results.appDescription}\n\n${allPrompts}`;
    downloadPrompt(content, `${results.appName}_prompts.txt`);
  };

  const promptCategories = [
    {
      id: 'ideaValidation',
      title: 'Idea Validation',
      description: 'Validate your app concept and market fit',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'mvpDevelopment',
      title: 'MVP Development',
      description: 'Build your minimum viable product',
      icon: <Rocket className="h-5 w-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'userResearch',
      title: 'User Research',
      description: 'Understand your target audience',
      icon: <Eye className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'marketAnalysis',
      title: 'Market Analysis',
      description: 'Analyze market opportunities',
      icon: <Navigation className="h-5 w-5" />,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Prompts Generated!</h2>
            <p className="text-gray-400">Your custom prompts for {results.appName}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <Button
            onClick={downloadAllPrompts}
            variant="outline"
            className="bg-black/20 border-white/10 text-white hover:bg-white/10"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 border-white/10">
          <TabsTrigger value="master" className="data-[state=active]:bg-white/10">
            Overview
          </TabsTrigger>
          {promptCategories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="data-[state=active]:bg-white/10"
            >
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="master" className="space-y-6">
          <Card className="bg-black/20 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">App Overview</CardTitle>
              <CardDescription className="text-gray-400">
                Summary of your app concept and generated prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">App Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-400">Name:</span> <span className="text-white">{results.appName}</span></p>
                  <p><span className="text-gray-400">Description:</span> <span className="text-white">{results.appDescription}</span></p>
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <h3 className="font-semibold text-white mb-3">Generated Prompts</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {promptCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-4 rounded-lg bg-black/20 border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
                      onClick={() => setActiveTab(category.id)}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                          {category.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{category.title}</h4>
                          <p className="text-xs text-gray-400">{category.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-white/10 text-white">
                          Ready
                        </Badge>
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {results.recommendations && (
                <>
                  <Separator className="bg-white/10" />
                  <div>
                    <h3 className="font-semibold text-white mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {results.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Individual Prompt Tabs */}
        {promptCategories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                    {category.icon}
                  </div>
                  {category.title}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(results.prompts?.[category.id] || '', category.title)}
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-white/10 text-white hover:bg-white/10"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button
                    onClick={() => downloadPrompt(results.prompts?.[category.id] || '', `${category.id}_prompt.txt`)}
                    variant="outline"
                    size="sm"
                    className="bg-black/20 border-white/10 text-white hover:bg-white/10"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>

                <ScrollArea className="h-96 w-full rounded-md border border-white/10 bg-black/10 p-4">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {results.prompts?.[category.id] || 'No prompt available for this category.'}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
