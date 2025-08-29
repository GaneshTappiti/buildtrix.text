// IdeaForge Storage Utility
// Handles local storage operations for idea management

export interface StoredIdea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'researching' | 'validated' | 'building';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  content?: {
    problemStatement?: string;
    targetMarket?: string;
    keyFeatures?: string[];
    businessModel?: string;
    competitiveAnalysis?: string;
    marketValidation?: string;
    technicalRequirements?: string;
    timeline?: string;
    budget?: string;
    risks?: string[];
    nextSteps?: string[];
  };
  metadata?: {
    version: number;
    lastEditedBy?: string;
    collaborators?: string[];
    isPublic?: boolean;
    viewCount?: number;
    likeCount?: number;
  };
}

class IdeaForgeStorage {
  private readonly STORAGE_KEY = 'ideaforge_ideas';
  private readonly VERSION = '1.0.0';

  // Get all stored ideas
  getAllIdeas(): StoredIdea[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const data = JSON.parse(stored);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error loading ideas from storage:', error);
      return [];
    }
  }

  // Get a specific idea by ID
  getIdea(id: string): StoredIdea | null {
    const ideas = this.getAllIdeas();
    return ideas.find(idea => idea.id === id) || null;
  }

  // Save an idea (create or update)
  saveIdea(idea: Partial<StoredIdea>): StoredIdea {
    const ideas = this.getAllIdeas();
    const now = new Date().toISOString();
    
    let savedIdea: StoredIdea;
    
    if (idea.id) {
      // Update existing idea
      const index = ideas.findIndex(i => i.id === idea.id);
      if (index >= 0) {
        savedIdea = {
          ...ideas[index],
          ...idea,
          updatedAt: now,
          metadata: {
            ...ideas[index].metadata,
            version: (ideas[index].metadata?.version || 0) + 1,
            ...idea.metadata
          }
        } as StoredIdea;
        ideas[index] = savedIdea;
      } else {
        throw new Error('Idea not found for update');
      }
    } else {
      // Create new idea
      savedIdea = {
        id: this.generateId(),
        title: idea.title || 'Untitled Idea',
        description: idea.description || '',
        status: idea.status || 'draft',
        tags: idea.tags || [],
        createdAt: now,
        updatedAt: now,
        content: idea.content || {},
        metadata: {
          version: 1,
          viewCount: 0,
          likeCount: 0,
          isPublic: false,
          ...idea.metadata
        }
      };
      ideas.push(savedIdea);
    }

    this.saveToStorage(ideas);
    return savedIdea;
  }

  // Delete an idea
  deleteIdea(id: string): boolean {
    const ideas = this.getAllIdeas();
    const index = ideas.findIndex(idea => idea.id === id);
    
    if (index >= 0) {
      ideas.splice(index, 1);
      this.saveToStorage(ideas);
      return true;
    }
    
    return false;
  }

  // Search ideas
  searchIdeas(query: string): StoredIdea[] {
    const ideas = this.getAllIdeas();
    const lowercaseQuery = query.toLowerCase();
    
    return ideas.filter(idea => 
      idea.title.toLowerCase().includes(lowercaseQuery) ||
      idea.description.toLowerCase().includes(lowercaseQuery) ||
      idea.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Filter ideas by status
  getIdeasByStatus(status: StoredIdea['status']): StoredIdea[] {
    return this.getAllIdeas().filter(idea => idea.status === status);
  }

  // Get ideas by tags
  getIdeasByTags(tags: string[]): StoredIdea[] {
    const ideas = this.getAllIdeas();
    return ideas.filter(idea => 
      tags.some(tag => idea.tags.includes(tag))
    );
  }

  // Export ideas as JSON
  exportIdeas(): string {
    const ideas = this.getAllIdeas();
    return JSON.stringify({
      version: this.VERSION,
      exportDate: new Date().toISOString(),
      ideas: ideas
    }, null, 2);
  }

  // Import ideas from JSON
  importIdeas(jsonData: string): { success: boolean; imported: number; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      const errors: string[] = [];
      let imported = 0;

      if (!data.ideas || !Array.isArray(data.ideas)) {
        return { success: false, imported: 0, errors: ['Invalid import format'] };
      }

      data.ideas.forEach((idea: any, index: number) => {
        try {
          // Validate required fields
          if (!idea.title || !idea.description) {
            errors.push(`Idea ${index + 1}: Missing required fields`);
            return;
          }

          // Generate new ID to avoid conflicts
          const importedIdea = {
            ...idea,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          this.saveIdea(importedIdea);
          imported++;
        } catch (error) {
          errors.push(`Idea ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      });

      return { success: imported > 0, imported, errors };
    } catch (error) {
      return { 
        success: false, 
        imported: 0, 
        errors: [error instanceof Error ? error.message : 'Invalid JSON format'] 
      };
    }
  }

  // Clear all ideas (with confirmation)
  clearAllIdeas(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing ideas:', error);
      return false;
    }
  }

  // Get storage statistics
  getStorageStats(): { totalIdeas: number; totalSize: string; lastModified: string | null } {
    const ideas = this.getAllIdeas();
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const sizeInBytes = stored ? new Blob([stored]).size : 0;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    
    const lastModified = ideas.length > 0 
      ? ideas.reduce((latest, idea) => 
          new Date(idea.updatedAt) > new Date(latest) ? idea.updatedAt : latest, 
          ideas[0].updatedAt
        )
      : null;

    return {
      totalIdeas: ideas.length,
      totalSize: `${sizeInKB} KB`,
      lastModified
    };
  }

  // Private helper methods
  private saveToStorage(ideas: StoredIdea[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ideas));
    } catch (error) {
      console.error('Error saving to storage:', error);
      throw new Error('Failed to save ideas to storage');
    }
  }

  private generateId(): string {
    return `idea_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
const ideaForgeStorage = new IdeaForgeStorage();
export default ideaForgeStorage;
