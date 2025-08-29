"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowRight, 
  GitBranch, 
  ArrowLeft as ArrowLeftIcon, 
  RotateCcw, 
  ExternalLink,
  Layers,
  Navigation,
  Settings,
  Copy,
  Check
} from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { RAGContextInjector } from "@/services/ragContextInjector";

export function FlowDescriptionCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [isGeneratingExport, setIsGeneratingExport] = useState(false);
  const [flowLogicCopied, setFlowLogicCopied] = useState(false);
  const [fullNavigationCopied, setFullNavigationCopied] = useState(false);
  const [navigationPrompt, setNavigationPrompt] = useState<string>('');

  // Generate and cache the navigation prompt
  const generateAndCachePrompt = async () => {
    const prompt = await generateFullNavigationPrompt();
    setNavigationPrompt(prompt);
    return prompt;
  };

  // Generate prompt when component mounts or app flow changes
  useEffect(() => {
    if (state.appFlow) {
      generateAndCachePrompt();
    }
  }, [state.appFlow, state.appBlueprint, state.appIdea]);

  const copyFlowLogic = async () => {
    try {
      if (!state.appFlow) {
        toast({
          title: "No flow logic available",
          description: "Please generate the app flow first.",
          variant: "destructive"
        });
        return;
      }
      
      await navigator.clipboard.writeText(state.appFlow.flowLogic);
      setFlowLogicCopied(true);
      toast({
        title: "Copied to clipboard!",
        description: "Flow logic has been copied to your clipboard.",
      });
      
      // Reset the copy state after 2 seconds
      setTimeout(() => {
        setFlowLogicCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const generateFullNavigationPrompt = async () => {
    const appIdea = state.appIdea;
    const blueprint = state.appBlueprint;
    const flow = state.appFlow;

    if (!flow || !blueprint) return '';

    // Get RAG context for flow enhancement
    let ragContext = null;
    if (state.validationQuestions.selectedTool) {
      try {
        ragContext = await RAGContextInjector.getContextForStage({
          stage: 'flow_generation',
          toolId: state.validationQuestions.selectedTool,
          appIdea: state.appIdea.ideaDescription,
          appType: state.appIdea.platforms.includes('mobile') ? 'mobile-app' : 'web-app',
          platforms: state.appIdea.platforms
        });
      } catch (error) {
        console.warn('Failed to load RAG context for flow generation:', error);
      }
    }

    let prompt = `# ${appIdea.appName} - App Flow & Navigation Description

## App Architecture Overview
The application follows a ${blueprint.screens.length}-screen architecture:
${blueprint.screens.map((screen, index) =>
  `${index + 1}. **${screen.name}** - ${screen.purpose}`
).join('\n')}

## Flow Logic
${flow.flowLogic}

## Conditional Routing
${flow.conditionalRouting.map(rule => `• ${rule}`).join('\n')}

## Screen Navigation & Transitions
${flow.screenTransitions.map(transition => `• ${transition}`).join('\n')}

## Modal Usage & Logic
${flow.modalLogic}

## Back Button Behavior
${flow.backButtonBehavior}

## Platform & Design Context
- **Platform(s):** ${appIdea.platforms.join(' and ')}
- **Design Style:** ${appIdea.designStyle}
- **Target Audience:** ${appIdea.targetAudience || 'General users'}`;

    // Add RAG-enhanced tool-specific guidance
    if (ragContext?.toolSpecificContext) {
      prompt += `\n\n## Tool-Specific Navigation Guidance
${ragContext.toolSpecificContext.substring(0, 400)}`;
    }

    // Add RAG-enhanced architecture patterns
    if (ragContext?.architecturePatterns) {
      prompt += `\n\n## Architecture Patterns
${ragContext.architecturePatterns.substring(0, 300)}`;
    }

    // Add RAG best practices
    if (ragContext?.bestPractices && ragContext.bestPractices.length > 0) {
      prompt += `\n\n## Best Practices
${ragContext.bestPractices.slice(0, 4).map(practice => `- ${practice}`).join('\n')}`;
    }

    // Add RAG optimization tips
    if (ragContext?.optimizationTips && ragContext.optimizationTips.length > 0) {
      prompt += `\n\n## Optimization Tips
${ragContext.optimizationTips.slice(0, 3).map(tip => `- ${tip}`).join('\n')}`;
    }

    prompt += `\n\n## Implementation Notes
- Ensure proper state management across screen transitions
- Implement loading states for async navigation
- Handle edge cases like network connectivity issues
- Follow platform-specific navigation patterns
- Maintain accessibility standards throughout the flow

---
*Generated by Builder Blueprint AI with RAG Enhancement for ${appIdea.platforms.join('/')} development*
*Ready for use in: AI design tools, Figma plugins, FlutterFlow, Draftbit, and developer planning*`;

    return prompt;
  };

  const copyFullNavigationPrompt = async () => {
    try {
      if (!state.appFlow) {
        toast({
          title: "No navigation flow available",
          description: "Please generate the app flow first.",
          variant: "destructive"
        });
        return;
      }

      const fullPrompt = navigationPrompt || await generateAndCachePrompt();
      await navigator.clipboard.writeText(fullPrompt);
      setFullNavigationCopied(true);

      toast({
        title: "Full Navigation Prompt Copied!",
        description: "Complete flow logic copied to clipboard - ready for AI tools, Figma, or development.",
      });

      // Reset the copy state after 3 seconds
      setTimeout(() => {
        setFullNavigationCopied(false);
      }, 3000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive"
      });
    }
  };

  const continueToExport = async () => {
    if (!state.appFlow) {
      toast({
        title: "No App Flow Available",
        description: "Please generate the app flow first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingExport(true);
    dispatch(builderActions.setGenerating(true));
    dispatch(builderActions.setGenerationProgress(0));

    // Simulate export generation
    const progressSteps = [
      { progress: 25, delay: 600, message: "Compiling unified prompt..." },
      { progress: 50, delay: 800, message: "Creating screen-by-screen prompts..." },
      { progress: 75, delay: 700, message: "Optimizing for different tools..." },
      { progress: 100, delay: 500, message: "Finalizing export package..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      dispatch(builderActions.setGenerationProgress(step.progress));
    }

    // Generate export prompts
    const exportPrompts = {
      unifiedPrompt: await generateUnifiedPrompt(),
      screenByScreenPrompts: state.screenPrompts,
      targetTool: 'framer' // Default to Framer
    };

    dispatch(builderActions.setExportPrompts(exportPrompts));
    dispatch(builderActions.setGenerating(false));
    dispatch(builderActions.setCurrentCard(6));
    setIsGeneratingExport(false);

    toast({
      title: "Export Package Ready!",
      description: "Your prompt package is ready for download and use.",
    });
  };

  const generateUnifiedPrompt = async () => {
    // Use the comprehensive navigation prompt for the unified export
    return await generateFullNavigationPrompt();
  };

  if (!state.appFlow) {
    return (
      <div className="text-center py-8">
        <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No App Flow Generated</h3>
        <p className="text-sm text-gray-400">
          Complete the screen prompts generation to create the app flow.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global Copy Full Navigation Prompt Button */}
      <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-white flex items-center gap-2 mb-1">
                <Copy className="h-4 w-4 text-green-400" />
                Complete Navigation Export
              </h4>
              <p className="text-sm text-gray-300">
                One-click export of full screen logic + flow for developers, designers, and AI tools
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="text-xs border-green-500/30 text-green-300">
                  AI Design Tools
                </Badge>
                <Badge variant="outline" className="text-xs border-blue-500/30 text-blue-300">
                  Figma Plugins
                </Badge>
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                  FlutterFlow
                </Badge>
                <Badge variant="outline" className="text-xs border-orange-500/30 text-orange-300">
                  Developer Planning
                </Badge>
              </div>
            </div>
            <Button
              onClick={copyFullNavigationPrompt}
              className={`ml-4 ${fullNavigationCopied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700'
              } text-white font-medium px-6 py-2`}
              size="lg"
            >
              {fullNavigationCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Navigation Prompt
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview of Combined Prompt */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Settings className="h-4 w-4 text-cyan-400" />
              Combined Prompt Preview
            </CardTitle>
            <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
              {navigationPrompt.length} characters
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-h-48 overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap font-mono text-gray-300">
              {navigationPrompt || 'Loading prompt preview...'}
            </pre>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            💡 This combined prompt includes all flow sections below and is optimized for:
            <br />
            • AI design tools (Galileo, Uizard) • Figma plugin prompts • Developer code planning • No-code tools (FlutterFlow, Draftbit)
          </div>
        </CardContent>
      </Card>

      {/* Quick Export Actions */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <ExternalLink className="h-4 w-4 text-purple-400" />
            Quick Export Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const prompt = navigationPrompt || await generateAndCachePrompt();
                const figmaPrompt = `# Figma Design Brief\n\n${prompt}\n\n## Design Requirements\n- Create wireframes for each screen\n- Show navigation flow between screens\n- Include modal overlays and transitions\n- Use ${state.appIdea.designStyle} design style`;
                navigator.clipboard.writeText(figmaPrompt);
                toast({
                  title: "Figma Brief Copied!",
                  description: "Design brief optimized for Figma plugins.",
                });
              }}
              className="border-pink-500/30 text-pink-300 hover:bg-pink-500/10 text-xs"
            >
              🎨 Figma Brief
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const prompt = navigationPrompt || await generateAndCachePrompt();
                const devPrompt = `# Development Specification\n\n${prompt}\n\n## Technical Requirements\n- Implement navigation stack\n- Handle state management\n- Add loading and error states\n- Follow ${state.appIdea.platforms.join('/')} best practices`;
                navigator.clipboard.writeText(devPrompt);
                toast({
                  title: "Dev Spec Copied!",
                  description: "Technical specification for developers.",
                });
              }}
              className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 text-xs"
            >
              💻 Dev Spec
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const prompt = navigationPrompt || await generateAndCachePrompt();
                const noCodePrompt = `# No-Code Implementation Guide\n\n${prompt}\n\n## No-Code Setup\n- Configure screen routing\n- Set up conditional navigation\n- Create modal components\n- Implement user flow logic`;
                navigator.clipboard.writeText(noCodePrompt);
                toast({
                  title: "No-Code Guide Copied!",
                  description: "Implementation guide for no-code tools.",
                });
              }}
              className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
            >
              🔧 No-Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const prompt = navigationPrompt || await generateAndCachePrompt();
                const aiPrompt = `# AI Design Assistant Prompt\n\n${prompt}\n\n## AI Instructions\n- Generate UI mockups for each screen\n- Create consistent design system\n- Show user flow connections\n- Apply ${state.appIdea.designStyle} styling`;
                navigator.clipboard.writeText(aiPrompt);
                toast({
                  title: "AI Prompt Copied!",
                  description: "Optimized prompt for AI design tools.",
                });
              }}
              className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 text-xs"
            >
              🤖 AI Tools
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Individual Sections Header */}
      <div className="text-center py-2">
        <h4 className="text-sm font-medium text-gray-400">
          Individual Flow Sections
        </h4>
        <p className="text-xs text-gray-500">
          Detailed breakdown of each navigation component
        </p>
      </div>

      {/* Flow Logic */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Layers className="h-4 w-4 text-purple-400" />
              Flow Logic
            </CardTitle>
            <Button
              onClick={copyFlowLogic}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-white/10"
            >
              {flowLogicCopied ? (
                <Check className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <pre className="text-sm whitespace-pre-wrap font-mono text-gray-300">
              {state.appFlow.flowLogic}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Conditional Routing */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <GitBranch className="h-4 w-4 text-green-400" />
            Conditional Routing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {state.appFlow.conditionalRouting.map((rule, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-blue-500/20 backdrop-blur-sm rounded border border-blue-500/30">
                <Badge variant="outline" className="mt-0.5 text-xs border-white/20 text-gray-300">
                  {index + 1}
                </Badge>
                <span className="text-sm text-gray-300">{rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back Button Behavior */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <ArrowLeftIcon className="h-4 w-4 text-orange-400" />
            Back Button Behavior
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded text-sm text-gray-300 border border-white/10">
            {state.appFlow.backButtonBehavior}
          </div>
        </CardContent>
      </Card>

      {/* Modal Logic */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <ExternalLink className="h-4 w-4 text-pink-400" />
            Modal Logic
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded text-sm text-gray-300 border border-white/10">
            {state.appFlow.modalLogic}
          </div>
        </CardContent>
      </Card>

      {/* Screen Transitions */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Navigation className="h-4 w-4 text-cyan-400" />
            Screen Transitions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {state.appFlow.screenTransitions.map((transition, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-white/20 rounded bg-white/5 backdrop-blur-sm">
                <Badge variant="secondary" className="text-xs bg-white/10 text-gray-300 border-white/20">
                  {index + 1}
                </Badge>
                <span className="text-sm font-mono text-gray-300">{transition}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Flow Representation */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <RotateCcw className="h-4 w-4 text-teal-400" />
            Visual Flow Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Start</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">Authentication</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">Main App</Badge>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Features</Badge>
              </div>
              <Separator className="bg-white/20" />
              <div className="text-xs text-gray-400">
                Users flow through authentication, land on the main dashboard, and navigate to specific features based on their needs and permissions.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Architecture Summary */}
      <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-green-300">
            <Settings className="h-4 w-4" />
            Architecture Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-green-300">Screens</h5>
              <p className="text-green-200">{state.appBlueprint?.screens.length || 0} total screens</p>
            </div>
            <div>
              <h5 className="font-medium text-green-300">User Roles</h5>
              <p className="text-green-200">{state.appBlueprint?.userRoles.length || 0} role types</p>
            </div>
            <div>
              <h5 className="font-medium text-green-300">Data Models</h5>
              <p className="text-green-200">{state.appBlueprint?.dataModels.length || 0} data entities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={continueToExport}
          disabled={isGeneratingExport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isGeneratingExport ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating Export...
            </>
          ) : (
            <>
              Generate Export Package
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
