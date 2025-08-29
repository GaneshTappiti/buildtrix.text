import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Crown } from 'lucide-react';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';

interface FeatureGateProps {
  feature: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  children, 
  fallback 
}) => {
  const { hasAccess, canUseFeature, isProUser } = useFeatureAccess();

  if (hasAccess(feature) && canUseFeature(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Default upgrade prompt
  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardContent className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-yellow-600/20 rounded-full">
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-400 mb-6">
          This feature requires a Pro subscription to access.
        </p>
        <Button className="bg-yellow-600 hover:bg-yellow-700">
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Pro
        </Button>
      </CardContent>
    </Card>
  );
};

export default FeatureGate;
