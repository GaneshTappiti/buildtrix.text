'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Filter,
  Search
} from 'lucide-react';

interface ProjectPhase {
  id: string;
  name: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  progress: number;
  tasks: number;
  completedTasks: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

const mockProjectPhases: ProjectPhase[] = [
  {
    id: '1',
    name: 'Market Research',
    description: 'Analyze target market, competitors, and user needs',
    status: 'completed',
    progress: 100,
    tasks: 8,
    completedTasks: 8,
    dueDate: '2024-01-15',
    priority: 'high'
  },
  {
    id: '2',
    name: 'MVP Development',
    description: 'Build minimum viable product with core features',
    status: 'in-progress',
    progress: 65,
    tasks: 12,
    completedTasks: 8,
    dueDate: '2024-02-28',
    priority: 'high'
  },
  {
    id: '3',
    name: 'User Testing',
    description: 'Conduct user interviews and usability testing',
    status: 'not-started',
    progress: 0,
    tasks: 6,
    completedTasks: 0,
    dueDate: '2024-03-15',
    priority: 'medium'
  },
  {
    id: '4',
    name: 'Marketing Strategy',
    description: 'Develop go-to-market strategy and marketing materials',
    status: 'not-started',
    progress: 0,
    tasks: 10,
    completedTasks: 0,
    dueDate: '2024-04-01',
    priority: 'medium'
  }
];

export default function BlueprintZonePage() {
  const [phases, setPhases] = useState<ProjectPhase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    const fetchProjectPhases = async () => {
      try {
        // Mock user for demonstration
        const mockUser = { id: 'mock-user-id' };
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPhases(mockProjectPhases);
      } catch (error) {
        console.error('Error fetching project phases:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectPhases();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'not-started':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'blocked':
        return <AlertCircle className="w-4 h-4" />;
      case 'not-started':
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const filteredPhases = selectedStatus === 'all' 
    ? phases 
    : phases.filter(phase => phase.status === selectedStatus);

  const overallProgress = phases.length > 0 
    ? Math.round(phases.reduce((sum, phase) => sum + phase.progress, 0) / phases.length)
    : 0;

  const completedPhases = phases.filter(phase => phase.status === 'completed').length;
  const inProgressPhases = phases.filter(phase => phase.status === 'in-progress').length;

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
          <Rocket className="w-8 h-8 text-blue-600" />
          Blueprint Zone
        </h1>
        <p className="text-gray-600 mb-6">
          Track your project phases and milestones in your startup journey.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold text-blue-600">{overallProgress}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Phases</p>
                <p className="text-2xl font-bold text-gray-900">{phases.length}</p>
              </div>
              <Target className="w-8 h-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedPhases}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressPhases}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
          <TabsList>
            <TabsTrigger value="all">All Phases</TabsTrigger>
            <TabsTrigger value="not-started">Not Started</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="blocked">Blocked</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Project Phases */}
      <div className="grid gap-6">
        {filteredPhases.map((phase) => (
          <Card key={phase.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(phase.status)}
                    <CardTitle className="text-xl">{phase.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {phase.description}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(phase.status)}>
                    {phase.status.replace('-', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(phase.priority)}>
                    {phase.priority} priority
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-gray-600">{phase.progress}%</span>
                  </div>
                  <Progress value={phase.progress} />
                </div>

                {/* Tasks and Due Date */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Tasks:</span>
                    <span className="ml-2">{phase.completedTasks}/{phase.tasks}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Due Date:</span>
                    <span className="ml-2">{new Date(phase.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Priority:</span>
                    <span className="ml-2 capitalize">{phase.priority}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Phase
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPhases.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No phases found</h3>
          <p className="text-gray-600 mb-4">
            {selectedStatus === 'all' 
              ? "You haven't created any project phases yet." 
              : `No phases with status "${selectedStatus.replace('-', ' ')}" found.`}
          </p>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New Phase
          </Button>
        </div>
      )}
    </div>
  );
}