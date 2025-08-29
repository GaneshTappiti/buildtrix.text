import { useState } from 'react';
import { ValidationResult } from '@/services/geminiService';

interface UseEnhancedAIReturn {
  // ✅ Core AI Features
  generateText: (prompt: string, options?: any) => Promise<any>;
  validateIdea: (idea: string) => Promise<ValidationResult>;
  generateBrief: (idea: string) => Promise<string>;
  analyzeMarket: (industry: string) => Promise<any>;
  
  // ✅ Enhanced AI Features
  generateRoadmap: (idea: string, timeframe?: string) => Promise<any>;
  breakdownTasks: (feature: string, complexity?: 'simple' | 'medium' | 'complex') => Promise<any>;
  findInvestorMatches: (startup: any) => Promise<any>;
  optimizePrompt: (prompt: string, purpose: string) => Promise<any>;
  generateInsights: (data: any) => Promise<any>;
  generateRecommendations: (context: any) => Promise<any>;
  improveWriting: (text: string, purpose: string) => Promise<any>;
  
  // State
  isLoading: boolean;
  error: string | null;
}

export function useEnhancedAI(): UseEnhancedAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (type: string, prompt: string | any, options?: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          prompt: typeof prompt === 'string' ? prompt : JSON.stringify(prompt),
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'AI request failed');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Core AI Features
  const generateText = async (prompt: string, options?: any) => {
    return makeRequest('text', prompt, options);
  };

  const validateIdea = async (idea: string): Promise<ValidationResult> => {
    return makeRequest('validate', idea);
  };

  const generateBrief = async (idea: string): Promise<string> => {
    return makeRequest('brief', idea);
  };

  const analyzeMarket = async (industry: string) => {
    return makeRequest('market', industry);
  };

  // ✅ Enhanced AI Features
  const generateRoadmap = async (idea: string, timeframe: string = '6 months') => {
    return makeRequest('roadmap', idea, { timeframe });
  };

  const breakdownTasks = async (feature: string, complexity: 'simple' | 'medium' | 'complex' = 'medium') => {
    return makeRequest('tasks', feature, { complexity });
  };

  const findInvestorMatches = async (startup: any) => {
    return makeRequest('investors', startup);
  };

  const optimizePrompt = async (prompt: string, purpose: string) => {
    return makeRequest('optimize-prompt', prompt, { purpose });
  };

  const generateInsights = async (data: any) => {
    return makeRequest('insights', data);
  };

  const generateRecommendations = async (context: any) => {
    return makeRequest('recommendations', context);
  };

  const improveWriting = async (text: string, purpose: string) => {
    return makeRequest('improve-writing', text, { purpose });
  };

  return {
    // Core features
    generateText,
    validateIdea,
    generateBrief,
    analyzeMarket,
    
    // Enhanced features
    generateRoadmap,
    breakdownTasks,
    findInvestorMatches,
    optimizePrompt,
    generateInsights,
    generateRecommendations,
    improveWriting,
    
    // State
    isLoading,
    error,
  };
}
