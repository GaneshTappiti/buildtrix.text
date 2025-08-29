'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Zap, 
  Brain, 
  Code, 
  Palette, 
  BarChart3,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Globe
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: 'Free' | 'Freemium' | 'Paid';
  rating: number;
  features: string[];
  officialUrl?: string;
  popularity: number;
  tags: string[];
}

const mockAITools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for text generation, coding, and problem-solving',
    category: 'Text Generation',
    pricing: 'Freemium',
    rating: 4.8,
    features: ['Natural language processing', 'Code generation', 'Creative writing', 'Problem solving'],
    officialUrl: 'https://chat.openai.com',
    popularity: 95,
    tags: ['conversational', 'coding', 'writing', 'popular']
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'AI-powered image generation from text prompts',
    category: 'Image Generation',
    pricing: 'Paid',
    rating: 4.7,
    features: ['Text-to-image', 'Artistic styles', 'High resolution', 'Community gallery'],
    officialUrl: 'https://midjourney.com',
    popularity: 88,
    tags: ['art', 'images', 'creative', 'design']
  },
  {
    id: '3',
    name: 'GitHub Copilot',
    description: 'AI pair programmer that helps you write code faster',
    category: 'Code Generation',
    pricing: 'Paid',
    rating: 4.6,
    features: ['Code completion', 'Multiple languages', 'Context-aware', 'IDE integration'],
    officialUrl: 'https://github.com/features/copilot',
    popularity: 82,
    tags: ['coding', 'programming', 'productivity', 'github']
  },
  {
    id: '4',
    name: 'Notion AI',
    description: 'AI writing assistant integrated into Notion workspace',
    category: 'Productivity',
    pricing: 'Freemium',
    rating: 4.5,
    features: ['Writing assistance', 'Content generation', 'Summarization', 'Translation'],
    officialUrl: 'https://notion.so/product/ai',
    popularity: 75,
    tags: ['productivity', 'writing', 'workspace', 'organization']
  },
  {
    id: '5',
    name: 'Runway ML',
    description: 'Creative AI tools for video editing and generation',
    category: 'Video Generation',
    pricing: 'Freemium',
    rating: 4.4,
    features: ['Video generation', 'Green screen', 'Object removal', 'Style transfer'],
    officialUrl: 'https://runwayml.com',
    popularity: 70,
    tags: ['video', 'creative', 'editing', 'generation']
  },
  {
    id: '6',
    name: 'Jasper',
    description: 'AI content creation platform for marketing and business',
    category: 'Content Marketing',
    pricing: 'Paid',
    rating: 4.3,
    features: ['Blog writing', 'Ad copy', 'Social media', 'SEO optimization'],
    officialUrl: 'https://jasper.ai',
    popularity: 68,
    tags: ['marketing', 'content', 'business', 'copywriting']
  }
];

const categories = [
  { id: 'all', name: 'All Tools', icon: Globe },
  { id: 'Text Generation', name: 'Text Generation', icon: FileText },
  { id: 'Image Generation', name: 'Image Generation', icon: ImageIcon },
  { id: 'Code Generation', name: 'Code Generation', icon: Code },
  { id: 'Video Generation', name: 'Video Generation', icon: Video },
  { id: 'Productivity', name: 'Productivity', icon: Zap },
  { id: 'Content Marketing', name: 'Content Marketing', icon: BarChart3 }
];

export default function AIToolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'name'>('popularity');

  const filteredTools = mockAITools
    .filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
        default:
          return b.popularity - a.popularity;
      }
    });

  const handleToolSelect = (tool: { name: string; officialUrl?: string }) => {
    if (tool.officialUrl) {
      window.open(tool.officialUrl, '_blank');
    }
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'Free':
        return 'bg-green-100 text-green-800';
      case 'Freemium':
        return 'bg-blue-100 text-blue-800';
      case 'Paid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Brain className="w-8 h-8 text-blue-600" />
          AI Tools Directory
        </h1>
        <p className="text-gray-600 mb-6">
          Discover and explore the best AI tools to supercharge your productivity and creativity.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'popularity' | 'rating' | 'name')}
            className="px-3 py-2 border rounded-md bg-white"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="rating">Sort by Rating</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <IconComponent className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Tools Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(tool.rating)}</div>
                    <span className="text-sm text-gray-600">({tool.rating})</span>
                  </div>
                </div>
                <Badge className={getPricingColor(tool.pricing)}>
                  {tool.pricing}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Features */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {tool.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{tool.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <div className="flex flex-wrap gap-1">
                    {tool.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleToolSelect(tool)}
                    className="flex-1"
                    size="sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Tool
                  </Button>
                  <Button variant="outline" size="sm">
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or category filters.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{mockAITools.length}</div>
            <div className="text-sm text-gray-600">AI Tools Listed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
            <div className="text-sm text-gray-600">Categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {mockAITools.filter(tool => tool.pricing === 'Free').length}
            </div>
            <div className="text-sm text-gray-600">Free Tools</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}