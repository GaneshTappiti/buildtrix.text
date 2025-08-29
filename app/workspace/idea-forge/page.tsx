'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Filter, 
  Star, 
  TrendingUp, 
  Users, 
  Target,
  Rocket,
  Brain,
  Sparkles
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
}

const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Personal Finance Coach',
    description: 'An intelligent app that analyzes spending patterns and provides personalized financial advice using machine learning.',
    category: 'FinTech',
    status: 'validated',
    tags: ['AI', 'Finance', 'Mobile App', 'Machine Learning'],
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    validationScore: 85,
    marketPotential: 'high'
  },
  {
    id: '2',
    title: 'Sustainable Food Delivery Platform',
    description: 'A delivery service focused on local, organic restaurants with carbon-neutral delivery methods.',
    category: 'Food & Beverage',
    status: 'exploring',
    tags: ['Sustainability', 'Food', 'Delivery', 'Environment'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    validationScore: 72,
    marketPotential: 'medium'
  },
  {
    id: '3',
    title: 'Virtual Reality Fitness Studio',
    description: 'Immersive VR workouts that make exercise engaging and fun, with social features for group classes.',
    category: 'Health & Fitness',
    status: 'draft',
    tags: ['VR', 'Fitness', 'Social', 'Gaming'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    validationScore: 60,
    marketPotential: 'high'
  }
];

const categories = [
  'All Categories',
  'FinTech',
  'Health & Fitness',
  'Food & Beverage',
  'Education',
  'Entertainment',
  'Productivity',
  'Social',
  'E-commerce'
];

export default function IdeaForgePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        // Mock user for demonstration
        const mockUser = { id: 'mock-user-id' };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIdeas(mockIdeas);
      } catch (error) {
        console.error('Error fetching ideas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All Categories' || idea.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || idea.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="w-8 h-8 text-yellow-500" />
              Idea Forge
            </h1>
            <p className="text-gray-600">
              Capture, develop, and validate your startup ideas in one place.
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)} className="bg-yellow-600 hover:bg-yellow-700">
            <Plus className="w-4 h-4 mr-2" />
            New Idea
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Ideas</p>
                <p className="text-2xl font-bold text-blue-600">{ideas.length}</p>
              </div>
              <Brain className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validated</p>
                <p className="text-2xl font-bold text-green-600">
                  {ideas.filter(idea => idea.status === 'validated').length}
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Exploring</p>
                <p className="text-2xl font-bold text-blue-600">
                  {ideas.filter(idea => idea.status === 'exploring').length}
                </p>
              </div>
              <Rocket className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-purple-600">
                  {ideas.length > 0 
                    ? Math.round(ideas.reduce((sum, idea) => sum + (idea.validationScore || 0), 0) / ideas.length)
                    : 0}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search ideas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList>
            <TabsTrigger value="all">All Ideas</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="exploring">Exploring</TabsTrigger>
            <TabsTrigger value="validated">Validated</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredIdeas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{idea.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {idea.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge className={getStatusColor(idea.status)}>
                  {idea.status}
                </Badge>
                {idea.marketPotential && (
                  <Badge className={getMarketPotentialColor(idea.marketPotential)}>
                    {idea.marketPotential} potential
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Validation Score */}
                {idea.validationScore && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Validation Score</span>
                      <span className="text-sm text-gray-600">{idea.validationScore}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${idea.validationScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{idea.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-xs text-gray-500">
                  <p>Category: {idea.category}</p>
                  <p>Updated: {new Date(idea.updatedAt).toLocaleDateString()}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || selectedCategory !== 'All Categories' || selectedStatus !== 'all'
              ? 'Try adjusting your search criteria.'
              : "You haven't created any ideas yet. Start by adding your first idea!"}
          </p>
          <Button onClick={() => setIsCreating(true)} className="bg-yellow-600 hover:bg-yellow-700">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Idea
          </Button>
        </div>
      )}
    </div>
  );
}