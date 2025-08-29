"use client"

import { useState, useEffect, useCallback } from 'react';
import IdeaForgePersistence, { 
  WikiSection, 
  Feature, 
  TechStackItem, 
  JourneyEntry, 
  FeedbackItem,
  IdeaForgeData 
} from '@/utils/ideaforge-persistence';

interface UseIdeaForgePersistenceReturn {
  // Data
  wikiSections: WikiSection[];
  features: Feature[];
  techStack: TechStackItem[];
  journeyEntries: JourneyEntry[];
  feedback: FeedbackItem[];
  appConfig: IdeaForgeData['appConfig'];
  
  // Wiki operations
  addWikiSection: (section: Omit<WikiSection, 'id' | 'lastUpdated'>) => void;
  updateWikiSection: (id: string, updates: Partial<WikiSection>) => void;
  deleteWikiSection: (id: string) => void;
  
  // Feature operations
  addFeature: (feature: Omit<Feature, 'id'>) => void;
  updateFeature: (id: string, updates: Partial<Feature>) => void;
  deleteFeature: (id: string) => void;
  reorderFeatures: (fromIndex: number, toIndex: number) => void;
  
  // Tech stack operations
  addTechStackItem: (item: Omit<TechStackItem, 'id'>) => void;
  updateTechStackItem: (id: string, updates: Partial<TechStackItem>) => void;
  deleteTechStackItem: (id: string) => void;
  
  // Journey operations
  addJourneyEntry: (entry: Omit<JourneyEntry, 'id' | 'timestamp'>) => void;
  updateJourneyEntry: (id: string, updates: Partial<JourneyEntry>) => void;
  deleteJourneyEntry: (id: string) => void;
  
  // Feedback operations
  addFeedback: (feedback: Omit<FeedbackItem, 'id'>) => void;
  updateFeedback: (id: string, updates: Partial<FeedbackItem>) => void;
  deleteFeedback: (id: string) => void;
  
  // App config operations
  updateAppConfig: (updates: Partial<IdeaForgeData['appConfig']>) => void;
  
  // Utility operations
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void;
  getStorageUsage: () => { used: number; available: number; percentage: number };
  
  // Auto-save
  isAutoSaveEnabled: boolean;
  toggleAutoSave: () => void;
  
  // Loading state
  isLoading: boolean;
  lastSaved: Date | null;
}

export function useIdeaForgePersistence(ideaId: string): UseIdeaForgePersistenceReturn {
  const [data, setData] = useState<IdeaForgeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAutoSaveEnabled, setIsAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Load initial data
  useEffect(() => {
    const loadData = () => {
      try {
        const ideaData = IdeaForgePersistence.getIdeaData(ideaId);
        setData(ideaData);
        setLastSaved(ideaData.lastUpdated);
      } catch (error) {
        console.error('Failed to load idea data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [ideaId]);

  // Save data helper
  const saveData = useCallback((updates: Partial<IdeaForgeData>) => {
    if (!data) return;

    const updatedData = { ...data, ...updates };
    setData(updatedData);
    
    const success = IdeaForgePersistence.saveIdeaData(ideaId, updatedData);
    if (success) {
      setLastSaved(new Date());
    }
  }, [data, ideaId]);

  // Auto-save setup
  useEffect(() => {
    if (!isAutoSaveEnabled || !data) return;

    const cleanup = IdeaForgePersistence.enableAutoSave(
      ideaId,
      () => data,
      30000 // 30 seconds
    );

    return cleanup;
  }, [ideaId, data, isAutoSaveEnabled]);

  // Wiki operations
  const addWikiSection = useCallback((section: Omit<WikiSection, 'id' | 'lastUpdated'>) => {
    if (!data) return;

    const newSection: WikiSection = {
      ...section,
      id: Date.now().toString(),
      lastUpdated: new Date()
    };

    const updatedSections = [...data.wikiSections, newSection];
    saveData({ wikiSections: updatedSections });
  }, [data, saveData]);

  const updateWikiSection = useCallback((id: string, updates: Partial<WikiSection>) => {
    if (!data) return;

    const updatedSections = data.wikiSections.map(section =>
      section.id === id 
        ? { ...section, ...updates, lastUpdated: new Date() }
        : section
    );

    saveData({ wikiSections: updatedSections });
  }, [data, saveData]);

  const deleteWikiSection = useCallback((id: string) => {
    if (!data) return;

    const updatedSections = data.wikiSections.filter(section => section.id !== id);
    saveData({ wikiSections: updatedSections });
  }, [data, saveData]);

  // Feature operations
  const addFeature = useCallback((feature: Omit<Feature, 'id'>) => {
    if (!data) return;

    const newFeature: Feature = {
      ...feature,
      id: Date.now().toString()
    };

    const updatedFeatures = [...data.features, newFeature];
    saveData({ features: updatedFeatures });
  }, [data, saveData]);

  const updateFeature = useCallback((id: string, updates: Partial<Feature>) => {
    if (!data) return;

    const updatedFeatures = data.features.map(feature =>
      feature.id === id ? { ...feature, ...updates } : feature
    );

    saveData({ features: updatedFeatures });
  }, [data, saveData]);

  const deleteFeature = useCallback((id: string) => {
    if (!data) return;

    const updatedFeatures = data.features.filter(feature => feature.id !== id);
    saveData({ features: updatedFeatures });
  }, [data, saveData]);

  const reorderFeatures = useCallback((fromIndex: number, toIndex: number) => {
    if (!data) return;

    const updatedFeatures = [...data.features];
    const [movedFeature] = updatedFeatures.splice(fromIndex, 1);
    updatedFeatures.splice(toIndex, 0, movedFeature);

    saveData({ features: updatedFeatures });
  }, [data, saveData]);

  // Tech stack operations
  const addTechStackItem = useCallback((item: Omit<TechStackItem, 'id'>) => {
    if (!data) return;

    const newItem: TechStackItem = {
      ...item,
      id: Date.now().toString()
    };

    const updatedTechStack = [...data.techStack, newItem];
    saveData({ techStack: updatedTechStack });
  }, [data, saveData]);

  const updateTechStackItem = useCallback((id: string, updates: Partial<TechStackItem>) => {
    if (!data) return;

    const updatedTechStack = data.techStack.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );

    saveData({ techStack: updatedTechStack });
  }, [data, saveData]);

  const deleteTechStackItem = useCallback((id: string) => {
    if (!data) return;

    const updatedTechStack = data.techStack.filter(item => item.id !== id);
    saveData({ techStack: updatedTechStack });
  }, [data, saveData]);

  // Journey operations
  const addJourneyEntry = useCallback((entry: Omit<JourneyEntry, 'id' | 'timestamp'>) => {
    if (!data) return;

    const newEntry: JourneyEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const updatedEntries = [...data.journeyEntries, newEntry];
    saveData({ journeyEntries: updatedEntries });
  }, [data, saveData]);

  const updateJourneyEntry = useCallback((id: string, updates: Partial<JourneyEntry>) => {
    if (!data) return;

    const updatedEntries = data.journeyEntries.map(entry =>
      entry.id === id ? { ...entry, ...updates } : entry
    );

    saveData({ journeyEntries: updatedEntries });
  }, [data, saveData]);

  const deleteJourneyEntry = useCallback((id: string) => {
    if (!data) return;

    const updatedEntries = data.journeyEntries.filter(entry => entry.id !== id);
    saveData({ journeyEntries: updatedEntries });
  }, [data, saveData]);

  // Feedback operations
  const addFeedback = useCallback((feedback: Omit<FeedbackItem, 'id'>) => {
    if (!data) return;

    const newFeedback: FeedbackItem = {
      ...feedback,
      id: Date.now().toString()
    };

    const updatedFeedback = [...data.feedback, newFeedback];
    saveData({ feedback: updatedFeedback });
  }, [data, saveData]);

  const updateFeedback = useCallback((id: string, updates: Partial<FeedbackItem>) => {
    if (!data) return;

    const updatedFeedback = data.feedback.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );

    saveData({ feedback: updatedFeedback });
  }, [data, saveData]);

  const deleteFeedback = useCallback((id: string) => {
    if (!data) return;

    const updatedFeedback = data.feedback.filter(item => item.id !== id);
    saveData({ feedback: updatedFeedback });
  }, [data, saveData]);

  // App config operations
  const updateAppConfig = useCallback((updates: Partial<IdeaForgeData['appConfig']>) => {
    if (!data) return;

    const updatedConfig = { ...data.appConfig, ...updates };
    saveData({ appConfig: updatedConfig });
  }, [data, saveData]);

  // Utility operations
  const exportData = useCallback(() => {
    return IdeaForgePersistence.exportIdeaData(ideaId);
  }, [ideaId]);

  const importData = useCallback((jsonData: string) => {
    const success = IdeaForgePersistence.importIdeaData(ideaId, jsonData);
    if (success) {
      // Reload data
      const updatedData = IdeaForgePersistence.getIdeaData(ideaId);
      setData(updatedData);
      setLastSaved(updatedData.lastUpdated);
    }
    return success;
  }, [ideaId]);

  const clearAllData = useCallback(() => {
    IdeaForgePersistence.deleteIdea(ideaId);
    const emptyData = IdeaForgePersistence.getIdeaData(ideaId);
    setData(emptyData);
    setLastSaved(null);
  }, [ideaId]);

  const getStorageUsage = useCallback(() => {
    return IdeaForgePersistence.getStorageUsage();
  }, []);

  const toggleAutoSave = useCallback(() => {
    setIsAutoSaveEnabled(prev => !prev);
  }, []);

  if (!data) {
    return {
      wikiSections: [],
      features: [],
      techStack: [],
      journeyEntries: [],
      feedback: [],
      appConfig: {
        type: 'web-app',
        platforms: ['Web'],
        targetAudience: '',
        monetization: 'Freemium'
      },
      addWikiSection: () => {},
      updateWikiSection: () => {},
      deleteWikiSection: () => {},
      addFeature: () => {},
      updateFeature: () => {},
      deleteFeature: () => {},
      reorderFeatures: () => {},
      addTechStackItem: () => {},
      updateTechStackItem: () => {},
      deleteTechStackItem: () => {},
      addJourneyEntry: () => {},
      updateJourneyEntry: () => {},
      deleteJourneyEntry: () => {},
      addFeedback: () => {},
      updateFeedback: () => {},
      deleteFeedback: () => {},
      updateAppConfig: () => {},
      exportData: () => '',
      importData: () => false,
      clearAllData: () => {},
      getStorageUsage: () => ({ used: 0, available: 0, percentage: 0 }),
      isAutoSaveEnabled: false,
      toggleAutoSave: () => {},
      isLoading: true,
      lastSaved: null
    };
  }

  return {
    wikiSections: data.wikiSections,
    features: data.features,
    techStack: data.techStack,
    journeyEntries: data.journeyEntries,
    feedback: data.feedback,
    appConfig: data.appConfig,
    addWikiSection,
    updateWikiSection,
    deleteWikiSection,
    addFeature,
    updateFeature,
    deleteFeature,
    reorderFeatures,
    addTechStackItem,
    updateTechStackItem,
    deleteTechStackItem,
    addJourneyEntry,
    updateJourneyEntry,
    deleteJourneyEntry,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    updateAppConfig,
    exportData,
    importData,
    clearAllData,
    getStorageUsage,
    isAutoSaveEnabled,
    toggleAutoSave,
    isLoading,
    lastSaved
  };
}
