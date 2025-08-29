"use client"

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="layout-container bg-green-glass text-foreground">
      <Navbar />
      <main className="layout-main">
        {/* Hero Section */}
        <section className="w-full pt-28 pb-20 md:pt-32 md:pb-28 relative overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/20 backdrop-blur-xl px-3 py-1 text-sm border border-green-500/20 animate-fade-in">
                <span className="text-green-400">Our Story</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-gradient animate-scale-in">
                Building the Future of MVP Development
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl animate-fade-in" style={{animationDelay: '0.2s'}}>
                We&apos;re on a mission to democratize startup creation by making AI-powered development tools accessible to everyone.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-green-600/10 filter blur-3xl animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-600/10 filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 items-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Our Mission
                </h2>
                <p className="text-gray-400 md:text-lg">
                  We believe that great ideas shouldn&apos;t be limited by technical barriers. Builder Blueprint AI empowers entrepreneurs, creators, and innovators to turn their visions into reality using the power of artificial intelligence.
                </p>
                <p className="text-gray-400 md:text-lg">
                  Our platform combines cutting-edge AI technology with intuitive design to create a seamless experience from ideation to deployment.
                </p>
              </div>
              <div className="workspace-card p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white mb-2">Innovation First</h3>
                <p className="text-gray-400">
                  We&apos;re constantly pushing the boundaries of what&apos;s possible with AI-assisted development.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/50">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white mb-4">
                Our Values
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                These core principles guide everything we do at Builder Blueprint AI.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="workspace-card p-6 text-center hover-card-scale">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Simplicity</h3>
                <p className="text-gray-400">
                  Complex technology made simple. We believe powerful tools should be easy to use.
                </p>
              </div>
              
              <div className="workspace-card p-6 text-center hover-card-scale">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-white mb-2">Speed</h3>
                <p className="text-gray-400">
                  From idea to MVP in record time. We help you move fast and build things.
                </p>
              </div>
              
              <div className="workspace-card p-6 text-center hover-card-scale">
                <div className="text-4xl mb-4">🤝</div>
                <h3 className="text-xl font-bold text-white mb-2">Community</h3>
                <p className="text-gray-400">
                  Building together is better. We foster a community of creators and innovators.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white mb-4">
                Meet the Team
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                We&apos;re a passionate team of developers, designers, and entrepreneurs working to make AI development accessible to everyone.
              </p>
            </div>
            
            <div className="workspace-card p-8 text-center max-w-2xl mx-auto">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-bold text-white mb-2">Growing Team</h3>
              <p className="text-gray-400 mb-6">
                We&apos;re actively building our team of talented individuals who share our vision for the future of development.
              </p>
              <Button asChild variant="outline" className="workspace-button-secondary">
                <Link href="/careers">
                  Join Our Team
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-black relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Ready to Build Your Startup?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl mt-4">
                  Join us on this journey and turn your ideas into reality with Builder Blueprint AI.
                </p>
                <div className="pt-6">
                  <Button asChild size="lg" className="workspace-button button-hover-scale">
                    <Link href="/workspace">
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-green-600/10 filter blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-emerald-600/10 filter blur-3xl"></div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
