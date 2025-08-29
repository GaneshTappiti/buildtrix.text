"use client"

import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Building2, 
  Layout, 
  GitBranch, 
  Package, 
  Download,
  ArrowRight
} from "lucide-react";

const stages = [
  {
    icon: Brain,
    title: "Idea Intake & Tool Match",
    description: "Describe your app idea in plain English. Our AI analyzes your concept and recommends the perfect AI builder tool.",
    example: "\"Your idea fits best with FlutterFlow for mobile + Firebase backend.\""
  },
  {
    icon: Building2,
    title: "App Skeleton Generator",
    description: "Break down your idea into screens, features, and user journeys tailored to your chosen builder's capabilities.",
    example: "6 screens identified: Home, Search, Details, Upload, Profile, Chat"
  },
  {
    icon: Layout,
    title: "UI Prompt Generator",
    description: "Generate detailed, screen-by-screen UI prompts with elements, layouts, and interactions in your tool's syntax.",
    example: "Complete Framer prompts with responsive layouts and component specifications"
  },
  {
    icon: GitBranch,
    title: "Flow & Logic Mapper",
    description: "Map navigation flows, conditional logic, and data dependencies with tool-specific implementations.",
    example: "Authentication flows, form validation, and database connections"
  },
  {
    icon: Package,
    title: "Prompt Pack Builder",
    description: "Combine everything into organized, copy-paste ready prompt packages formatted for your AI builder.",
    example: "Master prompt + individual screen prompts + setup checklist"
  },
  {
    icon: Download,
    title: "Export & Deploy Ready",
    description: "Download as Markdown, JSON, or direct integration with supported AI builders for instant deployment.",
    example: "One-click export to Framer, Builder.io, or local files"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Six intelligent stages that transform your startup idea into production-ready AI builder prompts
          </p>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 relative">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isLastInRow = (index + 1) % 3 === 0;
            const isLastCard = index === stages.length - 1;

            return (
              <div key={index} className="relative">
                <Card className="group hover:shadow-glow-primary/20 transition-all duration-300 border-primary/20 h-full hover:scale-[1.02] hover:-translate-y-1">
                  <CardContent className="p-8 h-full flex flex-col">
                    {/* Stage number */}
                    <div className="absolute -top-4 -left-4 w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg z-10">
                      {index + 1}
                    </div>

                    {/* Icon Section */}
                    <div className="mb-6">
                      <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        <Icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                        {stage.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                        {stage.description}
                      </p>

                      {/* Example Output */}
                      <div className="bg-secondary/50 rounded-xl p-4 border border-primary/10 group-hover:border-primary/20 transition-colors">
                        <div className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">
                          Example Output
                        </div>
                        <div className="text-sm text-muted-foreground italic leading-relaxed">
                          {stage.example}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Flow Arrows - Horizontal for desktop, vertical for mobile */}
                {!isLastCard && (
                  <>
                    {/* Desktop horizontal arrows (between cards in same row) */}
                    {!isLastInRow && (
                      <div className="hidden lg:block absolute -right-5 top-1/2 transform -translate-y-1/2 z-20">
                        <div className="w-10 h-10 bg-background rounded-full border-2 border-primary/20 flex items-center justify-center shadow-sm">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    )}

                    {/* Desktop vertical arrows (between rows) */}
                    {isLastInRow && index < stages.length - 1 && (
                      <div className="hidden lg:block absolute left-1/2 -bottom-5 transform -translate-x-1/2 z-20">
                        <div className="w-10 h-10 bg-background rounded-full border-2 border-primary/20 flex items-center justify-center shadow-sm rotate-90">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    )}

                    {/* Mobile/Tablet vertical arrows */}
                    <div className="lg:hidden flex justify-center my-6">
                      <div className="w-8 h-8 bg-background rounded-full border-2 border-primary/20 flex items-center justify-center shadow-sm rotate-90">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 px-4">
          <p className="text-muted-foreground text-lg leading-relaxed">
            Ready to transform your idea into reality?{" "}
            <span className="text-primary font-semibold hover:underline cursor-pointer transition-all">
              Start your first project now.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
