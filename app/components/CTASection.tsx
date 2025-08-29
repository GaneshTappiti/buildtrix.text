"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const CTASection = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thanks for joining our waitlist!");
    setEmail("");
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black relative overflow-hidden">
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
              Ready to Validate Your Next Big Idea?
            </h2>
            <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl mt-4">
              Join thousands of entrepreneurs using our platform to build successful startups faster and with less risk.
            </p>
          </div>
          <div className="w-full max-w-md space-y-2 mt-6">
            <form className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2" onSubmit={handleSubmit}>
              <Input
                className="flex-1 workspace-input"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="workspace-button button-hover-scale">
                Start Free Trial
              </Button>
            </form>
            <p className="text-xs text-gray-500">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-green-600/10 filter blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-emerald-600/10 filter blur-3xl"></div>
      </div>
    </section>
  );
};

export default CTASection;
