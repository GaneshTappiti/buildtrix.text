/**
 * Enhanced text formatting utilities for AI-generated content
 * Handles proper parsing, cleaning, and structuring of AI responses
 */

export interface ParsedSection {
  id: string;
  type: 'header' | 'text' | 'list' | 'code' | 'quote' | 'table' | 'numbered-list';
  level?: number; // For headers (1-6)
  title?: string;
  content: string;
  rawContent: string;
  metadata?: Record<string, any>;
}

export interface FormattingOptions {
  preserveWhitespace?: boolean;
  normalizeLineBreaks?: boolean;
  trimSections?: boolean;
  enhanceMarkdown?: boolean;
  detectCodeBlocks?: boolean;
  parseNumberedSections?: boolean;
}

export class TextFormatter {
  private static readonly DEFAULT_OPTIONS: FormattingOptions = {
    preserveWhitespace: false,
    normalizeLineBreaks: true,
    trimSections: true,
    enhanceMarkdown: true,
    detectCodeBlocks: true,
    parseNumberedSections: true,
  };

  /**
   * Clean and normalize raw AI response text
   */
  static cleanText(text: string, options: Partial<FormattingOptions> = {}): string {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    if (!text || typeof text !== 'string') return '';

    let cleaned = text;

    // Remove excessive whitespace while preserving intentional formatting
    if (!opts.preserveWhitespace) {
      // Remove trailing whitespace from lines
      cleaned = cleaned.replace(/[ \t]+$/gm, '');
      
      // Normalize multiple consecutive empty lines to maximum 2
      cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
      
      // Remove leading/trailing whitespace from the entire text
      cleaned = cleaned.trim();
    }

    // Normalize line breaks
    if (opts.normalizeLineBreaks) {
      cleaned = cleaned.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    // Enhance markdown formatting
    if (opts.enhanceMarkdown) {
      cleaned = this.enhanceMarkdownFormatting(cleaned);
    }

    return cleaned;
  }

  /**
   * Parse AI response into structured sections
   */
  static parseResponse(text: string, options: Partial<FormattingOptions> = {}): ParsedSection[] {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    const cleanedText = this.cleanText(text, opts);
    
    if (!cleanedText) return [];

    const sections: ParsedSection[] = [];
    const lines = cleanedText.split('\n');
    let currentSection: Partial<ParsedSection> | null = null;
    let sectionCounter = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines unless we're in a code block
      if (!trimmedLine && currentSection?.type !== 'code') {
        if (currentSection && currentSection.content) {
          currentSection.content += '\n';
        }
        continue;
      }

      // Detect section type
      const sectionType = this.detectSectionType(line, opts);
      
      if (sectionType.type !== 'text' || !currentSection) {
        // Start new section
        if (currentSection && (currentSection.content?.trim() || currentSection.type === 'code')) {
          sections.push(this.finalizeSection(currentSection, sectionCounter++));
        }

        currentSection = {
          type: sectionType.type,
          level: sectionType.level,
          title: sectionType.title,
          content: sectionType.content || '',
          rawContent: line,
          metadata: sectionType.metadata,
        };
      } else {
        // Continue current section
        if (currentSection.content) {
          currentSection.content += '\n' + line;
        } else {
          currentSection.content = line;
        }
        currentSection.rawContent += '\n' + line;
      }
    }

    // Add final section
    if (currentSection && (currentSection.content?.trim() || currentSection.type === 'code')) {
      sections.push(this.finalizeSection(currentSection, sectionCounter));
    }

    return sections.filter(section => section.content?.trim() || section.type === 'code');
  }

  /**
   * Detect the type of content section
   */
  private static detectSectionType(line: string, options: FormattingOptions): {
    type: ParsedSection['type'];
    level?: number;
    title?: string;
    content?: string;
    metadata?: Record<string, any>;
  } {
    const trimmed = line.trim();

    // Code blocks
    if (trimmed.startsWith('```')) {
      const language = trimmed.substring(3).trim();
      return {
        type: 'code',
        metadata: { language: language || 'text' },
        content: ''
      };
    }

    // Markdown headers
    const headerMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      return {
        type: 'header',
        level: headerMatch[1].length,
        title: headerMatch[2].trim(),
        content: headerMatch[2].trim()
      };
    }

    // Numbered sections (e.g., "1. SECTION NAME:", "2. ANALYSIS:")
    if (options.parseNumberedSections) {
      const numberedMatch = trimmed.match(/^(\d+)\.\s*([A-Z][A-Z\s]*[A-Z]):?\s*(.*)$/);
      if (numberedMatch) {
        return {
          type: 'header',
          level: 2,
          title: numberedMatch[2].trim(),
          content: numberedMatch[3].trim() || '',
          metadata: { numbered: true, number: parseInt(numberedMatch[1]) }
        };
      }
    }

    // Bold headers (e.g., "**SECTION NAME:**")
    const boldHeaderMatch = trimmed.match(/^\*\*([A-Z][A-Z\s]*[A-Z]):\*\*\s*(.*)$/);
    if (boldHeaderMatch) {
      return {
        type: 'header',
        level: 3,
        title: boldHeaderMatch[1].trim(),
        content: boldHeaderMatch[2].trim() || ''
      };
    }

    // Unordered lists
    if (trimmed.match(/^[-*+•]\s+/)) {
      return {
        type: 'list',
        content: line
      };
    }

    // Ordered lists
    if (trimmed.match(/^\d+\.\s+/)) {
      return {
        type: 'numbered-list',
        content: line
      };
    }

    // Quotes
    if (trimmed.startsWith('>')) {
      return {
        type: 'quote',
        content: line
      };
    }

    // Tables (simple detection)
    if (trimmed.includes('|') && trimmed.split('|').length >= 3) {
      return {
        type: 'table',
        content: line
      };
    }

    // Default to text
    return {
      type: 'text',
      content: line
    };
  }

  /**
   * Finalize a section with proper formatting
   */
  private static finalizeSection(section: Partial<ParsedSection>, index: number): ParsedSection {
    const content = section.content?.trim() || '';
    
    return {
      id: `section-${index}`,
      type: section.type || 'text',
      level: section.level,
      title: section.title,
      content,
      rawContent: section.rawContent || content,
      metadata: section.metadata || {}
    };
  }

  /**
   * Enhance markdown formatting in text
   */
  private static enhanceMarkdownFormatting(text: string): string {
    let enhanced = text;

    // Ensure proper spacing around headers
    enhanced = enhanced.replace(/^(#{1,6}\s+.+)$/gm, '\n$1\n');

    // Ensure proper spacing around lists
    enhanced = enhanced.replace(/^([-*+•]\s+.+)$/gm, (match, p1, offset, string) => {
      const prevChar = string[offset - 1];
      const nextIndex = offset + match.length;
      const nextChar = string[nextIndex];
      
      let result = match;
      if (prevChar && prevChar !== '\n') result = '\n' + result;
      if (nextChar && nextChar !== '\n') result = result + '\n';
      
      return result;
    });

    // Clean up excessive newlines created by the above
    enhanced = enhanced.replace(/\n{3,}/g, '\n\n');

    return enhanced.trim();
  }

  /**
   * Format sections for display with proper typography
   */
  static formatForDisplay(sections: ParsedSection[]): string {
    return sections.map(section => {
      switch (section.type) {
        case 'header':
          const headerLevel = section.level || 2;
          const headerPrefix = '#'.repeat(Math.min(headerLevel, 6));
          return `${headerPrefix} ${section.title || section.content}\n`;
          
        case 'list':
        case 'numbered-list':
          return section.content + '\n';
          
        case 'code':
          const language = section.metadata?.language || '';
          return `\`\`\`${language}\n${section.content}\n\`\`\`\n`;
          
        case 'quote':
          return section.content + '\n';
          
        case 'table':
          return section.content + '\n';
          
        default:
          return section.content + '\n\n';
      }
    }).join('').trim();
  }

  /**
   * Extract specific sections by type or title
   */
  static extractSections(
    sections: ParsedSection[], 
    criteria: { type?: ParsedSection['type']; title?: string; titlePattern?: RegExp }
  ): ParsedSection[] {
    return sections.filter(section => {
      if (criteria.type && section.type !== criteria.type) return false;
      if (criteria.title && section.title !== criteria.title) return false;
      if (criteria.titlePattern && (!section.title || !criteria.titlePattern.test(section.title))) return false;
      return true;
    });
  }

  /**
   * Convert sections to plain text with proper formatting
   */
  static sectionsToPlainText(sections: ParsedSection[]): string {
    return sections.map(section => {
      let text = '';
      
      if (section.title && section.type === 'header') {
        text += section.title + '\n';
        text += '='.repeat(section.title.length) + '\n\n';
      }
      
      text += section.content;
      
      return text;
    }).join('\n\n').trim();
  }
}

/**
 * Legacy compatibility functions
 */
export const cleanText = TextFormatter.cleanText;
export const parseResponse = TextFormatter.parseResponse;
export const formatForDisplay = TextFormatter.formatForDisplay;
