"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Brain, Sparkles, Zap, Layers } from "lucide-react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-primary border-t-transparent ${sizeClasses[size]} ${className}`} />
  );
}

interface GenerationProgressProps {
  progress: number;
  stage: string;
  isVisible: boolean;
}

export function GenerationProgress({ progress, stage, isVisible }: GenerationProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <Card className="w-96 p-6 animate-in slide-in-from-bottom-4 duration-500">
        <CardContent className="space-y-6">
          {/* Animated Icon */}
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 animate-pulse">
                <Brain className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-4 h-4 text-primary/60 absolute top-2 right-2" />
              </div>
              <div className="absolute inset-0 animate-bounce delay-150">
                <Zap className="w-3 h-3 text-primary/40 absolute bottom-3 left-3" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">Generating Your Blueprint</h3>
          </div>

          {/* Progress Bar with Animation */}
          <div className="space-y-3">
            <Progress 
              value={progress} 
              className="h-3 transition-all duration-500 ease-out"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{Math.round(progress)}% Complete</span>
              <span className="animate-pulse">{stage}</span>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  progress >= step * 25 
                    ? 'bg-primary animate-pulse' 
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SkeletonCardProps {
  lines?: number;
  showHeader?: boolean;
}

export function SkeletonCard({ lines = 3, showHeader = true }: SkeletonCardProps) {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-6 space-y-4">
        {showHeader && (
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
}

export function TypewriterText({ text, speed = 50, className = '' }: TypewriterTextProps) {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <span className={className}>
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  isVisible: boolean;
}

export function FloatingActionButton({ onClick, icon, label, isVisible }: FloatingActionButtonProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-in slide-in-from-bottom-8 duration-500">
      <button
        onClick={onClick}
        className="group bg-primary text-primary-foreground rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label={label}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span className="hidden group-hover:block animate-in slide-in-from-right-2 duration-200 whitespace-nowrap">
            {label}
          </span>
        </div>
      </button>
    </div>
  );
}

interface StaggeredFadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function StaggeredFadeIn({ children, delay = 100, className = '' }: StaggeredFadeInProps) {
  // Convert children to array if it's not already
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <div
          key={index}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500"
          style={{ animationDelay: `${index * delay}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

// Import React for hooks
import React from 'react';
