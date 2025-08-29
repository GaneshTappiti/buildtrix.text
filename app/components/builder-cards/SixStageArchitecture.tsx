"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Lightbulb, 
  Layers, 
  Palette, 
  GitBranch, 
  Package,
  ArrowRight,
  CheckCircle,
  Clock,
  Sparkles,
  Settings,
  Play
} from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { AppIdeaCard } from "./AppIdeaCard";
import { ValidationCard } from "./ValidationCard";
import { BlueprintCard } from "./BlueprintCard";
import { PromptGeneratorCard } from "./PromptGeneratorCard";
import { FlowDescriptionCard } from "./FlowDescriptionCard";
import { ExportComposerCard } from "./ExportComposerCard";

interface StageConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  component: React.ComponentType<any>;
  estimatedTime: string;
}

const stageConfigs: StageConfig[] = [
  {
    id: 1,
    title: "Tool-Adaptive Engine",
    subtitle: "App Idea Input",
    description: "Define your app concept, platform, and design preferences",
    icon: Brain,
    color: "text-green-400",
    gradient: "feature-gradient-1",
    component: AppIdeaCard,
    estimatedTime: "5-10 min"
  },
  {
    id: 2,
    title: "Idea Interpreter",
    subtitle: "Validation Questions",
    description: "Understand your product maturity and motivation",
    icon: Lightbulb,
    color: "text-blue-400",
    gradient: "feature-gradient-2",
    component: ValidationCard,
    estimatedTime: "3-5 min"
  },
  {
    id: 3,
    title: "App Skeleton Generator",
    subtitle: "Blueprint Generation",
    description: "Auto-generated app structure and architecture",
    icon: Layers,
    color: "text-purple-400",
    gradient: "feature-gradient-3",
    component: BlueprintCard,
    estimatedTime: "2-3 min"
  },
  {
    id: 4,
    title: "UI Prompt Generator",
    subtitle: "Screen Descriptions",
    description: "Detailed screen-by-screen UI prompts",
    icon: Palette,
    color: "text-pink-400",
    gradient: "feature-gradient-4",
    component: PromptGeneratorCard,
    estimatedTime: "5-8 min"
  },
  {
    id: 5,
    title: "Logic & Navigation Flow Mapper",
    subtitle: "App Flow & Wireframes",
    description: "Navigation logic and user flow mapping",
    icon: GitBranch,
    color: "text-orange-400",
    gradient: "feature-gradient-1",
    component: FlowDescriptionCard,
    estimatedTime: "3-5 min"
  },
  {
    id: 6,
    title: "Prompt Export Composer",
    subtitle: "Final Export",
    description: "Compose and export prompts for AI builders",
    icon: Package,
    color: "text-emerald-400",
    gradient: "feature-gradient-2",
    component: ExportComposerCard,
    estimatedTime: "2-3 min"
  }
];

interface SixStageArchitectureProps {
  className?: string;
  showOverview?: boolean;
  forceBuilderMode?: boolean;
  onStartBuilder?: () => void;
}

export function SixStageArchitecture({ className = "", showOverview = true, forceBuilderMode = false, onStartBuilder }: SixStageArchitectureProps) {
  const { state, dispatch } = useBuilder();
  const [viewMode, setViewMode] = useState<'overview' | 'builder'>(forceBuilderMode ? 'builder' : 'overview');
  const router = useRouter();
  
  const currentStage = stageConfigs.find(stage => stage.id === state.currentCard);
  const completedStages = state.currentCard - 1;
  const totalProgress = (completedStages / 6) * 100;

  const handleStageClick = (stageId: number) => {
    // Set the current stage and trigger wizard
    dispatch(builderActions.setCurrentCard(stageId));
    if (onStartBuilder) {
      onStartBuilder();
    } else {
      // Fallback to redirect if no callback provided
      router.push('/workspace/mvp-studio/builder');
    }
  };

  const handleStartBuilder = () => {
    // Set current card to 1 if starting fresh, otherwise keep current progress
    if (state.currentCard === 1) {
      dispatch(builderActions.setCurrentCard(1));
    }
    // Use callback if provided, otherwise redirect
    if (onStartBuilder) {
      onStartBuilder();
    } else {
      router.push('/workspace/mvp-studio/builder');
    }
  };

  const getStageStatus = (stageId: number) => {
    if (stageId < state.currentCard) return 'completed';
    if (stageId === state.currentCard) return 'current';
    return 'upcoming';
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-black/20 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">6-Stage Modular Architecture</span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gradient">
          Builder Blueprint AI
        </h1>
        
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Transform your app idea into AI-ready prompts through our systematic 6-stage process
        </p>

        {/* Progress Overview */}
        {state.currentCard > 1 && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className="text-white font-medium">{Math.round(totalProgress)}% Complete</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
            <p className="text-sm text-gray-400">
              Stage {state.currentCard} of 6 • {completedStages} stages completed
            </p>
          </div>
        )}
      </div>

      {/* Stage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stageConfigs.map((stage, index) => {
          const Icon = stage.icon;
          const status = getStageStatus(stage.id);
          const isClickable = status === 'completed' || status === 'current' || stage.id === 1;
          
          return (
            <Card
              key={stage.id}
              className={`relative overflow-hidden transition-all duration-200 cursor-pointer transform-none will-change-auto backface-visibility-hidden ${
                status === 'completed' 
                  ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/20' 
                  : status === 'current'
                  ? 'bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/50'
                  : 'workspace-card hover:border-white/20'
              } ${!isClickable ? 'opacity-60 cursor-not-allowed' : ''} ${
                isClickable ? 'hover:shadow-xl hover:shadow-black/50 hover:-translate-y-1' : ''
              }`}
              onClick={() => isClickable && handleStageClick(stage.id)}
            >
              <div className={`absolute inset-0 ${stage.gradient} opacity-20`} />
              
              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-xl bg-black/20 border border-white/10 transform-none`}>
                    <Icon className={`h-6 w-6 ${stage.color}`} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge 
                      variant={status === 'completed' ? 'default' : status === 'current' ? 'secondary' : 'outline'}
                      className={
                        status === 'completed' 
                          ? 'bg-green-600/20 text-green-400 border-green-500/30' 
                          : status === 'current'
                          ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                          : 'border-gray-600 text-gray-400'
                      }
                    >
                      {status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                      {status === 'current' && <Play className="w-3 h-3 mr-1" />}
                      {status === 'upcoming' && <Clock className="w-3 h-3 mr-1" />}
                      {status === 'completed' ? 'Complete' : status === 'current' ? 'Current' : 'Upcoming'}
                    </Badge>
                    <span className="text-xs text-gray-400">{stage.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-white text-lg">{stage.title}</CardTitle>
                  <p className="text-sm font-medium text-gray-300">{stage.subtitle}</p>
                </div>
              </CardHeader>
              
              <CardContent className="relative">
                <p className="text-gray-400 text-sm mb-4">{stage.description}</p>
                
                {isClickable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`w-full ${stage.color} hover:bg-white/5`}
                    onClick={() => handleStageClick(stage.id)}
                  >
                    {status === 'completed' ? 'Review' : status === 'current' ? 'Continue' : 'Start'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleStartBuilder}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
        >
          <Play className="w-5 h-5 mr-2" />
          {state.currentCard > 1 ? 'Continue Building' : 'Start Building'}
        </Button>
        
        {state.projectHistory.length > 0 && (
          <Button
            variant="outline"
            className="border-green-500/30 hover:bg-green-500/10 text-white px-6 py-3"
          >
            <Settings className="w-5 h-5 mr-2" />
            Project History
          </Button>
        )}
      </div>
    </div>
  );

  const renderBuilder = () => {
    if (!currentStage) return null;
    
    const StageComponent = currentStage.component;
    const Icon = currentStage.icon;
    
    return (
      <div className="space-y-6">
        {/* Builder Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setViewMode('overview')}
            className="text-gray-400 hover:text-white"
          >
            ← Back to Overview
          </Button>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-400">Stage {state.currentCard} of 6</p>
              <p className="text-xs text-gray-500">{currentStage.estimatedTime}</p>
            </div>
            <Progress value={(state.currentCard / 6) * 100} className="w-32 h-2" />
          </div>
        </div>

        {/* Stage Content */}
        <Card className="workspace-card-solid">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${currentStage.gradient}`}>
                <Icon className={`h-8 w-8 ${currentStage.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">{currentStage.title}</CardTitle>
                <p className="text-gray-400 mt-1">{currentStage.description}</p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <StageComponent />
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {(showOverview && viewMode === 'overview' && !forceBuilderMode) ? renderOverview() : renderBuilder()}
    </div>
  );
}
