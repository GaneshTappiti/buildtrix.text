import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Globe,
  Zap,
  Chrome,
  Brain,
  Palette,
  Monitor,
  Moon,
  Sun,
  Briefcase,
  Smile,
  Building,
  Copy,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
  Layers,
  Link,
  Sparkles,
  Play
} from "lucide-react";
import {
  MVPWizardData,
  AppType,
  UITheme,
  DesignStyle,
  Platform,
  MVPAnalysisResult,
  PagePrompt,
  BuilderTool,
  RAGTool,
  RAGToolProfile
} from "@/types/ideaforge";

// Define missing types
interface GeneratedFramework {
  prompts: {
    framework: string;
    pages: PagePrompt[];
    linking: string;
  };
  recommendedTools: BuilderTool[];
  metadata: {
    generatedAt: string;
    toolUsed?: RAGTool;
    confidence: number;
    totalScreens?: number;
    complexity?: string;
    userRoles?: number;
  };
  builderTools?: any[];
  pages?: any[];
}
import { getAllRAGToolProfiles, getRecommendedTools } from "@/services/ragToolProfiles";
import { generateRAGEnhancedPrompt } from "@/services/ragEnhancedGenerator";
import { geminiService } from "@/services/geminiService";
import { UniversalPromptTemplateService, DEFAULT_CONFIGS } from "@/services/universalPromptTemplate";
import { ComprehensiveResponseParser } from "@/services/comprehensiveResponseParser";
// import { MVPPromptTemplateService } from "@/services/mvpPromptTemplates";
// import { FrameworkGeneratorService, FrameworkGenerationRequest, GeneratedFramework, parseFrameworkResponse } from "@/services/frameworkGenerator";
import PagePromptGenerator from "./PagePromptGenerator";
import ExportablePromptsSystem from "./ExportablePromptsSystem";
import { AIRequest } from "@/types/aiProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  PromptHistoryItem,
  CompletedPrompts,
  EnhancedWizardData,
  PromptFlow,
  PromptStage,
  validateWizardStep,
  safePagePromptAccess
} from './MVPWizardTypes';

interface MVPWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: MVPAnalysisResult) => void;
}

const MVPWizard: React.FC<MVPWizardProps> = ({ isOpen, onClose, onComplete }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState<MVPWizardData>({
    step1: { appName: "", appType: "web-app" },
    step2: { theme: "dark", designStyle: "minimal", selectedTool: undefined },
    step3: { platforms: ["web"] },
    step4: { selectedAI: "" },
    userPrompt: ""
  });

  // RAG tool state
  const [availableTools, setAvailableTools] = useState<RAGToolProfile[]>([]);
  const [filteredTools, setFilteredTools] = useState<RAGToolProfile[]>([]);
  const [ragRecommendations, setRagRecommendations] = useState<{ tool: RAGToolProfile; reason: string; confidence: number }[]>([]);

  // Enhanced wizard state for better UX
  const [enhancedData, setEnhancedData] = useState<EnhancedWizardData>({
    description: "",
    colorPreference: "",
    targetAudience: "",
    promptStyle: "detailed",
    keyFeatures: [],
    targetUsers: "",
    currentStepValid: false
  });

  // Universal Prompt Template configuration
  const [universalConfig, setUniversalConfig] = useState({
    includeErrorStates: true,
    includeBackendModels: true,
    includeUIComponents: true,
    includeModalsPopups: true,
    appDepth: 'advanced' as 'mvp' | 'advanced' | 'production',
    appType: 'web' as 'web' | 'mobile' | 'hybrid'
  });

  // Enhanced prompt-by-prompt state for sequential delivery
  const [promptFlow, setPromptFlow] = useState<PromptFlow>('setup');
  const [frameworkPrompt, setFrameworkPrompt] = useState<string>('');
  const [pagePrompts, setPagePrompts] = useState<PagePrompt[]>([]);
  const [linkingPrompt, setLinkingPrompt] = useState<string>('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [recommendedBuilderTools, setRecommendedBuilderTools] = useState<BuilderTool[]>([]);
  const [generatedFramework, setGeneratedFramework] = useState<GeneratedFramework | null>(null);

  // Sequential prompt delivery state
  const [promptStage, setPromptStage] = useState<PromptStage>('framework');
  const [completedPrompts, setCompletedPrompts] = useState<CompletedPrompts>({
    framework: false,
    pages: [],
    linking: false
  });
  const [focusedPrompt, setFocusedPrompt] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Helper function to parse comprehensive framework response from Universal Prompt Template
  const parseComprehensiveFrameworkResponse = (aiResponse: string, config: any): GeneratedFramework => {
    try {
      // Use the comprehensive parser to extract all data
      const blueprint = ComprehensiveResponseParser.parseResponse(aiResponse, wizardData);

      // Create page prompts from parsed screens
      const pages: PagePrompt[] = blueprint.screens.map((screen) => ({
        pageName: screen.name,
        prompt: generatePagePrompt(screen.name, {
          description: screen.description,
          components: screen.components,
          layout: screen.type === 'main' ? 'main' : 'secondary',
          userRoles: screen.userRoles,
          dataRequired: screen.dataRequired
        }, wizardData),
        components: screen.components || [],
        layout: screen.type === 'main' ? 'main' : 'secondary',
        interactions: []
      }));

      // Use existing recommended builder tools or create from blueprint
      const builderTools: BuilderTool[] = recommendedBuilderTools.length > 0 ? recommendedBuilderTools : [];

      return {
        prompts: {
          framework: aiResponse, // Store the full comprehensive response
          pages: pages,
          linking: generateLinkingPrompt(pages.map(p => p.pageName), wizardData)
        },
        recommendedTools: builderTools,
        metadata: {
          generatedAt: new Date().toISOString(),
          toolUsed: wizardData.step2.selectedTool,
          confidence: blueprint.metadata.confidence,
          totalScreens: blueprint.metadata.totalScreens,
          complexity: blueprint.metadata.complexity,
          userRoles: blueprint.userRoles.length,
          dataModels: blueprint.dataModels.length,
          estimatedDevTime: blueprint.metadata.estimatedDevTime,
          blueprint: blueprint // Store the full parsed blueprint for advanced features
        }
      };
    } catch (error) {
      console.error('Failed to parse comprehensive framework response:', error);

      // Fallback to basic parsing
      return parseBasicFrameworkResponse(aiResponse);
    }
  };

  // Helper function to extract screens from AI response
  const extractScreensFromResponse = (response: string): any[] => {
    const screens = [];

    // Look for screen sections in the response
    const screenSections = response.match(/(?:##?\s*1\..*?SCREENS.*?)([\s\S]*?)(?=##?\s*2\.|$)/i);
    if (screenSections && screenSections[1]) {
      const screenText = screenSections[1];

      // Extract individual screens (look for bullet points or numbered items)
      const screenMatches = screenText.match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);

      if (screenMatches) {
        screenMatches.forEach((match, index) => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          const descMatch = match.replace(/\*\*(.*?)\*\*:?\s*/, '');

          if (nameMatch) {
            screens.push({
              name: nameMatch[1].trim(),
              description: descMatch.trim(),
              type: index < 5 ? 'main' : 'sub',
              components: [],
              userRoles: ['user'],
              dataRequired: []
            });
          }
        });
      }
    }

    // If no screens found, create default comprehensive set
    if (screens.length === 0) {
      screens.push(
        { name: 'Landing Page', description: 'Main entry point', type: 'main', components: [], userRoles: ['guest'], dataRequired: [] },
        { name: 'Login', description: 'User authentication', type: 'auth', components: [], userRoles: ['guest'], dataRequired: [] },
        { name: 'Register', description: 'User registration', type: 'auth', components: [], userRoles: ['guest'], dataRequired: [] },
        { name: 'Dashboard', description: 'Main user interface', type: 'main', components: [], userRoles: ['user'], dataRequired: [] },
        { name: 'Profile', description: 'User profile management', type: 'sub', components: [], userRoles: ['user'], dataRequired: [] },
        { name: 'Settings', description: 'App configuration', type: 'sub', components: [], userRoles: ['user'], dataRequired: [] },
        { name: 'Help', description: 'User support', type: 'sub', components: [], userRoles: ['user'], dataRequired: [] },
        { name: '404 Error', description: 'Page not found', type: 'error', components: [], userRoles: ['all'], dataRequired: [] }
      );
    }

    return screens;
  };

  // Helper function to extract user roles from response
  const extractUserRolesFromResponse = (response: string): any[] => {
    const roles = [];
    const roleSection = response.match(/(?:##?\s*3\..*?USER ROLES.*?)([\s\S]*?)(?=##?\s*4\.|$)/i);

    if (roleSection && roleSection[1]) {
      const roleMatches = roleSection[1].match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);
      if (roleMatches) {
        roleMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          if (nameMatch) {
            roles.push({
              name: nameMatch[1].trim(),
              permissions: [],
              accessibleScreens: []
            });
          }
        });
      }
    }

    return roles.length > 0 ? roles : [{ name: 'User', permissions: [], accessibleScreens: [] }];
  };

  // Helper function to extract data models from response
  const extractDataModelsFromResponse = (response: string): any[] => {
    const models = [];
    const modelSection = response.match(/(?:##?\s*4\..*?DATA MODELS.*?)([\s\S]*?)(?=##?\s*5\.|$)/i);

    if (modelSection && modelSection[1]) {
      const modelMatches = modelSection[1].match(/[-*•]\s*\*\*(.*?)\*\*:?\s*(.*?)(?=\n[-*•]|\n\n|$)/g);
      if (modelMatches) {
        modelMatches.forEach(match => {
          const nameMatch = match.match(/\*\*(.*?)\*\*/);
          if (nameMatch) {
            models.push({
              name: nameMatch[1].trim(),
              fields: [],
              relationships: []
            });
          }
        });
      }
    }

    return models.length > 0 ? models : [{ name: 'User', fields: [], relationships: [] }];
  };

  // Helper function to extract tools from response
  const extractToolsFromResponse = (response: string): BuilderTool[] => {
    // Return recommended builder tools based on current selection
    return recommendedBuilderTools.length > 0 ? recommendedBuilderTools : [];
  };

  // Fallback basic parsing function
  const parseBasicFrameworkResponse = (aiResponse: string): GeneratedFramework => {
    return {
      prompts: {
        framework: aiResponse,
        pages: [],
        linking: ''
      },
      recommendedTools: [],
      metadata: {
        generatedAt: new Date().toISOString(),
        toolUsed: wizardData.step2.selectedTool,
        confidence: 0.6
      }
    };
  };

  // Load available RAG tools on component mount
  useEffect(() => {
    const loadAvailableTools = async () => {
      try {
        const tools = getAllRAGToolProfiles();
        setAvailableTools(tools);

        // Apply initial filtering based on current wizard data
        const filtered = tools.filter(tool => {
          // Filter by app type compatibility
          const appTypeMatch = tool.appTypes.includes(wizardData.step1.appType);

          // For stage 2, we should show tools compatible with the app type
          // Platform filtering will be more restrictive after step 3
          const platformMatch = currentStep <= 2 ? true :
            (wizardData.step3.platforms.length === 0 ||
            wizardData.step3.platforms.some(platform => tool.platforms.includes(platform)));

          return appTypeMatch && platformMatch;
        });

        setFilteredTools(filtered);
      } catch (error) {
        console.error('Failed to load RAG tools:', error);
        toast({
          title: "Error Loading Tools",
          description: "Failed to load available development tools. Please refresh the page.",
          variant: "destructive"
        });
      }
    };

    loadAvailableTools();
  }, [wizardData.step1.appType, currentStep]);

  // Filter tools based on app type and platforms when data changes
  useEffect(() => {
    if (availableTools.length === 0) return;

    const filtered = availableTools.filter(tool => {
      // Filter by app type compatibility
      const appTypeMatch = tool.appTypes.includes(wizardData.step1.appType);

      // For stage 2, show all tools compatible with app type
      // For stage 3+, also filter by platform compatibility
      const platformMatch = currentStep <= 2 ? true :
        (wizardData.step3.platforms.length === 0 ||
        wizardData.step3.platforms.some(platform => tool.platforms.includes(platform)));

      return appTypeMatch && platformMatch;
    });

    // Sort tools to show recommended ones first
    const sortedFiltered = filtered.sort((a, b) => {
      // Prioritize tools that are commonly recommended for the app type
      const aRecommended = getToolRecommendationScore(a, wizardData.step1.appType);
      const bRecommended = getToolRecommendationScore(b, wizardData.step1.appType);
      return bRecommended - aRecommended;
    });

    setFilteredTools(sortedFiltered);
  }, [wizardData.step1.appType, wizardData.step3.platforms, availableTools, enhancedData.description, currentStep]);

  // Generate RAG-enhanced recommendations when description or features change
  useEffect(() => {
    const generateRecommendations = async () => {
      if (currentStep === 2 && (enhancedData.description || enhancedData.keyFeatures.length > 0)) {
        try {
          const recommendations = await generateRAGToolRecommendations();
          setRagRecommendations(recommendations);
        } catch (error) {
          console.error('Failed to generate RAG recommendations:', error);
        }
      }
    };

    // Debounce the recommendation generation
    const timeoutId = setTimeout(generateRecommendations, 500);
    return () => clearTimeout(timeoutId);
  }, [enhancedData.description, enhancedData.keyFeatures, currentStep, filteredTools]);

  // Enhanced RAG-powered tool recommendation scoring
  const getToolRecommendationScore = (tool: RAGToolProfile, appType: AppType): number => {
    let score = 0;

    // Base scoring for app type compatibility
    if (appType === 'web-app') {
      if (['lovable', 'bolt', 'cursor', 'v0'].includes(tool.id)) score += 3;
      if (['framer', 'bubble'].includes(tool.id)) score += 2;
    } else if (appType === 'mobile-app') {
      if (['flutterflow', 'adalo'].includes(tool.id)) score += 3;
      if (['uizard'].includes(tool.id)) score += 2;
    } else if (appType === 'saas-tool') {
      if (['lovable', 'cursor', 'bolt'].includes(tool.id)) score += 3;
      if (['bubble', 'framer'].includes(tool.id)) score += 2;
    }

    // Enhanced scoring based on project description and features
    const description = enhancedData.description.toLowerCase();
    const keyFeatures = enhancedData.keyFeatures.map(f => f.toLowerCase());

    // AI/ML features boost
    if (description.includes('ai') || description.includes('machine learning') ||
        keyFeatures.some(f => f.includes('ai') || f.includes('ml'))) {
      if (['cursor', 'lovable', 'bolt'].includes(tool.id)) score += 2;
    }

    // Real-time features boost
    if (description.includes('real-time') || description.includes('live') ||
        keyFeatures.some(f => f.includes('real-time') || f.includes('live'))) {
      if (['lovable', 'bolt'].includes(tool.id)) score += 1;
    }

    // E-commerce features boost
    if (description.includes('ecommerce') || description.includes('shop') || description.includes('payment') ||
        keyFeatures.some(f => f.includes('shop') || f.includes('payment') || f.includes('cart'))) {
      if (['bubble', 'framer'].includes(tool.id)) score += 2;
    }

    // Complex UI/Animation boost
    if (description.includes('animation') || description.includes('interactive') ||
        keyFeatures.some(f => f.includes('animation') || f.includes('interactive'))) {
      if (['framer', 'v0'].includes(tool.id)) score += 2;
    }

    // Beginner-friendly bonus
    if (tool.complexity === 'beginner') score += 1;

    // Platform-specific bonuses
    if (wizardData.step3.platforms.includes('mobile') && tool.platforms.includes('mobile')) {
      score += 1;
    }

    return score;
  };

  // RAG-enhanced tool recommendation with contextual insights
  const generateRAGToolRecommendations = async (): Promise<{ tool: RAGToolProfile; reason: string; confidence: number }[]> => {
    if (!enhancedData.description && enhancedData.keyFeatures.length === 0) {
      // Return basic recommendations if no description available
      return filteredTools.slice(0, 3).map(tool => ({
        tool,
        reason: `Great choice for ${wizardData.step1.appType.replace('-', ' ')} development`,
        confidence: 0.7
      }));
    }

    try {
      // Use RAG context to generate intelligent recommendations
      const projectContext = `
        App Type: ${wizardData.step1.appType}
        Description: ${enhancedData.description}
        Key Features: ${enhancedData.keyFeatures.join(', ')}
        Target Platforms: ${wizardData.step3.platforms.join(', ')}
        Target Audience: ${enhancedData.targetAudience}
      `;

      // Score and rank tools with enhanced context
      const scoredTools = filteredTools.map(tool => {
        const baseScore = getToolRecommendationScore(tool, wizardData.step1.appType);

        // Generate contextual reason for recommendation
        let reason = `Excellent for ${wizardData.step1.appType.replace('-', ' ')} development`;
        let confidence = 0.8;

        // Add specific reasons based on tool strengths and project needs
        if (tool.id === 'lovable' && (enhancedData.description.includes('rapid') || enhancedData.description.includes('fast'))) {
          reason = 'Perfect for rapid prototyping and fast development cycles';
          confidence = 0.95;
        } else if (tool.id === 'cursor' && enhancedData.description.includes('complex')) {
          reason = 'Ideal for complex applications with AI-assisted coding';
          confidence = 0.9;
        } else if (tool.id === 'framer' && enhancedData.description.includes('design')) {
          reason = 'Best for design-heavy applications with rich interactions';
          confidence = 0.9;
        } else if (tool.id === 'flutterflow' && wizardData.step3.platforms.includes('mobile')) {
          reason = 'Top choice for cross-platform mobile development';
          confidence = 0.95;
        }

        return {
          tool,
          reason,
          confidence,
          score: baseScore
        };
      });

      // Return top 3 recommendations sorted by score
      return scoredTools
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ tool, reason, confidence }) => ({ tool, reason, confidence }));

    } catch (error) {
      console.error('Failed to generate RAG tool recommendations:', error);
      // Fallback to basic recommendations
      return filteredTools.slice(0, 3).map(tool => ({
        tool,
        reason: `Recommended for ${wizardData.step1.appType.replace('-', ' ')} development`,
        confidence: 0.7
      }));
    }
  };

  // Update universal config based on app type selection
  useEffect(() => {
    if (wizardData.step1.appType && DEFAULT_CONFIGS[wizardData.step1.appType]) {
      setUniversalConfig(prev => ({
        ...prev,
        ...DEFAULT_CONFIGS[wizardData.step1.appType],
        appType: wizardData.step1.appType === 'mobile-app' ? 'mobile' : 'web'
      }));
    }
  }, [wizardData.step1.appType]);

  // Enhanced step configuration
  const stepConfig = [
    {
      id: 1,
      title: "Project Foundation",
      description: "Define your app's core identity and purpose",
      icon: <Building className="h-5 w-5" />,
      fields: ["appName", "appType", "description"]
    },
    {
      id: 2,
      title: "Visual Identity & Tool Selection",
      description: "Choose your app's look, feel, and development tool",
      icon: <Palette className="h-5 w-5" />,
      fields: ["theme", "designStyle", "colorPreference", "selectedTool"]
    },
    {
      id: 3,
      title: "Platform Strategy",
      description: "Select where your app will live",
      icon: <Globe className="h-5 w-5" />,
      fields: ["platforms", "targetAudience"]
    },
    {
      id: 4,
      title: "AI Engine Setup",
      description: "Choose your AI assistant for generation",
      icon: <Brain className="h-5 w-5" />,
      fields: ["selectedAI", "promptStyle"]
    },
    {
      id: 5,
      title: "Vision & Requirements",
      description: "Describe your complete app vision",
      icon: <Sparkles className="h-5 w-5" />,
      fields: ["userPrompt", "keyFeatures", "targetUsers"]
    }
  ];

  const appTypes: { value: AppType; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "web-app", label: "Web App", icon: <Globe className="h-5 w-5" />, description: "Browser-based application" },
    { value: "mobile-app", label: "Mobile App", icon: <Smartphone className="h-5 w-5" />, description: "iOS/Android application" },
    { value: "saas-tool", label: "SaaS Tool", icon: <Zap className="h-5 w-5" />, description: "Software as a Service platform" },
    { value: "chrome-extension", label: "Chrome Extension", icon: <Chrome className="h-5 w-5" />, description: "Browser extension" },
    { value: "ai-app", label: "AI App", icon: <Brain className="h-5 w-5" />, description: "AI-powered application" }
  ];

  const themes: { value: UITheme; label: string; icon: React.ReactNode }[] = [
    { value: "dark", label: "Dark", icon: <Moon className="h-5 w-5" /> },
    { value: "light", label: "Light", icon: <Sun className="h-5 w-5" /> }
  ];

  const designStyles: { value: DesignStyle; label: string; icon: React.ReactNode; description: string }[] = [
    { value: "minimal", label: "Minimal & Clean", icon: <Monitor className="h-5 w-5" />, description: "Simple, focused design" },
    { value: "playful", label: "Playful & Animated", icon: <Smile className="h-5 w-5" />, description: "Fun, engaging interface" },
    { value: "business", label: "Business & Professional", icon: <Building className="h-5 w-5" />, description: "Corporate, formal look" }
  ];

  const platforms: { value: Platform; label: string; description: string }[] = [
    { value: "web", label: "Web", description: "Browser-based" },
    { value: "android", label: "Android", description: "Google Play Store" },
    { value: "ios", label: "iOS", description: "Apple App Store" },
    { value: "cross-platform", label: "Cross-platform", description: "Flutter/React Native" }
  ];

  const builderTools: BuilderTool[] = [
    {
      name: "Framer",
      type: "web",
      description: "AI-powered website builder with advanced design capabilities and animations",
      url: "https://framer.com",
      openUrl: "https://framer.com/projects/new",
      icon: "🎨",
      bestFor: ["Landing pages", "Web apps", "Portfolios", "Interactive prototypes"]
    },
    {
      name: "FlutterFlow",
      type: "mobile",
      description: "Visual app builder for Flutter with Firebase integration and native performance",
      url: "https://flutterflow.io",
      openUrl: "https://app.flutterflow.io/create",
      icon: "📱",
      bestFor: ["Mobile apps", "Cross-platform", "Firebase apps", "Real-time features"]
    },
    {
      name: "Webflow",
      type: "web",
      description: "Professional web design tool with CMS, hosting, and e-commerce capabilities",
      url: "https://webflow.com",
      openUrl: "https://webflow.com/dashboard/sites/new",
      icon: "🌐",
      bestFor: ["Professional websites", "CMS", "E-commerce", "SEO-optimized sites"]
    },
    {
      name: "Bubble",
      type: "web",
      description: "Full-stack no-code platform for complex web applications with database",
      url: "https://bubble.io",
      openUrl: "https://bubble.io/build",
      icon: "🫧",
      bestFor: ["SaaS platforms", "Complex workflows", "Database-driven apps", "User authentication"]
    },
    {
      name: "Glide",
      type: "mobile",
      description: "Turn spreadsheets into beautiful mobile apps with AI assistance",
      url: "https://glideapps.com",
      openUrl: "https://go.glideapps.com/",
      icon: "✨",
      bestFor: ["Data-driven apps", "Quick MVPs", "Internal tools", "Spreadsheet integration"]
    },
    {
      name: "Adalo",
      type: "mobile",
      description: "Native mobile app builder with custom actions and integrations",
      url: "https://adalo.com",
      openUrl: "https://app.adalo.com/apps/new",
      icon: "📲",
      bestFor: ["Native mobile apps", "Custom actions", "Third-party integrations", "Marketplace apps"]
    },
    {
      name: "Softr",
      type: "web",
      description: "Build web apps from Airtable with pre-built blocks and templates",
      url: "https://softr.io",
      openUrl: "https://studio.softr.io/",
      icon: "🧱",
      bestFor: ["Airtable integration", "Client portals", "Internal tools", "Directory sites"]
    },
    {
      name: "Retool",
      type: "web",
      description: "Build internal tools and admin panels with drag-and-drop components",
      url: "https://retool.com",
      openUrl: "https://retool.com/products/apps",
      icon: "🔧",
      bestFor: ["Internal tools", "Admin panels", "Data dashboards", "CRUD operations"]
    },
    {
      name: "Figma + Dev Mode",
      type: "web",
      description: "Design in Figma and use Dev Mode for handoff to developers",
      url: "https://figma.com",
      openUrl: "https://figma.com/files/recent",
      icon: "🎯",
      bestFor: ["Design handoff", "Prototyping", "Design systems", "Developer collaboration"]
    }
  ];

  // Enhanced prompt generation functions
  const generateFrameworkPrompt = (data: MVPWizardData): string => {
    const { step1, step2, step3, userPrompt } = data;
    const platformText = step3.platforms.join(", ");

    return `You are an expert app designer and UX architect. I want to build a ${step1.appType.replace('-', ' ')} called "${step1.appName}" for ${platformText} platform(s).

**Project Vision:**
${userPrompt}

${enhancedData.description ? `**Additional Context:**
${enhancedData.description}` : ''}

**Design Requirements:**
- Theme: ${step2.theme} mode
- Design Style: ${step2.designStyle}
- Target Platform(s): ${platformText}
${enhancedData.colorPreference ? `- Color Preference: ${enhancedData.colorPreference}` : ''}
${enhancedData.targetAudience ? `- Target Audience: ${enhancedData.targetAudience}` : ''}
${enhancedData.targetUsers ? `- Target Users: ${enhancedData.targetUsers}` : ''}
${enhancedData.keyFeatures.length > 0 ? `- Key Features: ${enhancedData.keyFeatures.join(', ')}` : ''}

**Prompt Style:** ${enhancedData.promptStyle === 'detailed' ? 'Provide comprehensive, detailed analysis' : 'Keep analysis concise and focused'}

**Please create a complete framework including:**

1. **Page Structure** (5-8 pages maximum):
   - Page name and purpose
   - Key components needed
   - Layout type (sidebar, vertical, centered, etc.)
   - User interactions

2. **Navigation Flow:**
   - Navigation type (sidebar, tabs, bottom nav, etc.)
   - Page hierarchy and relationships
   - User journey mapping

3. **Technical Recommendations:**
   - Best tech stack for this type of app
   - Recommended no-code/AI builders
   - Integration requirements

4. **User Experience:**
   - Primary user actions
   - Key user flows
   - Success metrics

**Output Format:**
Provide a structured JSON response with:
\`\`\`json
{
  "pages": [{"name": "", "description": "", "components": [], "layout": "", "interactions": []}],
  "navigation": {"type": "", "structure": [], "userFlow": []},
  "techStack": {"recommended": "", "alternatives": []},
  "builderTools": [{"name": "", "reason": "", "bestFor": []}],
  "userJourney": ["step1", "step2", "..."],
  "keyFeatures": ["feature1", "feature2", "..."]
}
\`\`\``;
  };

  const generatePagePrompt = (pageName: string, pageData: unknown, data: MVPWizardData): string => {
    const platformSpecific = data.step3.platforms.includes('web') ?
      'Include responsive design for mobile, tablet, and desktop viewports.' :
      (data.step3.platforms.includes('android') || data.step3.platforms.includes('ios')) ?
      'Focus on mobile-first design with touch-friendly interactions.' :
      'Optimize for the target platform requirements.';

    return `Design the complete UI for the "${pageName}" page of "${data.step1.appName}".

**Design Specifications:**
- Theme: ${data.step2.theme} mode with ${data.step2.designStyle} aesthetic
- App Type: ${data.step1.appType.replace('-', ' ')}
- Platform: ${data.step3.platforms.join(', ')}

**Page Details:**
- Purpose: ${(pageData as any)?.description || 'Not specified'}
- Layout Style: ${(pageData as any)?.layout || 'Not specified'}
- Key Components: ${(pageData as any)?.components?.join(', ') || 'Not specified'}

**Design Requirements:**
1. **Layout & Structure:**
   - Component hierarchy and positioning
   - Spacing and grid system
   - ${platformSpecific}

2. **Visual Design:**
   - Color scheme for ${data.step2.theme} theme
   - Typography and font sizes
   - Icons and visual elements
   - ${data.step2.designStyle} design patterns

3. **Interactions & Animations:**
   - Button states and hover effects
   - Loading states and feedback
   - Micro-interactions and transitions
   - User flow within the page

4. **Content Structure:**
   - Placeholder text and copy
   - Image placeholders and sizes
   - Data display patterns

**Output for AI Builder:**
Provide a detailed, copy-paste ready prompt that includes:
- Exact component descriptions
- Styling specifications
- Layout instructions
- Interactive behavior
- Responsive considerations

Format this as a comprehensive prompt that can be directly used in tools like Framer, FlutterFlow, Webflow, or other AI builders.`;
  };

  const generateLinkingPrompt = (pages: unknown[], data: MVPWizardData): string => {
    const pageNames = pages.map(p => (p as any)?.pageName || 'Untitled').join(', ');
    const appType = data.step1.appType.replace('-', ' ');

    return `Create the complete navigation and linking system for "${data.step1.appName}" (${appType}).

**Pages to Connect:**
${pageNames}

**Navigation Requirements:**

1. **Navigation Structure:**
   - Primary navigation method (sidebar, tabs, bottom nav, header menu)
   - Secondary navigation patterns
   - Breadcrumb requirements
   - Back button behavior

2. **Routing & Paths:**
   - URL structure and routing paths
   - Deep linking capabilities
   - Route parameters and dynamic routes
   - Default/home page routing

3. **User Flow Logic:**
   - Authentication-gated pages
   - Onboarding flow sequence
   - Error page handling (404, 500)
   - Loading states between pages

4. **Platform-Specific Navigation:**
   ${data.step3.platforms.includes('web') ?
     '- Browser navigation (back/forward buttons)\n   - URL sharing and bookmarking\n   - Tab management' :
     '- Mobile navigation patterns\n   - Gesture-based navigation\n   - Hardware back button handling'}

5. **State Management:**
   - Navigation state persistence
   - User context across pages
   - Data passing between pages
   - Session management

**Builder Implementation:**
Provide specific instructions for implementing this navigation in:
- Route configuration code/settings
- Navigation component setup
- State management setup
- Conditional rendering logic

**Output Format:**
Structure this as actionable implementation steps that can be directly applied in no-code builders like FlutterFlow, Framer, or traditional development frameworks.`;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const validation = validateWizardStep(currentStep, wizardData);
    if (!validation.isValid) {
      toast({
        title: "Validation Error",
        description: validation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleStartPromptFlow();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStartPromptFlow = () => {
    setPromptFlow('framework');
    toast({
      title: "Starting Prompt Flow",
      description: "Let's build your MVP step by step!"
    });
  };

  const handleGenerateFramework = async () => {
    // Validation before generation
    if (!wizardData.step1.appName.trim()) {
      toast({
        title: "Missing App Name",
        description: "Please provide an app name before generating framework.",
        variant: "destructive"
      });
      return;
    }

    if (!wizardData.step4.selectedAI) {
      toast({
        title: "Missing AI Provider",
        description: "Please select an AI provider before generating framework.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    const startTime = Date.now();

    try {
      let framework: any;

      // Use RAG-enhanced generation if a tool is selected
      if (wizardData.step2.selectedTool) {
        try {
          // Generate RAG-enhanced framework prompt
          const ragResult = await generateRAGEnhancedPrompt({
            type: 'framework',
            wizardData,
            selectedTool: wizardData.step2.selectedTool,
            additionalContext: {
              userPrompt: wizardData.userPrompt
            }
          });

          // Use the RAG-enhanced prompt to generate framework
          const aiResponse = await geminiService.generateText(ragResult.prompt, {
            maxTokens: 4000,
            temperature: 0.7
          });

          // Parse the RAG-enhanced response
          framework = parseComprehensiveFrameworkResponse(aiResponse.text, universalConfig);

          // Add RAG metadata to framework
          framework.metadata = {
            ...framework.metadata,
            ragEnhanced: true,
            toolUsed: wizardData.step2.selectedTool,
            confidence: ragResult.confidence,
            sources: ragResult.sources,
            toolSpecificOptimizations: ragResult.toolSpecificOptimizations
          };

          toast({
            title: "🧠 RAG-Enhanced Framework Generated!",
            description: `Framework optimized for ${wizardData.step2.selectedTool} with ${ragResult.sources.length} documentation sources.`
          });

        } catch (ragError) {
          console.error('RAG framework generation failed, falling back to universal prompt:', ragError);

          // Fallback to universal prompt if RAG fails
          const universalPrompt = UniversalPromptTemplateService.generateUniversalPrompt(
            wizardData.userPrompt,
            wizardData,
            universalConfig,
            wizardData.step2.selectedTool
          );

          const aiResponse = await geminiService.generateText(universalPrompt, {
            maxTokens: 4000,
            temperature: 0.7
          });

          framework = parseComprehensiveFrameworkResponse(aiResponse.text, universalConfig);
        }
      } else {
        // Use universal prompt template for generic generation
        const universalPrompt = UniversalPromptTemplateService.generateUniversalPrompt(
          wizardData.userPrompt,
          wizardData,
          universalConfig,
          wizardData.step2.selectedTool
        );

        const aiResponse = await geminiService.generateText(universalPrompt, {
          maxTokens: 4000,
          temperature: 0.7
        });

        framework = parseComprehensiveFrameworkResponse(aiResponse.text, universalConfig);
      }

      // Set the generated prompts
      setFrameworkPrompt(framework.prompts.framework);
      setPagePrompts(framework.prompts.pages);
      setLinkingPrompt(framework.prompts.linking);

      // Initialize sequential prompt delivery state
      setCompletedPrompts({
        framework: true,
        pages: new Array(framework.prompts.pages.length).fill(false),
        linking: false
      });

      // Add framework prompt to history
      setPromptHistory((prev: PromptHistoryItem[]) => [...prev, {
        type: 'framework',
        title: 'Project Framework',
        prompt: framework.prompts.framework,
        timestamp: new Date()
      }]);

      // Set focused prompt for sequential delivery
      setFocusedPrompt(framework.prompts.framework);
      setPromptStage('framework');

      // Set recommended tools from framework
      const toolsForRecommendation: BuilderTool[] = framework.builderTools.map((bt: any) => ({
        name: bt.tool.name,
        type: (wizardData.step1.appType === 'mobile-app' ? 'mobile' : 'web') as 'web' | 'mobile' | 'cross-platform',
        description: bt.tool.description,
        url: bt.tool.officialUrl,
        openUrl: bt.tool.officialUrl,
        icon: "🛠️",
        bestFor: bt.tool.bestFor
      }));
      setRecommendedBuilderTools(toolsForRecommendation);

      // Track successful framework generation
      const complexity = enhancedData.keyFeatures.length > 5 ? 'complex' :
                        enhancedData.keyFeatures.length > 2 ? 'medium' : 'simple';
      // analytics.trackFrameworkGeneration(
      //   wizardData.step1.appType,
      //   complexity,
      //   startTime,
      //   true
      // );

      // Track tool recommendations
      // analytics.trackToolRecommendation(
      //   wizardData.step1.appType,
      //   framework.builderTools.map((bt: any) => bt.tool.name)
      // );

      setPromptFlow('pages');
      toast({
        title: "🚀 Framework Generated!",
        description: `Created ${framework.pages.length} pages with ${framework.builderTools.length} tool recommendations. Ready for page-by-page prompts!`
      });
    } catch (error) {
      console.error("Framework generation error:", error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

      // Show user-friendly error message
      toast({
        title: "Framework Generation Failed",
        description: `Failed to generate framework: ${errorMessage}. Please try again.`,
        variant: "destructive"
      });

      // Track failed framework generation
      // analytics.trackFrameworkGeneration(
      //   wizardData.step1.appType,
      //   enhancedData.keyFeatures.length > 5 ? 'complex' :
      //   enhancedData.keyFeatures.length > 2 ? 'medium' : 'simple',
      //   startTime,
      //   false,
      //   errorMessage
      // );
    } finally {
      setIsGenerating(false);
    }
  };

  // Sequential prompt flow handlers
  const handleNextPrompt = () => {
    if (promptStage === 'framework') {
      // Move to first page prompt
      setPromptStage('page');
      setCurrentPageIndex(0);
      if (pagePrompts.length > 0 && pagePrompts[0]) {
        setFocusedPrompt(pagePrompts[0].prompt);
        // Add page prompt to history
        setPromptHistory((prev: PromptHistoryItem[]) => [...prev, {
          type: 'page',
          title: pagePrompts[0].pageName,
          prompt: pagePrompts[0].prompt,
          timestamp: new Date(),
          pageIndex: 0
        }]);
      } else {
        // No pages available, skip to linking
        setPromptStage('linking');
        setFocusedPrompt(linkingPrompt);
      }
    } else if (promptStage === 'page') {
      const nextPageIndex = currentPageIndex + 1;
      if (nextPageIndex < pagePrompts.length) {
        // Move to next page
        setCurrentPageIndex(nextPageIndex);
        setFocusedPrompt(pagePrompts[nextPageIndex].prompt);
        // Mark current page as completed
        const updatedCompleted = { ...completedPrompts };
        updatedCompleted.pages[currentPageIndex] = true;
        setCompletedPrompts(updatedCompleted);
        // Add page prompt to history
        setPromptHistory((prev: Array<{
          type: 'framework' | 'page' | 'linking';
          title: string;
          prompt: string;
          timestamp: Date;
          pageIndex?: number;
        }>) => [...prev, {
          type: 'page',
          title: pagePrompts[nextPageIndex].pageName,
          prompt: pagePrompts[nextPageIndex].prompt,
          timestamp: new Date(),
          pageIndex: nextPageIndex
        }]);
      } else {
        // Move to linking stage
        setPromptStage('linking');
        setFocusedPrompt(linkingPrompt);
        // Mark last page as completed
        const updatedCompleted = { ...completedPrompts };
        updatedCompleted.pages[currentPageIndex] = true;
        setCompletedPrompts(updatedCompleted);
        // Add linking prompt to history
        setPromptHistory((prev: PromptHistoryItem[]) => [...prev, {
          type: 'linking',
          title: 'Navigation & Linking',
          prompt: linkingPrompt,
          timestamp: new Date()
        }]);
      }
    } else if (promptStage === 'linking') {
      // Complete the flow
      setPromptStage('complete');
      const updatedCompleted = { ...completedPrompts };
      updatedCompleted.linking = true;
      setCompletedPrompts(updatedCompleted);
    }
  };

  const handlePreviousPrompt = () => {
    if (promptStage === 'page' && currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevPageIndex);
      setFocusedPrompt(pagePrompts[prevPageIndex].prompt);
    } else if (promptStage === 'page' && currentPageIndex === 0) {
      setPromptStage('framework');
      setFocusedPrompt(frameworkPrompt);
    } else if (promptStage === 'linking') {
      setPromptStage('page');
      setCurrentPageIndex(pagePrompts.length - 1);
      setFocusedPrompt(pagePrompts[pagePrompts.length - 1].prompt);
    }
  };

  const handleGeneratePagePrompt = async (pageIndex: number) => {
    const currentPage = pagePrompts[pageIndex];
    if (!currentPage) return;

    try {
      // Generate RAG-enhanced page prompt
      const ragResult = await generateRAGEnhancedPrompt({
        type: 'page',
        wizardData,
        selectedTool: wizardData.step2.selectedTool,
        additionalContext: {
          pageName: currentPage.pageName,
          pageData: {
            description: `UI design for ${currentPage.pageName}`,
            components: currentPage.components,
            layout: currentPage.layout
          }
        }
      });

      // Update the page prompt with RAG-enhanced version
      const updatedPrompts = [...pagePrompts];
      updatedPrompts[pageIndex] = {
        ...updatedPrompts[pageIndex],
        prompt: ragResult.prompt,
        generated: true
      };
      setPagePrompts(updatedPrompts);

      toast({
        title: "Enhanced Page Prompt Ready!",
        description: `RAG-enhanced UI prompt for ${currentPage.pageName} is ready to copy.`
      });
    } catch (error) {
      console.error('Failed to generate enhanced page prompt:', error);

      // Fallback to marking as generated
      const updatedPrompts = [...pagePrompts];
      updatedPrompts[pageIndex].generated = true;
      setPagePrompts(updatedPrompts);

      toast({
        title: "Page Prompt Ready!",
        description: `UI prompt for ${currentPage.pageName} is ready to copy.`,
        variant: "default"
      });
    }
  };

  const handleGenerateLinking = async () => {
    try {
      // Generate RAG-enhanced linking prompt
      const ragResult = await generateRAGEnhancedPrompt({
        type: 'linking',
        wizardData,
        selectedTool: wizardData.step2.selectedTool,
        additionalContext: {
          pageNames: pagePrompts.map(p => p.pageName)
        }
      });

      setLinkingPrompt(ragResult.prompt);
      setPromptFlow('linking');

      toast({
        title: "Enhanced Navigation Prompt Generated!",
        description: wizardData.step2.selectedTool
          ? `RAG-enhanced navigation prompt optimized for ${wizardData.step2.selectedTool} is ready.`
          : "Comprehensive navigation and linking prompt is ready."
      });
    } catch (error) {
      console.error('Failed to generate enhanced linking prompt:', error);

      // Fallback to basic linking prompt
      const basicPrompt = generateLinkingPrompt(pagePrompts.map(p => p.pageName), wizardData);
      setLinkingPrompt(basicPrompt);
      setPromptFlow('linking');

      toast({
        title: "Navigation Prompt Generated!",
        description: "Your navigation and linking prompt is ready."
      });
    }
  };

  const handleComplete = () => {
    const result: MVPAnalysisResult = {
      pages: pagePrompts.map((p: any) => ({
        name: p.pageName,
        description: `${p.pageName} page`,
        components: p.components,
        layout: p.layout
      })),
      navigation: { type: "sidebar", structure: pagePrompts.map((p: any) => ({ name: p.pageName })) },
      components: [],
      styling: {
        theme: wizardData.step2.theme,
        designStyle: wizardData.step2.designStyle,
        colorScheme: ["#000000", "#ffffff", "#22c55e"],
        typography: "Inter, sans-serif",
        spacing: "8px grid system"
      },
      recommendedTools: recommendedBuilderTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        pros: tool.bestFor,
        cons: [],
        bestFor: tool.bestFor,
        pricing: "freemium",
        url: tool.url,
        priority: 1
      })),
      uiPrompt: frameworkPrompt,
      launchPath: [],
      frameworkPrompt,
      pagePrompts,
      linkingPrompt,
      currentStep: 'complete'
    };

    onComplete(result);
    onClose();

    toast({
      title: "MVP Blueprint Complete!",
      description: "Your step-by-step prompts are ready to use with AI builders."
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard. Ready to paste into your AI builder!`
    });
  };

  const getCurrentPromptTitle = () => {
    if (promptStage === 'framework') return 'Project Framework';
    if (promptStage === 'page') {
      const currentPage = pagePrompts[currentPageIndex];
      return currentPage ? `${currentPage.pageName} UI` : 'Page UI';
    }
    if (promptStage === 'linking') return 'Navigation & Linking';
    return 'Complete';
  };

  const getCurrentPromptDescription = () => {
    if (promptStage === 'framework') return 'Copy this prompt to generate your app structure and page list';
    if (promptStage === 'page') return `Copy this prompt to generate the UI for ${pagePrompts[currentPageIndex]?.pageName || 'this page'}`;
    if (promptStage === 'linking') return 'Copy this prompt to generate navigation and routing logic';
    return 'All prompts generated successfully!';
  };

  const getRecommendedBuilderForCurrentPrompt = () => {
    if (recommendedBuilderTools.length === 0) return null;

    // Return the most suitable tool based on current stage
    if (promptStage === 'framework') {
      return recommendedBuilderTools.find(tool =>
        tool.name.toLowerCase().includes('framer') ||
        tool.name.toLowerCase().includes('figma')
      ) || recommendedBuilderTools[0];
    }

    if (promptStage === 'page') {
      return recommendedBuilderTools.find(tool =>
        tool.name.toLowerCase().includes('flutterflow') ||
        tool.name.toLowerCase().includes('framer')
      ) || recommendedBuilderTools[0];
    }

    return recommendedBuilderTools[0];
  };

  const openInBuilder = (tool: BuilderTool) => {
    if (tool.openUrl) {
      window.open(tool.openUrl, '_blank');
      toast({
        title: `Opening ${tool.name}`,
        description: "Paste your prompts to start building!"
      });
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.step1.appName.trim().length > 0 &&
               wizardData.step1.appType.length > 0;
      case 2:
        return wizardData.step2.theme.length > 0 &&
               wizardData.step2.designStyle.length > 0;
      case 3:
        return wizardData.step3.platforms.length > 0;
      case 4:
        return wizardData.step4.selectedAI.length > 0;
      case 5:
        return wizardData.userPrompt.trim().length > 20; // Minimum meaningful description
      default:
        return false;
    }
  };

  // Enhanced validation with helpful feedback
  const getStepValidationMessage = () => {
    switch (currentStep) {
      case 1:
        if (!wizardData.step1.appName.trim()) return "Please enter your app name";
        if (!wizardData.step1.appType) return "Please select an app type";
        return "";
      case 2:
        return "";
      case 3:
        if (wizardData.step3.platforms.length === 0) return "Please select at least one platform";
        return "";
      case 4:
        if (!wizardData.step4.selectedAI) return "Please select an AI engine";
        return "";
      case 5:
        if (wizardData.userPrompt.trim().length < 20) return "Please provide a more detailed description (at least 20 characters)";
        return "";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto workspace-card-solid">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {promptFlow === 'setup' ? (
              <div className="flex flex-col">
                <span>AI MVP Wizard</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {stepConfig[currentStep - 1]?.title} - Step {currentStep} of {totalSteps}
                </span>
              </div>
            ) : promptFlow === 'framework' ? 'Generate Project Framework' :
             promptFlow === 'pages' ? 'Generate Page UI Prompts' :
             promptFlow === 'linking' ? 'Generate Navigation & Linking' : 'MVP Blueprint Complete'}
          </DialogTitle>
          {promptFlow === 'setup' && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                {stepConfig[currentStep - 1]?.description}
              </p>
            </div>
          )}
        </DialogHeader>

        <div className="py-6">
          {/* Setup Flow */}
          {promptFlow === 'setup' && (
            <div>
          {/* Step 1: Project Foundation */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  {stepConfig[0].icon}
                  <h3 className="text-lg font-semibold ml-2">{stepConfig[0].title}</h3>
                </div>
                <p className="text-muted-foreground">{stepConfig[0].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="app-name" className="text-base font-medium">App Name *</Label>
                  <Input
                    id="app-name"
                    placeholder="e.g., TaskMaster, FoodieHub, StudyBuddy"
                    value={wizardData.step1.appName}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      step1: { ...wizardData.step1, appName: e.target.value }
                    })}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Choose a memorable name for your app</p>
                </div>

                <div>
                  <Label className="text-base font-medium">What type of app are you building? *</Label>
                  <RadioGroup
                    value={wizardData.step1.appType}
                    onValueChange={(value: AppType) => setWizardData({
                      ...wizardData,
                      step1: { ...wizardData.step1, appType: value }
                    })}
                    className="grid grid-cols-1 gap-3 mt-3"
                  >
                    {appTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={type.value} id={type.value} />
                        <Label htmlFor={type.value} className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {type.icon}
                          </div>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-sm text-muted-foreground">{type.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="app-description" className="text-base font-medium">Brief Description (Optional)</Label>
                  <Textarea
                    id="app-description"
                    placeholder="A quick summary of what your app does..."
                    value={enhancedData.description}
                    onChange={(e) => setEnhancedData({
                      ...enhancedData,
                      description: e.target.value
                    })}
                    className="mt-2"
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground mt-1">This helps us understand your app better</p>
                </div>

                {/* Validation message */}
                {getStepValidationMessage() && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {getStepValidationMessage()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Visual Identity */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  {stepConfig[1].icon}
                  <h3 className="text-lg font-semibold ml-2">{stepConfig[1].title}</h3>
                </div>
                <p className="text-muted-foreground">{stepConfig[1].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Theme Preference</Label>
                  <RadioGroup
                    value={wizardData.step2.theme}
                    onValueChange={(value: UITheme) => setWizardData({
                      ...wizardData,
                      step2: { ...wizardData.step2, theme: value }
                    })}
                    className="grid grid-cols-2 gap-4 mt-3"
                  >
                    {themes.map((theme) => (
                      <div key={theme.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={theme.value} id={`theme-${theme.value}`} />
                        <Label htmlFor={`theme-${theme.value}`} className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {theme.icon}
                          </div>
                          <div className="font-medium">{theme.label}</div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Design Style</Label>
                  <RadioGroup
                    value={wizardData.step2.designStyle}
                    onValueChange={(value: DesignStyle) => setWizardData({
                      ...wizardData,
                      step2: { ...wizardData.step2, designStyle: value }
                    })}
                    className="grid grid-cols-1 gap-3 mt-3"
                  >
                    {designStyles.map((style) => (
                      <div key={style.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value={style.value} id={`style-${style.value}`} />
                        <Label htmlFor={`style-${style.value}`} className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {style.icon}
                          </div>
                          <div>
                            <div className="font-medium">{style.label}</div>
                            <div className="text-sm text-muted-foreground">{style.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="color-preference" className="text-base font-medium">Color Preference (Optional)</Label>
                  <Input
                    id="color-preference"
                    placeholder="e.g., Blue and white, Warm earth tones, Vibrant and colorful"
                    value={enhancedData.colorPreference}
                    onChange={(e) => setEnhancedData({
                      ...enhancedData,
                      colorPreference: e.target.value
                    })}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Describe your preferred color scheme</p>
                </div>

                {/* RAG Tool Selection */}
                <div>
                  <Label className="text-base font-medium">Development Tool (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Choose a specific tool to optimize your prompts for. This will generate tool-specific instructions and best practices.
                  </p>

                  {/* RAG-Enhanced Recommendations */}
                  {ragRecommendations.length > 0 ? (
                    <div className="mb-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <Brain className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          AI-Powered Recommendations
                        </span>
                        <Badge variant="secondary" className="text-xs">RAG Enhanced</Badge>
                      </div>
                      <div className="space-y-2">
                        {ragRecommendations.map((rec, index) => (
                          <div
                            key={rec.tool.id}
                            className="flex items-center justify-between p-2 bg-white/50 dark:bg-gray-800/50 rounded-md hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors cursor-pointer"
                            onClick={() => setWizardData({
                              ...wizardData,
                              step2: { ...wizardData.step2, selectedTool: rec.tool.id }
                            })}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{rec.tool.icon}</span>
                                <div>
                                  <div className="font-medium text-sm">{rec.tool.name}</div>
                                  <div className="text-xs text-muted-foreground">{rec.reason}</div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-xs text-green-600 dark:text-green-400">
                                {Math.round(rec.confidence * 100)}% match
                              </div>
                              <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : filteredTools.length > 0 && (
                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Top Picks for {wizardData.step1.appType.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {filteredTools
                          .filter(tool => getToolRecommendationScore(tool, wizardData.step1.appType) >= 3)
                          .slice(0, 3)
                          .map(tool => (
                            <button
                              key={tool.id}
                              onClick={() => setWizardData({
                                ...wizardData,
                                step2: { ...wizardData.step2, selectedTool: tool.id }
                              })}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded-full text-xs text-blue-600 dark:text-blue-400 transition-colors"
                            >
                              <span>{tool.icon}</span>
                              <span>{tool.name}</span>
                            </button>
                          ))
                        }
                      </div>
                    </div>
                  )}



                  {filteredTools.length === 0 ? (
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground">
                        {availableTools.length === 0
                          ? "Loading development tools..."
                          : `No compatible tools found for ${wizardData.step1.appType.replace('-', ' ')}. ${availableTools.length} tools available but none match current criteria.`
                        }
                      </p>
                      {availableTools.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          You can still proceed - more tools may become available after selecting platforms in Step 3.
                        </p>
                      )}
                    </div>
                  ) : (
                    <RadioGroup
                      value={wizardData.step2.selectedTool || ""}
                      onValueChange={(value) => setWizardData({
                        ...wizardData,
                        step2: { ...wizardData.step2, selectedTool: value as RAGTool }
                      })}
                      className="grid grid-cols-1 gap-3"
                    >
                      {/* No tool selected option */}
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <RadioGroupItem value="" id="no-tool" />
                        <Label htmlFor="no-tool" className="flex items-center gap-3 cursor-pointer flex-1">
                          <div className="p-2 bg-gray-500/10 rounded-md">
                            <Zap className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <div className="font-medium">No Specific Tool</div>
                            <div className="text-sm text-muted-foreground">Generate general prompts that work with any tool</div>
                          </div>
                        </Label>
                      </div>

                      {/* Available RAG tools */}
                      {filteredTools.map((tool) => {
                        const isRecommended = getToolRecommendationScore(tool, wizardData.step1.appType) >= 3;
                        return (
                          <div
                            key={tool.id}
                            className={`flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors relative ${
                              isRecommended ? 'border-green-500/30 bg-green-500/5' : ''
                            }`}
                          >
                            {isRecommended && (
                              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                Recommended
                              </div>
                            )}
                            <RadioGroupItem value={tool.id} id={`tool-${tool.id}`} />
                            <Label htmlFor={`tool-${tool.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                              <div className="p-2 bg-primary/10 rounded-md">
                                <span className="text-lg">{tool.icon}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium">{tool.name}</div>
                                  {isRecommended && (
                                    <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                                      ⭐ Recommended
                                    </Badge>
                                  )}
                                  <Badge variant="outline" className="text-xs">
                                    {tool.category}
                                  </Badge>
                                  <Badge variant="secondary" className="text-xs">
                                    {tool.complexity}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">{tool.description}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Best for: {tool.bestFor.slice(0, 3).join(', ')}
                                  {tool.bestFor.length > 3 && ` +${tool.bestFor.length - 3} more`}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                  <span className="px-2 py-1 bg-muted/50 rounded text-xs">
                                    {tool.pricing}
                                  </span>
                                  <a
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 flex items-center gap-1"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <ExternalLink className="h-3 w-3" />
                                    Learn more
                                  </a>
                                </div>
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  )}

                  {wizardData.step2.selectedTool && (
                    <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Tool Selected: {filteredTools.find(t => t.id === wizardData.step2.selectedTool)?.name}
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        Your prompts will be optimized with tool-specific documentation, best practices, and constraints.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Platform Strategy */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  {stepConfig[2].icon}
                  <h3 className="text-lg font-semibold ml-2">{stepConfig[2].title}</h3>
                </div>
                <p className="text-muted-foreground">{stepConfig[2].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Where will your app be available? *</Label>
                  <p className="text-sm text-muted-foreground mb-3">Select all platforms you want to target</p>
                  <div className="grid grid-cols-1 gap-3">
                    {platforms.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={`platform-${platform.value}`}
                          checked={wizardData.step3.platforms.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            const currentPlatforms = wizardData.step3.platforms;
                            const newPlatforms = checked
                              ? [...currentPlatforms, platform.value]
                              : currentPlatforms.filter(p => p !== platform.value);
                            setWizardData({
                              ...wizardData,
                              step3: { ...wizardData.step3, platforms: newPlatforms }
                            });
                          }}
                        />
                        <Label htmlFor={`platform-${platform.value}`} className="cursor-pointer flex-1">
                          <div>
                            <div className="font-medium">{platform.label}</div>
                            <div className="text-sm text-muted-foreground">{platform.description}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="target-audience" className="text-base font-medium">Target Audience (Optional)</Label>
                  <Input
                    id="target-audience"
                    placeholder="e.g., Small business owners, College students, Fitness enthusiasts"
                    value={enhancedData.targetAudience}
                    onChange={(e) => setEnhancedData({
                      ...enhancedData,
                      targetAudience: e.target.value
                    })}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Who is your primary user?</p>
                </div>

                {/* Validation message */}
                {getStepValidationMessage() && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {getStepValidationMessage()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: AI Engine Setup */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  {stepConfig[3].icon}
                  <h3 className="text-lg font-semibold ml-2">{stepConfig[3].title}</h3>
                </div>
                <p className="text-muted-foreground">{stepConfig[3].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Choose your AI assistant *</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Select the AI engine that will generate your MVP blueprint
                  </p>
                  <RadioGroup
                    value={wizardData.step4.selectedAI}
                    onValueChange={(value) => setWizardData({
                      ...wizardData,
                      step4: { ...wizardData.step4, selectedAI: value }
                    })}
                    className="grid grid-cols-1 gap-3"
                  >
                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="openai" id="ai-openai" />
                      <Label htmlFor="ai-openai" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <div className="font-medium">OpenAI GPT-4</div>
                          <div className="text-sm text-muted-foreground">Most versatile for MVP planning and creative solutions</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="gemini" id="ai-gemini" />
                      <Label htmlFor="ai-gemini" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">Google Gemini</div>
                          <div className="text-sm text-muted-foreground">Great for technical analysis and data processing</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="claude" id="ai-claude" />
                      <Label htmlFor="ai-claude" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium">Claude</div>
                          <div className="text-sm text-muted-foreground">Excellent for detailed planning and thorough analysis</div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="deepseek" id="ai-deepseek" />
                      <Label htmlFor="ai-deepseek" className="flex items-center gap-3 cursor-pointer flex-1">
                        <div className="h-10 w-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                          <Brain className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                          <div className="font-medium">DeepSeek</div>
                          <div className="text-sm text-muted-foreground">Cost-effective option with strong coding capabilities</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Prompt Style</Label>
                  <RadioGroup
                    value={enhancedData.promptStyle}
                    onValueChange={(value) => setEnhancedData({
                      ...enhancedData,
                      promptStyle: value
                    })}
                    className="grid grid-cols-2 gap-3 mt-3"
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="detailed" id="style-detailed" />
                      <Label htmlFor="style-detailed" className="cursor-pointer">
                        <div className="font-medium">Detailed</div>
                        <div className="text-xs text-muted-foreground">Comprehensive prompts</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="concise" id="style-concise" />
                      <Label htmlFor="style-concise" className="cursor-pointer">
                        <div className="font-medium">Concise</div>
                        <div className="text-xs text-muted-foreground">Brief, focused prompts</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 Don't have an API key? Configure your AI providers in{" "}
                    <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400 underline">
                      Settings → AI Engine
                    </Button>
                  </p>
                </div>

                {/* Validation message */}
                {getStepValidationMessage() && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {getStepValidationMessage()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Vision & Requirements */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center mb-3">
                  {stepConfig[4].icon}
                  <h3 className="text-lg font-semibold ml-2">{stepConfig[4].title}</h3>
                </div>
                <p className="text-muted-foreground">{stepConfig[4].description}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="user-prompt" className="text-base font-medium">Describe your app vision *</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Tell us about your app idea. Be as detailed as possible - what problem does it solve, who are your users, what features do you need?
                  </p>
                  <Textarea
                    id="user-prompt"
                    placeholder="I want to build a meal planning app that helps busy professionals plan their weekly meals, track nutrition, and generate shopping lists. The app should have a clean interface where users can browse recipes, save favorites, and get personalized recommendations based on dietary preferences..."
                    value={wizardData.userPrompt}
                    onChange={(e) => setWizardData({
                      ...wizardData,
                      userPrompt: e.target.value
                    })}
                    className="min-h-[150px]"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      {wizardData.userPrompt.length}/500 characters
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {wizardData.userPrompt.length < 20 ? 'Need more detail' : 'Good detail level'}
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="key-features" className="text-base font-medium">Key Features (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    List the most important features for your MVP
                  </p>
                  <Input
                    id="key-features"
                    placeholder="e.g., User login, Recipe search, Shopping list, Meal calendar"
                    value={enhancedData.keyFeatures.join(', ')}
                    onChange={(e) => setEnhancedData({
                      ...enhancedData,
                      keyFeatures: e.target.value.split(',').map(f => f.trim()).filter(f => f.length > 0)
                    })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="target-users" className="text-base font-medium">Target Users (Optional)</Label>
                  <Input
                    id="target-users"
                    placeholder="e.g., Busy professionals aged 25-40, Health-conscious individuals"
                    value={enhancedData.targetUsers}
                    onChange={(e) => setEnhancedData({
                      ...enhancedData,
                      targetUsers: e.target.value
                    })}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Who will use your app?</p>
                </div>

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    What happens next:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Step 1: Generate project framework & page structure</li>
                    <li>• Step 2: Create UI prompts for each page individually</li>
                    <li>• Step 3: Generate navigation & linking prompts</li>
                    <li>• Step 4: Get AI tool recommendations with direct links</li>
                    <li>• Copy-paste each prompt into your chosen AI builder</li>
                  </ul>
                </div>

                {/* Validation message */}
                {getStepValidationMessage() && (
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      {getStepValidationMessage()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
            </div>
          )}

          {/* Sequential Prompt Delivery Flow */}
          {promptFlow === 'framework' && (
            <div className="space-y-6">
              {!frameworkPrompt ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold mb-2">Generate Your MVP Framework</h3>
                    <p className="text-muted-foreground mb-6">
                      Let's start with the foundation. We'll generate prompts one by one, so you can focus on each step.
                    </p>
                  </div>

                  <div className="text-center">
                    <Button
                      onClick={handleGenerateFramework}
                      disabled={isGenerating}
                      size="lg"
                      className="w-full max-w-md"
                    >
                      {isGenerating ? (
                        <>
                          <Brain className="h-4 w-4 mr-2 animate-spin" />
                          Generating Framework...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Start Sequential Prompt Flow
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Sequential Prompt Display */}
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Step-by-Step Prompt Flow</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{getCurrentPromptTitle()}</h3>
                    <p className="text-muted-foreground mb-6">
                      {getCurrentPromptDescription()}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className={`w-3 h-3 rounded-full ${promptStage === 'framework' ? 'bg-primary' : completedPrompts.framework ? 'bg-green-500' : 'bg-muted'}`} />
                    <div className="w-8 h-0.5 bg-muted" />
                    <div className={`w-3 h-3 rounded-full ${promptStage === 'page' ? 'bg-primary' : completedPrompts.pages.some(p => p) ? 'bg-green-500' : 'bg-muted'}`} />
                    <div className="w-8 h-0.5 bg-muted" />
                    <div className={`w-3 h-3 rounded-full ${promptStage === 'linking' ? 'bg-primary' : completedPrompts.linking ? 'bg-green-500' : 'bg-muted'}`} />
                  </div>

                  {/* Current Prompt Display */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Prompt Ready!
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(focusedPrompt, getCurrentPromptTitle())}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Prompt
                        </Button>
                        {getRecommendedBuilderForCurrentPrompt() && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(getRecommendedBuilderForCurrentPrompt()?.url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open {getRecommendedBuilderForCurrentPrompt()?.name}
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto border">
                      {focusedPrompt}
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={handlePreviousPrompt}
                        disabled={promptStage === 'framework'}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>

                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          {promptStage === 'framework' && 'Framework Structure'}
                          {promptStage === 'page' && `Page ${currentPageIndex + 1} of ${pagePrompts.length}`}
                          {promptStage === 'linking' && 'Navigation & Routing'}
                          {promptStage === 'complete' && 'All Done!'}
                        </p>
                      </div>

                      <Button
                        onClick={handleNextPrompt}
                        disabled={promptStage === 'complete'}
                      >
                        {promptStage === 'linking' ? 'Complete' : 'Next'}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pages Generation Flow */}
          {promptFlow === 'pages' && generatedFramework && (
            <PagePromptGenerator
              pagePrompts={pagePrompts}
              builderTools={generatedFramework.builderTools}
              currentPageIndex={currentPageIndex}
              onPageChange={setCurrentPageIndex}
              onPromptUpdate={(index, prompt) => {
                const updatedPrompts = [...pagePrompts];
                updatedPrompts[index] = { ...updatedPrompts[index], prompt };
                setPagePrompts(updatedPrompts);
              }}
              onComplete={handleGenerateLinking}
            />
          )}

          {/* Linking Generation Flow */}
          {promptFlow === 'linking' && (
            <div className="space-y-6">
              <div className="text-center">
                <Link className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Navigation & Linking</h3>
                <p className="text-muted-foreground mb-6">
                  Connect all your pages with navigation and routing logic.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Linking Prompt Ready!</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(linkingPrompt, "Linking prompt")}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Prompt
                  </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm max-h-40 overflow-y-auto">
                  {linkingPrompt}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">🚀 Recommended AI Builder Tools</h4>
                  <div className="grid gap-3">
                    {recommendedTools.map((tool, index) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{tool.icon}</span>
                            <div>
                              <h5 className="font-medium">{tool.name}</h5>
                              <p className="text-sm text-muted-foreground">{tool.description}</p>
                              <div className="flex gap-1 mt-1">
                                {tool.bestFor.map((tag, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(tool.url, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Learn More
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => openInBuilder(tool)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Open Builder
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button onClick={() => setPromptFlow('complete')} size="lg">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Complete MVP Blueprint
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Complete Flow - Enhanced Summary */}
          {(promptFlow === 'complete' || promptStage === 'complete') && generatedFramework && (
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-semibold mb-2">MVP Blueprint Complete!</h3>
                <p className="text-muted-foreground mb-6">
                  All your prompts are ready! You can now build your MVP using AI builders.
                </p>
              </div>

              {/* Prompt Summary */}
              <div className="space-y-4">
                <h4 className="font-medium">📋 Your Generated Prompts:</h4>

                <div className="grid gap-3">
                  {promptHistory.map((prompt, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium">{prompt.title}</h5>
                          <p className="text-sm text-muted-foreground">
                            {prompt.type === 'framework' && '🏗️ App Structure & Pages'}
                            {prompt.type === 'page' && `🎨 UI Design for ${prompt.title}`}
                            {prompt.type === 'linking' && '🔗 Navigation & Routing'}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(prompt.prompt, prompt.title)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Export System */}
              <ExportablePromptsSystem
                framework={generatedFramework}
                pagePrompts={pagePrompts}
                linkingPrompt={linkingPrompt}
                appName={wizardData.step1.appName}
              />
            </div>
          )}

          {/* Setup Navigation buttons */}
          {promptFlow === 'setup' && (
            <div className="pt-6 border-t">
              {/* Step indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-2">
                  {stepConfig.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                        currentStep === step.id
                          ? 'bg-primary text-primary-foreground'
                          : currentStep > step.id
                            ? 'bg-green-500 text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {currentStep > step.id ? <CheckCircle2 className="h-4 w-4" /> : step.id}
                      </div>
                      {index < stepConfig.length - 1 && (
                        <div className={`w-8 h-0.5 mx-2 transition-colors ${
                          currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stepConfig[currentStep - 1]?.title}
                  </p>
                </div>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed() || isGenerating}
                  className="flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : currentStep === totalSteps ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Start AI Generation
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MVPWizard;
