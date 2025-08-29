// Mock feature access hook
// In a real application, this would check user subscription and permissions

interface FeatureAccess {
  hasAccess: (feature: string) => boolean;
  isProUser: boolean;
  canUseFeature: (feature: string) => boolean;
  getFeatureLimit: (feature: string) => number | null;
  getRemainingUsage: (feature: string) => number | null;
}

export function useFeatureAccess(): FeatureAccess {
  // Mock implementation - in real app this would check actual subscription
  const isProUser = false; // Mock free tier user
  
  const featureLimits = {
    'ideas': 3,
    'projects': 2,
    'ai-generations': 10,
    'exports': 5,
    'team-members': 1
  };

  const currentUsage = {
    'ideas': 1,
    'projects': 1,
    'ai-generations': 3,
    'exports': 2,
    'team-members': 1
  };

  const hasAccess = (feature: string): boolean => {
    if (isProUser) return true;
    
    // Free tier access rules
    const freeFeatures = [
      'basic-workspace',
      'idea-vault',
      'ideaforge',
      'basic-export'
    ];
    
    return freeFeatures.includes(feature);
  };

  const canUseFeature = (feature: string): boolean => {
    if (isProUser) return true;
    
    const limit = featureLimits[feature as keyof typeof featureLimits];
    const usage = currentUsage[feature as keyof typeof currentUsage];
    
    if (limit === undefined || usage === undefined) {
      return hasAccess(feature);
    }
    
    return usage < limit;
  };

  const getFeatureLimit = (feature: string): number | null => {
    if (isProUser) return null; // Unlimited for pro users
    return featureLimits[feature as keyof typeof featureLimits] || null;
  };

  const getRemainingUsage = (feature: string): number | null => {
    if (isProUser) return null; // Unlimited for pro users
    
    const limit = featureLimits[feature as keyof typeof featureLimits];
    const usage = currentUsage[feature as keyof typeof currentUsage];
    
    if (limit === undefined || usage === undefined) return null;
    
    return Math.max(0, limit - usage);
  };

  return {
    hasAccess,
    isProUser,
    canUseFeature,
    getFeatureLimit,
    getRemainingUsage
  };
}
