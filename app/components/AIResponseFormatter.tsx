"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Copy,
  Download,
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Palette,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { TextFormatter, ParsedSection } from '@/utils/textFormatting';

interface AIResponseFormatterProps {
  response: string;
  title?: string;
  toolType?: 'framer' | 'flutterflow' | 'uizard' | 'cursor' | 'lovable' | 'general';
  className?: string;
  showToolSpecific?: boolean;
}

const AIResponseFormatter: React.FC<AIResponseFormatterProps> = ({
  response,
  title = "AI Response",
  toolType = 'general',
  className,
  showToolSpecific = true
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState('formatted');
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string = "Response") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const downloadAsFile = (content: string, filename: string) => {
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
      title: "Downloaded!",
      description: `${filename} has been downloaded.`,
    });
  };

  // Parse response into sections using enhanced formatter
  const parseResponse = (text: string): ParsedSection[] => {
    return TextFormatter.parseResponse(text, {
      normalizeLineBreaks: true,
      trimSections: true,
      enhanceMarkdown: true,
      detectCodeBlocks: true,
      parseNumberedSections: true
    });
  };

  const formatForTool = (text: string, tool: string) => {
    const toolInstructions = {
      framer: `// Framer-specific prompt
// Use this prompt in Framer's AI assistant or remix feature

${text}

// Additional Framer tips:
// - Use Framer's component library
// - Leverage auto-layout and responsive design
// - Consider Framer Motion for animations`,

      flutterflow: `/* FlutterFlow-specific prompt
   Use this in FlutterFlow's AI Page Generator */

${text}

/* FlutterFlow tips:
   - Use FlutterFlow's widget library
   - Set up proper navigation between pages
   - Configure Firebase backend if needed */`,

      uizard: `<!-- Uizard-specific prompt
     Use this in Uizard's AI design assistant -->

${text}

<!-- Uizard tips:
     - Focus on wireframe and layout structure
     - Use Uizard's component library
     - Export to code when ready -->`,

      cursor: `// Cursor IDE prompt
// Use this with Cursor's AI coding assistant

${text}

// Cursor tips:
// - Use Ctrl+K for inline AI editing
// - Use Ctrl+L for AI chat
// - Reference existing code patterns`,

      lovable: `// Lovable.dev prompt
// Use this in Lovable's AI app builder

${text}

// Lovable tips:
// - Focus on React components
// - Use Tailwind CSS for styling
// - Leverage Lovable's component library`
    };

    return toolInstructions[tool as keyof typeof toolInstructions] || text;
  };

  const sections = parseResponse(response);
  const toolSpecificPrompt = formatForTool(response, toolType);

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'framer': return <Palette className="h-4 w-4" />;
      case 'flutterflow': return <Code className="h-4 w-4" />;
      case 'uizard': return <FileText className="h-4 w-4" />;
      case 'cursor': return <Code className="h-4 w-4" />;
      case 'lovable': return <Sparkles className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getToolColor = (tool: string) => {
    switch (tool) {
      case 'framer': return 'bg-purple-600/20 text-purple-400';
      case 'flutterflow': return 'bg-blue-600/20 text-blue-400';
      case 'uizard': return 'bg-orange-600/20 text-orange-400';
      case 'cursor': return 'bg-green-600/20 text-green-400';
      case 'lovable': return 'bg-pink-600/20 text-pink-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <Card className={`bg-black/40 backdrop-blur-sm border-white/10 ${className}`}>
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <CardTitle className="text-white">{title}</CardTitle>
                {toolType !== 'general' && (
                  <Badge className={getToolColor(toolType)}>
                    {getToolIcon(toolType)}
                    <span className="ml-1 capitalize">{toolType}</span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(response);
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadAsFile(response, `${title.replace(/\s+/g, '-').toLowerCase()}.txt`);
                  }}
                  className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 bg-black/60 border border-white/20">
                <TabsTrigger value="formatted" className="data-[state=active]:bg-green-600">
                  Formatted
                </TabsTrigger>
                <TabsTrigger value="raw" className="data-[state=active]:bg-green-600">
                  Raw Text
                </TabsTrigger>
                {showToolSpecific && toolType !== 'general' && (
                  <TabsTrigger value="tool-specific" className="data-[state=active]:bg-green-600">
                    {toolType} Ready
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Formatted View */}
              <TabsContent value="formatted" className="mt-4">
                <div className="space-y-4">
                  {sections.map((section, index) => (
                    <div key={section.id || index} className="space-y-2">
                      {/* Header rendering */}
                      {section.type === 'header' && (
                        <div className="space-y-2">
                          {section.level === 1 ? (
                            <h1 className="text-2xl font-bold text-white border-b-2 border-green-500 pb-2">
                              {section.title || section.content}
                            </h1>
                          ) : section.level === 2 ? (
                            <h2 className="text-xl font-semibold text-white border-b border-gray-600 pb-1">
                              {section.title || section.content}
                            </h2>
                          ) : (
                            <h3 className="text-lg font-medium text-white">
                              {section.title || section.content}
                            </h3>
                          )}
                          {section.metadata?.numbered && (
                            <Badge variant="outline" className="text-xs">
                              Section {section.metadata.number}
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Code block rendering */}
                      {section.type === 'code' && (
                        <SyntaxHighlighter
                          language={section.metadata?.language || 'text'}
                          style={oneDark}
                          className="rounded-lg"
                          customStyle={{
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        >
                          {section.content.trim()}
                        </SyntaxHighlighter>
                      )}

                      {/* List rendering */}
                      {(section.type === 'list' || section.type === 'numbered-list') && (
                        <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                          <div className="prose prose-invert prose-sm max-w-none">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {section.content.trim()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quote rendering */}
                      {section.type === 'quote' && (
                        <div className="border-l-4 border-blue-500 bg-blue-900/20 pl-4 py-2 rounded-r">
                          <div className="text-gray-300 italic">
                            {section.content.replace(/^>\s*/, '').trim()}
                          </div>
                        </div>
                      )}

                      {/* Table rendering */}
                      {section.type === 'table' && (
                        <div className="overflow-x-auto bg-gray-900/50 border border-gray-700 rounded-lg">
                          <div className="prose prose-invert prose-sm max-w-none p-4">
                            <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                              {section.content.trim()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Text rendering */}
                      {section.type === 'text' && section.content.trim() && (
                        <div className="prose prose-invert max-w-none">
                          <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {section.content.trim()}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Raw Text View */}
              <TabsContent value="raw" className="mt-4">
                <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-gray-300 text-sm leading-relaxed">
                    {response}
                  </pre>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(response, "Raw text")}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Raw
                  </Button>
                </div>
              </TabsContent>

              {/* Tool-Specific View */}
              {showToolSpecific && toolType !== 'general' && (
                <TabsContent value="tool-specific" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      {getToolIcon(toolType)}
                      <span>Optimized for {toolType}</span>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-400 hover:text-blue-300 p-0"
                        onClick={() => window.open(`https://${toolType}.com`, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open {toolType}
                      </Button>
                    </div>
                    
                    <SyntaxHighlighter
                      language="javascript"
                      style={oneDark}
                      className="rounded-lg"
                      customStyle={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {toolSpecificPrompt}
                    </SyntaxHighlighter>
                    
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(toolSpecificPrompt, `${toolType} prompt`)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy for {toolType}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AIResponseFormatter;
