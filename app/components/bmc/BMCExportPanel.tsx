"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Download, 
  Copy, 
  FileText, 
  Share2, 
  ChevronDown, 
  ChevronUp,
  ExternalLink,
  Rocket,
  CheckCircle
} from "lucide-react";
import { BusinessModelCanvas, BMCExportOptions } from "@/types/businessModelCanvas";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BMCExportPanelProps {
  canvas: BusinessModelCanvas;
  isVisible: boolean;
  onToggle: () => void;
}

export function BMCExportPanel({ canvas, isVisible, onToggle }: BMCExportPanelProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown' | 'json'>('markdown');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeTimestamps, setIncludeTimestamps] = useState(false);
  const [template, setTemplate] = useState<'standard' | 'detailed' | 'pitch'>('standard');
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleCopyAll = async () => {
    try {
      const content = generateMarkdownContent();

      if (!navigator.clipboard) {
        // Fallback for browsers without clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = content;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      } else {
        await navigator.clipboard.writeText(content);
      }

      toast({
        title: "Copied to clipboard",
        description: "Complete Business Model Canvas copied to clipboard.",
      });
    } catch (error) {
      console.error('Copy error:', error);
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard. Please try selecting and copying manually.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const options: BMCExportOptions = {
        format: exportFormat,
        includeMetadata,
        includeTimestamps,
        template
      };

      let content: string;
      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case 'markdown':
          content = generateMarkdownContent();
          filename = `business-model-canvas-${Date.now()}.md`;
          mimeType = 'text/markdown';
          break;
        case 'json':
          content = JSON.stringify(canvas, null, 2);
          filename = `business-model-canvas-${Date.now()}.json`;
          mimeType = 'application/json';
          break;
        case 'pdf':
          // For PDF, we'll generate markdown and let the user convert it
          content = generateMarkdownContent();
          filename = `business-model-canvas-${Date.now()}.md`;
          mimeType = 'text/markdown';
          toast({
            title: "PDF Export",
            description: "Markdown file downloaded. Use a markdown-to-PDF converter for PDF format.",
          });
          break;
        default:
          throw new Error('Unsupported export format');
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: `Business Model Canvas exported as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export Business Model Canvas.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateMarkdownContent = (): string => {
    const timestamp = new Date().toLocaleDateString();
    
    let content = `# Business Model Canvas\n\n`;
    
    if (includeMetadata) {
      content += `**App Idea:** ${canvas.appIdea}\n`;
      if (canvas.metadata?.industry) content += `**Industry:** ${canvas.metadata.industry}\n`;
      if (canvas.metadata?.targetMarket) content += `**Target Market:** ${canvas.metadata.targetMarket}\n`;
      if (canvas.metadata?.businessType) content += `**Business Type:** ${canvas.metadata.businessType.toUpperCase()}\n`;
      content += `\n`;
    }
    
    if (includeTimestamps) {
      content += `**Generated:** ${timestamp}\n`;
      content += `**Last Updated:** ${new Date(canvas.updatedAt).toLocaleDateString()}\n\n`;
    }
    
    content += `---\n\n`;
    
    // Add each block
    Object.entries(canvas.blocks).forEach(([key, block]) => {
      content += `## ${block.title}\n\n`;
      content += `${block.content}\n\n`;
      
      if (template === 'detailed') {
        content += `*Generated by AI: ${block.isGenerated ? 'Yes' : 'No'}*\n`;
        if (block.confidence) {
          content += `*Confidence: ${Math.round(block.confidence * 100)}%*\n`;
        }
        content += `\n`;
      }
    });
    
    if (template === 'pitch') {
      content += `---\n\n## Next Steps\n\n`;
      content += `1. Validate customer segments through market research\n`;
      content += `2. Test value proposition with potential customers\n`;
      content += `3. Develop MVP focusing on core features\n`;
      content += `4. Establish key partnerships\n`;
      content += `5. Refine revenue model based on market feedback\n\n`;
    }
    
    return content;
  };

  const handleSendToBuilder = () => {
    // This would integrate with the existing builder stages
    toast({
      title: "Integration coming soon",
      description: "Direct integration with MVP Studio builder stages will be available soon.",
    });
  };

  return (
    <Card className="glass-effect border-white/10 max-w-7xl mx-auto">
      <Collapsible open={isVisible} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors px-6 py-5">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-white text-xl">
                <Share2 className="h-6 w-6 text-green-400" />
                Export & Share
              </CardTitle>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-blue-400 border-blue-400/30 px-3 py-1">
                  Ready to Export
                </Badge>
                {isVisible ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-8 px-6 pb-6">
            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-semibold text-white text-lg">Export Format</h4>
                <Select value={exportFormat} onValueChange={(value: 'pdf' | 'markdown' | 'json') => setExportFormat(value)}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white h-11 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="markdown">Markdown (.md)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                    <SelectItem value="pdf">PDF (via Markdown)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white text-lg">Template Style</h4>
                <Select value={template} onValueChange={(value: 'standard' | 'detailed' | 'pitch') => setTemplate(value)}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white h-11 focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="detailed">Detailed (with metadata)</SelectItem>
                    <SelectItem value="pitch">Pitch Ready (with next steps)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Export Settings */}
            <div className="space-y-5">
              <h4 className="font-semibold text-white text-lg">Include Options</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="metadata"
                    checked={includeMetadata}
                    onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="metadata" className="text-white text-sm leading-relaxed cursor-pointer">
                    Include business metadata (industry, target market, etc.)
                  </Label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="timestamps"
                    checked={includeTimestamps}
                    onCheckedChange={(checked) => setIncludeTimestamps(checked === true)}
                    className="mt-1"
                  />
                  <Label htmlFor="timestamps" className="text-white text-sm leading-relaxed cursor-pointer">
                    Include creation and update timestamps
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t border-white/10">
              <Button
                onClick={handleCopyAll}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-6 py-2.5"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All
              </Button>

              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5"
              >
                <Download className="h-4 w-4 mr-2" />
                {isExporting ? 'Exporting...' : `Export ${exportFormat.toUpperCase()}`}
              </Button>

              <Button
                onClick={handleSendToBuilder}
                variant="outline"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10 px-6 py-2.5"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Send to MVP Studio
              </Button>

              <Button
                variant="outline"
                className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-6 py-2.5"
                onClick={() => {
                  window.open('https://www.canva.com/create/business-model-canvas/', '_blank');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in Canva
              </Button>
            </div>
            
            {/* Integration Preview */}
            <div className="bg-black/20 rounded-xl p-6 border border-white/10">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold text-white mb-3 text-lg">Ready for Next Steps</h5>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Your Business Model Canvas is complete and ready to guide your MVP development.
                    Use the export options to share with stakeholders or integrate with development tools.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
