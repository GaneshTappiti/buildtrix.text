"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  TrendingUp, 
  MapPin, 
  Star,
  Building2,
  DollarSign,
  Activity
} from "lucide-react";
import { Investor } from "@/types/investor";
import { getInvestorStats } from "@/lib/investor-data";

interface InvestorDashboardProps {
  investors: Investor[];
}

const InvestorDashboard: React.FC<InvestorDashboardProps> = ({ investors }) => {
  const stats = getInvestorStats(investors);

  const getStatusColor = (status: string) => {
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

  const getStatusLabel = (status: string) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Investors */}
      <Card className="workspace-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Total Investors</CardTitle>
          <Users className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.totalInvestors}</div>
          <p className="text-xs text-gray-400">
            {stats.uniqueLocations} locations
          </p>
        </CardContent>
      </Card>

      {/* Average Rating */}
      <Card className="workspace-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Avg Rating</CardTitle>
          <Star className="h-4 w-4 text-yellow-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.avgRating}</div>
          <p className="text-xs text-gray-400">
            out of 5.0
          </p>
        </CardContent>
      </Card>

      {/* Average Portfolio Size */}
      <Card className="workspace-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Avg Portfolio</CardTitle>
          <Building2 className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.avgPortfolioSize}</div>
          <p className="text-xs text-gray-400">
            companies
          </p>
        </CardContent>
      </Card>

      {/* Focus Areas */}
      <Card className="workspace-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-400">Focus Areas</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{stats.uniqueFocusAreas}</div>
          <p className="text-xs text-gray-400">
            different sectors
          </p>
        </CardContent>
      </Card>

      {/* Status Breakdown */}
      <Card className="workspace-card md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            Investor Pipeline Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.statusCounts).map(([status, count]) => (
              <div key={status} className="flex items-center gap-2">
                <Badge className={`${getStatusColor(status)} text-white`}>
                  {getStatusLabel(status)}
                </Badge>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Pipeline Progress</span>
              <span>
                {Math.round(((stats.statusCounts['contacted'] || 0) + 
                           (stats.statusCounts['meeting-scheduled'] || 0) + 
                           (stats.statusCounts['in-discussion'] || 0) + 
                           (stats.statusCounts['invested'] || 0)) / stats.totalInvestors * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((stats.statusCounts['contacted'] || 0) + 
                           (stats.statusCounts['meeting-scheduled'] || 0) + 
                           (stats.statusCounts['in-discussion'] || 0) + 
                           (stats.statusCounts['invested'] || 0)) / stats.totalInvestors * 100}%`
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestorDashboard;
