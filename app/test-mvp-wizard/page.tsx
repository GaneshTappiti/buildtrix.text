"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import MVPWizard from "../../new pages/components/mvp-studio/MVPWizard";
import { MVPAnalysisResult } from "@/types/ideaforge";

export default function TestMVPWizardPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const handleComplete = (result: MVPAnalysisResult) => {
    console.log('MVP Wizard completed:', result);
    setIsWizardOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center p-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-black/20 backdrop-blur-xl mb-6">
            <Sparkles className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">MVP Wizard Test Page</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            MVP Wizard with Tool Selection
          </h1>
          
          <p className="text-xl text-gray-300 mb-8">
            Test the standalone MVPWizard component that includes the tool selection feature in Stage 2
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">5 Steps</div>
            <div className="text-sm text-gray-400">Complete wizard flow</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">15+ Tools</div>
            <div className="text-sm text-gray-400">Including Lovable, Bolt, Cursor</div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-lg">
            <div className="text-2xl font-bold text-green-400 mb-1">Stage 2</div>
            <div className="text-sm text-gray-400">Tool selection feature</div>
          </div>
        </div>

        {/* Open Wizard Button */}
        <Button
          onClick={() => setIsWizardOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg"
          size="lg"
        >
          <Brain className="mr-2 h-5 w-5" />
          Open MVP Wizard
        </Button>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-left">
          <h3 className="font-medium text-blue-300 mb-2">📋 Instructions:</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Click "Open MVP Wizard" above</li>
            <li>Fill out Step 1 (Project Foundation)</li>
            <li>Navigate to Step 2 (Visual Identity & Tool Selection)</li>
            <li>You'll see the tool selection feature with 15+ tools</li>
            <li>Tools like Lovable, Bolt, Cursor will be recommended based on your app type</li>
          </ol>
        </div>
      </div>

      {/* MVP Wizard Dialog */}
      <MVPWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleComplete}
      />
    </div>
  );
}
