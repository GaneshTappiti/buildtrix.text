// IdeaForge Data Persistence Utility
// Handles localStorage operations for WikiSections, Features, Journey entries, and Feedback

export interface WikiSection {
  id: string;
  title: string;
  content: string;
  category: 'market' | 'problem' | 'solution' | 'competition' | 'business' | 'technical' | 'other';
  lastUpdated: Date;
  tags: string[];
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  category: 'core' | 'enhancement' | 'integration' | 'ui-ux';
  estimatedHours?: number;
}

export interface TechStackItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'infrastructure' | 'tools';
  description: string;
  reason: string;
}

export interface JourneyEntry {
  id: string;
  title: string;
  content: string;
  type: 'insight' | 'research' | 'analysis' | 'milestone' | 'decision';
  timestamp: Date;
  tags: string[];
}

export interface FeedbackItem {
  id: string;
  author: string;
  content: string;
  type: 'positive' | 'negative' | 'suggestion';
  timestamp: string;
  likes: number;
}

export interface IdeaForgeData {
  ideaId: string;
  wikiSections: WikiSection[];
  features: Feature[];
  techStack: TechStackItem[];
  journeyEntries: JourneyEntry[];
  feedback: FeedbackItem[];
  appConfig: {
    type: 'web-app' | 'mobile-app' | 'desktop-app' | 'browser-extension';
    platforms: string[];
    targetAudience: string;
    monetization: string;
  };
  lastUpdated: Date;
}

class IdeaForgePersistence {
  private static instance: IdeaForgePersistence;
  private readonly STORAGE_KEY = 'ideaforge_data';
  private readonly VERSION = '1.0';

  private constructor() {}

  static getInstance(): IdeaForgePersistence {
    if (!IdeaForgePersistence.instance) {
      IdeaForgePersistence.instance = new IdeaForgePersistence();
    }
    return IdeaForgePersistence.instance;
  }

  // Save complete idea data
  saveIdeaData(ideaId: string, data: Partial<IdeaForgeData>): boolean {
    try {
      const existingData = this.getIdeaData(ideaId);
      const updatedData: IdeaForgeData = {
        ...existingData,
        ...data,
        ideaId,
        lastUpdated: new Date()
      };

      const allData = this.getAllIdeas();
      allData[ideaId] = updatedData;

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        version: this.VERSION,
        data: allData,
        lastSync: new Date().toISOString()
      }));

      return true;
    } catch (error) {
      console.error('Failed to save idea data:', error);
      return false;
    }
  }

  // Get idea data by ID
  getIdeaData(ideaId: string): IdeaForgeData {
    const defaultData: IdeaForgeData = {
      ideaId,
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
      lastUpdated: new Date()
    };

    try {
      const allData = this.getAllIdeas();
      const ideaData = allData[ideaId];
      
      if (ideaData) {
        // Convert date strings back to Date objects
        return {
          ...ideaData,
          lastUpdated: new Date(ideaData.lastUpdated),
          wikiSections: ideaData.wikiSections.map(section => ({
            ...section,
            lastUpdated: new Date(section.lastUpdated)
          })),
          journeyEntries: ideaData.journeyEntries.map(entry => ({
            ...entry,
            timestamp: new Date(entry.timestamp)
          }))
        };
      }

      return defaultData;
    } catch (error) {
      console.error('Failed to get idea data:', error);
      return defaultData;
    }
  }

  // Get all ideas
  getAllIdeas(): Record<string, IdeaForgeData> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return {};

      const parsed = JSON.parse(stored);
      return parsed.data || {};
    } catch (error) {
      console.error('Failed to get all ideas:', error);
      return {};
    }
  }

  // Save wiki sections
  saveWikiSections(ideaId: string, sections: WikiSection[]): boolean {
    return this.saveIdeaData(ideaId, { wikiSections: sections });
  }

  // Save features
  saveFeatures(ideaId: string, features: Feature[]): boolean {
    return this.saveIdeaData(ideaId, { features });
  }

  // Save tech stack
  saveTechStack(ideaId: string, techStack: TechStackItem[]): boolean {
    return this.saveIdeaData(ideaId, { techStack });
  }

  // Save journey entries
  saveJourneyEntries(ideaId: string, journeyEntries: JourneyEntry[]): boolean {
    return this.saveIdeaData(ideaId, { journeyEntries });
  }

  // Save feedback
  saveFeedback(ideaId: string, feedback: FeedbackItem[]): boolean {
    return this.saveIdeaData(ideaId, { feedback });
  }

  // Delete idea
  deleteIdea(ideaId: string): boolean {
    try {
      const allData = this.getAllIdeas();
      delete allData[ideaId];

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        version: this.VERSION,
        data: allData,
        lastSync: new Date().toISOString()
      }));

      return true;
    } catch (error) {
      console.error('Failed to delete idea:', error);
      return false;
    }
  }

  // Export idea data
  exportIdeaData(ideaId: string): string {
    const data = this.getIdeaData(ideaId);
    return JSON.stringify(data, null, 2);
  }

  // Import idea data
  importIdeaData(ideaId: string, jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData) as IdeaForgeData;
      return this.saveIdeaData(ideaId, data);
    } catch (error) {
      console.error('Failed to import idea data:', error);
      return false;
    }
  }

  // Get storage usage
  getStorageUsage(): { used: number; available: number; percentage: number } {
    try {
      const used = new Blob([localStorage.getItem(this.STORAGE_KEY) || '']).size;
      const available = 5 * 1024 * 1024; // 5MB typical localStorage limit
      const percentage = (used / available) * 100;

      return { used, available, percentage };
    } catch (error) {
      return { used: 0, available: 5 * 1024 * 1024, percentage: 0 };
    }
  }

  // Clear all data
  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }

  // Auto-save functionality
  enableAutoSave(ideaId: string, callback: () => Partial<IdeaForgeData>, intervalMs: number = 30000): () => void {
    const interval = setInterval(() => {
      const data = callback();
      this.saveIdeaData(ideaId, data);
    }, intervalMs);

    return () => clearInterval(interval);
  }

  // Backup data to file
  backupToFile(ideaId?: string): void {
    try {
      const data = ideaId ? this.getIdeaData(ideaId) : this.getAllIdeas();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ideaforge-backup-${ideaId || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to backup data:', error);
    }
  }

  // Restore data from file
  restoreFromFile(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          // Handle single idea or multiple ideas
          if (data.ideaId) {
            // Single idea
            resolve(this.saveIdeaData(data.ideaId, data));
          } else {
            // Multiple ideas
            let success = true;
            Object.entries(data).forEach(([ideaId, ideaData]) => {
              if (!this.saveIdeaData(ideaId, ideaData as IdeaForgeData)) {
                success = false;
              }
            });
            resolve(success);
          }
        } catch (error) {
          console.error('Failed to restore data:', error);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }
}

export default IdeaForgePersistence.getInstance();
