"use client"

import Navbar from "@/components/Navbar";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
  return (
    <div className="layout-container bg-green-glass text-foreground">
      <Navbar />
      <main className="layout-main pt-16">
        <div className="container px-4 md:px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tighter mb-8 text-center">
            <span className="text-gradient">
              Our Features
            </span>
          </h1>
        </div>
        <Features />
      </main>
      <Footer />
    </div>
  );
}
