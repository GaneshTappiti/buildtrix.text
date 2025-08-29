// Type definitions for MVPWizard to fix TypeScript issues
export interface PromptHistoryItem {
  type: 'framework' | 'page' | 'linking';
  title: string;
  prompt: string;
  timestamp: Date;
  pageIndex?: number;
}

export interface CompletedPrompts {
  framework: boolean;
  pages: boolean[];
  linking: boolean;
}

export interface EnhancedWizardData {
  description: string;
  colorPreference: string;
  targetAudience: string;
  promptStyle: 'detailed' | 'concise' | 'technical';
  keyFeatures: string[];
  targetUsers: string;
  currentStepValid: boolean;
}

export type PromptFlow = 'setup' | 'framework' | 'pages' | 'linking' | 'complete';
export type PromptStage = 'framework' | 'page' | 'linking' | 'complete';

export interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  fields: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Utility functions for type safety
export const createEmptyCompletedPrompts = (pageCount: number): CompletedPrompts => ({
  framework: false,
  pages: new Array(pageCount).fill(false),
  linking: false
});

export const validateWizardStep = (step: number, wizardData: any): ValidationResult => {
  const errors: string[] = [];
  
  switch (step) {
    case 1:
      if (!wizardData.step1?.appName?.trim()) errors.push('App name is required');
      if (!wizardData.step1?.appType) errors.push('App type is required');
      break;
    case 2:
      if (!wizardData.step2?.theme) errors.push('Theme is required');
      if (!wizardData.step2?.designStyle) errors.push('Design style is required');
      break;
    case 3:
      if (!wizardData.step3?.platforms?.length) errors.push('At least one platform is required');
      break;
    case 4:
      if (!wizardData.step4?.selectedAI) errors.push('AI provider is required');
      break;
    case 5:
      if (!wizardData.userPrompt?.trim() || wizardData.userPrompt.trim().length < 20) {
        errors.push('Description must be at least 20 characters');
      }
      break;
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Safe array access utilities
export const safeArrayAccess = <T>(array: T[], index: number): T | undefined => {
  return array && index >= 0 && index < array.length ? array[index] : undefined;
};

export const safePagePromptAccess = (pagePrompts: any[], index: number) => {
  const page = safeArrayAccess(pagePrompts, index);
  return page ? {
    pageName: page.pageName || 'Untitled Page',
    prompt: page.prompt || '',
    components: page.components || [],
    layout: page.layout || 'default'
  } : null;
};
