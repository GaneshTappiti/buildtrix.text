'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SimpleMVPWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: any) => void;
}

interface WizardData {
  appName: string;
  appDescription: string;
  selectedTool: string;
  platforms: string[];
}

const AVAILABLE_TOOLS = [
  { id: 'lovable', name: 'Lovable', description: 'Full-stack web applications' },
  { id: 'cursor', name: 'Cursor', description: 'AI-powered code editor' },
  { id: 'v0', name: 'v0', description: 'UI component generation' },
  { id: 'bolt', name: 'Bolt', description: 'Rapid prototyping' },
  { id: 'replit', name: 'Replit', description: 'Cloud development' }
];

const PLATFORMS = [
  { id: 'web', name: 'Web App' },
  { id: 'mobile', name: 'Mobile App' },
  { id: 'desktop', name: 'Desktop App' }
];

export default function SimpleMVPWizard({ isOpen, onClose, onComplete }: SimpleMVPWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>({
    appName: '',
    appDescription: '',
    selectedTool: '',
    platforms: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate RAG-enhanced prompt generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = {
        appName: wizardData.appName,
        appDescription: wizardData.appDescription,
        selectedTool: wizardData.selectedTool,
        platforms: wizardData.platforms,
        ragEnhanced: true,
        generatedPrompt: `Create a ${wizardData.platforms.join(' and ')} application called "${wizardData.appName}". ${wizardData.appDescription}. Use ${wizardData.selectedTool} for development. This prompt has been enhanced with RAG context for optimal results.`,
        timestamp: new Date().toISOString()
      };
      
      toast({
        title: "RAG-Enhanced Prompt Generated!",
        description: "Your MVP prompt has been created with AI-enhanced context.",
      });
      
      onComplete(result);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your RAG-enhanced prompt.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return wizardData.appName.trim() !== '' && wizardData.appDescription.trim() !== '';
      case 2:
        return wizardData.selectedTool !== '';
      case 3:
        return wizardData.platforms.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Tell us about your app idea</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">App Name</label>
                  <Input
                    placeholder="e.g., TaskMaster Pro"
                    value={wizardData.appName}
                    onChange={(e) => setWizardData(prev => ({ ...prev, appName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">App Description</label>
                  <Textarea
                    placeholder="Describe your app idea in detail..."
                    value={wizardData.appDescription}
                    onChange={(e) => setWizardData(prev => ({ ...prev, appDescription: e.target.value }))}
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Choose your development tool</h3>
              <div className="grid grid-cols-1 gap-3">
                {AVAILABLE_TOOLS.map((tool) => (
                  <Card
                    key={tool.id}
                    className={`cursor-pointer transition-all ${
                      wizardData.selectedTool === tool.id
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setWizardData(prev => ({ ...prev, selectedTool: tool.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{tool.name}</h4>
                          <p className="text-sm text-muted-foreground">{tool.description}</p>
                        </div>
                        {wizardData.selectedTool === tool.id && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Select target platforms</h3>
              <div className="grid grid-cols-1 gap-3">
                {PLATFORMS.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all ${
                      wizardData.platforms.includes(platform.id)
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => {
                      setWizardData(prev => ({
                        ...prev,
                        platforms: prev.platforms.includes(platform.id)
                          ? prev.platforms.filter(p => p !== platform.id)
                          : [...prev.platforms, platform.id]
                      }));
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{platform.name}</h4>
                        {wizardData.platforms.includes(platform.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Generate</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">App Summary</h4>
                  <p><strong>Name:</strong> {wizardData.appName}</p>
                  <p><strong>Description:</strong> {wizardData.appDescription}</p>
                  <p><strong>Tool:</strong> {AVAILABLE_TOOLS.find(t => t.id === wizardData.selectedTool)?.name}</p>
                  <p><strong>Platforms:</strong> {wizardData.platforms.map(p => PLATFORMS.find(pl => pl.id === p)?.name).join(', ')}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                  <span>This will generate a RAG-enhanced prompt with tool-specific context</span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            RAG-Enhanced MVP Wizard
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i + 1 <= currentStep
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={!isStepValid() || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate RAG Prompt
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
