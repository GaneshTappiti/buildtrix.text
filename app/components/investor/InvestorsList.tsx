"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  ExternalLink,
  Star,
  Building2,
  Globe,
  Mail,
  Phone,
  Calendar,
  ArrowUpDown,
  SortAsc,
  SortDesc,
  Linkedin,
  MessageCircle,
  UserPlus
} from "lucide-react";
import { Investor, SortOption, InvestorStatus } from "@/types/investor";

interface InvestorsListProps {
  investors: Investor[];
  onLogContact: (id: string, contactDetails: any) => void;
  onStatusChange: (id: string, status: InvestorStatus) => void;
}

const InvestorsList: React.FC<InvestorsListProps> = ({
  investors,
  onLogContact,
  onStatusChange
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<InvestorStatus | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>({
    field: 'name',
    direction: 'asc',
    label: 'Name (A-Z)'
  });

  const sortOptions: SortOption[] = [
    { field: 'name', direction: 'asc', label: 'Name (A-Z)' },
    { field: 'name', direction: 'desc', label: 'Name (Z-A)' },
    { field: 'rating', direction: 'desc', label: 'Rating (High to Low)' },
    { field: 'rating', direction: 'asc', label: 'Rating (Low to High)' },
    { field: 'portfolioSize', direction: 'desc', label: 'Portfolio Size (Large to Small)' },
    { field: 'portfolioSize', direction: 'asc', label: 'Portfolio Size (Small to Large)' },
    { field: 'company', direction: 'asc', label: 'Company (A-Z)' },
    { field: 'location', direction: 'asc', label: 'Location (A-Z)' }
  ];
  // Filter and sort investors
  const filteredAndSortedInvestors = useMemo(() => {
    let filtered = investors.filter(investor => {
      const matchesSearch =
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.focusAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (investor.location && investor.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = selectedFilter === 'all' || investor.status === selectedFilter;

      return matchesSearch && matchesFilter;
    });

    // Sort investors
    filtered.sort((a, b) => {
      const aValue = a[sortOption.field];
      const bValue = b[sortOption.field];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOption.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOption.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [investors, searchTerm, selectedFilter, sortOption]);

  const getStatusColor = (status: InvestorStatus) => {
    switch (status) {
      case 'to-contact': return 'bg-gray-500';
      case 'contacted': return 'bg-blue-500';
      case 'meeting-scheduled': return 'bg-yellow-500';
      case 'in-discussion': return 'bg-orange-500';
      case 'passed': return 'bg-red-500';
      case 'invested': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: InvestorStatus) => {
    switch (status) {
      case 'to-contact': return 'To Contact';
      case 'contacted': return 'Contacted';
      case 'meeting-scheduled': return 'Meeting Scheduled';
      case 'in-discussion': return 'In Discussion';
      case 'passed': return 'Passed';
      case 'invested': return 'Invested';
      default: return status;
    }
  };

  const handleConnect = (investor: Investor, type: 'email' | 'linkedin' | 'call') => {
    if (type === 'email' && investor.email) {
      window.open(`mailto:${investor.email}?subject=Investment Opportunity&body=Hi ${investor.name},%0D%0A%0D%0AI hope this email finds you well.`);
    } else if (type === 'linkedin' && investor.linkedinUrl) {
      window.open(investor.linkedinUrl, '_blank');
    } else if (type === 'call') {
      // In a real app, this might integrate with a calling service
      onLogContact(investor.id, { type: 'call', date: new Date().toISOString(), notes: 'Call initiated' });
    }
  };

  if (investors.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">Loading Investors...</h3>
        <p className="text-gray-400 mb-4">Please wait while we load the investor database.</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Investor Directory</h2>
            <p className="text-gray-400">Browse and connect with {filteredAndSortedInvestors.length} verified investors</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-green-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Live Database</span>
          </div>
        </div>

        {/* Search, Filter, and Sort Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search investors by name, company, position, or focus areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as InvestorStatus | 'all')}>
              <SelectTrigger className="w-[180px] bg-black/20 border-white/10 text-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="to-contact">To Contact</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="meeting-scheduled">Meeting Scheduled</SelectItem>
                <SelectItem value="in-discussion">In Discussion</SelectItem>
                <SelectItem value="passed">Passed</SelectItem>
                <SelectItem value="invested">Invested</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={`${sortOption.field}-${sortOption.direction}`}
              onValueChange={(value) => {
                const option = sortOptions.find(opt => `${opt.field}-${opt.direction}` === value);
                if (option) setSortOption(option);
              }}
            >
              <SelectTrigger className="w-[200px] bg-black/20 border-white/10 text-white">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={`${option.field}-${option.direction}`} value={`${option.field}-${option.direction}`}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-400">
          Showing {filteredAndSortedInvestors.length} of {investors.length} investors
        </div>

        {/* Investors Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedInvestors.map((investor) => (
            <Card key={investor.id} className="workspace-card hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={investor.avatar} />
                    <AvatarFallback className="bg-green-600 text-white">
                      {investor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-white text-lg">{investor.name}</CardTitle>
                      {investor.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-300">{investor.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <Building2 className="h-4 w-4" />
                      <span>{investor.company}</span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <span className="font-medium">{investor.position}</span>
                    </div>

                    {investor.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span>{investor.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <Badge className={`${getStatusColor(investor.status)} text-white text-xs`}>
                      {getStatusLabel(investor.status)}
                    </Badge>
                    {investor.website && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="sm" asChild>
                            <a href={investor.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="h-4 w-4" />
                            </a>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Visit website</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {investor.description && (
                  <p className="text-gray-300 text-sm">{investor.description}</p>
                )}

                {/* Focus Areas */}
                {investor.focusAreas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Focus Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {investor.focusAreas.map((area, index) => (
                        <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Investment Info */}
                <div className="grid grid-cols-2 gap-4">
                  {investor.investmentRange && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <div>
                        <p className="text-xs text-gray-400">Investment Range</p>
                        <p className="text-sm font-medium text-white">{investor.investmentRange}</p>
                      </div>
                    </div>
                  )}

                  {investor.portfolioSize && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-xs text-gray-400">Portfolio Size</p>
                        <p className="text-sm font-medium text-white">{investor.portfolioSize} companies</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Investments */}
                {investor.recentInvestments && investor.recentInvestments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Recent Investments</h4>
                    <div className="flex flex-wrap gap-2">
                      {investor.recentInvestments.slice(0, 3).map((investment, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {investment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                {investor.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{investor.email}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <div className="flex gap-1 flex-1">
                    {investor.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleConnect(investor, 'email')}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Send Email</TooltipContent>
                      </Tooltip>
                    )}

                    {investor.linkedinUrl && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-700 hover:bg-blue-800"
                            onClick={() => handleConnect(investor, 'linkedin')}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Connect on LinkedIn</TooltipContent>
                      </Tooltip>
                    )}

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleConnect(investor, 'call')}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Schedule Call</TooltipContent>
                    </Tooltip>
                  </div>

                  <Select value={investor.status} onValueChange={(value) => onStatusChange(investor.id, value as InvestorStatus)}>
                    <SelectTrigger className="w-[140px] bg-black/20 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to-contact">To Contact</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="meeting-scheduled">Meeting Scheduled</SelectItem>
                      <SelectItem value="in-discussion">In Discussion</SelectItem>
                      <SelectItem value="passed">Passed</SelectItem>
                      <SelectItem value="invested">Invested</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {filteredAndSortedInvestors.length > 0 && filteredAndSortedInvestors.length < investors.length && (
          <div className="text-center">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Load More Investors
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default InvestorsList;
