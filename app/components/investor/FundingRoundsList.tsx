"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Building2,
  Users,
  ExternalLink,
  Clock,
  Target
} from "lucide-react";

interface FundingRound {
  id: string;
  companyName: string;
  companyLogo?: string;
  industry: string;
  roundType: 'Pre-Seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';
  amount: string;
  date: string;
  leadInvestor: string;
  participants: string[];
  description: string;
  website?: string;
  status: 'Active' | 'Closed' | 'Rumored';
}

const FundingRoundsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoundType, setSelectedRoundType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Mock funding rounds data
  const fundingRounds: FundingRound[] = [
    {
      id: '1',
      companyName: 'AI Fitness Coach',
      industry: 'HealthTech',
      roundType: 'Seed',
      amount: '$2.5M',
      date: '2024-01-15',
      leadInvestor: 'TechVentures Capital',
      participants: ['Innovation Partners', 'Health Fund', 'Angel Group'],
      description: 'AI-powered personalized fitness coaching platform with 50K+ active users.',
      website: 'https://aifitnesscoach.com',
      status: 'Active'
    },
    {
      id: '2',
      companyName: 'EcoLogistics',
      industry: 'Climate Tech',
      roundType: 'Series A',
      amount: '$8M',
      date: '2024-01-10',
      leadInvestor: 'Future Fund',
      participants: ['Green Ventures', 'Climate Capital', 'Sustainability Partners'],
      description: 'Carbon-neutral logistics platform reducing supply chain emissions by 40%.',
      website: 'https://ecologistics.com',
      status: 'Closed'
    },
    {
      id: '3',
      companyName: 'DevTools Pro',
      industry: 'Developer Tools',
      roundType: 'Pre-Seed',
      amount: '$800K',
      date: '2024-01-08',
      leadInvestor: 'Startup Accelerator',
      participants: ['Tech Angels', 'Developer Fund'],
      description: 'Next-generation development environment with AI-powered code assistance.',
      website: 'https://devtoolspro.com',
      status: 'Active'
    },
    {
      id: '4',
      companyName: 'FinanceBot',
      industry: 'FinTech',
      roundType: 'Seed',
      amount: '$3.2M',
      date: '2024-01-05',
      leadInvestor: 'FinTech Ventures',
      participants: ['Banking Partners', 'Crypto Fund', 'Payment Solutions'],
      description: 'AI-powered personal finance assistant with automated investment recommendations.',
      status: 'Rumored'
    },
    {
      id: '5',
      companyName: 'EduPlatform',
      industry: 'EdTech',
      roundType: 'Series B',
      amount: '$15M',
      date: '2024-01-03',
      leadInvestor: 'Education Capital',
      participants: ['Learning Ventures', 'Student Fund', 'Academic Partners'],
      description: 'Adaptive learning platform serving 200+ schools with personalized curricula.',
      website: 'https://eduplatform.com',
      status: 'Closed'
    }
  ];

  const filteredRounds = fundingRounds.filter(round => {
    const matchesSearch = round.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         round.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         round.leadInvestor.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRoundType = selectedRoundType === 'all' || round.roundType === selectedRoundType;
    const matchesStatus = selectedStatus === 'all' || round.status === selectedStatus;
    
    return matchesSearch && matchesRoundType && matchesStatus;
  });

  const roundTypes = ['all', 'Pre-Seed', 'Seed', 'Series A', 'Series B', 'Series C+'];
  const statuses = ['all', 'Active', 'Closed', 'Rumored'];

  const getRoundTypeColor = (roundType: string) => {
    switch (roundType) {
      case 'Pre-Seed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Seed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Series A': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Series B': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Series C+': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Closed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'Rumored': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Recent Funding Rounds</h2>
          <p className="text-gray-400">Track the latest startup funding activity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Target className="h-4 w-4 mr-2" />
            Submit Your Round
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search companies, industries, or investors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white"
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Round Type</label>
            <div className="flex gap-2 flex-wrap">
              {roundTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedRoundType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRoundType(type)}
                  className={selectedRoundType === type ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {type === 'all' ? 'All Rounds' : type}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Status</label>
            <div className="flex gap-2 flex-wrap">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {status === 'all' ? 'All Status' : status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredRounds.length} of {fundingRounds.length} funding rounds
      </div>

      {/* Funding Rounds List */}
      <div className="space-y-4">
        {filteredRounds.map((round) => (
          <Card key={round.id} className="workspace-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={round.companyLogo} />
                  <AvatarFallback className="bg-green-600 text-white">
                    {round.companyName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{round.companyName}</h3>
                        <Badge className={getRoundTypeColor(round.roundType)}>
                          {round.roundType}
                        </Badge>
                        <Badge className={getStatusColor(round.status)}>
                          {round.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Building2 className="h-4 w-4" />
                          <span>{round.industry}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(round.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-2xl font-bold text-green-400 mb-1">
                        <DollarSign className="h-5 w-5" />
                        {round.amount}
                      </div>
                      {round.website && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={round.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm">{round.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-white">Lead Investor:</span>
                      <span className="text-sm text-gray-300">{round.leadInvestor}</span>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Users className="h-4 w-4 text-purple-400 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-white">Participants:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {round.participants.map((participant, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                      Contact Investors
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      {filteredRounds.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            Load More Rounds
          </Button>
        </div>
      )}
    </div>
  );
};

export default FundingRoundsList;
