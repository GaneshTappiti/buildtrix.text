import { useState, useCallback, useMemo } from 'react';
import { useToast } from "@/hooks/use-toast";
import { 
  MVPWizardData, 
  PagePrompt, 
  BuilderTool,
  GeneratedFramework 
} from "@/types/ideaforge";
import { 
  PromptHistoryItem, 
  CompletedPrompts, 
  EnhancedWizardData,
  PromptFlow,
  PromptStage,
  createEmptyCompletedPrompts,
  validateWizardStep,
  safePagePromptAccess
} from './MVPWizardTypes';

export const useMVPWizardState = () => {
  const { toast } = useToast();
  
  // Core wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [wizardData, setWizardData] = useState<MVPWizardData>({
    step1: { appName: "", appType: "web-app" },
    step2: { theme: "dark", designStyle: "minimal", selectedTool: undefined },
    step3: { platforms: ["web"] },
    step4: { selectedAI: "" },
    userPrompt: ""
  });

  // Enhanced data state
  const [enhancedData, setEnhancedData] = useState<EnhancedWizardData>({
    description: "",
    colorPreference: "",
    targetAudience: "",
    promptStyle: "detailed",
    keyFeatures: [],
    targetUsers: "",
    currentStepValid: false
  });

  // Prompt flow state
  const [promptFlow, setPromptFlow] = useState<PromptFlow>('setup');
  const [promptStage, setPromptStage] = useState<PromptStage>('framework');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Generated content state
  const [frameworkPrompt, setFrameworkPrompt] = useState<string>('');
  const [pagePrompts, setPagePrompts] = useState<PagePrompt[]>([]);
  const [linkingPrompt, setLinkingPrompt] = useState<string>('');
  const [recommendedTools, setRecommendedTools] = useState<BuilderTool[]>([]);
  const [generatedFramework, setGeneratedFramework] = useState<GeneratedFramework | null>(null);
  
  // Progress tracking state
  const [completedPrompts, setCompletedPrompts] = useState<CompletedPrompts>({
    framework: false,
    pages: [],
    linking: false
  });
  const [focusedPrompt, setFocusedPrompt] = useState<string>('');
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);

  // Computed values
  const totalSteps = 5;
  const progress = useMemo(() => (currentStep / totalSteps) * 100, [currentStep]);
  
  const canProceed = useMemo(() => {
    const validation = validateWizardStep(currentStep, wizardData);
    return validation.isValid;
  }, [currentStep, wizardData]);

  const currentPromptTitle = useMemo(() => {
    if (promptStage === 'framework') return 'Project Framework';
    if (promptStage === 'page') {
      const currentPage = safePagePromptAccess(pagePrompts, currentPageIndex);
      return currentPage ? `${currentPage.pageName} UI` : 'Page UI';
    }
    if (promptStage === 'linking') return 'Navigation & Linking';
    return 'Complete';
  }, [promptStage, pagePrompts, currentPageIndex]);

  // Action handlers
  const handleNext = useCallback(() => {
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
    }
  }, [currentStep, wizardData, toast]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleNextPrompt = useCallback(() => {
    if (promptStage === 'framework') {
      if (pagePrompts.length > 0) {
        setPromptStage('page');
        setCurrentPageIndex(0);
        const firstPage = safePagePromptAccess(pagePrompts, 0);
        if (firstPage) {
          setFocusedPrompt(firstPage.prompt);
        }
      } else {
        setPromptStage('linking');
        setFocusedPrompt(linkingPrompt);
      }
    } else if (promptStage === 'page') {
      const nextPageIndex = currentPageIndex + 1;
      if (nextPageIndex < pagePrompts.length) {
        setCurrentPageIndex(nextPageIndex);
        const nextPage = safePagePromptAccess(pagePrompts, nextPageIndex);
        if (nextPage) {
          setFocusedPrompt(nextPage.prompt);
        }
      } else {
        setPromptStage('linking');
        setFocusedPrompt(linkingPrompt);
      }
    } else if (promptStage === 'linking') {
      setPromptStage('complete');
    }
  }, [promptStage, currentPageIndex, pagePrompts, linkingPrompt]);

  const handlePreviousPrompt = useCallback(() => {
    if (promptStage === 'page' && currentPageIndex > 0) {
      const prevPageIndex = currentPageIndex - 1;
      setCurrentPageIndex(prevPageIndex);
      const prevPage = safePagePromptAccess(pagePrompts, prevPageIndex);
      if (prevPage) {
        setFocusedPrompt(prevPage.prompt);
      }
    } else if (promptStage === 'page' && currentPageIndex === 0) {
      setPromptStage('framework');
      setFocusedPrompt(frameworkPrompt);
    } else if (promptStage === 'linking') {
      if (pagePrompts.length > 0) {
        setPromptStage('page');
        setCurrentPageIndex(pagePrompts.length - 1);
        const lastPage = safePagePromptAccess(pagePrompts, pagePrompts.length - 1);
        if (lastPage) {
          setFocusedPrompt(lastPage.prompt);
        }
      } else {
        setPromptStage('framework');
        setFocusedPrompt(frameworkPrompt);
      }
    }
  }, [promptStage, currentPageIndex, pagePrompts, frameworkPrompt]);

  const addToPromptHistory = useCallback((item: Omit<PromptHistoryItem, 'timestamp'>) => {
    setPromptHistory(prev => [...prev, { ...item, timestamp: new Date() }]);
  }, []);

  const copyToClipboard = useCallback((text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard. Ready to paste into your AI builder!`
    });
  }, [toast]);

  // Reset function
  const resetWizard = useCallback(() => {
    setCurrentStep(1);
    setIsGenerating(false);
    setPromptFlow('setup');
    setPromptStage('framework');
    setCurrentPageIndex(0);
    setFrameworkPrompt('');
    setPagePrompts([]);
    setLinkingPrompt('');
    setRecommendedTools([]);
    setGeneratedFramework(null);
    setCompletedPrompts({ framework: false, pages: [], linking: false });
    setFocusedPrompt('');
    setPromptHistory([]);
  }, []);

  return {
    // State
    currentStep,
    isGenerating,
    wizardData,
    enhancedData,
    promptFlow,
    promptStage,
    currentPageIndex,
    frameworkPrompt,
    pagePrompts,
    linkingPrompt,
    recommendedTools,
    generatedFramework,
    completedPrompts,
    focusedPrompt,
    promptHistory,
    
    // Computed
    totalSteps,
    progress,
    canProceed,
    currentPromptTitle,
    
    // Setters
    setCurrentStep,
    setIsGenerating,
    setWizardData,
    setEnhancedData,
    setPromptFlow,
    setPromptStage,
    setCurrentPageIndex,
    setFrameworkPrompt,
    setPagePrompts,
    setLinkingPrompt,
    setRecommendedTools,
    setGeneratedFramework,
    setCompletedPrompts,
    setFocusedPrompt,
    setPromptHistory,
    
    // Actions
    handleNext,
    handlePrevious,
    handleNextPrompt,
    handlePreviousPrompt,
    addToPromptHistory,
    copyToClipboard,
    resetWizard
  };
};
