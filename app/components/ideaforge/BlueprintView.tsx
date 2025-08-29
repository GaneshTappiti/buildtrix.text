"use client"

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Layers, Plus, Smartphone, Code, Database, Edit, Trash2, Save, X,
  Monitor, Globe, Zap, Settings, ArrowUp, ArrowDown, Star
} from "lucide-react";
import { StoredIdea } from "@/types/ideaforge";
import IdeaProgressOverview from "./IdeaProgressOverview";
import AIAssistant from "./AIAssistant";

interface Feature {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'completed';
  category: 'core' | 'enhancement' | 'integration' | 'ui-ux';
  estimatedHours?: number;
}

interface TechStackItem {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'infrastructure' | 'tools';
  description: string;
  reason: string;
}

interface AppConfig {
  type: 'web-app' | 'mobile-app' | 'desktop-app' | 'browser-extension';
  platforms: string[];
  targetAudience: string;
  monetization: string;
}

interface BlueprintViewProps {
  idea: StoredIdea;
  onUpdate?: (updates: Partial<StoredIdea>) => void;
}

const BlueprintView: React.FC<BlueprintViewProps> = ({ idea, onUpdate }) => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [techStack, setTechStack] = useState<TechStackItem[]>([]);
  const [appConfig, setAppConfig] = useState<AppConfig>({
    type: 'mobile-app',
    platforms: ['iOS', 'Android'],
    targetAudience: 'Fitness enthusiasts and beginners',
    monetization: 'Freemium with premium features'
  });

  const [isAddingFeature, setIsAddingFeature] = useState(false);
  const [isAddingTech, setIsAddingTech] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingTech, setEditingTech] = useState<TechStackItem | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const [newFeature, setNewFeature] = useState({
    name: '',
    description: '',
    priority: 'medium' as Feature['priority'],
    category: 'core' as Feature['category'],
    estimatedHours: 0
  });

  const [newTech, setNewTech] = useState({
    name: '',
    category: 'frontend' as TechStackItem['category'],
    description: '',
    reason: ''
  });

  // Initialize with default data
  useEffect(() => {
    const defaultFeatures: Feature[] = [
      {
        id: '1',
        name: 'AI Workout Generation',
        description: 'Personalized workout plans based on user goals, fitness level, and preferences',
        priority: 'high',
        status: 'planned',
        category: 'core',
        estimatedHours: 40
      },
      {
        id: '2',
        name: 'Form Analysis',
        description: 'Real-time computer vision feedback for exercise form correction',
        priority: 'high',
        status: 'planned',
        category: 'core',
        estimatedHours: 60
      },
      {
        id: '3',
        name: 'Progress Tracking',
        description: 'Comprehensive analytics and insights on user progress',
        priority: 'medium',
        status: 'planned',
        category: 'core',
        estimatedHours: 25
      },
      {
        id: '4',
        name: 'Social Features',
        description: 'Community challenges, sharing, and social motivation',
        priority: 'low',
        status: 'planned',
        category: 'enhancement',
        estimatedHours: 35
      }
    ];

    const defaultTechStack: TechStackItem[] = [
      {
        id: '1',
        name: 'React Native',
        category: 'frontend',
        description: 'Cross-platform mobile development framework',
        reason: 'Enables single codebase for iOS and Android with native performance'
      },
      {
        id: '2',
        name: 'Node.js + Express',
        category: 'backend',
        description: 'JavaScript runtime and web framework',
        reason: 'Fast development, large ecosystem, good for real-time features'
      },
      {
        id: '3',
        name: 'PostgreSQL',
        category: 'database',
        description: 'Relational database with JSON support',
        reason: 'Reliable, scalable, supports complex queries and user data'
      },
      {
        id: '4',
        name: 'TensorFlow.js',
        category: 'tools',
        description: 'Machine learning library for JavaScript',
        reason: 'Required for computer vision and AI workout generation features'
      }
    ];

    setFeatures(defaultFeatures);
    setTechStack(defaultTechStack);
  }, []);

  const priorityColors = {
    high: 'bg-red-600/20 text-red-400 border-red-600/30',
    medium: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    low: 'bg-green-600/20 text-green-400 border-green-600/30'
  };

  const statusColors = {
    planned: 'bg-gray-600/20 text-gray-400 border-gray-600/30',
    'in-progress': 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    completed: 'bg-green-600/20 text-green-400 border-green-600/30'
  };

  const categoryIcons = {
    core: '⭐',
    enhancement: '✨',
    integration: '🔗',
    'ui-ux': '🎨'
  };

  const techCategoryIcons = {
    frontend: '🖥️',
    backend: '⚙️',
    database: '🗄️',
    infrastructure: '☁️',
    tools: '🛠️'
  };

  const handleDeleteFeature = (featureId: string) => {
    setFeatures(prev => prev.filter(f => f.id !== featureId));
  };

  const handleDeleteTech = (techId: string) => {
    setTechStack(prev => prev.filter(t => t.id !== techId));
  };

  const moveFeature = (featureId: string, direction: 'up' | 'down') => {
    setFeatures(prev => {
      const index = prev.findIndex(f => f.id === featureId);
      if (index === -1) return prev;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newFeatures = [...prev];
      [newFeatures[index], newFeatures[newIndex]] = [newFeatures[newIndex], newFeatures[index]];
      return newFeatures;
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <IdeaProgressOverview
        wikiProgress={75}
        blueprintProgress={60}
        journeyProgress={40}
        feedbackProgress={30}
        showOverallProgress={true}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6 text-green-400" />
          <h2 className="workspace-title">Product Blueprint</h2>
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {features.length} features
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button className="workspace-button">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
          <AIAssistant
            onContentGenerated={(content, category) => {
              if (category === 'blueprint') {
                // Parse AI content and add as features or tech stack items
                console.log('AI Generated Blueprint Content:', content);
              }
            }}
            ideaContext={{
              title: idea.title,
              description: idea.description,
              category: 'blueprint'
            }}
          />
        </div>
      </div>

      {/* App Configuration */}
      <Card className="glass-effect-theme">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-green-400" />
            App Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-effect p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="h-5 w-5 text-green-400" />
                <span className="font-medium text-white">App Type</span>
              </div>
              <p className="text-gray-300">{appConfig.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            <div className="glass-effect p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="h-5 w-5 text-green-400" />
                <span className="font-medium text-white">Platforms</span>
              </div>
              <p className="text-gray-300">{appConfig.platforms.join(', ')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Core Features */}
      <Card className="glass-effect-theme">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-green-400" />
              Core Features
            </CardTitle>
            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-600/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={feature.id} className="glass-effect p-4 rounded-lg hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categoryIcons[feature.category]}</span>
                    <div>
                      <h4 className="font-medium text-white">{feature.name}</h4>
                      <p className="text-sm text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={priorityColors[feature.priority]}>
                      {feature.priority}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeature(feature.id, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-green-400 hover:bg-green-600/10"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => moveFeature(feature.id, 'down')}
                        disabled={index === features.length - 1}
                        className="text-gray-400 hover:text-green-400 hover:bg-green-600/10"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                {feature.estimatedHours && (
                  <div className="text-xs text-gray-500">
                    Estimated: {feature.estimatedHours} hours
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tech Stack */}
      <Card className="glass-effect-theme">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Code className="h-5 w-5 text-green-400" />
              Tech Stack
            </CardTitle>
            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-600/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Technology
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((tech) => (
              <div key={tech.id} className="glass-effect p-4 rounded-lg hover:bg-white/5 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{techCategoryIcons[tech.category]}</span>
                    <span className="font-medium text-white">{tech.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTech(tech.id)}
                    className="text-gray-400 hover:text-red-400 hover:bg-red-600/10"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-gray-400 mb-2">{tech.description}</p>
                <p className="text-xs text-gray-500">{tech.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlueprintView;
