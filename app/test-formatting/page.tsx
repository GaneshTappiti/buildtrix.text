"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
// import { EnhancedAIDisplay } from '@/components/ui/enhanced-ai-display';
// import AIResponseFormatter from '@/components/AIResponseFormatter';
import { TextFormatter, ParsedSection } from '@/utils/textFormatting';

const TestFormattingPage = () => {
  const [testContent, setTestContent] = useState(`## VALIDATION SCORE (85/100)
This startup idea shows strong potential with a clear market need and viable business model.

## MARKET OPPORTUNITY
The global market for productivity tools is valued at $47 billion and growing at 13% annually. Key factors:
- Remote work adoption has increased demand by 300%
- Small businesses represent 60% of the market
- Mobile-first solutions are preferred by 78% of users

## RISK ASSESSMENT
Key risks and challenges to consider:
- **Competition Risk**: Established players like Slack and Microsoft Teams
- **Technical Risk**: Scaling infrastructure for real-time collaboration
- **Market Risk**: Economic downturn could reduce business software spending

## KEY FEATURES
Essential features for MVP:
- Real-time messaging and file sharing
- Video conferencing integration
- Task management and project tracking
- Mobile app with offline capabilities
- Third-party integrations (Google Workspace, Office 365)

## MONETIZATION STRATEGY
Recommended revenue model:
- **Freemium Model**: Basic features free, premium at $10/user/month
- **Enterprise Tier**: Advanced features at $25/user/month
- **API Access**: Developer tier at $100/month

## NEXT STEPS
Immediate actionable steps:
1. **Market Research** (2 weeks): Survey 100 potential customers
2. **MVP Development** (8 weeks): Build core messaging features
3. **Beta Testing** (4 weeks): Test with 50 early adopters
4. **Funding Round** (6 weeks): Raise $500K seed funding

## CODE EXAMPLE
\`\`\`javascript
// Sample API integration
const connectToSlack = async (token) => {
  const response = await fetch('/api/slack/connect', {
    method: 'POST',
    headers: { 'Authorization': \`Bearer \${token}\` }
  });
  return response.json();
};
\`\`\`

## COMPETITOR ANALYSIS
| Competitor | Market Share | Strengths | Weaknesses |
|------------|--------------|-----------|------------|
| Slack | 35% | Brand recognition | Complex pricing |
| Teams | 40% | Office integration | Poor UX |
| Discord | 15% | Gaming focus | Limited business features |

> **Key Insight**: There's a gap in the market for a simple, affordable solution that combines the best of all platforms.

This analysis shows strong potential for success with proper execution and market timing.`);

  const [parsedSections, setParsedSections] = useState<ParsedSection[]>([]);

  const handleParseContent = () => {
    const sections = TextFormatter.parseResponse(testContent);
    setParsedSections(sections);
    console.log('Parsed sections:', sections);
  };

  const handleCleanContent = () => {
    const cleaned = TextFormatter.cleanText(testContent);
    setTestContent(cleaned);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">AI Content Formatting Test</h1>
        <p className="text-muted-foreground">
          Test the enhanced formatting utilities and components
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Test Content Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={testContent}
              onChange={(e) => setTestContent(e.target.value)}
              placeholder="Enter AI-generated content to test formatting..."
              className="min-h-[300px] font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleParseContent} variant="outline">
                Parse Sections
              </Button>
              <Button onClick={handleCleanContent} variant="outline">
                Clean Text
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Display */}
        <Card>
          <CardHeader>
            <CardTitle>Enhanced AI Display</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded">
              Enhanced AI Display component temporarily disabled for debugging
            </div>
            {/* <EnhancedAIDisplay
              content={testContent}
              variant="detailed"
              showCopyButton={true}
            /> */}
          </CardContent>
        </Card>
      </div>

      {/* Original Formatter Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Original AIResponseFormatter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted rounded">
            AIResponseFormatter component temporarily disabled for debugging
          </div>
          {/* <AIResponseFormatter
            response={testContent}
            title="Test Response"
            toolType="general"
            showToolSpecific={false}
          /> */}
        </CardContent>
      </Card>

      {/* Parsed Sections Debug */}
      {parsedSections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parsed Sections Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {parsedSections.map((section, index) => (
                <div key={section.id || index} className="border rounded p-3 bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                      {section.type}
                    </span>
                    {section.level && (
                      <span className="font-mono text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                        Level {section.level}
                      </span>
                    )}
                    {section.title && (
                      <span className="font-semibold text-sm">{section.title}</span>
                    )}
                  </div>
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                    {section.content.substring(0, 200)}
                    {section.content.length > 200 && '...'}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestFormattingPage;
