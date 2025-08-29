"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Brain, Wand2, Download, Copy, ArrowRight, ArrowLeft, Sparkles, Zap, Target, Layers, Rocket, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import PromptResultsDisplay from './PromptResultsDisplay';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'idea',
    title: 'Describe Your Idea',
    description: 'Tell us about your app concept',
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: 'platforms',
    title: 'Choose Platforms',
    description: 'Select your target platforms',
    icon: <Target className="h-5 w-5" />
  },
  {
    id: 'features',
    title: 'Key Features',
    description: 'Define core functionality',
    icon: <Layers className="h-5 w-5" />
  },
  {
    id: 'generate',
    title: 'Generate Prompts',
    description: 'AI creates your prompts',
    icon: <Wand2 className="h-5 w-5" />
  },
  {
    id: 'results',
    title: 'Review Results',
    description: 'Your prompts are ready',
    icon: <Rocket className="h-5 w-5" />
  }
];

interface FormData {
  appName: string;
  appDescription: string;
  targetAudience: string;
  platforms: string[];
  features: string[];
  customFeatures: string;
  complexity: 'simple' | 'moderate' | 'complex';
  timeline: string;
  budget: string;
  additionalRequirements: string;
}

interface PromptSynthesizerWizardProps {
  onComplete?: (results: any) => void;
  onClose?: () => void;
}

export default function PromptSynthesizerWizard({ onComplete, onClose }: PromptSynthesizerWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    appName: '',
    appDescription: '',
    targetAudience: '',
    platforms: [],
    features: [],
    customFeatures: '',
    complexity: 'moderate',
    timeline: '',
    budget: '',
    additionalRequirements: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [results, setResults] = useState<any | null>(null);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    if (!formData.appName || !formData.appDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in the app name and description before generating prompts.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 500);

    try {
      // Mock generation for now since service is missing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        appName: formData.appName,
        appDescription: formData.appDescription,
        prompts: {
          ideaValidation: `Create a comprehensive idea validation framework for ${formData.appName}...`,
          mvpDevelopment: `Design an MVP development plan for ${formData.appName}...`,
          userResearch: `Develop user research strategies for ${formData.appDescription}...`,
          marketAnalysis: `Analyze the market opportunity for ${formData.appName}...`
        },
        recommendations: [
          "Start with user interviews to validate core assumptions",
          "Build a simple prototype to test key features",
          "Focus on one platform initially for faster iteration"
        ]
      };

      setResults(mockResults);
      setGenerationProgress(100);
      setCurrentStep(WIZARD_STEPS.length - 1);
      
      toast({
        title: "Prompts Generated!",
        description: "Your custom prompts have been created successfully."
      });

      if (onComplete) {
        onComplete(mockResults);
      }
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your prompts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      clearInterval(progressInterval);
    }
  };

  const renderStepContent = () => {
    const step = WIZARD_STEPS[currentStep];

    switch (step.id) {
      case 'idea':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name *</Label>
              <Input
                id="appName"
                placeholder="e.g., TaskMaster Pro"
                value={formData.appName}
                onChange={(e) => updateFormData({ appName: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appDescription">App Description *</Label>
              <Textarea
                id="appDescription"
                placeholder="Describe what your app does, its main purpose, and key value proposition..."
                value={formData.appDescription}
                onChange={(e) => updateFormData({ appDescription: e.target.value })}
                className="bg-black/20 border-white/10 min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Small business owners, Students, Freelancers"
                value={formData.targetAudience}
                onChange={(e) => updateFormData({ targetAudience: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>
          </div>
        );

      case 'platforms':
        const platforms = ['Web App', 'iOS App', 'Android App', 'Desktop App', 'Chrome Extension', 'API/Backend'];
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Target Platforms</Label>
              <p className="text-sm text-gray-400 mt-1">Choose which platforms you want to build for</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {platforms.map((platform) => (
                <div key={platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform}
                    checked={formData.platforms.includes(platform)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData({ 
                          platforms: [...formData.platforms, platform] 
                        });
                      } else {
                        updateFormData({ 
                          platforms: formData.platforms.filter(p => p !== platform) 
                        });
                      }
                    }}
                  />
                  <Label htmlFor={platform} className="text-sm font-normal">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="complexity">Project Complexity</Label>
              <Select value={formData.complexity} onValueChange={(value: any) => updateFormData({ complexity: value })}>
                <SelectTrigger className="bg-black/20 border-white/10">
                  <SelectValue placeholder="Select complexity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple - Basic functionality</SelectItem>
                  <SelectItem value="moderate">Moderate - Standard features</SelectItem>
                  <SelectItem value="complex">Complex - Advanced features</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 'features':
        const commonFeatures = [
          'User Authentication', 'Data Storage', 'Real-time Updates', 'Push Notifications',
          'Payment Processing', 'Social Media Integration', 'Analytics', 'Search Functionality',
          'File Upload/Download', 'Email Integration', 'Calendar Integration', 'Chat/Messaging'
        ];

        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Core Features</Label>
              <p className="text-sm text-gray-400 mt-1">Select the main features your app will need</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {commonFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateFormData({ 
                          features: [...formData.features, feature] 
                        });
                      } else {
                        updateFormData({ 
                          features: formData.features.filter(f => f !== feature) 
                        });
                      }
                    }}
                  />
                  <Label htmlFor={feature} className="text-sm font-normal">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customFeatures">Additional Features</Label>
              <Textarea
                id="customFeatures"
                placeholder="Describe any specific or unique features not listed above..."
                value={formData.customFeatures}
                onChange={(e) => updateFormData({ customFeatures: e.target.value })}
                className="bg-black/20 border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  placeholder="e.g., 3 months, 6 weeks"
                  value={formData.timeline}
                  onChange={(e) => updateFormData({ timeline: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $5k-10k, $50k+"
                  value={formData.budget}
                  onChange={(e) => updateFormData({ budget: e.target.value })}
                  className="bg-black/20 border-white/10"
                />
              </div>
            </div>
          </div>
        );

      case 'generate':
        return (
          <div className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                <Wand2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to Generate Your Prompts</h3>
                <p className="text-gray-400">
                  We'll create customized prompts based on your app idea and requirements
                </p>
              </div>
            </div>

            {isGenerating && (
              <div className="space-y-4">
                <Progress value={generationProgress} className="w-full" />
                <p className="text-sm text-gray-400">
                  Generating prompts... {generationProgress}%
                </p>
              </div>
            )}

            <div className="bg-black/20 rounded-lg p-4 space-y-2 text-left">
              <h4 className="font-medium text-white">Summary:</h4>
              <div className="space-y-1 text-sm text-gray-300">
                <p><span className="text-gray-400">App:</span> {formData.appName}</p>
                <p><span className="text-gray-400">Platforms:</span> {formData.platforms.join(', ') || 'Not specified'}</p>
                <p><span className="text-gray-400">Features:</span> {formData.features.length} selected</p>
                <p><span className="text-gray-400">Complexity:</span> {formData.complexity}</p>
              </div>
            </div>

            {!isGenerating && (
              <Button
                onClick={handleGenerate}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                size="lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Prompts
              </Button>
            )}
          </div>
        );

      case 'results':
        return results ? (
          <PromptResultsDisplay results={results} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No results to display</p>
          </div>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {WIZARD_STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
              ${index <= currentStep 
                ? 'bg-green-600 border-green-600 text-white' 
                : 'border-gray-600 text-gray-400'
              }
            `}>
              {index < currentStep ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                step.icon
              )}
            </div>
            {index < WIZARD_STEPS.length - 1 && (
              <div className={`
                w-16 h-0.5 mx-2 transition-colors
                ${index < currentStep ? 'bg-green-600' : 'bg-gray-600'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            {WIZARD_STEPS[currentStep].icon}
            {WIZARD_STEPS[currentStep].title}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {WIZARD_STEPS[currentStep].description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0 || isGenerating}
          className="bg-black/20 border-white/10 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-2">
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="bg-black/20 border-white/10 text-white hover:bg-white/10"
            >
              Close
            </Button>
          )}
          
          {currentStep < WIZARD_STEPS.length - 2 && (
            <Button
              onClick={handleNext}
              className="bg-green-600 hover:bg-green-700"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
