"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Investor {
  name: string;
  company: string;
  position: string;
  location: string;
  focusAreas?: string[];
}

export default function TestInvestorsPage() {
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInvestors = async () => {
      try {
        console.log('Attempting to load investors...');
        const response = await fetch('/data/investors.json');
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded investors:', data.length);
          setInvestors(data);
        } else {
          setError(`Failed to load: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.error('Error loading investors:', err);
        setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadInvestors();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Investor Data Test</h1>
        
        <Card className="bg-black/40 backdrop-blur-sm border-white/10 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Loading Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-gray-300">Loading: {loading ? 'Yes' : 'No'}</p>
              <p className="text-gray-300">Investors Count: {investors.length}</p>
              {error && <p className="text-red-400">Error: {error}</p>}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading investors...</p>
          </div>
        )}

        {!loading && investors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {investors.slice(0, 9).map((investor, index) => (
              <Card key={index} className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white text-sm">{investor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-300">{investor.company}</p>
                    <p className="text-gray-400">{investor.position}</p>
                    <p className="text-gray-400">{investor.location}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {investor.focusAreas?.slice(0, 2).map((area, i) => (
                        <span key={i} className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && investors.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">No investors found</p>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => window.location.href = '/workspace/investor-radar'}
            className="bg-green-600 hover:bg-green-700"
          >
            Go to Investor Radar
          </Button>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-white"
          >
            Reload Test
          </Button>
        </div>
      </div>
    </div>
  );
}
