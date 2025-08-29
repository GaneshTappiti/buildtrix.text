"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, Settings } from "lucide-react";

const TeamRoles: React.FC = () => {
  const roles = [
    { name: 'Admin', count: 2, color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { name: 'Developer', count: 5, color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    { name: 'Designer', count: 3, color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    { name: 'Manager', count: 2, color: 'bg-green-500/20 text-green-400 border-green-500/30' }
  ];

  return (
    <Card className="workspace-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Team Roles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {roles.map((role) => (
          <div key={role.name} className="flex items-center justify-between">
            <span className="text-gray-300">{role.name}</span>
            <Badge className={role.color}>
              {role.count} members
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamRoles;
