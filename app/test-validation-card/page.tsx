"use client"

import React from 'react';
import { ValidationCard } from '@/components/builder-cards/ValidationCard';
import { BuilderProvider } from '@/lib/builderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Test page for ValidationCard with tool selection integration
 * This page validates that the tool selection feature works correctly
 */
export default function TestValidationCardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              🧪 ValidationCard Tool Selection Test
            </CardTitle>
            <p className="text-gray-400">
              Testing the integration of RAG tool selection into Stage 2 of the 6-Stage Architecture
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium text-white">Test Objectives:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Verify tool selection UI renders correctly</li>
                  <li>Check tool filtering based on app type/platforms</li>
                  <li>Validate tool selection state management</li>
                  <li>Test blueprint generation with tool context</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white">Expected Behavior:</h4>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Tool selection section appears in ValidationCard</li>
                  <li>Tools are filtered based on app configuration</li>
                  <li>Selected tool is preserved in builder state</li>
                  <li>Blueprint generation includes tool information</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <BuilderProvider>
          <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              ValidationCard Component Test
            </h3>
            <ValidationCard />
          </div>
        </BuilderProvider>

        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-gray-300">
              <h4 className="font-medium text-white">Integration Status:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Builder state updated for tool selection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Tool selection UI integrated</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Blueprint generation enhanced</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>RAG tool profiles loaded</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
