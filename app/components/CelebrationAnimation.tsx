"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Sparkles, Star, Trophy, Download, Share, X } from "lucide-react";

interface CelebrationAnimationProps {
  isVisible: boolean;
  onClose: () => void;
  projectName: string;
  onDownload?: () => void;
  onShare?: () => void;
}

export function CelebrationAnimation({ 
  isVisible, 
  onClose, 
  projectName,
  onDownload,
  onShare 
}: CelebrationAnimationProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowConfetti(true);
      // Auto-hide confetti after 3 seconds
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-500">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 ? (
                <Sparkles className="w-4 h-4 text-yellow-400" />
              ) : i % 3 === 1 ? (
                <Star className="w-3 h-3 text-blue-400" />
              ) : (
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Celebration Card */}
      <Card className="w-96 max-w-[90vw] animate-in slide-in-from-bottom-8 duration-700 relative">
        {/* Close Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-4 right-2 h-8 w-8 p-0 hover:bg-white/20 text-gray-400 hover:text-white z-10"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardContent className="p-8 text-center space-y-6">
          {/* Trophy Icon with Animation */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -top-2 -left-2 animate-spin">
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-green-800">Congratulations!</h2>
            </div>
            <p className="text-lg text-muted-foreground">
              Your app blueprint for <span className="font-semibold text-primary">"{projectName}"</span> is complete!
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-3 gap-4 py-4 border-y">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-xs text-muted-foreground">Stages Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">✓</div>
              <div className="text-xs text-muted-foreground">Ready to Build</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">🚀</div>
              <div className="text-xs text-muted-foreground">Launch Ready</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex gap-2">
              {onDownload && (
                <Button 
                  onClick={onDownload}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:scale-[1.02] transition-transform duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Prompts
                </Button>
              )}
              {onShare && (
                <Button 
                  onClick={onShare}
                  variant="outline"
                  className="flex-1 hover:scale-[1.02] transition-transform duration-200"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
            >
              Continue Building
            </Button>
          </div>

          {/* Motivational Message */}
          <div className="text-sm text-muted-foreground italic">
            "Every great app starts with a great blueprint. You're ready to build something amazing! 🎉"
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
