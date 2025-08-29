// AI Connection Diagnostic Tool
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Brain } from 'lucide-react';

interface DiagnosticResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function AIDiagnostic() {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    const diagnostics: DiagnosticResult[] = [];

    // Test 1: Environment Variable Check (Frontend)
    try {
      const hasApiKey = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      diagnostics.push({
        status: hasApiKey ? 'success' : 'warning',
        message: 'Frontend Environment Check',
        details: hasApiKey ? 'NEXT_PUBLIC_GEMINI_API_KEY is present' : 'NEXT_PUBLIC_GEMINI_API_KEY not found (this is OK if using server-side)'
      });
    } catch (error) {
      diagnostics.push({
        status: 'error',
        message: 'Frontend Environment Check Failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    // Test 2: API Route Connectivity
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Hello, this is a test message.',
          type: 'text',
          options: { temperature: 0.1, maxTokens: 50 }
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        diagnostics.push({
          status: 'success',
          message: 'AI API Connection',
          details: 'Successfully connected to Gemini AI service'
        });
      } else {
        diagnostics.push({
          status: 'error',
          message: 'AI API Connection Failed',
          details: data.error || data.details || `HTTP ${response.status}`
        });
      }
    } catch (error) {
      diagnostics.push({
        status: 'error',
        message: 'AI API Connection Error',
        details: error instanceof Error ? error.message : 'Network or parsing error'
      });
    }

    // Test 3: AI Response Quality
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Generate a brief startup idea about sustainable technology.',
          type: 'text',
          options: { temperature: 0.7, maxTokens: 100 }
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success && data.data?.text) {
        const responseLength = data.data.text.length;
        diagnostics.push({
          status: responseLength > 20 ? 'success' : 'warning',
          message: 'AI Response Quality',
          details: `Generated ${responseLength} characters of content`
        });
      } else {
        diagnostics.push({
          status: 'error',
          message: 'AI Response Quality Check Failed',
          details: 'No valid response received'
        });
      }
    } catch (error) {
      diagnostics.push({
        status: 'error',
        message: 'AI Response Quality Check Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setResults(diagnostics);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'error': return 'bg-red-500/10 text-red-700 border-red-200';
      case 'warning': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          AI Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={runDiagnostics} disabled={isRunning}>
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics'}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Diagnostic Results:</h3>
            {results.map((result, index) => (
              <Alert key={index} className={`${getStatusColor(result.status)} border`}>
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <h4 className="font-medium">{result.message}</h4>
                    {result.details && (
                      <AlertDescription className="mt-1 text-sm">
                        {result.details}
                      </AlertDescription>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure GOOGLE_GEMINI_API_KEY is set in .env.local</li>
              <li>• Restart the development server after adding environment variables</li>
              <li>• Check that your Gemini API key is valid and has sufficient quota</li>
              <li>• Verify your internet connection</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
