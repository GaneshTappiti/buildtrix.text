import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, ExternalLink, Sparkles, Eye, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportablePrompt {
  id: string;
  title: string;
  content: string;
  tool: string;
  category: string;
  estimatedTime?: string;
}

interface ExportablePromptsSystemProps {
  prompts: ExportablePrompt[];
  onExport?: (promptId: string, format: string) => void;
}

const ExportablePromptsSystem: React.FC<ExportablePromptsSystemProps> = ({
  prompts = [],
  onExport
}) => {
  const [selectedFormat, setSelectedFormat] = useState('markdown');
  const [selectedTool, setSelectedTool] = useState('all');
  const { toast } = useToast();

  const filteredPrompts = prompts.filter(prompt => 
    selectedTool === 'all' || prompt.tool === selectedTool
  );

  const copyToClipboard = async (content: string, title: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard!",
        description: `${title} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPrompt = (content: string, title: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatPrompt = (prompt: ExportablePrompt, format: string) => {
    switch (format) {
      case 'markdown':
        return `# ${prompt.title}\n\n**Tool:** ${prompt.tool}\n**Category:** ${prompt.category}\n\n${prompt.content}`;
      case 'json':
        return JSON.stringify(prompt, null, 2);
      case 'plain':
        return prompt.content;
      default:
        return prompt.content;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          Exportable Prompts System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 mb-4">
          <Select value={selectedFormat} onValueChange={setSelectedFormat}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Export format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="plain">Plain Text</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedTool} onValueChange={setSelectedTool}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              <SelectItem value="lovable">Lovable</SelectItem>
              <SelectItem value="flutterflow">FlutterFlow</SelectItem>
              <SelectItem value="framer">Framer</SelectItem>
              <SelectItem value="bubble">Bubble</SelectItem>
              <SelectItem value="cursor">Cursor</SelectItem>
              <SelectItem value="v0">V0</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No prompts available yet.</p>
              <p className="text-sm">Generate prompts using the MVP Wizard to see them here.</p>
            </div>
          ) : (
            filteredPrompts.map((prompt) => (
              <Card key={prompt.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{prompt.title}</CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="secondary">{prompt.tool}</Badge>
                        <Badge variant="outline">{prompt.category}</Badge>
                        {prompt.estimatedTime && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {prompt.estimatedTime}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(formatPrompt(prompt, selectedFormat), prompt.title)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadPrompt(formatPrompt(prompt, selectedFormat), prompt.title)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {onExport && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onExport(prompt.id, selectedFormat)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    readOnly
                    value={formatPrompt(prompt, selectedFormat)}
                    className="min-h-32 font-mono text-sm"
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportablePromptsSystem;