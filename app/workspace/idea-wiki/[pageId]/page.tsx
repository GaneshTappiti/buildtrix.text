"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, ChevronLeft, Menu } from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";

const WikiPageViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const pageId = params.pageId as string;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // This would be replaced by actual data fetching in a real implementation
  const page = {
    id: pageId,
    title: "Example Wiki Page",
    content: "This is a placeholder for the actual content of the wiki page.",
    updatedAt: new Date().toISOString(),
  };

  const handleEdit = () => {
    router.push(`/workspace/idea-wiki/${pageId}/edit`);
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
            <h1 className="text-2xl font-bold flex-grow text-white">{page.title}</h1>
            <Button
              onClick={handleEdit}
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white hover:text-white"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          </header>
          <pre className="whitespace-pre-wrap text-white bg-transparent mb-4">{page.content}</pre>
        </div>
      </main>
    </div>
  );
};

export default WikiPageViewPage;
