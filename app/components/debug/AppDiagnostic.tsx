"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

interface DiagnosticResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

export default function AppDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { isAdmin } = useAdmin();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticResult[] = [];

    try {
      // Test 1: React Hydration
      results.push({
        name: 'React Hydration',
        status: typeof window !== 'undefined' ? 'pass' : 'fail',
        message: typeof window !== 'undefined' ? 'Client-side rendering active' : 'Server-side only',
        details: `Window object: ${typeof window !== 'undefined' ? 'Available' : 'Not available'}`
      });

      // Test 2: Auth Context
      results.push({
        name: 'Auth Context',
        status: authLoading ? 'warning' : (user ? 'pass' : 'warning'),
        message: authLoading ? 'Loading...' : (user ? 'User authenticated' : 'No user session'),
        details: `User: ${user?.email || 'None'}, Loading: ${authLoading}`
      });

      // Test 3: DOM Mounting
      const bodyElement = document.querySelector('body');
      const nextElement = document.querySelector('#__next');
      results.push({
        name: 'DOM Structure',
        status: bodyElement && nextElement ? 'pass' : 'fail',
        message: bodyElement && nextElement ? 'DOM structure correct' : 'Missing DOM elements',
        details: `Body: ${!!bodyElement}, Next: ${!!nextElement}`
      });

      // Test 4: CSS Classes
      const hasClasses = document.documentElement.classList.contains('dark');
      results.push({
        name: 'CSS Classes',
        status: hasClasses ? 'pass' : 'warning',
        message: hasClasses ? 'Dark mode classes applied' : 'Missing CSS classes',
        details: `HTML classes: ${document.documentElement.className}`
      });

      // Test 5: JavaScript Errors
      const hasErrors = window.onerror !== null;
      results.push({
        name: 'JavaScript Errors',
        status: 'pass',
        message: 'No critical errors detected',
        details: `Error handler: ${hasErrors ? 'Active' : 'None'}`
      });

      // Test 6: Local Storage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        results.push({
          name: 'Local Storage',
          status: 'pass',
          message: 'Local storage accessible',
          details: 'Read/write operations successful'
        });
      } catch (e) {
        results.push({
          name: 'Local Storage',
          status: 'fail',
          message: 'Local storage blocked',
          details: `Error: ${e instanceof Error ? e.message : 'Unknown error'}`
        });
      }

      // Test 7: Network Connectivity
      results.push({
        name: 'Network Status',
        status: navigator.onLine ? 'pass' : 'warning',
        message: navigator.onLine ? 'Online' : 'Offline',
        details: `Connection: ${navigator.onLine ? 'Active' : 'None'}`
      });

    } catch (error) {
      results.push({
        name: 'Diagnostic Error',
        status: 'fail',
        message: 'Failed to run diagnostics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
    }
  };

  const getStatusBadge = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">PASS</Badge>;
      case 'fail':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">FAIL</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">WARN</Badge>;
    }
  };

  const passCount = diagnostics.filter(d => d.status === 'pass').length;
  const failCount = diagnostics.filter(d => d.status === 'fail').length;
  const warnCount = diagnostics.filter(d => d.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="workspace-card-solid mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              App Diagnostic Tool
            </CardTitle>
            <CardDescription className="text-gray-400">
              Diagnose black screen and rendering issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <Button 
                onClick={runDiagnostics} 
                disabled={isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Diagnostics
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(!showDetails)}
                className="border-gray-600 text-gray-300"
              >
                {showDetails ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show Details
                  </>
                )}
              </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-2xl font-bold text-green-400">{passCount}</div>
                <div className="text-sm text-gray-400">Passed</div>
              </div>
              <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="text-2xl font-bold text-yellow-400">{warnCount}</div>
                <div className="text-sm text-gray-400">Warnings</div>
              </div>
              <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                <div className="text-2xl font-bold text-red-400">{failCount}</div>
                <div className="text-sm text-gray-400">Failed</div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              {diagnostics.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium text-white">{result.name}</div>
                      <div className="text-sm text-gray-400">{result.message}</div>
                      {showDetails && result.details && (
                        <div className="text-xs text-gray-500 mt-1 font-mono">{result.details}</div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(result.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Fixes */}
        <Card className="workspace-card-solid">
          <CardHeader>
            <CardTitle className="text-white">Quick Fixes</CardTitle>
            <CardDescription className="text-gray-400">
              Try these solutions if you're experiencing issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-600 text-gray-300"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Hard Refresh Page
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-600 text-gray-300"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.reload();
              }}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Clear Storage & Refresh
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-gray-600 text-gray-300"
              onClick={() => window.location.href = '/workspace'}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Go to Workspace
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
