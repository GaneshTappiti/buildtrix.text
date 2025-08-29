// IdeaForge Types
export type IdeaStatus = 'draft' | 'researching' | 'validated' | 'building';
export type IdeaForgeTab = 'overview' | 'wiki' | 'blueprint' | 'journey' | 'feedback';

// RAG Tool Types (from RAG repository)
export type RAGTool =
  | 'lovable'
  | 'uizard'
  | 'adalo'
  | 'flutterflow'
  | 'framer'
  | 'bubble'
  | 'bolt'
  | 'cursor'
  | 'cline'
  | 'v0'
  | 'devin'
  | 'windsurf'
  | 'roocode'
  | 'manus'
  | 'same_dev';

// Array of all available RAG tools for runtime checks
export const RAG_TOOLS: RAGTool[] = [
  'lovable',
  'uizard',
  'adalo',
  'flutterflow',
  'framer',
  'bubble',
  'bolt',
  'cursor',
  'cline',
  'v0',
  'devin',
  'windsurf',
  'roocode',
  'manus',
  'same_dev'
];

export interface RAGToolProfile {
  id: RAGTool;
  name: string;
  description: string;
  category: 'no-code' | 'low-code' | 'ai-coding' | 'design';
  icon: string;
  bestFor: string[];
  platforms: Platform[];
  appTypes: AppType[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  pricing: 'free' | 'freemium' | 'paid';
  url: string;
}

// MVP Wizard Types
export type AppType = 'web-app' | 'mobile-app' | 'saas-tool' | 'chrome-extension' | 'ai-app';
export type UITheme = 'dark' | 'light';
export type DesignStyle = 'minimal' | 'playful' | 'business';
export type Platform = 'web' | 'android' | 'ios' | 'cross-platform';

export interface MVPWizardData {
  step1: {
    appName: string;
    appType: AppType;
  };
  step2: {
    theme: UITheme;
    designStyle: DesignStyle;
    selectedTool?: RAGTool; // NEW: RAG tool selection
  };
  step3: {
    platforms: Platform[];
  };
  step4: {
    selectedAI: string;
  };
  userPrompt: string;
}

// RAG Integration Types
export interface RAGContext {
  toolId: RAGTool;
  toolProfile: RAGToolProfile;
  relevantDocs: string[];
  toolSpecificPrompts: string[];
  optimizationTips: string[];
  constraints: string[];
  bestPractices: string[];
  commonPitfalls: string[];
}

export interface RAGPromptResult {
  prompt: string;
  toolContext: RAGContext;
  confidence: number;
  sources: string[];
  toolSpecificOptimizations: string[];
}

// Additional types for MVP Studio integration
export interface PagePrompt {
  pageName: string;
  prompt: string;
  components: string[];
  layout: string;
  interactions: string[];
}

export interface BuilderTool {
  name: string;
  description: string;
  url: string;
  bestFor: string[];
  category: string;
}

export interface GeneratedFramework {
  prompts: {
    framework: string;
    pages: PagePrompt[];
    linking: string;
  };
  recommendedTools: BuilderTool[];
  metadata: {
    generatedAt: string;
    toolUsed?: RAGTool;
    confidence: number;
  };
}

export interface MVPAnalysisResult {
  pages: Array<{
    name: string;
    description: string;
    components: string[];
    layout: string;
  }>;
  navigation: {
    type: string;
    structure: Array<{ name: string }>;
  };
  components: string[];
  styling: {
    theme: UITheme;
    designStyle: DesignStyle;
    colorScheme: string[];
    typography: string;
    spacing: string;
  };
  recommendedTools: Array<{
    name: string;
    description: string;
    pros: string[];
    cons: string[];
    bestFor: string[];
    pricing: string;
    url: string;
    priority: number;
  }>;
}

export interface IdeaInput {
  title: string;
  description?: string;
  tags?: string[];
}

export interface StoredIdea {
  id: string;
  title: string;
  description: string;
  content: string;
  status: IdeaStatus;
  tags: string[];
  coverImage?: string;
  favorited: boolean;
  createdAt: string;
  updatedAt: string;
  progress: {
    wiki: number;
    blueprint: number;
    journey: number;
    feedback: number;
  };
}

export interface IdeaForgeSidebarItem {
  id: IdeaForgeTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  progress?: number;
}

export interface ExportData {
  idea?: {
    title?: string;
    description?: string;
    status?: string;
    tags?: string[];
    createdAt?: string;
  };
  wiki?: {
    sections?: Array<{
      title?: string;
      content?: string;
    }>;
  };
  blueprint?: {
    appType?: string;
    features?: Array<{
      name?: string;
      description?: string;
      priority?: string;
    }>;
    techStack?: Array<{
      name?: string;
      description?: string;
      category?: string;
    }>;
  };
  journey?: {
    entries?: Array<{
      title?: string;
      content?: string;
      date?: string;
      type?: string;
    }>;
  };
  feedback?: {
    items?: Array<{
      title?: string;
      content?: string;
      author?: string;
    }>;
  };
}
