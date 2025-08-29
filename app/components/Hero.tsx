"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background with gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-green-950">
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-green-500/10 filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-emerald-500/10 filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-500/5 filter blur-2xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-primary opacity-20 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-gradient-accent opacity-15 blur-xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-black/20 backdrop-blur-xl mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Turn Ideas into Production-Ready Applications</span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient leading-tight animate-scale-in">
          Builder Blueprint AI
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '0.2s'}}>
          Your AI-powered build orchestrator for MVP development
        </p>
        
        <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          Get the perfect AI builder recommendation + detailed prompts for Framer, Builder.io, Uizard, and more — all from a single idea description.
        </p>

        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in" style={{animationDelay: '0.4s'}}>
          Generate prompts, get tool recommendations, and build your MVP with the best AI builders in the market.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <Button
            asChild
            size="lg"
            className="workspace-button button-hover-scale px-10 py-5 text-lg font-semibold"
          >
            <Link href="/workspace">
              <span>Start Building</span>
              <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-10 py-5 text-lg border-green-500/30 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300 button-hover-scale text-white"
          >
            <Link href="#features">
              <Zap className="mr-3 w-5 h-5" />
              <span>See How It Works</span>
            </Link>
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">6</div>
            <div className="text-muted-foreground">Supported AI Builders</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">5min</div>
            <div className="text-muted-foreground">Average Generation Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">100%</div>
            <div className="text-muted-foreground">Tool-Specific Prompts</div>
          </div>
        </div>
      </div>
    </section>
  );
};
