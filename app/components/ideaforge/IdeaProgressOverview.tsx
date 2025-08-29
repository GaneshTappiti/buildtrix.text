"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Target, Map, MessageSquare, TrendingUp, BarChart3 } from "lucide-react";
import ProgressAnalytics, { MilestoneTracker } from "./ProgressAnalytics";

interface ProgressSection {
  id: string;
  name: string;
  progress: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
}

interface IdeaProgressOverviewProps {
  wikiProgress?: number;
  blueprintProgress?: number;
  journeyProgress?: number;
  feedbackProgress?: number;
  className?: string;
  showOverallProgress?: boolean;
  ideaId?: string;
}

const IdeaProgressOverview: React.FC<IdeaProgressOverviewProps> = ({
  wikiProgress = 75,
  blueprintProgress = 60,
  journeyProgress = 40,
  feedbackProgress = 30,
  className = "",
  showOverallProgress = true,
  ideaId = "default"
}) => {
  const progressSections: ProgressSection[] = [
    {
      id: 'wiki',
      name: 'Wiki',
      progress: wikiProgress,
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-600/10',
      borderColor: 'border-blue-600/20',
      description: 'Knowledge base and documentation'
    },
    {
      id: 'blueprint',
      name: 'Blueprint',
      progress: blueprintProgress,
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-600/10',
      borderColor: 'border-purple-600/20',
      description: 'Technical planning and architecture'
    },
    {
      id: 'journey',
      name: 'Journey',
      progress: journeyProgress,
      icon: Map,
      color: 'text-green-400',
      bgColor: 'bg-green-600/10',
      borderColor: 'border-green-600/20',
      description: 'Timeline and milestone tracking'
    },
    {
      id: 'feedback',
      name: 'Feedback',
      progress: feedbackProgress,
      icon: MessageSquare,
      color: 'text-orange-400',
      bgColor: 'bg-orange-600/10',
      borderColor: 'border-orange-600/20',
      description: 'Collaboration and reviews'
    }
  ];

  const overallProgress = Math.round(
    (wikiProgress + blueprintProgress + journeyProgress + feedbackProgress) / 4
  );

  const getProgressLabel = (progress: number): string => {
    if (progress >= 80) return 'Excellent';
    if (progress >= 60) return 'Good progress';
    if (progress >= 40) return 'Making progress';
    if (progress >= 20) return 'Getting started';
    return 'Just beginning';
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-blue-400';
    if (progress >= 40) return 'text-yellow-400';
    return 'text-gray-400';
  };

  return (
    <Card className={`glass-effect-theme ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-400" />
            Idea Development Progress
          </CardTitle>
          <div className="flex items-center gap-2">
            {showOverallProgress && (
              <Badge
                className={`${getProgressColor(overallProgress)} bg-green-600/20 border-green-500/30`}
              >
                {overallProgress}% Complete
              </Badge>
            )}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-green-500/30 text-green-400 hover:bg-green-600/10">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-6xl glass-effect-theme border-green-500/20 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Detailed Progress Analytics</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <ProgressAnalytics ideaId={ideaId} />
                  <MilestoneTracker ideaId={ideaId} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {showOverallProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Overall Progress</span>
              <span className={`font-medium ${getProgressColor(overallProgress)}`}>
                {getProgressLabel(overallProgress)}
              </span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {progressSections.map((section) => {
            const Icon = section.icon;
            return (
              <div
                key={section.id}
                className="glass-effect p-4 rounded-lg transition-all hover:scale-[1.02] cursor-pointer hover:bg-white/5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${section.color}`} />
                    <span className="text-white font-medium text-sm">
                      {section.name}
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${section.color}`}>
                    {section.progress}%
                  </span>
                </div>
                <Progress
                  value={section.progress}
                  className="h-2 mb-2"
                />
                <div className="text-xs text-gray-400">
                  {getProgressLabel(section.progress)}
                </div>
                {section.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {section.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaProgressOverview;
