'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { Map, Calendar, Target, Loader2, CheckCircle } from 'lucide-react';

const RoadmapGenerator = () => {
  const ai = useEnhancedAI();
  const [idea, setIdea] = useState('');
  const [timeframe, setTimeframe] = useState('6 months');
  const [roadmap, setRoadmap] = useState<unknown>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    try {
      const result = await ai.generateRoadmap(idea, timeframe);
      setRoadmap(result);
    } catch (error) {
      console.error('Error generating roadmap:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Map className="h-8 w-8 text-orange-500" />
          AI Roadmap Generator
        </h1>
        <p className="text-muted-foreground">
          Generate detailed development roadmaps for your startup ideas
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Roadmap</CardTitle>
          <CardDescription>
            Describe your startup idea and get a structured development roadmap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe your startup idea or project..."
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            rows={4}
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Timeframe</label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 months">3 Months</SelectItem>
                  <SelectItem value="6 months">6 Months</SelectItem>
                  <SelectItem value="12 months">12 Months</SelectItem>
                  <SelectItem value="18 months">18 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerate} 
                disabled={ai.isLoading || !idea.trim()}
              >
                {ai.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Map className="h-4 w-4 mr-2" />
                    Generate Roadmap
                  </>
                )}
              </Button>
            </div>
          </div>

          {ai.error && (
            <div className="text-red-500 text-sm">{ai.error}</div>
          )}
        </CardContent>
      </Card>

      {(roadmap as any) && (
        <div className="space-y-6">
          {/* Phases */}
          {(roadmap as any).phases && (roadmap as any).phases.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Development Phases
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {(roadmap as { phases: { title: string; tasks: string[] }[] }).phases.map((phase: { title: string; tasks: string[] }, index: number) => (
                    <div key={index} className="border-l-4 border-orange-500 pl-4">
                      <h3 className="font-semibold text-lg mb-2">{phase.title}</h3>
                      <div className="space-y-2">
                        {phase.tasks.map((task: string, taskIndex: number) => (
                          <div key={taskIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          {(roadmap as any).metrics && (roadmap as any).metrics.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {(roadmap as any).metrics.map((metric: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {metric}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resources Needed */}
          {(roadmap as any).resources && (roadmap as any).resources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resources Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(roadmap as any).resources.map((resource: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{resource}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!roadmap && (
        <Card>
          <CardContent className="text-center py-12">
            <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Enter your startup idea above to generate a detailed roadmap
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoadmapGenerator;
