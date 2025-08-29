"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card";

// Testimonials will be loaded from real user feedback or removed for production
const testimonials: unknown[] = [];

const Testimonials = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black/90">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-green-500/10 px-3 py-1 text-sm text-green-400 border border-green-500/20">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">From Our Founders</h2>
            <p className="max-w-[900px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              See how entrepreneurs like you are using our platform to build successful startups.
            </p>
          </div>
        </div>
        
        {/* Placeholder for when testimonials are available */}
        {testimonials.length === 0 && (
          <div className="mt-12 text-center">
            <div className="workspace-card max-w-2xl mx-auto p-8">
              <h3 className="text-xl font-semibold text-white mb-4">Coming Soon</h3>
              <p className="text-gray-400">
                We're collecting testimonials from our early users. Check back soon to see what founders are saying about Builder Blueprint AI!
              </p>
            </div>
          </div>
        )}
        
        {/* Future testimonials grid */}
        {testimonials.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mt-12">
            {/* Testimonials will be mapped here when available */}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
