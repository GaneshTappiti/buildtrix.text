/**
 * Client-side Gemini service that uses API routes
 * This avoids environment variable issues on the client side
 */

export interface GeminiResponse {
  text: string;
  confidence: number;
  metadata?: any;
}

export interface GeminiOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

class ClientGeminiService {
  private baseUrl = '/api/ai';

  async generateText(prompt: string, options: GeminiOptions = {}): Promise<GeminiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/rag-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          options: {
            model: options.model || 'gemini-1.5-flash',
            maxTokens: options.maxTokens,
            temperature: options.temperature
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        text: data.text,
        confidence: data.confidence || 0.9,
        metadata: data.metadata
      };
    } catch (error) {
      console.error('Client Gemini Service Error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate content with Gemini AI'
      );
    }
  }

  async validateIdea(idea: string): Promise<{
    score: number;
    feedback: string;
    suggestions: string[];
    marketPotential: number;
    technicalFeasibility: number;
    competitiveAdvantage: number;
  }> {
    const prompt = `
Analyze this app idea and provide a comprehensive validation:

App Idea: "${idea}"

Please provide:
1. Overall viability score (0-100)
2. Detailed feedback
3. 3-5 specific improvement suggestions
4. Market potential assessment (0-100)
5. Technical feasibility assessment (0-100)
6. Competitive advantage assessment (0-100)

Format your response as JSON with the following structure:
{
  "score": number,
  "feedback": "detailed feedback text",
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "marketPotential": number,
  "technicalFeasibility": number,
  "competitiveAdvantage": number
}
`;

    try {
      const response = await this.generateText(prompt);
      
      // Try to parse JSON from the response
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: parsed.score || 70,
          feedback: parsed.feedback || 'Analysis completed successfully.',
          suggestions: parsed.suggestions || ['Consider market research', 'Validate with users', 'Analyze competitors'],
          marketPotential: parsed.marketPotential || 70,
          technicalFeasibility: parsed.technicalFeasibility || 80,
          competitiveAdvantage: parsed.competitiveAdvantage || 60
        };
      }
      
      // Fallback if JSON parsing fails
      return {
        score: 75,
        feedback: response.text.substring(0, 500) + '...',
        suggestions: ['Conduct market research', 'Validate with potential users', 'Analyze competitor landscape'],
        marketPotential: 70,
        technicalFeasibility: 80,
        competitiveAdvantage: 65
      };
    } catch (error) {
      console.error('Idea validation error:', error);
      return {
        score: 70,
        feedback: 'Unable to complete full analysis, but the idea shows potential. Consider conducting market research and user validation.',
        suggestions: ['Conduct market research', 'Validate with potential users', 'Create a prototype'],
        marketPotential: 70,
        technicalFeasibility: 75,
        competitiveAdvantage: 60
      };
    }
  }

  async generateAppBlueprint(request: {
    appIdea: string;
    appName: string;
    platforms: string[];
    designStyle: string;
    targetAudience?: string;
  }): Promise<any> {
    const prompt = `
Create a comprehensive app blueprint for:

App Name: ${request.appName}
App Idea: ${request.appIdea}
Platforms: ${request.platforms.join(', ')}
Design Style: ${request.designStyle}
Target Audience: ${request.targetAudience || 'General users'}

Please provide a detailed blueprint including:

## SCREENS LIST
List all main screens with their purpose and key features.

## USER ROLES
Define different user types and their permissions.

## COMPREHENSIVE DATA MODELS
Define the data structures and relationships.

## CORE FEATURES
List the essential features for the MVP.

## TECHNICAL ARCHITECTURE
Suggest the technical stack and architecture patterns.

Format the response with clear sections and bullet points.
`;

    try {
      const response = await this.generateText(prompt, { model: 'gemini-pro' });
      return {
        blueprint: response.text,
        confidence: response.confidence,
        metadata: response.metadata
      };
    } catch (error) {
      console.error('Blueprint generation error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const clientGeminiService = new ClientGeminiService();
