"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Save, ChevronLeft, Menu } from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";

const WikiPageEditorPage = () => {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const pageId = params.pageId as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("Example Wiki Page");
  const [content, setContent] = useState("This is a placeholder for the actual content of the wiki page.");

  const handleSave = () => {
    // Save functionality would go here
    toast({
      title: "Page Saved",
      description: "Your wiki page has been saved successfully.",
    });
    
    // Navigate back to view page
    router.push(`/workspace/idea-wiki/${pageId}`);
  };

  const handleCancel = () => {
    router.push(`/workspace/idea-wiki/${pageId}`);
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
            <Link 
              href="/workspace/idea-wiki" 
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-white/10 hover:text-white text-gray-400 h-10 px-4 py-2 mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold flex-grow text-white">Edit Wiki Page</h1>
          </header>
          
          <div className="space-y-4">
            <Input
              placeholder="Page title..."
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-lg focus:border-green-400 focus:ring-green-400/20"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <Textarea
              placeholder="Enter your wiki content here..."
              className="w-full h-64 bg-white/5 border-white/10 text-white placeholder:text-gray-400 rounded-lg focus:border-green-400 focus:ring-green-400/20 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WikiPageEditorPage;
