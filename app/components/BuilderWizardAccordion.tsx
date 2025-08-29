"use client"

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  CheckCircle,
  Clock,
  Lightbulb,
  Layout,
  GitBranch,
  Package,
  Download,
  ArrowRight
} from "lucide-react";
import { BuilderProvider, useBuilder, builderActions } from "@/lib/builderContext";
import { AppIdeaCard } from "./builder-cards/AppIdeaCard";
import { ValidationCard } from "./builder-cards/ValidationCard";
import { BlueprintCard } from "./builder-cards/BlueprintCard";
import { PromptGeneratorCard } from "./builder-cards/PromptGeneratorCard";
import { FlowDescriptionCard } from "./builder-cards/FlowDescriptionCard";
import { ExportComposerCard } from "./builder-cards/ExportComposerCard";
import { ProjectHistory } from "./ProjectHistory";
import { ErrorDisplay } from "./ErrorDisplay";
import { GenerationProgress, StaggeredFadeIn, FloatingActionButton } from "./LoadingStates";
import { ResponsiveContainer, ResponsiveStack } from "./ResponsiveContainer";

const builderStages = [
  {
    id: 1,
    title: "App Idea Input",
    subtitle: "Tell us your app idea",
    icon: Lightbulb,
    description: "Define your app concept, platform, and design preferences",
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Quick Validation Questions",
    subtitle: "Understand your product maturity",
    icon: CheckCircle,
    description: "Validate your idea and understand your motivation",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    title: "Application Blueprint Generator",
    subtitle: "Auto-generated app structure",
    icon: Layout,
    description: "Screens, navigation flow, and user roles",
    color: "from-purple-500 to-pink-600"
  },
  {
    id: 4,
    title: "Page-Level Prompt Generator",
    subtitle: "Detailed screen descriptions",
    icon: Brain,
    description: "Interactive screen-by-screen prompt generation",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 6,
    title: "Prompt Export Composer",
    subtitle: "Final prompt package",
    icon: Package,
    description: "Export for Framer, Uizard, Adalo, and more",
    color: "from-indigo-500 to-purple-600"
  }
];

function BuilderWizardContent() {
  const { state, dispatch } = useBuilder();
  const [openCards, setOpenCards] = useState<string[]>(["card-1"]);

  const getCardStatus = (cardId: number) => {
    if (cardId < state.currentCard) return 'completed';
    if (cardId === state.currentCard) return 'current';
    return 'upcoming';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
    }
  };

  const getProgressPercentage = () => {
    return ((state.currentCard - 1) / 6) * 100;
  };

  const handleQuickSave = () => {
    dispatch(builderActions.saveProject());
  };

  const handleCardToggle = (cardId: string) => {
    const cardNumber = parseInt(cardId.split('-')[1]);
    if (cardNumber <= state.currentCard) {
      setOpenCards(prev => 
        prev.includes(cardId) 
          ? prev.filter(id => id !== cardId)
          : [...prev, cardId]
      );
    }
  };

  const renderCardContent = (stageId: number) => {
    switch (stageId) {
      case 1:
        return <AppIdeaCard />;
      case 2:
        return <ValidationCard />;
      case 3:
        return <BlueprintCard />;
      case 4:
        return <PromptGeneratorCard />;
      case 5:
        return <FlowDescriptionCard />;
      case 6:
        return <ExportComposerCard />;
      default:
        return null;
    }
  };

  return (
    <ResponsiveContainer maxWidth="full" className="max-w-6xl">
      <ResponsiveStack direction="vertical" gap="lg">
        {/* Header with Progress */}
        <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧱 Builder Blueprint AI
        </h1>
        <p className="text-xl text-muted-foreground">
          Transform your app idea into AI-ready prompts for any builder platform
        </p>

        {/* Progress Bar and History */}
        <div className="max-w-md mx-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Stage {state.currentCard} of 6</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>

          {/* Project History Button */}
          <div className="flex justify-center">
            <ProjectHistory />
          </div>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay />

      {/* Accordion Cards */}
      <StaggeredFadeIn delay={150} className="space-y-4">
        <Accordion
          type="multiple"
          value={openCards}
          onValueChange={setOpenCards}
          className="space-y-4"
        >
          {builderStages.map((stage) => {
          const status = getCardStatus(stage.id);
          const Icon = stage.icon;
          const isAccessible = stage.id <= state.currentCard;
          
          return (
            <AccordionItem 
              key={`card-${stage.id}`} 
              value={`card-${stage.id}`}
              className="border rounded-lg overflow-hidden"
            >
              <Card className={`transition-all duration-300 ${
                status === 'current' ? 'ring-2 ring-blue-500 shadow-lg' : 
                status === 'completed' ? 'ring-1 ring-green-500' : 
                'opacity-75'
              }`}>
                <AccordionTrigger 
                  className="hover:no-underline p-0"
                  disabled={!isAccessible}
                  onClick={() => handleCardToggle(`card-${stage.id}`)}
                >
                  <CardHeader className="w-full p-6">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stage.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="flex items-center gap-3 mb-1">
                            <CardTitle className="text-xl font-semibold">{stage.title}</CardTitle>
                            {getStatusIcon(status)}
                          </div>
                          <p className="text-sm text-muted-foreground font-normal leading-relaxed">
                            {stage.subtitle}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            status === 'completed' ? 'default' :
                            status === 'current' ? 'secondary' :
                            'outline'
                          }
                          className="px-3 py-1 font-medium"
                        >
                          Stage {stage.id}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                </AccordionTrigger>
                
                <AccordionContent>
                  <CardContent className="pt-0 px-6 pb-6">
                    <div className="border-t border-primary/10 pt-6">
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        {stage.description}
                      </p>
                      {isAccessible && renderCardContent(stage.id)}
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          );
        })}
        </Accordion>
      </StaggeredFadeIn>

      {/* Enhanced Generation Progress Overlay */}
      <GenerationProgress
        progress={state.generationProgress}
        stage={
          state.generationProgress < 30 ? "Analyzing your idea..." :
          state.generationProgress < 60 ? "Creating app structure..." :
          state.generationProgress < 90 ? "Generating prompts..." :
          "Finalizing your blueprint..."
        }
        isVisible={state.isGenerating}
      />

      {/* Floating Save Button */}
      <FloatingActionButton
        onClick={handleQuickSave}
        icon={<Download className="h-5 w-5" />}
        label="Quick Save"
        isVisible={state.currentCard > 1 && state.appIdea.appName.length > 0}
      />
      </ResponsiveStack>
    </ResponsiveContainer>
  );
}

export function BuilderWizardAccordion() {
  return (
    <BuilderProvider>
      <div className="container mx-auto px-4 py-8">
        <BuilderWizardContent />
      </div>
    </BuilderProvider>
  );
}
