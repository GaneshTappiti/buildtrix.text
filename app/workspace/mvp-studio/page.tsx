"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import WorkspaceSidebar, { SidebarToggle } from "@/components/WorkspaceSidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SixStageArchitecture } from "@/components/builder-cards/SixStageArchitecture";
import { BuilderProvider } from "@/lib/builderContext";
import SimpleMVPWizard from "@/components/mvp-studio/SimpleMVPWizard";
import {
  Sparkles,
  Zap,
  Brain,
  ExternalLink,
  Layers,
  Target,
  ArrowLeft,
  CheckCircle,
  Clock,
  Play,
  Settings
} from "lucide-react";

export default function MVPStudioPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <BuilderProvider>
      <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
        <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        {/* Main content */}
        <main className="layout-main transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarToggle onClick={() => setSidebarOpen(true)} />
                <Link
                  href="/workspace"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Workspace</span>
                </Link>
                <div className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-green-400" />
                  <h1 className="text-xl font-bold text-white">MVP Studio</h1>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsWizardOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium px-4 py-2"
                  size="sm"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  RAG-Enhanced Wizard
                </Button>
                <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/40">
                  BETA
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 workspace-content-spacing">
          {/* SixStageArchitecture Component */}
          <SixStageArchitecture
            showOverview={true}
            onStartBuilder={() => router.push('/workspace/mvp-studio/builder')}
          />

        </div>

        {/* Bottom Section - Quick Actions and Features */}
        <div className="px-6 py-12 bg-black/40 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-4xl mx-auto">


            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-effect-theme p-6 rounded-lg text-center hover:bg-white/5 transition-colors">
                <Layers className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">🧱 Builder Cards</h3>
                <p className="text-gray-400 text-sm">Interactive builder recommendations</p>
              </div>
              <div className="glass-effect-theme p-6 rounded-lg text-center hover:bg-white/5 transition-colors">
                <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">� MVP Templates</h3>
                <p className="text-gray-400 text-sm">Pre-built project templates</p>
              </div>
              <div className="glass-effect-theme p-6 rounded-lg text-center hover:bg-white/5 transition-colors">
                <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">🛠️ AI Tools Hub</h3>
                <p className="text-gray-400 text-sm">Comprehensive tool directory</p>
              </div>
            </div>

            {/* RAG Wizard Card */}
            <div className="mt-8 max-w-2xl mx-auto">
              <div className="glass-effect-theme p-6 rounded-lg text-center hover:bg-white/5 transition-colors cursor-pointer border border-purple-500/30" onClick={() => setIsWizardOpen(true)}>
                <Brain className="h-10 w-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">🧠 RAG-Enhanced Wizard</h3>
                <p className="text-gray-300 mb-4">Experience our advanced AI wizard with Retrieval-Augmented Generation for tool-specific, context-aware prompt generation.</p>
                <div className="flex justify-center gap-2 text-sm text-gray-400">
                  <span className="bg-purple-500/20 px-2 py-1 rounded">Tool-Specific</span>
                  <span className="bg-blue-500/20 px-2 py-1 rounded">Context-Aware</span>
                  <span className="bg-green-500/20 px-2 py-1 rounded">Enhanced Prompts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* RAG-Enhanced MVP Wizard */}
      <SimpleMVPWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={(result) => {
          console.log('RAG-Enhanced MVP Wizard completed:', result);
          setIsWizardOpen(false);
          // You can add additional logic here to handle the result
        }}
      />

      </div>
    </BuilderProvider>
  );
}
