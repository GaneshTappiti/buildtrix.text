// Mock Supabase helpers for development
// In a real application, this would connect to actual Supabase

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  project_id?: string;
  created_at: string;
  updated_at: string;
}

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

// Mock data
let mockProjects: Project[] = [
  {
    id: "1",
    title: "AI Fitness Coach",
    description: "Personalized fitness coaching app with AI",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let mockTasks: Task[] = [
  {
    id: "1",
    title: "Design user interface",
    description: "Create wireframes and mockups",
    status: "in-progress",
    priority: "high",
    project_id: "1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let mockIdeas: Idea[] = [];

export const supabaseHelpers = {
  // Projects
  async getProjects() {
    return { data: mockProjects, error: null };
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockProjects.unshift(newProject);
    return { data: newProject, error: null };
  },

  // Tasks
  async getTasks() {
    return { data: mockTasks, error: null };
  },

  async createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockTasks.unshift(newTask);
    return { data: newTask, error: null };
  },

  // Ideas
  async getIdeas() {
    return { data: mockIdeas, error: null };
  },

  async createIdea(idea: Omit<Idea, 'id' | 'created_at' | 'updated_at'>) {
    const newIdea: Idea = {
      ...idea,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    mockIdeas.unshift(newIdea);
    return { data: newIdea, error: null };
  },

  // Real-time subscriptions (mock)
  subscribeToProjects(callback: (payload: any) => void) {
    // Mock subscription - in real app this would be Supabase real-time
    return {
      unsubscribe: () => console.log('Unsubscribed from projects')
    };
  },

  subscribeToTasks(callback: (payload: any) => void) {
    // Mock subscription - in real app this would be Supabase real-time
    return {
      unsubscribe: () => console.log('Unsubscribed from tasks')
    };
  }
};

// Mock Supabase client for services that need it
export const supabase = {
  from: (table: string) => ({
    upsert: async (data: any, options?: any) => ({ error: null }),
    insert: async (data: any) => ({ error: null }),
    select: async () => ({ data: [], error: null }),
    update: async (data: any) => ({ error: null }),
    delete: async () => ({ error: null })
  })
};
