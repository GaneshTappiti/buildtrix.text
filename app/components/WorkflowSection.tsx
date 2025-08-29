"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Lightbulb, Search, Map, Rocket } from "lucide-react";

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: WorkflowStep[] = [
  {
    number: "01",
    title: "Input Your Idea",
    description: "Simply describe your startup idea in plain language. Our AI understands context and nuance.",
    icon: <Lightbulb className="h-6 w-6" />,
  },
  {
    number: "02",
    title: "Get Validation & Analysis",
    description: "We'll scan the market for similar products and analyze your idea's uniqueness and potential.",
    icon: <Search className="h-6 w-6" />,
  },
  {
    number: "03",
    title: "Generate Roadmap & Assets",
    description: "Receive a complete startup package with roadmap, pitch script, UI mockups, and development plan.",
    icon: <Map className="h-6 w-6" />,
  },
  {
    number: "04",
    title: "Build Your MVP",
    description: "Use our no-code integrations and AI assistance to quickly build a working version of your product.",
    icon: <Rocket className="h-6 w-6" />,
  },
];

const WorkflowSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-green-100 dark:bg-green-900/20 px-4 py-2 text-sm font-medium text-green-700 dark:text-green-300">
              Workflow
            </div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900 dark:text-white">
              How It Works
            </h2>
            <p className="max-w-3xl text-gray-600 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
              Our streamlined process takes you from raw idea to launch-ready product in four simple steps.
            </p>
          </div>
        </div>
        
        {/* Workflow Steps */}
        <div className="relative">
          {/* Desktop Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-400 via-blue-500 to-purple-600 transform -translate-x-1/2 opacity-30"></div>
          
          <div className="space-y-16 lg:space-y-24 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className={`lg:flex items-center gap-8 ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                  {/* Content */}
                  <div className="lg:w-1/2 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white">
                        {step.icon}
                      </div>
                      <span className="text-4xl lg:text-5xl font-bold text-gray-200 dark:text-gray-700">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Timeline Circle (Desktop) */}
                  <div className="hidden lg:block lg:w-1/2 relative">
                    <div className={`absolute top-1/2 transform -translate-y-1/2 ${index % 2 === 0 ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'}`}>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Timeline Circle */}
                  <div className="lg:hidden absolute -left-4 top-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                {/* Mobile Timeline Line */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden absolute -left-4 top-8 w-0.5 h-16 bg-gradient-to-b from-green-400 to-blue-500 opacity-30 transform translate-x-4"></div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="mt-20 text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Rocket className="h-5 w-5 mr-2" />
            Start Building Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
