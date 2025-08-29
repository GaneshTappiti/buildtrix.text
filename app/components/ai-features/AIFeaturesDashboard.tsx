'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  FileText, 
  Map, 
  CheckSquare, 
  Users, 
  Zap, 
  BarChart3, 
  Lightbulb, 
  PenTool,
  Loader2
} from 'lucide-react';

const AIFeaturesDashboard = () => {
  const ai = useEnhancedAI();
  const [activeFeature, setActiveFeature] = useState('validate');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<unknown>(null);

  const features = [
    {
      id: 'validate',
      title: 'Idea Validation',
      description: 'Get AI-powered validation and scoring for your startup ideas',
      icon: Target,
      color: 'bg-blue-500',
      placeholder: 'Describe your startup idea...'
    },
    {
      id: 'market',
      title: 'Market Analysis',
      description: 'Analyze market trends, opportunities, and threats',
      icon: TrendingUp,
      color: 'bg-green-500',
      placeholder: 'Enter industry (e.g., "fintech", "healthcare")...'
    },
    {
      id: 'brief',
      title: 'Startup Brief',
      description: 'Generate comprehensive startup briefs and business plans',
      icon: FileText,
      color: 'bg-purple-500',
      placeholder: 'Describe your startup concept...'
    },
    {
      id: 'roadmap',
      title: 'Roadmap Planning',
      description: 'Create detailed development roadmaps and milestones',
      icon: Map,
      color: 'bg-orange-500',
      placeholder: 'Describe your project or startup idea...'
    },
    {
      id: 'tasks',
      title: 'Task Breakdown',
      description: 'Break down features into actionable tasks with estimates',
      icon: CheckSquare,
      color: 'bg-red-500',
      placeholder: 'Describe the feature to break down...'
    },
    {
      id: 'investors',
      title: 'Investor Matching',
      description: 'Find suitable investors and funding strategies',
      icon: Users,
      color: 'bg-indigo-500',
      placeholder: 'Enter startup details (JSON format)...'
    },
    {
      id: 'optimize-prompt',
      title: 'Prompt Optimization',
      description: 'Improve your AI prompts for better results',
      icon: Zap,
      color: 'bg-yellow-500',
      placeholder: 'Enter your prompt to optimize...'
    },
    {
      id: 'insights',
      title: 'Analytics Insights',
      description: 'Generate insights from your data and metrics',
      icon: BarChart3,
      color: 'bg-cyan-500',
      placeholder: 'Enter data (JSON format)...'
    },
    {
      id: 'recommendations',
      title: 'AI Recommendations',
      description: 'Get personalized recommendations based on context',
      icon: Lightbulb,
      color: 'bg-pink-500',
      placeholder: 'Enter context (JSON format)...'
    },
    {
      id: 'improve-writing',
      title: 'Writing Assistant',
      description: 'Improve your writing with AI suggestions',
      icon: PenTool,
      color: 'bg-teal-500',
      placeholder: 'Enter text to improve...'
    }
  ];

  const handleGenerate = async () => {
    if (!input.trim()) return;

    try {
      let response;
      const _feature = features.find(f => f.id === activeFeature);
      
      switch (activeFeature) {
        case 'validate':
          response = await ai.validateIdea(input);
          break;
        case 'market':
          response = await ai.analyzeMarket(input);
          break;
        case 'brief':
          response = await ai.generateBrief(input);
          break;
        case 'roadmap':
          response = await ai.generateRoadmap(input);
          break;
        case 'tasks':
          response = await ai.breakdownTasks(input);
          break;
        case 'investors':
          response = await ai.findInvestorMatches(JSON.parse(input));
          break;
        case 'optimize-prompt':
          response = await ai.optimizePrompt(input, 'general');
          break;
        case 'insights':
          response = await ai.generateInsights(JSON.parse(input));
          break;
        case 'recommendations':
          response = await ai.generateRecommendations(JSON.parse(input));
          break;
        case 'improve-writing':
          response = await ai.improveWriting(input, 'general');
          break;
        default:
          response = await ai.generateText(input);
      }
      
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const activeFeatureData = features.find(f => f.id === activeFeature);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Brain className="h-8 w-8 text-blue-500" />
          AI Features Dashboard
        </h1>
        <p className="text-muted-foreground">
          Explore all AI-powered features using Google Gemini
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card 
              key={feature.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                activeFeature === feature.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setActiveFeature(feature.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-sm">{feature.title}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {activeFeatureData && <activeFeatureData.icon className="h-5 w-5" />}
              {activeFeatureData?.title}
            </CardTitle>
            <CardDescription>
              {activeFeatureData?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder={activeFeatureData?.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={6}
            />
            <Button 
              onClick={handleGenerate} 
              disabled={ai.isLoading || !input.trim()}
              className="w-full"
            >
              {ai.isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate ${activeFeatureData?.title}`
              )}
            </Button>
            {ai.error && (
              <div className="text-red-500 text-sm">{ai.error}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
            <CardDescription>
              Generated results will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {typeof result === 'string' ? (
                  <div className="whitespace-pre-wrap text-sm">{result}</div>
                ) : (
                  <pre className="text-sm bg-muted p-4 rounded-lg overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-8">
                Select a feature and enter your input to see AI-generated results
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>✅ Available AI Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[
              'Idea validation and scoring',
              'Market analysis generation', 
              'Content creation assistance',
              'Roadmap and planning',
              'Investor matching',
              'Task breakdown and estimation',
              'Prompt optimization',
              'Analytics insights',
              'Recommendation engine',
              'Writing assistance'
            ].map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIFeaturesDashboard;
