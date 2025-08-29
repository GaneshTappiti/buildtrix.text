"use client"

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  TrendingUp, 
  FileText, 
  Target,
  BarChart3,
  Calendar
} from "lucide-react";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  className 
}) => {
  const tabs = [
    {
      id: 'investors',
      label: 'Investors',
      icon: Users,
      description: 'Browse investor directory'
    },
    {
      id: 'funding-rounds',
      label: 'Funding Rounds',
      icon: TrendingUp,
      description: 'Recent funding activity'
    },
    {
      id: 'pitch-decks',
      label: 'Pitch Decks',
      icon: FileText,
      description: 'Manage your pitch materials'
    },
    {
      id: 'targets',
      label: 'Target List',
      icon: Target,
      description: 'Your investor targets'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Track your progress'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      description: 'Upcoming meetings'
    }
  ];

  return (
    <div className={className}>
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-black/20 border border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default TabNavigation;
