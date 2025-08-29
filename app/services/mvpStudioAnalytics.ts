"use client"

import { useCallback } from 'react';

/**
 * MVP Studio Analytics Service
 * Provides analytics tracking for MVP Studio usage
 */

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
}

export interface WizardAnalytics {
  stepStarted: (step: number) => void;
  stepCompleted: (step: number, data?: any) => void;
  toolSelected: (toolId: string) => void;
  promptGenerated: (type: string, success: boolean) => void;
  exportCompleted: (format: string) => void;
  error: (error: string, context?: any) => void;
}

// Mock analytics implementation for now
class MVPStudioAnalytics {
  private events: AnalyticsEvent[] = [];

  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties,
      timestamp: new Date()
    };
    
    this.events.push(analyticsEvent);
    
    // In a real implementation, this would send to analytics service
    console.log('Analytics Event:', analyticsEvent);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }
}

const analyticsInstance = new MVPStudioAnalytics();

export function useAnalytics(): WizardAnalytics {
  const stepStarted = useCallback((step: number) => {
    analyticsInstance.track('wizard_step_started', { step });
  }, []);

  const stepCompleted = useCallback((step: number, data?: any) => {
    analyticsInstance.track('wizard_step_completed', { step, data });
  }, []);

  const toolSelected = useCallback((toolId: string) => {
    analyticsInstance.track('tool_selected', { toolId });
  }, []);

  const promptGenerated = useCallback((type: string, success: boolean) => {
    analyticsInstance.track('prompt_generated', { type, success });
  }, []);

  const exportCompleted = useCallback((format: string) => {
    analyticsInstance.track('export_completed', { format });
  }, []);

  const error = useCallback((error: string, context?: any) => {
    analyticsInstance.track('error', { error, context });
  }, []);

  return {
    stepStarted,
    stepCompleted,
    toolSelected,
    promptGenerated,
    exportCompleted,
    error
  };
}

export default analyticsInstance;
