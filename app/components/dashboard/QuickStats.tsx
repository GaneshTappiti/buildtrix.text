import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

interface Stat {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
}

interface QuickStatsProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  {
    title: 'Active Projects',
    value: '3',
    change: '+2 this week',
    trend: 'up',
    icon: <Target className="h-4 w-4" />
  },
  {
    title: 'Ideas Generated',
    value: '12',
    change: '+5 this week',
    trend: 'up',
    icon: <Zap className="h-4 w-4" />
  },
  {
    title: 'Validation Score',
    value: '85%',
    change: '+12% this month',
    trend: 'up',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    title: 'Team Members',
    value: '4',
    change: '+1 this month',
    trend: 'up',
    icon: <Users className="h-4 w-4" />
  }
];

const QuickStats: React.FC<QuickStatsProps> = ({ stats = defaultStats }) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              {stat.title}
            </CardTitle>
            <div className="text-gray-400">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <p className={`text-xs ${getTrendColor(stat.trend)}`}>
              {stat.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuickStats;
