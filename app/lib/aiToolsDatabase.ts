export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  pricing: {
    model: 'free' | 'freemium' | 'paid';
    inr: string;
    usd?: string;
  };
  popularity: number;
  bestFor: string[];
  officialUrl: string;
  apiCompatible: boolean;
  features: string[];
}

export interface AIToolCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const aiToolsCategories: AIToolCategory[] = [
  {
    id: 'ai-coding',
    name: 'AI Coding',
    icon: '💻',
    description: 'AI-powered coding assistants and IDEs'
  },
  {
    id: 'app-builders',
    name: 'App Builders',
    icon: '🏗️',
    description: 'No-code and low-code app development platforms'
  },
  {
    id: 'ui-design',
    name: 'UI Design',
    icon: '🎨',
    description: 'Design tools and UI/UX platforms'
  },
  {
    id: 'automation',
    name: 'Automation',
    icon: '⚡',
    description: 'Workflow automation and integration tools'
  },
  {
    id: 'ai-agents',
    name: 'AI Agents',
    icon: '🤖',
    description: 'AI agents and workflow builders'
  }
];

export const aiToolsDatabase: AITool[] = [
  // AI Coding Tools
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-powered code editor with intelligent completions, agents, and background processing',
    category: 'ai-coding',
    pricing: { model: 'freemium', inr: '₹0-1,600/mo', usd: '$0-20/mo' },
    popularity: 95,
    bestFor: ['Code Completion', 'AI Agents', 'Background Processing'],
    officialUrl: 'https://cursor.sh',
    apiCompatible: false,
    features: ['2,000 completions/month (free)', 'Bugbot agent', 'Max-mode', 'Free year for students']
  },
  {
    id: 'replit-ghostwriter',
    name: 'Replit Ghostwriter AI',
    description: 'AI coding assistant with full development environment and GPT-4o access',
    category: 'ai-coding',
    pricing: { model: 'freemium', inr: '₹0-1,500/mo', usd: '$0-20/mo' },
    popularity: 88,
    bestFor: ['Online IDE', 'AI Assistant', 'Deployment'],
    officialUrl: 'https://replit.com',
    apiCompatible: true,
    features: ['Full Ghostwriter capabilities', '10+ dev apps', 'OpenAI GPT-4o access', 'Unlimited hosting']
  },
  {
    id: 'continue-dev',
    name: 'Continue.dev',
    description: 'Open-source AI coding assistant for VS Code and JetBrains IDEs',
    category: 'ai-coding',
    pricing: { model: 'free', inr: 'Free' },
    popularity: 82,
    bestFor: ['VS Code Integration', 'JetBrains Support', 'Open Source'],
    officialUrl: 'https://continue.dev',
    apiCompatible: true,
    features: ['LLM pair programming', 'IDE integration', 'Open source', 'Custom models']
  },
  {
    id: 'sweep-dev',
    name: 'Sweep.dev',
    description: 'AI-powered GitHub issue resolution and automated PR creation',
    category: 'ai-coding',
    pricing: { model: 'freemium', inr: '₹0+' },
    popularity: 78,
    bestFor: ['GitHub Integration', 'Issue Resolution', 'Code Review'],
    officialUrl: 'https://sweep.dev',
    apiCompatible: true,
    features: ['GitHub agents', 'Automated PRs', 'Issue resolution', 'Code review automation']
  },

  // App Builders
  {
    id: 'lovable-dev',
    name: 'Lovable.dev',
    description: 'AI-powered full-stack app builder with GitHub sync and deployment',
    category: 'app-builders',
    pricing: { model: 'freemium', inr: '₹0-2,000/mo', usd: '$0-25/mo' },
    popularity: 90,
    bestFor: ['Full-stack Apps', 'GitHub Sync', 'Private Projects'],
    officialUrl: 'https://lovable.dev',
    apiCompatible: true,
    features: ['5 daily credits (free)', 'GitHub sync', 'Private projects (Pro)', 'Custom domains']
  },
  {
    id: 'adalo-ai',
    name: 'Adalo AI',
    description: 'No-code app builder with AI assistant for logic and flow generation',
    category: 'app-builders',
    pricing: { model: 'freemium', inr: '₹0+' },
    popularity: 85,
    bestFor: ['Mobile Apps', 'AI Logic', 'No-code'],
    officialUrl: 'https://adalo.com',
    apiCompatible: true,
    features: ['AI assistant', 'App logic generation', 'Mobile-first', 'Publishing capabilities']
  },
  {
    id: 'softr-ai',
    name: 'Softr AI',
    description: 'Prompt-based app generation with Airtable integration and custom domains',
    category: 'app-builders',
    pricing: { model: 'freemium', inr: '₹0-4,000/mo', usd: '$0-50/mo' },
    popularity: 83,
    bestFor: ['Client Portals', 'Dashboards', 'Airtable Integration'],
    officialUrl: 'https://softr.io',
    apiCompatible: true,
    features: ['Prompt-based generation', 'Airtable integration', 'Custom domains', 'Collaborators']
  },
  {
    id: 'buzzy-ai',
    name: 'Buzzy.ai',
    description: 'Convert Figma designs and prompts into full-stack applications',
    category: 'app-builders',
    pricing: { model: 'paid', inr: 'Contact for pricing' },
    popularity: 80,
    bestFor: ['Figma to App', 'Design Conversion', 'Full-stack'],
    officialUrl: 'https://buzzy.ai',
    apiCompatible: false,
    features: ['Figma integration', 'Full-stack generation', 'Deployment support', 'Private beta']
  },
  {
    id: 'cognosys-ai',
    name: 'Cognosys.ai',
    description: 'Natural language to full-stack app generator with backend and frontend',
    category: 'app-builders',
    pricing: { model: 'paid', inr: 'Contact for pricing' },
    popularity: 77,
    bestFor: ['Prompt to App', 'Backend Generation', 'Schema Creation'],
    officialUrl: 'https://cognosys.ai',
    apiCompatible: false,
    features: ['Natural language prompts', 'Backend + frontend', 'Database schema', 'One-go delivery']
  },

  // UI Design Tools
  {
    id: 'uizard',
    name: 'Uizard',
    description: 'AI design tool with text-to-design generation and developer export',
    category: 'ui-design',
    pricing: { model: 'freemium', inr: '₹0-3,000/mo', usd: '$0-39/mo' },
    popularity: 87,
    bestFor: ['AI Design Generation', 'React Export', 'Design Systems'],
    officialUrl: 'https://uizard.io',
    apiCompatible: false,
    features: ['3 AI generations/month (free)', 'React/CSS export', 'Design system features', 'Private projects']
  },
  {
    id: 'diagram-dev',
    name: 'Diagram.dev',
    description: 'Convert text prompts into architecture diagrams and system designs',
    category: 'ui-design',
    pricing: { model: 'freemium', inr: '₹0+' },
    popularity: 75,
    bestFor: ['Architecture Diagrams', 'System Design', 'Documentation'],
    officialUrl: 'https://diagram.dev',
    apiCompatible: true,
    features: ['Text to diagram', 'Architecture mapping', 'System design', 'Engineering documentation']
  },

  // Automation & AI Agents
  {
    id: 'stack-ai',
    name: 'Stack AI',
    description: 'AI-driven automation platform for backend workflows and integrations',
    category: 'automation',
    pricing: { model: 'freemium', inr: '₹0-15,000/mo', usd: '$0-199/mo' },
    popularity: 84,
    bestFor: ['AI Automation', 'Backend Workflows', 'Team Collaboration'],
    officialUrl: 'https://stack-ai.com',
    apiCompatible: true,
    features: ['500 runs/month (free)', 'Multiple projects', 'Email support', 'Multi-seat licenses']
  },
  {
    id: 'flowise-ai',
    name: 'Flowise AI',
    description: 'Visual LLM workflow builder with drag-and-drop interface',
    category: 'ai-agents',
    pricing: { model: 'freemium', inr: '₹0-5,000/mo', usd: '$0-65/mo' },
    popularity: 81,
    bestFor: ['Visual Workflows', 'LLM Orchestration', 'Chat Embedding'],
    officialUrl: 'https://flowiseai.com',
    apiCompatible: true,
    features: ['2 flows/assistants (free)', 'Unlimited flows (paid)', 'Multi-user workspaces', 'On-prem deployment']
  },
  {
    id: 'promptable-ai',
    name: 'Promptable.ai',
    description: 'Prompt workflow management and orchestration platform',
    category: 'ai-agents',
    pricing: { model: 'freemium', inr: '₹0+' },
    popularity: 72,
    bestFor: ['Prompt Management', 'Workflow Orchestration', 'Team Collaboration'],
    officialUrl: 'https://promptable.ai',
    apiCompatible: true,
    features: ['Prompt workflows', 'Team management', 'Version control', 'API integration']
  },
  {
    id: 'agentops-ai',
    name: 'AgentOps.ai',
    description: 'AI agent monitoring and orchestration platform',
    category: 'ai-agents',
    pricing: { model: 'freemium', inr: '₹0+' },
    popularity: 70,
    bestFor: ['Agent Monitoring', 'Orchestration', 'Analytics'],
    officialUrl: 'https://agentops.ai',
    apiCompatible: true,
    features: ['Agent monitoring', 'Performance analytics', 'Orchestration tools', 'Team dashboards']
  },

  // Open Source AI Tools
  {
    id: 'devika-ai',
    name: 'Devika.ai',
    description: 'Open-source AI software engineer for autonomous coding',
    category: 'ai-coding',
    pricing: { model: 'free', inr: 'Free' },
    popularity: 76,
    bestFor: ['Open Source', 'Autonomous Coding', 'Local Deployment'],
    officialUrl: 'https://github.com/stitionai/devika',
    apiCompatible: true,
    features: ['Open source', 'Autonomous coding', 'Local deployment', 'Community-driven']
  },
  {
    id: 'smol-developer',
    name: 'Smol Developer',
    description: 'Open-source AI developer for rapid prototyping and scaffolding',
    category: 'ai-coding',
    pricing: { model: 'free', inr: 'Free' },
    popularity: 74,
    bestFor: ['Rapid Prototyping', 'Project Scaffolding', 'MVP Development'],
    officialUrl: 'https://github.com/smol-ai/developer',
    apiCompatible: true,
    features: ['Project scaffolding', 'Rapid prototyping', 'Open source', 'CLI interface']
  },
  {
    id: 'gpt-engineer',
    name: 'GPT Engineer',
    description: 'Open-source tool for building entire codebases from prompts',
    category: 'ai-coding',
    pricing: { model: 'free', inr: 'Free' },
    popularity: 78,
    bestFor: ['Codebase Generation', 'Prompt-based Development', 'Open Source'],
    officialUrl: 'https://github.com/AntonOsika/gpt-engineer',
    apiCompatible: true,
    features: ['Codebase generation', 'Prompt-based', 'Open source', 'Community support']
  }
];
