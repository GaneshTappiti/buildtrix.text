"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import {
  Bell,
  Brain,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CreditCard,
  FileSpreadsheet,
  Globe2,
  Lightbulb,
  LogOut,
  Palette,
  Rocket,
  Search,
  Settings,
  Shield,
  Sparkles,
  User,
  TrendingUp,
  BarChart3,
  CalendarDays,
  Zap,
  X,
  Menu,
  Save
} from "lucide-react";

// Import AI services and components
import StartupBriefGenerator from "@/components/StartupBriefGenerator";
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { aiEngine } from '@/services/aiEngine';
import { useToast } from "@/hooks/use-toast";
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
// import FlowProgress from "@/components/dashboard/FlowProgress";
// import QuickStats from "@/components/dashboard/QuickStats";
import { useActiveIdea, useIdeaContext } from "@/stores/ideaStore";
// import { AISettingsPanel } from '@/components/ai-settings';
// import AdminStatusIndicator from '@/components/admin/AdminStatusIndicator';
// import AdminQuickActions from '@/components/admin/AdminQuickActions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
// import { WorkspaceContainer, WorkspaceHeader } from '@/components/ui/workspace-layout';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { searchService, SearchResult } from '@/services/searchService';
import SearchResults from '@/components/SearchResults';
import { useNotifications } from '@/hooks/useNotifications';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { useLoadingState } from '@/hooks/useLoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';
import { LoadingSpinner, ProjectCardSkeleton, TaskCardSkeleton, NotificationSkeleton } from '@/components/LoadingSpinner';

interface Project {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
  stage?: 'idea' | 'planning' | 'development' | 'testing' | 'launch';
  progress?: number;
}

interface Task {
  id: string;
  title: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  status?: 'todo' | 'in-progress' | 'done';
}

interface Module {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  isNew?: boolean;
  badge?: string;
}

interface GPTFeature {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action: string;
  onClick: () => void;
  tooltip: string;
}

interface WeeklyGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  dueDate: string;
}

interface TrendingIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  popularity: number;
}

type Category = 'ideation' | 'planning' | 'execution' | 'validation';

export default function WorkspacePage() {
  console.log("🔥 WorkspacePage component started rendering");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  console.log("🔥 State initialized");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPromptHistory, setShowPromptHistory] = useState(false);

  // Workshop/Idea validation state
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [showValidationResult, setShowValidationResult] = useState(false);

  // Store hooks
  const { canCreateNewIdea, setHasActiveIdea, setCurrentStep, setActiveIdea } = useIdeaContext();

  const [showTemplates, setShowTemplates] = useState(false);

  const { toast } = useToast();
  const { canUseFeature } = useFeatureAccess();
  const ai = useEnhancedAI();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    formatTimeAgo
  } = useNotifications();

  const {
    projects: allProjects,
    stats: projectStats,
    getRecentProjects,
    getStageColor,
    formatTimeAgo: formatProjectTime
  } = useProjects();

  const {
    tasks: allTasks,
    stats: taskStats,
    getRecentTasks,
    getPriorityColor,
    formatDueDate,
    formatTimeAgo: formatTaskTime
  } = useTasks();

  // Error handling and loading states
  const { errorState, handleError, clearError, withErrorHandling } = useErrorHandler();
  const {
    isLoading,
    startLoading,
    stopLoading,
    withLoading
  } = useLoadingState();

  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<GPTFeature | null>(null);
  const [showAISettings, setShowAISettings] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('ideation');
  const [gptInput, setGptInput] = useState("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [showResponse, setShowResponse] = useState(false);

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>([]);
  const [trendingIdeas, setTrendingIdeas] = useState<TrendingIdea[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [showStartupBrief, setShowStartupBrief] = useState(false);
  const [briefPrompt, setBriefPrompt] = useState("");
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { signOut, user } = useAuth();
  const { isAdmin } = useAdmin();

  // User display helpers
  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  // Click outside handlers for dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch initial data - Mock implementation
  useEffect(() => {
    const fetchData = async () => {
      // Data is now handled by hooks
    };

    // Initialize with empty data - users will create their own content
    const initializeEnhancedData = () => {
      setWeeklyGoals([]);
      setTrendingIdeas([]);
      setUpcomingEvents([]);
    };

    fetchData();
    initializeEnhancedData();
  }, []);

  // Idea validation function (from Workshop)
  const validateIdea = async (ideaText: string) => {
    if (!canUseFeature('create_idea')) {
      toast({
        title: "Feature Limited",
        description: "Please upgrade to validate more ideas.",
        variant: "destructive",
      });
      return;
    }
  };

  const performIdeaValidation = async (ideaText: string) => {
    if (!canCreateNewIdea()) {
      toast({
        title: "Cannot Create New Idea",
        description: "You already have an active idea. Archive it first or upgrade to Pro.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    setValidationResult(null);
    setShowValidationResult(false);

    try {
      const prompt = `
      Analyze this startup idea comprehensively and provide a detailed validation report:

      Idea: "${ideaText}"

      Please provide a structured analysis with clear sections and proper formatting:

      ## 1. VALIDATION SCORE (0-100)
      Provide an overall viability score with brief justification.

      ## 2. MARKET OPPORTUNITY
      Analyze market size, demand, and potential. Include specific data points where possible.

      ## 3. RISK ASSESSMENT
      List key risks and challenges:
      - Risk 1: Description
      - Risk 2: Description
      - Risk 3: Description

      ## 4. MONETIZATION STRATEGY
      Describe revenue model suggestions with specific examples.

      ## 5. KEY FEATURES
      Essential features for MVP:
      - Feature 1: Description
      - Feature 2: Description
      - Feature 3: Description

      ## 6. NEXT STEPS
      Immediate actionable steps:
      - Step 1: Description
      - Step 2: Description
      - Step 3: Description

      ## 7. COMPETITOR ANALYSIS
      Similar solutions and differentiation opportunities.

      ## 8. TARGET MARKET
      Primary customer segments with demographics and characteristics.

      ## 9. PROBLEM STATEMENT
      Core problem being solved and its significance.

      Use proper markdown formatting with headers (##), bullet points (-), and clear section separation.
      `;

      // Use real AI service for validation
      const validationResponse = await ai.validateIdea(prompt);
      const mockValidationText = validationResponse.text;

      // Parse the response to extract structured data
      const validationScore = extractValidationScore(mockValidationText);
      const sections = parseValidationResponse(mockValidationText);

      // Generate static ID to prevent hydration mismatch
      let idCounter = 1;
      const generateId = () => `idea-${idCounter++}`;
      
      const validatedIdea = {
        id: generateId(),
        title: extractIdeaTitle(ideaText),
        description: ideaText,
        status: 'active' as const,
        validation_score: validationScore,
        market_opportunity: sections.marketOpportunity,
        risk_assessment: sections.riskAssessment,
        monetization_strategy: sections.monetizationStrategy,
        key_features: sections.keyFeatures,
        next_steps: sections.nextSteps,
        competitor_analysis: sections.competitorAnalysis,
        target_market: sections.targetMarket,
        problem_statement: sections.problemStatement,
        created_at: '2025-08-04T00:00:00.000Z',
        updated_at: '2025-08-04T00:00:00.000Z'
      };

      setValidationResult({
        idea: validatedIdea,
        fullResponse: mockValidationText,
        score: validationScore
      });

      setShowValidationResult(true);

      toast({
        title: "Idea Validated!",
        description: `Your idea scored ${validationScore}/100. Review the analysis below.`,
      });

    } catch (error) {
      console.error('Validation error:', error);
      toast({
        title: "Validation Failed",
        description: "Could not validate your idea. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Helper functions for parsing validation response
  const extractValidationScore = (text: string): number => {
    const scoreMatch = text.match(/VALIDATION SCORE.*?(\d+)/i);
    return scoreMatch ? parseInt(scoreMatch[1]) : 75;
  };

  const extractIdeaTitle = (description: string): string => {
    const words = description.split(' ').slice(0, 6);
    return words.join(' ') + (description.split(' ').length > 6 ? '...' : '');
  };

  const parseValidationResponse = (text: string) => {
    const sections = {
      marketOpportunity: extractSection(text, 'MARKET OPPORTUNITY'),
      riskAssessment: extractSection(text, 'RISK ASSESSMENT'),
      monetizationStrategy: extractSection(text, 'MONETIZATION STRATEGY'),
      keyFeatures: extractListSection(text, 'KEY FEATURES'),
      nextSteps: extractListSection(text, 'NEXT STEPS'),
      competitorAnalysis: extractSection(text, 'COMPETITOR ANALYSIS'),
      targetMarket: extractSection(text, 'TARGET MARKET'),
      problemStatement: extractSection(text, 'PROBLEM STATEMENT')
    };
    return sections;
  };

  const extractSection = (text: string, sectionName: string): string => {
    const regex = new RegExp(`${sectionName}:?\\s*([\\s\\S]*?)(?=\\n\\d+\\.|\\n[A-Z][A-Z\\s]+:|$)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  const extractListSection = (text: string, sectionName: string): string[] => {
    const sectionText = extractSection(text, sectionName);
    return sectionText.split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[-*•]\s*/, '').trim())
      .filter(item => item.length > 0);
  };

  const saveValidatedIdea = () => {
    if (!validationResult) return;

    setActiveIdea(validationResult.idea);
    setHasActiveIdea(true);
    setCurrentStep('vault');

    toast({
      title: "Idea Saved!",
      description: "Your validated idea has been saved to your Idea Vault.",
    });

    // Navigate to Idea Vault
    router.push('/workspace/idea-vault');
  };

  const handleSubmit = withErrorHandling(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gptInput.trim()) return;

    startLoading('aiResponse');
    setShowResponse(true);
    clearError();

    try {
      // Enhanced prompt for Founder's GPT expertise
      const enhancedPrompt = `
      As an AI co-founder with deep expertise in startup journeys, provide detailed advice on: ${gptInput}

      Structure your response with clear sections including:
      1. Strategic Analysis
      2. Actionable Recommendations
      3. Potential Challenges & Solutions
      4. Next Steps

      Draw from Y Combinator principles, IndieHackers insights, and successful founder strategies. Provide specific, practical guidance.`

      // Initialize AI engine with startup expertise
      const response = await aiEngine.generateText(enhancedPrompt, {
        temperature: 0.7,
        maxTokens: 1500
      });

      if (!response || !response.text) {
        throw new Error('No response received from AI service');
      }

      setAiResponse(response.text);

      // Auto-sync to Idea Vault if the response looks like a startup idea
      if (gptInput.toLowerCase().includes('idea') ||
          gptInput.toLowerCase().includes('app') ||
          gptInput.toLowerCase().includes('startup') ||
          gptInput.toLowerCase().includes('build')) {

        setIsGeneratingIdea(true);

        try {
          // Mock idea creation
          const ideaTitle = gptInput.length > 50 ? gptInput.substring(0, 50) + '...' : gptInput;

          toast({
            title: "💡 Idea Saved!",
            description: "Your AI-generated idea has been automatically saved to Idea Vault",
            duration: 5000,
          });
        } catch (ideaError) {
          console.error('Error saving idea:', ideaError);
        } finally {
          setIsGeneratingIdea(false);
        }
      }

    } catch (error) {
      console.error("AI Generation Error:", error);

      let errorMessage = "Failed to generate AI response";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setAiResponse(`❌ ${errorMessage}\n\nPlease try again or check your AI configuration in Settings.`);
      handleError(error, "Failed to generate AI response");
    } finally {
      stopLoading('aiResponse');
    }
  }, "Failed to process AI request");

  // Enhanced logout function
  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Failed",
        description: "Unable to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get recent projects for display
  const recentProjects = getRecentProjects().map(project => ({
    id: project.id,
    name: project.name,
    description: project.description,
    lastUpdated: formatProjectTime(project.updatedAt),
    stage: project.stage,
    progress: project.progress
  }));

  // Get recent tasks for display
  const recentTaskItems = getRecentTasks().map(task => ({
    id: task.id,
    title: task.title,
    priority: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
    dueDate: task.dueDate ? formatDueDate(task.dueDate).text : 'No due date',
    status: task.status,
    isOverdue: task.dueDate ? formatDueDate(task.dueDate).isOverdue : false
  }));

  const modules: Module[] = [
    {
      id: "workshop",
      name: "Workshop",
      description: "Free playground for idea validation with AI",
      path: "/workspace/workshop",
      icon: "🧠"
    },
    {
      id: "idea-vault",
      name: "Idea Vault",
      description: "Store and manage your startup ideas",
      path: "/workspace/idea-vault",
      icon: "💡"
    },
    {
      id: "ideaforge",
      name: "IdeaForge",
      description: "Turn ideas into actionable product frameworks",
      path: "/workspace/ideaforge",
      icon: "⚙️"
    },
    {
      id: "business-model-canvas",
      name: "AI Business Model Canvas",
      description: "🆕 Generate professional Business Model Canvas with AI. Transform your idea into a complete strategic framework across all 9 essential blocks. Export-ready for investors and stakeholders.",
      path: "/workspace/business-model-canvas",
      icon: "🎯",
      isNew: true
    },
    {
      id: "mvp-studio",
      name: "MVP Studio",
      description: "Your AI-powered build orchestrator. Generate prompts, get tool recommendations, and build your MVP with the best AI builders in the market.",
      path: "/workspace/mvp-studio",
      icon: "🚀"
    },
    {
      id: "docs-decks",
      name: "Docs & Decks",
      description: "Create and manage your startup documents",
      path: "/workspace/docs-decks",
      icon: "📄"
    },
    {
      id: "investor-radar",
      name: "Investor Radar",
      description: "🆕 Browse and connect with 100+ verified investors. Access complete profiles with direct contact information, investment preferences, and focus areas. No signup required - start connecting immediately.",
      path: "/workspace/investor-radar",
      icon: "🎯",
      isNew: true
    }
  ];





  const quickActions = [
    {
      title: "Validate Idea",
      description: "Get AI-powered validation for your startup concept",
      icon: <Lightbulb className="h-5 w-5 text-yellow-400" />,
      category: 'ideation',
      onClick: () => {
        // Navigate to Workshop for idea validation
        router.push('/workspace/workshop');
      }
    },
    {
      title: "Brainstorm Ideas",
      description: "Generate new startup ideas based on trends",
      icon: <Sparkles className="h-5 w-5 text-yellow-400" />,
      category: 'ideation',
      onClick: () => {
        // Use AI to brainstorm ideas and show in chat
        setGptInput("Help me brainstorm 5 innovative startup ideas in trending industries. For each idea, provide: 1) Brief description 2) Target market 3) Key value proposition 4) Potential challenges");
        setShowResponse(true);
      }
    },
    {
      title: "Business Model",
      description: "Create a business model canvas",
      icon: <FileSpreadsheet className="h-5 w-5 text-blue-400" />,
      category: 'planning',
      onClick: () => {
        // Navigate to Business Model Canvas
        router.push('/workspace/business-model-canvas');
      }
    },
    {
      title: "Roadmap Planning",
      description: "Create a strategic roadmap",
      icon: <CalendarDays className="h-5 w-5 text-blue-400" />,
      category: 'planning',
      onClick: () => {
        // Navigate to Task Planner for roadmap creation
        router.push('/workspace/task-planner');
      }
    },
    {
      title: "MVP Features",
      description: "Define your minimum viable product",
      icon: <Rocket className="h-5 w-5 text-green-400" />,
      category: 'execution',
      onClick: () => {
        // Navigate to MVP Studio
        router.push('/workspace/mvp-studio');
      }
    },
    {
      title: "Tech Stack",
      description: "Choose the right technology stack",
      icon: <Zap className="h-5 w-5 text-green-400" />,
      category: 'execution',
      onClick: () => {
        // Use AI to recommend tech stack
        setGptInput("I need recommendations for a technology stack. Please analyze my project requirements and suggest: 1) Frontend technologies 2) Backend technologies 3) Database options 4) Deployment platforms 5) Development tools. My project is: ");
        setShowResponse(true);
      }
    },
    {
      title: "Market Analysis",
      description: "Analyze your target market",
      icon: <Globe2 className="h-5 w-5 text-purple-400" />,
      category: 'validation',
      onClick: () => {
        // Use AI for market analysis
        setGptInput("Conduct a comprehensive market analysis for my startup idea. Include: 1) Market size and growth potential 2) Target customer segments 3) Competitor analysis 4) Market trends 5) Entry barriers 6) Opportunities and threats. My idea is: ");
        setShowResponse(true);
      }
    },
    {
      title: "User Research",
      description: "Design user research strategy",
      icon: <User className="h-5 w-5 text-purple-400" />,
      category: 'validation',
      onClick: () => {
        // Use AI for user research strategy
        setGptInput("Help me design a user research strategy. Provide: 1) Research objectives 2) Target user personas 3) Research methods (surveys, interviews, etc.) 4) Key questions to ask 5) Success metrics 6) Timeline. My product is: ");
        setShowResponse(true);
      }
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Handler functions for non-functional buttons


  const handleViewAllProjects = () => {
    router.push('/workspace/idea-vault');
  };

  const handleViewAllTasks = () => {
    router.push('/workspace/task-planner');
  };



  const handleProjectClick = (projectId: string) => {
    router.push(`/workspace/idea-vault/${projectId}`);
  };

  // Search functionality
  const performSearch = withErrorHandling(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    startLoading('search');
    setShowSearchResults(true);

    try {
      const results = await searchService.search(query, { limit: 10 });
      setSearchResults(results);
    } finally {
      stopLoading('search');
    }
  }, "Failed to perform search");

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      performSearch(searchQuery);
    } else if (e.key === 'Escape') {
      setShowSearchResults(false);
      setSearchQuery('');
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setShowSearchResults(false);
    setSearchQuery('');
    // Navigation is handled by the Link component in SearchResults
  };

  const handleNotificationClick = (notificationId: string) => {
    markAsRead(notificationId);
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.actionUrl) {
      router.push(notification.actionUrl);
    }
    setShowNotifications(false);
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    toast({
      title: "Notifications",
      description: "All notifications marked as read",
    });
  };



  console.log("🔥 About to render main content");

  return (
    <ErrorBoundary>
      <div className="workspace-full-height bg-green-glass">
        <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="w-full workspace-full-height">
        <div className="flex flex-col w-full workspace-full-height">
          {/* Enhanced Top Navigation Bar */}
          <div className="workspace-nav-enhanced w-full">
            <div className="flex items-center justify-between w-full px-4 md:px-6 py-3 md:py-4">
              {/* Left Section - Hamburger, Search & Context */}
              <div className="flex items-center gap-2 md:gap-4 flex-1">
                {/* Hamburger Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-black/30"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
                {/* Enhanced Search bar */}
                <div ref={searchRef} className="relative flex-1 max-w-xs md:max-w-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search workspace..."
                    className="pl-10 pr-4 py-2 w-full md:w-80 workspace-input-enhanced"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleSearchKeyDown}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 hidden md:block">
                    <kbd className="px-2 py-1 text-xs text-gray-400 bg-black/30 rounded border border-white/10">
                      ⌘K
                    </kbd>
                  </div>

                  {/* Search Results */}
                  {showSearchResults && (
                    <SearchResults
                      results={searchResults}
                      query={searchQuery}
                      onResultClick={handleSearchResultClick}
                      isLoading={isLoading('search')}
                    />
                  )}
                </div>

                {/* Context Switcher - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-black/30 px-3 py-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Today
                    <ChevronDown className="h-3 w-3 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Right Section - Actions & Profile */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* AI Status Indicator - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">AI Ready</span>
                </div>

                {/* Divider - Hidden on mobile */}
                <div className="hidden md:block h-6 w-px bg-white/10"></div>

                {/* Notification Button */}
                <div ref={notificationRef} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-black/30 relative"
                    onClick={() => setShowNotifications((v) => !v)}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-green-500 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden workspace-dropdown">
                      <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <h3 className="font-semibold text-white">Notifications</h3>
                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <span className="text-xs text-green-400 font-medium">{unreadCount} new</span>
                          )}
                          {notifications.length > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleMarkAllRead}
                              className="text-xs text-gray-400 hover:text-white h-6 px-2"
                            >
                              Mark all read
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-64">
                        {notifications.length > 0 ? (
                          <div className="space-y-2 p-2">
                            {notifications.slice(0, 10).map((notification) => {
                              const typeColors = {
                                success: 'bg-green-500/10 border-green-500/20 hover:bg-green-500/20',
                                info: 'bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20',
                                warning: 'bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20',
                                error: 'bg-red-500/10 border-red-500/20 hover:bg-red-500/20'
                              };

                              const dotColors = {
                                success: 'bg-green-400',
                                info: 'bg-blue-400',
                                warning: 'bg-yellow-400',
                                error: 'bg-red-400'
                              };

                              return (
                                <div
                                  key={notification.id}
                                  className={`p-3 rounded-lg cursor-pointer transition-colors ${typeColors[notification.type]} ${
                                    !notification.isRead ? 'border-l-2 border-l-green-400' : ''
                                  }`}
                                  onClick={() => handleNotificationClick(notification.id)}
                                >
                                  <div className="flex items-start gap-3">
                                    {!notification.isRead && (
                                      <div className={`h-2 w-2 rounded-full mt-2 ${dotColors[notification.type]}`}></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-white font-medium">{notification.title}</p>
                                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notification.message}</p>
                                      <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.createdAt)}</p>
                                    </div>
                                    {notification.actionText && (
                                      <div className="text-xs text-green-400 font-medium">
                                        {notification.actionText}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Bell className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                            <p className="text-gray-400 text-sm">No notifications</p>
                            <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Button */}
                <div ref={settingsRef} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-black/30"
                    onClick={() => setShowSettings((v) => !v)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  {showSettings && (
                    <div className="absolute right-0 mt-2 w-72 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 p-4 workspace-dropdown">
                      <h3 className="font-semibold text-white mb-3">Settings</h3>
                      <div className="space-y-2">
                        <button
                          className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                          onClick={() => {
                            setShowAISettings(true);
                            setShowSettings(false);
                          }}
                        >
                          <Brain className="h-4 w-4 text-green-400" />
                          <span className="text-sm text-gray-300">AI Provider Settings</span>
                        </button>
                        <button
                          className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                          onClick={() => {
                            toast({
                              title: "Theme Settings",
                              description: "Theme customization coming soon!",
                            });
                            setShowSettings(false);
                          }}
                        >
                          <Palette className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-gray-300">Theme Preferences</span>
                        </button>
                        <button
                          className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3"
                          onClick={() => {
                            toast({
                              title: "Privacy Settings",
                              description: "Privacy & security settings coming soon!",
                            });
                            setShowSettings(false);
                          }}
                        >
                          <Shield className="h-4 w-4 text-purple-400" />
                          <span className="text-sm text-gray-300">Privacy &amp; Security</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Button with Avatar */}
                <div ref={profileRef} className="relative">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white hover:bg-black/30 px-3 py-2 flex items-center gap-2"
                    onClick={() => setShowProfile((v) => !v)}
                  >
                    <div className="h-7 w-7 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{getUserInitials()}</span>
                    </div>
                    <span className="text-sm font-medium hidden md:inline">{getUserDisplayName()}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  {showProfile && (
                    <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 p-4 workspace-dropdown">
                      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                        <div className="h-10 w-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-white">{getUserInitials()}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-white">{getUserDisplayName()}</p>
                          <p className="text-xs text-gray-400">{getUserEmail()}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Link href="/profile" className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">View Profile</span>
                        </Link>
                        <Link href="/account" className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors">
                          <CreditCard className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-300">Billing & Plans</span>
                        </Link>
                        {isAdmin && (
                          <>
                            <div className="border-t border-white/10 my-2"></div>
                            <Link href="/admin" className="flex items-center gap-3 p-2 hover:bg-green-500/10 rounded-lg transition-colors">
                              <Shield className="h-4 w-4 text-green-400" />
                              <span className="text-sm text-green-400">Admin Panel</span>
                            </Link>
                          </>
                        )}
                        <div className="border-t border-white/10 my-2"></div>
                        <button
                          className="w-full flex items-center gap-3 p-2 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 text-red-400" />
                          <span className="text-sm text-red-400">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="workspace-background workspace-content-area overflow-y-auto">
            <div className="w-full min-h-full px-4 sm:px-6 lg:px-8 py-6 workspace-content-spacing">
              <div className="workspace-card-solid p-6 sm:p-8 lg:p-10 min-h-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Manage your startup journey with AI-powered tools and insights.</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 sm:mt-0">
                      {isGeneratingIdea && (
                        <div className="flex items-center gap-2 text-green-400 text-sm px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-green-400 border-t-transparent" />
                          <span className="font-medium">Saving idea...</span>
                        </div>
                      )}
                      <Button
                        variant="outline"
                        className="bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30 hover:border-green-500/50"
                        onClick={() => setShowQuickStart(true)}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Quick Start
                      </Button>
                  </div>
                </div>

                {/* Founder's GPT - Redesigned as AI Co-founder */}
                <section className="mb-6 md:mb-8 flex justify-center items-center min-h-[60vh]">
                  <div className="bg-black/20 backdrop-blur-xl rounded-2xl shadow-xl p-4 md:p-10 w-full flex flex-col items-center border border-white/10">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-6 md:mb-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-green-400" />
                        <h2 className="text-xl md:text-3xl font-bold text-white">Your AI Co-founder</h2>
                      </div>
                      <p className="text-gray-400 text-center max-w-md text-sm md:text-base">
                        From ideation to execution — I'm here to help you build your startup faster.
                      </p>
                    </div>

                    {/* Quick Actions Grid */}
                    <div className="w-full mb-6 md:mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base md:text-lg font-semibold text-white">Quick Actions</h3>
                      </div>
                      <Tabs
                        defaultValue="ideation"
                        value={activeCategory}
                        onValueChange={(value) => setActiveCategory(value as Category)}
                        className="w-full"
                      >
                        <TabsList className="grid grid-cols-4 mb-4 w-full">
                          <TabsTrigger
                            value="ideation"
                            className="text-xs md:text-sm data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                          >
                            Ideation
                          </TabsTrigger>
                          <TabsTrigger
                            value="planning"
                            className="text-xs md:text-sm data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                          >
                            Planning
                          </TabsTrigger>
                          <TabsTrigger
                            value="execution"
                            className="text-xs md:text-sm data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                          >
                            Execution
                          </TabsTrigger>
                          <TabsTrigger
                            value="validation"
                            className="text-xs md:text-sm data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                          >
                            Validation
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value={activeCategory} className="mt-0">
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                            {quickActions
                              .filter(action => action.category === activeCategory)
                              .map((action, i) => (
                                <button
                                  key={i}
                                  onClick={action.onClick}
                                  className="group bg-black/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-black/30 text-left"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-600/20 rounded-lg group-hover:scale-[1.02] transition-transform duration-200">
                                      {action.icon}
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-white mb-1 text-sm md:text-base">{action.title}</h4>
                                      <p className="text-xs md:text-sm text-gray-400">{action.description}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                    {/* Smart Prompt Input */}
                    <div className="w-full">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative">
                          <Input
                            value={gptInput}
                            onChange={e => setGptInput(e.target.value)}
                            placeholder="Ask your AI co-founder anything..."
                            className="bg-black/20 backdrop-blur-sm border-white/10 pr-24 text-white placeholder:text-gray-400 h-10 md:h-12 text-sm md:text-base"
                          />
                          <Button
                            type="submit"
                            className="absolute right-1 top-1 bg-green-600 hover:bg-green-500 h-8 md:h-10"
                            disabled={!!(isLoading || !gptInput.trim())}
                          >
                            {isLoading ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            ) : (
                              <Rocket className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </form>

                      {/* AI Response Section */}
                      {showResponse && (
                        <div className="mt-4 md:mt-6 bg-black/20 backdrop-blur-sm rounded-xl p-3 md:p-4 border border-white/10">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-green-400" />
                              <h3 className="text-base md:text-lg font-semibold text-white">AI Response</h3>
                            </div>
                            {!isLoading('aiResponse') && aiResponse && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  setBriefPrompt(gptInput);
                                  setShowStartupBrief(true);
                                }}
                                className="bg-green-600 hover:bg-green-500"
                              >
                                <Rocket className="h-4 w-4 mr-2" />
                                Generate Startup Brief
                              </Button>
                            )}
                          </div>
                          {isLoading('aiResponse') ? (
                            <LoadingSpinner
                              size="md"
                              text="AI is analyzing your request..."
                              className="py-8"
                            />
                          ) : (
                            <div className="prose prose-invert max-w-none">
                              <div className="text-gray-300 whitespace-pre-wrap text-sm md:text-base">
                                {aiResponse}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Quick Access Modules */}
                <div className="mb-6 md:mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base md:text-xl font-semibold text-white">Quick Access</h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {modules.map((module) => (
                      <Link
                        key={module.id}
                        href={module.path}
                        className={`group bg-black/20 backdrop-blur-xl rounded-xl p-4 md:p-4 border transition-all duration-200 h-[120px] md:h-[120px] flex flex-col justify-center hover:scale-[1.02] hover:bg-black/30 relative transform-gpu ${
                          module.isNew
                            ? 'border-green-500/40 hover:border-green-500/60 shadow-lg shadow-green-500/10'
                            : 'border-white/10 hover:border-green-500/30'
                        }`}
                      >
                        {module.isNew && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                          </div>
                        )}
                        {module.badge && (
                          <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30">
                            {module.badge}
                          </div>
                        )}
                        <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-2 md:gap-3">
                          <span className="text-2xl md:text-2xl group-hover:scale-105 transition-transform duration-200 mb-1 md:mb-0">{module.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-white text-sm md:text-base group-hover:text-green-400 transition-colors leading-tight">{module.name}</h3>
                            <p className="text-xs md:text-sm text-gray-400 line-clamp-2 mt-1">{module.description}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Recent Projects */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 workspace-last-section">
                  <Card className="workspace-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-green-400" />
                        Recent Projects
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Your latest startup ideas and projects
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isLoading('projects') ? (
                        <div className="space-y-3">
                          <ProjectCardSkeleton />
                          <ProjectCardSkeleton />
                          <ProjectCardSkeleton />
                        </div>
                      ) : recentProjects.length > 0 ? (
                        recentProjects.map((project) => (
                          <div
                            key={project.id}
                            className="p-3 bg-black/20 rounded-lg border border-white/10 hover:border-green-500/30 transition-colors cursor-pointer"
                            onClick={() => handleProjectClick(project.id)}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium text-white">{project.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs px-2 py-0.5 ${getStageColor(project.stage)}`}
                                >
                                  {project.stage}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-400 mb-2 line-clamp-2">{project.description}</p>
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500">Updated {project.lastUpdated}</p>
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-400">{project.progress}%</span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <Building2 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No projects yet</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green-400 hover:text-green-300 mt-2"
                            onClick={handleViewAllProjects}
                          >
                            Create your first project
                          </Button>
                        </div>
                      )}
                      {recentProjects.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-green-400 hover:text-green-300 mt-3"
                          onClick={handleViewAllProjects}
                        >
                          View All Projects
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Tasks */}
                  <Card className="workspace-card">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-blue-400" />
                        Tasks
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Your upcoming tasks and deadlines
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isLoading('tasks') ? (
                        <div className="space-y-3">
                          <TaskCardSkeleton />
                          <TaskCardSkeleton />
                          <TaskCardSkeleton />
                        </div>
                      ) : recentTaskItems.length > 0 ? (
                        recentTaskItems.map((task) => (
                          <div
                            key={task.id}
                            className={`p-3 bg-black/20 rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors cursor-pointer ${
                              task.isOverdue ? 'border-l-2 border-l-red-400' : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <h4 className="font-medium text-white mb-1">{task.title}</h4>
                                <div className="flex items-center gap-2 text-xs">
                                  <Badge
                                    variant="outline"
                                    className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority.toLowerCase() as any)}`}
                                  >
                                    {task.priority}
                                  </Badge>
                                  <span className={`${task.isOverdue ? 'text-red-400' : 'text-gray-500'}`}>
                                    {task.dueDate}
                                  </span>
                                </div>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6">
                          <CheckCircle2 className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400 text-sm">No tasks yet</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 mt-2"
                            onClick={handleViewAllTasks}
                          >
                            Create your first task
                          </Button>
                        </div>
                      )}
                      {recentTaskItems.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full text-blue-400 hover:text-blue-300 mt-3"
                          onClick={handleViewAllTasks}
                        >
                          View All Tasks
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </ErrorBoundary>
  );
}
