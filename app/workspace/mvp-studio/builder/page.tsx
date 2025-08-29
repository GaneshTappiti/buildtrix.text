"use client"

import React from 'react';
import WorkspaceSidebar, { SidebarToggle } from "@/components/WorkspaceSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SixStageArchitecture } from "@/components/builder-cards/SixStageArchitecture";
import { BuilderProvider } from "@/lib/builderContext";
import { useState } from "react";
import { ArrowLeft, Brain, Sparkles, Menu } from "lucide-react";
import Link from "next/link";

export default function BuilderPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BuilderProvider>
      <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
        <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <main className="layout-main transition-all duration-300">
          {/* Top Navigation Bar */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <SidebarToggle onClick={() => setSidebarOpen(true)} />
                  <Link
                    href="/workspace/mvp-studio"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to MVP Studio</span>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-green-400" />
                    <h1 className="text-xl font-bold text-white">Builder Blueprint AI</h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-green-600/40">
                    <Sparkles className="w-3 h-3 mr-1" />
                    6-Stage Architecture
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-6 py-8">
            <div className="max-w-7xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-black/20 backdrop-blur-xl mb-6">
                  <Sparkles className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white">AI-Powered Build Orchestrator</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
                  Builder Blueprint AI
                </h1>
                
                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Transform your app idea into AI-ready prompts through our systematic 6-stage modular architecture. 
                  Each stage builds upon the previous one to create comprehensive prompts for any AI builder platform.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-effect-theme p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">6 Stages</div>
                    <div className="text-sm text-gray-400">Systematic approach</div>
                  </div>
                  <div className="glass-effect-theme p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">AI-Generated</div>
                    <div className="text-sm text-gray-400">Smart prompts</div>
                  </div>
                  <div className="glass-effect-theme p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">Export Ready</div>
                    <div className="text-sm text-gray-400">Copy & paste</div>
                  </div>
                </div>
              </div>

              {/* 6-Stage Architecture Component */}
              <div className="workspace-card-solid p-6 sm:p-8 lg:p-10">
                <SixStageArchitecture showOverview={false} forceBuilderMode={true} />
              </div>

              {/* Additional Information */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-effect-theme p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">How It Works</h3>
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-green-600/20 text-green-400 flex items-center justify-center text-xs font-bold">1</div>
                      <div>
                        <p className="font-medium">Tool-Adaptive Engine</p>
                        <p className="text-gray-400">Input your app idea and preferences</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center text-xs font-bold">2</div>
                      <div>
                        <p className="font-medium">Idea Interpreter</p>
                        <p className="text-gray-400">Validate and refine your concept</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-bold">3</div>
                      <div>
                        <p className="font-medium">App Skeleton Generator</p>
                        <p className="text-gray-400">Generate app structure and blueprint</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect-theme p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3">Supported Platforms</h3>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span>Cursor AI, Bolt.new, v0.dev</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Claude Artifacts, ChatGPT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span>Replit Agent, GitHub Copilot</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                      <span>Windsurf, Lovable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span>And many more...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </BuilderProvider>
  );
}
