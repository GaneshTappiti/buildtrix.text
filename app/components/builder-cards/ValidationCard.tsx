"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Users, MessageSquare, Target, Zap, Wrench } from "lucide-react";
import { useBuilder, builderActions, AppBlueprint } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { RAGTool, RAGToolProfile } from "@/types/ideaforge";
import { getAllRAGToolProfiles } from "@/services/ragToolProfiles";
import { RAGContextInjector } from "@/services/ragContextInjector";

const validationQuestions = [
  {
    id: 'hasValidated',
    question: 'Have you validated this idea?',
    description: 'Have you tested this concept with potential users, conducted surveys, or done market research?',
    icon: CheckCircle,
    examples: ['User interviews', 'Surveys', 'Landing page tests', 'Competitor analysis']
  },
  {
    id: 'hasDiscussed',
    question: 'Have you discussed this with others?',
    description: 'Have you shared this idea with friends, colleagues, mentors, or potential customers?',
    icon: MessageSquare,
    examples: ['Feedback from friends', 'Mentor advice', 'Industry expert opinions', 'Online community discussions']
  }
];

export function ValidationCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Tool selection state
  const [availableTools, setAvailableTools] = useState<RAGToolProfile[]>([]);
  const [filteredTools, setFilteredTools] = useState<RAGToolProfile[]>([]);

  // Blueprint customization options
  const [blueprintOptions, setBlueprintOptions] = useState({
    appType: state.appIdea.platforms.includes('mobile') ? 'mobile' : 'web',
    depth: 'advanced' as 'mvp' | 'advanced' | 'production',
    includeStates: true,
    includeModals: true,
    includeIntegrations: true
  });

  // Load available tools on component mount
  useEffect(() => {
    const tools = getAllRAGToolProfiles();
    setAvailableTools(tools);
  }, []);

  // Filter tools based on app type and platforms
  useEffect(() => {
    if (availableTools.length === 0) return;

    const appType = state.appIdea.platforms.includes('mobile') ? 'mobile-app' : 'web-app';
    const platforms = state.appIdea.platforms.length > 0 ? state.appIdea.platforms : ['web'];

    const filtered = availableTools.filter(tool => {
      // Filter by app type compatibility - be more flexible with matching
      const appTypeMatch = tool.appTypes.some(toolAppType =>
        toolAppType === appType ||
        (appType === 'web-app' && (toolAppType === 'web-app' || toolAppType === 'saas-tool')) ||
        (appType === 'mobile-app' && toolAppType === 'mobile-app')
      );

      // Filter by platform compatibility
      const platformMatch = platforms.some(platform =>
        tool.platforms.includes(platform as any) ||
        tool.platforms.includes('cross-platform' as any)
      );

      return appTypeMatch || platformMatch; // Use OR to be more inclusive
    });

    setFilteredTools(filtered);
  }, [availableTools, state.appIdea.platforms]);

  const handleCheckboxChange = (field: 'hasValidated' | 'hasDiscussed', checked: boolean) => {
    dispatch(builderActions.updateValidation({ [field]: checked }));
  };

  const handleToolSelection = async (toolId: string) => {
    const selectedTool = toolId === '' ? undefined : toolId as RAGTool;
    dispatch(builderActions.updateValidation({ selectedTool }));

    // Enhance with RAG context (background process, doesn't affect UI)
    if (selectedTool) {
      try {
        const ragContext = await RAGContextInjector.getContextForStage({
          stage: 'tool_selection',
          toolId: selectedTool,
          appIdea: state.appIdea.ideaDescription,
          appType: state.appIdea.platforms.includes('mobile') ? 'mobile-app' : 'web-app',
          platforms: state.appIdea.platforms
        });

        // Store RAG context for later use (could be added to builder state if needed)
        console.log('RAG Context loaded for tool selection:', ragContext);
      } catch (error) {
        console.warn('Failed to load RAG context:', error);
      }
    }
  };

  const generateBlueprint = async () => {
    // Validation
    if (!state.validationQuestions.motivation.trim()) {
      toast({
        title: "Motivation Required",
        description: "Please share what motivates you to build this app.",
        variant: "destructive"
      });
      return;
    }

    if (state.validationQuestions.motivation.trim().length < 30) {
      toast({
        title: "More Detail Needed",
        description: "Please provide more detail about your motivation (at least 30 characters).",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    dispatch(builderActions.setGenerating(true));
    dispatch(builderActions.setGenerationProgress(0));

    // Simulate blueprint generation with progress
    const progressSteps = [
      { progress: 20, delay: 800, message: "Analyzing your app concept..." },
      { progress: 40, delay: 1000, message: "Identifying core screens..." },
      { progress: 60, delay: 1200, message: "Mapping user journeys..." },
      { progress: 80, delay: 1000, message: "Defining data models..." },
      { progress: 100, delay: 800, message: "Finalizing blueprint..." }
    ];

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      dispatch(builderActions.setGenerationProgress(step.progress));
    }

    // Get RAG context for blueprint generation
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

    // Generate comprehensive blueprint using AI with RAG context
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'app-blueprint',
          prompt: JSON.stringify({
            appIdea: state.appIdea.ideaDescription,
            appName: state.appIdea.appName,
            platforms: state.appIdea.platforms,
            designStyle: state.appIdea.designStyle,
            targetAudience: state.appIdea.targetAudience,
            selectedTool: state.validationQuestions.selectedTool,
            toolProfile: state.validationQuestions.selectedTool ?
              availableTools.find(tool => tool.id === state.validationQuestions.selectedTool) : null,
            // Inject RAG context to enhance generation
            ragContext: ragContext ? {
              toolSpecificGuidance: ragContext.toolSpecificContext,
              architecturePatterns: ragContext.architecturePatterns,
              bestPractices: ragContext.bestPractices,
              optimizationTips: ragContext.optimizationTips
            } : null,
            ...blueprintOptions
          })
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.blueprint) {
        dispatch(builderActions.setAppBlueprint(result.blueprint));
      } else {
        throw new Error(result.error || 'Failed to generate blueprint');
      }
    } catch (error) {
      console.error('Error generating blueprint:', error);

      // Fallback to enhanced mock blueprint if AI fails
      const fallbackBlueprint = createEnhancedFallbackBlueprint();
      dispatch(builderActions.setAppBlueprint(fallbackBlueprint));

      toast({
        title: "Blueprint Generated (Fallback)",
        description: "AI generation failed, using enhanced fallback blueprint.",
        variant: "default"
      });
    }
    dispatch(builderActions.setGenerating(false));
    dispatch(builderActions.setCurrentCard(3));
    setIsGenerating(false);

    toast({
      title: "Blueprint Generated!",
      description: "Your app structure is ready. Review the generated blueprint below.",
    });
  };

  const createEnhancedFallbackBlueprint = (): AppBlueprint => {
    const idea = state.appIdea.ideaDescription.toLowerCase();
    const mainFeatureName = getMainFeatureName();

    return {
      screens: [
        {
          id: 'splash',
          name: 'Splash Screen',
          purpose: 'App loading and branding',
          type: 'loading',
          components: ['App logo', 'Loading indicator', 'Version info'],
          navigation: ['onboarding', 'login', 'dashboard'],
          subPages: [],
          edgeCases: ['Network error', 'App update required']
        },
        {
          id: 'onboarding',
          name: 'Onboarding Flow',
          purpose: 'Introduce app features and benefits',
          type: 'onboarding',
          components: ['Feature highlights', 'Skip button', 'Next/Previous buttons', 'Progress indicator'],
          navigation: ['login', 'signup'],
          subPages: ['welcome', 'features', 'permissions'],
          edgeCases: ['Skip onboarding', 'Return user']
        },
        {
          id: 'login',
          name: 'Login/Authentication',
          purpose: 'User authentication and account access',
          type: 'auth',
          components: ['Email input', 'Password input', 'Login button', 'Social login options', 'Forgot password link'],
          navigation: ['dashboard', 'signup', 'forgot-password'],
          subPages: ['forgot-password', 'reset-password'],
          edgeCases: ['Invalid credentials', 'Account locked', 'Network error']
        },
        {
          id: 'signup',
          name: 'Sign Up',
          purpose: 'New user registration',
          type: 'auth',
          components: ['Name input', 'Email input', 'Password input', 'Confirm password', 'Terms checkbox', 'Sign up button'],
          navigation: ['dashboard', 'login', 'email-verification'],
          subPages: ['email-verification', 'profile-setup'],
          edgeCases: ['Email already exists', 'Weak password', 'Terms not accepted']
        },
        {
          id: 'dashboard',
          name: 'Dashboard/Home',
          purpose: 'Main hub with overview and quick actions',
          type: 'main',
          components: ['Header with user info', 'Quick stats/metrics', 'Recent activity', 'Action buttons', 'Navigation menu'],
          navigation: ['profile', 'settings', 'main-features'],
          subPages: ['notifications', 'search'],
          edgeCases: ['No data available', 'Loading state', 'Error state']
        },
        {
          id: 'main-feature',
          name: mainFeatureName,
          purpose: 'Core functionality of the application',
          type: 'feature',
          components: ['Feature interface', 'Action buttons', 'Data display', 'Filter/sort options'],
          navigation: ['dashboard', 'details', 'create-edit'],
          subPages: ['details', 'create', 'edit', 'list'],
          edgeCases: ['Empty state', 'Loading', 'Error', 'No permissions']
        },
        {
          id: 'profile',
          name: 'User Profile',
          purpose: 'User profile management and personal information',
          type: 'feature',
          components: ['Profile picture', 'User info display', 'Edit profile button', 'Activity history'],
          navigation: ['dashboard', 'settings', 'edit-profile'],
          subPages: ['edit-profile', 'activity-history', 'achievements'],
          edgeCases: ['Profile incomplete', 'Image upload error']
        },
        {
          id: 'settings',
          name: 'Settings',
          purpose: 'App configuration and user preferences',
          type: 'settings',
          components: ['Preference toggles', 'Account settings', 'Privacy controls', 'Logout button'],
          navigation: ['dashboard', 'profile', 'privacy', 'notifications'],
          subPages: ['account', 'privacy', 'notifications', 'about'],
          edgeCases: ['Settings save error', 'Permission denied']
        }
      ],
      userRoles: getEnhancedUserRoles(),
      dataModels: getEnhancedDataModels(),
      pageFlow: [
        { from: 'splash', to: 'onboarding', condition: 'first_time_user', action: 'navigate' },
        { from: 'splash', to: 'login', condition: 'returning_user_not_logged_in', action: 'navigate' },
        { from: 'splash', to: 'dashboard', condition: 'user_logged_in', action: 'navigate' },
        { from: 'onboarding', to: 'signup', condition: 'user_wants_to_register', action: 'navigate' },
        { from: 'login', to: 'dashboard', condition: 'successful_login', action: 'navigate' },
        { from: 'signup', to: 'dashboard', condition: 'successful_registration', action: 'navigate' }
      ],
      modals: [
        {
          id: 'confirmation',
          name: 'Confirmation Dialog',
          purpose: 'Confirm destructive actions',
          triggerScreens: ['dashboard', 'profile', 'settings'],
          components: ['Message text', 'Confirm button', 'Cancel button']
        },
        {
          id: 'loading',
          name: 'Loading Modal',
          purpose: 'Show loading state for long operations',
          triggerScreens: ['dashboard', 'main-feature'],
          components: ['Loading spinner', 'Progress text', 'Cancel button']
        }
      ],
      states: [
        {
          name: 'Loading',
          description: 'Data is being fetched or processed',
          screens: ['dashboard', 'main-feature', 'profile'],
          conditions: ['api_request_pending', 'data_processing']
        },
        {
          name: 'Empty',
          description: 'No data available to display',
          screens: ['dashboard', 'main-feature'],
          conditions: ['no_data_found', 'first_time_user', 'filtered_results_empty']
        },
        {
          name: 'Error',
          description: 'An error occurred during operation',
          screens: ['dashboard', 'main-feature', 'profile', 'settings'],
          conditions: ['network_error', 'server_error', 'permission_denied']
        }
      ],
      integrations: [
        {
          name: 'Authentication',
          type: 'auth',
          description: 'User authentication and authorization',
          implementation: 'Firebase Auth or Auth0 for social login and user management'
        },
        {
          name: 'Cloud Storage',
          type: 'storage',
          description: 'File and data storage',
          implementation: 'Firebase Storage or AWS S3 for user-generated content'
        },
        {
          name: 'Push Notifications',
          type: 'notification',
          description: 'Real-time user notifications',
          implementation: 'Firebase Cloud Messaging for cross-platform notifications'
        }
      ],
      architecture: 'Component-based architecture with state management',
      suggestedPattern: 'Feature-based folder structure with shared components and utilities',
      navigationFlow: 'Splash → Onboarding/Login → Dashboard → Feature Screens → Settings/Profile'
    };
  };

  const getMainFeatureName = () => {
    const idea = state.appIdea.ideaDescription.toLowerCase();
    if (idea.includes('habit') || idea.includes('track')) return 'Habit Tracker';
    if (idea.includes('task') || idea.includes('todo')) return 'Task Manager';
    if (idea.includes('social') || idea.includes('chat')) return 'Social Feed';
    if (idea.includes('shop') || idea.includes('store')) return 'Product Catalog';
    if (idea.includes('learn') || idea.includes('course')) return 'Learning Hub';
    if (idea.includes('fitness') || idea.includes('workout')) return 'Fitness Tracker';
    if (idea.includes('finance') || idea.includes('budget') || idea.includes('money')) return 'Finance Manager';
    if (idea.includes('recipe') || idea.includes('food') || idea.includes('cooking')) return 'Recipe Collection';
    if (idea.includes('travel') || idea.includes('trip')) return 'Travel Planner';
    if (idea.includes('event') || idea.includes('calendar')) return 'Event Manager';
    return 'Main Feature';
  };

  const getEnhancedUserRoles = () => {
    const idea = state.appIdea.ideaDescription.toLowerCase();
    const roles = [
      {
        name: 'User',
        permissions: ['view_content', 'create_content', 'edit_own_content', 'delete_own_content'],
        description: 'Standard app user with basic functionality access'
      }
    ];

    if (idea.includes('admin') || idea.includes('manage')) {
      roles.push({
        name: 'Admin',
        permissions: ['view_all_content', 'create_content', 'edit_any_content', 'delete_any_content', 'manage_users', 'view_analytics'],
        description: 'Administrator with full app management capabilities'
      });
    }

    if (idea.includes('teacher') || idea.includes('instructor')) {
      roles.push({
        name: 'Instructor',
        permissions: ['view_content', 'create_content', 'edit_own_content', 'manage_students', 'view_progress'],
        description: 'Educational content creator and student manager'
      });
    }

    if (idea.includes('business') || idea.includes('owner')) {
      roles.push({
        name: 'Business Owner',
        permissions: ['view_analytics', 'manage_content', 'manage_users', 'view_reports'],
        description: 'Business owner with analytics and management access'
      });
    }

    return roles;
  };

  const getEnhancedDataModels = () => {
    const mainFeatureName = getMainFeatureName().replace(/\s+/g, '');

    return [
      {
        name: 'User',
        fields: ['id', 'email', 'name', 'avatar', 'createdAt', 'updatedAt', 'preferences', 'role'],
        relationships: ['hasMany: UserSessions', 'hasMany: UserActivities'],
        description: 'Core user entity with authentication and profile data'
      },
      {
        name: 'UserSession',
        fields: ['id', 'userId', 'token', 'createdAt', 'expiresAt', 'deviceInfo'],
        relationships: ['belongsTo: User'],
        description: 'User authentication sessions and device tracking'
      },
      {
        name: mainFeatureName,
        fields: ['id', 'userId', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
        relationships: ['belongsTo: User'],
        description: `Main feature entity for ${getMainFeatureName().toLowerCase()}`
      }
    ];
  };

  return (
    <div className="space-y-6">
      {/* Validation Questions */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold flex items-center justify-center gap-2 text-white">
            <Target className="h-5 w-5 text-blue-400" />
            Product Maturity Assessment
          </h3>
          <p className="text-sm text-gray-400">
            Help us understand where you are in your product journey
          </p>
        </div>

        {validationQuestions.map((q) => {
          const Icon = q.icon;
          const fieldName = q.id as 'hasValidated' | 'hasDiscussed';
          const isChecked = state.validationQuestions[fieldName];

          return (
            <Card key={q.id} className={`bg-black/40 backdrop-blur-sm border-white/10 transition-all duration-200 ${isChecked ? 'ring-1 ring-green-500/50 bg-green-500/10' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center space-x-2 mt-1">
                    <Checkbox
                      id={q.id}
                      checked={isChecked}
                      onCheckedChange={(checked) => handleCheckboxChange(fieldName, checked as boolean)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={q.id} className="flex items-center gap-2 cursor-pointer text-base font-medium text-white">
                      <Icon className="h-4 w-4 text-blue-400" />
                      {q.question}
                    </Label>
                    <p className="text-sm text-gray-400">
                      {q.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {q.examples.map((example, index) => (
                        <span key={index} className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded backdrop-blur-sm">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Motivation */}
      <div className="space-y-2">
        <Label htmlFor="motivation" className="text-base font-medium flex items-center gap-2 text-white">
          <Users className="h-4 w-4 text-purple-400" />
          What motivates you to build this app? *
        </Label>
        <Textarea
          id="motivation"
          placeholder="Share your personal motivation, the problem you're solving, or the impact you want to make. For example: 'I struggled with habit tracking myself and existing apps are too complex. I want to create something simple that actually helps people build lasting habits...'"
          value={state.validationQuestions.motivation}
          onChange={(e) => dispatch(builderActions.updateValidation({ motivation: e.target.value }))}
          className="min-h-[100px] bg-black/40 backdrop-blur-sm border-white/10 text-white placeholder:text-gray-500"
        />
        <div className="text-xs text-gray-400">
          {state.validationQuestions.motivation.length}/30 characters minimum
        </div>
      </div>

      {/* Validation Summary */}
      {(state.validationQuestions.hasValidated || state.validationQuestions.hasDiscussed) && (
        <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-300">Great progress!</h4>
                <p className="text-sm text-gray-300">
                  {state.validationQuestions.hasValidated && state.validationQuestions.hasDiscussed
                    ? "You've both validated your idea and discussed it with others. This gives you a strong foundation for building."
                    : state.validationQuestions.hasValidated
                    ? "You've validated your idea, which is excellent. Consider discussing it with more people for additional insights."
                    : "You've discussed your idea with others, which is valuable. Consider doing some validation research to strengthen your concept."
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tool Selection Section */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white flex items-center gap-2">
            <Wrench className="h-4 w-4 text-blue-400" />
            Development Tool Selection
          </CardTitle>
          <p className="text-sm text-gray-400">
            Choose your preferred development tool for optimized prompts (optional)
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredTools.length === 0 ? (
            <div className="p-4 border rounded-lg bg-muted/20">
              <p className="text-sm text-muted-foreground">
                No compatible tools found for {state.appIdea.platforms.includes('mobile') ? 'mobile' : 'web'} apps.
                You can still proceed - general prompts will be generated.
              </p>
            </div>
          ) : (
            <RadioGroup
              value={state.validationQuestions.selectedTool || ""}
              onValueChange={handleToolSelection}
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
                    <div className="font-medium text-white">No Specific Tool</div>
                    <div className="text-sm text-muted-foreground">Generate general prompts that work with any tool</div>
                  </div>
                </Label>
              </div>

              {/* Available RAG tools */}
              {filteredTools.slice(0, 6).map((tool) => (
                <div key={tool.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value={tool.id} id={`tool-${tool.id}`} />
                  <Label htmlFor={`tool-${tool.id}`} className="flex items-center gap-3 cursor-pointer flex-1">
                    <div className="p-2 bg-primary/10 rounded-md">
                      <span className="text-lg">{tool.icon}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-white">{tool.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {tool.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {tool.complexity}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{tool.description}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Best for: {tool.bestFor.slice(0, 2).join(', ')}
                        {tool.bestFor.length > 2 && '...'}
                      </div>
                    </div>
                  </Label>
                </div>
              ))}

              {filteredTools.length > 6 && (
                <div className="text-center text-sm text-muted-foreground">
                  And {filteredTools.length - 6} more tools available...
                </div>
              )}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Blueprint Customization Options */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-base text-white">
            🎛️ Blueprint Generation Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* App Type Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">App Type</Label>
            <Select
              value={blueprintOptions.appType}
              onValueChange={(value) => setBlueprintOptions(prev => ({ ...prev, appType: value as 'web' | 'mobile' | 'hybrid' }))}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select app type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="web">Web App</SelectItem>
                <SelectItem value="mobile">Mobile App</SelectItem>
                <SelectItem value="hybrid">Hybrid (Web + Mobile)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Depth Level Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-300">Blueprint Depth</Label>
            <Select
              value={blueprintOptions.depth}
              onValueChange={(value) => setBlueprintOptions(prev => ({ ...prev, depth: value as 'mvp' | 'advanced' | 'production' }))}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select depth level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mvp">MVP (Basic Structure)</SelectItem>
                <SelectItem value="advanced">Advanced (Comprehensive)</SelectItem>
                <SelectItem value="production">Production-Ready (Full Detail)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-300">Include Additional Components</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeStates"
                checked={blueprintOptions.includeStates}
                onCheckedChange={(checked) => setBlueprintOptions(prev => ({ ...prev, includeStates: checked as boolean }))}
              />
              <Label htmlFor="includeStates" className="text-sm text-gray-300 cursor-pointer">
                ☑ Add error/loading/empty states
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeModals"
                checked={blueprintOptions.includeModals}
                onCheckedChange={(checked) => setBlueprintOptions(prev => ({ ...prev, includeModals: checked as boolean }))}
              />
              <Label htmlFor="includeModals" className="text-sm text-gray-300 cursor-pointer">
                ☑ Include modals/popups
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeIntegrations"
                checked={blueprintOptions.includeIntegrations}
                onCheckedChange={(checked) => setBlueprintOptions(prev => ({ ...prev, includeIntegrations: checked as boolean }))}
              />
              <Label htmlFor="includeIntegrations" className="text-sm text-gray-300 cursor-pointer">
                ☑ Suggest 3rd-party integrations
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Blueprint Button */}
      <div className="flex justify-end pt-4">
        <Button 
          onClick={generateBlueprint}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Generating Blueprint...
            </>
          ) : (
            <>
              Generate Blueprint
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
