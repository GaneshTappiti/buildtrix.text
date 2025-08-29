import {
  RAGTool,
  RAGPromptResult,
  MVPWizardData,
  AppType,
  Platform,
  RAGToolProfile,
  RAGContext
} from '@/types/ideaforge';
import { getRAGToolProfile } from './ragToolProfiles';
import { RAGDocumentationReader } from './ragDocumentationReader';

/**
 * RAG-Enhanced Generator Service
 * Adapts the Python RAG system to work with Next.js + Supabase + Gemini
 * Replaces ChromaDB with Supabase vector storage and file system with database storage
 */

export interface EnhancedPromptRequest {
  type: 'framework' | 'page' | 'linking';
  wizardData: MVPWizardData;
  selectedTool?: RAGTool;
  additionalContext?: {
    pageName?: string;
    pageData?: any;
    userPrompt?: string;
    pageNames?: string[];
  };
}

export class RAGEnhancedGenerator {
  /**
   * Create a default RAG context for when no specific tool is selected
   */
  private static createDefaultRAGContext(): RAGContext {
    return {
      toolId: 'nextjs' as RAGTool,
      toolProfile: {
        id: 'nextjs' as RAGTool,
        name: 'Generic Framework',
        description: 'Generic development framework',
        category: 'low-code',
        icon: 'framework',
        bestFor: ['General development'],
        platforms: ['web'] as Platform[],
        appTypes: ['web-app'] as AppType[],
        complexity: 'intermediate',
        pricing: 'free',
        url: ''
      },
      relevantDocs: [],
      toolSpecificPrompts: [],
      optimizationTips: ['Follow general best practices'],
      constraints: ['Standard web development constraints'],
      bestPractices: ['Use responsive design', 'Follow accessibility guidelines'],
      commonPitfalls: ['Over-engineering', 'Poor performance optimization']
    };
  }

  /**
   * Generate RAG context for a specific tool and project requirements
   */
  static async generateRAGContext(
    toolId: RAGTool,
    appType: AppType,
    platforms: Platform[],
    projectDescription: string
  ): Promise<RAGContext> {
    // Use the documentation reader to get context from existing RAG files
    return RAGDocumentationReader.generateRAGContext(toolId, appType, platforms, projectDescription);
  }

  /**
   * Generate enhanced framework prompt with RAG context
   */
  static async generateEnhancedFrameworkPrompt(
    wizardData: MVPWizardData,
    selectedTool?: RAGTool,
    userPrompt?: string
  ): Promise<RAGPromptResult> {
    const prompt = userPrompt || wizardData.userPrompt;
    
    if (!selectedTool) {
      // Generate generic framework prompt
      return {
        prompt: this.buildGenericFrameworkPrompt(wizardData, prompt),
        toolContext: this.createDefaultRAGContext(),
        confidence: 0.7,
        sources: [],
        toolSpecificOptimizations: []
      };
    }

    const ragContext = await this.generateRAGContext(
      selectedTool,
      wizardData.step1.appType,
      wizardData.step3.platforms,
      prompt
    );

    const enhancedPrompt = this.buildToolSpecificFrameworkPrompt(wizardData, prompt, ragContext);

    return {
      prompt: enhancedPrompt,
      toolContext: ragContext,
      confidence: 0.9,
      sources: ragContext.relevantDocs,
      toolSpecificOptimizations: ragContext.optimizationTips
    };
  }

  /**
   * Generate enhanced page prompt with RAG context
   */
  static async generateEnhancedPagePrompt(
    pageName: string,
    pageData: any,
    wizardData: MVPWizardData,
    selectedTool?: RAGTool
  ): Promise<RAGPromptResult> {
    if (!selectedTool) {
      return {
        prompt: this.buildGenericPagePrompt(pageName, pageData, wizardData),
        toolContext: this.createDefaultRAGContext(),
        confidence: 0.7,
        sources: [],
        toolSpecificOptimizations: []
      };
    }

    const ragContext = await this.generateRAGContext(
      selectedTool,
      wizardData.step1.appType,
      wizardData.step3.platforms,
      `Page: ${pageName} - ${pageData?.description || 'UI page design'}`
    );

    const enhancedPrompt = this.buildToolSpecificPagePrompt(pageName, pageData, wizardData, ragContext);

    return {
      prompt: enhancedPrompt,
      toolContext: ragContext,
      confidence: 0.9,
      sources: ragContext.relevantDocs,
      toolSpecificOptimizations: ragContext.optimizationTips
    };
  }

  /**
   * Generate enhanced linking prompt with RAG context
   */
  static async generateEnhancedLinkingPrompt(
    pageNames: string[],
    wizardData: MVPWizardData,
    selectedTool?: RAGTool
  ): Promise<RAGPromptResult> {
    if (!selectedTool) {
      return {
        prompt: this.buildGenericLinkingPrompt(pageNames, wizardData),
        toolContext: this.createDefaultRAGContext(),
        confidence: 0.7,
        sources: [],
        toolSpecificOptimizations: []
      };
    }

    const ragContext = await this.generateRAGContext(
      selectedTool,
      wizardData.step1.appType,
      wizardData.step3.platforms,
      `Navigation and linking for ${pageNames.length} pages: ${pageNames.join(', ')}`
    );

    const enhancedPrompt = this.buildToolSpecificLinkingPrompt(pageNames, wizardData, ragContext);

    return {
      prompt: enhancedPrompt,
      toolContext: ragContext,
      confidence: 0.9,
      sources: ragContext.relevantDocs,
      toolSpecificOptimizations: ragContext.optimizationTips
    };
  }

  /**
   * Build generic framework prompt (fallback)
   */
  private static buildGenericFrameworkPrompt(wizardData: MVPWizardData, userPrompt: string): string {
    return `# MVP Framework Generation

**Project Overview:**
- App Name: ${wizardData.step1.appName}
- App Type: ${wizardData.step1.appType}
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Theme: ${wizardData.step2.theme}
- Design Style: ${wizardData.step2.designStyle}

**Project Vision:**
${userPrompt}

**Requirements:**
Create a comprehensive framework including:
1. Page structure (5-8 pages maximum)
2. Navigation flow and user journey
3. Technical recommendations
4. Component architecture
5. User experience considerations

**Output Format:**
Provide structured JSON with pages, navigation, techStack, and userJourney.`;
  }

  /**
   * Build tool-specific framework prompt
   */
  private static buildToolSpecificFrameworkPrompt(
    wizardData: MVPWizardData,
    userPrompt: string,
    ragContext: RAGContext
  ): string {
    return `# ${ragContext.toolProfile.name} - Enhanced Framework Generation

**Project Overview:**
- App Name: ${wizardData.step1.appName}
- App Type: ${wizardData.step1.appType}
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Theme: ${wizardData.step2.theme}
- Design Style: ${wizardData.step2.designStyle}
- Target Tool: ${ragContext.toolProfile.name} (${ragContext.toolProfile.category})

**Project Vision:**
${userPrompt}

**Tool-Specific Context:**
- Complexity Level: ${ragContext.toolProfile.complexity}
- Best For: ${ragContext.toolProfile.bestFor.join(', ')}
- Pricing Model: ${ragContext.toolProfile.pricing}

**Optimization Guidelines:**
${ragContext.optimizationTips.map(tip => `- ${tip}`).join('\n')}

**Constraints to Consider:**
${ragContext.constraints.map(constraint => `- ${constraint}`).join('\n')}

**Best Practices:**
${ragContext.bestPractices.map(practice => `- ${practice}`).join('\n')}

**Avoid These Pitfalls:**
${ragContext.commonPitfalls.map(pitfall => `- ${pitfall}`).join('\n')}

**Requirements:**
Create a comprehensive framework optimized for ${ragContext.toolProfile.name} including:
1. Page structure (5-8 pages maximum) - optimized for ${ragContext.toolProfile.category} tools
2. Navigation flow specific to ${ragContext.toolProfile.name} capabilities
3. Technical recommendations leveraging ${ragContext.toolProfile.name} strengths
4. Component architecture following ${ragContext.toolProfile.name} patterns
5. User experience considerations for ${ragContext.toolProfile.complexity} complexity

**Output Format:**
Provide structured output optimized for ${ragContext.toolProfile.name} development workflow.
Include specific implementation notes for ${ragContext.toolProfile.name} features and capabilities.`;
  }

  /**
   * Build generic page prompt (fallback)
   */
  private static buildGenericPagePrompt(pageName: string, pageData: any, wizardData: MVPWizardData): string {
    return `# Page UI Generation: ${pageName}

**Project Context:**
- App: ${wizardData.step1.appName} (${wizardData.step1.appType})
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Theme: ${wizardData.step2.theme}
- Design Style: ${wizardData.step2.designStyle}

**Page Details:**
- Name: ${pageName}
- Purpose: ${pageData?.description || 'Not specified'}
- Layout: ${pageData?.layout || 'Not specified'}
- Components: ${pageData?.components?.join(', ') || 'Not specified'}

**Requirements:**
Design a complete UI for this page including:
1. Layout structure and component hierarchy
2. Visual design elements
3. Interactive behaviors
4. Responsive considerations
5. Content structure and placeholders

**Output:**
Provide detailed UI specifications ready for implementation.`;
  }

  /**
   * Build tool-specific page prompt
   */
  private static buildToolSpecificPagePrompt(
    pageName: string,
    pageData: any,
    wizardData: MVPWizardData,
    ragContext: RAGContext
  ): string {
    return `# ${ragContext.toolProfile.name} - Page UI Generation: ${pageName}

**Project Context:**
- App: ${wizardData.step1.appName} (${wizardData.step1.appType})
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Theme: ${wizardData.step2.theme}
- Design Style: ${wizardData.step2.designStyle}
- Target Tool: ${ragContext.toolProfile.name}

**Page Details:**
- Name: ${pageName}
- Purpose: ${pageData?.description || 'Not specified'}
- Layout: ${pageData?.layout || 'Not specified'}
- Components: ${pageData?.components?.join(', ') || 'Not specified'}

**${ragContext.toolProfile.name} Optimization:**
${ragContext.optimizationTips.map(tip => `- ${tip}`).join('\n')}

**Tool Constraints:**
${ragContext.constraints.map(constraint => `- ${constraint}`).join('\n')}

**Best Practices for ${ragContext.toolProfile.name}:**
${ragContext.bestPractices.map(practice => `- ${practice}`).join('\n')}

**Requirements:**
Design a complete UI optimized for ${ragContext.toolProfile.name} including:
1. Layout structure following ${ragContext.toolProfile.name} patterns
2. Visual design leveraging ${ragContext.toolProfile.name} capabilities
3. Interactive behaviors specific to ${ragContext.toolProfile.category} tools
4. Responsive design optimized for ${ragContext.toolProfile.name}
5. Content structure compatible with ${ragContext.toolProfile.name} workflow

**Output:**
Provide ${ragContext.toolProfile.name}-specific UI specifications with implementation details.`;
  }

  /**
   * Build generic linking prompt (fallback)
   */
  private static buildGenericLinkingPrompt(pageNames: string[], wizardData: MVPWizardData): string {
    return `# Navigation & Linking System

**Project Context:**
- App: ${wizardData.step1.appName} (${wizardData.step1.appType})
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Pages: ${pageNames.join(', ')}

**Requirements:**
Create a complete navigation system including:
1. Navigation structure and hierarchy
2. Routing configuration
3. User flow logic
4. Platform-specific navigation patterns
5. State management for navigation

**Output:**
Provide implementation-ready navigation specifications.`;
  }

  /**
   * Build tool-specific linking prompt
   */
  private static buildToolSpecificLinkingPrompt(
    pageNames: string[],
    wizardData: MVPWizardData,
    ragContext: RAGContext
  ): string {
    return `# ${ragContext.toolProfile.name} - Navigation & Linking System

**Project Context:**
- App: ${wizardData.step1.appName} (${wizardData.step1.appType})
- Platforms: ${wizardData.step3.platforms.join(', ')}
- Pages: ${pageNames.join(', ')}
- Target Tool: ${ragContext.toolProfile.name}

**${ragContext.toolProfile.name} Navigation Patterns:**
${ragContext.optimizationTips.map(tip => `- ${tip}`).join('\n')}

**Tool-Specific Constraints:**
${ragContext.constraints.map(constraint => `- ${constraint}`).join('\n')}

**Best Practices:**
${ragContext.bestPractices.map(practice => `- ${practice}`).join('\n')}

**Requirements:**
Create a navigation system optimized for ${ragContext.toolProfile.name} including:
1. Navigation structure following ${ragContext.toolProfile.name} conventions
2. Routing configuration compatible with ${ragContext.toolProfile.name}
3. User flow logic leveraging ${ragContext.toolProfile.name} features
4. Platform-specific patterns for ${ragContext.toolProfile.category} tools
5. State management using ${ragContext.toolProfile.name} best practices

**Output:**
Provide ${ragContext.toolProfile.name}-specific navigation implementation with detailed instructions.`;
  }
}

/**
 * Convenience function for generating RAG-enhanced prompts
 */
export async function generateRAGEnhancedPrompt(request: EnhancedPromptRequest): Promise<RAGPromptResult> {
  switch (request.type) {
    case 'framework':
      return RAGEnhancedGenerator.generateEnhancedFrameworkPrompt(
        request.wizardData,
        request.selectedTool,
        request.additionalContext?.userPrompt
      );

    case 'page':
      if (!request.additionalContext?.pageName) {
        throw new Error('Page name is required for page prompt generation');
      }
      return RAGEnhancedGenerator.generateEnhancedPagePrompt(
        request.additionalContext.pageName,
        request.additionalContext.pageData,
        request.wizardData,
        request.selectedTool
      );

    case 'linking':
      return RAGEnhancedGenerator.generateEnhancedLinkingPrompt(
        request.additionalContext?.pageNames || [],
        request.wizardData,
        request.selectedTool
      );

    default:
      throw new Error(`Unsupported prompt type: ${request.type}`);
  }
}
