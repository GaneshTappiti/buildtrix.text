import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface FlowStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'pending';
  progress: number;
}

interface FlowProgressProps {
  steps?: FlowStep[];
}

const defaultSteps: FlowStep[] = [
  { id: '1', title: 'Idea Generation', status: 'completed', progress: 100 },
  { id: '2', title: 'Market Research', status: 'current', progress: 60 },
  { id: '3', title: 'Validation', status: 'pending', progress: 0 },
  { id: '4', title: 'MVP Planning', status: 'pending', progress: 0 },
  { id: '5', title: 'Development', status: 'pending', progress: 0 }
];

const FlowProgress: React.FC<FlowProgressProps> = ({ steps = defaultSteps }) => {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-400" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-400" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'current':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Development Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-3">
              {getStepIcon(step.status)}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${getStepColor(step.status)}`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {step.progress}%
                  </span>
                </div>
                <Progress 
                  value={step.progress} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FlowProgress;
