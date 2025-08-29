import { supabase } from '@/lib/supabase';

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

class TaskService {
  private tasks: Task[] = [];
  private stats: TaskStats = {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0
  };

  constructor() {
    this.loadFromSupabase();
  }

  private async loadFromSupabase() {
    try {
      // Mock implementation since supabase.auth is not available
      const mockUser = { id: 'mock-user-id' };
      if (!mockUser) {
        this.tasks = [];
        return;
      }

      // Mock data for demonstration
      this.tasks = [
        {
          id: '1',
          title: 'Design user interface mockups',
          description: 'Create wireframes and high-fidelity mockups for the main dashboard',
          status: 'in-progress',
          priority: 'high',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: mockUser.id,
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
          user_id: mockUser.id,
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
          user_id: mockUser.id,
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
          user_id: mockUser.id,
          tags: ['DevOps', 'Automation'],
          estimated_hours: 6
        }
      ];

      this.updateStats();
    } catch (error) {
      console.error('Error loading tasks:', error);
      this.tasks = [];
    }
  }

  private updateStats() {
    const now = new Date();
    this.stats = {
      total: this.tasks.length,
      completed: this.tasks.filter(t => t.status === 'completed').length,
      inProgress: this.tasks.filter(t => t.status === 'in-progress').length,
      overdue: this.tasks.filter(t => 
        t.due_date && 
        new Date(t.due_date) < now && 
        t.status !== 'completed' && 
        t.status !== 'cancelled'
      ).length
    };
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  getStats(): TaskStats {
    return this.stats;
  }

  getRecentTasks(limit: number = 5): Task[] {
    return this.tasks
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, limit);
  }

  getPriorityColor(priority: Task['priority']): string {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority];
  }

  formatDueDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays < 0) return `${Math.abs(diffInDays)} days overdue`;
    if (diffInDays === 0) return 'Due today';
    if (diffInDays === 1) return 'Due tomorrow';
    return `Due in ${diffInDays} days`;
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  }

  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: 'mock-user-id'
    };

    this.tasks.unshift(newTask);
    this.updateStats();
    return newTask;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.updateStats();
    return this.tasks[taskIndex];
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return false;

    this.tasks.splice(taskIndex, 1);
    this.updateStats();
    return true;
  }
}

export const taskService = new TaskService();