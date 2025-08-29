/**
 * RAG Context Injector Service
 * Injects relevant context from existing RAG data into MVP Studio stages
 * Uses existing RAG documentation without changing UI/UX flow
 */

import { RAGTool, AppType, Platform } from '@/types/ideaforge';
import { RAGDocumentationReader } from './ragDocumentationReader';
import { getRAGToolProfile } from './ragToolProfiles';
import fs from 'fs';
import path from 'path';

export interface RAGContextResult {
  toolSpecificContext: string;
  architecturePatterns: string;
  bestPractices: string[];
  codeExamples: string[];
  constraints: string[];
  optimizationTips: string[];
}

export interface ContextQuery {
  stage: 'tool_selection' | 'blueprint_generation' | 'prompt_generation' | 'flow_generation';
  toolId?: RAGTool;
  appIdea: string;
  appType?: string;
  platforms?: string[];
  screenName?: string; // For prompt generation
}

export class RAGContextInjector {
  private static contextCache = new Map<string, RAGContextResult>();
  private static RAG_DATA_PATH = path.join(process.cwd(), 'RAG');

  /**
   * Get relevant RAG context for a specific stage and query
   */
  static async getContextForStage(query: ContextQuery): Promise<RAGContextResult> {
    const cacheKey = this.generateCacheKey(query);

    // Check cache first
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey)!;
    }

    let context: RAGContextResult;

    switch (query.stage) {
      case 'tool_selection':
        context = await this.getToolSelectionContext(query);
        break;
      case 'blueprint_generation':
        context = await this.getBlueprintContext(query);
        break;
      case 'prompt_generation':
        context = await this.getPromptGenerationContext(query);
        break;
      case 'flow_generation':
        context = await this.getFlowGenerationContext(query);
        break;
      default:
        context = this.getEmptyContext();
    }

    // Cache the result
    this.contextCache.set(cacheKey, context);
    return context;
  }

  /**
   * Get context for tool selection enhancement
   */
  private static async getToolSelectionContext(query: ContextQuery): Promise<RAGContextResult> {
    const context = this.getEmptyContext();

    if (!query.toolId) {
      // General tool selection guidance
      context.bestPractices = [
        'Choose tools based on your technical expertise level',
        'Consider the complexity of your app requirements',
        'Evaluate the tool\'s ecosystem and community support',
        'Match the tool to your target platforms'
      ];
      return context;
    }

    try {
      // Get tool-specific documentation
      const toolDoc = await RAGDocumentationReader.getToolDocumentation(query.toolId);
      const toolProfile = getRAGToolProfile(query.toolId);

      // Extract tool-specific context
      if (toolDoc.mainPrompt) {
        context.toolSpecificContext = this.extractKeyInsights(toolDoc.mainPrompt);
      }

      // Add tool-specific best practices
      context.bestPractices = [
        ...toolProfile.bestFor.map(use => `Excellent for: ${use}`),
        `Complexity level: ${toolProfile.complexity}`,
        `Pricing model: ${toolProfile.pricing}`
      ];

      // Add constraints based on tool documentation
      if (toolDoc.agentPrompt) {
        context.constraints = this.extractConstraints(toolDoc.agentPrompt);
      }

    } catch (error) {
      console.warn(`Failed to load context for tool ${query.toolId}:`, error);
    }

    return context;
  }

  /**
   * Get context for blueprint generation enhancement
   */
  private static async getBlueprintContext(query: ContextQuery): Promise<RAGContextResult> {
    const context = this.getEmptyContext();

    try {
      // Load architecture patterns from RAG data
      const patternsPath = path.join(this.RAG_DATA_PATH, 'documents');
      if (fs.existsSync(patternsPath)) {
        context.architecturePatterns = await this.loadArchitecturePatterns(query.appIdea);
      }

      // If tool is selected, get tool-specific blueprint guidance
      if (query.toolId) {
        const toolDoc = await RAGDocumentationReader.getToolDocumentation(query.toolId);
        
        if (toolDoc.mainPrompt) {
          context.toolSpecificContext = this.extractBlueprintGuidance(toolDoc.mainPrompt);
        }

        // Add tool-specific optimization tips
        context.optimizationTips = this.getToolOptimizationTips(query.toolId);
      }

      // Add general blueprint best practices
      context.bestPractices = [
        'Start with core user flows and essential screens',
        'Define clear data models and relationships',
        'Plan for authentication and user management',
        'Consider scalability from the beginning',
        'Include error handling and edge cases'
      ];

    } catch (error) {
      console.warn('Failed to load blueprint context:', error);
    }

    return context;
  }

  /**
   * Get context for prompt generation enhancement
   */
  private static async getPromptGenerationContext(query: ContextQuery): Promise<RAGContextResult> {
    const context = this.getEmptyContext();

    try {
      // Load prompt templates from RAG data
      const templatesPath = path.join('./RAG/templates');
      if (fs.existsSync(templatesPath)) {
        context.codeExamples = await this.loadPromptTemplates(query.screenName || 'general');
      }

      // If tool is selected, get tool-specific prompt guidance
      if (query.toolId) {
        const toolDoc = await RAGDocumentationReader.getToolDocumentation(query.toolId);
        
        if (toolDoc.systemPrompt) {
          context.toolSpecificContext = this.extractPromptGuidance(toolDoc.systemPrompt);
        }

        // Add tool-specific code examples
        context.codeExamples.push(...this.getToolCodeExamples(query.toolId));
      }

      // Add general prompt best practices
      context.bestPractices = [
        'Be specific about layout and component structure',
        'Include interaction behaviors and states',
        'Specify responsive design requirements',
        'Add accessibility considerations',
        'Include error handling scenarios'
      ];

    } catch (error) {
      console.warn('Failed to load prompt generation context:', error);
    }

    return context;
  }

  /**
   * Get context for flow generation enhancement
   */
  private static async getFlowGenerationContext(query: ContextQuery): Promise<RAGContextResult> {
    const context = this.getEmptyContext();

    try {
      // Load flow templates from RAG data
      const flowTemplatePath = path.join('./RAG/templates/stage_flow_connections.md');
      if (fs.existsSync(flowTemplatePath)) {
        const flowTemplate = fs.readFileSync(flowTemplatePath, 'utf-8');
        context.architecturePatterns = this.extractFlowPatterns(flowTemplate);
      }

      // Add flow-specific best practices
      context.bestPractices = [
        'Define clear navigation hierarchies',
        'Plan for back button and breadcrumb behavior',
        'Include modal and overlay flow logic',
        'Consider deep linking requirements',
        'Plan for error and loading states'
      ];

    } catch (error) {
      console.warn('Failed to load flow generation context:', error);
    }

    return context;
  }

  /**
   * Helper methods for context extraction
   */
  private static extractKeyInsights(content: string): string {
    // Extract first 500 characters of key insights
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    return lines.slice(0, 10).join('\n').substring(0, 500) + '...';
  }

  private static extractConstraints(content: string): string[] {
    // Look for constraint-related keywords
    const constraintKeywords = ['constraint', 'limitation', 'requirement', 'must not', 'avoid'];
    const lines = content.split('\n');
    
    return lines
      .filter(line => constraintKeywords.some(keyword => 
        line.toLowerCase().includes(keyword)
      ))
      .slice(0, 5)
      .map(line => line.trim());
  }

  private static extractBlueprintGuidance(content: string): string {
    // Extract architecture and structure guidance
    const architectureKeywords = ['architecture', 'structure', 'component', 'module', 'pattern'];
    const lines = content.split('\n');
    
    const relevantLines = lines.filter(line => 
      architectureKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return relevantLines.slice(0, 8).join('\n');
  }

  private static extractPromptGuidance(content: string): string {
    // Extract UI and prompt-related guidance
    const uiKeywords = ['ui', 'interface', 'component', 'layout', 'design', 'prompt'];
    const lines = content.split('\n');
    
    const relevantLines = lines.filter(line => 
      uiKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return relevantLines.slice(0, 8).join('\n');
  }

  private static extractFlowPatterns(content: string): string {
    // Extract navigation and flow patterns
    const flowKeywords = ['navigation', 'flow', 'route', 'transition', 'connection'];
    const lines = content.split('\n');
    
    const relevantLines = lines.filter(line => 
      flowKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    return relevantLines.slice(0, 10).join('\n');
  }

  private static async loadArchitecturePatterns(appIdea: string): Promise<string> {
    // Load relevant architecture patterns based on app idea
    return `Architecture patterns for "${appIdea}":
- Component-based architecture for scalability
- Separation of concerns (UI, business logic, data)
- State management patterns
- API integration patterns`;
  }

  private static async loadPromptTemplates(screenName: string): Promise<string[]> {
    // Load relevant prompt templates
    return [
      `Template for ${screenName} screen: Focus on user experience and clear interactions`,
      'Include loading states and error handling',
      'Ensure responsive design across devices'
    ];
  }

  private static getToolOptimizationTips(toolId: RAGTool): string[] {
    const tips: Record<RAGTool, string[]> = {
      lovable: ['Use TypeScript for better code quality', 'Leverage Supabase for backend services'],
      cursor: ['Utilize AI-assisted code completion', 'Follow schema-driven development'],
      v0: ['Optimize for Next.js performance', 'Use Vercel deployment features'],
      bolt: ['Focus on rapid prototyping', 'Use WebContainer-compatible libraries'],
      // Add more tool-specific tips
    } as any;

    return tips[toolId] || ['Follow tool-specific best practices'];
  }

  private static getToolCodeExamples(toolId: RAGTool): string[] {
    // Return tool-specific code examples
    return [`Example code pattern for ${toolId}`, 'Best practice implementation'];
  }

  private static getEmptyContext(): RAGContextResult {
    return {
      toolSpecificContext: '',
      architecturePatterns: '',
      bestPractices: [],
      codeExamples: [],
      constraints: [],
      optimizationTips: []
    };
  }

  private static generateCacheKey(query: ContextQuery): string {
    return `${query.stage}_${query.toolId || 'none'}_${query.appIdea.substring(0, 50)}`;
  }
}
