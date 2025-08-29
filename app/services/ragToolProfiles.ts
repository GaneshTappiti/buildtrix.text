import { RAGTool, RAGToolProfile, AppType, Platform } from '@/types/ideaforge';

/**
 * RAG Tool Profiles Service
 * Defines all supported RAG tools with their characteristics and capabilities
 * Based on the RAG repository: https://github.com/GaneshTappiti/RAG
 */

export const RAG_TOOL_PROFILES: Record<RAGTool, RAGToolProfile> = {
  lovable: {
    id: 'lovable',
    name: 'Lovable.dev',
    description: 'React/TypeScript development with C.L.E.A.R. framework and Supabase integration',
    category: 'ai-coding',
    icon: '💖',
    bestFor: [
      'React applications',
      'TypeScript projects',
      'Supabase integration',
      'Component optimization',
      'Responsive design'
    ],
    platforms: ['web'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://lovable.dev'
  },
  
  bolt: {
    id: 'bolt',
    name: 'Bolt.new',
    description: 'Enhancement-driven development with WebContainer and rapid prototyping',
    category: 'ai-coding',
    icon: '⚡',
    bestFor: [
      'Rapid prototyping',
      'Web applications',
      'JavaScript projects',
      'Iterative development',
      'Code refinement'
    ],
    platforms: ['web'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://bolt.new'
  },

  cursor: {
    id: 'cursor',
    name: 'Cursor',
    description: 'Schema-driven development with parallel processing and AI assistance',
    category: 'ai-coding',
    icon: '🎯',
    bestFor: [
      'Code editing',
      'AI-assisted development',
      'Schema-driven projects',
      'Parallel processing',
      'Professional development'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool', 'ai-app'],
    complexity: 'advanced',
    pricing: 'freemium',
    url: 'https://cursor.sh'
  },

  v0: {
    id: 'v0',
    name: 'v0 by Vercel',
    description: 'Production-ready React components with modern design patterns',
    category: 'ai-coding',
    icon: '🚀',
    bestFor: [
      'React components',
      'Production-ready code',
      'Modern design patterns',
      'Component libraries',
      'UI development'
    ],
    platforms: ['web'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://v0.dev'
  },

  cline: {
    id: 'cline',
    name: 'Cline',
    description: 'Step-by-step iterative development with detailed guidance',
    category: 'ai-coding',
    icon: '📝',
    bestFor: [
      'Step-by-step development',
      'Iterative processes',
      'Detailed guidance',
      'Learning projects',
      'Structured development'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'beginner',
    pricing: 'free',
    url: 'https://github.com/clinebot/cline'
  },

  windsurf: {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'Explanatory development with async handling and comprehensive documentation',
    category: 'ai-coding',
    icon: '🌊',
    bestFor: [
      'Explanatory development',
      'Async handling',
      'Documentation',
      'Complex workflows',
      'Educational projects'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool', 'ai-app'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://windsurf.ai'
  },

  devin: {
    id: 'devin',
    name: 'Devin AI',
    description: 'Autonomous planning with security focus and comprehensive project management',
    category: 'ai-coding',
    icon: '🤖',
    bestFor: [
      'Autonomous development',
      'Security-focused projects',
      'Project planning',
      'Complex applications',
      'Enterprise solutions'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool', 'ai-app'],
    complexity: 'advanced',
    pricing: 'paid',
    url: 'https://devin.ai'
  },

  // No-Code/Low-Code Tools
  bubble: {
    id: 'bubble',
    name: 'Bubble',
    description: 'Visual programming platform for web applications without code',
    category: 'no-code',
    icon: '🫧',
    bestFor: [
      'Visual development',
      'No-code solutions',
      'Web applications',
      'Database integration',
      'Workflow automation'
    ],
    platforms: ['web'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'beginner',
    pricing: 'freemium',
    url: 'https://bubble.io'
  },

  flutterflow: {
    id: 'flutterflow',
    name: 'FlutterFlow',
    description: 'Visual Flutter development for cross-platform mobile and web apps',
    category: 'low-code',
    icon: '🦋',
    bestFor: [
      'Flutter development',
      'Cross-platform apps',
      'Mobile applications',
      'Visual development',
      'Firebase integration'
    ],
    platforms: ['web', 'android', 'ios', 'cross-platform'],
    appTypes: ['mobile-app', 'web-app'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://flutterflow.io'
  },

  framer: {
    id: 'framer',
    name: 'Framer',
    description: 'Design and development platform with advanced animations and interactions',
    category: 'design',
    icon: '🎨',
    bestFor: [
      'Design systems',
      'Animations',
      'Interactive prototypes',
      'Landing pages',
      'Marketing sites'
    ],
    platforms: ['web'],
    appTypes: ['web-app'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://framer.com'
  },

  adalo: {
    id: 'adalo',
    name: 'Adalo',
    description: 'No-code mobile and web app builder with native functionality',
    category: 'no-code',
    icon: '📱',
    bestFor: [
      'Mobile apps',
      'No-code development',
      'Native functionality',
      'Database integration',
      'User authentication'
    ],
    platforms: ['android', 'ios', 'web'],
    appTypes: ['mobile-app', 'web-app'],
    complexity: 'beginner',
    pricing: 'freemium',
    url: 'https://adalo.com'
  },

  uizard: {
    id: 'uizard',
    name: 'Uizard',
    description: 'AI-powered design tool that converts sketches to digital designs',
    category: 'design',
    icon: '✨',
    bestFor: [
      'Design conversion',
      'Sketch to digital',
      'Rapid prototyping',
      'UI design',
      'Design automation'
    ],
    platforms: ['web', 'android', 'ios'],
    appTypes: ['mobile-app', 'web-app'],
    complexity: 'beginner',
    pricing: 'freemium',
    url: 'https://uizard.io'
  },

  // Additional tools
  roocode: {
    id: 'roocode',
    name: 'RooCode',
    description: 'AI-powered development platform for rapid application building',
    category: 'ai-coding',
    icon: '🦘',
    bestFor: [
      'Rapid development',
      'AI assistance',
      'Application building',
      'Code generation',
      'Development automation'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://roocode.com'
  },

  manus: {
    id: 'manus',
    name: 'Manus',
    description: 'Manual-first development approach with detailed documentation',
    category: 'ai-coding',
    icon: '📖',
    bestFor: [
      'Documentation-driven development',
      'Manual processes',
      'Detailed guidance',
      'Educational content',
      'Process documentation'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'beginner',
    pricing: 'free',
    url: 'https://manus.dev'
  },

  same_dev: {
    id: 'same_dev',
    name: 'Same.dev',
    description: 'Collaborative development platform with shared environments',
    category: 'ai-coding',
    icon: '🤝',
    bestFor: [
      'Collaborative development',
      'Shared environments',
      'Team projects',
      'Code sharing',
      'Development collaboration'
    ],
    platforms: ['web', 'cross-platform'],
    appTypes: ['web-app', 'saas-tool'],
    complexity: 'intermediate',
    pricing: 'freemium',
    url: 'https://same.dev'
  }
};

/**
 * Get RAG tool profile by ID
 */
export function getRAGToolProfile(toolId: RAGTool): RAGToolProfile {
  return RAG_TOOL_PROFILES[toolId];
}

/**
 * Get all RAG tool profiles
 */
export function getAllRAGToolProfiles(): RAGToolProfile[] {
  return Object.values(RAG_TOOL_PROFILES);
}

/**
 * Filter RAG tools by criteria
 */
export function filterRAGTools(criteria: {
  category?: RAGToolProfile['category'];
  platform?: Platform;
  appType?: AppType;
  complexity?: RAGToolProfile['complexity'];
  pricing?: RAGToolProfile['pricing'];
}): RAGToolProfile[] {
  return getAllRAGToolProfiles().filter(tool => {
    if (criteria.category && tool.category !== criteria.category) return false;
    if (criteria.platform && !tool.platforms.includes(criteria.platform)) return false;
    if (criteria.appType && !tool.appTypes.includes(criteria.appType)) return false;
    if (criteria.complexity && tool.complexity !== criteria.complexity) return false;
    if (criteria.pricing && tool.pricing !== criteria.pricing) return false;
    return true;
  });
}

/**
 * Get recommended tools for specific app requirements
 */
export function getRecommendedTools(
  appType: AppType,
  platforms: Platform[],
  complexity: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
): RAGToolProfile[] {
  const tools = filterRAGTools({ appType, complexity });
  
  // Filter by platforms and score by relevance
  return tools
    .filter(tool => platforms.some(platform => tool.platforms.includes(platform)))
    .sort((a, b) => {
      // Prioritize tools that support more of the requested platforms
      const aScore = platforms.filter(p => a.platforms.includes(p)).length;
      const bScore = platforms.filter(p => b.platforms.includes(p)).length;
      return bScore - aScore;
    })
    .slice(0, 6); // Return top 6 recommendations
}
