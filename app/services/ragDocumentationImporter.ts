import { supabase } from '@/lib/supabase';
import { RAGTool } from '@/types/ideaforge';
import { geminiService } from './geminiService';
import fs from 'fs';
import path from 'path';

/**
 * RAG Documentation Importer Service
 * Imports tool documentation from the RAG repository into Supabase
 * Converts file-based system to database storage with vector embeddings
 */

export interface ToolDocumentationFile {
  toolId: RAGTool;
  filePath: string;
  documentType: 'prompt_template' | 'best_practices' | 'constraints' | 'examples' | 'api_reference' | 'user_guide' | 'troubleshooting';
  title: string;
  content: string;
  promptTemplate?: string;
  stage?: 'app_skeleton' | 'page_ui' | 'flow_connections' | 'feature_specific' | 'debugging' | 'optimization';
}

export interface ToolOptimization {
  toolId: RAGTool;
  category: 'optimization_tip' | 'constraint' | 'best_practice' | 'common_pitfall';
  title: string;
  description: string;
  appTypes?: string[];
  platforms?: string[];
  complexityLevels?: string[];
  priority?: number;
  effectivenessScore?: number;
}

export class RAGDocumentationImporter {
  private static readonly RAG_DATA_PATH = './RAG/data';
  private static readonly RAG_CONFIG_PATH = './RAG/config/tools';

  /**
   * Import all tool documentation from RAG repository
   */
  static async importAllToolDocumentation(): Promise<void> {
    console.log('Starting RAG documentation import...');

    try {
      // Get list of available tools from RAG repository
      const toolFolders = await this.getAvailableToolFolders();
      
      for (const toolId of toolFolders) {
        console.log(`Importing documentation for ${toolId}...`);
        
        try {
          // Import documentation files
          await this.importToolDocumentation(toolId);
          
          // Import optimization data from config
          await this.importToolOptimizations(toolId);
          
          console.log(`✅ Successfully imported ${toolId}`);
        } catch (error) {
          console.error(`❌ Failed to import ${toolId}:`, error);
        }
      }

      console.log('✅ RAG documentation import completed');
    } catch (error) {
      console.error('❌ RAG documentation import failed:', error);
      throw error;
    }
  }

  /**
   * Import documentation for a specific tool
   */
  static async importToolDocumentation(toolId: RAGTool): Promise<void> {
    const toolFolder = path.join(this.RAG_DATA_PATH, `${toolId}_docs`);
    
    if (!fs.existsSync(toolFolder)) {
      console.warn(`Tool folder not found: ${toolFolder}`);
      return;
    }

    const files = fs.readdirSync(toolFolder);
    const documentationFiles: ToolDocumentationFile[] = [];

    for (const file of files) {
      const filePath = path.join(toolFolder, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Determine document type and stage based on filename
      const docInfo = this.parseDocumentInfo(file, content);
      
      documentationFiles.push({
        toolId,
        filePath: file,
        documentType: docInfo.documentType,
        title: docInfo.title,
        content: content,
        promptTemplate: docInfo.promptTemplate,
        stage: docInfo.stage
      });
    }

    // Insert documentation into Supabase
    for (const doc of documentationFiles) {
      await this.insertDocumentation(doc);
    }
  }

  /**
   * Import tool optimizations from config files
   */
  static async importToolOptimizations(toolId: RAGTool): Promise<void> {
    const configFile = path.join(this.RAG_CONFIG_PATH, `${toolId}.yaml`);
    
    if (!fs.existsSync(configFile)) {
      console.warn(`Config file not found: ${configFile}`);
      return;
    }

    try {
      // Read and parse YAML config (simplified - you might want to use a YAML parser)
      const configContent = fs.readFileSync(configFile, 'utf-8');
      const optimizations = this.parseToolConfig(toolId, configContent);

      // Insert optimizations into Supabase
      for (const optimization of optimizations) {
        await this.insertOptimization(optimization);
      }
    } catch (error) {
      console.error(`Failed to parse config for ${toolId}:`, error);
    }
  }

  /**
   * Insert documentation with vector embedding
   */
  private static async insertDocumentation(doc: ToolDocumentationFile): Promise<void> {
    try {
      // Generate embedding for the content
      const embedding = await this.generateEmbedding(doc.content);

      const { error } = await supabase
        .from('rag_tool_documentation')
        .upsert({
          tool_id: doc.toolId,
          document_type: doc.documentType,
          title: doc.title,
          content: doc.content,
          prompt_template: doc.promptTemplate,
          stage: doc.stage,
          source_file: doc.filePath,
          embedding: embedding,
          is_active: true
        }, {
          onConflict: 'tool_id,document_type,title'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Failed to insert documentation for ${doc.toolId}:`, error);
      throw error;
    }
  }

  /**
   * Insert tool optimization
   */
  private static async insertOptimization(optimization: ToolOptimization): Promise<void> {
    try {
      const { error } = await supabase
        .from('rag_tool_optimizations')
        .upsert({
          tool_id: optimization.toolId,
          category: optimization.category,
          title: optimization.title,
          description: optimization.description,
          app_types: optimization.appTypes || [],
          platforms: optimization.platforms || [],
          complexity_levels: optimization.complexityLevels || [],
          priority: optimization.priority || 1,
          effectiveness_score: optimization.effectivenessScore || 0.8,
          is_active: true
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Failed to insert optimization for ${optimization.toolId}:`, error);
      throw error;
    }
  }

  /**
   * Generate vector embedding for text content
   */
  private static async generateEmbedding(text: string): Promise<number[]> {
    try {
      // Use Gemini to generate embeddings
      // Note: This is a simplified approach - you might want to use a dedicated embedding service
      const response = await geminiService.generateEmbedding(text);
      return response || new Array(1536).fill(0);
    } catch (error) {
      console.error('Failed to generate embedding:', error);
      // Return a zero vector as fallback
      return new Array(1536).fill(0);
    }
  }

  /**
   * Get available tool folders from RAG repository
   */
  private static async getAvailableToolFolders(): Promise<RAGTool[]> {
    const dataDir = this.RAG_DATA_PATH;
    
    if (!fs.existsSync(dataDir)) {
      throw new Error(`RAG data directory not found: ${dataDir}`);
    }

    const folders = fs.readdirSync(dataDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => name.endsWith('_docs'))
      .map(name => name.replace('_docs', '') as RAGTool);

    return folders;
  }

  /**
   * Parse document information from filename and content
   */
  private static parseDocumentInfo(filename: string, content: string): {
    documentType: ToolDocumentationFile['documentType'];
    title: string;
    promptTemplate?: string;
    stage?: ToolDocumentationFile['stage'];
  } {
    const lowerFilename = filename.toLowerCase();
    
    // Determine document type
    let documentType: ToolDocumentationFile['documentType'] = 'user_guide';
    let stage: ToolDocumentationFile['stage'] | undefined;

    if (lowerFilename.includes('prompt')) {
      documentType = 'prompt_template';
      
      // Determine stage from content or filename
      if (lowerFilename.includes('skeleton') || content.includes('skeleton')) {
        stage = 'app_skeleton';
      } else if (lowerFilename.includes('ui') || lowerFilename.includes('page')) {
        stage = 'page_ui';
      } else if (lowerFilename.includes('flow') || lowerFilename.includes('connection')) {
        stage = 'flow_connections';
      }
    } else if (lowerFilename.includes('example')) {
      documentType = 'examples';
    } else if (lowerFilename.includes('api') || lowerFilename.includes('reference')) {
      documentType = 'api_reference';
    } else if (lowerFilename.includes('troubleshoot')) {
      documentType = 'troubleshooting';
    } else if (lowerFilename.includes('best') || lowerFilename.includes('practice')) {
      documentType = 'best_practices';
    } else if (lowerFilename.includes('constraint')) {
      documentType = 'constraints';
    }

    // Extract title from filename
    const title = filename
      .replace(/\.[^/.]+$/, '') // Remove extension
      .replace(/[_-]/g, ' ') // Replace underscores and hyphens with spaces
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words

    // Extract prompt template if it's a prompt file
    const promptTemplate = documentType === 'prompt_template' ? content : undefined;

    return {
      documentType,
      title,
      promptTemplate,
      stage
    };
  }

  /**
   * Parse tool configuration from YAML content
   */
  private static parseToolConfig(toolId: RAGTool, configContent: string): ToolOptimization[] {
    const optimizations: ToolOptimization[] = [];

    try {
      // Simple YAML parsing for key sections
      // In a real implementation, you'd use a proper YAML parser like js-yaml
      
      // Extract optimization tips
      const optimizationTips = this.extractYamlArray(configContent, 'optimization_tips');
      optimizationTips.forEach((tip, index) => {
        optimizations.push({
          toolId,
          category: 'optimization_tip',
          title: `Optimization Tip ${index + 1}`,
          description: tip,
          priority: index + 1,
          effectivenessScore: 0.8
        });
      });

      // Extract constraints
      const constraints = this.extractYamlArray(configContent, 'constraints');
      constraints.forEach((constraint, index) => {
        optimizations.push({
          toolId,
          category: 'constraint',
          title: `Constraint ${index + 1}`,
          description: constraint,
          priority: index + 1,
          effectivenessScore: 0.9
        });
      });

      // Extract best practices
      const bestPractices = this.extractYamlArray(configContent, 'best_practices');
      bestPractices.forEach((practice, index) => {
        optimizations.push({
          toolId,
          category: 'best_practice',
          title: `Best Practice ${index + 1}`,
          description: practice,
          priority: index + 1,
          effectivenessScore: 0.85
        });
      });

    } catch (error) {
      console.error(`Failed to parse config for ${toolId}:`, error);
    }

    return optimizations;
  }

  /**
   * Extract array values from YAML content (simplified parser)
   */
  private static extractYamlArray(content: string, key: string): string[] {
    const lines = content.split('\n');
    const result: string[] = [];
    let inSection = false;
    let currentIndent = 0;

    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed.startsWith(`${key}:`)) {
        inSection = true;
        currentIndent = line.length - line.trimLeft().length;
        continue;
      }

      if (inSection) {
        const lineIndent = line.length - line.trimLeft().length;
        
        if (lineIndent <= currentIndent && trimmed && !trimmed.startsWith('-')) {
          // End of section
          break;
        }

        if (trimmed.startsWith('-')) {
          const value = trimmed.substring(1).trim();
          if (value) {
            result.push(value);
          }
        }
      }
    }

    return result;
  }
}

/**
 * Utility function to run the import process
 */
export async function importRAGDocumentation(): Promise<void> {
  return RAGDocumentationImporter.importAllToolDocumentation();
}
