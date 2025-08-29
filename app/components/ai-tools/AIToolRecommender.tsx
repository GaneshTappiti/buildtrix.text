"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  ExternalLink,
  Star,
  Brain,
  Sparkles,
  Copy,
  CheckCircle,
  ArrowRight,
  Target,
  Rocket
} from 'lucide-react';
import { aiToolsDatabase, aiToolsCategories, AITool } from '@/lib/aiToolsDatabase';

interface AIToolRecommenderProps {
  className?: string;
  onToolSelect?: (tool: AITool) => void;
}

const AIToolRecommender: React.FC<AIToolRecommenderProps> = ({
  className,
  onToolSelect
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPricing, setSelectedPricing] = useState<string>('all');
  const [filteredTools, setFilteredTools] = useState<AITool[]>(aiToolsDatabase);
  const [isRecommendationOpen, setIsRecommendationOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = aiToolsDatabase;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by pricing
    if (selectedPricing !== 'all') {
      filtered = filtered.filter(tool => tool.pricing.model === selectedPricing);
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, selectedPricing]);

  const handleToolClick = (tool: AITool) => {
    if (onToolSelect) {
      onToolSelect(tool);
    }
    toast({
      title: "Tool Selected",
      description: `${tool.name} has been selected for your project.`,
    });
  };

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'bg-green-100 text-green-800';
      case 'freemium': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (popularity: number) => {
    const rating = popularity / 20; // Convert popularity (0-100) to rating (0-5)
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">AI Tool Recommender</h2>
          <p className="text-gray-400">Discover the best AI tools for your project</p>
        </div>
        <Dialog open={isRecommendationOpen} onOpenChange={setIsRecommendationOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Brain className="mr-2 h-4 w-4" />
              Get Recommendations
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Get Personalized Recommendations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Project Type</Label>
                <Select>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="webapp">Web Application</SelectItem>
                    <SelectItem value="mobile">Mobile App</SelectItem>
                    <SelectItem value="content">Content Creation</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">Budget Range</Label>
                <RadioGroup defaultValue="freemium">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="text-white">Free tools only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="freemium" id="freemium" />
                    <Label htmlFor="freemium" className="text-white">Free + Paid options</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid" className="text-white">Premium tools</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Recommendations
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search AI tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {aiToolsCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.icon} {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedPricing} onValueChange={setSelectedPricing}>
          <SelectTrigger className="w-[150px] bg-gray-800 border-gray-600 text-white">
            <SelectValue placeholder="Pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Pricing</SelectItem>
            <SelectItem value="free">Free</SelectItem>
            <SelectItem value="freemium">Freemium</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <Card key={tool.id} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-white text-lg">{tool.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">{renderStars(tool.popularity)}</div>
                    <span className="text-sm text-gray-400">({tool.popularity}%)</span>
                  </div>
                </div>
                <Badge className={getPricingColor(tool.pricing.model)}>
                  {tool.pricing.model}
                </Badge>
              </div>
              <CardDescription className="text-gray-300">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2">Key Features</h4>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(tool.officialUrl, '_blank')}
                    className="flex-1"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Visit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleToolClick(tool)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Select
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Brain className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No tools found</h3>
          <p className="text-gray-400">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AIToolRecommender;
