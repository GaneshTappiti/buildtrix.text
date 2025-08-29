"use client"

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw, 
  Sparkles,
  Edit3,
  Copy,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { BusinessModelCanvas } from "@/types/businessModelCanvas";
import { BMCBlockGrid } from "@/components/bmc/BMCBlockGrid";
import { BMCExportPanel } from "@/components/bmc/BMCExportPanel";

export default function BMCViewPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [canvas, setCanvas] = useState<BusinessModelCanvas | null>(null);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Load canvas data
  useEffect(() => {
    const loadCanvas = () => {
      try {
        // For now, load from localStorage - in production, this would be an API call
        const savedCanvas = localStorage.getItem(`bmc-${params.id}`);
        let loadedCanvas = null;
        
        if (savedCanvas) {
          loadedCanvas = JSON.parse(savedCanvas);
        } else {
          // Fallback to general saved canvas
          const generalCanvas = localStorage.getItem('bmc-canvas');
          if (generalCanvas) {
            loadedCanvas = JSON.parse(generalCanvas);
          } else {
            toast({
              title: "Canvas not found",
              description: "The requested Business Model Canvas could not be found.",
              variant: "destructive"
            });
            router.push('/workspace/business-model-canvas');
            return;
          }
        }

        // Clean up any error content
        if (loadedCanvas) {
          const cleanedCanvas = {
            ...loadedCanvas,
            blocks: Object.fromEntries(
              Object.entries(loadedCanvas.blocks).map(([key, block]: [string, any]) => [
                key,
                {
                  ...block,
                  content: block.content?.includes('Error generating content') 
                    ? '' 
                    : block.content
                }
              ])
            )
          };
          setCanvas(cleanedCanvas);
        }
      } catch (error) {
        console.error('Error loading canvas:', error);
        toast({
          title: "Error loading canvas",
          description: "There was an error loading your Business Model Canvas.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      loadCanvas();
    }
  }, [params.id, router, toast]);

  const handleCanvasUpdate = (updatedCanvas: BusinessModelCanvas) => {
    // Clean up any error content in blocks
    const cleanedCanvas = {
      ...updatedCanvas,
      blocks: Object.fromEntries(
        Object.entries(updatedCanvas.blocks).map(([key, block]) => [
          key,
          {
            ...block,
            content: block.content?.includes('Error generating content') 
              ? '' 
              : block.content
          }
        ])
      )
    } as BusinessModelCanvas;

    setCanvas(cleanedCanvas);
    // Save to localStorage
    localStorage.setItem(`bmc-${params.id}`, JSON.stringify(cleanedCanvas));
    localStorage.setItem('bmc-canvas', JSON.stringify(cleanedCanvas));
  };

  const handleRegenerate = async () => {
    if (!canvas) return;
    
    setIsRegenerating(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'business-model-canvas',
          prompt: JSON.stringify({
            appIdea: canvas.appIdea,
            industry: canvas.metadata?.industry,
            targetMarket: canvas.metadata?.targetMarket,
            businessType: canvas.metadata?.businessType,
          })
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const newCanvas = { ...data.data.canvas, id: canvas.id };
        handleCanvasUpdate(newCanvas);
        toast({
          title: "Canvas Regenerated!",
          description: "Your Business Model Canvas has been updated with fresh AI insights.",
        });
      } else {
        throw new Error(data.error || 'Failed to regenerate canvas');
      }
    } catch (error) {
      console.error('Error regenerating canvas:', error);
      toast({
        title: "Regeneration Failed",
        description: error instanceof Error ? error.message : "Failed to regenerate canvas. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this link to let others view your Business Model Canvas.",
      });
    } catch (error) {
      toast({
        title: "Share failed",
        description: "Could not copy link to clipboard.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-green-400" />
            <p className="text-gray-300">Loading your Business Model Canvas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!canvas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <p className="text-gray-300">Canvas not found</p>
            <Link href="/workspace/business-model-canvas">
              <Button variant="outline" className="border-green-400/30 text-green-400 hover:bg-green-400/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Generator
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900/20 overflow-y-auto">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/workspace/business-model-canvas">
                <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Your Business Model Canvas</h1>
                <p className="text-sm text-gray-400 mt-1">Review and refine each block. Click edit to customize or regenerate for new AI suggestions.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-400/20 text-green-400 border-green-400/30">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Generated
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-8 py-6 sm:py-8 pb-16">
        {/* Business Idea Display */}
        <Card className="mb-6 sm:mb-8 bg-black/40 backdrop-blur-md border-white/20 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-400 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Business Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-200 leading-relaxed">{canvas.appIdea}</p>
            {canvas.metadata && (
              <div className="flex flex-wrap gap-2 mt-3">
                {canvas.metadata.industry && (
                  <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">Industry: {canvas.metadata.industry}</Badge>
                )}
                {canvas.metadata.targetMarket && (
                  <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">Market: {canvas.metadata.targetMarket}</Badge>
                )}
                {canvas.metadata.businessType && (
                  <Badge variant="outline" className="text-xs border-green-400/30 text-green-400">Type: {canvas.metadata.businessType.toUpperCase()}</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* BMC Grid */}
        <BMCBlockGrid 
          canvas={canvas} 
          onCanvasUpdate={handleCanvasUpdate}
          isGenerating={isRegenerating}
        />

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 shadow-lg shadow-green-600/20"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate Canvas
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setShowExportPanel(true)}
            className="border-green-400/30 text-green-400 hover:bg-green-400/10 hover:border-green-400/50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={handleShare}
            className="border-green-400/30 text-green-400 hover:bg-green-400/10 hover:border-green-400/50"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Export Panel */}
      {showExportPanel && (
        <BMCExportPanel
          canvas={canvas}
          isVisible={showExportPanel}
          onToggle={() => setShowExportPanel(false)}
        />
      )}
    </div>
  );
}
