"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Mock auth callback logic
    const handleAuthCallback = async () => {
      try {
        // Simulate processing auth callback
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock check for AI provider configuration
        const hasAIProvider = Math.random() > 0.5; // Random for demo
        
        // Mock check for new user (simulate 50% chance of being new user)
        const isNewUser = Math.random() > 0.5;
        
        // Redirect new users without AI provider to onboarding
        if (isNewUser && !hasAIProvider) {
          router.push('/onboarding');
        } else {
          router.push('/workspace');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        router.push('/auth');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-glass">
      <div className="text-center workspace-card p-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-400 mx-auto mb-4" />
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}
