"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, Smartphone, Palette, Briefcase, Heart } from "lucide-react";
import { useBuilder, builderActions } from "@/lib/builderContext";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "../LoadingStates";

const designStyles = [
  {
    id: 'minimal',
    name: 'Minimal',
    icon: Palette,
    description: 'Clean, simple, and focused design',
    color: 'from-gray-500 to-slate-600',
    example: 'Think Apple, Notion, or Linear'
  },
  {
    id: 'playful',
    name: 'Playful',
    icon: Heart,
    description: 'Colorful, fun, and engaging design',
    color: 'from-pink-500 to-purple-600',
    example: 'Think Duolingo, Spotify, or Discord'
  },
  {
    id: 'business',
    name: 'Business',
    icon: Briefcase,
    description: 'Professional, trustworthy, and corporate',
    color: 'from-blue-500 to-indigo-600',
    example: 'Think Salesforce, LinkedIn, or Slack'
  }
];

export function AppIdeaCard() {
  const { state, dispatch } = useBuilder();
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);

  const handlePlatformChange = (platform: 'web' | 'mobile', checked: boolean) => {
    const currentPlatforms = state.appIdea.platforms;
    const newPlatforms = checked 
      ? [...currentPlatforms, platform]
      : currentPlatforms.filter(p => p !== platform);
    
    dispatch(builderActions.updateAppIdea({ platforms: newPlatforms }));
  };

  const handleStyleSelect = (style: 'minimal' | 'playful' | 'business') => {
    dispatch(builderActions.updateAppIdea({ designStyle: style }));
  };

  const validateAndContinue = async () => {
    // Validation
    if (!state.appIdea.appName.trim()) {
      toast({
        title: "App Name Required",
        description: "Please enter a name for your app.",
        variant: "destructive"
      });
      return;
    }

    if (state.appIdea.platforms.length === 0) {
      toast({
        title: "Platform Required",
        description: "Please select at least one platform (Web or Mobile).",
        variant: "destructive"
      });
      return;
    }

    if (!state.appIdea.ideaDescription.trim()) {
      toast({
        title: "App Description Required",
        description: "Please describe your app idea in detail.",
        variant: "destructive"
      });
      return;
    }

    if (state.appIdea.ideaDescription.trim().length < 50) {
      toast({
        title: "More Detail Needed",
        description: "Please provide a more detailed description of your app idea (at least 50 characters).",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    // Simulate validation process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsValidating(false);
    dispatch(builderActions.setCurrentCard(2));
    
    toast({
      title: "App Idea Captured!",
      description: "Moving to validation questions...",
    });
  };

  return (
    <div className="space-y-6">
      {/* App Name */}
      <div className="space-y-2">
        <Label htmlFor="appName" className="text-base font-medium">
          App Name *
        </Label>
        <Input
          id="appName"
          placeholder="e.g., TaskMaster Pro, FitTracker, StudyBuddy"
          value={state.appIdea.appName}
          onChange={(e) => dispatch(builderActions.updateAppIdea({ appName: e.target.value }))}
          className="text-base"
        />
      </div>

      {/* Platform Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Platform(s) *</Label>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="web"
              checked={state.appIdea.platforms.includes('web')}
              onCheckedChange={(checked) => handlePlatformChange('web', checked as boolean)}
            />
            <Label htmlFor="web" className="flex items-center gap-2 cursor-pointer">
              <Globe className="h-4 w-4" />
              Web Application
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mobile"
              checked={state.appIdea.platforms.includes('mobile')}
              onCheckedChange={(checked) => handlePlatformChange('mobile', checked as boolean)}
            />
            <Label htmlFor="mobile" className="flex items-center gap-2 cursor-pointer">
              <Smartphone className="h-4 w-4" />
              Mobile App
            </Label>
          </div>
        </div>
      </div>

      {/* Design Style Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Design Style</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {designStyles.map((style, index) => {
            const Icon = style.icon;
            const isSelected = state.appIdea.designStyle === style.id;
            
            return (
              <Card
                key={style.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg scale-[1.02]' : 'hover:shadow-sm'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => handleStyleSelect(style.id as any)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${style.color} flex items-center justify-center shadow-sm`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{style.name}</h4>
                        {isSelected && <Badge variant="default" className="text-xs">Selected</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {style.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {style.example}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Optional Style Description */}
      <div className="space-y-2">
        <Label htmlFor="styleDescription" className="text-base font-medium">
          Style Description <span className="text-sm text-muted-foreground">(Optional)</span>
        </Label>
        <Textarea
          id="styleDescription"
          placeholder="Any specific design preferences, color schemes, or visual inspirations..."
          value={state.appIdea.styleDescription || ''}
          onChange={(e) => dispatch(builderActions.updateAppIdea({ styleDescription: e.target.value }))}
          className="min-h-[80px]"
        />
      </div>

      {/* App Idea Description */}
      <div className="space-y-2">
        <Label htmlFor="ideaDescription" className="text-base font-medium">
          Describe your app idea in detail *
        </Label>
        <Textarea
          id="ideaDescription"
          placeholder="Example: A mobile app to track daily habits and view streaks. Users can create custom habits, set reminders, view progress charts, and share achievements with friends. The app should have a clean, motivating interface with gamification elements like badges and levels..."
          value={state.appIdea.ideaDescription}
          onChange={(e) => dispatch(builderActions.updateAppIdea({ ideaDescription: e.target.value }))}
          className="min-h-[120px]"
        />
        <div className="text-xs text-muted-foreground">
          {state.appIdea.ideaDescription.length}/50 characters minimum
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="targetAudience" className="text-base font-medium">
          Target Audience <span className="text-sm text-muted-foreground">(Optional)</span>
        </Label>
        <Input
          id="targetAudience"
          placeholder="e.g., Young professionals, Students, Small business owners"
          value={state.appIdea.targetAudience || ''}
          onChange={(e) => dispatch(builderActions.updateAppIdea({ targetAudience: e.target.value }))}
        />
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={validateAndContinue}
          disabled={isValidating}
          className="flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          {isValidating ? (
            <>
              <LoadingSpinner size="sm" />
              Validating...
            </>
          ) : (
            <>
              Continue to Stage 2
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
