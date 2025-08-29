/**
 * RAG Knowledge Base Service
 * Handles indexing and retrieval of tool documentation, blueprint examples, and MVP patterns
 * Uses embeddings for semantic search without changing existing UI/UX
 */

import { RAGTool } from '@/types/ideaforge';
import { geminiService } from './geminiService';

export interface KnowledgeDocument {
  id: string;
  type: 'tool_doc' | 'blueprint_example' | 'prompt_template' | 'architecture_pattern';
  toolId?: RAGTool;
  title: string;
  content: string;
  metadata: {
    appType?: string;
    platforms?: string[];
    complexity?: 'beginner' | 'intermediate' | 'advanced';
    tags?: string[];
    source?: string;
  };
  embedding?: number[];
}

export interface RetrievalQuery {
  query: string;
  toolId?: RAGTool;
  appType?: string;
  platforms?: string[];
  limit?: number;
}

export interface RetrievalResult {
  documents: KnowledgeDocument[];
  relevanceScores: number[];
  totalFound: number;
}

class RAGKnowledgeBaseService {
  private documents: KnowledgeDocument[] = [];
  private isInitialized = false;

  /**
   * Initialize the knowledge base with sample data
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Load sample knowledge base
    this.documents = await this.loadSampleKnowledgeBase();
    
    // Generate embeddings for all documents
    await this.generateEmbeddings();
    
    this.isInitialized = true;
    console.log(`RAG Knowledge Base initialized with ${this.documents.length} documents`);
  }

  /**
   * Retrieve relevant documents based on query
   */
  async retrieveContext(query: RetrievalQuery): Promise<RetrievalResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Generate embedding for the query
    const queryEmbedding = await this.generateQueryEmbedding(query.query);
    
    // Filter documents by tool and metadata if specified
    let filteredDocs = this.documents;
    
    if (query.toolId) {
      filteredDocs = filteredDocs.filter(doc => 
        doc.toolId === query.toolId || doc.type === 'architecture_pattern'
      );
    }
    
    if (query.appType) {
      filteredDocs = filteredDocs.filter(doc => 
        !doc.metadata.appType || doc.metadata.appType === query.appType
      );
    }

    // Calculate similarity scores
    const scoredDocs = filteredDocs.map(doc => ({
      document: doc,
      score: this.calculateSimilarity(queryEmbedding, doc.embedding || [])
    }));

    // Sort by relevance and limit results
    const sortedDocs = scoredDocs
      .sort((a, b) => b.score - a.score)
      .slice(0, query.limit || 5);

    return {
      documents: sortedDocs.map(item => item.document),
      relevanceScores: sortedDocs.map(item => item.score),
      totalFound: filteredDocs.length
    };
  }

  /**
   * Add new document to knowledge base
   */
  async addDocument(doc: Omit<KnowledgeDocument, 'id' | 'embedding'>): Promise<void> {
    const document: KnowledgeDocument = {
      ...doc,
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      embedding: await this.generateQueryEmbedding(doc.content)
    };

    this.documents.push(document);
  }

  /**
   * Load sample knowledge base with tool docs and examples
   */
  private async loadSampleKnowledgeBase(): Promise<KnowledgeDocument[]> {
    return [
      // Lovable.dev Documentation
      {
        id: 'lovable_auth_pattern',
        type: 'tool_doc',
        toolId: 'lovable',
        title: 'Lovable Authentication Pattern',
        content: `Lovable.dev uses Supabase Auth with TypeScript. Best practices:
        - Use useAuth hook for authentication state
        - Implement protected routes with auth guards
        - Handle loading states during auth checks
        - Use Supabase RLS for data security
        - Implement proper error handling for auth failures`,
        metadata: {
          appType: 'web-app',
          platforms: ['web'],
          complexity: 'intermediate',
          tags: ['authentication', 'supabase', 'typescript'],
          source: 'lovable_docs'
        }
      },
      
      // Blueprint Examples
      {
        id: 'social_app_blueprint',
        type: 'blueprint_example',
        title: 'Social Media App Blueprint',
        content: `Successful social media app structure:
        Screens: Login, Feed, Profile, Post Creation, Comments, Settings
        Data Models: User, Post, Comment, Like, Follow
        Key Features: Real-time updates, image upload, push notifications
        Architecture: React/Next.js frontend, Supabase backend, real-time subscriptions`,
        metadata: {
          appType: 'web-app',
          platforms: ['web', 'mobile'],
          complexity: 'advanced',
          tags: ['social', 'real-time', 'media'],
          source: 'blueprint_examples'
        }
      },

      // Architecture Patterns
      {
        id: 'mvp_architecture_pattern',
        type: 'architecture_pattern',
        title: 'MVP Architecture Best Practices',
        content: `MVP architecture recommendations:
        - Start with monolithic structure for simplicity
        - Use component-based UI architecture
        - Implement basic CRUD operations first
        - Add authentication early
        - Plan for scalability but don't over-engineer
        - Use established patterns (MVC, component composition)`,
        metadata: {
          complexity: 'beginner',
          tags: ['mvp', 'architecture', 'best-practices'],
          source: 'architecture_patterns'
        }
      },

      // Prompt Templates
      {
        id: 'ui_prompt_template',
        type: 'prompt_template',
        title: 'Effective UI Prompt Template',
        content: `High-quality UI prompts should include:
        - Specific layout descriptions (header, main, footer)
        - Component specifications (buttons, forms, lists)
        - Interaction behaviors (hover, click, loading states)
        - Responsive design considerations
        - Accessibility requirements
        - Visual hierarchy and spacing guidelines`,
        metadata: {
          tags: ['ui', 'prompts', 'design'],
          source: 'prompt_templates'
        }
      }
    ];
  }

  /**
   * Generate embeddings for all documents
   */
  private async generateEmbeddings(): Promise<void> {
    for (const doc of this.documents) {
      if (!doc.embedding) {
        doc.embedding = await this.generateQueryEmbedding(doc.content);
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  /**
   * Generate embedding for a query string
   */
  private async generateQueryEmbedding(text: string): Promise<number[]> {
    try {
      // Use Gemini for embeddings (fallback to simple hash-based similarity)
      const response = await geminiService.generateEmbedding(text);
      return response || this.generateSimpleEmbedding(text);
    } catch (error) {
      console.warn('Failed to generate embedding, using fallback:', error);
      return this.generateSimpleEmbedding(text);
    }
  }

  /**
   * Fallback embedding generation using simple text features
   */
  private generateSimpleEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const features = new Array(100).fill(0);
    
    // Simple feature extraction based on word frequency and position
    words.forEach((word, index) => {
      const hash = this.simpleHash(word) % 100;
      features[hash] += 1 / (index + 1); // Weight by position
    });
    
    // Normalize
    const magnitude = Math.sqrt(features.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? features.map(val => val / magnitude) : features;
  }

  /**
   * Simple hash function for fallback embedding
   */
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  private calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) return 0;
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }
    
    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);
    return magnitude > 0 ? dotProduct / magnitude : 0;
  }

  /**
   * Get knowledge base statistics
   */
  getStats() {
    const stats = {
      totalDocuments: this.documents.length,
      byType: {} as Record<string, number>,
      byTool: {} as Record<string, number>
    };

    this.documents.forEach(doc => {
      stats.byType[doc.type] = (stats.byType[doc.type] || 0) + 1;
      if (doc.toolId) {
        stats.byTool[doc.toolId] = (stats.byTool[doc.toolId] || 0) + 1;
      }
    });

    return stats;
  }
}

// Export singleton instance
export const ragKnowledgeBase = new RAGKnowledgeBaseService();
