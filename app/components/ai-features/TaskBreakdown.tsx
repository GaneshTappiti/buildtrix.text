'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useEnhancedAI } from '@/hooks/useEnhancedAI';
import { CheckSquare, Clock, AlertTriangle, Target, Loader2 } from 'lucide-react';

const TaskBreakdown = () => {
  const ai = useEnhancedAI();
  const [feature, setFeature] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('medium');
  const [breakdown, setBreakdown] = useState<unknown>(null);

  const handleGenerate = async () => {
    if (!feature.trim()) return;

    try {
      const result = await ai.breakdownTasks(feature, complexity);
      setBreakdown(result);
    } catch (error) {
      console.error('Error breaking down tasks:', error);
    }
  };

  const complexityColors = {
    simple: 'bg-green-500',
    medium: 'bg-yellow-500',
    complex: 'bg-red-500'
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <CheckSquare className="h-8 w-8 text-blue-500" />
          AI Task Breakdown
        </h1>
        <p className="text-muted-foreground">
          Break down features into actionable tasks with time estimates
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feature Breakdown</CardTitle>
          <CardDescription>
            Describe a feature and get detailed tasks with estimates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Describe the feature you want to break down (e.g., 'User authentication system', 'Payment processing', 'Real-time chat')..."
            value={feature}
            onChange={(e) => setFeature(e.target.value)}
            rows={3}
          />
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Complexity Level</label>
              <Select value={complexity} onValueChange={(value: any) => setComplexity(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple - Basic implementation</SelectItem>
                  <SelectItem value="medium">Medium - Standard features</SelectItem>
                  <SelectItem value="complex">Complex - Advanced functionality</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                onClick={handleGenerate} 
                disabled={ai.isLoading || !feature.trim()}
              >
                {ai.isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Break Down Tasks
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

      {(breakdown as any) && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Project Summary</span>
                <Badge className={complexityColors[complexity]}>
                  {complexity.charAt(0).toUpperCase() + complexity.slice(1)} Complexity
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold">{(breakdown as any).tasks?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{(breakdown as any).totalEstimate || 0}h</div>
                  <div className="text-sm text-muted-foreground">Estimated Time</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{(breakdown as any).risks?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Risk Factors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tasks */}
          {(breakdown as any).tasks && (breakdown as any).tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5" />
                  Task Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(breakdown as any).tasks.map((task: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span>{task.name}</span>
                      </div>
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimate}h
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Dependencies & Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(breakdown as any).dependencies && (breakdown as any).dependencies.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Dependencies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(breakdown as any).dependencies.map((dep: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">{dep}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {(breakdown as any).risks && (breakdown as any).risks.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(breakdown as any).risks.map((risk: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">{risk}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Acceptance Criteria */}
          {(breakdown as any).acceptanceCriteria && (breakdown as any).acceptanceCriteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Acceptance Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(breakdown as any).acceptanceCriteria.map((criteria: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{criteria}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {!breakdown && (
        <Card>
          <CardContent className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Describe a feature above to get detailed task breakdown with estimates
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TaskBreakdown;
