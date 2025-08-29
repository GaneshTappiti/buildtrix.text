"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Brain,
  Layout,
  Settings,
  Palette,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { RAGContextInjector } from "@/services/ragContextInjector";

export function PromptGeneratorCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [showAllScreens, setShowAllScreens] = useState(false);
  const [copiedPrompts, setCopiedPrompts] = useState<Set<string>>(new Set());
  const [isGeneratingFlow, setIsGeneratingFlow] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedPromptFormat, setSelectedPromptFormat] = useState<'comprehensive' | 'concise' | 'technical'>('comprehensive');
  const [generatedPrompts, setGeneratedPrompts] = useState<Map<string, string>>(new Map());

  const screenPrompts = state.screenPrompts;
  const currentPrompt = screenPrompts[currentScreenIndex];

  // Preload current prompt with RAG context
  useEffect(() => {
    if (currentPrompt) {
      getPromptText(currentPrompt).catch(console.warn);
    }
  }, [currentScreenIndex, selectedPromptFormat, currentPrompt]);

  const handlePreviousScreen = () => {
    if (currentScreenIndex > 0) {
      setCurrentScreenIndex(currentScreenIndex - 1);
    }
  };

  const handleNextScreen = () => {
    if (currentScreenIndex < screenPrompts.length - 1) {
      setCurrentScreenIndex(currentScreenIndex + 1);
    }
  };

  // Get or generate prompt with caching
  const getPromptText = async (prompt: any): Promise<string> => {
    const cacheKey = `${prompt.screenId}_${selectedPromptFormat}`;

    if (generatedPrompts.has(cacheKey)) {
      return generatedPrompts.get(cacheKey)!;
    }

    const promptText = await generateFullPrompt(prompt);
    setGeneratedPrompts(prev => new Map(prev).set(cacheKey, promptText));
    return promptText;
  };

  // Synchronous version for immediate display (uses cache or fallback)
  const getPromptTextSync = (prompt: any): string => {
    const cacheKey = `${prompt.screenId}_${selectedPromptFormat}`;

    if (generatedPrompts.has(cacheKey)) {
      return generatedPrompts.get(cacheKey)!;
    }

    // Fallback to basic prompt while RAG context loads
    return `# ${prompt.title} - ${state.appIdea.appName}
## Loading enhanced prompt with RAG context...

### Basic Information
**Purpose**: ${prompt.purpose || 'Primary user interface screen'}
**Platform(s)**: ${state.appIdea.platforms.join(' and ')}
**Design Style**: ${state.appIdea.designStyle}

### Layout
${prompt.layout}

### Components
${prompt.components}

### Behavior
${prompt.behavior}

*Enhanced prompt with RAG context will load shortly...*`;
  };

  const copyPromptToClipboard = async (promptText: string, promptId: string) => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedPrompts(prev => new Set(Array.from(prev).concat(promptId)));
      toast({
        title: "Copied to Clipboard",
        description: "Prompt has been copied to your clipboard.",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedPrompts(prev => {
          const newSet = new Set(prev);
          newSet.delete(promptId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive"
      });
    }
  };

  const generateFullPrompt = async (prompt: any) => {
    const formatType = selectedPromptFormat;

    // Get RAG context for prompt enhancement
    let ragContext = null;
    if (state.validationQuestions.selectedTool) {
      try {
        ragContext = await RAGContextInjector.getContextForStage({
          stage: 'prompt_generation',
          toolId: state.validationQuestions.selectedTool,
          appIdea: state.appIdea.ideaDescription,
          appType: state.appIdea.platforms.includes('mobile') ? 'mobile-app' : 'web-app',
          platforms: state.appIdea.platforms,
          screenName: prompt.title
        });
      } catch (error) {
        console.warn('Failed to load RAG context for prompt generation:', error);
      }
    }

    if (formatType === 'comprehensive') {
      return generateComprehensivePrompt(prompt, ragContext);
    } else if (formatType === 'technical') {
      return generateTechnicalPrompt(prompt, ragContext);
    } else {
      return generateConcisePrompt(prompt, ragContext);
    }
  };

  const generateComprehensivePrompt = (prompt: any, ragContext?: any) => {
    let promptText = `# ${prompt.title} - ${state.appIdea.appName}
## Screen Specification & Implementation Guide

### 🎯 Screen Overview
**Purpose**: ${prompt.purpose || 'Primary user interface screen'}
**Screen Type**: ${prompt.screenType || 'Standard'}
**Platform(s)**: ${state.appIdea.platforms.join(' and ')}
**Design Style**: ${state.appIdea.designStyle}`;

    // Add RAG-enhanced tool-specific context
    if (ragContext?.toolSpecificContext) {
      promptText += `\n**Tool-Specific Guidance**: ${ragContext.toolSpecificContext.substring(0, 300)}`;
    }

    promptText += `\n\n### 📐 Layout & Structure
${prompt.layout}`;

    // Add RAG-enhanced architecture patterns
    if (ragContext?.architecturePatterns) {
      promptText += `\n\n**Architecture Patterns**: ${ragContext.architecturePatterns.substring(0, 200)}`;
    }

    promptText += `\n\n**Responsive Behavior**:
${prompt.responsiveNotes || '- Adapts to different screen sizes\n- Maintains usability across devices\n- Key elements remain accessible'}

**Visual Hierarchy**:
${prompt.visualHierarchy || '- Primary actions prominently displayed\n- Secondary elements appropriately sized\n- Clear content organization'}

### 🧩 Components & Elements
${prompt.components}`;

    // Add RAG-enhanced component recommendations
    if (ragContext?.codeExamples?.length > 0) {
      promptText += `\n\n**RAG-Enhanced Examples**: ${ragContext.codeExamples.slice(0, 2).join(', ')}`;
    }

    promptText += `\n\n**Component Specifications**:
${prompt.componentSpecs || '- All interactive elements have clear affordances\n- Consistent styling across components\n- Proper spacing and alignment'}`;

    // Add RAG best practices
    if (ragContext?.bestPractices?.length > 0) {
      promptText += `\n\n**Best Practices**: ${ragContext.bestPractices.slice(0, 3).join('\n- ')}`;
    }

    promptText += `\n\n**Data Display**:
${prompt.dataDisplay || '- Information presented clearly\n- Loading states for dynamic content\n- Empty states handled gracefully'}

### ⚡ Behavior & Interactions
${prompt.behavior}

**User Interactions**:
${prompt.userInteractions || '- Intuitive touch/click targets\n- Immediate feedback for user actions\n- Smooth transitions between states'}

**Animation & Transitions**:
${prompt.animations || '- Subtle animations enhance UX\n- Loading indicators for async operations\n- Smooth state transitions'}

### 🔀 Conditional Logic & States
${prompt.conditionalLogic}

**State Management**:
${prompt.stateManagement || '- Clear loading states\n- Error handling with user-friendly messages\n- Success confirmations'}

**Edge Cases**:
${prompt.edgeCases || '- Network connectivity issues\n- Empty data scenarios\n- Permission denied states'}

### 🎨 Style Guidelines & Theming
${prompt.styleHints}

**Visual Design**:
- **Color Scheme**: ${prompt.colorScheme || 'Follow app theme colors'}
- **Typography**: ${prompt.typography || 'Consistent font hierarchy'}
- **Spacing**: ${prompt.spacing || 'Standard padding and margins'}
- **Accessibility**: ${prompt.accessibility || 'WCAG compliant contrast and sizing'}

### 🔗 Navigation & Flow
**Entry Points**: ${prompt.entryPoints || 'Standard navigation flow'}
**Exit Actions**: ${prompt.exitActions || 'Back button, navigation menu'}
**Deep Linking**: ${prompt.deepLinking || 'Support direct access if applicable'}

### 🛠 Technical Implementation Notes
**Performance**: ${prompt.performance || 'Optimize for smooth rendering'}
**Data Requirements**: ${prompt.dataRequirements || 'Define API endpoints and data structure'}
**Third-party Integrations**: ${prompt.integrations || 'List any external services needed'}`;

    // Add RAG-enhanced optimization tips
    if (ragContext?.optimizationTips?.length > 0) {
      promptText += `\n\n**Optimization Tips**: ${ragContext.optimizationTips.slice(0, 3).join('\n- ')}`;
    }

    // Add RAG constraints if any
    if (ragContext?.constraints?.length > 0) {
      promptText += `\n\n**Constraints**: ${ragContext.constraints.slice(0, 2).join('\n- ')}`;
    }

    promptText += `\n\n### ✅ Acceptance Criteria
${prompt.acceptanceCriteria || '- Screen loads within 2 seconds\n- All interactive elements respond correctly\n- Design matches specifications\n- Accessibility requirements met'}

---
*Generated by Builder Blueprint AI with RAG Enhancement - ${new Date().toLocaleDateString()}*`;

    return promptText;
  };

  const generateTechnicalPrompt = (prompt: any, ragContext?: any) => {
    let techPrompt = `# ${prompt.title} - Technical Specification

## Implementation Requirements
**Platform**: ${state.appIdea.platforms.join(' and ')}
**Framework**: ${prompt.framework || 'Platform-specific'}
**Design System**: ${state.appIdea.designStyle}`;

    // Add RAG-enhanced tool-specific technical guidance
    if (ragContext?.toolSpecificContext) {
      techPrompt += `\n**Tool-Specific Implementation**: ${ragContext.toolSpecificContext.substring(0, 200)}`;
    }

    return techPrompt + `

## Layout Architecture
${prompt.layout}

## Component Tree
${prompt.components}

## State Management
${prompt.behavior}

## Business Logic
${prompt.conditionalLogic}

## Styling & Theming
${prompt.styleHints}

## API Integration Points
${prompt.apiEndpoints || '- Define required endpoints\n- Handle loading and error states\n- Implement data caching if needed'}

## Performance Considerations
${prompt.performanceNotes || '- Lazy loading for heavy components\n- Optimize re-renders\n- Implement proper memoization'}

---
*Technical spec generated by Builder Blueprint AI*`;
  };

  const generateConcisePrompt = (prompt: any, ragContext?: any) => {
    let concisePrompt = `# ${prompt.title}

**Layout**: ${prompt.layout}

**Components**: ${prompt.components}

**Interactions**: ${prompt.behavior}

**Logic**: ${prompt.conditionalLogic}

**Styling**: ${prompt.styleHints}

**Platform**: ${state.appIdea.platforms.join(' and ')} | **Style**: ${state.appIdea.designStyle}`;

    // Add RAG context if available
    if (ragContext?.bestPractices?.length > 0) {
      concisePrompt += `\n\n**Best Practices**: ${ragContext.bestPractices.slice(0, 2).join(', ')}`;
    }

    return concisePrompt;
  };

  const handleRegeneratePrompt = async (screenId: string) => {
    setIsRegenerating(true);

    try {
      // Find the screen in the blueprint
      const screen = state.appBlueprint?.screens.find(s => s.id === screenId);
      if (!screen) {
        throw new Error('Screen not found');
      }

      // Simulate regeneration with enhanced prompts
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate enhanced prompt data
      const enhancedPrompt = {
        screenId: screen.id,
        title: screen.name,
        purpose: screen.purpose,
        screenType: screen.type || 'standard',
        layout: generateEnhancedLayoutPrompt(screen),
        components: generateEnhancedComponentsPrompt(screen),
        behavior: generateEnhancedBehaviorPrompt(screen),
        conditionalLogic: generateEnhancedConditionalLogic(screen),
        styleHints: generateEnhancedStyleHints(screen),
        // New comprehensive fields
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
      };

      // Update the prompt in state
      dispatch(builderActions.updateScreenPrompt(enhancedPrompt));

      toast({
        title: "Prompt Regenerated!",
        description: `Enhanced prompt for ${screen.name} has been generated.`,
      });

    } catch (error) {
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate the prompt. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  // Enhanced prompt generation helpers
  const generateEnhancedLayoutPrompt = (screen: any) => {
    const baseLayout = `${screen.name} features a ${state.appIdea.designStyle} layout optimized for ${state.appIdea.platforms.join(' and ')} platforms.`;
    const components = screen.components?.join(', ').toLowerCase() || 'standard components';
    return `${baseLayout}\n\nKey layout elements:\n- ${components}\n- Responsive grid system\n- Consistent spacing and alignment\n- Platform-specific navigation patterns`;
  };

  const generateEnhancedComponentsPrompt = (screen: any) => {
    return screen.components?.map((comp: string, index: number) =>
      `${index + 1}. **${comp}**: Interactive ${comp.toLowerCase()} with ${state.appIdea.designStyle} styling, proper accessibility labels, and responsive behavior`
    ).join('\n') || 'Standard UI components with consistent styling and behavior';
  };

  const generateEnhancedBehaviorPrompt = (screen: any) => {
    return `User interactions on ${screen.name}:\n- Touch/click feedback with visual confirmation\n- Smooth transitions between states\n- Loading indicators for async operations\n- Error handling with user-friendly messages\n- Keyboard navigation support\n- Gesture support where appropriate`;
  };

  const generateEnhancedConditionalLogic = (screen: any) => {
    return `Conditional rendering and logic:\n- Authentication state checks\n- Permission-based feature visibility\n- Data availability conditions\n- Network connectivity handling\n- Platform-specific adaptations\n- User role-based customizations`;
  };

  const generateEnhancedStyleHints = (screen: any) => {
    return `${state.appIdea.designStyle} design system implementation:\n- Consistent color palette and typography\n- Platform-native UI patterns\n- Accessibility-compliant contrast ratios\n- Responsive breakpoints and scaling\n- Animation and transition guidelines\n- Component state variations (hover, active, disabled)`;
  };

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

  const continueToFlow = async () => {
    if (screenPrompts.length === 0) {
      toast({
        title: "No Screen Prompts",
        description: "Please generate screen prompts first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingFlow(true);
    dispatch(builderActions.setGenerating(true));
    dispatch(builderActions.setGenerationProgress(0));

    // Simulate flow generation
    const progressSteps = [
      { progress: 30, delay: 700, message: "Analyzing screen relationships..." },
      { progress: 60, delay: 900, message: "Creating navigation logic..." },
      { progress: 90, delay: 600, message: "Generating flow descriptions..." },
      { progress: 100, delay: 400, message: "Finalizing app flow..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      dispatch(builderActions.setGenerationProgress(step.progress));
    }

    // Generate app flow
    const appFlow = {
      flowLogic: generateFlowLogic(),
      conditionalRouting: generateConditionalRouting(),
      backButtonBehavior: "Standard back navigation with state preservation",
      modalLogic: "Modals for confirmations, forms, and detail views",
      screenTransitions: generateScreenTransitions()
    };

    dispatch(builderActions.setAppFlow(appFlow));
    dispatch(builderActions.setGenerating(false));
    dispatch(builderActions.setCurrentCard(5));
    setIsGeneratingFlow(false);

    toast({
      title: "App Flow Generated!",
      description: "Navigation and wireframe logic is ready.",
    });
  };

  const generateFlowLogic = () => {
    const screens = state.appBlueprint?.screens || [];
    return `App follows a ${screens.length}-screen architecture:\n` +
           screens.map((screen, index) => 
             `${index + 1}. ${screen.name}: ${screen.purpose}`
           ).join('\n');
  };

  const generateConditionalRouting = () => {
    return [
      "Authentication required for main features",
      "Guest users redirected to login",
      "Admin users see additional options",
      "Error states show fallback screens"
    ];
  };

  const generateScreenTransitions = () => {
    const screens = state.appBlueprint?.screens || [];
    return screens.map(screen => 
      `${screen.name} → ${screen.navigation.join(', ')}`
    );
  };

  if (screenPrompts.length === 0) {
    return (
      <div className="text-center py-8">
        <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-300">No Screen Prompts Generated</h3>
        <p className="text-sm text-gray-400">
          Complete the blueprint generation to create detailed screen prompts.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold flex items-center justify-center gap-2 text-white">
          <Brain className="h-5 w-5 text-blue-400" />
          🎨 Enhanced UI Prompt Generator
        </h3>
        <p className="text-sm text-gray-400">
          Comprehensive prompts for each screen ({screenPrompts.length} screens)
        </p>
      </div>

      {/* Prompt Format Selector */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <Settings className="h-4 w-4 text-green-400" />
            Prompt Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Prompt Format Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={selectedPromptFormat === 'comprehensive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPromptFormat('comprehensive')}
                className={selectedPromptFormat === 'comprehensive'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
                }
              >
                📋 Comprehensive
              </Button>
              <Button
                variant={selectedPromptFormat === 'technical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPromptFormat('technical')}
                className={selectedPromptFormat === 'technical'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
                }
              >
                ⚙️ Technical
              </Button>
              <Button
                variant={selectedPromptFormat === 'concise' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPromptFormat('concise')}
                className={selectedPromptFormat === 'concise'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'border-white/20 text-gray-300 hover:bg-white/10'
                }
              >
                ⚡ Concise
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {selectedPromptFormat === 'comprehensive' && 'Detailed prompts with all sections, automation features, and implementation guidance'}
              {selectedPromptFormat === 'technical' && 'Developer-focused prompts with technical specifications and architecture details'}
              {selectedPromptFormat === 'concise' && 'Streamlined prompts with essential information only'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Screen Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousScreen}
          disabled={currentScreenIndex === 0}
          className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous Screen
        </Button>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-white/10 text-gray-300 border-white/20">
            {currentScreenIndex + 1} of {screenPrompts.length}
          </Badge>
          <span className="text-sm font-medium text-white">{currentPrompt?.title}</span>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNextScreen}
          disabled={currentScreenIndex === screenPrompts.length - 1}
          className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10"
        >
          Next Screen
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Screen Prompt */}
      {currentPrompt && (
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Layout className="h-5 w-5 text-blue-400" />
                {currentPrompt.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRegeneratePrompt(currentPrompt.screenId)}
                  disabled={isRegenerating}
                  className="flex items-center gap-2 border-orange-500/30 text-orange-300 hover:bg-orange-500/10"
                >
                  {isRegenerating ? (
                    <>
                      <div className="animate-spin w-3 h-3 border-2 border-orange-300 border-t-transparent rounded-full" />
                      Regenerating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    const promptText = await getPromptText(currentPrompt);
                    copyPromptToClipboard(promptText, currentPrompt.screenId);
                  }}
                  className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10"
                >
                  {copiedPrompts.has(currentPrompt.screenId) ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Prompt
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full Prompt Display */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium flex items-center gap-2 text-white">
                  <Palette className="h-4 w-4 text-pink-400" />
                  Generated Prompt ({selectedPromptFormat})
                </h5>
                <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                  {getPromptTextSync(currentPrompt).length} characters
                </Badge>
              </div>
              <Textarea
                value={getPromptTextSync(currentPrompt)}
                readOnly
                className="min-h-[400px] text-sm bg-black/40 backdrop-blur-sm border-white/10 text-gray-300 font-mono"
                placeholder="Generated prompt will appear here..."
              />
            </div>

            {/* Quick Preview Sections - Collapsible */}
            {selectedPromptFormat === 'comprehensive' && (
              <div className="space-y-3">
                <h5 className="font-medium text-white text-sm">Quick Preview Sections:</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
                    <h6 className="font-medium flex items-center gap-2 mb-2 text-white text-xs">
                      <Layout className="h-3 w-3 text-blue-400" />
                      Layout & Structure
                    </h6>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {currentPrompt.layout}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
                    <h6 className="font-medium flex items-center gap-2 mb-2 text-white text-xs">
                      <Settings className="h-3 w-3 text-green-400" />
                      Components
                    </h6>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {currentPrompt.components}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
                    <h6 className="font-medium flex items-center gap-2 mb-2 text-white text-xs">
                      <Brain className="h-3 w-3 text-purple-400" />
                      Behavior & Interactions
                    </h6>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {currentPrompt.behavior}
                    </p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm p-3 rounded border border-white/10">
                    <h6 className="font-medium flex items-center gap-2 mb-2 text-white text-xs">
                      <Palette className="h-3 w-3 text-pink-400" />
                      Style Guidelines
                    </h6>
                    <p className="text-xs text-gray-400 line-clamp-2">
                      {currentPrompt.styleHints}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Automation Features */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-base">
            <Settings className="h-4 w-4 text-green-400" />
            Automation & Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Screen Navigation */}
          <div>
            <h6 className="font-medium text-white text-sm mb-2">Quick Screen Navigation</h6>
            <div className="flex flex-wrap gap-2">
              {screenPrompts.map((prompt, index) => (
                <Button
                  key={prompt.screenId}
                  variant={index === currentScreenIndex ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentScreenIndex(index)}
                  className={index === currentScreenIndex
                    ? 'bg-blue-600 hover:bg-blue-700 text-white text-xs'
                    : 'border-white/20 text-gray-300 hover:bg-white/10 text-xs'
                  }
                >
                  {prompt.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          <div>
            <h6 className="font-medium text-white text-sm mb-2">Bulk Actions</h6>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  for (const prompt of screenPrompts) {
                    const fullPrompt = await generateFullPrompt(prompt);
                    copyPromptToClipboard(fullPrompt, prompt.screenId);
                  }
                  toast({
                    title: "All Prompts Copied!",
                    description: `${screenPrompts.length} prompts copied to clipboard.`,
                  });
                }}
                className="border-green-500/30 text-green-300 hover:bg-green-500/10 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy All Prompts
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  setIsRegenerating(true);
                  for (const prompt of screenPrompts) {
                    await handleRegeneratePrompt(prompt.screenId);
                    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between regenerations
                  }
                  setIsRegenerating(false);
                  toast({
                    title: "All Prompts Regenerated!",
                    description: "Enhanced prompts generated for all screens.",
                  });
                }}
                disabled={isRegenerating}
                className="border-orange-500/30 text-orange-300 hover:bg-orange-500/10 text-xs"
              >
                {isRegenerating ? (
                  <>
                    <div className="animate-spin w-3 h-3 border-2 border-orange-300 border-t-transparent rounded-full mr-1" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Regenerate All
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h6 className="font-medium text-white text-sm mb-2">Export Options</h6>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const allPrompts = await Promise.all(
                    screenPrompts.map(async prompt =>
                      `# ${prompt.title}\n\n${await generateFullPrompt(prompt)}\n\n---\n\n`
                    )
                  );
                  navigator.clipboard.writeText(allPrompts.join(''));
                  toast({
                    title: "Combined Export Copied!",
                    description: "All prompts combined into a single document.",
                  });
                }}
                className="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-xs"
              >
                📄 Export Combined
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  const screensWithPrompts = await Promise.all(
                    screenPrompts.map(async prompt => ({
                      ...prompt,
                      fullPrompt: await generateFullPrompt(prompt)
                    }))
                  );

                  const jsonExport = JSON.stringify({
                    appName: state.appIdea.appName,
                    platforms: state.appIdea.platforms,
                    designStyle: state.appIdea.designStyle,
                    promptFormat: selectedPromptFormat,
                    screens: screensWithPrompts,
                    generatedAt: new Date().toISOString()
                  }, null, 2);
                  navigator.clipboard.writeText(jsonExport);
                  toast({
                    title: "JSON Export Copied!",
                    description: "Structured data export ready for import.",
                  });
                }}
                className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 text-xs"
              >
                🔧 Export JSON
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Toggle All Screens View */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowAllScreens(!showAllScreens)}
          className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10"
        >
          {showAllScreens ? 'Hide' : 'Show'} All Screens
          <Layout className="h-4 w-4" />
        </Button>
      </div>

      {/* All Screens Accordion */}
      {showAllScreens && (
        <div className="space-y-3">
          <h4 className="font-medium text-white">All Screen Prompts</h4>
          {screenPrompts.map((prompt, index) => (
            <Card key={prompt.screenId} className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-white">{prompt.title}</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const fullPrompt = await generateFullPrompt(prompt);
                      copyPromptToClipboard(fullPrompt, prompt.screenId);
                    }}
                    className="flex items-center gap-2 border-white/20 text-gray-300 hover:bg-white/10"
                  >
                    {copiedPrompts.has(prompt.screenId) ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Textarea
                  value={getPromptTextSync(prompt)}
                  readOnly
                  className="min-h-[200px] text-sm bg-black/40 backdrop-blur-sm border-white/10 text-gray-300"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={continueToFlow}
          disabled={isGeneratingFlow}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isGeneratingFlow ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating Flow...
            </>
          ) : (
            <>
              Continue to App Flow
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
