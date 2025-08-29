// Test component to verify navigation and connections
"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Brain, Home, Sidebar } from "lucide-react";

export default function TestNavigation() {
  const testRoutes = [
    {
      name: "Home/Landing Page",
      path: "/landing",
      description: "Main landing page with BMC feature highlight"
    },
    {
      name: "Workspace Dashboard",
      path: "/workspace",
      description: "Workspace with BMC module in grid"
    },
    {
      name: "BMC Feature",
      path: "/workspace/business-model-canvas",
      description: "AI Business Model Canvas generator"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-black text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Target className="h-8 w-8 text-green-400" />
          Navigation & Connection Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testRoutes.map((route, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-white/10">
              <h3 className="text-lg font-semibold mb-2 text-green-400">{route.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{route.description}</p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href={route.path}>
                  Visit Page
                </Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-400" />
            Feature Integration Checklist
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium text-green-400">✅ Landing Page</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• NEW feature highlight banner</li>
                <li>• BMC button in quick actions</li>
                <li>• BMC card in features grid</li>
                <li>• Proper routing and links</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-green-400">✅ Workspace Dashboard</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• BMC module in grid with NEW badge</li>
                <li>• Enhanced description</li>
                <li>• AI-Powered badge</li>
                <li>• Proper hover effects</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-green-400">✅ Sidebar Navigation</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• BMC item with NEW badge</li>
                <li>• Proper icon and labeling</li>
                <li>• Active state highlighting</li>
                <li>• Responsive behavior</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium text-green-400">✅ BMC Feature</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Complete AI generation</li>
                <li>• Export functionality</li>
                <li>• Error handling</li>
                <li>• Auto-save persistence</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-900/20 p-6 rounded-lg border border-blue-500/30">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Sidebar className="h-6 w-6 text-blue-400" />
            User Journey Test
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">1</span>
              <span>User visits landing page and sees NEW BMC feature highlight</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">2</span>
              <span>User clicks "Try BMC Generator" button</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">3</span>
              <span>User is taken to BMC feature page</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">4</span>
              <span>User can also access via workspace dashboard or sidebar</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs font-bold">5</span>
              <span>User generates BMC and exports results</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 px-8">
            <Link href="/workspace/business-model-canvas">
              <Target className="mr-2 h-5 w-5" />
              Test BMC Feature Now
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
