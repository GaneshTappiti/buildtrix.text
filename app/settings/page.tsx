"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { 
  Settings as SettingsIcon, 
  Key, 
  CreditCard, 
  User, 
  Bell, 
  Shield, 
  ChevronLeft,
  Crown,
  Zap,
  Menu
} from 'lucide-react';
import WorkspaceSidebar from '@/components/WorkspaceSidebar';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Mock user data
  const user = {
    email: "john.doe@example.com",
    id: "user_123456789",
    created_at: "2024-01-15T10:30:00Z"
  };

  // Mock subscription data
  const currentPlan = {
    name: "Pro Plan",
    price: 29,
    interval: "month",
    tier: "pro",
    features: [
      "Unlimited AI-generated ideas",
      "Advanced document templates", 
      "Priority support",
      "5 team members",
      "MVP Studio access"
    ]
  };

  const isFreeTier = false;
  const isOnTrial = false;
  const trialDaysRemaining = 0;

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false
  });

  const handleStartTrial = async () => {
    toast({
      title: "Trial Started!",
      description: "Your 7-day Pro trial has begun.",
    });
  };

  const handleCancelSubscription = async () => {
    toast({
      title: "Subscription Cancelled",
      description: "Your subscription will be cancelled at the end of the current period.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="dark min-h-screen bg-green-glass">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      
      <div className={`fixed left-0 top-0 h-full transition-transform duration-300 z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <WorkspaceSidebar />
      </div>

      <main className="flex-1 transition-all duration-300">
        {/* Top Navigation Bar */}
        <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white hover:bg-black/30"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Sidebar</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                  onClick={() => router.push('/workspace')}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Workspace
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-gray-400" />
                <span className="text-white font-medium">Settings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 max-w-6xl mx-auto">
          <Tabs defaultValue="api-keys" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-gray-900/50">
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Subscription
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Key Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Key className="h-8 w-8 text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">API Key Manager</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      API key management will be available soon. You'll be able to manage your API keys for various AI providers here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription" className="space-y-6">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Current Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {currentPlan?.name || 'Free Plan'}
                      </h3>
                      <p className="text-gray-400">
                        {currentPlan?.price === 0 
                          ? 'No cost' 
                          : `$${currentPlan?.price}/${currentPlan?.interval}`
                        }
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isOnTrial && (
                        <Badge className="bg-blue-600/20 text-blue-400">
                          Trial - {trialDaysRemaining} days left
                        </Badge>
                      )}
                      <Badge 
                        className={
                          isFreeTier 
                            ? 'bg-gray-600/20 text-gray-400' 
                            : 'bg-yellow-600/20 text-yellow-400'
                        }
                      >
                        {currentPlan?.tier || 'free'}
                      </Badge>
                    </div>
                  </div>

                  {currentPlan?.features && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Features</h4>
                      <ul className="space-y-1">
                        {currentPlan.features.map((feature, index) => (
                          <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                            <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    {isFreeTier && !isOnTrial && (
                      <Button
                        onClick={handleStartTrial}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Start Free Trial
                      </Button>
                    )}
                    
                    {isFreeTier && (
                      <Button
                        onClick={() => toast({ title: "Upgrade", description: "Payment integration coming soon!" })}
                        className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                    )}

                    {!isFreeTier && (
                      <Button
                        variant="outline"
                        onClick={handleCancelSubscription}
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        Cancel Subscription
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <p className="text-white mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">User ID</Label>
                    <p className="text-gray-400 text-sm mt-1 font-mono">{user?.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-300">Account Created</Label>
                    <p className="text-gray-400 text-sm mt-1">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="workspace-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Email Notifications</Label>
                      <p className="text-gray-400 text-sm">Receive updates about your account and features</p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, email: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Push Notifications</Label>
                      <p className="text-gray-400 text-sm">Get notified about important updates</p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, push: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Marketing Communications</Label>
                      <p className="text-gray-400 text-sm">Receive tips, tutorials, and product updates</p>
                    </div>
                    <Switch
                      checked={notifications.marketing}
                      onCheckedChange={(checked) =>
                        setNotifications(prev => ({ ...prev, marketing: checked }))
                      }
                    />
                  </div>

                  <Button className="w-full mt-6 workspace-button" onClick={handleSavePreferences}>
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
