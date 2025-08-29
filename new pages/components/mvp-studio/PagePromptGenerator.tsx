import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, ExternalLink, Sparkles, ArrowRight, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PagePromptGeneratorProps {
  onGenerate?: (prompt: string) => void;
}

const PagePromptGenerator: React.FC<PagePromptGeneratorProps> = ({ onGenerate }) => {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [pageType, setPageType] = useState('landing');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a prompt to generate content.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const generatedPrompt = `Generate a ${pageType} page for: ${prompt}`;
      onGenerate?.(generatedPrompt);

      toast({
        title: "Prompt generated",
        description: "Your page prompt has been generated successfully.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Prompt has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Page Prompt Generator</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Page Type
            </label>
            <Select value={pageType} onValueChange={setPageType}>
              <SelectTrigger className="workspace-input">
                <SelectValue placeholder="Select page type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="landing">Landing Page</SelectItem>
                <SelectItem value="about">About Page</SelectItem>
                <SelectItem value="contact">Contact Page</SelectItem>
                <SelectItem value="pricing">Pricing Page</SelectItem>
                <SelectItem value="features">Features Page</SelectItem>
                <SelectItem value="blog">Blog Page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Prompt Description
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to generate..."
              className="workspace-input min-h-[100px]"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Prompt
                </>
              )}
            </Button>

            <Button
              onClick={handleCopy}
              variant="outline"
              disabled={!prompt.trim()}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagePromptGenerator;