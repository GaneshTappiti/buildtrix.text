// Test component to verify BMC feature functionality
"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { BMC_BLOCK_CONFIGS } from "@/types/businessModelCanvas";

export default function TestBMCFeature() {
  const testAPIConnection = async () => {
    try {
      console.log('Testing BMC API connection...');
      
      const testRequest = {
        appIdea: "A mobile app that helps students track their daily study habits and collaborate with peers through group challenges",
        industry: "EdTech",
        targetMarket: "Students",
        businessType: "b2c" as const
      };

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'business-model-canvas',
          prompt: JSON.stringify(testRequest)
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        console.log('✅ BMC generation successful!');
        console.log('Canvas ID:', data.data.canvas.id);
        console.log('Number of blocks:', Object.keys(data.data.canvas.blocks).length);
      } else {
        console.log('❌ BMC generation failed:', data.error);
      }
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  };

  const testBlockConfigs = () => {
    console.log('Testing BMC block configurations...');
    console.log('Number of block configs:', BMC_BLOCK_CONFIGS.length);
    
    BMC_BLOCK_CONFIGS.forEach((config, index) => {
      console.log(`${index + 1}. ${config.title} (${config.id})`);
      console.log(`   Icon: ${config.icon}`);
      console.log(`   Color: ${config.color}`);
      console.log(`   Examples: ${config.examples.length}`);
    });
    
    console.log('✅ Block configurations test complete!');
  };

  const testLocalStorage = () => {
    console.log('Testing localStorage functionality...');
    
    const testCanvas = {
      id: 'test-canvas',
      appIdea: 'Test idea',
      createdAt: new Date(),
      updatedAt: new Date(),
      blocks: {},
      metadata: {}
    };
    
    try {
      localStorage.setItem('bmc-test', JSON.stringify(testCanvas));
      const retrieved = localStorage.getItem('bmc-test');
      
      if (retrieved) {
        const parsed = JSON.parse(retrieved);
        console.log('✅ localStorage test successful!');
        console.log('Stored and retrieved canvas ID:', parsed.id);
        localStorage.removeItem('bmc-test');
      } else {
        console.log('❌ localStorage test failed - no data retrieved');
      }
    } catch (error) {
      console.error('❌ localStorage test failed:', error);
    }
  };

  return (
    <div className="p-8 space-y-6 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold">BMC Feature Test Suite</h1>
      
      <div className="space-y-4">
        <Button onClick={testBlockConfigs} className="bg-blue-600 hover:bg-blue-700">
          Test Block Configurations
        </Button>
        
        <Button onClick={testLocalStorage} className="bg-green-600 hover:bg-green-700">
          Test LocalStorage
        </Button>
        
        <Button onClick={testAPIConnection} className="bg-purple-600 hover:bg-purple-700">
          Test API Connection
        </Button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Open browser developer console (F12)</li>
          <li>Click each test button above</li>
          <li>Check console output for test results</li>
          <li>All tests should show ✅ for success</li>
        </ol>
      </div>
      
      <div className="mt-4 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Feature Status:</h2>
        <ul className="space-y-1 text-sm">
          <li>✅ TypeScript interfaces defined</li>
          <li>✅ UI components created</li>
          <li>✅ AI service integration</li>
          <li>✅ Error handling implemented</li>
          <li>✅ LocalStorage persistence</li>
          <li>✅ Export functionality</li>
          <li>✅ Responsive design</li>
          <li>✅ Navigation integration</li>
        </ul>
      </div>
    </div>
  );
}
