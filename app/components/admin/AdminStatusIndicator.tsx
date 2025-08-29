import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

const AdminStatusIndicator: React.FC = () => {
  const { isAdmin, adminSettings } = useAdmin();

  if (!isAdmin) return null;

  const getStatusIcon = () => {
    if (adminSettings.maintenanceMode) {
      return <AlertTriangle className="h-3 w-3" />;
    }
    return <CheckCircle className="h-3 w-3" />;
  };

  const getStatusColor = () => {
    if (adminSettings.maintenanceMode) {
      return 'bg-yellow-600/20 text-yellow-400';
    }
    return 'bg-green-600/20 text-green-400';
  };

  const getStatusText = () => {
    if (adminSettings.maintenanceMode) {
      return 'Maintenance Mode';
    }
    return 'System Operational';
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className="bg-blue-600/20 text-blue-400">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
      <Badge className={getStatusColor()}>
        {getStatusIcon()}
        <span className="ml-1">{getStatusText()}</span>
      </Badge>
    </div>
  );
};

export default AdminStatusIndicator;
