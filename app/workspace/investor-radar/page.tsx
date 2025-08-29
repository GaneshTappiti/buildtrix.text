'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Star, 
  ExternalLink,
  Building,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

interface Investor {
  id: string;
  name: string;
  type: 'vc' | 'angel' | 'accelerator' | 'corporate';
  location: string;
  focusStages: string[];
  focusIndustries: string[];
  investmentRange: string;
  portfolio: number;
  description: string;
  website?: string;
  email?: string;
  phone?: string;
  recentInvestments: string[];
  founded?: string;
  aum?: string; // Assets under management
}

const mockInvestors: Investor[] = [
  {
    id: '1',
    name: 'Sequoia Capital',
    type: 'vc',
    location: 'Menlo Park, CA',
    focusStages: ['Seed', 'Series A', 'Series B', 'Growth'],
    focusIndustries: ['SaaS', 'FinTech', 'HealthTech', 'AI/ML'],
    investmentRange: '$100K - $100M',
    portfolio: 500,
    description: 'Leading venture capital firm focused on helping daring founders build legendary companies.',
    website: 'https://sequoiacap.com',
    email: 'info@sequoiacap.com',
    recentInvestments: ['Stripe', 'WhatsApp', 'Airbnb', 'Google', 'Apple'],
    founded: '1972',
    aum: '$85B'
  },
  {
    id: '2',
    name: 'Y Combinator',
    type: 'accelerator',
    location: 'Mountain View, CA',
    focusStages: ['Pre-Seed', 'Seed'],
    focusIndustries: ['SaaS', 'Consumer', 'B2B', 'FinTech', 'HealthTech'],
    investmentRange: '$125K - $250K',
    portfolio: 3000,
    description: 'The world\'s most successful startup accelerator, funding early-stage startups.',
    website: 'https://ycombinator.com',
    email: 'info@ycombinator.com',
    recentInvestments: ['Airbnb', 'Dropbox', 'Stripe', 'Reddit', 'Instacart'],
    founded: '2005',
    aum: '$7B'
  },
  {
    id: '3',
    name: 'Andreessen Horowitz',
    type: 'vc',
    location: 'Menlo Park, CA',
    focusStages: ['Seed', 'Series A', 'Series B', 'Growth'],
    focusIndustries: ['Crypto', 'SaaS', 'Consumer', 'Enterprise', 'Bio'],
    investmentRange: '$50K - $50M',
    portfolio: 400,
    description: 'Venture capital firm backing bold entrepreneurs building the future.',
    website: 'https://a16z.com',
    email: 'info@a16z.com',
    recentInvestments: ['Coinbase', 'Facebook', 'Twitter', 'Lyft', 'Slack'],
    founded: '2009',
    aum: '$35B'
  },
  {
    id: '4',
    name: 'Jason Calacanis',
    type: 'angel',
    location: 'San Francisco, CA',
    focusStages: ['Pre-Seed', 'Seed'],
    focusIndustries: ['SaaS', 'Consumer', 'Media', 'EdTech'],
    investmentRange: '$25K - $250K',
    portfolio: 150,
    description: 'Serial entrepreneur and angel investor, host of This Week in Startups.',
    website: 'https://calacanis.com',
    email: 'jason@calacanis.com',
    recentInvestments: ['Uber', 'Robinhood', 'Thumbtack', 'Calm', 'DataDog'],
    founded: '2009',
    aum: '$100M'
  }
];

const investorTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'vc', label: 'Venture Capital' },
  { value: 'angel', label: 'Angel Investor' },
  { value: 'accelerator', label: 'Accelerator' },
  { value: 'corporate', label: 'Corporate VC' }
];

const focusStages = [
  'All Stages', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+', 'Growth', 'Late Stage'
];

const focusIndustries = [
  'All Industries', 'SaaS', 'FinTech', 'HealthTech', 'AI/ML', 'Consumer', 'Enterprise', 
  'EdTech', 'Crypto', 'E-commerce', 'Media', 'Gaming', 'Climate', 'Bio'
];

export default function InvestorRadarPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        setLoading(true);
        // Mock user for demonstration
        const mockUser = { id: 'mock-user-id' };
        
        if (mockUser) {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setInvestors(mockInvestors);
        }
      } catch (error) {
        console.error('Error fetching investors:', error);
        setInvestors(mockInvestors); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  const filteredInvestors = investors.filter(investor => {
    const matchesSearch = investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investor.focusIndustries.some(industry => 
                           industry.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === 'all' || investor.type === selectedType;
    
    const matchesStage = selectedStage === 'All Stages' || 
                        investor.focusStages.includes(selectedStage);
    
    const matchesIndustry = selectedIndustry === 'All Industries' || 
                           investor.focusIndustries.includes(selectedIndustry);
    
    return matchesSearch && matchesType && matchesStage && matchesIndustry;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vc':
        return 'bg-blue-100 text-blue-800';
      case 'angel':
        return 'bg-green-100 text-green-800';
      case 'accelerator':
        return 'bg-purple-100 text-purple-800';
      case 'corporate':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vc':
        return 'Venture Capital';
      case 'angel':
        return 'Angel Investor';
      case 'accelerator':
        return 'Accelerator';
      case 'corporate':
        return 'Corporate VC';
      default:
        return type;
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
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-green-600" />
          Investor Radar
        </h1>
        <p className="text-gray-600 mb-6">
          Discover and connect with investors that align with your startup's stage and industry.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Investors</p>
                <p className="text-2xl font-bold text-blue-600">{investors.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">VCs</p>
                <p className="text-2xl font-bold text-green-600">
                  {investors.filter(inv => inv.type === 'vc').length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Angels</p>
                <p className="text-2xl font-bold text-purple-600">
                  {investors.filter(inv => inv.type === 'angel').length}
                </p>
              </div>
              <Star className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accelerators</p>
                <p className="text-2xl font-bold text-orange-600">
                  {investors.filter(inv => inv.type === 'accelerator').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search investors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Investor Type" />
            </SelectTrigger>
            <SelectContent>
              {investorTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Focus Stage" />
            </SelectTrigger>
            <SelectContent>
              {focusStages.map((stage) => (
                <SelectItem key={stage} value={stage}>
                  {stage}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {focusIndustries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Investors Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredInvestors.map((investor) => (
          <Card key={investor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{investor.name}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={getTypeColor(investor.type)}>
                      {getTypeLabel(investor.type)}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {investor.location}
                    </div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-sm">
                {investor.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Investment Range & Portfolio */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Investment Range:</span>
                    <p className="text-green-600 font-semibold">{investor.investmentRange}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Portfolio:</span>
                    <p className="font-semibold">{investor.portfolio} companies</p>
                  </div>
                </div>

                {/* Focus Stages */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Focus Stages:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {investor.focusStages.slice(0, 3).map((stage, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {stage}
                      </Badge>
                    ))}
                    {investor.focusStages.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{investor.focusStages.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Focus Industries */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Industries:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {investor.focusIndustries.slice(0, 3).map((industry, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                    {investor.focusIndustries.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{investor.focusIndustries.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Recent Investments */}
                <div>
                  <span className="text-sm font-medium text-gray-600">Recent Investments:</span>
                  <p className="text-sm text-gray-700 mt-1">
                    {investor.recentInvestments.slice(0, 3).join(', ')}
                    {investor.recentInvestments.length > 3 && '...'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Profile
                  </Button>
                  {investor.website && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(investor.website, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredInvestors.length === 0 && (
        <div className="text-center py-12">
          <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No investors found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      )}
    </div>
  );
}