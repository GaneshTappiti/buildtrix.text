"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useActiveIdea, useIdeaContext } from '@/stores/ideaStore';
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  Loader2,
  PlusCircle,
  Menu
} from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";

// Define IdeaProps interface for export
export interface IdeaProps {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  tags: string[];
  votes: number;
  comments: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface ActiveIdea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'validated' | 'exploring' | 'archived';
  category: string;
  tags: string[];
  validation_score?: number;
  market_opportunity?: string;
  risk_assessment?: string;
  monetization_strategy?: string;
  key_features?: string[];
  next_steps?: string[];
  competitor_analysis?: string;
  target_market?: string;
  problem_statement?: string;
  created_at: string;
  updated_at: string;
}

export default function IdeaVaultPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [ideas, setIdeas] = useState<ActiveIdea[]>([]);

  const router = useRouter();
  const { toast } = useToast();
  const { activeIdea, fetchUserIdeas } = useActiveIdea();
  const { setHasActiveIdea, setActiveIdea } = useIdeaContext();

  // Mock subscription data for demonstration
  const isFreeTier = true;
  const usage = { ideasCreated: 1 };
  const currentPlan = { limits: { ideas: 1 } };

  // Mock data for demonstration - in real app this would come from database/store
  const loadIdeas = useCallback(async () => {
    setIsLoading(true);
    await fetchUserIdeas();
    setIsLoading(false);
  }, [fetchUserIdeas]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const continueToIdeaForge = () => {
    if (!activeIdea) {
      toast({
        title: "No Active Idea",
        description: "Please create an idea in Workshop first.",
        variant: "destructive"
      });
      return;
    }

    router.push('/workspace/ideaforge');
    
    toast({
      title: "Moving to IdeaForge",
      description: "Let's turn your idea into a structured plan!",
    });
  };

  const archiveIdea = async () => {
    if (!activeIdea) return;

    try {
      // In real app, update idea status to archived in database
      await setActiveIdea(null);
      setHasActiveIdea(false);

      toast({
        title: "Idea Archived",
        description: "Your idea has been archived. You can now create a new one!",
      });

      // Navigate back to workshop
      router.push('/workspace/workshop');
      
    } catch (error) {
      console.error('Error archiving idea:', error);
      toast({
        title: "Archive Failed",
        description: "Could not archive idea. Please try again.",
        variant: "destructive"
      });
    }
  };

  const startNewIdea = () => {
    router.push('/workspace/workshop');
  };

  const getValidationColor = (score?: number) => {
    if (!score) return "text-gray-400";
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getValidationBadge = (score?: number) => {
    if (!score) return { text: "Not Validated", color: "bg-gray-600/20 text-gray-400" };
    if (score >= 80) return { text: "High Potential", color: "bg-green-600/20 text-green-400" };
    if (score >= 60) return { text: "Moderate Potential", color: "bg-yellow-600/20 text-yellow-400" };
    return { text: "Needs Refinement", color: "bg-red-600/20 text-red-400" };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return { text: "Validated", color: "bg-green-600/20 text-green-400" };
      case 'exploring':
        return { text: "Exploring", color: "bg-blue-600/20 text-blue-400" };
      case 'draft':
        return { text: "Draft", color: "bg-gray-600/20 text-gray-400" };
      default:
        return { text: status, color: "bg-gray-600/20 text-gray-400" };
    }
  };

  return (
    <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="layout-main transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-black/30"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => router.push('/workspace')}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Workspace
                </Button>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Idea Vault</h1>
              </div>
              <Button onClick={startNewIdea} disabled={isLoading}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Idea
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <Loader2 className="h-12 w-12 text-green-500 animate-spin" />
              <p className="mt-4 text-gray-400">Loading your ideas...</p>
            </div>
          ) : ideas.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
              <Lightbulb className="h-16 w-16 text-gray-700 mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No ideas yet</h2>
              <p className="text-gray-400 max-w-md mb-8">Your Idea Vault is empty. Start brainstorming in the Workshop to create your first idea.</p>
              <Button onClick={startNewIdea} size="lg">
                <Sparkles className="h-5 w-5 mr-2" />
                Start New Idea
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Your Ideas ({ideas.length})</h2>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">All Ideas</Button>
                  <Button variant="ghost" size="sm">Validated</Button>
                  <Button variant="ghost" size="sm">Exploring</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
                  <Card key={idea.id} className="bg-gray-900 border-gray-800 hover:border-green-500 transition-colors overflow-hidden group">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl line-clamp-2 group-hover:text-green-400 transition-colors">{idea.title}</CardTitle>
                        <Badge className={getStatusBadge(idea.status).color}>
                          {getStatusBadge(idea.status).text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400 line-clamp-3 mb-4">{idea.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {idea.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Updated {new Date(idea.updated_at).toLocaleDateString()}</span>
                        <Button size="sm" onClick={() => {/* Add view idea functionality */}}>
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}