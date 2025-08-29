"use client";

import React, { createContext, useContext, useState } from 'react';

interface AdminContextType {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  adminSettings: {
    debugMode: boolean;
    maintenanceMode: boolean;
    allowNewUsers: boolean;
  };
  updateAdminSettings: (settings: Partial<AdminContextType['adminSettings']>) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false); // Mock admin status
  const [adminSettings, setAdminSettings] = useState({
    debugMode: false,
    maintenanceMode: false,
    allowNewUsers: true
  });

  const updateAdminSettings = (newSettings: Partial<typeof adminSettings>) => {
    setAdminSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    isAdmin,
    setIsAdmin,
    adminSettings,
    updateAdminSettings
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
