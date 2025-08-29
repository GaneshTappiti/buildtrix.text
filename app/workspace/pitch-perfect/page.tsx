"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  FileText, 
  Presentation,
  Plus,
  Video,
  Download,
  Edit,
  Copy,
  Share,
  ChevronLeft,
  Presentation as PresentationIcon,
  Menu
} from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";
import { pitchPerfectHelpers } from "@/lib/supabase-connection-helpers";
import { useAuth } from "@/contexts/AuthContext";

export default function PitchPerfectPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("scripts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Database state
  const [scripts, setScripts] = useState<any[]>([]);
  const [decks, setDecks] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);

  // Load data from database
  const loadPitchData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [scriptsResult, decksResult, videosResult] = await Promise.all([
        pitchPerfectHelpers.getPitchScripts(user.id),
        pitchPerfectHelpers.getPitchDecks(user.id),
        pitchPerfectHelpers.getPitchVideos(user.id)
      ]);

      if (scriptsResult.error) throw scriptsResult.error;
      if (decksResult.error) throw decksResult.error;
      if (videosResult.error) throw videosResult.error;

      setScripts(scriptsResult.data || []);
      setDecks(decksResult.data || []);
      setVideos(videosResult.data || []);
    } catch (error) {
      console.error('Error loading pitch data:', error);
      toast({
        title: "Error Loading Data",
        description: "Failed to load your pitch content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      loadPitchData();
    }
  }, [user]);

  const handleDownload = (e: React.MouseEvent, id: number, type: string) => {
    e.stopPropagation();
    toast({
      title: "Download started",
      description: `Downloading ${type}...`,
    });
  };

  const handleShare = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    toast({
      title: "Share link generated",
      description: "Share link has been generated",
    });
  };

  const handleCopy = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`https://app.example.com/share/pitch/${id}`);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleItemClick = (id: number, type: string) => {
    router.push(`/workspace/pitch-perfect/editor/${type}/${id}`);
  };

  const handleNewScript = () => {
    toast({
      title: "New script",
      description: "Creating a new script template",
    });
    router.push(`/workspace/pitch-perfect/editor/script/new`);
  };

  const handleNewDeck = () => {
    toast({
      title: "New deck",
      description: "Creating a new presentation deck",
    });
    router.push(`/workspace/pitch-perfect/editor/deck/new`);
  };

  const handleNewVideo = () => {
    toast({
      title: "Video creator",
      description: "Opening video creation tool",
    });
    router.push(`/workspace/pitch-perfect/editor/video/new`);
  };

  // Mock data for demonstration
  const mockScripts = [
    {
      id: 1,
      title: "Elevator Pitch",
      description: "30-second elevator pitch for investors",
      lastModified: "2 hours ago",
      wordCount: 75
    },
    {
      id: 2,
      title: "Demo Day Presentation",
      description: "5-minute pitch for demo day",
      lastModified: "1 day ago",
      wordCount: 450
    }
  ];

  const mockDecks = [
    {
      id: 1,
      title: "Investor Pitch Deck",
      description: "Series A funding presentation",
      lastModified: "3 hours ago",
      slides: 12
    },
    {
      id: 2,
      title: "Product Demo Deck",
      description: "Customer demonstration slides",
      lastModified: "2 days ago",
      slides: 8
    }
  ];

  const mockVideos = [
    {
      id: 1,
      title: "Founder Introduction",
      description: "Personal introduction video",
      lastModified: "1 week ago",
      duration: "2:30"
    }
  ];

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
                <Link
                  href="/workspace"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Workspace</span>
                </Link>
              </div>
              <Button
                onClick={handleNewScript}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Script
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <PresentationIcon className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Pitch Perfect</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Create compelling pitches, presentations, and scripts
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
          
          <Tabs 
            defaultValue="scripts" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-black/40 backdrop-blur-sm border-white/10">
              <TabsTrigger value="scripts" className="data-[state=active]:bg-green-600">
                <FileText className="h-4 w-4 mr-2" />
                Scripts
              </TabsTrigger>
              <TabsTrigger value="decks" className="data-[state=active]:bg-green-600">
                <Presentation className="h-4 w-4 mr-2" />
                Decks
              </TabsTrigger>
              <TabsTrigger value="videos" className="data-[state=active]:bg-green-600">
                <Video className="h-4 w-4 mr-2" />
                Videos
              </TabsTrigger>
            </TabsList>

            {/* Scripts Tab */}
            <TabsContent value="scripts" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Pitch Scripts</h2>
                <Button onClick={handleNewScript} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Script
                </Button>
              </div>
              
              <div className="grid gap-4">
                {mockScripts.map((script) => (
                  <Card 
                    key={script.id} 
                    className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-green-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleItemClick(script.id, 'script')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-2">{script.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{script.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Modified {script.lastModified}</span>
                            <span>{script.wordCount} words</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/workspace/pitch-perfect/editor/script/${script.id}`);
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit script</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={(e) => handleDownload(e, script.id, 'script')}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={(e) => handleCopy(e, script.id)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Decks Tab */}
            <TabsContent value="decks" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Presentation Decks</h2>
                <Button onClick={handleNewDeck} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Deck
                </Button>
              </div>

              <div className="grid gap-4">
                {mockDecks.map((deck) => (
                  <Card
                    key={deck.id}
                    className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-green-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleItemClick(deck.id, 'deck')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-2">{deck.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{deck.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Modified {deck.lastModified}</span>
                            <span>{deck.slides} slides</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/workspace/pitch-perfect/editor/deck/${deck.id}`);
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit deck</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => handleDownload(e, deck.id, 'deck')}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => handleCopy(e, deck.id)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy link</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Pitch Videos</h2>
                <Button onClick={handleNewVideo} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Video
                </Button>
              </div>

              <div className="grid gap-4">
                {mockVideos.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-black/40 backdrop-blur-sm border-white/10 hover:border-green-500/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleItemClick(video.id, 'video')}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-white mb-2">{video.title}</h3>
                          <p className="text-gray-400 text-sm mb-3">{video.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>Modified {video.lastModified}</span>
                            <span>{video.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/workspace/pitch-perfect/editor/video/${video.id}`);
                                  }}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Edit video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => handleDownload(e, video.id, 'video')}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={(e) => handleShare(e, video.id)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  <Share className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Share video</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {mockVideos.length === 0 && (
                  <div className="text-center py-12">
                    <div className="bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 p-8">
                      <Video className="h-12 w-12 mx-auto mb-4 text-gray-400 opacity-50" />
                      <h3 className="text-lg font-medium text-white mb-2">No videos yet</h3>
                      <p className="text-gray-400 mb-4">
                        Create your first pitch video to get started
                      </p>
                      <Button
                        onClick={handleNewVideo}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
