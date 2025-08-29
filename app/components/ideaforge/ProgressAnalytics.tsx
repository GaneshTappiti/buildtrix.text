"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, Calendar, Target, Clock, BarChart3, PieChart, 
  Activity, CheckCircle, AlertCircle, Zap, Users, Brain
} from "lucide-react";
import { useIdeaForgePersistence } from "@/hooks/useIdeaForgePersistence";

interface ProgressAnalyticsProps {
  ideaId: string;
}

interface ProgressMetrics {
  totalSections: number;
  totalFeatures: number;
  totalJourneyEntries: number;
  totalFeedback: number;
  completedFeatures: number;
  highPriorityFeatures: number;
  recentActivity: number;
  overallProgress: number;
  weeklyProgress: number[];
  categoryBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  timelineData: Array<{ date: string; sections: number; features: number; entries: number }>;
}

const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ ideaId }) => {
  const {
    wikiSections,
    features,
    journeyEntries,
    feedback,
    lastSaved
  } = useIdeaForgePersistence(ideaId);

  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'all'>('week');

  const metrics = useMemo((): ProgressMetrics => {
    const totalSections = wikiSections.length;
    const totalFeatures = features.length;
    const totalJourneyEntries = journeyEntries.length;
    const totalFeedback = feedback.length;
    const completedFeatures = features.filter(f => f.status === 'completed').length;
    const highPriorityFeatures = features.filter(f => f.priority === 'high').length;

    // Calculate recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentSections = wikiSections.filter(s => s.lastUpdated > weekAgo).length;
    const recentEntries = journeyEntries.filter(e => e.timestamp > weekAgo).length;
    const recentActivity = recentSections + recentEntries;

    // Overall progress calculation
    const sectionProgress = Math.min((totalSections / 10) * 100, 100);
    const featureProgress = totalFeatures > 0 ? (completedFeatures / totalFeatures) * 100 : 0;
    const journeyProgress = Math.min((totalJourneyEntries / 5) * 100, 100);
    const feedbackProgress = Math.min((totalFeedback / 10) * 100, 100);
    const overallProgress = Math.round((sectionProgress + featureProgress + journeyProgress + feedbackProgress) / 4);

    // Weekly progress simulation (would be calculated from actual data)
    const weeklyProgress = [65, 70, 72, 75, 78, 82, overallProgress];

    // Category breakdown
    const categoryBreakdown = wikiSections.reduce((acc, section) => {
      acc[section.category] = (acc[section.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority breakdown
    const priorityBreakdown = features.reduce((acc, feature) => {
      acc[feature.priority] = (acc[feature.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Timeline data (last 7 days)
    const timelineData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sections: Math.floor(Math.random() * 3), // Simulated data
        features: Math.floor(Math.random() * 2),
        entries: Math.floor(Math.random() * 2)
      };
    });

    return {
      totalSections,
      totalFeatures,
      totalJourneyEntries,
      totalFeedback,
      completedFeatures,
      highPriorityFeatures,
      recentActivity,
      overallProgress,
      weeklyProgress,
      categoryBreakdown,
      priorityBreakdown,
      timelineData
    };
  }, [wikiSections, features, journeyEntries, feedback]);

  const getProgressColor = (progress: number): string => {
    if (progress >= 80) return 'text-green-400';
    if (progress >= 60) return 'text-blue-400';
    if (progress >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressBgColor = (progress: number): string => {
    if (progress >= 80) return 'bg-green-600/20 border-green-500/30';
    if (progress >= 60) return 'bg-blue-600/20 border-blue-500/30';
    if (progress >= 40) return 'bg-yellow-600/20 border-yellow-500/30';
    return 'bg-red-600/20 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass-effect-theme">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overall Progress</p>
                <p className={`text-2xl font-bold ${getProgressColor(metrics.overallProgress)}`}>
                  {metrics.overallProgress}%
                </p>
              </div>
              <div className={`p-2 rounded-lg ${getProgressBgColor(metrics.overallProgress)}`}>
                <TrendingUp className={`h-5 w-5 ${getProgressColor(metrics.overallProgress)}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-theme">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Wiki Sections</p>
                <p className="text-2xl font-bold text-white">{metrics.totalSections}</p>
              </div>
              <div className="p-2 rounded-lg bg-blue-600/20">
                <Brain className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-theme">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Features</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.completedFeatures}/{metrics.totalFeatures}
                </p>
              </div>
              <div className="p-2 rounded-lg bg-green-600/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-theme">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Recent Activity</p>
                <p className="text-2xl font-bold text-white">{metrics.recentActivity}</p>
              </div>
              <div className="p-2 rounded-lg bg-orange-600/20">
                <Activity className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="glass-effect">
          <TabsTrigger value="progress" className="data-[state=active]:bg-green-600/20">
            <BarChart3 className="h-4 w-4 mr-2" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="breakdown" className="data-[state=active]:bg-green-600/20">
            <PieChart className="h-4 w-4 mr-2" />
            Breakdown
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-green-600/20">
            <Calendar className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card className="glass-effect-theme">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Progress Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Weekly Progress Chart (Simplified) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Weekly Progress</span>
                    <span className="text-sm text-green-400">+{metrics.weeklyProgress[6] - metrics.weeklyProgress[0]}% this week</span>
                  </div>
                  <div className="flex items-end gap-2 h-20">
                    {metrics.weeklyProgress.map((progress, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div 
                          className="w-full bg-green-600/30 rounded-t"
                          style={{ height: `${(progress / 100) * 100}%` }}
                        />
                        <span className="text-xs text-gray-500 mt-1">
                          {index === 6 ? 'Today' : `${7-index}d`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Feature Completion</span>
                    <span className="text-sm text-white">{metrics.completedFeatures} of {metrics.totalFeatures}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${metrics.totalFeatures > 0 ? (metrics.completedFeatures / metrics.totalFeatures) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* High Priority Features */}
                {metrics.highPriorityFeatures > 0 && (
                  <div className="flex items-center gap-2 p-3 bg-red-600/10 border border-red-600/20 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <span className="text-sm text-red-400">
                      {metrics.highPriorityFeatures} high priority feature{metrics.highPriorityFeatures > 1 ? 's' : ''} pending
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Wiki Categories */}
            <Card className="glass-effect-theme">
              <CardHeader>
                <CardTitle className="text-white text-lg">Wiki Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.categoryBreakdown).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300 capitalize">{category}</span>
                      <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
                        {count}
                      </Badge>
                    </div>
                  ))}
                  {Object.keys(metrics.categoryBreakdown).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No wiki sections yet</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Feature Priorities */}
            <Card className="glass-effect-theme">
              <CardHeader>
                <CardTitle className="text-white text-lg">Feature Priorities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.priorityBreakdown).map(([priority, count]) => {
                    const colors = {
                      high: 'bg-red-600/20 text-red-400 border-red-500/30',
                      medium: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30',
                      low: 'bg-green-600/20 text-green-400 border-green-500/30'
                    };
                    return (
                      <div key={priority} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300 capitalize">{priority} Priority</span>
                        <Badge className={colors[priority as keyof typeof colors]}>
                          {count}
                        </Badge>
                      </div>
                    );
                  })}
                  {Object.keys(metrics.priorityBreakdown).length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No features yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="glass-effect-theme">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-400" />
                Activity Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.timelineData.map((day, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 glass-effect rounded-lg">
                    <div className="text-sm text-gray-400 w-16">{day.date}</div>
                    <div className="flex-1 flex items-center gap-4">
                      {day.sections > 0 && (
                        <Badge className="bg-blue-600/20 text-blue-400 border-blue-500/30 text-xs">
                          {day.sections} sections
                        </Badge>
                      )}
                      {day.features > 0 && (
                        <Badge className="bg-green-600/20 text-green-400 border-green-500/30 text-xs">
                          {day.features} features
                        </Badge>
                      )}
                      {day.entries > 0 && (
                        <Badge className="bg-orange-600/20 text-orange-400 border-orange-500/30 text-xs">
                          {day.entries} entries
                        </Badge>
                      )}
                      {day.sections === 0 && day.features === 0 && day.entries === 0 && (
                        <span className="text-xs text-gray-500">No activity</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card className="glass-effect-theme">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-400" />
            Quick Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Recommendations</h4>
              <div className="space-y-1">
                {metrics.totalSections < 5 && (
                  <p className="text-xs text-gray-400">• Add more wiki sections to improve documentation</p>
                )}
                {metrics.highPriorityFeatures > 0 && (
                  <p className="text-xs text-gray-400">• Focus on completing high priority features</p>
                )}
                {metrics.recentActivity === 0 && (
                  <p className="text-xs text-gray-400">• Consider adding recent progress updates</p>
                )}
                {metrics.totalFeedback < 3 && (
                  <p className="text-xs text-gray-400">• Gather more feedback to validate your idea</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-white">Next Steps</h4>
              <div className="space-y-1">
                <p className="text-xs text-gray-400">• Complete market research documentation</p>
                <p className="text-xs text-gray-400">• Define MVP feature set</p>
                <p className="text-xs text-gray-400">• Create development timeline</p>
                <p className="text-xs text-gray-400">• Validate with potential users</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressAnalytics;

// Milestone Tracking Component
export const MilestoneTracker: React.FC<{ ideaId: string }> = ({ ideaId }) => {
  const [milestones, setMilestones] = React.useState([
    { id: '1', title: 'Market Research Complete', completed: true, dueDate: '2024-01-15', category: 'research' },
    { id: '2', title: 'MVP Features Defined', completed: true, dueDate: '2024-01-20', category: 'planning' },
    { id: '3', title: 'Technical Architecture', completed: false, dueDate: '2024-01-25', category: 'technical' },
    { id: '4', title: 'User Testing Plan', completed: false, dueDate: '2024-02-01', category: 'validation' },
    { id: '5', title: 'Development Start', completed: false, dueDate: '2024-02-15', category: 'development' }
  ]);

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercentage = Math.round((completedCount / milestones.length) * 100);

  return (
    <Card className="glass-effect-theme">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Milestones
          </CardTitle>
          <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
            {completedCount}/{milestones.length} Complete
          </Badge>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
          <div
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <div key={milestone.id} className="flex items-center gap-3 p-3 glass-effect rounded-lg">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                milestone.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-500'
              }`}>
                {milestone.completed && <CheckCircle className="w-3 h-3 text-white" />}
              </div>
              <div className="flex-1">
                <h4 className={`text-sm font-medium ${milestone.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                  {milestone.title}
                </h4>
                <p className="text-xs text-gray-500">Due: {milestone.dueDate}</p>
              </div>
              <Badge variant="outline" className="border-green-500/30 text-green-400 text-xs">
                {milestone.category}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
