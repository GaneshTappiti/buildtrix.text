"use client"

import { useState } from 'react';
import { formatDisplayDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  History, 
  Calendar, 
  Globe, 
  Smartphone, 
  Palette, 
  Briefcase, 
  Heart,
  Trash2,
  Edit3,
  Download,
  CheckCircle,
  Clock,
  Plus
} from "lucide-react";
import { useBuilder, builderActions, ProjectHistory as ProjectHistoryType } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";

const designStyleIcons = {
  minimal: Palette,
  playful: Heart,
  business: Briefcase
};

const designStyleColors = {
  minimal: 'from-gray-500 to-slate-600',
  playful: 'from-pink-500 to-purple-600',
  business: 'from-blue-500 to-indigo-600'
};

export function ProjectHistory() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoadProject = (projectId: string) => {
    dispatch(builderActions.loadProject(projectId));
    setIsOpen(false);
    toast({
      title: "Project Loaded",
      description: "Your project has been loaded successfully.",
    });
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    dispatch(builderActions.deleteProject(projectId));
    toast({
      title: "Project Deleted",
      description: `"${projectName}" has been deleted from your history.`,
    });
  };

  const handleNewProject = () => {
    dispatch(builderActions.resetState());
    setIsOpen(false);
    toast({
      title: "New Project Started",
      description: "Ready to create your next app!",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return formatDisplayDate(date);
  };

  const getCompletionStatus = (project: ProjectHistoryType) => {
    if (project.isCompleted) {
      return { icon: CheckCircle, text: 'Completed', color: 'text-green-500' };
    }
    return { icon: Clock, text: `Stage ${project.completedStages}/6`, color: 'text-orange-500' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Project History
          {state.projectHistory.length > 0 && (
            <Badge variant="secondary" className="ml-1">
              {state.projectHistory.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Project History
          </DialogTitle>
          <DialogDescription>
            Manage your saved projects and continue where you left off
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* New Project Button */}
          <Card className="border-2 border-dashed border-primary/30 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <Button 
                onClick={handleNewProject}
                className="w-full h-20 flex flex-col items-center gap-2 bg-gradient-to-r from-primary to-primary/80"
              >
                <Plus className="h-6 w-6" />
                <span className="text-lg font-medium">Start New Project</span>
              </Button>
            </CardContent>
          </Card>

          {/* Project List */}
          {state.projectHistory.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Projects Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start building your first app to see it appear in your history
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.projectHistory.map((project) => {
                const DesignIcon = designStyleIcons[project.designStyle];
                const status = getCompletionStatus(project);
                const StatusIcon = status.icon;
                const isCurrentProject = state.currentProjectId === project.id;

                return (
                  <Card 
                    key={project.id} 
                    className={`transition-all duration-200 hover:shadow-md ${
                      isCurrentProject ? 'ring-2 ring-primary shadow-lg' : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${designStyleColors[project.designStyle]} flex items-center justify-center shadow-sm`}>
                            <DesignIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-base truncate">
                              {project.appName}
                              {isCurrentProject && (
                                <Badge variant="default" className="ml-2 text-xs">Current</Badge>
                              )}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusIcon className={`h-3 w-3 ${status.color}`} />
                              <span className={`text-xs ${status.color}`}>{status.text}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {/* Platform badges */}
                      <div className="flex items-center gap-2 mb-3">
                        {project.platforms.map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs">
                            {platform === 'web' ? (
                              <><Globe className="h-3 w-3 mr-1" />Web</>
                            ) : (
                              <><Smartphone className="h-3 w-3 mr-1" />Mobile</>
                            )}
                          </Badge>
                        ))}
                        <Badge variant="secondary" className="text-xs capitalize">
                          {project.designStyle}
                        </Badge>
                      </div>

                      {/* Date info */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar className="h-3 w-3" />
                        <span>Modified {formatDate(project.dateModified)}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleLoadProject(project.id)}
                          size="sm"
                          className="flex-1"
                          variant={isCurrentProject ? "secondary" : "default"}
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          {isCurrentProject ? 'Continue' : 'Load'}
                        </Button>
                        
                        {project.isCompleted && (
                          <Button
                            onClick={() => {
                              // TODO: Implement export functionality
                              toast({
                                title: "Export Feature",
                                description: "Export functionality coming soon!",
                              });
                            }}
                            size="sm"
                            variant="outline"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        )}

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{project.appName}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteProject(project.id, project.appName)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
