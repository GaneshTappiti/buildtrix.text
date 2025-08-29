"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Smartphone,
  Database,
  Palette,
  Code,
  Zap,
  ArrowRight
} from "lucide-react";

const builders = [
  {
    name: "Framer",
    icon: Globe,
    category: "Web Design",
    description: "Interactive web designs and prototypes",
    features: ["Responsive layouts", "Animations", "CMS integration"],
    badge: "Popular",
    color: "from-blue-500 to-purple-600"
  },
  {
    name: "Builder.io",
    icon: Code,
    category: "Headless CMS",
    description: "Visual development platform",
    features: ["Drag & drop", "API integration", "Multi-platform"],
    badge: "Enterprise",
    color: "from-green-500 to-teal-600"
  },
  {
    name: "FlutterFlow",
    icon: Smartphone,
    category: "Mobile Apps",
    description: "No-code Flutter app builder",
    features: ["Native mobile", "Firebase", "Custom widgets"],
    badge: "Mobile First",
    color: "from-purple-500 to-pink-600"
  },
  {
    name: "Uizard",
    icon: Palette,
    category: "UI/UX Design",
    description: "AI-powered design tool",
    features: ["Wireframes", "Prototypes", "Design systems"],
    badge: "AI-Powered",
    color: "from-orange-500 to-red-600"
  },
  {
    name: "Adalo",
    icon: Smartphone,
    category: "No-Code Apps",
    description: "Native mobile & web apps",
    features: ["Database", "Actions", "Publishing"],
    badge: "Full-Stack",
    color: "from-cyan-500 to-blue-600"
  },
  {
    name: "Appsmith",
    icon: Database,
    category: "Internal Tools",
    description: "Low-code platform for dashboards",
    features: ["Database queries", "APIs", "Charts"],
    badge: "Business",
    color: "from-indigo-500 to-purple-600"
  }
];

export const AIBuilders = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm mb-8">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium tracking-wide">Supported AI Builders</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            We Speak Every Builder&apos;s Language
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Generate prompts optimized for each platform&apos;s unique syntax, capabilities, and best practices
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {builders.map((builder, index) => {
            const Icon = builder.icon;
            return (
              <Card key={index} className="group hover:shadow-glow-primary/20 transition-all duration-300 border-primary/20 overflow-hidden h-full">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Header with icon and badge */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${builder.color} flex items-center justify-center shadow-lg group-hover:scale-[1.02] transition-transform duration-200`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs px-3 py-1 font-medium">
                      {builder.badge}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="mb-6 flex-grow">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {builder.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-3 uppercase tracking-wide">
                      {builder.category}
                    </p>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {builder.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Key Features
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {builder.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Hover effect indicator */}
                  <div className="mt-auto pt-6 border-t border-primary/10">
                    <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium flex items-center justify-between">
                      <span>Generate {builder.name}-optimized prompts</span>
                      <div className="w-6 h-6 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-all duration-300">
                        <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-0.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 px-4">
          <p className="text-muted-foreground text-lg leading-relaxed">
            More AI builders being added regularly.{" "}
            <span className="text-primary font-semibold hover:underline cursor-pointer transition-all">
              Request support for your favorite tool.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};
