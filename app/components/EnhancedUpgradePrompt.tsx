import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Zap, Users, Infinity } from 'lucide-react';

interface EnhancedUpgradePromptProps {
  isOpen?: boolean;
  onClose?: () => void;
  feature?: string;
}

const EnhancedUpgradePrompt: React.FC<EnhancedUpgradePromptProps> = ({ 
  isOpen = true, 
  onClose,
  feature 
}) => {
  if (!isOpen) return null;

  const proFeatures = [
    { icon: <Infinity className="h-4 w-4" />, text: "Unlimited ideas and projects" },
    { icon: <Zap className="h-4 w-4" />, text: "Advanced AI features" },
    { icon: <Users className="h-4 w-4" />, text: "Team collaboration" },
    { icon: <Check className="h-4 w-4" />, text: "Priority support" },
  ];

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10 max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-yellow-600/20 rounded-full">
            <Crown className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <CardTitle className="text-white">Upgrade to Pro</CardTitle>
        <p className="text-gray-400">
          Unlock all features and supercharge your startup journey
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Feature Context */}
        {feature && (
          <div className="p-3 bg-yellow-600/10 rounded-lg border border-yellow-600/20">
            <p className="text-sm text-yellow-400">
              You need Pro access to use: <strong>{feature}</strong>
            </p>
          </div>
        )}

        {/* Pro Features List */}
        <div className="space-y-3">
          {proFeatures.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-green-400">
                {item.icon}
              </div>
              <span className="text-gray-300 text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing */}
        <div className="text-center p-4 bg-green-600/10 rounded-lg border border-green-600/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold text-white">$19</span>
            <span className="text-gray-400">/month</span>
            <Badge className="bg-green-600/20 text-green-400">Popular</Badge>
          </div>
          <p className="text-xs text-gray-400">
            Cancel anytime • 7-day free trial
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
            <Crown className="h-4 w-4 mr-2" />
            Start Free Trial
          </Button>
          {onClose && (
            <Button 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
              onClick={onClose}
            >
              Maybe Later
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedUpgradePrompt;
