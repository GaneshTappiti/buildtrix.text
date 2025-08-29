"use client"

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '@/lib/utils';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { useTheme } from 'next-themes';
import { useToast } from '@/hooks/use-toast';
import { TextFormatter, ParsedSection } from '@/utils/textFormatting';

interface EnhancedAIDisplayProps {
  content: string;
  className?: string;
  showCopyButton?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}

export const EnhancedAIDisplay: React.FC<EnhancedAIDisplayProps> = ({
  content,
  className,
  showCopyButton = true,
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  // Parse content using enhanced formatter
  const sections = React.useMemo(() => {
    return TextFormatter.parseResponse(content, {
      normalizeLineBreaks: true,
      trimSections: true,
      enhanceMarkdown: true,
      detectCodeBlocks: true,
      parseNumberedSections: true
    });
  }, [content]);

  // Format content for markdown display
  const formattedContent = React.useMemo(() => {
    return TextFormatter.formatForDisplay(sections);
  }, [sections]);

  const baseClasses = cn(
    "relative rounded-lg border bg-card text-card-foreground shadow-sm",
    variant === 'compact' && "p-3",
    variant === 'detailed' && "p-6",
    variant === 'default' && "p-4",
    className
  );

  return (
    <div className={baseClasses}>
      {showCopyButton && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      )}

      <div className={cn(
        "prose max-w-none",
        theme === 'dark' ? "prose-invert" : "",
        // Enhanced prose styles
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-2xl prose-h1:border-b prose-h1:pb-2 prose-h1:mb-4",
        "prose-h2:text-xl prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-1 prose-h2:mb-3",
        "prose-h3:text-lg prose-h3:mb-2",
        "prose-p:leading-relaxed prose-p:mb-4",
        "prose-ul:my-3 prose-ol:my-3 prose-li:my-1",
        "prose-li:leading-relaxed",
        "prose-strong:font-semibold prose-strong:text-foreground",
        "prose-code:bg-muted prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0",
        "prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:pl-4 prose-blockquote:py-2 prose-blockquote:rounded-r",
        "prose-table:border prose-th:border prose-td:border prose-th:bg-muted prose-th:p-3 prose-td:p-3",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        variant === 'compact' && "prose-sm",
        variant === 'detailed' && "prose-lg"
      )}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Enhanced code block rendering
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : 'text';
              
              return !inline ? (
                <div className="relative">
                  <SyntaxHighlighter
                    style={theme === 'dark' ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    className="rounded-md border"
                    customStyle={{
                      margin: 0,
                      background: theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(248, 250, 252, 0.8)',
                    }}
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                  {language !== 'text' && (
                    <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      {language}
                    </div>
                  )}
                </div>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            
            // Enhanced table styling
            table: ({ children, ...props }) => (
              <div className="overflow-x-auto my-6 rounded-lg border">
                <table className="min-w-full border-collapse" {...props}>
                  {children}
                </table>
              </div>
            ),
            
            th: ({ children, ...props }) => (
              <th className="border-b bg-muted p-3 text-left font-semibold text-foreground" {...props}>
                {children}
              </th>
            ),
            
            td: ({ children, ...props }) => (
              <td className="border-b p-3 text-foreground" {...props}>
                {children}
              </td>
            ),
            
            // Enhanced links
            a: ({ children, href, ...props }) => (
              <a
                href={href}
                className="text-primary hover:underline inline-flex items-center gap-1"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
                <ExternalLink className="h-3 w-3" />
              </a>
            ),

            // Enhanced blockquotes
            blockquote: ({ children, ...props }) => (
              <blockquote
                className="border-l-4 border-primary bg-muted/30 pl-4 py-2 rounded-r italic"
                {...props}
              >
                {children}
              </blockquote>
            ),

            // Enhanced lists
            ul: ({ children, ...props }) => (
              <ul className="space-y-1 ml-4" {...props}>
                {children}
              </ul>
            ),

            ol: ({ children, ...props }) => (
              <ol className="space-y-1 ml-4" {...props}>
                {children}
              </ol>
            ),

            li: ({ children, ...props }) => (
              <li className="leading-relaxed" {...props}>
                {children}
              </li>
            ),
          }}
        >
          {formattedContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

// Utility function to quickly display AI content
export const displayAIContent = (content: string, options?: Partial<EnhancedAIDisplayProps>) => {
  return <EnhancedAIDisplay content={content} {...options} />;
};

export default EnhancedAIDisplay;
