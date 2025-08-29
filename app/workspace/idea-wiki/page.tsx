"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, PlusCircle, BookOpen, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";

const IdeaWikiPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  const handleCreatePage = () => {
    // Navigate to create new wiki page
    router.push("/workspace/idea-wiki/new");
  };

  const handleBackToWorkspace = () => {
    router.push("/workspace");
  };

  return (
    <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="flex-1 transition-all duration-300">
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
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <button
                  onClick={handleBackToWorkspace}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Workspace</span>
                </button>
              </div>
              <Button
                onClick={handleCreatePage}
                className="bg-green-600 hover:bg-green-700"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">Idea Wiki</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Document and organize your knowledge base
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            {/* IdeaWiki main content */}
            <div className="text-center text-white">
              <h1 className="text-2xl font-bold mb-4">Idea Wiki</h1>
              <p className="text-gray-400">Your knowledge base for startup ideas and insights.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IdeaWikiPage;
