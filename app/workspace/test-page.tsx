"use client";

import React from "react";

export default function TestWorkspacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-green-400 mb-8">Test Workspace</h1>
        <p className="text-gray-300">
          This is a simplified test page to verify rendering works.
        </p>
        <div className="mt-8 p-4 bg-black/30 border border-green-500/20 rounded-lg">
          <h2 className="text-xl font-semibold text-green-300 mb-4">Test Card</h2>
          <p className="text-gray-400">
            If you can see this, the basic rendering is working.
          </p>
        </div>
      </div>
    </div>
  );
}
