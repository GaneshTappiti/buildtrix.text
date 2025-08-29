// Provider Configuration Form - Form for configuring AI provider settings
"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, TestTube, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { AIProviderConfig } from '@/types/aiProvider';
import { useToast } from '@/hooks/use-toast';

interface ProviderConfigFormProps {
  config?: AIProviderConfig;
  onSave: (config: Partial<AIProviderConfig>) => void;
  onTest?: (config: Partial<AIProviderConfig>) => Promise<boolean>;
}

export const ProviderConfigForm: React.FC<ProviderConfigFormProps> = ({
  config,
  onSave,
  onTest
}) => {
  const [formData, setFormData] = useState({
    provider: config?.provider || 'openai',
    apiKey: config?.apiKey || '',
    model: config?.model || '',
    temperature: config?.temperature || 0.7,
    maxTokens: config?.maxTokens || 2048,
    baseUrl: config?.baseUrl || ''
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTestResult(null); // Clear test result when form changes
  };

  const handleTest = async () => {
    if (!formData.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key to test the connection.",
        variant: "destructive"
      });
      return;
    }

    setTesting(true);
    try {
      const success = onTest ? await onTest(formData) : true;
      setTestResult({
        success,
        message: success ? "Connection successful!" : "Connection failed. Please check your settings."
      });
      
      toast({
        title: success ? "Test Successful" : "Test Failed",
        description: success ? "API connection is working correctly." : "Failed to connect to the API.",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: "Connection test failed. Please check your settings."
      });
      toast({
        title: "Test Failed",
        description: "An error occurred while testing the connection.",
        variant: "destructive"
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    if (!formData.apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an API key before saving.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Settings Saved",
      description: "Your AI provider settings have been saved successfully."
    });
  };

  const providers = [
    { value: 'openai', label: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
    { value: 'anthropic', label: 'Anthropic', models: ['claude-3-sonnet', 'claude-3-haiku'] },
    { value: 'google', label: 'Google', models: ['gemini-pro', 'gemini-pro-vision'] }
  ];

  const currentProvider = providers.find(p => p.value === formData.provider);

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Provider Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label className="text-white">AI Provider</Label>
          <Select value={formData.provider} onValueChange={(value) => handleInputChange('provider', value)}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              {providers.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label className="text-white">API Key</Label>
          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              value={formData.apiKey}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              placeholder="Enter your API key"
              className="bg-gray-700 border-gray-600 text-white pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Model Selection */}
        {currentProvider && (
          <div className="space-y-2">
            <Label className="text-white">Model</Label>
            <Select value={formData.model} onValueChange={(value) => handleInputChange('model', value)}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                {currentProvider.models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Temperature */}
        <div className="space-y-2">
          <Label className="text-white">Temperature: {formData.temperature}</Label>
          <Slider
            value={[formData.temperature]}
            onValueChange={(value) => handleInputChange('temperature', value[0])}
            max={2}
            min={0}
            step={0.1}
            className="w-full"
          />
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <Label className="text-white">Max Tokens</Label>
          <Input
            type="number"
            value={formData.maxTokens}
            onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
            min={1}
            max={100000}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        {/* Custom Base URL (for custom providers) */}
        {formData.provider === 'custom' && (
          <div className="space-y-2">
            <Label className="text-white">Base URL</Label>
            <Input
              value={formData.baseUrl}
              onChange={(e) => handleInputChange('baseUrl', e.target.value)}
              placeholder="https://api.example.com/v1"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        )}

        {/* Test Result */}
        {testResult && (
          <Alert className={testResult.success ? "border-green-600 bg-green-600/10" : "border-red-600 bg-red-600/10"}>
            <div className="flex items-center gap-2">
              {testResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-400" />
              )}
              <AlertDescription className={testResult.success ? "text-green-400" : "text-red-400"}>
                {testResult.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleTest}
            disabled={testing || !formData.apiKey}
            variant="outline"
            className="flex-1"
          >
            <TestTube className="mr-2 h-4 w-4" />
            {testing ? "Testing..." : "Test Connection"}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!formData.apiKey}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
