"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

export default function WorkspacePage() {
  console.log("🔥 Simple WorkspacePage component started rendering");
  
  const [count, setCount] = useState(0);
  
  console.log("🔥 About to render with count:", count);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-white p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-green-400 mb-8">Workspace (Simplified)</h1>
        <p className="text-gray-300 mb-4">
          This is a simplified workspace page to test rendering.
        </p>
        <div className="space-y-4">
          <div className="p-4 bg-black/30 border border-green-500/20 rounded-lg">
            <h2 className="text-xl font-semibold text-green-300 mb-2">Test Counter</h2>
            <p className="text-gray-400 mb-4">Count: {count}</p>
            <Button 
              onClick={() => {
                console.log("Button clicked, incrementing count");
                setCount(c => c + 1);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              Increment ({count})
            </Button>
          </div>
          <div className="p-4 bg-black/30 border border-blue-500/20 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-300">Status</h3>
            <p className="text-gray-400">If you can see this and interact with the button, React is working correctly.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
