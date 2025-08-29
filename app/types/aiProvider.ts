// AI Provider Types
export interface AIProviderConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAIPreferences {
  id: string;
  userId: string;
  provider: string;
  defaultModel: string;
  temperature: number;
  maxTokens: number;
  systemPrompt?: string;
  customInstructions?: string;
  autoSave: boolean;
  enableLogging: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
  latency?: number;
  provider: string;
}

export interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  requestsToday: number;
  tokensToday: number;
  costToday: number;
  averageLatency: number;
  errorRate: number;
  lastUsed: Date;
}

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'custom';
  description: string;
  models: string[];
  pricing: {
    inputTokens: number;
    outputTokens: number;
    currency: string;
  };
  features: string[];
  maxTokens: number;
  supportsStreaming: boolean;
  supportsImages: boolean;
  supportsFunctions: boolean;
}

export interface AIRequest {
  id: string;
  userId: string;
  provider: string;
  model: string;
  prompt: string;
  response: string;
  tokens: number;
  cost: number;
  latency: number;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface AIProviderSettings {
  provider: AIProvider;
  config: AIProviderConfig;
  preferences: UserAIPreferences;
  status: ConnectionStatus;
  usage: UsageStats;
}

export type AIProviderType = 'openai' | 'anthropic' | 'google' | 'custom';

export interface ProviderCredentials {
  apiKey: string;
  baseUrl?: string;
  organization?: string;
  project?: string;
}

export interface ModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  provider: string;
  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIProviderError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface AIProviderMetrics {
  requestsPerMinute: number;
  averageLatency: number;
  errorRate: number;
  uptime: number;
  lastHealthCheck: Date;
}
