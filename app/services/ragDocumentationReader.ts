import { RAGTool, RAGContext, AppType, Platform, RAG_TOOLS } from '@/types/ideaforge';
import { getRAGToolProfile } from './ragToolProfiles';
import { geminiService } from './geminiService';
import fs from 'fs';
import path from 'path';

/**
 * RAG Documentation Reader Service
 * Reads tool documentation directly from the RAG repository data folder
 * Uses existing documentation files without database complexity
 */

export interface ToolDocumentation {
  toolId: RAGTool;
  mainPrompt?: string;
  agentPrompt?: string;
  systemPrompt?: string;
  tools?: any;
  guides?: string[];
  patterns?: string[];
  examples?: string[];
}

export class RAGDocumentationReader {
  private static readonly RAG_DATA_PATH = './RAG/data';
  private static readonly RAG_INDEX_PATH = './RAG/index.json';
  private static documentationCache = new Map<RAGTool, ToolDocumentation>();
  private static ragIndex: any = null;

  /**
   * Load RAG index for efficient file mapping
   */
  private static async loadRAGIndex(): Promise<any> {
    if (this.ragIndex) return this.ragIndex;

    try {
      if (fs.existsSync(this.RAG_INDEX_PATH)) {
        const indexContent = fs.readFileSync(this.RAG_INDEX_PATH, 'utf-8');
        this.ragIndex = JSON.parse(indexContent);
        return this.ragIndex;
      }
    } catch (error) {
      console.warn('Failed to load RAG index:', error);
    }

    return null;
  }

  /**
   * Get comprehensive documentation for a specific tool
   */
  static async getToolDocumentation(toolId: RAGTool): Promise<ToolDocumentation> {
    // Check cache first
    if (this.documentationCache.has(toolId)) {
      return this.documentationCache.get(toolId)!;
    }

    // Load RAG index for efficient file mapping
    const ragIndex = await this.loadRAGIndex();
    const toolConfig = ragIndex?.structure?.data?.tools?.find((t: any) => t.id === toolId);

    const toolFolder = path.join(this.RAG_DATA_PATH, toolConfig?.folder || `${toolId}_docs`);

    if (!fs.existsSync(toolFolder)) {
      console.warn(`Tool documentation folder not found: ${toolFolder}`);
      return { toolId, guides: [], patterns: [], examples: [] };
    }

    const documentation: ToolDocumentation = {
      toolId,
      guides: [],
      patterns: [],
      examples: []
    };

    try {
      // Use index configuration if available, otherwise fallback to file scanning
      if (toolConfig?.files) {
        // Load files based on index configuration
        const { files: fileConfig } = toolConfig;

        // Load main prompt
        if (fileConfig.mainPrompt) {
          const filePath = path.join(toolFolder, fileConfig.mainPrompt);
          if (fs.existsSync(filePath)) {
            documentation.mainPrompt = fs.readFileSync(filePath, 'utf-8');
          }
        }

        // Load agent prompt
        if (fileConfig.agentPrompt) {
          const filePath = path.join(toolFolder, fileConfig.agentPrompt);
          if (fs.existsSync(filePath)) {
            documentation.agentPrompt = fs.readFileSync(filePath, 'utf-8');
          }
        }

        // Load system prompt
        if (fileConfig.systemPrompt) {
          const filePath = path.join(toolFolder, fileConfig.systemPrompt);
          if (fs.existsSync(filePath)) {
            documentation.systemPrompt = fs.readFileSync(filePath, 'utf-8');
          }
        }

        // Load tools configuration
        if (fileConfig.toolsConfig) {
          const filePath = path.join(toolFolder, fileConfig.toolsConfig);
          if (fs.existsSync(filePath)) {
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              documentation.tools = JSON.parse(content);
            } catch (e) {
              console.warn(`Failed to parse tools JSON for ${toolId}:`, e);
            }
          }
        }

        // Load guides
        if (fileConfig.guides && Array.isArray(fileConfig.guides)) {
          for (const guideFile of fileConfig.guides) {
            const filePath = path.join(toolFolder, guideFile);
            if (fs.existsSync(filePath)) {
              const content = fs.readFileSync(filePath, 'utf-8');
              documentation.guides?.push(content);
            }
          }
        }
      } else {
        // Fallback: Read all files in the tool folder
        const files = fs.readdirSync(toolFolder);

        for (const file of files) {
          const filePath = path.join(toolFolder, file);
          const content = fs.readFileSync(filePath, 'utf-8');

          // Parse different types of documentation files
          if (file.toLowerCase().includes('prompt.txt') || file.toLowerCase() === 'prompt.txt') {
            documentation.mainPrompt = content;
          } else if (file.toLowerCase().includes('agent prompt')) {
            documentation.agentPrompt = content;
          } else if (file.toLowerCase().includes('system') || file.toLowerCase().includes('comprehensive_system_prompt')) {
            documentation.systemPrompt = content;
          } else if (file.toLowerCase().includes('tools.json') || file.toLowerCase().includes('tools_config.json')) {
            try {
              documentation.tools = JSON.parse(content);
            } catch (e) {
              console.warn(`Failed to parse tools JSON for ${toolId}:`, e);
            }
          } else if (file.endsWith('.md')) {
            // Categorize markdown files
            if (file.includes('guide')) {
              documentation.guides?.push(content);
            } else if (file.includes('pattern')) {
              documentation.patterns?.push(content);
            } else {
              documentation.examples?.push(content);
            }
          }
        }
      }

      // Cache the documentation
      this.documentationCache.set(toolId, documentation);
      
    } catch (error) {
      console.error(`Error reading documentation for ${toolId}:`, error);
    }

    return documentation;
  }

  /**
   * Generate RAG context using existing documentation
   */
  static async generateRAGContext(
    toolId: RAGTool,
    appType: AppType,
    platforms: Platform[],
    projectDescription: string
  ): Promise<RAGContext> {
    const toolProfile = getRAGToolProfile(toolId);
    const documentation = await this.getToolDocumentation(toolId);

    try {
      // Create context prompt using the documentation
      const contextPrompt = `
Based on the following tool documentation and project requirements, generate optimization tips, constraints, and best practices:

**Tool:** ${toolProfile.name}
**Category:** ${toolProfile.category}
**Project Type:** ${appType}
**Platforms:** ${platforms.join(', ')}
**Description:** ${projectDescription}

**Tool Documentation Summary:**
${documentation.mainPrompt ? `Main Prompt: ${documentation.mainPrompt.substring(0, 500)}...` : ''}
${documentation.systemPrompt ? `System Prompt: ${documentation.systemPrompt.substring(0, 500)}...` : ''}
${documentation.guides?.length ? `Guides Available: ${documentation.guides.length}` : ''}

**Generate:**
1. 3-5 optimization tips specific to ${toolProfile.name}
2. 3-4 constraints or limitations
3. 3-5 best practices
4. 2-3 common pitfalls to avoid

Format as JSON:
{
  "optimizationTips": ["tip1", "tip2", ...],
  "constraints": ["constraint1", "constraint2", ...],
  "bestPractices": ["practice1", "practice2", ...],
  "commonPitfalls": ["pitfall1", "pitfall2", ...]
}
`;

      const contextResponse = await geminiService.generateText(contextPrompt, {
        temperature: 0.3,
        maxTokens: 1000
      });

      let parsedContext = {
        optimizationTips: [],
        constraints: [],
        bestPractices: [],
        commonPitfalls: []
      };

      try {
        // Try to parse JSON response
        const jsonMatch = contextResponse.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedContext = JSON.parse(jsonMatch[0]);
        }
      } catch (parseError) {
        console.warn('Failed to parse context JSON, using defaults');
      }

      return {
        toolId,
        toolProfile,
        relevantDocs: [
          documentation.mainPrompt,
          documentation.systemPrompt,
          ...(documentation.guides || [])
        ].filter(Boolean) as string[],
        toolSpecificPrompts: [
          documentation.mainPrompt,
          documentation.agentPrompt
        ].filter(Boolean) as string[],
        optimizationTips: parsedContext.optimizationTips || [
          `Leverage ${toolProfile.name}'s strengths in ${toolProfile.bestFor[0]}`,
          `Follow ${toolProfile.category} best practices`,
          `Optimize for ${toolProfile.complexity} complexity level`
        ],
        constraints: parsedContext.constraints || [
          `Consider ${toolProfile.complexity} complexity level`,
          `Platform limitations: ${platforms.join(', ')}`,
          `Tool category: ${toolProfile.category}`
        ],
        bestPractices: parsedContext.bestPractices || [
          `Use ${toolProfile.name} according to ${toolProfile.category} standards`,
          `Follow platform-specific patterns for ${platforms.join(', ')}`,
          `Implement proper error handling and validation`
        ],
        commonPitfalls: parsedContext.commonPitfalls || [
          `Avoid over-complicating for ${toolProfile.complexity} complexity level`,
          `Don't ignore ${toolProfile.category} specific limitations`,
          `Be mindful of ${toolProfile.pricing} pricing implications`
        ]
      };

    } catch (error) {
      console.error('Error generating RAG context:', error);
      
      // Fallback context using documentation
      return {
        toolId,
        toolProfile,
        relevantDocs: [documentation.mainPrompt || ''].filter(Boolean) as string[],
        toolSpecificPrompts: [documentation.mainPrompt || ''].filter(Boolean) as string[],
        optimizationTips: [`Use ${toolProfile.name} effectively for ${toolProfile.bestFor[0]}`],
        constraints: [`Consider ${toolProfile.complexity} complexity`],
        bestPractices: [`Follow ${toolProfile.name} best practices`],
        commonPitfalls: [`Avoid common ${toolProfile.name} mistakes`]
      };
    }
  }

  /**
   * Get tool-specific prompt templates
   */
  static async getToolPromptTemplates(toolId: RAGTool): Promise<{
    framework?: string;
    page?: string;
    linking?: string;
  }> {
    const documentation = await this.getToolDocumentation(toolId);
    
    return {
      framework: documentation.mainPrompt || documentation.systemPrompt,
      page: documentation.agentPrompt || documentation.mainPrompt,
      linking: documentation.systemPrompt || documentation.mainPrompt
    };
  }

  /**
   * Extract key insights from tool documentation
   */
  static async extractToolInsights(toolId: RAGTool): Promise<{
    keyFeatures: string[];
    workflowPatterns: string[];
    integrationTips: string[];
  }> {
    const documentation = await this.getToolDocumentation(toolId);
    const toolProfile = getRAGToolProfile(toolId);

    // Use Gemini to extract insights from documentation
    const insightPrompt = `
Analyze this tool documentation and extract key insights:

**Tool:** ${toolProfile.name}
**Documentation:** ${documentation.mainPrompt?.substring(0, 1000) || 'Limited documentation available'}

Extract:
1. Key features and capabilities
2. Workflow patterns and best practices
3. Integration tips and recommendations

Format as JSON:
{
  "keyFeatures": ["feature1", "feature2", ...],
  "workflowPatterns": ["pattern1", "pattern2", ...],
  "integrationTips": ["tip1", "tip2", ...]
}
`;

    try {
      const response = await geminiService.generateText(insightPrompt, {
        temperature: 0.2,
        maxTokens: 800
      });

      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.warn('Failed to extract tool insights:', error);
    }

    // Fallback insights
    return {
      keyFeatures: toolProfile.bestFor,
      workflowPatterns: [`${toolProfile.category} development patterns`],
      integrationTips: [`Optimize for ${toolProfile.complexity} complexity`]
    };
  }

  /**
   * Clear documentation cache (useful for development)
   */
  static clearCache(): void {
    this.documentationCache.clear();
  }

  /**
   * Get all available tools with documentation
   */
  static getAvailableToolsWithDocs(): RAGTool[] {
    const dataDir = this.RAG_DATA_PATH;
    
    if (!fs.existsSync(dataDir)) {
      console.warn(`RAG data directory not found: ${dataDir}`);
      return [];
    }

    try {
      const folders = fs.readdirSync(dataDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
        .filter(name => name.endsWith('_docs'))
        .map(name => name.replace('_docs', '') as RAGTool)
        .filter(toolId => RAG_TOOLS.includes(toolId));

      return folders;
    } catch (error) {
      console.error('Error reading available tools:', error);
      return [];
    }
  }
}

/**
 * Convenience function to get RAG context
 */
export async function getRAGContext(
  toolId: RAGTool,
  appType: AppType,
  platforms: Platform[],
  projectDescription: string
): Promise<RAGContext> {
  return RAGDocumentationReader.generateRAGContext(toolId, appType, platforms, projectDescription);
}

/**
 * Convenience function to get tool documentation
 */
export async function getToolDocumentation(toolId: RAGTool): Promise<ToolDocumentation> {
  return RAGDocumentationReader.getToolDocumentation(toolId);
}
