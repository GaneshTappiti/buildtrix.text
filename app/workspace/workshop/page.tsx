"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Lightbulb,
  ChevronLeft,
  Sparkles,
  Target,
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Brain,
  Zap,
  Save,
  Loader2
} from "lucide-react";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseHelpers } from "@/lib/supabase";
import { useIdeaStore, useActiveIdea } from "@/stores/ideaStore";
import EnhancedUpgradePrompt from "@/components/EnhancedUpgradePrompt";

interface IdeaValidation {
  problemStatement: string;
  targetMarket: string;
  keyFeatures: string[];
  monetizationStrategy: string;
  nextSteps: string[];
  validationScore: number;
  marketOpportunity: string;
  riskAssessment: string;
  competitorAnalysis: string;
}

export default function WorkshopPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ideaInput, setIdeaInput] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<IdeaValidation | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();

  // Use Zustand store
  const { setActiveIdea } = useActiveIdea();
  const hasActiveIdea = useIdeaStore((state) => state.hasActiveIdea);
  const setHasActiveIdea = useIdeaStore((state) => state.setHasActiveIdea);
  const setCurrentStep = useIdeaStore((state) => state.setCurrentStep);
  const canCreateNewIdea = useIdeaStore((state) => state.canCreateNewIdea);
  
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

  const checkActiveIdea = useCallback(async () => {
    try {
      const { data: ideas, error } = await supabaseHelpers.getIdeas();
      if (!error && ideas) {
        // Check if user has any active ideas (not archived)
        // Since the Idea interface doesn't have status, we'll check if any ideas exist
        setHasActiveIdea(ideas.length > 0);
      }
    } catch (error) {
      console.error('Error checking active ideas:', error);
    }
  }, [setHasActiveIdea]);

  // Check if user has an active idea (free tier restriction)
  useEffect(() => {
    checkActiveIdea();
  }, [checkActiveIdea]);

  const validateIdea = async () => {
    if (!ideaInput.trim()) {
      toast({
        title: "Please enter your idea",
        description: "Describe your startup idea or problem you want to solve",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      const prompt = `
      As an expert startup consultant, analyze this idea and provide a comprehensive validation:

      Idea: "${ideaInput}"

      Please provide a well-formatted structured analysis with clear sections:

      ## VALIDATION SCORE
      Provide a score from 1-100 with brief justification.

      ## PROBLEM STATEMENT
      Clearly define the problem being solved and its significance.

      ## TARGET MARKET ANALYSIS
      Analyze the target market including TAM/SAM/SOM if possible. Include demographics and market size.

      ## KEY MVP FEATURES
      List 3-5 essential features for the minimum viable product:
      - Feature 1: Description and importance
      - Feature 2: Description and importance
      - Feature 3: Description and importance

      ## MONETIZATION STRATEGY
      Describe revenue models and pricing strategies with specific examples.

      ## NEXT ACTIONABLE STEPS
      Provide immediate steps to validate and develop the idea:
      - Step 1: Specific action with timeline
      - Step 2: Specific action with timeline
      - Step 3: Specific action with timeline

      ## MARKET OPPORTUNITY ASSESSMENT
      Evaluate market size, growth potential, and timing.

      ## RISK ASSESSMENT
      Identify key risks and mitigation strategies:
      - Risk 1: Description and mitigation
      - Risk 2: Description and mitigation
      - Risk 3: Description and mitigation

      ## COMPETITOR ANALYSIS
      Analyze existing solutions and differentiation opportunities.

      Use proper markdown formatting with headers (##), bullet points (-), and clear section separation for better readability.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const validationData = JSON.parse(jsonMatch[0]);
        setValidation(validationData);
        
        toast({
          title: "Idea Validated!",
          description: `Validation score: ${validationData.validationScore}/100`,
        });
      } else {
        throw new Error("Could not parse AI response");
      }
    } catch (error) {
      console.error('Error validating idea:', error);
      toast({
        title: "Validation Failed",
        description: "Please try again or check your AI configuration",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const saveToIdeaVault = async () => {
    if (!validation || !ideaInput.trim()) return;

    setIsSaving(true);

    try {
      const ideaTitle = ideaInput.length > 50 ? ideaInput.substring(0, 50) + '...' : ideaInput;

      const newIdeaData = {
        title: ideaTitle,
        description: validation.problemStatement,
        status: validation.validationScore >= 70 ? 'validated' : 'exploring',
        category: 'workshop-validated',
        tags: ['workshop', 'ai-validated'],
        validation_score: validation.validationScore,
        market_opportunity: validation.marketOpportunity,
        risk_assessment: validation.riskAssessment,
        monetization_strategy: validation.monetizationStrategy,
        key_features: validation.keyFeatures,
        next_steps: validation.nextSteps,
        competitor_analysis: validation.competitorAnalysis,
        target_market: validation.targetMarket,
        problem_statement: validation.problemStatement,
        user_id: user?.id
      };

      const { data, error } = await supabaseHelpers.createIdea(newIdeaData);

      if (error) throw error;

      // Save to Zustand store as active idea
      if (data && Array.isArray(data) && data.length > 0) {
        const savedIdea = data[0];
        setActiveIdea({
          id: savedIdea.id,
          title: savedIdea.title,
          description: savedIdea.description || '',
          status: savedIdea.status as 'exploring' | 'validated' | 'archived' | 'draft',
          category: savedIdea.category,
          tags: savedIdea.tags || [],
          validation_score: savedIdea.validation_score,
          market_opportunity: savedIdea.market_opportunity,
          risk_assessment: savedIdea.risk_assessment,
          monetization_strategy: savedIdea.monetization_strategy,
          key_features: savedIdea.key_features,
          next_steps: savedIdea.next_steps,
          competitor_analysis: savedIdea.competitor_analysis,
          target_market: savedIdea.target_market,
          problem_statement: savedIdea.problem_statement,
          created_at: savedIdea.created_at,
          updated_at: savedIdea.updated_at
        });
        setHasActiveIdea(true);
        setCurrentStep('vault');
      }

      toast({
        title: "💡 Idea Saved!",
        description: "Your validated idea has been saved to Idea Vault",
        duration: 5000,
      });

      // Navigate to Idea Vault
      router.push('/workspace/idea-vault');

    } catch (error) {
      console.error('Error saving idea:', error);
      toast({
        title: "Save Failed",
        description: "Could not save idea to vault. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetWorkshop = () => {
    setIdeaInput("");
    setValidation(null);
    checkActiveIdea(); // Refresh active idea status
  };

  const getValidationColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getValidationBadge = (score: number) => {
    if (score >= 80) return { text: "High Potential", color: "bg-green-600/20 text-green-400" };
    if (score >= 60) return { text: "Moderate Potential", color: "bg-yellow-600/20 text-yellow-400" };
    return { text: "Needs Refinement", color: "bg-red-600/20 text-red-400" };
  };

  return (
    <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="layout-main transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-black/30"
                  onClick={() => setSidebarOpen(true)}
                >
                  <span className="sr-only">Toggle Sidebar</span>
                  ☰
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => router.push('/workspace')}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Workspace
                </Button>
              </div>
              {validation && (
                <Button
                  onClick={resetWorkshop}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  New Idea
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 max-w-4xl mx-auto workspace-content-spacing">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-green-600/20 rounded-full">
                <Brain className="h-8 w-8 text-green-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Workshop</h1>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Your free playground for idea validation. Get AI-powered insights and save promising ideas to your vault.
            </p>
          </div>

          {/* Free Tier Restriction Alert */}
          {!canCreateNewIdea() && (
            <div className="mb-6">
              <EnhancedUpgradePrompt
                feature="Multiple Active Ideas"
              />
            </div>
          )}

          {!validation ? (
            /* Idea Input Section */
            <Card className="bg-black/40 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Lightbulb className="h-5 w-5 text-green-400" />
                  Describe Your Idea
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="What problem are you solving? Describe your startup idea, app concept, or business opportunity..."
                  value={ideaInput}
                  onChange={(e) => setIdeaInput(e.target.value)}
                  className="min-h-32 bg-gray-900/50 border-gray-700 text-white placeholder-gray-400"
                  disabled={hasActiveIdea}
                />
                <Button
                  onClick={validateIdea}
                  disabled={isValidating || !ideaInput.trim() || !canCreateNewIdea()}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Validating Idea...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Validate with AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            /* Validation Results Section */
            <div className="space-y-6">
              {/* Validation Score */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Validation Results</CardTitle>
                    <Badge className={getValidationBadge(validation.validationScore).color}>
                      {getValidationBadge(validation.validationScore).text}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="text-3xl font-bold text-white">
                      <span className={getValidationColor(validation.validationScore)}>
                        {validation.validationScore}
                      </span>
                      <span className="text-gray-400 text-lg">/100</span>
                    </div>
                    <div className="flex-1">
                      <Progress
                        value={validation.validationScore}
                        className="h-3"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <Target className="h-5 w-5 text-blue-400" />
                      Problem Statement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{validation.problemStatement}</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <Users className="h-5 w-5 text-purple-400" />
                      Target Market
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{validation.targetMarket}</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <DollarSign className="h-5 w-5 text-green-400" />
                      Monetization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{validation.monetizationStrategy}</p>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white text-lg">
                      <TrendingUp className="h-5 w-5 text-orange-400" />
                      Market Opportunity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{validation.marketOpportunity}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Key Features */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    Key MVP Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {validation.keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Next Steps */}
              <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ArrowRight className="h-5 w-5 text-cyan-400" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {validation.nextSteps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-cyan-600/20 text-cyan-400 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={saveToIdeaVault}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save to Idea Vault
                    </>
                  )}
                </Button>
                <Button
                  onClick={resetWorkshop}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Try Another Idea
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
