"use client";

// Idea management using React Context API
import React, { createContext, useReducer, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export interface ActiveIdea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'validated' | 'exploring' | 'archived';
  category: string;
  tags: string[];
  validation_score?: number;
  market_opportunity?: string;
  risk_assessment?: string;
  monetization_strategy?: string;
  key_features?: string[];
  next_steps?: string[];
  competitor_analysis?: string;
  target_market?: string;
  problem_statement?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface IdeaState {
  currentStep: string;
  hasActiveIdea: boolean;
  activeIdea: ActiveIdea | null;
  ideas: ActiveIdea[];
  isLoading: boolean;
  error: string | null;
}

type IdeaAction = 
  | { type: 'SET_CURRENT_STEP'; payload: string }
  | { type: 'SET_HAS_ACTIVE_IDEA'; payload: boolean }
  | { type: 'SET_ACTIVE_IDEA'; payload: ActiveIdea | null }
  | { type: 'SET_IDEAS'; payload: ActiveIdea[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: IdeaState = {
  currentStep: 'workshop',
  hasActiveIdea: false,
  activeIdea: null,
  ideas: [],
  isLoading: false,
  error: null
};

const ideaReducer = (state: IdeaState, action: IdeaAction): IdeaState => {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'SET_HAS_ACTIVE_IDEA':
      return { ...state, hasActiveIdea: action.payload };
    case 'SET_ACTIVE_IDEA':
      return { ...state, activeIdea: action.payload };
    case 'SET_IDEAS':
      return { ...state, ideas: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

interface IdeaContextType extends IdeaState {
  setCurrentStep: (step: string) => void;
  setHasActiveIdea: (hasIdea: boolean) => void;
  setActiveIdea: (idea: ActiveIdea | null) => Promise<void>;
  fetchUserIdeas: () => Promise<void>;
  saveIdeaToSupabase: (idea: ActiveIdea) => Promise<void>;
  canCreateNewIdea: () => boolean;
}

const IdeaContext = createContext<IdeaContextType | undefined>(undefined);

export const IdeaProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [state, dispatch] = useReducer(ideaReducer, initialState);

  const setCurrentStep = useCallback((step: string) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  }, []);

  const setHasActiveIdea = useCallback((hasIdea: boolean) => {
    dispatch({ type: 'SET_HAS_ACTIVE_IDEA', payload: hasIdea });
  }, []);

  const canCreateNewIdea = useCallback(() => !state.hasActiveIdea, [state.hasActiveIdea]);

  const saveIdeaToSupabase = useCallback(async (idea: ActiveIdea) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // Mock implementation since supabase.auth is not available
      const mockUser = { id: 'mock-user-id' };
      if (!mockUser) throw new Error('No user authenticated');

      const ideaWithUser = { ...idea, user_id: mockUser.id, updated_at: new Date().toISOString() };

      if (idea.id) {
        // Update existing idea - mock implementation
        console.log('Updating idea:', ideaWithUser);
        toast({ title: 'Idea updated successfully' });
        dispatch({ type: 'SET_ACTIVE_IDEA', payload: idea });
        dispatch({ type: 'SET_IDEAS', payload: state.ideas.map(i => i.id === idea.id ? idea : i) });
      } else {
        // Create new idea - mock implementation
        const newIdea = { ...ideaWithUser, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        console.log('Creating idea:', newIdea);
        toast({ title: 'Idea saved to vault' });
        dispatch({ type: 'SET_IDEAS', payload: [newIdea, ...state.ideas] });
        dispatch({ type: 'SET_HAS_ACTIVE_IDEA', payload: true });
        dispatch({ type: 'SET_ACTIVE_IDEA', payload: newIdea });
      }
    } catch (error) {
      console.error('Error saving idea:', error);
      toast({ title: 'Failed to save idea', variant: 'destructive' });
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to save idea' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.ideas]);

  const setActiveIdea = useCallback(async (idea: ActiveIdea | null) => {
    if (idea) {
      await saveIdeaToSupabase(idea);
    } else {
      dispatch({ type: 'SET_ACTIVE_IDEA', payload: null });
    }
  }, [saveIdeaToSupabase]);

  const fetchUserIdeas = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Mock implementation since supabase.auth is not available
      const mockUser = { id: 'mock-user-id' };
      if (!mockUser) {
        dispatch({ type: 'SET_IDEAS', payload: [] });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Mock data for demonstration
      const mockIdeas: ActiveIdea[] = [
        {
          id: '1',
          title: 'AI-Powered Fitness Coach',
          description: 'A personalized fitness app that uses AI to create custom workout plans',
          status: 'validated',
          category: 'Health & Fitness',
          tags: ['AI', 'Fitness', 'Mobile App'],
          validation_score: 85,
          market_opportunity: 'Growing health consciousness and demand for personalized fitness solutions',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
          user_id: mockUser.id
        },
        {
          id: '2',
          title: 'Sustainable Food Delivery',
          description: 'Eco-friendly food delivery service using electric vehicles and biodegradable packaging',
          status: 'exploring',
          category: 'Food & Delivery',
          tags: ['Sustainability', 'Food', 'Environment'],
          validation_score: 72,
          created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: mockUser.id
        }
      ];

      dispatch({ type: 'SET_IDEAS', payload: mockIdeas });
      dispatch({ type: 'SET_HAS_ACTIVE_IDEA', payload: mockIdeas.length > 0 });
      dispatch({ type: 'SET_ACTIVE_IDEA', payload: mockIdeas.length > 0 ? mockIdeas[0] : null });
    } catch (error) {
      console.error('Error fetching ideas:', error);
      toast({ title: 'Failed to load ideas', variant: 'destructive' });
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load ideas' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const contextValue: IdeaContextType = {
    ...state,
    setCurrentStep,
    setHasActiveIdea,
    setActiveIdea,
    fetchUserIdeas,
    saveIdeaToSupabase,
    canCreateNewIdea
  };

  return (
    <IdeaContext.Provider value={contextValue}>
      {children}
    </IdeaContext.Provider>
  );
};

export const useIdeaContext = () => {
  const context = useContext(IdeaContext);
  if (context === undefined) {
    throw new Error('useIdeaContext must be used within an IdeaProvider');
  }
  return context;
};

// Helper hook to maintain backward compatibility
export const useActiveIdea = () => {
  const context = useIdeaContext();
  return {
    activeIdea: context.activeIdea,
    setActiveIdea: context.setActiveIdea,
    fetchUserIdeas: context.fetchUserIdeas,
    isLoading: context.isLoading,
    error: context.error
  };
};

// Deprecated export for backward compatibility - will be removed in future versions
export const useIdeaStore = () => {
  console.warn('useIdeaStore is deprecated, use useIdeaContext instead');
  return useIdeaContext();
};