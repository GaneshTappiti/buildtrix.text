"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Download,
  Copy,
  Check,
  Package,
  FileText,
  Layers,
  ExternalLink,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  Archive,
  FileJson,
  FileCode,
  Globe,
  Smartphone
} from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { CelebrationAnimation } from "../CelebrationAnimation";

const builderTools = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor with intelligent completions',
    icon: '💻',
    category: 'AI Development',
    promptStyle: 'unified',
    platforms: ['web', 'mobile'],
    complexity: 'advanced',
    recommended: true
  },
  {
    id: 'uizard',
    name: 'Uizard',
    description: 'AI design tool with text-to-design generation',
    icon: '🤖',
    category: 'AI Design',
    promptStyle: 'screen-by-screen',
    platforms: ['web', 'mobile'],
    complexity: 'beginner',
    recommended: true
  },
  {
    id: 'adalo-ai',
    name: 'Adalo AI',
    description: 'No-code app builder with AI assistant',
    icon: '📱',
    category: 'No-Code',
    promptStyle: 'screen-by-screen',
    platforms: ['mobile', 'web'],
    complexity: 'beginner',
    recommended: false
  },
  {
    id: 'lovable-dev',
    name: 'Lovable.dev',
    description: 'AI-powered full-stack app builder',
    icon: '🚀',
    category: 'AI Development',
    promptStyle: 'unified',
    platforms: ['web'],
    complexity: 'intermediate',
    recommended: true
  },
  {
    id: 'softr-ai',
    name: 'Softr AI',
    description: 'Prompt-based app generation with Airtable integration',
    icon: '💭',
    category: 'No-Code',
    promptStyle: 'unified',
    platforms: ['web'],
    complexity: 'beginner',
    recommended: false
  },
  {
    id: 'buzzy-ai',
    name: 'Buzzy.ai',
    description: 'Convert Figma designs to full-stack applications',
    icon: '🎨',
    category: 'AI Design',
    promptStyle: 'unified',
    platforms: ['web', 'mobile'],
    complexity: 'intermediate',
    recommended: false
  },
  {
    id: 'replit-ghostwriter',
    name: 'Replit Ghostwriter',
    description: 'AI coding assistant with full development environment',
    icon: '🌐',
    category: 'AI Development',
    promptStyle: 'unified',
    platforms: ['web', 'mobile'],
    complexity: 'advanced',
    recommended: false
  },
  {
    id: 'flutterflow',
    name: 'FlutterFlow',
    description: 'Visual Flutter app development with custom code support',
    icon: '🦋',
    category: 'No-Code',
    promptStyle: 'screen-by-screen',
    platforms: ['mobile', 'web'],
    complexity: 'intermediate',
    recommended: true
  },
  {
    id: 'framer',
    name: 'Framer',
    description: 'Design and prototype interactive websites with AI',
    icon: '🎨',
    category: 'AI Design',
    promptStyle: 'unified',
    platforms: ['web'],
    complexity: 'intermediate',
    recommended: true
  }
];

export function ExportComposerCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [selectedTool, setSelectedTool] = useState('cursor');
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationShownForExport, setCelebrationShownForExport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [exportFormat, setExportFormat] = useState<'standard' | 'markdown' | 'json' | 'pdf-ready'>('standard');
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Show celebration when component first loads (project is complete)
  React.useEffect(() => {
    if (state.exportPrompts && !showCelebration && !celebrationShownForExport) {
      const timer = setTimeout(() => {
        setShowCelebration(true);
        setCelebrationShownForExport(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.exportPrompts, showCelebration, celebrationShownForExport]);

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set(Array.from(prev).concat(itemId)));
      toast({
        title: "Copied to Clipboard",
        description: "Content has been copied to your clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(Array.from(prev));
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive"
      });
    }
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
      title: "Download Started",
      description: `${filename} has been downloaded.`,
    });
  };

  const generateUnifiedPrompt = () => {
    if (!state.exportPrompts) return '';

    const tool = builderTools.find(t => t.id === selectedTool);
    const toolSpecific = tool ? `\n\n## ${tool.name} Specific Instructions\n${getToolSpecificInstructions(tool.id)}` : '';

    const basePrompt = state.exportPrompts.unifiedPrompt + toolSpecific;

    // Apply format-specific transformations
    switch (exportFormat) {
      case 'markdown':
        return generateMarkdownFormat(basePrompt);
      case 'json':
        return generateJSONFormat();
      case 'pdf-ready':
        return generatePDFReadyFormat(basePrompt);
      default:
        return basePrompt;
    }
  };

  const generateMarkdownFormat = (content: string) => {
    return `# ${state.appIdea.appName} - Export Package

## 📋 Project Overview
- **App Name**: ${state.appIdea.appName}
- **Platforms**: ${state.appIdea.platforms.join(', ')}
- **Design Style**: ${state.appIdea.designStyle}
- **Target Tool**: ${builderTools.find(t => t.id === selectedTool)?.name}
- **Export Date**: ${new Date().toLocaleDateString()}

## 🎯 Generated Content

${content}

## 📊 Project Statistics
- **Total Screens**: ${state.screenPrompts.length}
- **User Roles**: ${state.appBlueprint?.userRoles.length || 0}
- **Data Models**: ${state.appBlueprint?.dataModels.length || 0}
- **Prompt Length**: ${content.length} characters

---
*Generated by Builder Blueprint AI*`;
  };

  const generateJSONFormat = () => {
    return JSON.stringify({
      project: {
        name: state.appIdea.appName,
        platforms: state.appIdea.platforms,
        designStyle: state.appIdea.designStyle,
        targetTool: selectedTool,
        exportDate: new Date().toISOString()
      },
      blueprint: state.appBlueprint,
      screenPrompts: state.screenPrompts,
      appFlow: state.appFlow,
      unifiedPrompt: state.exportPrompts?.unifiedPrompt,
      toolSpecificInstructions: getToolSpecificInstructions(selectedTool),
      statistics: {
        totalScreens: state.screenPrompts.length,
        userRoles: state.appBlueprint?.userRoles.length || 0,
        dataModels: state.appBlueprint?.dataModels.length || 0,
        promptLength: (state.exportPrompts?.unifiedPrompt || '').length
      }
    }, null, 2);
  };

  const generatePDFReadyFormat = (content: string) => {
    return `${state.appIdea.appName} - Complete App Specification
${'='.repeat(60)}

PROJECT OVERVIEW
${'-'.repeat(20)}
App Name: ${state.appIdea.appName}
Platforms: ${state.appIdea.platforms.join(', ')}
Design Style: ${state.appIdea.designStyle}
Target Tool: ${builderTools.find(t => t.id === selectedTool)?.name}
Export Date: ${new Date().toLocaleDateString()}

CONTENT
${'-'.repeat(20)}
${content}

PROJECT STATISTICS
${'-'.repeat(20)}
Total Screens: ${state.screenPrompts.length}
User Roles: ${state.appBlueprint?.userRoles.length || 0}
Data Models: ${state.appBlueprint?.dataModels.length || 0}
Prompt Length: ${content.length} characters

${'='.repeat(60)}
Generated by Builder Blueprint AI`;
  };

  const getProjectAnalytics = () => {
    const totalPromptLength = state.screenPrompts.reduce((acc, prompt) => acc + (prompt.layout?.length || 0) + (prompt.components?.length || 0), 0);
    const avgPromptLength = totalPromptLength / state.screenPrompts.length;

    return {
      totalScreens: state.screenPrompts.length,
      totalPromptLength,
      avgPromptLength: Math.round(avgPromptLength),
      userRoles: state.appBlueprint?.userRoles.length || 0,
      dataModels: state.appBlueprint?.dataModels.length || 0,
      platforms: state.appIdea.platforms,
      designStyle: state.appIdea.designStyle,
      complexity: getProjectComplexity(),
      recommendedTools: getRecommendedTools(),
      estimatedDevTime: getEstimatedDevTime()
    };
  };

  const getProjectComplexity = () => {
    const screenCount = state.screenPrompts.length;
    const userRoles = state.appBlueprint?.userRoles.length || 0;
    const dataModels = state.appBlueprint?.dataModels.length || 0;

    const complexityScore = screenCount + (userRoles * 2) + (dataModels * 1.5);

    if (complexityScore <= 10) return 'Simple';
    if (complexityScore <= 20) return 'Moderate';
    if (complexityScore <= 35) return 'Complex';
    return 'Advanced';
  };

  const getRecommendedTools = () => {
    const platforms = state.appIdea.platforms;
    const complexity = getProjectComplexity();

    return builderTools.filter(tool => {
      // Filter by platform compatibility
      const platformMatch = platforms.some(platform => tool.platforms.includes(platform));

      // Filter by complexity appropriateness
      const complexityMatch =
        (complexity === 'Simple' && ['beginner', 'intermediate'].includes(tool.complexity)) ||
        (complexity === 'Moderate' && ['beginner', 'intermediate', 'advanced'].includes(tool.complexity)) ||
        (complexity === 'Complex' && ['intermediate', 'advanced'].includes(tool.complexity)) ||
        (complexity === 'Advanced' && tool.complexity === 'advanced');

      return platformMatch && complexityMatch && tool.recommended;
    }).slice(0, 3);
  };

  const getEstimatedDevTime = () => {
    const screenCount = state.screenPrompts.length;
    const complexity = getProjectComplexity();

    const baseHours = screenCount * 8; // 8 hours per screen base
    const complexityMultiplier = {
      'Simple': 1,
      'Moderate': 1.5,
      'Complex': 2,
      'Advanced': 3
    }[complexity] || 1;

    const totalHours = Math.round(baseHours * complexityMultiplier);
    const days = Math.ceil(totalHours / 8);

    return { hours: totalHours, days };
  };

  const getFilteredTools = () => {
    if (selectedCategory === 'all') return builderTools;
    return builderTools.filter(tool => tool.category === selectedCategory);
  };

  const getToolCategories = () => {
    const categories = Array.from(new Set(builderTools.map(tool => tool.category)));
    return ['all', ...categories];
  };

  const getToolSpecificInstructions = (toolId: string) => {
    switch (toolId) {
      case 'framer':
        return 'Create responsive components with proper breakpoints. Use Framer Motion for animations. Implement proper component hierarchy and reusable elements.';
      case 'uizard':
        return 'Focus on wireframe clarity and user flow. Use standard UI patterns and clear labeling for AI recognition.';
      case 'adalo':
        return 'Design for mobile-first approach. Use Adalo\'s native components and actions. Consider database relationships and user permissions.';
      case 'flutterflow':
        return 'Design with Flutter widgets in mind. Consider state management and navigation patterns. Use Material Design principles.';
      case 'bubble':
        return 'Think in terms of Bubble\'s element structure. Consider workflows and database design. Use responsive design principles.';
      case 'webflow':
        return 'Focus on semantic HTML structure. Use Webflow\'s class system effectively. Consider CMS integration if needed.';
      default:
        return 'Follow platform-specific best practices and design guidelines.';
    }
  };

  const generateScreenByScreenPrompts = () => {
    if (!state.screenPrompts) return [];

    return state.screenPrompts.map(prompt => ({
      ...prompt,
      fullPrompt: `# ${prompt.title} - ${selectedTool.charAt(0).toUpperCase() + selectedTool.slice(1)}

${prompt.layout}

## Components
${prompt.components}

## Behavior
${prompt.behavior}

## Conditional Logic
${prompt.conditionalLogic}

## Style Guidelines
${prompt.styleHints}

## ${builderTools.find(t => t.id === selectedTool)?.name} Specific
${getToolSpecificInstructions(selectedTool)}`
    }));
  };

  const downloadAllPrompts = () => {
    const tool = builderTools.find(t => t.id === selectedTool);
    const appName = state.appIdea.appName.replace(/[^a-zA-Z0-9]/g, '_');

    if (tool?.promptStyle === 'unified') {
      const content = generateUnifiedPrompt();
      downloadAsFile(content, `${appName}_${selectedTool}_unified_prompt.txt`);
    } else {
      const prompts = generateScreenByScreenPrompts();
      const content = prompts.map(p => `${p.fullPrompt}\n\n${'='.repeat(50)}\n\n`).join('');
      downloadAsFile(content, `${appName}_${selectedTool}_screen_prompts.txt`);
    }
  };

  const saveProject = () => {
    dispatch(builderActions.saveProject());
    toast({
      title: "Project Saved",
      description: "Your project has been saved to history.",
    });
  };

  if (!state.exportPrompts) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">No Export Package Generated</h3>
        <p className="text-sm text-muted-foreground">
          Complete the app flow generation to create your export package.
        </p>
      </div>
    );
  }

  const selectedToolData = builderTools.find(t => t.id === selectedTool);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2 text-white">
          <Package className="h-5 w-5 text-blue-400" />
          📦 Enhanced Export Composer
        </h3>
        <p className="text-sm text-gray-400">
          Professional prompt package with analytics and multi-format export
        </p>
      </div>

      {/* Project Analytics */}
      <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border-blue-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <BarChart3 className="h-4 w-4 text-blue-400" />
              Project Analytics & Insights
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="text-blue-300 hover:bg-blue-500/10"
            >
              {showAnalytics ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-300">{getProjectAnalytics().totalScreens}</div>
              <div className="text-xs text-blue-200">Screens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-300">{getProjectAnalytics().userRoles}</div>
              <div className="text-xs text-purple-200">User Roles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-300">{getProjectAnalytics().dataModels}</div>
              <div className="text-xs text-green-200">Data Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-300">{getProjectAnalytics().complexity}</div>
              <div className="text-xs text-orange-200">Complexity</div>
            </div>
          </div>

          {showAnalytics && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <h5 className="font-medium text-white mb-2">📊 Detailed Statistics</h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-gray-300">Total Prompt Length</div>
                    <div className="text-white font-medium">{getProjectAnalytics().totalPromptLength.toLocaleString()} chars</div>
                  </div>
                  <div className="bg-white/10 p-3 rounded">
                    <div className="text-gray-300">Estimated Dev Time</div>
                    <div className="text-white font-medium">{getProjectAnalytics().estimatedDevTime.days} days</div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-white mb-2">🎯 Recommended Tools</h5>
                <div className="flex flex-wrap gap-2">
                  {getRecommendedTools().map(tool => (
                    <Badge
                      key={tool.id}
                      variant="outline"
                      className="border-green-500/30 text-green-300 cursor-pointer hover:bg-green-500/10"
                      onClick={() => setSelectedTool(tool.id)}
                    >
                      {tool.icon} {tool.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Tool Selection */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            Advanced Export Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Tool Category
            </label>
            <div className="flex flex-wrap gap-2">
              {getToolCategories().map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category
                    ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs'
                    : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                  }
                >
                  {category === 'all' ? '🔧 All Tools' :
                   category === 'AI Design' ? '🎨 AI Design' :
                   category === 'AI Development' ? '💻 AI Dev' :
                   category === 'No-Code' ? '📱 No-Code' : category}
                </Button>
              ))}
            </div>
          </div>

          {/* Export Format Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Export Format
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Button
                variant={exportFormat === 'standard' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('standard')}
                className={exportFormat === 'standard'
                  ? 'bg-green-600 hover:bg-green-700 text-white text-xs'
                  : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                }
              >
                📄 Standard
              </Button>
              <Button
                variant={exportFormat === 'markdown' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('markdown')}
                className={exportFormat === 'markdown'
                  ? 'bg-green-600 hover:bg-green-700 text-white text-xs'
                  : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                }
              >
                📝 Markdown
              </Button>
              <Button
                variant={exportFormat === 'json' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('json')}
                className={exportFormat === 'json'
                  ? 'bg-green-600 hover:bg-green-700 text-white text-xs'
                  : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                }
              >
                🔧 JSON
              </Button>
              <Button
                variant={exportFormat === 'pdf-ready' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExportFormat('pdf-ready')}
                className={exportFormat === 'pdf-ready'
                  ? 'bg-green-600 hover:bg-green-700 text-white text-xs'
                  : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                }
              >
                📋 PDF Ready
              </Button>
            </div>
          </div>

          {/* Tool Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Target Tool
            </label>
            <Select value={selectedTool} onValueChange={setSelectedTool}>
              <SelectTrigger className="w-full h-12 bg-white/10 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getFilteredTools().map(tool => (
                <SelectItem key={tool.id} value={tool.id} className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <span className="text-lg flex-shrink-0">{tool.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{tool.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{tool.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          
          {selectedToolData && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg border border-green-500/30">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-2xl flex-shrink-0">{selectedToolData.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white text-lg">{selectedToolData.name}</span>
                    <Badge variant="secondary" className="bg-white/20 text-gray-300 border-white/20 text-xs">
                      {selectedToolData.category}
                    </Badge>
                    {selectedToolData.recommended && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                        ⭐ Recommended
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed mb-3">{selectedToolData.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-gray-400">Prompt Style</div>
                      <div className="text-white font-medium">{selectedToolData.promptStyle}</div>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-gray-400">Platforms</div>
                      <div className="text-white font-medium flex gap-1">
                        {selectedToolData.platforms.map(platform => (
                          <span key={platform}>
                            {platform === 'web' ? '🌐' : '📱'}
                          </span>
                        ))}
                        {selectedToolData.platforms.join(', ')}
                      </div>
                    </div>
                    <div className="bg-white/10 p-2 rounded">
                      <div className="text-gray-400">Complexity</div>
                      <div className="text-white font-medium">
                        {selectedToolData.complexity === 'beginner' && '🟢 Beginner'}
                        {selectedToolData.complexity === 'intermediate' && '🟡 Intermediate'}
                        {selectedToolData.complexity === 'advanced' && '🔴 Advanced'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-gray-400 bg-white/5 p-2 rounded">
                💡 <strong>Export Format:</strong> {exportFormat.charAt(0).toUpperCase() + exportFormat.slice(1)} format optimized for {selectedToolData.name}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Batch Export Options */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Archive className="h-4 w-4 text-purple-400" />
            Batch Export & Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => {
                const content = generateUnifiedPrompt();
                copyToClipboard(content, 'batch-unified');
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-12 flex flex-col items-center justify-center"
            >
              <Copy className="h-4 w-4 mb-1" />
              Copy Unified
            </Button>
            <Button
              onClick={() => {
                const allScreens = generateScreenByScreenPrompts();
                const content = allScreens.map(s => s.fullPrompt).join('\n\n---\n\n');
                copyToClipboard(content, 'batch-screens');
              }}
              className="bg-green-600 hover:bg-green-700 text-white text-xs h-12 flex flex-col items-center justify-center"
            >
              <Layers className="h-4 w-4 mb-1" />
              Copy All Screens
            </Button>
            <Button
              onClick={() => {
                const content = generateJSONFormat();
                copyToClipboard(content, 'batch-json');
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-12 flex flex-col items-center justify-center"
            >
              <FileJson className="h-4 w-4 mb-1" />
              Copy JSON
            </Button>
            <Button
              onClick={downloadAllPrompts}
              className="bg-orange-600 hover:bg-orange-700 text-white text-xs h-12 flex flex-col items-center justify-center"
            >
              <Download className="h-4 w-4 mb-1" />
              Download All
            </Button>
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-white">Complete Export Package</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              Generate a comprehensive export package with all formats for maximum compatibility
            </p>
            <Button
              onClick={() => {
                // Generate all formats
                const standardContent = generateUnifiedPrompt();
                const markdownContent = generateMarkdownFormat(standardContent);
                const jsonContent = generateJSONFormat();
                const pdfContent = generatePDFReadyFormat(standardContent);

                // Create a combined package
                const packageContent = `# ${state.appIdea.appName} - Complete Export Package

## Standard Format
${standardContent}

## Markdown Format
${markdownContent}

## JSON Format
\`\`\`json
${jsonContent}
\`\`\`

## PDF-Ready Format
${pdfContent}`;

                downloadAsFile(packageContent, `${state.appIdea.appName}_complete_package.txt`);

                toast({
                  title: "Complete Package Downloaded!",
                  description: "All export formats included in one file.",
                });
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm w-full"
            >
              <Package className="h-4 w-4 mr-2" />
              Download Complete Package
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Tabs */}
      <Tabs defaultValue={selectedToolData?.promptStyle === 'unified' ? 'unified' : 'screen-by-screen'} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/10 border-white/10">
          <TabsTrigger value="unified" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-400">
            <FileText className="h-4 w-4" />
            Unified Prompt
          </TabsTrigger>
          <TabsTrigger value="screen-by-screen" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-400">
            <Layers className="h-4 w-4" />
            Screen-by-Screen
          </TabsTrigger>
        </TabsList>

        {/* Unified Prompt Tab */}
        <TabsContent value="unified" className="space-y-4">
          <Card className="bg-black/40 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">Complete App Specification</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateUnifiedPrompt(), 'unified')}
                    className="flex items-center gap-2 border-white/20 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    {copiedItems.has('unified') ? (
                      <>
                        <Check className="h-4 w-4 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadAsFile(generateUnifiedPrompt(), `${state.appIdea.appName}_unified_prompt.txt`)}
                    className="flex items-center gap-2 border-white/20 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={generateUnifiedPrompt()}
                readOnly
                className="min-h-[400px] text-sm font-mono bg-white/10 border-white/10 text-gray-300"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Screen-by-Screen Tab */}
        <TabsContent value="screen-by-screen" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-white">Individual Screen Prompts</h4>
            <Button
              onClick={downloadAllPrompts}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Download className="h-4 w-4" />
              Download All Screens
            </Button>
          </div>

          {generateScreenByScreenPrompts().map((prompt, index) => (
            <Card key={prompt.screenId} className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-white">
                    <Badge variant="outline" className="border-white/20 text-gray-300">{index + 1}</Badge>
                    {prompt.title}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(prompt.fullPrompt, prompt.screenId)}
                    className="flex items-center gap-2 border-white/20 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    {copiedItems.has(prompt.screenId) ? (
                      <>
                        <Check className="h-4 w-4 text-green-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={prompt.fullPrompt}
                  readOnly
                  className="min-h-[200px] text-sm font-mono bg-white/10 border-white/10 text-gray-300"
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Success Message */}
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-green-300">🎉 Your Blueprint is Complete!</h4>
              <p className="text-sm text-green-200 mt-1">
                You've successfully created a comprehensive prompt package for "{state.appIdea.appName}". 
                Your prompts are optimized for {selectedToolData?.name} and ready to use.
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-green-200">
                <span>✅ {state.appBlueprint?.screens.length || 0} Screens</span>
                <span>✅ {state.screenPrompts.length} Detailed Prompts</span>
                <span>✅ Complete Flow Logic</span>
                <span>✅ Export Ready</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <ExternalLink className="h-4 w-4 text-blue-400" />
            Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 border-white/20 text-gray-300">1</Badge>
              <span className="text-gray-300">Copy or download your prompts using the buttons above</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 border-white/20 text-gray-300">2</Badge>
              <span className="text-gray-300">Open {selectedToolData?.name} and start a new project</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 border-white/20 text-gray-300">3</Badge>
              <span className="text-gray-300">Paste the prompts and let AI generate your app structure</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5 border-white/20 text-gray-300">4</Badge>
              <span className="text-gray-300">Iterate and refine based on the generated output</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Project */}
      <div className="flex justify-center pt-4">
        <Button onClick={saveProject} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white" size="lg">
          <Package className="h-4 w-4" />
          Save Project to History
        </Button>
      </div>

      {/* Celebration Animation */}
      <CelebrationAnimation
        isVisible={showCelebration}
        onClose={() => setShowCelebration(false)}
        projectName={state.appIdea.appName}
        onDownload={downloadAllPrompts}
        onShare={() => {
          toast({
            title: "Share Feature",
            description: "Share functionality coming soon!",
          });
        }}
      />
    </div>
  );
}
