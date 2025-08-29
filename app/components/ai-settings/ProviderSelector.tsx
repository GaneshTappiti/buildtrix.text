"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ExternalLink } from 'lucide-react';

interface Provider {
  id: string;
  name: string;
  description: string;
  pricing: string;
  features: string[];
  isActive?: boolean;
}

interface ProviderSelectorProps {
  currentProvider?: string;
  onProviderChange: (providerId: string) => void;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  currentProvider,
  onProviderChange
}) => {
  const providers: Provider[] = [
    {
      id: 'openai',
      name: 'OpenAI',
      description: 'GPT-4 and other advanced language models',
      pricing: 'Pay-per-use',
      features: ['GPT-4', 'Code completion', 'Image generation'],
      isActive: currentProvider === 'openai'
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      description: 'Claude models with strong reasoning capabilities',
      pricing: 'Pay-per-use',
      features: ['Claude 3', 'Long context', 'Safe AI'],
      isActive: currentProvider === 'anthropic'
    },
    {
      id: 'google',
      name: 'Google AI',
      description: 'Gemini models with multimodal capabilities',
      pricing: 'Free tier available',
      features: ['Gemini Pro', 'Vision', 'Free tier'],
      isActive: currentProvider === 'google'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Choose Your AI Provider</h3>
        <p className="text-gray-400 text-sm">Select the AI provider that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {providers.map((provider) => (
          <Card 
            key={provider.id} 
            className={`bg-gray-800 border-gray-700 cursor-pointer transition-all hover:border-gray-600 ${
              provider.isActive ? 'ring-2 ring-green-500 border-green-500' : ''
            }`}
            onClick={() => onProviderChange(provider.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">{provider.name}</CardTitle>
                {provider.isActive && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
              <p className="text-gray-400 text-sm">{provider.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Badge variant="outline" className="text-xs">
                  {provider.pricing}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-white mb-2">Features:</h4>
                <div className="flex flex-wrap gap-1">
                  {provider.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={provider.isActive ? "default" : "outline"}
                  className={`flex-1 ${provider.isActive ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProviderChange(provider.id);
                  }}
                >
                  {provider.isActive ? 'Active' : 'Select'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`https://${provider.id}.com`, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
