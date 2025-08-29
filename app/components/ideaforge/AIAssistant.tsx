"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Brain, Sparkles, Wand2, Copy, RefreshCw, Send, Lightbulb, 
  Target, TrendingUp, Users, Zap, CheckCircle
} from "lucide-react";

interface AIPrompt {
  id: string;
  title: string;
  description: string;
  category: 'wiki' | 'blueprint' | 'journey' | 'feedback';
  prompt: string;
  icon: React.ComponentType<any>;
}

interface AIAssistantProps {
  onContentGenerated: (content: string, category: string) => void;
  ideaContext?: {
    title: string;
    description: string;
    category: string;
  };
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onContentGenerated, ideaContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<AIPrompt | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'custom'>('templates');

  const aiPrompts: AIPrompt[] = [
    {
      id: 'market-research',
      title: 'Market Research Analysis',
      description: 'Generate comprehensive market analysis and opportunity assessment',
      category: 'wiki',
      icon: TrendingUp,
      prompt: `Analyze the market opportunity for: ${ideaContext?.title || '[Your Idea]'}

Please provide:
1. Market size and growth potential
2. Target customer segments
3. Key market trends
4. Competitive landscape overview
5. Market entry opportunities`
    },
    {
      id: 'problem-solution',
      title: 'Problem-Solution Fit',
      description: 'Define clear problem statement and solution approach',
      category: 'wiki',
      icon: Lightbulb,
      prompt: `Define the problem-solution fit for: ${ideaContext?.title || '[Your Idea]'}

Include:
1. Core problem statement
2. Target user pain points
3. Current alternatives and limitations
4. Proposed solution approach
5. Unique value proposition`
    },
    {
      id: 'feature-breakdown',
      title: 'Feature Breakdown',
      description: 'Generate detailed feature list with priorities',
      category: 'blueprint',
      icon: Target,
      prompt: `Create a comprehensive feature breakdown for: ${ideaContext?.title || '[Your Idea]'}

Organize by:
1. Core MVP features (must-have)
2. Enhancement features (nice-to-have)
3. Future roadmap features
4. Technical requirements for each
5. Estimated development effort`
    },
    {
      id: 'tech-stack',
      title: 'Technology Recommendations',
      description: 'Suggest optimal technology stack and architecture',
      category: 'blueprint',
      icon: Zap,
      prompt: `Recommend a technology stack for: ${ideaContext?.title || '[Your Idea]'}

Consider:
1. Frontend technologies and frameworks
2. Backend architecture and services
3. Database solutions
4. Third-party integrations
5. Scalability and performance requirements`
    },
    {
      id: 'milestone-planning',
      title: 'Milestone Planning',
      description: 'Create development timeline with key milestones',
      category: 'journey',
      icon: CheckCircle,
      prompt: `Create a development milestone plan for: ${ideaContext?.title || '[Your Idea]'}

Structure:
1. Pre-development phase (research, planning)
2. MVP development milestones
3. Testing and validation phases
4. Launch preparation
5. Post-launch iterations`
    },
    {
      id: 'user-personas',
      title: 'User Personas',
      description: 'Generate detailed user personas and use cases',
      category: 'wiki',
      icon: Users,
      prompt: `Create user personas for: ${ideaContext?.title || '[Your Idea]'}

For each persona include:
1. Demographics and background
2. Goals and motivations
3. Pain points and challenges
4. Technology comfort level
5. How they would use the product`
    }
  ];

  const handleGenerateContent = async () => {
    if (!selectedPrompt && !customPrompt.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI content generation (replace with actual AI API call)
    const prompt = selectedPrompt ? selectedPrompt.prompt : customPrompt;
    
    try {
      // This would be replaced with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockContent = generateMockContent(selectedPrompt?.category || 'wiki', prompt);
      setGeneratedContent(mockContent);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = (category: string, prompt: string): string => {
    const mockResponses = {
      wiki: `# Market Analysis

## Market Size & Opportunity
The target market for this solution shows significant growth potential, with an estimated TAM of $2.4B and growing at 15% CAGR.

## Target Segments
- **Primary**: Tech-savvy professionals aged 25-40
- **Secondary**: Small business owners seeking efficiency
- **Tertiary**: Enterprise teams looking for collaboration tools

## Key Trends
1. Increasing demand for remote-first solutions
2. Growing focus on productivity and automation
3. Rising adoption of AI-powered tools

## Competitive Landscape
Current solutions lack comprehensive integration and user-friendly interfaces, presenting a clear opportunity for disruption.`,
      
      blueprint: `# Feature Specification

## Core MVP Features
### 1. User Authentication & Onboarding
- **Priority**: High
- **Effort**: 2 weeks
- **Description**: Secure login, registration, and guided onboarding

### 2. Dashboard & Analytics
- **Priority**: High  
- **Effort**: 3 weeks
- **Description**: Central hub with key metrics and insights

### 3. Core Functionality
- **Priority**: High
- **Effort**: 4 weeks
- **Description**: Primary feature set that delivers core value

## Enhancement Features
- Advanced reporting and analytics
- Team collaboration tools
- Third-party integrations
- Mobile application

## Technical Requirements
- React/Next.js frontend
- Node.js/Express backend
- PostgreSQL database
- Redis for caching`,
      
      journey: `# Development Roadmap

## Phase 1: Foundation (Weeks 1-4)
- Market research and validation
- Technical architecture planning
- UI/UX design and prototyping
- Team setup and tooling

## Phase 2: MVP Development (Weeks 5-12)
- Core feature development
- Database design and implementation
- API development and testing
- Frontend implementation

## Phase 3: Testing & Refinement (Weeks 13-16)
- User acceptance testing
- Performance optimization
- Security audit and fixes
- Documentation completion

## Phase 4: Launch Preparation (Weeks 17-20)
- Beta testing with select users
- Marketing material preparation
- Deployment infrastructure setup
- Launch strategy execution`
    };

    return mockResponses[category as keyof typeof mockResponses] || mockResponses.wiki;
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  const handleUseContent = () => {
    if (generatedContent && selectedPrompt) {
      onContentGenerated(generatedContent, selectedPrompt.category);
      setIsOpen(false);
      setGeneratedContent('');
      setSelectedPrompt(null);
    }
  };

  const filteredPrompts = aiPrompts.filter(prompt => 
    activeTab === 'templates' ? true : false
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="workspace-button">
          <Brain className="h-4 w-4 mr-2" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl glass-effect-theme border-green-500/20 max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-green-400" />
            AI Content Assistant
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'templates' ? 'default' : 'outline'}
              onClick={() => setActiveTab('templates')}
              className={activeTab === 'templates' ? 'workspace-button' : 'border-green-500/30 text-green-400 hover:bg-green-600/10'}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button
              variant={activeTab === 'custom' ? 'default' : 'outline'}
              onClick={() => setActiveTab('custom')}
              className={activeTab === 'custom' ? 'workspace-button' : 'border-green-500/30 text-green-400 hover:bg-green-600/10'}
            >
              <Send className="h-4 w-4 mr-2" />
              Custom Prompt
            </Button>
          </div>

          {activeTab === 'templates' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <Card
                    key={prompt.id}
                    className={`glass-effect cursor-pointer transition-all hover:bg-white/5 ${
                      selectedPrompt?.id === prompt.id ? 'ring-2 ring-green-500/50' : ''
                    }`}
                    onClick={() => setSelectedPrompt(prompt)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-600/20">
                          <Icon className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-white mb-1">{prompt.title}</h3>
                          <p className="text-sm text-gray-400 mb-2">{prompt.description}</p>
                          <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                            {prompt.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Custom Prompt</label>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom prompt for AI content generation..."
                  className="bg-black/30 border-green-500/20 text-white min-h-[120px] focus:border-green-500/40"
                />
              </div>
            </div>
          )}

          {/* Generate Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGenerateContent}
              disabled={isGenerating || (!selectedPrompt && !customPrompt.trim())}
              className="workspace-button"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </div>

          {/* Generated Content */}
          {generatedContent && (
            <Card className="glass-effect-theme">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Generated Content</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyContent}
                      className="border-green-500/30 text-green-400 hover:bg-green-600/10"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleUseContent}
                      className="workspace-button"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Use Content
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-black/30 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">
                    {generatedContent}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
