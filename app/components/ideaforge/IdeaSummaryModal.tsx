"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Share2, 
  Target, 
  Users, 
  DollarSign,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BarChart3,
  Calendar,
  Rocket
} from "lucide-react";

interface IdeaSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaData?: {
    title: string;
    description: string;
    status: string;
    tags: string[];
    createdAt: string;
  };
}

const IdeaSummaryModal: React.FC<IdeaSummaryModalProps> = ({ 
  isOpen, 
  onClose, 
  ideaData = {
    title: "AI-Powered Fitness Coach",
    description: "A personalized fitness app that uses AI to create custom workout plans",
    status: "validated",
    tags: ["AI", "Fitness", "Mobile App", "Health"],
    createdAt: "2024-01-15"
  }
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock analysis data
  const analysisData = {
    validationScore: 78,
    marketPotential: 85,
    technicalFeasibility: 72,
    competitiveAdvantage: 68,
    strengths: [
      "Growing health and fitness market",
      "AI personalization trend",
      "Mobile-first approach",
      "Subscription revenue model"
    ],
    weaknesses: [
      "High competition from established players",
      "Requires significant AI development",
      "User acquisition costs may be high"
    ],
    opportunities: [
      "Integration with wearable devices",
      "Corporate wellness programs",
      "Nutrition tracking expansion",
      "Virtual reality workouts"
    ],
    threats: [
      "Big tech companies entering market",
      "Privacy concerns with health data",
      "Economic downturn affecting discretionary spending"
    ]
  };

  const milestones = [
    { name: "Market Research", status: "completed", date: "Week 1-2" },
    { name: "MVP Development", status: "in-progress", date: "Week 3-8" },
    { name: "Beta Testing", status: "upcoming", date: "Week 9-12" },
    { name: "Launch", status: "upcoming", date: "Week 13-16" }
  ];

  const handleExport = (format: 'pdf' | 'json' | 'markdown') => {
    // In a real app, this would generate and download the file
    console.log(`Exporting summary as ${format}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-blue-400';
      case 'upcoming': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4 text-blue-400" />;
      case 'upcoming': return <Calendar className="h-4 w-4 text-gray-400" />;
      default: return <Calendar className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5 text-green-400" />
            Idea Summary Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Idea Header */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20">
            <h2 className="text-xl font-bold text-white mb-2">{ideaData.title}</h2>
            <p className="text-gray-300 mb-3">{ideaData.description}</p>
            <div className="flex flex-wrap gap-2">
              {ideaData.tags.map((tag, index) => (
                <Badge key={index} className="bg-green-500/20 text-green-400 border-green-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-black/20">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="workspace-card">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{analysisData.validationScore}%</p>
                    <p className="text-xs text-gray-400">Validation Score</p>
                  </CardContent>
                </Card>

                <Card className="workspace-card">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{analysisData.marketPotential}%</p>
                    <p className="text-xs text-gray-400">Market Potential</p>
                  </CardContent>
                </Card>

                <Card className="workspace-card">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{analysisData.technicalFeasibility}%</p>
                    <p className="text-xs text-gray-400">Technical Feasibility</p>
                  </CardContent>
                </Card>

                <Card className="workspace-card">
                  <CardContent className="p-4 text-center">
                    <Rocket className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-white">{analysisData.competitiveAdvantage}%</p>
                    <p className="text-xs text-gray-400">Competitive Edge</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white">Key Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-green-400 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {analysisData.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-green-400" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="workspace-card">
                  <CardHeader>
                    <CardTitle className="text-red-400">Challenges</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisData.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <AlertCircle className="h-3 w-3 text-red-400 mt-0.5" />
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="workspace-card">
                  <CardHeader>
                    <CardTitle className="text-blue-400">Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysisData.opportunities.map((opportunity, index) => (
                        <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                          <Lightbulb className="h-3 w-3 text-blue-400 mt-0.5" />
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-4">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white">Development Roadmap</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      {getStatusIcon(milestone.status)}
                      <div className="flex-1">
                        <p className={`font-medium ${getStatusColor(milestone.status)}`}>
                          {milestone.name}
                        </p>
                        <p className="text-sm text-gray-400">{milestone.date}</p>
                      </div>
                      <Badge 
                        className={
                          milestone.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30'
                            : milestone.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {milestone.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white">Export Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button
                      onClick={() => handleExport('pdf')}
                      variant="outline"
                      className="justify-start border-white/10 hover:bg-white/5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      PDF Report
                    </Button>
                    
                    <Button
                      onClick={() => handleExport('json')}
                      variant="outline"
                      className="justify-start border-white/10 hover:bg-white/5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      JSON Data
                    </Button>
                    
                    <Button
                      onClick={() => handleExport('markdown')}
                      variant="outline"
                      className="justify-start border-white/10 hover:bg-white/5"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Markdown
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <Share2 className="h-4 w-4 mr-2" />
              Share Summary
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IdeaSummaryModal;
