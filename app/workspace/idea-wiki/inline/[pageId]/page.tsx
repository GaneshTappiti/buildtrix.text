"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Edit2, Save, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";

const InlineWikiPagePage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageId = params.pageId as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    "# Getting Started Guide\n\n" +
    "Welcome to your startup's knowledge base! This guide will help you get started with documenting your ideas, processes, and learnings.\n\n" +
    "## Key Features\n\n" +
    "- Create and organize pages\n" +
    "- Collaborate with team members\n" +
    "- Track changes and versions\n" +
    "- Search across all content\n\n" +
    "## Getting Started\n\n" +
    "1. Create your first page\n" +
    "2. Add content using markdown\n" +
    "3. Organize with categories\n" +
    "4. Share with your team"
  );

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Page Saved",
      description: "Your changes have been saved successfully.",
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-0 transition-all duration-300">
        {/* Top navigation with hamburger menu */}
        <div className="flex items-center gap-4 mb-6 w-full max-w-3xl mx-auto">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-black/30"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <div className="flex-1">
            {/* Page-specific navigation can go here */}
          </div>
        </div>
        
        <div className="w-full max-w-3xl mx-auto bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 p-8 flex flex-col">
          <header className="mb-6 flex items-center gap-2">
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              className="mr-2 text-gray-400 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="text-2xl font-bold flex-grow text-white">Wiki Page</h1>
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
              >
                <Edit2 className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
          </header>
          
          {isEditing ? (
            <>
              <Textarea
                className="w-full h-64 mb-4 bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-lg focus:border-green-400 focus:ring-green-400/20 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-1" /> Save
                </Button>
              </div>
            </>
          ) : (
            <pre className="whitespace-pre-wrap text-white bg-transparent mb-4">{content}</pre>
          )}
        </div>
      </main>
    </div>
  );
};

export default InlineWikiPagePage;
