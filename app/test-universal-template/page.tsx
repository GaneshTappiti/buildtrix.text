'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lightbulb, Target, Users, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface AnalysisResult {
  prompt: string;
  analysis: string;
}

export default function TestUniversalTemplatePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const universalPrompt = `
You are an expert startup advisor and business analyst. Analyze the following business idea or concept and provide a comprehensive evaluation covering these key areas:

1. **Problem & Solution Fit**
   - What problem does this solve?
   - How well does the proposed solution address the problem?
   - Is this a real pain point for the target market?

2. **Market Opportunity**
   - Target market size and characteristics
   - Market trends and growth potential
   - Competitive landscape analysis

3. **Business Model Viability**
   - Revenue streams and monetization strategy
   - Cost structure and unit economics
   - Scalability potential

4. **Execution Feasibility**
   - Technical complexity and requirements
   - Resource needs (team, funding, time)
   - Key risks and mitigation strategies

5. **Validation & Next Steps**
   - How to validate this idea quickly and cheaply
   - Minimum viable product (MVP) recommendations
   - Key metrics to track

Please provide actionable insights and be specific in your recommendations. Structure your response with clear sections and bullet points for easy reading.

Business Idea/Concept to Analyze:
`;

  const handleAnalyze = async () => {
    if (!input.trim()) {
      setError('Please enter a business idea or concept to analyze');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulate API call - replace with actual AI service integration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = `
## Problem & Solution Fit
• **Problem Identified**: ${input.slice(0, 100)}... addresses a clear market need
• **Solution Quality**: The proposed approach shows strong potential for solving the identified problem
• **Pain Point Validation**: This appears to be a genuine pain point based on market research

## Market Opportunity
• **Target Market**: Large addressable market with growing demand
• **Market Size**: Estimated TAM of $X billion with X% annual growth
• **Competition**: Moderate competition with opportunities for differentiation

## Business Model Viability
• **Revenue Streams**: Multiple monetization opportunities identified
• **Unit Economics**: Positive unit economics achievable with scale
• **Scalability**: High scalability potential through digital channels

## Execution Feasibility
• **Technical Complexity**: Moderate - requires skilled development team
• **Resource Requirements**: Estimated $X funding needed for MVP
• **Key Risks**: Market adoption, technical execution, competition

## Validation & Next Steps
• **MVP Strategy**: Start with core feature set and iterate
• **Validation Methods**: Customer interviews, landing page tests, pilot programs
• **Key Metrics**: User acquisition, engagement, retention, revenue per user

**Overall Assessment**: This idea shows promise and warrants further investigation and validation.
      `;

      setResult({
        prompt: universalPrompt,
        analysis: mockAnalysis
      });
    } catch (err) {
      setError('Failed to analyze the business idea. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('## ')) {
        return (
          <h3 key={index} className="text-lg font-semibold mt-4 mb-2 flex items-center gap-2">
            {line.includes('Problem') && <Lightbulb className="w-5 h-5" />}
            {line.includes('Market') && <Target className="w-5 h-5" />}
            {line.includes('Business') && <DollarSign className="w-5 h-5" />}
            {line.includes('Execution') && <TrendingUp className="w-5 h-5" />}
            {line.includes('Validation') && <Users className="w-5 h-5" />}
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('• ')) {
        return (
          <li key={index} className="ml-4 mb-1">
            {line.replace('• ', '')}
          </li>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="font-semibold mt-3 mb-1">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      } else if (line.trim()) {
        return (
          <p key={index} className="mb-2">
            {line}
          </p>
        );
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Universal Business Idea Analyzer</h1>
        <p className="text-gray-600 mb-6">
          Test our universal prompt template by analyzing any business idea or concept. 
          Get comprehensive insights on market opportunity, feasibility, and next steps.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Your Business Idea</CardTitle>
            <CardDescription>
              Describe your business idea, product concept, or startup vision in detail
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Example: A mobile app that uses AI to help people find parking spots in real-time by connecting with IoT sensors in parking meters and private lots..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
              className="w-full"
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={loading || !input.trim()}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze Business Idea'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {result && (
          <div className="space-y-6">
            {/* Prompt Display */}
            <Card>
              <CardHeader>
                <CardTitle>Universal Prompt Template</CardTitle>
                <CardDescription>
                  The standardized prompt used for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700">
                    {result.prompt}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Comprehensive evaluation of your business idea
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {formatAnalysis(result.analysis)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}