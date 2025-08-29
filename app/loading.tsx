"use client"

import { Brain } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show minimal loading during hydration
  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-green-950">
      <div className="text-center space-y-4 workspace-card p-8">
        <div className="flex items-center justify-center">
          <div className="p-4 bg-green-600/20 rounded-full animate-pulse border border-green-500/30">
            <Brain className="h-12 w-12 text-green-400 animate-bounce" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">Loading MVP Studio</h2>
          <p className="text-gray-400">Preparing your AI-powered build orchestrator...</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
        </div>
      </div>
    </div>
  )
}
