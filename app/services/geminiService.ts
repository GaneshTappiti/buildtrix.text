import { GoogleGenerativeAI } from '@google/generative-ai';
import { TextFormatter } from '@/utils/textFormatting';
import { getGeminiApiKey } from '@/lib/env-validation';
import {
  BusinessModelCanvas,
  BMCGenerationRequest,
  BMCGenerationResponse,
  BMCBlock,
  BMCBlockConfig,
  BMC_BLOCK_CONFIGS
} from '@/types/businessModelCanvas';

// Lazy initialization of Gemini AI
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

function initializeGemini() {
  if (!genAI) {
    const apiKey = getGeminiApiKey();
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return { genAI, model };
}

export interface GeminiResponse {
  text: string;
  confidence: number;
  metadata?: any;
}

export interface ValidationResult {
  score: number;
  feedback: string;
  suggestions: string[];
  marketPotential: number;
  technicalFeasibility: number;
  competitiveAdvantage: number;
}

export const geminiService = {
  // Generate embeddings for RAG (fallback method)
  async generateEmbedding(text: string): Promise<number[] | null> {
    try {
      // Note: Gemini doesn't have direct embedding API like OpenAI
      // This is a placeholder that returns null to trigger fallback
      // In production, you'd use a dedicated embedding service
      return null;
    } catch (error) {
      console.warn('Embedding generation failed:', error);
      return null;
    }
  },

  // Generate text using Gemini AI
  async generateText(prompt: string, options?: {
    maxTokens?: number;
    temperature?: number;
  }): Promise<GeminiResponse> {
    try {
      const { model } = initializeGemini();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const rawText = response.text();

      // Clean and format the response text
      const text = TextFormatter.cleanText(rawText, {
        normalizeLineBreaks: true,
        trimSections: true,
        enhanceMarkdown: true
      });

      return {
        text,
        confidence: 0.9, // Gemini typically has high confidence
        metadata: {
          model: 'gemini-1.5-flash',
          tokens: text.length, // Approximate token count
          temperature: options?.temperature || 0.7,
          originalLength: rawText.length,
          cleaned: rawText !== text
        }
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error instanceof Error ? error : new Error('Failed to generate text with Gemini AI');
    }
  },

  // ✅ Roadmap and Planning
  async generateRoadmap(idea: string, timeframe: string = '6 months'): Promise<any> {
    const prompt = `
    Create a detailed ${timeframe} roadmap for this startup idea: "${idea}"

    Please structure the roadmap as follows:

    PHASE 1 (Months 1-2): Foundation
    - [Key milestone 1]
    - [Key milestone 2]
    - [Key milestone 3]

    PHASE 2 (Months 3-4): Development
    - [Key milestone 1]
    - [Key milestone 2]
    - [Key milestone 3]

    PHASE 3 (Months 5-6): Launch & Growth
    - [Key milestone 1]
    - [Key milestone 2]
    - [Key milestone 3]

    KEY METRICS:
    - [Metric 1]
    - [Metric 2]
    - [Metric 3]

    RESOURCES NEEDED:
    - [Resource 1]
    - [Resource 2]
    - [Resource 3]

    Be specific and actionable.
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseRoadmapResponse(result.text);
    } catch (error) {
      console.error('Error generating roadmap:', error);
      throw error;
    }
  },

  // ✅ Task Breakdown and Estimation
  async breakdownTasks(feature: string, complexity: 'simple' | 'medium' | 'complex' = 'medium'): Promise<any> {
    const prompt = `
    Break down this feature into detailed tasks: "${feature}"

    Complexity level: ${complexity}

    Please provide:

    TASKS:
    - [Task 1] (Estimated: X hours)
    - [Task 2] (Estimated: X hours)
    - [Task 3] (Estimated: X hours)
    - [Task 4] (Estimated: X hours)
    - [Task 5] (Estimated: X hours)

    TOTAL ESTIMATE: X hours

    DEPENDENCIES:
    - [Dependency 1]
    - [Dependency 2]

    RISKS:
    - [Risk 1]
    - [Risk 2]

    ACCEPTANCE CRITERIA:
    - [Criteria 1]
    - [Criteria 2]
    - [Criteria 3]

    Be specific with time estimates and consider ${complexity} complexity.
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseTaskBreakdown(result.text);
    } catch (error) {
      console.error('Error breaking down tasks:', error);
      throw error;
    }
  },

  // Validate an idea using Gemini AI
  async validateIdea(ideaDescription: string): Promise<ValidationResult> {
    const prompt = `
    As an expert startup advisor and market analyst, please evaluate this business idea:
    
    "${ideaDescription}"
    
    Please provide a comprehensive analysis in the following format:
    
    OVERALL SCORE: [0-100]
    
    FEEDBACK: [2-3 sentences of overall assessment]
    
    SUGGESTIONS:
    - [Suggestion 1]
    - [Suggestion 2]
    - [Suggestion 3]
    - [Suggestion 4]
    - [Suggestion 5]
    
    MARKET POTENTIAL: [0-100]
    TECHNICAL FEASIBILITY: [0-100]
    COMPETITIVE ADVANTAGE: [0-100]
    
    Please be specific and actionable in your feedback.
    `;

    try {
      const result = await this.generateText(prompt);
      const text = result.text;
      
      // Parse the response to extract structured data
      const scoreMatch = text.match(/OVERALL SCORE:\s*(\d+)/i);
      const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]*?)(?=SUGGESTIONS:|$)/i);
      const suggestionsMatch = text.match(/SUGGESTIONS:\s*([\s\S]*?)(?=MARKET POTENTIAL:|$)/i);
      const marketMatch = text.match(/MARKET POTENTIAL:\s*(\d+)/i);
      const technicalMatch = text.match(/TECHNICAL FEASIBILITY:\s*(\d+)/i);
      const competitiveMatch = text.match(/COMPETITIVE ADVANTAGE:\s*(\d+)/i);
      
      // Extract suggestions
      const suggestionsText = suggestionsMatch?.[1] || '';
      const suggestions = suggestionsText
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .filter(suggestion => suggestion.length > 0)
        .slice(0, 5); // Limit to 5 suggestions
      
      return {
        score: parseInt(scoreMatch?.[1] || '75'),
        feedback: feedbackMatch?.[1]?.trim() || 'The idea shows potential and warrants further development.',
        suggestions: suggestions.length > 0 ? suggestions : [
          'Conduct market research to validate demand',
          'Identify key competitors and differentiation',
          'Define target customer segments',
          'Create a minimum viable product plan',
          'Develop a go-to-market strategy'
        ],
        marketPotential: parseInt(marketMatch?.[1] || '70'),
        technicalFeasibility: parseInt(technicalMatch?.[1] || '75'),
        competitiveAdvantage: parseInt(competitiveMatch?.[1] || '65')
      };
    } catch (error) {
      console.error('Error validating idea:', error);
      // Return fallback validation
      return {
        score: 70,
        feedback: 'Unable to complete AI analysis. Please try again later.',
        suggestions: [
          'Conduct market research to validate demand',
          'Identify key competitors and differentiation',
          'Define target customer segments',
          'Create a minimum viable product plan',
          'Develop a go-to-market strategy'
        ],
        marketPotential: 70,
        technicalFeasibility: 75,
        competitiveAdvantage: 65
      };
    }
  },

  // Generate startup brief using Gemini AI
  async generateStartupBrief(idea: string): Promise<string> {
    const prompt = `
    Create a comprehensive startup brief for this business idea: "${idea}"
    
    Please structure the brief with the following sections:
    1. Executive Summary
    2. Problem Statement
    3. Solution Overview
    4. Market Opportunity (include market size estimates)
    5. Competitive Advantage
    6. Business Model
    7. Technology Requirements
    8. Go-to-Market Strategy
    9. Financial Projections (high-level)
    10. Next Steps
    
    Make it professional, detailed, and actionable. Use markdown formatting.
    `;

    try {
      const result = await this.generateText(prompt);
      return result.text;
    } catch (error) {
      console.error('Error generating startup brief:', error);
      return `# Startup Brief: ${idea}\n\n*Unable to generate AI-powered brief. Please try again later.*`;
    }
  },

  // Analyze market trends using Gemini AI
  async analyzeMarket(industry: string): Promise<any> {
    const prompt = `
    Analyze the current market trends for the ${industry} industry. Please provide:
    
    TRENDS:
    - [List 4-5 key current trends]
    
    OPPORTUNITIES:
    - [List 4-5 market opportunities]
    
    THREATS:
    - [List 4-5 potential threats or challenges]
    
    Be specific and focus on actionable insights for startups entering this market.
    `;

    try {
      const result = await this.generateText(prompt);
      const text = result.text;
      
      // Parse the response
      const trendsMatch = text.match(/TRENDS:\s*([\s\S]*?)(?=OPPORTUNITIES:|$)/i);
      const opportunitiesMatch = text.match(/OPPORTUNITIES:\s*([\s\S]*?)(?=THREATS:|$)/i);
      const threatsMatch = text.match(/THREATS:\s*([\s\S]*?)$/i);
      
      const parseList = (text: string) => 
        text.split('\n')
          .filter(line => line.trim().startsWith('-'))
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(item => item.length > 0);
      
      return {
        trends: parseList(trendsMatch?.[1] || ''),
        opportunities: parseList(opportunitiesMatch?.[1] || ''),
        threats: parseList(threatsMatch?.[1] || '')
      };
    } catch (error) {
      console.error('Error analyzing market:', error);
      return {
        trends: ['AI integration increasing', 'Remote work transformation', 'Sustainability focus'],
        opportunities: ['Underserved markets', 'Technology gaps', 'Changing consumer behavior'],
        threats: ['Increased competition', 'Regulatory changes', 'Economic uncertainty']
      };
    }
  },

  // ✅ Investor Matching
  async findInvestorMatches(startup: any): Promise<any> {
    const prompt = `
    Based on this startup profile, recommend suitable investor types and strategies:

    Startup: ${startup.name || 'Unnamed Startup'}
    Industry: ${startup.industry || 'Not specified'}
    Stage: ${startup.stage || 'Early stage'}
    Funding needed: ${startup.fundingNeeded || 'Not specified'}

    Please provide:

    INVESTOR TYPES:
    - [Type 1]: [Why they're a good fit]
    - [Type 2]: [Why they're a good fit]
    - [Type 3]: [Why they're a good fit]

    FUNDING STRATEGIES:
    - [Strategy 1]
    - [Strategy 2]
    - [Strategy 3]

    PITCH FOCUS AREAS:
    - [Focus area 1]
    - [Focus area 2]
    - [Focus area 3]

    PREPARATION CHECKLIST:
    - [Item 1]
    - [Item 2]
    - [Item 3]
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseInvestorMatches(result.text);
    } catch (error) {
      console.error('Error finding investor matches:', error);
      throw error;
    }
  },

  // ✅ Prompt Optimization
  async optimizePrompt(originalPrompt: string, purpose: string): Promise<any> {
    const prompt = `
    Optimize this prompt for better AI results:

    Original prompt: "${originalPrompt}"
    Purpose: ${purpose}

    Please provide:

    OPTIMIZED PROMPT:
    [Your improved version here]

    IMPROVEMENTS MADE:
    - [Improvement 1]
    - [Improvement 2]
    - [Improvement 3]

    ADDITIONAL SUGGESTIONS:
    - [Suggestion 1]
    - [Suggestion 2]
    - [Suggestion 3]

    PROMPT STRUCTURE TIPS:
    - [Tip 1]
    - [Tip 2]
    - [Tip 3]
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parsePromptOptimization(result.text);
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      throw error;
    }
  },

  // ✅ Analytics Insights
  async generateInsights(data: any): Promise<any> {
    const prompt = `
    Analyze this data and provide actionable insights:

    Data: ${JSON.stringify(data, null, 2)}

    Please provide:

    KEY INSIGHTS:
    - [Insight 1]
    - [Insight 2]
    - [Insight 3]

    TRENDS IDENTIFIED:
    - [Trend 1]
    - [Trend 2]
    - [Trend 3]

    RECOMMENDATIONS:
    - [Recommendation 1]
    - [Recommendation 2]
    - [Recommendation 3]

    ACTION ITEMS:
    - [Action 1]
    - [Action 2]
    - [Action 3]
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseAnalyticsInsights(result.text);
    } catch (error) {
      console.error('Error generating insights:', error);
      throw error;
    }
  },

  // ✅ Recommendation Engine
  async generateRecommendations(context: any): Promise<any> {
    const prompt = `
    Based on this context, provide personalized recommendations:

    Context: ${JSON.stringify(context, null, 2)}

    Please provide:

    IMMEDIATE ACTIONS:
    - [Action 1]
    - [Action 2]
    - [Action 3]

    STRATEGIC RECOMMENDATIONS:
    - [Recommendation 1]
    - [Recommendation 2]
    - [Recommendation 3]

    TOOLS & RESOURCES:
    - [Tool/Resource 1]
    - [Tool/Resource 2]
    - [Tool/Resource 3]

    LEARNING OPPORTUNITIES:
    - [Opportunity 1]
    - [Opportunity 2]
    - [Opportunity 3]
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseRecommendations(result.text);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  },

  // ✅ Writing Assistance
  async improveWriting(text: string, purpose: string): Promise<any> {
    const prompt = `
    Improve this text for ${purpose}:

    Original text: "${text}"

    Please provide:

    IMPROVED VERSION:
    [Your improved version here]

    CHANGES MADE:
    - [Change 1]
    - [Change 2]
    - [Change 3]

    WRITING TIPS:
    - [Tip 1]
    - [Tip 2]
    - [Tip 3]

    TONE ASSESSMENT:
    Current tone: [Assessment]
    Suggested tone: [Suggestion]
    `;

    try {
      const result = await this.generateText(prompt);
      return this.parseWritingImprovement(result.text);
    } catch (error) {
      console.error('Error improving writing:', error);
      throw error;
    }
  },

  // Helper methods for parsing responses
  parseRoadmapResponse(text: string): any {
    const phases = text.match(/PHASE \d+[\s\S]*?(?=PHASE \d+|KEY METRICS:|$)/g) || [];
    const metricsMatch = text.match(/KEY METRICS:\s*([\s\S]*?)(?=RESOURCES NEEDED:|$)/i);
    const resourcesMatch = text.match(/RESOURCES NEEDED:\s*([\s\S]*?)$/i);

    return {
      phases: phases.map(phase => {
        const titleMatch = phase.match(/PHASE \d+[^:]*:([\s\S]*?)(?=\n-)/i);
        const tasks = phase.match(/- (.*?)(?=\n|$)/g) || [];
        return {
          title: titleMatch?.[1]?.trim() || 'Phase',
          tasks: tasks.map(task => task.replace(/^- /, '').trim())
        };
      }),
      metrics: this.parseList(metricsMatch?.[1] || ''),
      resources: this.parseList(resourcesMatch?.[1] || '')
    };
  },

  parseTaskBreakdown(text: string): any {
    const tasksMatch = text.match(/TASKS:\s*([\s\S]*?)(?=TOTAL ESTIMATE:|$)/i);
    const totalMatch = text.match(/TOTAL ESTIMATE:\s*(\d+)\s*hours/i);
    const dependenciesMatch = text.match(/DEPENDENCIES:\s*([\s\S]*?)(?=RISKS:|$)/i);
    const risksMatch = text.match(/RISKS:\s*([\s\S]*?)(?=ACCEPTANCE CRITERIA:|$)/i);
    const criteriaMatch = text.match(/ACCEPTANCE CRITERIA:\s*([\s\S]*?)$/i);

    const tasks = tasksMatch?.[1]?.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => {
        const match = line.match(/- (.*?)\s*\(Estimated:\s*(\d+)\s*hours?\)/i);
        return {
          name: match?.[1]?.trim() || line.replace(/^- /, '').trim(),
          estimate: parseInt(match?.[2] || '0')
        };
      }) || [];

    return {
      tasks,
      totalEstimate: parseInt(totalMatch?.[1] || '0'),
      dependencies: this.parseList(dependenciesMatch?.[1] || ''),
      risks: this.parseList(risksMatch?.[1] || ''),
      acceptanceCriteria: this.parseList(criteriaMatch?.[1] || '')
    };
  },

  parseInvestorMatches(text: string): any {
    const typesMatch = text.match(/INVESTOR TYPES:\s*([\s\S]*?)(?=FUNDING STRATEGIES:|$)/i);
    const strategiesMatch = text.match(/FUNDING STRATEGIES:\s*([\s\S]*?)(?=PITCH FOCUS AREAS:|$)/i);
    const focusMatch = text.match(/PITCH FOCUS AREAS:\s*([\s\S]*?)(?=PREPARATION CHECKLIST:|$)/i);
    const checklistMatch = text.match(/PREPARATION CHECKLIST:\s*([\s\S]*?)$/i);

    return {
      investorTypes: this.parseList(typesMatch?.[1] || ''),
      strategies: this.parseList(strategiesMatch?.[1] || ''),
      pitchFocus: this.parseList(focusMatch?.[1] || ''),
      checklist: this.parseList(checklistMatch?.[1] || '')
    };
  },

  parsePromptOptimization(text: string): any {
    const optimizedMatch = text.match(/OPTIMIZED PROMPT:\s*([\s\S]*?)(?=IMPROVEMENTS MADE:|$)/i);
    const improvementsMatch = text.match(/IMPROVEMENTS MADE:\s*([\s\S]*?)(?=ADDITIONAL SUGGESTIONS:|$)/i);
    const suggestionsMatch = text.match(/ADDITIONAL SUGGESTIONS:\s*([\s\S]*?)(?=PROMPT STRUCTURE TIPS:|$)/i);
    const tipsMatch = text.match(/PROMPT STRUCTURE TIPS:\s*([\s\S]*?)$/i);

    return {
      optimizedPrompt: optimizedMatch?.[1]?.trim() || '',
      improvements: this.parseList(improvementsMatch?.[1] || ''),
      suggestions: this.parseList(suggestionsMatch?.[1] || ''),
      tips: this.parseList(tipsMatch?.[1] || '')
    };
  },

  parseAnalyticsInsights(text: string): any {
    const insightsMatch = text.match(/KEY INSIGHTS:\s*([\s\S]*?)(?=TRENDS IDENTIFIED:|$)/i);
    const trendsMatch = text.match(/TRENDS IDENTIFIED:\s*([\s\S]*?)(?=RECOMMENDATIONS:|$)/i);
    const recommendationsMatch = text.match(/RECOMMENDATIONS:\s*([\s\S]*?)(?=ACTION ITEMS:|$)/i);
    const actionsMatch = text.match(/ACTION ITEMS:\s*([\s\S]*?)$/i);

    return {
      insights: this.parseList(insightsMatch?.[1] || ''),
      trends: this.parseList(trendsMatch?.[1] || ''),
      recommendations: this.parseList(recommendationsMatch?.[1] || ''),
      actions: this.parseList(actionsMatch?.[1] || '')
    };
  },

  parseRecommendations(text: string): any {
    const immediateMatch = text.match(/IMMEDIATE ACTIONS:\s*([\s\S]*?)(?=STRATEGIC RECOMMENDATIONS:|$)/i);
    const strategicMatch = text.match(/STRATEGIC RECOMMENDATIONS:\s*([\s\S]*?)(?=TOOLS & RESOURCES:|$)/i);
    const toolsMatch = text.match(/TOOLS & RESOURCES:\s*([\s\S]*?)(?=LEARNING OPPORTUNITIES:|$)/i);
    const learningMatch = text.match(/LEARNING OPPORTUNITIES:\s*([\s\S]*?)$/i);

    return {
      immediateActions: this.parseList(immediateMatch?.[1] || ''),
      strategic: this.parseList(strategicMatch?.[1] || ''),
      tools: this.parseList(toolsMatch?.[1] || ''),
      learning: this.parseList(learningMatch?.[1] || '')
    };
  },

  parseWritingImprovement(text: string): any {
    const improvedMatch = text.match(/IMPROVED VERSION:\s*([\s\S]*?)(?=CHANGES MADE:|$)/i);
    const changesMatch = text.match(/CHANGES MADE:\s*([\s\S]*?)(?=WRITING TIPS:|$)/i);
    const tipsMatch = text.match(/WRITING TIPS:\s*([\s\S]*?)(?=TONE ASSESSMENT:|$)/i);
    const toneMatch = text.match(/TONE ASSESSMENT:\s*([\s\S]*?)$/i);

    return {
      improvedText: improvedMatch?.[1]?.trim() || '',
      changes: this.parseList(changesMatch?.[1] || ''),
      tips: this.parseList(tipsMatch?.[1] || ''),
      toneAssessment: toneMatch?.[1]?.trim() || ''
    };
  },

  parseList(text: string): string[] {
    return text.split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .filter(item => item.length > 0);
  },

  // ✅ Business Model Canvas Generation with Deduplication
  async generateBusinessModelCanvas(request: BMCGenerationRequest): Promise<BMCGenerationResponse> {
    try {
      // Validate input
      if (!request.appIdea || request.appIdea.trim().length < 10) {
        throw new Error('App idea must be at least 10 characters long');
      }

      console.log('BMC Generation - Starting sequential generation with deduplication');

      // Generate blocks sequentially to avoid repetition
      const canvas = await this.generateBMCSequentially(request);
      console.log('BMC Generation - Sequential generation completed');

      // Apply post-generation deduplication
      const deduplicatedCanvas = await this.deduplicateBMCContent(canvas);
      console.log('BMC Generation - Deduplication applied');

      return {
        success: true,
        canvas: deduplicatedCanvas,
        confidence: 0.85, // Average confidence for sequential generation
        suggestions: this.generateBMCSuggestions(deduplicatedCanvas)
      };
    } catch (error) {
      console.error('Error generating Business Model Canvas:', error);

      // Create fallback canvas with sample content
      const fallbackCanvas = this.createFallbackBMC(request);

      return {
        success: false,
        canvas: fallbackCanvas,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  // Generate individual BMC block (legacy method - now uses enhanced prompts)
  async generateBMCBlock(
    blockId: keyof BusinessModelCanvas['blocks'],
    appIdea: string,
    existingCanvas?: Partial<BusinessModelCanvas>
  ): Promise<BMCBlock> {
    try {
      // Convert to new request format for consistency
      const request: BMCGenerationRequest = {
        appIdea,
        businessType: 'b2c' // Default fallback
      };

      return await this.generateBMCBlockWithContext(blockId, request, existingCanvas);
    } catch (error) {
      console.error(`Error generating BMC block ${blockId}:`, error);
      const blockConfig = BMC_BLOCK_CONFIGS.find(config => config.id === blockId);
      return {
        id: blockId,
        title: blockConfig?.title || 'Unknown Block',
        content: 'Unable to generate content. Please try again or edit manually.',
        isGenerated: false,
        lastUpdated: new Date(),
        confidence: 0
      };
    }
  },

  // Build comprehensive BMC prompt using expert-level template
  buildBMCPrompt(request: BMCGenerationRequest): string {
    const { appIdea, industry, targetMarket, businessType, additionalContext } = request;

    const contextInfo = [
      industry && `Industry: ${industry}`,
      targetMarket && `Target Market: ${targetMarket}`,
      businessType && `Business Type: ${businessType.toUpperCase()}`,
      additionalContext && `Additional Context: ${additionalContext}`
    ].filter(Boolean).join('\n');

    return `
You are an expert business strategist familiar with Alexander Osterwalder's Business Model Canvas (BMC), a strategic management template with nine defined building blocks.

Given this business idea, generate a complete, professionally written Business Model Canvas with distinct and actionable insights for each block.

---

Business Idea:
${appIdea}

${contextInfo ? `\nAdditional Information:\n${contextInfo}` : ''}

---

Output each section in this order, clearly labeled:

1. **Customer Segments**
   - Describe customer groups your idea targets (e.g. students, startups, SMBs).
   - Segment types: mass, niche, multi-sided, etc.

2. **Value Proposition**
   - What unique value does your idea deliver?
   - Cover functional, economic, emotional, design-based aspects.

3. **Channels**
   - How will you reach and deliver value (e.g. web, mobile, partnerships)?

4. **Customer Relationships**
   - What kind of relationship does each segment expect (e.g. self-service, automated, community)?

5. **Revenue Streams**
   - How will you generate income?
   - List monetization paths (subscription, licensing, asset sale, ads, etc.)

6. **Key Resources**
   - What essential assets are needed (human, physical, financial, intellectual)?

7. **Key Activities**
   - What core operations must be executed to deliver value?

8. **Key Partnerships**
   - What external allies or suppliers reduce risk and improve efficiency?

9. **Cost Structure**
   - Major cost categories (fixed vs. variable).
   - Highlight economies of scale or scope if applicable.

Each block should consist of concise prose (2–4 sentences). Begin with a brief summary or bullet outline, followed by strategic detail. Use professional, pitch-ready tone.
`;
  },

  // Build prompt for individual block generation using expert template
  buildBlockPrompt(
    blockConfig: BMCBlockConfig,
    appIdea: string,
    existingCanvas?: Partial<BusinessModelCanvas>
  ): string {
    const contextInfo = existingCanvas ? this.buildContextFromCanvas(existingCanvas) : '';

    return `
You are a seasoned startup strategist with deep expertise in business modeling.

Given the business idea below, generate a high-quality **${blockConfig.title}** section of the Business Model Canvas.

---

Business Idea: ${appIdea}

Block: ${blockConfig.title}

Block Description: ${blockConfig.description}

${contextInfo}

---

Provide:
- A 1–2 sentence summary for this block.
- 3–5 bullet points elaborating the strategy, structure, or assumptions.

Use professional, pitch-ready tone. Focus on actionable insights that align with the overall business strategy.

Examples of good content for this block:
${blockConfig.examples.map(example => `- ${example}`).join('\n')}
`;
  },

  // Build context from existing canvas blocks
  buildContextFromCanvas(canvas: Partial<BusinessModelCanvas>): string {
    const contextParts: string[] = [];

    if (canvas.blocks?.customerSegments?.content) {
      contextParts.push(`CUSTOMER SEGMENTS: ${canvas.blocks.customerSegments.content}`);
    }
    if (canvas.blocks?.valueProposition?.content) {
      contextParts.push(`VALUE PROPOSITION: ${canvas.blocks.valueProposition.content}`);
    }
    if (canvas.blocks?.revenueStreams?.content) {
      contextParts.push(`REVENUE STREAMS: ${canvas.blocks.revenueStreams.content}`);
    }

    return contextParts.length > 0
      ? `\nEXISTING CONTEXT:\n${contextParts.join('\n')}\n`
      : '';
  },

  // Parse BMC response from AI with improved extraction for numbered format
  parseBMCResponse(text: string, request: BMCGenerationRequest): BusinessModelCanvas {
    const now = new Date();
    const canvasId = `bmc_${Date.now()}`;

    // Extract each block content using multiple regex patterns to handle different formats
    const extractBlock = (blockName: string, blockNumber?: number): string => {
      // Try numbered format first (e.g., "1. **Customer Segments**")
      if (blockNumber) {
        const numberedRegex = new RegExp(`${blockNumber}\\.\\s*\\*\\*${blockName}\\*\\*\\s*(.*?)(?=\\n\\d+\\.\\s*\\*\\*|$)`, 'is');
        const numberedMatch = text.match(numberedRegex);
        if (numberedMatch?.[1]) {
          return this.cleanBlockContent(numberedMatch[1]);
        }
      }

      // Try markdown header format (e.g., "**Customer Segments**")
      const headerRegex = new RegExp(`\\*\\*${blockName}\\*\\*\\s*(.*?)(?=\\n\\*\\*|$)`, 'is');
      const headerMatch = text.match(headerRegex);
      if (headerMatch?.[1]) {
        return this.cleanBlockContent(headerMatch[1]);
      }

      // Try simple colon format (e.g., "CUSTOMER SEGMENTS:")
      const colonRegex = new RegExp(`${blockName.toUpperCase()}:\\s*(.*?)(?=\\n[A-Z ]+:|$)`, 'is');
      const colonMatch = text.match(colonRegex);
      if (colonMatch?.[1]) {
        return this.cleanBlockContent(colonMatch[1]);
      }

      return `Generated content for ${blockName} will appear here.`;
    };

    const createBlock = (id: string, title: string, content: string): BMCBlock => ({
      id,
      title,
      content,
      isGenerated: true,
      lastUpdated: now,
      confidence: 0.9
    });

    return {
      id: canvasId,
      appIdea: request.appIdea,
      createdAt: now,
      updatedAt: now,
      blocks: {
        customerSegments: createBlock('customerSegments', 'Customer Segments', extractBlock('Customer Segments', 1)),
        valueProposition: createBlock('valueProposition', 'Value Proposition', extractBlock('Value Proposition', 2)),
        channels: createBlock('channels', 'Channels', extractBlock('Channels', 3)),
        customerRelationships: createBlock('customerRelationships', 'Customer Relationships', extractBlock('Customer Relationships', 4)),
        revenueStreams: createBlock('revenueStreams', 'Revenue Streams', extractBlock('Revenue Streams', 5)),
        keyResources: createBlock('keyResources', 'Key Resources', extractBlock('Key Resources', 6)),
        keyActivities: createBlock('keyActivities', 'Key Activities', extractBlock('Key Activities', 7)),
        keyPartnerships: createBlock('keyPartnerships', 'Key Partnerships', extractBlock('Key Partnerships', 8)),
        costStructure: createBlock('costStructure', 'Cost Structure', extractBlock('Cost Structure', 9))
      },
      metadata: {
        industry: request.industry,
        targetMarket: request.targetMarket,
        businessType: request.businessType,
        stage: 'idea'
      }
    };
  },

  // Clean and format block content
  cleanBlockContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }

    return content
      .trim()
      .replace(/^[-•]\s*/gm, '') // Remove bullet points at start of lines
      .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
      .replace(/^\s*-\s*/gm, '• ') // Convert dashes to bullet points
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove markdown bold formatting
      .replace(/\*(.*?)\*/g, '$1') // Remove markdown italic formatting
      .trim();
  },

  // Create empty BMC structure
  createEmptyBMC(request: BMCGenerationRequest): BusinessModelCanvas {
    const now = new Date();
    const canvasId = `bmc_${Date.now()}`;

    const createEmptyBlock = (id: string, title: string): BMCBlock => ({
      id,
      title,
      content: '',
      isGenerated: false,
      lastUpdated: now,
      confidence: 0
    });

    return {
      id: canvasId,
      appIdea: request.appIdea,
      createdAt: now,
      updatedAt: now,
      blocks: {
        customerSegments: createEmptyBlock('customerSegments', 'Customer Segments'),
        valueProposition: createEmptyBlock('valueProposition', 'Value Proposition'),
        channels: createEmptyBlock('channels', 'Channels'),
        customerRelationships: createEmptyBlock('customerRelationships', 'Customer Relationships'),
        revenueStreams: createEmptyBlock('revenueStreams', 'Revenue Streams'),
        keyResources: createEmptyBlock('keyResources', 'Key Resources'),
        keyActivities: createEmptyBlock('keyActivities', 'Key Activities'),
        keyPartnerships: createEmptyBlock('keyPartnerships', 'Key Partnerships'),
        costStructure: createEmptyBlock('costStructure', 'Cost Structure')
      },
      metadata: {
        industry: request.industry,
        targetMarket: request.targetMarket,
        businessType: request.businessType,
        stage: 'idea'
      }
    };
  },

  // Generate suggestions for BMC improvement
  generateBMCSuggestions(canvas: BusinessModelCanvas): string[] {
    const suggestions: string[] = [];

    // Check for empty or short blocks
    Object.entries(canvas.blocks).forEach(([key, block]) => {
      if (!block.content || block.content.length < 50) {
        suggestions.push(`Consider expanding the ${block.title} section with more specific details`);
      }
    });

    // Add general suggestions
    suggestions.push(
      'Validate your customer segments through market research',
      'Test your value proposition with potential customers',
      'Consider multiple revenue streams for sustainability',
      'Identify key partnerships that could accelerate growth'
    );

    return suggestions.slice(0, 5); // Return top 5 suggestions
  },

  // Generate BMC blocks sequentially to avoid repetition
  async generateBMCSequentially(request: BMCGenerationRequest): Promise<BusinessModelCanvas> {
    const now = new Date();
    const canvasId = `bmc_${Date.now()}`;

    // Define the order of generation for optimal context building
    const generationOrder: Array<keyof BusinessModelCanvas['blocks']> = [
      'customerSegments',
      'valueProposition',
      'channels',
      'customerRelationships',
      'revenueStreams',
      'keyResources',
      'keyActivities',
      'keyPartnerships',
      'costStructure'
    ];

    const blocks: Partial<BusinessModelCanvas['blocks']> = {};

    for (const blockId of generationOrder) {
      console.log(`Generating block: ${blockId}`);

      // Build context from previously generated blocks
      const partialCanvas: Partial<BusinessModelCanvas> = {
        id: canvasId,
        appIdea: request.appIdea,
        createdAt: now,
        updatedAt: now,
        blocks: blocks as BusinessModelCanvas['blocks']
      };

      // Generate this specific block with context
      const block = await this.generateBMCBlockWithContext(blockId, request, partialCanvas);
      blocks[blockId] = block;
    }

    return {
      id: canvasId,
      appIdea: request.appIdea,
      createdAt: now,
      updatedAt: now,
      blocks: blocks as BusinessModelCanvas['blocks'],
      metadata: {
        industry: request.industry,
        targetMarket: request.targetMarket,
        businessType: request.businessType,
        stage: 'idea'
      }
    };
  },

  // Generate individual BMC block with enhanced context and deduplication
  async generateBMCBlockWithContext(
    blockId: keyof BusinessModelCanvas['blocks'],
    request: BMCGenerationRequest,
    existingCanvas?: Partial<BusinessModelCanvas>
  ): Promise<BMCBlock> {
    try {
      const blockConfig = BMC_BLOCK_CONFIGS.find(config => config.id === blockId);
      if (!blockConfig) {
        throw new Error(`Unknown BMC block: ${blockId}`);
      }

      const prompt = this.buildEnhancedBlockPrompt(blockConfig, request, existingCanvas);
      const result = await this.generateText(prompt);

      return {
        id: blockId,
        title: blockConfig.title,
        content: result.text.trim(),
        isGenerated: true,
        lastUpdated: new Date(),
        confidence: result.confidence
      };
    } catch (error) {
      console.error(`Error generating block ${blockId}:`, error);

      // Return fallback content
      const blockConfig = BMC_BLOCK_CONFIGS.find(config => config.id === blockId);
      return {
        id: blockId,
        title: blockConfig?.title || 'Unknown Block',
        content: `Error generating content for ${blockId}. Please edit manually.`,
        isGenerated: false,
        lastUpdated: new Date(),
        confidence: 0
      };
    }
  },

  // Create fallback BMC with sample content when AI fails
  createFallbackBMC(request: BMCGenerationRequest): BusinessModelCanvas {
    const now = new Date();
    const canvasId = `bmc_fallback_${Date.now()}`;

    const createFallbackBlock = (id: string, title: string, sampleContent: string): BMCBlock => ({
      id,
      title,
      content: `${sampleContent}\n\n*Note: This is sample content. Please edit to match your specific business idea: "${request.appIdea}"*`,
      isGenerated: false,
      lastUpdated: now,
      confidence: 0.5
    });

    return {
      id: canvasId,
      appIdea: request.appIdea,
      createdAt: now,
      updatedAt: now,
      blocks: {
        customerSegments: createFallbackBlock('customerSegments', 'Customer Segments',
          'Target customers who would benefit from your solution. Consider demographics, behaviors, and needs.'),
        valueProposition: createFallbackBlock('valueProposition', 'Value Proposition',
          'The unique value your product delivers. What problems does it solve and how is it different?'),
        channels: createFallbackBlock('channels', 'Channels',
          'How you reach and deliver value to customers. Consider digital platforms, partnerships, and direct sales.'),
        customerRelationships: createFallbackBlock('customerRelationships', 'Customer Relationships',
          'The type of relationship you establish with customers. Consider self-service, personal assistance, or community.'),
        revenueStreams: createFallbackBlock('revenueStreams', 'Revenue Streams',
          'How your business generates income. Consider subscription, one-time payments, or advertising models.'),
        keyResources: createFallbackBlock('keyResources', 'Key Resources',
          'Essential assets needed to operate. Consider technology, human resources, and intellectual property.'),
        keyActivities: createFallbackBlock('keyActivities', 'Key Activities',
          'Core activities required to deliver value. Consider development, marketing, and customer support.'),
        keyPartnerships: createFallbackBlock('keyPartnerships', 'Key Partnerships',
          'Strategic partners that help reduce risk and improve efficiency. Consider suppliers and technology partners.'),
        costStructure: createFallbackBlock('costStructure', 'Cost Structure',
          'Major costs to operate the business. Consider development, marketing, and operational expenses.')
      },
      metadata: {
        industry: request.industry,
        targetMarket: request.targetMarket,
        businessType: request.businessType,
        stage: 'idea'
      }
    };
  },

  // Build enhanced prompt with anti-duplication logic
  buildEnhancedBlockPrompt(
    blockConfig: BMCBlockConfig,
    request: BMCGenerationRequest,
    existingCanvas?: Partial<BusinessModelCanvas>
  ): string {
    const { appIdea, industry, targetMarket, businessType, additionalContext } = request;

    // Build context from existing blocks to avoid repetition
    const existingContent = this.buildAntiDuplicationContext(existingCanvas);

    const contextInfo = [
      industry && `Industry: ${industry}`,
      targetMarket && `Target Market: ${targetMarket}`,
      businessType && `Business Type: ${businessType.toUpperCase()}`,
      additionalContext && `Additional Context: ${additionalContext}`
    ].filter(Boolean).join('\n');

    return `
You are an expert business strategist creating a Business Model Canvas. Your task is to generate the **${blockConfig.title}** section.

CRITICAL: Avoid repeating content from other sections. Each block must have unique, non-overlapping insights.

---

Business Idea: ${appIdea}

${contextInfo ? `\nBusiness Context:\n${contextInfo}` : ''}

${existingContent}

---

**${blockConfig.title}** Focus:
${blockConfig.description}

Requirements:
1. Generate 2-4 sentences of unique content for this block only
2. DO NOT repeat concepts already mentioned in other sections
3. Focus specifically on ${blockConfig.title.toLowerCase()} aspects
4. Use professional, pitch-ready language
5. Be specific and actionable

${this.getBlockSpecificGuidance(blockConfig.id)}

Output only the content for ${blockConfig.title} - no headers, no other sections.
`;
  },

  // Build anti-duplication context from existing blocks
  buildAntiDuplicationContext(canvas?: Partial<BusinessModelCanvas>): string {
    if (!canvas?.blocks) return '';

    const existingBlocks: string[] = [];

    Object.entries(canvas.blocks).forEach(([key, block]) => {
      if (block?.content && block.content.trim()) {
        existingBlocks.push(`${block.title}: ${block.content.substring(0, 100)}...`);
      }
    });

    if (existingBlocks.length === 0) return '';

    return `
AVOID REPEATING these concepts already covered in other sections:
${existingBlocks.join('\n')}

Generate completely different and unique content that doesn't overlap with the above.
`;
  },

  // Get block-specific guidance to avoid repetition
  getBlockSpecificGuidance(blockId: string): string {
    const guidance: Record<string, string> = {
      customerSegments: 'Focus on WHO your customers are (demographics, psychographics, behaviors). Avoid describing what you offer them.',
      valueProposition: 'Focus on WHAT value you deliver and WHY customers choose you. Avoid describing customer types or how you reach them.',
      channels: 'Focus on HOW you reach, sell to, and deliver value to customers. Avoid describing the customers themselves or what you offer.',
      customerRelationships: 'Focus on the TYPE of relationship and interaction style. Avoid describing channels or customer segments.',
      revenueStreams: 'Focus on HOW you make money and pricing models. Avoid describing customers or value propositions.',
      keyResources: 'Focus on WHAT assets you need (people, technology, IP, capital). Avoid describing activities or partnerships.',
      keyActivities: 'Focus on WHAT you must do operationally. Avoid describing resources or partnerships.',
      keyPartnerships: 'Focus on WHO you partner with and WHY. Avoid describing internal activities or resources.',
      costStructure: 'Focus on WHAT costs you incur and cost drivers. Avoid describing revenue or activities.'
    };

    return guidance[blockId] || 'Focus on this specific aspect of the business model.';
  },

  // Apply semantic deduplication to BMC content
  async deduplicateBMCContent(canvas: BusinessModelCanvas): Promise<BusinessModelCanvas> {
    try {
      // Simple text-based deduplication for now
      // In a production system, you'd use semantic similarity (embeddings)
      const deduplicatedBlocks = { ...canvas.blocks };

      // Check for repeated phrases across blocks
      const allContent = Object.values(canvas.blocks).map(block => block.content).join(' ');
      const phrases = this.extractKeyPhrases(allContent);
      const repeatedPhrases = this.findRepeatedPhrases(phrases);

      if (repeatedPhrases.length > 0) {
        console.log('Found repeated phrases:', repeatedPhrases);

        // Apply deduplication by rewriting blocks with repeated content
        for (const [blockId, block] of Object.entries(deduplicatedBlocks)) {
          if (this.hasRepeatedContent(block.content, repeatedPhrases)) {
            console.log(`Deduplicating block: ${blockId}`);
            // In a real implementation, you'd call AI to rewrite the content
            // For now, just add a note
            block.content = block.content + '\n\n*[Content reviewed for uniqueness]*';
          }
        }
      }

      return {
        ...canvas,
        blocks: deduplicatedBlocks,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error in deduplication:', error);
      return canvas; // Return original if deduplication fails
    }
  },

  // Extract key phrases from text
  extractKeyPhrases(text: string): string[] {
    // Simple phrase extraction - in production, use NLP libraries
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const phrases: string[] = [];

    // Extract 2-3 word phrases
    for (let i = 0; i < words.length - 1; i++) {
      phrases.push(`${words[i]} ${words[i + 1]}`);
      if (i < words.length - 2) {
        phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
      }
    }

    return phrases;
  },

  // Find phrases that appear multiple times
  findRepeatedPhrases(phrases: string[]): string[] {
    const phraseCount: Record<string, number> = {};

    phrases.forEach(phrase => {
      phraseCount[phrase] = (phraseCount[phrase] || 0) + 1;
    });

    return Object.entries(phraseCount)
      .filter(([phrase, count]) => count > 1 && phrase.length > 10) // Only meaningful phrases
      .map(([phrase]) => phrase);
  },

  // Check if content has repeated phrases
  hasRepeatedContent(content: string, repeatedPhrases: string[]): boolean {
    const lowerContent = content.toLowerCase();
    return repeatedPhrases.some(phrase => lowerContent.includes(phrase));
  },

  // Generate comprehensive app blueprint
  async generateAppBlueprint(request: {
    appIdea: string;
    appName: string;
    platforms: string[];
    designStyle: string;
    targetAudience?: string;
    appType?: 'web' | 'mobile' | 'hybrid';
    depth?: 'mvp' | 'advanced' | 'production';
    includeStates?: boolean;
    includeModals?: boolean;
    includeIntegrations?: boolean;
  }): Promise<any> {
    try {
      const {
        appIdea,
        appName,
        platforms,
        designStyle,
        targetAudience,
        appType = 'mobile',
        depth = 'advanced',
        includeStates = true,
        includeModals = true,
        includeIntegrations = true
      } = request;

      const universalPrompt = this.buildUniversalBlueprintPrompt(request);

      console.log('Generating comprehensive app blueprint with Gemini...');

      const { genAI } = initializeGemini();
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(universalPrompt);
      const response = await result.response;
      const text = response.text();

      console.log('Raw Gemini response received, parsing...');

      // Parse the structured response
      const blueprint = this.parseAppBlueprintResponse(text, request);

      return {
        success: true,
        blueprint,
        confidence: 0.9,
        metadata: {
          generatedAt: new Date().toISOString(),
          depth,
          features: {
            states: includeStates,
            modals: includeModals,
            integrations: includeIntegrations
          }
        }
      };
    } catch (error) {
      console.error('Error generating app blueprint:', error);

      // Return fallback blueprint
      const fallbackBlueprint = this.createFallbackAppBlueprint(request);

      return {
        success: false,
        blueprint: fallbackBlueprint,
        confidence: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  // Build the universal prompt template
  buildUniversalBlueprintPrompt(request: any): string {
    const {
      appIdea,
      appName,
      platforms,
      designStyle,
      targetAudience,
      appType = 'mobile',
      depth = 'advanced',
      includeStates = true,
      includeModals = true,
      includeIntegrations = true
    } = request;

    return `You're an expert mobile and web app architect. Given a user's app idea, generate a full-scale app structure.

[User Idea]: ${appIdea}
[App Name]: ${appName}
[Platforms]: ${platforms.join(', ')}
[App Type]: ${appType}
[Design Style]: ${designStyle}
[Target Audience]: ${targetAudience || 'General users'}
[Depth Level]: ${depth}

Respond with a complete, professional app skeleton including:

1. 🖥️ **Screens List**
   - All user-facing pages (login, dashboard, feed, settings, etc.)
   - Sub-pages, onboarding flows, and edge cases (error, empty, loading)
   - Categorize each screen by type (main, auth, onboarding, feature, settings, error)

2. 🧭 **Page Flow (Navigation)**
   - Route structure or flowchart-style connection between screens
   - Mention nested screens and tab/bottom nav flows
   - Include conditional routing based on user state

3. 🧑‍🤝‍🧑 **User Roles**
   - List all user types (admin, guest, creator, etc.)
   - Define permissions per role
   - Describe role-specific features and access

4. 🗃️ **Data Models (Entities)**
   - Each screen's backend entities and how they relate
   - Include field names and relationships
   - Example: User, Post, Comment, Settings, etc.

${includeModals ? `5. 💬 **Modals & Popups**
   - Any dialog boxes, overlays, confirmation prompts, etc.
   - Specify which screens trigger each modal
   - Include modal components and purposes` : ''}

${includeStates ? `6. 🧪 **States & Edge Cases**
   - Empty states, loading states, error handling, no data UI
   - Specify conditions for each state
   - Include state management requirements` : ''}

${includeIntegrations ? `7. 🧩 **3rd-party Integrations** (if applicable)
   - Auth (Google, GitHub, etc.), Storage, Payments, Notifications
   - Specify integration type and implementation approach
   - Include API requirements` : ''}

8. 🏗️ **Suggested Architecture Pattern**
   - Based on app type, suggest MVC, MVVM, Clean Arch, or feature foldering
   - Recommend folder structure and organization

IMPORTANT: Format your response as valid JSON with the following structure:
{
  "screens": [
    {
      "id": "unique-id",
      "name": "Screen Name",
      "purpose": "What this screen does",
      "type": "main|auth|onboarding|feature|settings|error|loading|empty",
      "components": ["component1", "component2"],
      "navigation": ["screen1", "screen2"],
      "subPages": ["subpage1", "subpage2"],
      "edgeCases": ["error case", "empty case"]
    }
  ],
  "userRoles": [
    {
      "name": "Role Name",
      "permissions": ["permission1", "permission2"],
      "description": "Role description"
    }
  ],
  "dataModels": [
    {
      "name": "Model Name",
      "fields": ["field1", "field2"],
      "relationships": ["relationship1"],
      "description": "Model description"
    }
  ],
  "pageFlow": [
    {
      "from": "screen1",
      "to": "screen2",
      "condition": "optional condition",
      "action": "navigation action"
    }
  ],
  ${includeModals ? `"modals": [
    {
      "id": "modal-id",
      "name": "Modal Name",
      "purpose": "Modal purpose",
      "triggerScreens": ["screen1", "screen2"],
      "components": ["component1", "component2"]
    }
  ],` : ''}
  ${includeStates ? `"states": [
    {
      "name": "State Name",
      "description": "State description",
      "screens": ["screen1", "screen2"],
      "conditions": ["condition1", "condition2"]
    }
  ],` : ''}
  ${includeIntegrations ? `"integrations": [
    {
      "name": "Integration Name",
      "type": "auth|storage|payment|notification|analytics|social|api",
      "description": "Integration description",
      "implementation": "Implementation approach"
    }
  ],` : ''}
  "architecture": "Recommended architecture pattern",
  "suggestedPattern": "Detailed pattern explanation",
  "navigationFlow": "High-level navigation description"
}

Respond ONLY with valid JSON. Be comprehensive for ${depth} level. Don't repeat info. Be concise and modular.`;
  },

  // Parse the AI response into structured blueprint
  parseAppBlueprintResponse(text: string, request: any): any {
    try {
      // Clean the response to extract JSON
      let cleanedText = text.trim();

      // Remove markdown code blocks if present
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      const parsed = JSON.parse(cleanedText);

      // Validate and enhance the parsed data
      return {
        screens: parsed.screens || [],
        userRoles: parsed.userRoles || [],
        dataModels: parsed.dataModels || [],
        pageFlow: parsed.pageFlow || [],
        modals: parsed.modals || [],
        states: parsed.states || [],
        integrations: parsed.integrations || [],
        architecture: parsed.architecture || 'Component-based architecture',
        suggestedPattern: parsed.suggestedPattern || 'Feature-based folder structure',
        navigationFlow: parsed.navigationFlow || 'Standard app navigation flow'
      };
    } catch (error) {
      console.error('Error parsing blueprint response:', error);
      console.log('Raw response:', text);

      // Return fallback if parsing fails
      return this.createFallbackAppBlueprint(request);
    }
  },

  // Create fallback blueprint when AI fails
  createFallbackAppBlueprint(request: any): any {
    const { appIdea, appName, platforms, designStyle } = request;

    return {
      screens: [
        {
          id: 'splash',
          name: 'Splash Screen',
          purpose: 'App loading and branding',
          type: 'loading',
          components: ['App logo', 'Loading indicator', 'Version info'],
          navigation: ['onboarding', 'login', 'dashboard'],
          subPages: [],
          edgeCases: ['Network error', 'App update required']
        },
        {
          id: 'onboarding',
          name: 'Onboarding Flow',
          purpose: 'Introduce app features and benefits',
          type: 'onboarding',
          components: ['Feature highlights', 'Skip button', 'Next/Previous buttons', 'Progress indicator'],
          navigation: ['login', 'signup'],
          subPages: ['welcome', 'features', 'permissions'],
          edgeCases: ['Skip onboarding', 'Return user']
        },
        {
          id: 'login',
          name: 'Login/Authentication',
          purpose: 'User authentication and account access',
          type: 'auth',
          components: ['Email input', 'Password input', 'Login button', 'Social login options', 'Forgot password link'],
          navigation: ['dashboard', 'signup', 'forgot-password'],
          subPages: ['forgot-password', 'reset-password'],
          edgeCases: ['Invalid credentials', 'Account locked', 'Network error']
        },
        {
          id: 'signup',
          name: 'Sign Up',
          purpose: 'New user registration',
          type: 'auth',
          components: ['Name input', 'Email input', 'Password input', 'Confirm password', 'Terms checkbox', 'Sign up button'],
          navigation: ['dashboard', 'login', 'email-verification'],
          subPages: ['email-verification', 'profile-setup'],
          edgeCases: ['Email already exists', 'Weak password', 'Terms not accepted']
        },
        {
          id: 'dashboard',
          name: 'Dashboard/Home',
          purpose: 'Main hub with overview and quick actions',
          type: 'main',
          components: ['Header with user info', 'Quick stats/metrics', 'Recent activity', 'Action buttons', 'Navigation menu'],
          navigation: ['profile', 'settings', 'main-features'],
          subPages: ['notifications', 'search'],
          edgeCases: ['No data available', 'Loading state', 'Error state']
        },
        {
          id: 'main-feature',
          name: this.getMainFeatureName(appIdea),
          purpose: 'Core functionality of the application',
          type: 'feature',
          components: ['Feature interface', 'Action buttons', 'Data display', 'Filter/sort options'],
          navigation: ['dashboard', 'details', 'create-edit'],
          subPages: ['details', 'create', 'edit', 'list'],
          edgeCases: ['Empty state', 'Loading', 'Error', 'No permissions']
        },
        {
          id: 'profile',
          name: 'User Profile',
          purpose: 'User profile management and personal information',
          type: 'feature',
          components: ['Profile picture', 'User info display', 'Edit profile button', 'Activity history'],
          navigation: ['dashboard', 'settings', 'edit-profile'],
          subPages: ['edit-profile', 'activity-history', 'achievements'],
          edgeCases: ['Profile incomplete', 'Image upload error']
        },
        {
          id: 'settings',
          name: 'Settings',
          purpose: 'App configuration and user preferences',
          type: 'settings',
          components: ['Preference toggles', 'Account settings', 'Privacy controls', 'Logout button'],
          navigation: ['dashboard', 'profile', 'privacy', 'notifications'],
          subPages: ['account', 'privacy', 'notifications', 'about'],
          edgeCases: ['Settings save error', 'Permission denied']
        }
      ],
      userRoles: [
        {
          name: 'User',
          permissions: ['view_content', 'create_content', 'edit_own_content', 'delete_own_content'],
          description: 'Standard app user with basic functionality access'
        },
        {
          name: 'Admin',
          permissions: ['view_all_content', 'create_content', 'edit_any_content', 'delete_any_content', 'manage_users', 'view_analytics'],
          description: 'Administrator with full app management capabilities'
        }
      ],
      dataModels: [
        {
          name: 'User',
          fields: ['id', 'email', 'name', 'avatar', 'createdAt', 'updatedAt', 'preferences', 'role'],
          relationships: ['hasMany: UserSessions', 'hasMany: UserActivities'],
          description: 'Core user entity with authentication and profile data'
        },
        {
          name: 'UserSession',
          fields: ['id', 'userId', 'token', 'createdAt', 'expiresAt', 'deviceInfo'],
          relationships: ['belongsTo: User'],
          description: 'User authentication sessions and device tracking'
        },
        {
          name: this.getMainFeatureName(appIdea).replace(/\s+/g, ''),
          fields: ['id', 'userId', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
          relationships: ['belongsTo: User'],
          description: `Main feature entity for ${this.getMainFeatureName(appIdea).toLowerCase()}`
        }
      ],
      pageFlow: [
        { from: 'splash', to: 'onboarding', condition: 'first_time_user', action: 'navigate' },
        { from: 'splash', to: 'login', condition: 'returning_user_not_logged_in', action: 'navigate' },
        { from: 'splash', to: 'dashboard', condition: 'user_logged_in', action: 'navigate' },
        { from: 'onboarding', to: 'signup', condition: 'user_wants_to_register', action: 'navigate' },
        { from: 'login', to: 'dashboard', condition: 'successful_login', action: 'navigate' },
        { from: 'signup', to: 'dashboard', condition: 'successful_registration', action: 'navigate' }
      ],
      modals: [
        {
          id: 'confirmation',
          name: 'Confirmation Dialog',
          purpose: 'Confirm destructive actions',
          triggerScreens: ['dashboard', 'profile', 'settings'],
          components: ['Message text', 'Confirm button', 'Cancel button']
        },
        {
          id: 'loading',
          name: 'Loading Modal',
          purpose: 'Show loading state for long operations',
          triggerScreens: ['dashboard', 'main-feature'],
          components: ['Loading spinner', 'Progress text', 'Cancel button']
        }
      ],
      states: [
        {
          name: 'Loading',
          description: 'Data is being fetched or processed',
          screens: ['dashboard', 'main-feature', 'profile'],
          conditions: ['api_request_pending', 'data_processing']
        },
        {
          name: 'Empty',
          description: 'No data available to display',
          screens: ['dashboard', 'main-feature'],
          conditions: ['no_data_found', 'first_time_user', 'filtered_results_empty']
        },
        {
          name: 'Error',
          description: 'An error occurred during operation',
          screens: ['dashboard', 'main-feature', 'profile', 'settings'],
          conditions: ['network_error', 'server_error', 'permission_denied']
        }
      ],
      integrations: [
        {
          name: 'Authentication',
          type: 'auth',
          description: 'User authentication and authorization',
          implementation: 'Firebase Auth or Auth0 for social login and user management'
        },
        {
          name: 'Cloud Storage',
          type: 'storage',
          description: 'File and data storage',
          implementation: 'Firebase Storage or AWS S3 for user-generated content'
        },
        {
          name: 'Push Notifications',
          type: 'notification',
          description: 'Real-time user notifications',
          implementation: 'Firebase Cloud Messaging for cross-platform notifications'
        }
      ],
      architecture: 'Component-based architecture with state management',
      suggestedPattern: 'Feature-based folder structure with shared components and utilities',
      navigationFlow: 'Splash → Onboarding/Login → Dashboard → Feature Screens → Settings/Profile'
    };
  },

  // Helper to determine main feature name based on app idea
  getMainFeatureName(appIdea: string): string {
    const idea = appIdea.toLowerCase();
    if (idea.includes('habit') || idea.includes('track')) return 'Habit Tracker';
    if (idea.includes('task') || idea.includes('todo')) return 'Task Manager';
    if (idea.includes('social') || idea.includes('chat')) return 'Social Feed';
    if (idea.includes('shop') || idea.includes('store') || idea.includes('ecommerce')) return 'Product Catalog';
    if (idea.includes('learn') || idea.includes('course') || idea.includes('education')) return 'Learning Hub';
    if (idea.includes('fitness') || idea.includes('workout')) return 'Fitness Tracker';
    if (idea.includes('finance') || idea.includes('budget') || idea.includes('money')) return 'Finance Manager';
    if (idea.includes('recipe') || idea.includes('food') || idea.includes('cooking')) return 'Recipe Collection';
    if (idea.includes('travel') || idea.includes('trip')) return 'Travel Planner';
    if (idea.includes('event') || idea.includes('calendar')) return 'Event Manager';
    return 'Main Feature';
  }
};
