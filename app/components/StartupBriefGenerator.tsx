import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Loader2, Sparkles } from 'lucide-react';
import { aiEngine } from '@/services/aiEngine';

interface StartupBriefGeneratorProps {
  ideaDescription?: string;
  onGenerated?: (brief: string) => void;
}

const StartupBriefGenerator: React.FC<StartupBriefGeneratorProps> = ({ 
  ideaDescription = '',
  onGenerated 
}) => {
  const [idea, setIdea] = useState(ideaDescription);
  const [generatedBrief, setGeneratedBrief] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsGenerating(true);
    try {
      const brief = await aiEngine.generateStartupBrief(idea);
      setGeneratedBrief(brief);
      onGenerated?.(brief);
    } catch (error) {
      console.error('Error generating brief:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedBrief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'startup-brief.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-400" />
          Startup Brief Generator
          <Badge className="bg-blue-600/20 text-blue-400">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">
            Describe your startup idea
          </label>
          <Textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Enter your startup idea description..."
            rows={3}
            className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
          />
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={!idea.trim() || isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Brief...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Startup Brief
            </>
          )}
        </Button>

        {/* Generated Brief */}
        {generatedBrief && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-white">Generated Brief</h4>
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                {generatedBrief}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StartupBriefGenerator;
