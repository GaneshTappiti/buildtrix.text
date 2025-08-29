"use client"

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { RefreshCw, Play } from "lucide-react";
import IdeaProgressOverview from "./IdeaProgressOverview";

const ProgressDemo: React.FC = () => {
  const [wikiProgress, setWikiProgress] = useState([75]);
  const [blueprintProgress, setBlueprintProgress] = useState([60]);
  const [journeyProgress, setJourneyProgress] = useState([40]);
  const [feedbackProgress, setFeedbackProgress] = useState([30]);
  const [isAnimating, setIsAnimating] = useState(false);

  const animateProgress = () => {
    setIsAnimating(true);
    
    // Simulate progress animation
    const intervals = [
      setTimeout(() => setWikiProgress([Math.random() * 100]), 200),
      setTimeout(() => setBlueprintProgress([Math.random() * 100]), 400),
      setTimeout(() => setJourneyProgress([Math.random() * 100]), 600),
      setTimeout(() => setFeedbackProgress([Math.random() * 100]), 800),
    ];

    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);

    return () => intervals.forEach(clearTimeout);
  };

  const resetProgress = () => {
    setWikiProgress([75]);
    setBlueprintProgress([60]);
    setJourneyProgress([40]);
    setFeedbackProgress([30]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Progress Overview Demo</h1>
        <p className="text-gray-400">
          Interactive demo of the IdeaForge progress indicators
        </p>
      </div>

      {/* Progress Overview Component */}
      <IdeaProgressOverview 
        wikiProgress={wikiProgress[0]}
        blueprintProgress={blueprintProgress[0]}
        journeyProgress={journeyProgress[0]}
        feedbackProgress={feedbackProgress[0]}
        showOverallProgress={true}
      />

      {/* Controls */}
      <Card className="bg-black/40 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Demo Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Action Buttons */}
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={animateProgress}
              disabled={isAnimating}
              className="bg-green-600 hover:bg-green-700"
            >
              <Play className="h-4 w-4 mr-2" />
              {isAnimating ? 'Animating...' : 'Animate Progress'}
            </Button>
            <Button 
              onClick={resetProgress}
              variant="outline"
              className="border-gray-600 hover:bg-gray-800"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Default
            </Button>
          </div>

          {/* Manual Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                📚 Wiki Progress: {wikiProgress[0]}%
              </label>
              <Slider
                value={wikiProgress}
                onValueChange={setWikiProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                🎯 Blueprint Progress: {blueprintProgress[0]}%
              </label>
              <Slider
                value={blueprintProgress}
                onValueChange={setBlueprintProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                🗺️ Journey Progress: {journeyProgress[0]}%
              </label>
              <Slider
                value={journeyProgress}
                onValueChange={setJourneyProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <label className="text-white font-medium flex items-center gap-2">
                💬 Feedback Progress: {feedbackProgress[0]}%
              </label>
              <Slider
                value={feedbackProgress}
                onValueChange={setFeedbackProgress}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h3 className="text-white font-medium mb-2">Current Values:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-blue-400">Wiki: {wikiProgress[0]}%</div>
              <div className="text-purple-400">Blueprint: {blueprintProgress[0]}%</div>
              <div className="text-green-400">Journey: {journeyProgress[0]}%</div>
              <div className="text-orange-400">Feedback: {feedbackProgress[0]}%</div>
            </div>
            <div className="mt-2 text-gray-400 text-sm">
              Overall: {Math.round((wikiProgress[0] + blueprintProgress[0] + journeyProgress[0] + feedbackProgress[0]) / 4)}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDemo;
