import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, FileText, Lightbulb, Users, Target } from 'lucide-react';

interface Activity {
  id: string;
  type: 'idea' | 'project' | 'task' | 'collaboration';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

interface RecentActivityProps {
  activities?: Activity[];
}

const defaultActivities: Activity[] = [
  {
    id: '1',
    type: 'idea',
    title: 'New idea created',
    description: 'AI-Powered Fitness Coach',
    timestamp: '2 hours ago',
    status: 'draft'
  },
  {
    id: '2',
    type: 'project',
    title: 'Project updated',
    description: 'Smart Home Energy Manager - Blueprint completed',
    timestamp: '5 hours ago',
    status: 'in-progress'
  },
  {
    id: '3',
    type: 'task',
    title: 'Task completed',
    description: 'Market research for fitness app',
    timestamp: '1 day ago',
    status: 'completed'
  },
  {
    id: '4',
    type: 'collaboration',
    title: 'Team member added',
    description: 'John Doe joined the project',
    timestamp: '2 days ago'
  }
];

const RecentActivity: React.FC<RecentActivityProps> = ({ activities = defaultActivities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'idea':
        return <Lightbulb className="h-4 w-4 text-yellow-400" />;
      case 'project':
        return <Target className="h-4 w-4 text-blue-400" />;
      case 'task':
        return <FileText className="h-4 w-4 text-green-400" />;
      case 'collaboration':
        return <Users className="h-4 w-4 text-purple-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600/20 text-green-400';
      case 'in-progress':
        return 'bg-blue-600/20 text-blue-400';
      case 'draft':
        return 'bg-yellow-600/20 text-yellow-400';
      default:
        return 'bg-gray-600/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-black/20">
              <div className="mt-0.5">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-white truncate">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {activity.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
