import { useState, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description: string;
  stage: 'idea' | 'planning' | 'development' | 'testing' | 'launched';
  progress: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  team_members?: string[];
  budget?: number;
  deadline?: string;
}

export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  overdue: number;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<ProjectStats>({ total: 0, active: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    // Mock data for demonstration
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'AI Chatbot MVP',
        description: 'Building an AI-powered customer service chatbot',
        stage: 'development',
        progress: 65,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString(),
        user_id: 'mock-user-id',
        tags: ['AI', 'MVP', 'Customer Service'],
        priority: 'high',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        name: 'E-commerce Platform',
        description: 'Online marketplace for local businesses',
        stage: 'planning',
        progress: 25,
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        tags: ['E-commerce', 'Marketplace'],
        priority: 'medium'
      },
      {
        id: '3',
        name: 'Mobile Fitness App',
        description: 'Personal trainer app with workout tracking',
        stage: 'launched',
        progress: 100,
        created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        tags: ['Mobile', 'Fitness', 'Health'],
        priority: 'low'
      }
    ];

    setProjects(mockProjects);
    setStats({
      total: mockProjects.length,
      active: mockProjects.filter(p => p.stage !== 'launched').length,
      completed: mockProjects.filter(p => p.stage === 'launched').length,
      overdue: mockProjects.filter(p => 
        p.deadline && new Date(p.deadline) < new Date() && p.stage !== 'launched'
      ).length
    });
  }, []);

  const getRecentProjects = (limit: number = 5) => {
    return projects
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  };

  const getStageColor = (stage: Project['stage']) => {
    const colors = {
      idea: 'bg-purple-100 text-purple-800',
      planning: 'bg-blue-100 text-blue-800',
      development: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-orange-100 text-orange-800',
      launched: 'bg-green-100 text-green-800'
    };
    return colors[stage];
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  return {
    projects,
    stats,
    getRecentProjects,
    getStageColor,
    formatTimeAgo
  };
};