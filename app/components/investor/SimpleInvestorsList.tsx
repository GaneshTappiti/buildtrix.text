"use client"

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  MapPin,
  DollarSign,
  Users,
  Star,
  Building2,
  Mail,
  Linkedin,
  UserPlus,
  Search,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { Investor, InvestorStatus } from "@/types/investor";
import { useToast } from "@/hooks/use-toast";

interface SimpleInvestorsListProps {
  investors: Investor[];
  onLogContact: (id: string, contactDetails: any) => void;
  onStatusChange: (id: string, status: InvestorStatus) => void;
}

const SimpleInvestorsList: React.FC<SimpleInvestorsListProps> = ({
  investors,
  onLogContact,
  onStatusChange
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvestorStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'portfolioSize'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  // Filter and sort investors
  const filteredAndSortedInvestors = useMemo(() => {
    let filtered = investors.filter(investor => {
      const matchesSearch =
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.focusAreas.some(area => area.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (investor.location && investor.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || investor.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort investors
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [investors, searchTerm, statusFilter, sortBy, sortOrder]);

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

  const handleConnect = (investor: Investor, type: 'email' | 'linkedin') => {
    if (type === 'email' && investor.email) {
      const subject = encodeURIComponent('Investment Opportunity - Seeking Partnership');
      const body = encodeURIComponent(`Hi ${investor.name},

I hope this email finds you well. I came across your profile and was impressed by your investment focus in ${investor.focusAreas.join(', ')}.

I'm reaching out regarding a potential investment opportunity that aligns with your portfolio interests. I would love to schedule a brief call to discuss this further.

Looking forward to connecting with you.

Best regards`);

      window.open(`mailto:${investor.email}?subject=${subject}&body=${body}`);

      // Log the contact attempt
      onLogContact(investor.id, {
        type: 'email',
        date: new Date().toISOString(),
        notes: 'Email sent via investor radar'
      });

      // Show success toast
      toast({
        title: "Email Opened",
        description: `Email client opened to contact ${investor.name}`,
        variant: "default"
      });
    } else if (type === 'linkedin' && investor.linkedinUrl) {
      window.open(investor.linkedinUrl, '_blank');

      // Log the contact attempt
      onLogContact(investor.id, {
        type: 'linkedin',
        date: new Date().toISOString(),
        notes: 'LinkedIn profile visited'
      });

      // Show success toast
      toast({
        title: "LinkedIn Opened",
        description: `Opened ${investor.name}'s LinkedIn profile`,
        variant: "default"
      });
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Investor Directory</h2>
          <p className="text-gray-400">Browse and connect with {filteredAndSortedInvestors.length} of {investors.length} verified investors</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live Database</span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search investors by name, company, position, or focus areas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as InvestorStatus | 'all')}>
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

          <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
            const [field, order] = value.split('-');
            setSortBy(field as 'name' | 'rating' | 'portfolioSize');
            setSortOrder(order as 'asc' | 'desc');
          }}>
            <SelectTrigger className="w-[200px] bg-black/20 border-white/10 text-white">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="rating-desc">Rating (High to Low)</SelectItem>
              <SelectItem value="rating-asc">Rating (Low to High)</SelectItem>
              <SelectItem value="portfolioSize-desc">Portfolio (Large to Small)</SelectItem>
              <SelectItem value="portfolioSize-asc">Portfolio (Small to Large)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Investors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAndSortedInvestors.slice(0, 20).map((investor) => (
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
                
                <Badge className={`${getStatusColor(investor.status)} text-white text-xs`}>
                  {getStatusLabel(investor.status)}
                </Badge>
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
                    {investor.focusAreas.slice(0, 3).map((area, index) => (
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
              
              {/* Contact Information */}
              {investor.email && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{investor.email}</span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {investor.email && (
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleConnect(investor, 'email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                )}
                
                {investor.linkedinUrl && (
                  <Button 
                    size="sm" 
                    className="bg-blue-700 hover:bg-blue-800"
                    onClick={() => handleConnect(investor, 'linkedin')}
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Show more button if there are more investors */}
      {filteredAndSortedInvestors.length > 20 && (
        <div className="text-center">
          <p className="text-gray-400">Showing 20 of {filteredAndSortedInvestors.length} investors</p>
        </div>
      )}

      {/* No results message */}
      {filteredAndSortedInvestors.length === 0 && investors.length > 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No investors found</h3>
          <p className="text-gray-400 mb-4">Try adjusting your search or filter criteria.</p>
          <Button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-white"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SimpleInvestorsList;
