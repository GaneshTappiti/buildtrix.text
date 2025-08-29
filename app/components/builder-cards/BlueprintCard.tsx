"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Layout, Users, GitBranch, Database, Eye, Edit3, MessageSquare, Activity, Plug } from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { RAGContextInjector } from "@/services/ragContextInjector";

export function BlueprintCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);

  const continueToPrompts = async () => {
    if (!state.appBlueprint) {
      toast({
        title: "No Blueprint Available",
        description: "Please generate a blueprint first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingPrompts(true);
    dispatch(builderActions.setGenerating(true));
    dispatch(builderActions.setGenerationProgress(0));

    // Simulate prompt generation
    const progressSteps = [
      { progress: 25, delay: 600, message: "Analyzing screen requirements..." },
      { progress: 50, delay: 800, message: "Creating detailed layouts..." },
      { progress: 75, delay: 700, message: "Generating component specifications..." },
      { progress: 100, delay: 500, message: "Finalizing prompts..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      dispatch(builderActions.setGenerationProgress(step.progress));
    }

    // Get RAG context for blueprint enhancement
    let ragContext = null;
    if (state.validationQuestions.selectedTool) {
      try {
        ragContext = await RAGContextInjector.getContextForStage({
          stage: 'blueprint_generation',
          toolId: state.validationQuestions.selectedTool,
          appIdea: state.appIdea.ideaDescription,
          appType: state.appIdea.platforms.includes('mobile') ? 'mobile-app' : 'web-app',
          platforms: state.appIdea.platforms
        });
      } catch (error) {
        console.warn('Failed to load RAG context for blueprint:', error);
      }
    }

    // Generate enhanced screen prompts based on blueprint with RAG context
    const screenPrompts = state.appBlueprint.screens.map(screen => ({
      screenId: screen.id,
      title: screen.name,
      purpose: screen.purpose,
      screenType: screen.type || 'standard',
      layout: generateLayoutPrompt(screen, ragContext),
      components: generateComponentsPrompt(screen, ragContext),
      behavior: generateBehaviorPrompt(screen, ragContext),
      conditionalLogic: generateConditionalLogic(screen),
      styleHints: generateStyleHints(screen, ragContext),
      // Enhanced fields for comprehensive prompts
      responsiveNotes: generateResponsiveNotes(screen),
      visualHierarchy: generateVisualHierarchy(screen),
      componentSpecs: generateComponentSpecs(screen),
      dataDisplay: generateDataDisplay(screen),
      userInteractions: generateUserInteractions(screen),
      animations: generateAnimations(screen),
      stateManagement: generateStateManagement(screen),
      edgeCases: generateEdgeCases(screen),
      colorScheme: generateColorScheme(screen),
      typography: generateTypography(screen),
      spacing: generateSpacing(screen),
      accessibility: generateAccessibility(screen),
      entryPoints: generateEntryPoints(screen),
      exitActions: generateExitActions(screen),
      deepLinking: generateDeepLinking(screen),
      performance: generatePerformance(screen),
      dataRequirements: generateDataRequirements(screen),
      integrations: generateIntegrations(screen),
      acceptanceCriteria: generateAcceptanceCriteria(screen),
      apiEndpoints: generateApiEndpoints(screen),
      performanceNotes: generatePerformanceNotes(screen),
      framework: getRecommendedFramework()
    }));

    // Add screen prompts to state
    screenPrompts.forEach(prompt => {
      dispatch(builderActions.addScreenPrompt(prompt));
    });

    dispatch(builderActions.setGenerating(false));
    dispatch(builderActions.setCurrentCard(4));
    setIsGeneratingPrompts(false);

    toast({
      title: "Screen Prompts Generated!",
      description: "Detailed prompts for each screen are ready for review.",
    });
  };

  const generateLayoutPrompt = (screen: any, ragContext?: any) => {
    const baseLayout = `${screen.name} screen with ${screen.purpose.toLowerCase()}. `;
    const components = screen.components.join(', ').toLowerCase();
    let prompt = `${baseLayout}Layout includes: ${components}. Use ${state.appIdea.designStyle} design style.`;

    // Inject RAG context for tool-specific layout guidance
    if (ragContext?.toolSpecificContext) {
      prompt += `\n\nTool-specific guidance: ${ragContext.toolSpecificContext.substring(0, 200)}`;
    }
    if (ragContext?.architecturePatterns) {
      prompt += `\n\nArchitecture patterns: ${ragContext.architecturePatterns.substring(0, 150)}`;
    }

    return prompt;
  };

  const generateComponentsPrompt = (screen: any, ragContext?: any) => {
    let prompt = screen.components.map((comp: string, index: number) =>
      `${index + 1}. ${comp}: Interactive element with appropriate styling and functionality`
    ).join('\n');

    // Add RAG-enhanced component recommendations
    if (ragContext?.bestPractices?.length > 0) {
      prompt += `\n\nBest practices: ${ragContext.bestPractices.slice(0, 3).join(', ')}`;
    }

    return prompt;
  };

  const generateBehaviorPrompt = (screen: any, ragContext?: any) => {
    const navigation = screen.navigation.join(', ');
    let prompt = `User interactions: Tap/click actions for navigation to ${navigation}. Include loading states and error handling.`;

    // Add RAG-enhanced behavior guidance
    if (ragContext?.optimizationTips?.length > 0) {
      prompt += `\n\nOptimization tips: ${ragContext.optimizationTips.slice(0, 2).join(', ')}`;
    }

    return prompt;
  };

  const generateConditionalLogic = (screen: any) => {
    if (screen.id === 'login') return 'Show login form if not authenticated, redirect to dashboard if already logged in.';
    if (screen.id === 'dashboard') return 'Display personalized content based on user data and preferences.';
    return 'Standard navigation and state management based on user permissions and data availability.';
  };

  const generateStyleHints = (screen: any, ragContext?: any) => {
    const style = state.appIdea.designStyle;
    const platform = state.appIdea.platforms.join(' and ');
    let prompt = `${style} design for ${platform}. ${state.appIdea.styleDescription || 'Follow modern UI/UX best practices.'}`;

    // Add RAG-enhanced styling guidance
    if (ragContext?.codeExamples?.length > 0) {
      prompt += `\n\nStyling examples: ${ragContext.codeExamples.slice(0, 2).join(', ')}`;
    }

    return prompt;
  };

  // Enhanced prompt generation helpers
  const generateResponsiveNotes = (screen: any) => {
    return `- Mobile-first responsive design\n- Tablet and desktop adaptations\n- Flexible grid layouts\n- Scalable typography and spacing\n- Touch-friendly interactive elements\n- Orientation change handling`;
  };

  const generateVisualHierarchy = (screen: any) => {
    return `- Primary CTA prominently positioned\n- Clear information architecture\n- Consistent visual weight distribution\n- Logical reading flow (Z-pattern/F-pattern)\n- Appropriate use of whitespace\n- Color and typography for emphasis`;
  };

  const generateComponentSpecs = (screen: any) => {
    return `- Reusable component architecture\n- Consistent props and API design\n- Built-in accessibility features\n- Loading and error states\n- Customizable theming support\n- Performance-optimized rendering`;
  };

  const generateDataDisplay = (screen: any) => {
    return `- Structured data presentation\n- Loading skeletons for async content\n- Empty state illustrations and messaging\n- Pagination or infinite scroll\n- Search and filtering capabilities\n- Data refresh mechanisms`;
  };

  const generateUserInteractions = (screen: any) => {
    return `- Intuitive gesture recognition\n- Immediate visual feedback\n- Contextual action menus\n- Drag and drop functionality\n- Multi-touch support\n- Voice interaction compatibility`;
  };

  const generateAnimations = (screen: any) => {
    return `- Micro-interactions for engagement\n- Page transition animations\n- Loading state animations\n- Hover and focus effects\n- Parallax scrolling where appropriate\n- Reduced motion accessibility option`;
  };

  const generateStateManagement = (screen: any) => {
    return `- Clear loading indicators\n- Comprehensive error boundaries\n- Success confirmation feedback\n- Undo/redo functionality\n- Form validation states\n- Offline mode handling`;
  };

  const generateEdgeCases = (screen: any) => {
    return `- Network connectivity loss\n- API timeout scenarios\n- Invalid or corrupted data\n- Permission denied states\n- Device storage limitations\n- Browser compatibility issues`;
  };

  const generateColorScheme = (screen: any) => {
    const styleMap = {
      minimal: 'Neutral palette with accent colors',
      playful: 'Vibrant colors with high contrast',
      business: 'Professional color scheme with brand colors'
    };
    return styleMap[state.appIdea.designStyle as keyof typeof styleMap] || 'Consistent brand color palette';
  };

  const generateTypography = (screen: any) => {
    return `- Clear font hierarchy (H1-H6)\n- Readable body text sizing\n- Consistent line heights\n- Platform-native font stacks\n- Accessibility-compliant sizing\n- Responsive typography scaling`;
  };

  const generateSpacing = (screen: any) => {
    return `- 8px grid system for consistency\n- Adequate touch target sizes (44px minimum)\n- Logical content grouping\n- Breathing room between elements\n- Consistent margins and padding\n- Responsive spacing adjustments`;
  };

  const generateAccessibility = (screen: any) => {
    return `- WCAG 2.1 AA compliance\n- Screen reader compatibility\n- Keyboard navigation support\n- High contrast mode support\n- Focus indicators for all interactive elements\n- Alternative text for images`;
  };

  const generateEntryPoints = (screen: any) => {
    const navigation = screen.navigation || [];
    return navigation.length > 0
      ? `Accessible from: ${navigation.join(', ')}\nDirect URL routing supported`
      : 'Standard app navigation flow with deep linking support';
  };

  const generateExitActions = (screen: any) => {
    return `- Hardware/software back button handling\n- Navigation drawer or tab bar\n- Breadcrumb navigation\n- Modal dismissal gestures\n- Save state on exit\n- Confirmation for unsaved changes`;
  };

  const generateDeepLinking = (screen: any) => {
    return `- Unique URL structure for web\n- Universal links for mobile\n- State preservation on deep link\n- Fallback handling for invalid links\n- Analytics tracking for link usage\n- SEO-friendly URL patterns`;
  };

  const generatePerformance = (screen: any) => {
    return `- Lazy loading for non-critical content\n- Image optimization and caching\n- Minimal bundle size\n- Efficient re-rendering strategies\n- Memory leak prevention\n- Battery usage optimization`;
  };

  const generateDataRequirements = (screen: any) => {
    return `- RESTful API endpoints definition\n- GraphQL schema if applicable\n- Local storage requirements\n- Caching strategy implementation\n- Data synchronization logic\n- Offline data handling`;
  };

  const generateIntegrations = (screen: any) => {
    return `- Third-party service APIs\n- Analytics and tracking\n- Push notification services\n- Social media integrations\n- Payment processing if needed\n- Authentication providers`;
  };

  const generateAcceptanceCriteria = (screen: any) => {
    return `- Screen loads within 2 seconds\n- All interactive elements respond correctly\n- Design matches approved mockups\n- Accessibility requirements met\n- Cross-platform compatibility verified\n- Performance benchmarks achieved`;
  };

  const generateApiEndpoints = (screen: any) => {
    return `- GET /api/${screen.id.toLowerCase()}/data\n- POST /api/${screen.id.toLowerCase()}/action\n- PUT /api/${screen.id.toLowerCase()}/update\n- DELETE /api/${screen.id.toLowerCase()}/remove\n- Error handling for all endpoints\n- Rate limiting and authentication`;
  };

  const generatePerformanceNotes = (screen: any) => {
    return `- Component memoization strategies\n- Virtual scrolling for large lists\n- Image lazy loading and compression\n- Bundle splitting and code splitting\n- Service worker caching\n- Performance monitoring integration`;
  };

  const getRecommendedFramework = () => {
    const platformFrameworks = {
      web: 'React/Next.js, Vue/Nuxt.js, or Angular',
      mobile: 'React Native, Flutter, or native development'
    };

    if (state.appIdea.platforms.includes('web') && state.appIdea.platforms.includes('mobile')) {
      return 'Cross-platform: React Native or Flutter';
    } else if (state.appIdea.platforms.includes('web')) {
      return platformFrameworks.web;
    } else {
      return platformFrameworks.mobile;
    }
  };

  if (!state.appBlueprint) {
    return (
      <div className="text-center py-8">
        <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No Blueprint Generated</h3>
        <p className="text-sm text-gray-400">
          Complete the previous steps to generate your app blueprint.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Blueprint Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2 text-white">
          <Layout className="h-5 w-5 text-blue-400" />
          Generated App Blueprint
        </h3>
        <p className="text-sm text-gray-400">
          Your app structure based on "{state.appIdea.appName}"
        </p>
      </div>

      {/* Screens List */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Eye className="h-4 w-4 text-blue-400" />
            🖼️ Screens List ({state.appBlueprint.screens.length} screens)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.appBlueprint.screens.map((screen, index) => (
            <div key={screen.id} className="flex items-start gap-3 p-3 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10">
              <Badge variant="outline" className="mt-0.5 border-white/20 text-gray-300">
                {index + 1}
              </Badge>
              <div className="flex-1">
                <h4 className="font-medium text-white">{screen.name}</h4>
                <p className="text-sm text-gray-400 mt-1">
                  📌 {screen.purpose}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {screen.components.slice(0, 3).map((component, idx) => (
                    <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded backdrop-blur-sm">
                      {component}
                    </span>
                  ))}
                  {screen.components.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{screen.components.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navigation Flow */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <GitBranch className="h-4 w-4 text-green-400" />
            🔁 Page Flow (Navigation Structure)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <p className="font-mono text-sm text-gray-300">{state.appBlueprint.navigationFlow}</p>
          </div>
          <div className="mt-4 space-y-2">
            <h5 className="font-medium text-sm text-white">Screen Connections:</h5>
            {state.appBlueprint.screens.map((screen) => (
              <div key={screen.id} className="text-sm">
                <span className="font-medium text-white">{screen.name}</span>
                <span className="text-gray-400"> → </span>
                <span className="text-gray-400">
                  {screen.navigation.join(', ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Roles */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Users className="h-4 w-4 text-purple-400" />
            👤 User Roles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.appBlueprint.userRoles.map((role, index) => (
            <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
                  {typeof role === 'string' ? role : role.name}
                </Badge>
              </div>
              {typeof role === 'object' && role.description && (
                <p className="text-sm text-gray-400 mb-2">{role.description}</p>
              )}
              {typeof role === 'object' && role.permissions && (
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission: string, idx: number) => (
                    <span key={idx} className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded backdrop-blur-sm">
                      {permission}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {state.appBlueprint.userRoles.length === 1 && (
            <p className="text-sm text-gray-400 mt-2">
              Single user role detected. Consider if you need different permission levels.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Data Models */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-white">
            <Database className="h-4 w-4 text-orange-400" />
            📊 Data Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.appBlueprint.dataModels.map((model, index) => (
            <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
              <h5 className="font-medium text-white">{model.name}</h5>
              {model.description && (
                <p className="text-sm text-gray-400 mt-1 mb-2">{model.description}</p>
              )}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  {model.fields.map((field: string, idx: number) => (
                    <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded backdrop-blur-sm">
                      {field}
                    </span>
                  ))}
                </div>
                {model.relationships && model.relationships.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {model.relationships.map((relationship: string, idx: number) => (
                      <span key={idx} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded backdrop-blur-sm">
                        {relationship}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modals & Popups */}
      {state.appBlueprint.modals && state.appBlueprint.modals.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <MessageSquare className="h-4 w-4 text-pink-400" />
              💬 Modals & Popups
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.appBlueprint.modals.map((modal, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
                <h5 className="font-medium text-white">{modal.name}</h5>
                <p className="text-sm text-gray-400 mt-1">{modal.purpose}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-400">Triggers:</span>
                    {modal.triggerScreens.map((screen: string, idx: number) => (
                      <span key={idx} className="text-xs bg-pink-500/20 text-pink-300 px-2 py-1 rounded backdrop-blur-sm">
                        {screen}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-400">Components:</span>
                    {modal.components.map((component: string, idx: number) => (
                      <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded backdrop-blur-sm">
                        {component}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* States & Edge Cases */}
      {state.appBlueprint.states && state.appBlueprint.states.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Activity className="h-4 w-4 text-yellow-400" />
              🧪 States & Edge Cases
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.appBlueprint.states.map((state_item, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
                <h5 className="font-medium text-white">{state_item.name}</h5>
                <p className="text-sm text-gray-400 mt-1">{state_item.description}</p>
                <div className="mt-2 space-y-1">
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-400">Screens:</span>
                    {state_item.screens.map((screen: string, idx: number) => (
                      <span key={idx} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded backdrop-blur-sm">
                        {screen}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="text-xs text-gray-400">Conditions:</span>
                    {state_item.conditions.map((condition: string, idx: number) => (
                      <span key={idx} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded backdrop-blur-sm">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 3rd-party Integrations */}
      {state.appBlueprint.integrations && state.appBlueprint.integrations.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Plug className="h-4 w-4 text-cyan-400" />
              🧩 3rd-party Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {state.appBlueprint.integrations.map((integration, index) => (
              <div key={index} className="border border-white/20 rounded-lg p-3 bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <h5 className="font-medium text-white">{integration.name}</h5>
                  <Badge variant="outline" className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                    {integration.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-2">{integration.description}</p>
                <div className="bg-white/5 p-2 rounded text-xs text-gray-300">
                  <span className="font-medium">Implementation:</span> {integration.implementation}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Architecture Pattern */}
      {state.appBlueprint.architecture && (
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-white">
              <Layout className="h-4 w-4 text-indigo-400" />
              🏗️ Suggested Architecture Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/10">
              <p className="font-medium text-white mb-2">{state.appBlueprint.architecture}</p>
              {state.appBlueprint.suggestedPattern && (
                <p className="text-sm text-gray-400">{state.appBlueprint.suggestedPattern}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        <Button variant="outline" className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10">
          <Edit3 className="h-4 w-4" />
          Regenerate Blueprint
        </Button>
        
        <Button 
          onClick={continueToPrompts}
          disabled={isGeneratingPrompts}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isGeneratingPrompts ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating Prompts...
            </>
          ) : (
            <>
              Continue to Page Prompts
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
