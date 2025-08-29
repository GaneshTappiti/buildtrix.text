import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Settings, Users, Database } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const AdminQuickActions: React.FC = () => {
  const { isAdmin, adminSettings, updateAdminSettings } = useAdmin();

  if (!isAdmin) return null;

  return (
    <Card className="bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-400" />
          Admin Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Maintenance Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Maintenance Mode</label>
            <p className="text-xs text-gray-400">Temporarily disable user access</p>
          </div>
          <Switch
            checked={adminSettings.maintenanceMode}
            onCheckedChange={(checked) => 
              updateAdminSettings({ maintenanceMode: checked })
            }
          />
        </div>

        {/* Debug Mode */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Debug Mode</label>
            <p className="text-xs text-gray-400">Show detailed error information</p>
          </div>
          <Switch
            checked={adminSettings.debugMode}
            onCheckedChange={(checked) => 
              updateAdminSettings({ debugMode: checked })
            }
          />
        </div>

        {/* Allow New Users */}
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-white">Allow New Users</label>
            <p className="text-xs text-gray-400">Enable user registration</p>
          </div>
          <Switch
            checked={adminSettings.allowNewUsers}
            onCheckedChange={(checked) => 
              updateAdminSettings({ allowNewUsers: checked })
            }
          />
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-4">
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Users className="h-4 w-4 mr-2" />
            User Management
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Database className="h-4 w-4 mr-2" />
            System Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminQuickActions;
