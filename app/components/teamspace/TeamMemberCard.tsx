"use client"

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Mail, 
  MessageSquare, 
  MoreHorizontal,
  Calendar,
  CheckCircle,
  Clock
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy';
  tasksCompleted: number;
  totalTasks: number;
  lastActive: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onMessage?: (memberId: string) => void;
  onEmail?: (memberId: string) => void;
  className?: string;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  onMessage, 
  onEmail,
  className 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return 'Online';
      case 'busy': return 'Busy';
      case 'offline': return 'Offline';
      default: return 'Unknown';
    }
  };

  const completionPercentage = member.totalTasks > 0 
    ? Math.round((member.tasksCompleted / member.totalTasks) * 100) 
    : 0;

  return (
    <Card className={`workspace-card hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="bg-green-600 text-white">
                {member.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-black ${getStatusColor(member.status)}`} />
          </div>
          
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-white">{member.name}</h3>
              <p className="text-sm text-gray-400">{member.role}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                className={`text-xs ${
                  member.status === 'online' 
                    ? 'bg-green-500/20 text-green-400 border-green-500/30'
                    : member.status === 'busy'
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}
              >
                {getStatusText(member.status)}
              </Badge>
              <span className="text-xs text-gray-400">{member.lastActive}</span>
            </div>
            
            {/* Task Progress */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Tasks Progress</span>
                <span className="text-white">{member.tasksCompleted}/{member.totalTasks}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <div className="text-xs text-gray-400">{completionPercentage}% complete</div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onMessage?.(member.id)}
                className="flex-1 border-white/10 hover:bg-white/5"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Message
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onEmail?.(member.id)}
                className="border-white/10 hover:bg-white/5"
              >
                <Mail className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamMemberCard;
