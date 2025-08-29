'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  Star, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'draft' | 'exploring' | 'validated' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  validationScore?: number;
  marketPotential?: 'low' | 'medium' | 'high';
  problemStatement?: string;
  targetMarket?: string;
  competitorAnalysis?: string;
  monetizationStrategy?: string;
  keyFeatures?: string[];
  nextSteps?: string[];
}

const mockIdea: Idea = {
  id: '1',
  title: 'AI-Powered Personal Finance Coach',
  description: 'An intelligent app that analyzes spending patterns and provides personalized financial advice using machine learning algorithms to help users achieve their financial goals.',
  category: 'FinTech',
  status: 'validated',
  tags: ['AI', 'Finance', 'Mobile App', 'Machine Learning', 'Personal Finance'],
  createdAt: '2024-01-15',
  updatedAt: '2024-01-20',
  validationScore: 85,
  marketPotential: 'high',
  problemStatement: 'Many people struggle with personal finance management and lack personalized guidance to make informed financial decisions.',
  targetMarket: 'Young professionals aged 25-40 who want to improve their financial literacy and achieve financial goals.',
  competitorAnalysis: 'Mint, YNAB, and Personal Capital are main competitors, but they lack AI-powered personalized coaching.',
  monetizationStrategy: 'Freemium model with premium AI coaching features, affiliate partnerships with financial institutions.',
  keyFeatures: [
    'AI-powered spending analysis',
    'Personalized financial recommendations',
    'Goal tracking and progress monitoring',
    'Educational content and tips',
    'Integration with bank accounts',
    'Investment recommendations'
  ],
  nextSteps: [
    'Conduct user interviews to validate assumptions',
    'Build MVP with core AI features',
    'Partner with financial institutions for data access',
    'Develop machine learning models for recommendations',
    'Create user onboarding flow'
  ]
};

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedIdea, setEditedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch the idea by ID from the API
        setIdea(mockIdea);
        setEditedIdea(mockIdea);
      } catch (error) {
        console.error('Error fetching idea:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.ideaId) {
      fetchIdea();
    }
  }, [params.ideaId]);

  const handleSave = async () => {
    if (!editedIdea) return;
    
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setIdea(editedIdea);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated':
        return 'bg-green-100 text-green-800';
      case 'exploring':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketPotentialColor = (potential?: string) => {
    switch (potential) {
      case 'high':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Idea Not Found</h2>
          <p className="mb-4">The idea you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.back()} variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vault
          </Button>
        </div>

        {/* Idea Header */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-white">{idea.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-black/20 border-white/10 hover:bg-black/30 text-white">
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" /> Validate
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className={getStatusColor(idea.status)}>
                {idea.status}
              </Badge>
              {idea.marketPotential && (
                <Badge className={getMarketPotentialColor(idea.marketPotential)}>
                  {idea.marketPotential} potential
                </Badge>
              )}
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white">
                {idea.category}
              </Badge>
            </div>
          </div>

          {/* Validation Score */}
          {idea.validationScore && (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-white">Validation Score</h3>
                  <span className="text-2xl font-bold text-white">{idea.validationScore}/100</span>
                </div>
                <Progress value={idea.validationScore} className="mb-2" />
                <p className="text-sm text-gray-300">
                  {idea.validationScore >= 80 ? 'Highly validated idea with strong market potential' :
                   idea.validationScore >= 60 ? 'Good validation score, consider further research' :
                   'Needs more validation and market research'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">Overview</TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-white/20 text-white">Analysis</TabsTrigger>
            <TabsTrigger value="planning" className="data-[state=active]:bg-white/20 text-white">Planning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Description */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-200">{idea.description}</p>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="bg-white/10 border-white/20 text-white">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Features */}
            {idea.keyFeatures && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Key Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {idea.keyFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-200">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Problem Statement */}
            {idea.problemStatement && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Problem Statement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{idea.problemStatement}</p>
                </CardContent>
              </Card>
            )}

            {/* Target Market */}
            {idea.targetMarket && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Target Market
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{idea.targetMarket}</p>
                </CardContent>
              </Card>
            )}

            {/* Competitor Analysis */}
            {idea.competitorAnalysis && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Competitor Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{idea.competitorAnalysis}</p>
                </CardContent>
              </Card>
            )}

            {/* Monetization Strategy */}
            {idea.monetizationStrategy && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Monetization Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-200">{idea.monetizationStrategy}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="planning" className="space-y-6">
            {/* Next Steps */}
            {idea.nextSteps && (
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {idea.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-200">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add to Project
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Star className="mr-2 h-4 w-4" />
                Mark as Favorite
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Meta Information */}
        <Card className="mt-8 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row justify-between text-sm text-gray-300">
              <span>Created: {new Date(idea.createdAt).toLocaleDateString()}</span>
              <span>Last updated: {new Date(idea.updatedAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}