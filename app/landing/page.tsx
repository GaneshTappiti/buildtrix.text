"use client"

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  Zap,
  Brain,
  ExternalLink,
  Layers,
  Target
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950">
      {/* Hero Section */}
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-black/20 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">AI-Powered Build Orchestrator</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            MVP Studio
          </h1>

          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Your AI-powered build orchestrator. Generate prompts, get tool recommendations, and build your MVP with the best AI builders in the market.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">AI-Generated Prompts</div>
              <div className="text-sm text-gray-400">Tailored for each builder</div>
            </div>
            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">14+ Tools</div>
              <div className="text-sm text-gray-400">Supported platforms</div>
            </div>
            <div className="glass-effect p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">Export Ready</div>
              <div className="text-sm text-gray-400">Copy & paste prompts</div>
            </div>
          </div>

          {/* NEW FEATURE HIGHLIGHT */}
          <div className="glass-effect p-6 rounded-xl border border-green-500/30 mb-12 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full">
              NEW
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                  <Target className="h-8 w-8 text-green-400" />
                  <h3 className="text-2xl font-bold text-white">AI Business Model Canvas</h3>
                </div>
                <p className="text-gray-300 mb-4">
                  Transform your app idea into a complete, professional Business Model Canvas with AI.
                  Generate expert-level strategic insights across all 9 essential blocks in seconds.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded border border-blue-500/30">
                    AI-Powered
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded border border-purple-500/30">
                    Export Ready
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded border border-yellow-500/30">
                    Investor Ready
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-6 py-3">
                  <Link href="/workspace/business-model-canvas">
                    <Target className="mr-2 h-4 w-4" />
                    Try BMC Generator
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/workspace/mvp-studio">
                <Brain className="mr-2 h-4 w-4" />
                Start MVP Studio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10 text-white">
              <Layers className="mr-2 h-4 w-4" />
              Builder Cards
            </Button>
            <Button asChild variant="outline" className="border-green-500/30 hover:bg-green-500/10 text-white">
              <Link href="/workspace/business-model-canvas">
                <Target className="mr-2 h-4 w-4" />
                BMC Generator
              </Link>
            </Button>
            <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10 text-white">
              <Layers className="mr-2 h-4 w-4" />
              Browse Templates
            </Button>
            <Button variant="outline" className="border-green-500/30 hover:bg-green-500/10 text-white">
              <Zap className="mr-2 h-4 w-4" />
              Browse AI Tools
            </Button>
          </div>

          <div className="glass-effect p-4 rounded-lg mb-8">
            <p className="text-gray-300 mb-2">Want to see the converted React Router landing page?</p>
            <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/10 text-blue-300">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Landing Page Demo
            </Button>
          </div>

          {/* Builder Blueprint AI Section */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="glass-effect p-6 rounded-lg text-center border border-green-500/20 relative">
                <div className="absolute -top-2 -right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                  NEW
                </div>
                <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">🎯 BMC Generator</h3>
                <p className="text-gray-400 text-sm">AI-powered Business Model Canvas</p>
              </div>
              <div className="glass-effect p-6 rounded-lg text-center">
                <Layers className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">🧱 Builder Cards</h3>
                <p className="text-gray-400 text-sm">Interactive builder recommendations</p>
              </div>
              <div className="glass-effect p-6 rounded-lg text-center">
                <Brain className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">📋 MVP Templates</h3>
                <p className="text-gray-400 text-sm">Pre-built project templates</p>
              </div>
              <div className="glass-effect p-6 rounded-lg text-center">
                <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">🛠️ AI Tools Hub</h3>
                <p className="text-gray-400 text-sm">Comprehensive tool directory</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="glass-effect p-8 rounded-xl text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Brain className="h-6 w-6 text-green-400" />
                <h2 className="text-2xl font-bold text-white">🧱 Builder Blueprint AI</h2>
              </div>
              <p className="text-gray-300 mb-8">Transform your app idea into AI-ready prompts for any builder platform</p>

              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
                <Link href="/workspace/mvp-studio">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
