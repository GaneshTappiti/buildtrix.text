import { useState } from 'react';
import { ValidationResult } from '@/services/geminiService';

interface UseGeminiAIReturn {
  generateText: (prompt: string, options?: any) => Promise<any>;
  validateIdea: (idea: string) => Promise<ValidationResult>;
  generateBrief: (idea: string) => Promise<string>;
  analyzeMarket: (industry: string) => Promise<any>;
  isLoading: boolean;
  error: string | null;
}

export function useGeminiAI(): UseGeminiAIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const makeRequest = async (type: string, prompt: string, options?: any) => {
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
          prompt,
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

  return {
    generateText,
    validateIdea,
    generateBrief,
    analyzeMarket,
    isLoading,
    error,
  };
}
