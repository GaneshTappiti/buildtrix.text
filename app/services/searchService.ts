// Search Service for Workspace
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'module' | 'project' | 'task' | 'idea' | 'document' | 'action';
  path: string;
  icon?: string;
  metadata?: any;
}

export interface SearchOptions {
  types?: string[];
  limit?: number;
  includeContent?: boolean;
}

class SearchService {
  private searchableModules = [
    {
      id: "workshop",
      title: "Workshop",
      description: "Free playground for idea validation with AI",
      type: "module" as const,
      path: "/workspace/workshop",
      icon: "🧠",
      keywords: ["workshop", "idea", "validation", "ai", "playground", "free"]
    },
    {
      id: "idea-vault",
      title: "Idea Vault",
      description: "Store and manage your startup ideas",
      type: "module" as const,
      path: "/workspace/idea-vault",
      icon: "💡",
      keywords: ["idea", "vault", "store", "manage", "startup", "ideas"]
    },
    {
      id: "ideaforge",
      title: "IdeaForge",
      description: "Turn ideas into actionable product frameworks",
      type: "module" as const,
      path: "/workspace/ideaforge",
      icon: "⚙️",
      keywords: ["ideaforge", "ideas", "product", "framework", "actionable"]
    },
    {
      id: "business-model-canvas",
      title: "AI Business Model Canvas",
      description: "Generate professional Business Model Canvas with AI",
      type: "module" as const,
      path: "/workspace/business-model-canvas",
      icon: "🎯",
      keywords: ["business", "model", "canvas", "ai", "generate", "professional", "framework"]
    },
    {
      id: "mvp-studio",
      title: "MVP Studio",
      description: "Your AI-powered build orchestrator",
      type: "module" as const,
      path: "/workspace/mvp-studio",
      icon: "🚀",
      keywords: ["mvp", "studio", "build", "orchestrator", "ai", "powered"]
    },
    {
      id: "docs-decks",
      title: "Docs & Decks",
      description: "Create and manage your startup documents",
      type: "module" as const,
      path: "/workspace/docs-decks",
      icon: "📄",
      keywords: ["docs", "decks", "documents", "create", "manage", "startup"]
    },
    {
      id: "task-planner",
      title: "Task Planner",
      description: "Plan and track your startup tasks",
      type: "module" as const,
      path: "/workspace/task-planner",
      icon: "📅",
      keywords: ["task", "planner", "plan", "track", "startup", "tasks"]
    },
    {
      id: "teamspace",
      title: "TeamSpace",
      description: "Collaborate with your team",
      type: "module" as const,
      path: "/workspace/teamspace",
      icon: "👥",
      keywords: ["team", "space", "collaborate", "teamwork"]
    },
    {
      id: "ai-tools",
      title: "AI Tools Hub",
      description: "Access various AI tools and features",
      type: "module" as const,
      path: "/workspace/ai-tools",
      icon: "🤖",
      keywords: ["ai", "tools", "hub", "features", "artificial", "intelligence"]
    },
    {
      id: "investor-radar",
      title: "Investor Radar",
      description: "Find and connect with investors",
      type: "module" as const,
      path: "/workspace/investor-radar",
      icon: "🎯",
      keywords: ["investor", "radar", "find", "connect", "funding", "investment"]
    }
  ];

  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const { types = [], limit = 10, includeContent = false } = options;
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    let results: SearchResult[] = [];

    // Search modules
    if (types.length === 0 || types.includes('module')) {
      const moduleResults = this.searchableModules
        .map(module => {
          const score = this.calculateRelevanceScore(searchTerms, module);
          return { ...module, score };
        })
        .filter(module => module.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ score, keywords, ...module }) => module);

      results.push(...moduleResults);
    }

    // TODO: Add search for projects, tasks, ideas, documents when data is available
    // This would integrate with the actual data storage system

    return results.slice(0, limit);
  }

  private calculateRelevanceScore(searchTerms: string[], item: any): number {
    let score = 0;
    const searchableText = [
      item.title,
      item.description,
      ...(item.keywords || [])
    ].join(' ').toLowerCase();

    searchTerms.forEach(term => {
      if (item.title.toLowerCase().includes(term)) {
        score += 10; // Title matches are most important
      } else if (item.description.toLowerCase().includes(term)) {
        score += 5; // Description matches
      } else if (item.keywords?.some((keyword: string) => keyword.includes(term))) {
        score += 3; // Keyword matches
      } else if (searchableText.includes(term)) {
        score += 1; // General content matches
      }
    });

    return score;
  }

  async getQuickActions(query: string): Promise<SearchResult[]> {
    const quickActions = [
      {
        id: "create-idea",
        title: "Create New Idea",
        description: "Start a new startup idea",
        type: "action" as const,
        path: "/workspace/idea-vault",
        icon: "💡"
      },
      {
        id: "validate-idea",
        title: "Validate Idea",
        description: "Use AI to validate your startup concept",
        type: "action" as const,
        path: "/workspace/workshop",
        icon: "🧠"
      },
      {
        id: "create-bmc",
        title: "Create Business Model Canvas",
        description: "Generate a business model canvas with AI",
        type: "action" as const,
        path: "/workspace/business-model-canvas",
        icon: "🎯"
      },
      {
        id: "plan-mvp",
        title: "Plan MVP",
        description: "Start planning your minimum viable product",
        type: "action" as const,
        path: "/workspace/mvp-studio",
        icon: "🚀"
      }
    ];

    if (!query.trim()) return quickActions.slice(0, 3);

    return quickActions.filter(action =>
      action.title.toLowerCase().includes(query.toLowerCase()) ||
      action.description.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const searchService = new SearchService();
