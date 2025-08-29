import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  project_id?: string;
  assignee?: string;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({ total: 0, completed: 0, inProgress: 0, overdue: 0 });

  useEffect(() => {
    // Mock data for demonstration
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Design user interface mockups',
        description: 'Create wireframes and high-fidelity mockups for the main dashboard',
        status: 'in-progress',
        priority: 'high',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        project_id: '1',
        tags: ['Design', 'UI/UX'],
        estimated_hours: 8,
        actual_hours: 5
      },
      {
        id: '2',
        title: 'Implement authentication system',
        description: 'Set up user registration, login, and password reset functionality',
        status: 'todo',
        priority: 'urgent',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        project_id: '1',
        tags: ['Backend', 'Security'],
        estimated_hours: 12
      },
      {
        id: '3',
        title: 'Write API documentation',
        description: 'Document all REST API endpoints with examples',
        status: 'completed',
        priority: 'medium',
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        project_id: '2',
        tags: ['Documentation', 'API'],
        estimated_hours: 4,
        actual_hours: 6
      },
      {
        id: '4',
        title: 'Set up CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'todo',
        priority: 'low',
        due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Overdue
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'mock-user-id',
        tags: ['DevOps', 'Automation'],
        estimated_hours: 6
      }
    ];

    const now = new Date();
    setTasks(mockTasks);
    setStats({
      total: mockTasks.length,
      completed: mockTasks.filter(t => t.status === 'completed').length,
      inProgress: mockTasks.filter(t => t.status === 'in-progress').length,
      overdue: mockTasks.filter(t => 
        t.due_date && 
        new Date(t.due_date) < now && 
        t.status !== 'completed' && 
        t.status !== 'cancelled'
      ).length
    });
  }, []);

  const getRecentTasks = (limit: number = 5) => {
    return tasks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  };

  const getPriorityColor = (priority: Task['priority']) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  };

  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`;
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
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
    tasks,
    stats,
    getRecentTasks,
    getPriorityColor,
    formatDueDate,
    formatTimeAgo
  };
};