"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const Features = () => {
  const features = [
    {
      id: "dashboard",
      icon: "🏠",
      title: "Dashboard",
      description: "Launchpad to all tools with quick access, daily brief, and startup health meter",
      gradient: "feature-gradient-1",
      path: "/workspace",
    },
    {
      id: "idea-vault",
      icon: "💡",
      title: "Idea Vault",
      description: "Store + grow ideas with AI enhancer, tags, voting, and privacy controls",
      gradient: "feature-gradient-2",
      path: "/workspace/idea-vault",
    },
    {
      id: "ai-roadmap",
      icon: "🧠",
      title: "AI Roadmap",
      description: "Auto-generate business plans with GPT-based phase planning and editable milestones",
      gradient: "feature-gradient-3",
      path: "/workspace/blueprint-zone",
    },
    {
      id: "mvp-studio",
      icon: "🚀",
      title: "MVP Studio",
      description: "Design and prototype your MVP with AI-powered tools and templates",
      gradient: "feature-gradient-4",
      path: "/workspace/mvp-studio",
    },
    {
      id: "docs-decks",
      icon: "📄",
      title: "Docs & Decks",
      description: "Create professional documents and pitch decks with AI assistance",
      gradient: "feature-gradient-1",
      path: "/workspace/docs-decks",
    },
    {
      id: "team-space",
      icon: "👥",
      title: "Team Space",
      description: "Collaborate with your team and manage projects efficiently",
      gradient: "feature-gradient-2",
      path: "/workspace/teamspace",
    },
  ];

  const killerFeatures = [
    {
      title: "Founder's GPT",
      icon: "🪄",
      description: "Built-in custom GPT trained on YC blogs, IndieHackers posts, Naval quotes, Alex Hormozi books, and failed startup post-mortems",
      bullets: [
        "Get answers on how to validate a 2-sided marketplace",
        "Generate SaaS landing page copy",
        "Create tagline ideas for your product",
      ]
    },
    {
      title: "Vision-to-MVP Wizard",
      icon: "🧠",
      description: "Write 3 lines of your idea and generate everything you need to start building",
      bullets: [
        "Landing page copy + design suggestions",
        "Tech stack recommendations",
        "Feature roadmap and launch strategy",
        "Monetization models tailored to your idea",
      ]
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative">
      <div className="container px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col items-center space-y-4 text-center mb-16">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-500/10 px-3 py-1 text-sm text-green-400 border border-green-500/20">
              Features
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
              Everything You Need to Build
            </h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From idea validation to MVP launch, we've got you covered with AI-powered tools.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mb-20">
          {features.map((feature) => (
            <Card key={feature.id} className="workspace-card workspace-hover hover-card-scale">
              <CardContent className="p-6">
                <div className={`w-full h-32 rounded-xl glass-effect flex items-center justify-center mb-4 ${feature.gradient}`}>
                  <span className="text-4xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 mb-4">{feature.description}</p>
                <Button asChild variant="ghost" className="text-green-400 hover:text-green-300 p-0">
                  <Link href={feature.path}>
                    Learn more <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Killer Features */}
        <div className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">Killer Features</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              These are the features that set us apart from the competition.
            </p>
          </div>
          
          <div className="grid gap-12">
            {killerFeatures.map((feature, index) => (
              <div key={index} className={`flex flex-col lg:flex-row gap-8 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="lg:w-1/2 flex items-center justify-center">
                  <div className={`w-full h-64 rounded-2xl glass-effect flex items-center justify-center ${index % 2 === 0 ? 'feature-gradient-1' : 'feature-gradient-2'}`}>
                    <span className="text-7xl">{feature.icon}</span>
                  </div>
                </div>
                <div className="lg:w-1/2 flex flex-col justify-center">
                  <h4 className="text-2xl font-bold mb-4 text-white">{feature.title}</h4>
                  <p className="text-gray-400 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-6 text-white">Ready to supercharge your startup journey?</h3>
          <Button asChild size="lg" className="workspace-button button-hover-scale">
            <Link href="/workspace">
              Enter Workspace
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
