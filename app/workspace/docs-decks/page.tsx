"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Presentation,
  FileSpreadsheet,
  FilePieChart,
  Eye,
  Edit,
  Share,
  Download,
  Users,
  BarChart3,
  Sparkles,
  Video,
  MessageSquare,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  Wand2,
  Grid,
  List,
  TrendingUp,
  Menu
} from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Document {
  id: string;
  title: string;
  description: string;
  type: 'presentation' | 'document' | 'pitch_deck';
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'shared';
}

interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function DocsDecksPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("presentations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollaborationModalOpen, setIsCollaborationModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isAIAssistantModalOpen, setIsAIAssistantModalOpen] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data
  const [presentations, setPresentations] = useState<Document[]>([]);
  const [pitchDecks, setPitchDecks] = useState<Document[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const templates: Template[] = [
    {
      id: 1,
      name: "Investor Deck",
      description: "Standard 10-12 slide investor pitch",
      category: "Pitch Deck",
      icon: Presentation
    },
    {
      id: 2,
      name: "Executive Summary",
      description: "One-page business overview",
      category: "Document",
      icon: FileText
    },
    {
      id: 3,
      name: "Financial Model",
      description: "Basic startup financial projection",
      category: "Spreadsheet",
      icon: FileSpreadsheet
    },
    {
      id: 4,
      name: "Market Analysis",
      description: "Industry research template",
      category: "Research",
      icon: FilePieChart
    }
  ];

  // Mock data initialization
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockPresentations: Document[] = [
        {
          id: "1",
          title: "AI Fitness Coach Pitch",
          description: "Investor presentation for AI-powered fitness coaching app",
          type: "presentation",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "draft"
        },
        {
          id: "2",
          title: "Market Research Deck",
          description: "Comprehensive market analysis for fitness tech industry",
          type: "presentation",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "published"
        }
      ];

      const mockDocuments: Document[] = [
        {
          id: "3",
          title: "Business Plan",
          description: "Detailed business plan document",
          type: "document",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "draft"
        }
      ];

      const mockPitchDecks: Document[] = [
        {
          id: "4",
          title: "Series A Pitch Deck",
          description: "Funding presentation for Series A round",
          type: "pitch_deck",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: "shared"
        }
      ];

      setPresentations(mockPresentations);
      setDocuments(mockDocuments);
      setPitchDecks(mockPitchDecks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateDocument = async (data: { title: string; description: string; type: string }) => {
    try {
      const newDoc: Document = {
        id: Date.now().toString(),
        title: data.title,
        description: data.description,
        type: data.type as Document['type'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: "draft"
      };

      if (data.type === "presentation") {
        setPresentations(prev => [newDoc, ...prev]);
      } else if (data.type === "pitch_deck") {
        setPitchDecks(prev => [newDoc, ...prev]);
      } else {
        setDocuments(prev => [newDoc, ...prev]);
      }

      toast({
        title: "Document Created!",
        description: `"${data.title}" has been created successfully.`,
      });

      setIsModalOpen(false);
      
      // Navigate to editor (mock)
      router.push(`/workspace/docs-decks/editor/${newDoc.id}`);
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTemplateSelect = (template: Template) => {
    toast({
      title: "Template Selected",
      description: `Creating new ${template.category.toLowerCase()} from ${template.name} template.`,
    });
    setIsModalOpen(true);
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-600/20 text-gray-400';
      case 'published': return 'bg-green-600/20 text-green-400';
      case 'shared': return 'bg-blue-600/20 text-blue-400';
      default: return 'bg-gray-600/20 text-gray-400';
    }
  };

  const renderDocumentCard = (doc: Document) => (
    <Card key={doc.id} className="workspace-card cursor-pointer hover:border-green-500/30 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {doc.type === 'presentation' && <Presentation className="h-5 w-5 text-blue-400" />}
            {doc.type === 'document' && <FileText className="h-5 w-5 text-green-400" />}
            {doc.type === 'pitch_deck' && <FilePieChart className="h-5 w-5 text-purple-400" />}
            <CardTitle className="text-lg text-white">{doc.title}</CardTitle>
          </div>
          <Badge className={getStatusColor(doc.status)}>
            {doc.status}
          </Badge>
        </div>
        <p className="text-gray-400 text-sm">{doc.description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Updated {new Date(doc.updated_at).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedDocument(doc);
                setIsAnalyticsModalOpen(true);
              }}
              className="text-gray-400 hover:text-white"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Share Document",
                  description: "Sharing feature coming soon!",
                });
              }}
              className="text-gray-400 hover:text-white"
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/workspace/docs-decks/editor/${doc.id}`);
              }}
              className="text-gray-400 hover:text-white"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderEmptyState = (type: string) => (
    <div className="text-center py-12">
      <div className="p-4 bg-gray-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
        {type === 'presentations' && <Presentation className="h-8 w-8 text-gray-400" />}
        {type === 'documents' && <FileText className="h-8 w-8 text-gray-400" />}
        {type === 'pitch-decks' && <FilePieChart className="h-8 w-8 text-gray-400" />}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No {type} yet</h3>
      <p className="text-gray-400 mb-6">
        Create your first {type.slice(0, -1)} to get started.
      </p>
      <Button
        onClick={() => setIsModalOpen(true)}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create {type.slice(0, -1)}
      </Button>
    </div>
  );

  return (
    <div className="layout-container bg-green-glass">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="layout-main transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className="workspace-nav-enhanced">
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
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAIAssistantModalOpen(true)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  <Wand2 className="h-4 w-4 mr-2" />
                  AI Assistant
                </Button>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="workspace-background min-h-screen">
          <div className="px-6 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">📄 Docs & Decks</h1>
              <p className="text-gray-400 text-lg">
                Create and manage your startup documents and presentations
              </p>
            </div>

            {/* Templates Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Start Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="workspace-card cursor-pointer hover:border-green-500/30 transition-all duration-300"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="p-3 bg-green-600/20 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <template.icon className="h-6 w-6 text-green-400" />
                      </div>
                      <h3 className="font-semibold text-white mb-2">{template.name}</h3>
                      <p className="text-gray-400 text-sm mb-3">{template.description}</p>
                      <Badge variant="outline" className="border-gray-600 text-gray-400">
                        {template.category}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-black/40 border border-white/10">
                  <TabsTrigger
                    value="presentations"
                    className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                  >
                    <Presentation className="h-4 w-4 mr-2" />
                    Presentations ({presentations.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documents ({documents.length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="pitch-decks"
                    className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400"
                  >
                    <FilePieChart className="h-4 w-4 mr-2" />
                    Pitch Decks ({pitchDecks.length})
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    className="text-gray-400 hover:text-white"
                  >
                    {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <TabsContent value="presentations" className="space-y-6">
                <div className="workspace-card p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : presentations.length === 0 ? (
                    renderEmptyState("presentations")
                  ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {presentations.map(renderDocumentCard)}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <div className="workspace-card p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : documents.length === 0 ? (
                    renderEmptyState("documents")
                  ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {documents.map(renderDocumentCard)}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="pitch-decks" className="space-y-6">
                <div className="workspace-card p-6">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : pitchDecks.length === 0 ? (
                    renderEmptyState("pitch-decks")
                  ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                      {pitchDecks.map(renderDocumentCard)}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Create Document Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-green-400" />
                Create New Document
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter document title..."
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Brief description..."
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <div>
                <Label htmlFor="type">Document Type</Label>
                <Select defaultValue="presentation">
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-white/10">
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="pitch_deck">Pitch Deck</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => handleCreateDocument({
                  title: "New Document",
                  description: "Sample description",
                  type: "presentation"
                })}
                className="bg-green-600 hover:bg-green-700"
              >
                Create Document
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Analytics Modal */}
        <Dialog open={isAnalyticsModalOpen} onOpenChange={setIsAnalyticsModalOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Document Analytics
              </DialogTitle>
            </DialogHeader>

            {selectedDocument && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{selectedDocument.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">127</div>
                      <div className="text-sm text-gray-400">Total Views</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">89</div>
                      <div className="text-sm text-gray-400">Unique Viewers</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-400">4:32</div>
                      <div className="text-sm text-gray-400">Avg. Time Spent</div>
                    </div>
                    <div className="bg-black/40 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">78%</div>
                      <div className="text-sm text-gray-400">Completion Rate</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Engagement Over Time</h4>
                    <div className="bg-black/40 rounded-lg p-4 h-48 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <TrendingUp className="h-8 w-8 mx-auto mb-2" />
                        <p>Chart visualization would go here</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg p-3">
                        <Eye className="h-4 w-4 text-green-400" />
                        <div className="text-sm">Viewed by investor@fund.com</div>
                        <div className="text-xs text-gray-400 ml-auto">2 hours ago</div>
                      </div>
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg p-3">
                        <Share className="h-4 w-4 text-blue-400" />
                        <div className="text-sm">Shared with team</div>
                        <div className="text-xs text-gray-400 ml-auto">Yesterday</div>
                      </div>
                      <div className="flex items-center gap-3 bg-black/40 rounded-lg p-3">
                        <Edit className="h-4 w-4 text-yellow-400" />
                        <div className="text-sm">Last edited by you</div>
                        <div className="text-xs text-gray-400 ml-auto">2 days ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAnalyticsModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Report Exported",
                  description: "Analytics report has been downloaded.",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AI Assistant Modal */}
        <Dialog open={isAIAssistantModalOpen} onOpenChange={setIsAIAssistantModalOpen}>
          <DialogContent className="bg-black/90 backdrop-blur-xl border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-green-400" />
                AI Writing Assistant
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-gray-400">
                Get AI-powered help with writing, formatting, and improving your documents.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start h-auto p-4"
                  onClick={() => {
                    toast({
                      title: "AI Feature",
                      description: "Content generation coming soon!",
                    });
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">Generate Content</div>
                    <div className="text-sm text-gray-400">Create sections automatically</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800 justify-start h-auto p-4"
                  onClick={() => {
                    toast({
                      title: "AI Feature",
                      description: "Content improvement coming soon!",
                    });
                  }}
                >
                  <div className="text-left">
                    <div className="font-medium">Improve Writing</div>
                    <div className="text-sm text-gray-400">Enhance clarity and tone</div>
                  </div>
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAIAssistantModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
