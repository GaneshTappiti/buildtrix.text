"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserPlus,
  ChevronLeft,
  Menu,
  X,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  BarChart3,
  Settings,
  Monitor,
  Mic,
  MicOff,
  VideoOff,
  Volume2,
  VolumeX,
  ScreenShare,
  MoreHorizontal,
  Clock,
  Target,
  TrendingUp,
  Award,
  Zap,
  Brain,
  FileText,
  CheckCircle2,
  AlertCircle,
  Star,
  Activity
} from "lucide-react";
import Link from "next/link";
import TeamMemberCard from "@/components/teamspace/TeamMemberCard";
import AddTeamMemberModal from "@/components/teamspace/AddTeamMemberModal";
import TeamRoles from "@/components/teamspace/TeamRoles";
import TaskList from "@/components/teamspace/TaskList";
import MessagesPanel from "@/components/teamspace/MessagesPanel";
import MeetingsList from "@/components/teamspace/MeetingsList";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import WorkspaceSidebar from "@/components/WorkspaceSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  joinedAt: string;
  skills: string[];
  currentTask?: string;
}

interface Meeting {
  id: number;
  title: string;
  date: string;
  time: string;
  duration: string;
  attendees: string[];
  type: 'video' | 'audio' | 'screen-share';
  status: 'upcoming' | 'ongoing' | 'completed';
}

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  tags: string[];
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'system';
}

export default function TeamSpacePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Mock data - in production, this would come from your database
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex@startup.com",
      role: "Product Manager",
      avatar: "/api/placeholder/40/40",
      status: 'online',
      joinedAt: "2024-01-15",
      skills: ["Product Strategy", "User Research", "Agile"],
      currentTask: "Define MVP features"
    },
    {
      id: 2,
      name: "Sarah Chen",
      email: "sarah@startup.com",
      role: "Lead Developer",
      avatar: "/api/placeholder/40/40",
      status: 'online',
      joinedAt: "2024-01-10",
      skills: ["React", "Node.js", "AWS"],
      currentTask: "Backend API development"
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      email: "mike@startup.com",
      role: "UI/UX Designer",
      avatar: "/api/placeholder/40/40",
      status: 'away',
      joinedAt: "2024-01-20",
      skills: ["Figma", "User Testing", "Prototyping"],
      currentTask: "Mobile app wireframes"
    }
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 1,
      title: "Daily Standup",
      date: "2024-01-25",
      time: "09:00",
      duration: "30 min",
      attendees: ["Alex Johnson", "Sarah Chen", "Mike Rodriguez"],
      type: 'video',
      status: 'upcoming'
    },
    {
      id: 2,
      title: "Sprint Planning",
      date: "2024-01-26",
      time: "14:00",
      duration: "2 hours",
      attendees: ["Alex Johnson", "Sarah Chen"],
      type: 'video',
      status: 'upcoming'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Implement user authentication",
      description: "Set up secure login and registration system",
      assignee: "Sarah Chen",
      priority: 'high',
      status: 'in-progress',
      dueDate: "2024-01-30",
      tags: ["backend", "security"]
    },
    {
      id: 2,
      title: "Design onboarding flow",
      description: "Create user-friendly onboarding experience",
      assignee: "Mike Rodriguez",
      priority: 'medium',
      status: 'todo',
      dueDate: "2024-02-05",
      tags: ["design", "ux"]
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Alex Johnson",
      content: "Great progress on the authentication system, Sarah!",
      timestamp: "10:30 AM",
      type: 'text'
    },
    {
      id: 2,
      sender: "Sarah Chen",
      content: "Thanks! Should have it ready for testing by tomorrow.",
      timestamp: "10:32 AM",
      type: 'text'
    }
  ]);

  const handleAddMember = (memberData: Partial<TeamMember>) => {
    const newMember: TeamMember = {
      id: teamMembers.length + 1,
      name: memberData.name || '',
      email: memberData.email || '',
      role: memberData.role || '',
      avatar: "/api/placeholder/40/40",
      status: 'offline',
      joinedAt: new Date().toISOString().split('T')[0],
      skills: memberData.skills || [],
      currentTask: undefined
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsAddMemberModalOpen(false);
    
    toast({
      title: "Team member added!",
      description: `${newMember.name} has been added to your team.`,
    });
  };

  const handleStartVideoCall = () => {
    setIsVideoCallActive(true);
    toast({
      title: "Video call started",
      description: "You're now in a video call with your team.",
    });
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    toast({
      title: "Video call ended",
      description: "The video call has been ended.",
    });
  };

  // Video call and analytics functionality will be implemented in future updates

  return (
    <div className="layout-container bg-gradient-to-br from-black via-gray-900 to-green-950">
      <WorkspaceSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <main className="layout-main transition-all duration-300">
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
                </Button>
                <Link
                  href="/workspace"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Workspace</span>
                </Link>
              </div>
              <Button
                onClick={() => setIsAddMemberModalOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 workspace-content-spacing">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-white">TeamSpace</h1>
            </div>
            <p className="text-gray-400 text-lg">
              Collaborate with your team, manage tasks, and stay connected
            </p>
          </div>

          {/* Main Content Container */}
          <div className="bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="bg-black/40 backdrop-blur-sm border-white/10">
                <TabsTrigger value="overview" className="data-[state=active]:bg-green-600">
                  <Users className="h-4 w-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-green-600">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Tasks
                </TabsTrigger>
                <TabsTrigger value="messages" className="data-[state=active]:bg-green-600">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="meetings" className="data-[state=active]:bg-green-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  Meetings
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                {/* Team Members Grid */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Team Members</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member) => (
                      <TeamMemberCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h2 className="text-xl font-semibold text-white mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button
                      onClick={handleStartVideoCall}
                      className="bg-green-600 hover:bg-green-700 h-16 text-left justify-start"
                    >
                      <Video className="h-6 w-6 mr-3" />
                      <div>
                        <div className="font-medium">Start Video Call</div>
                        <div className="text-sm opacity-80">Connect with your team</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="bg-black/20 border-white/10 hover:bg-black/30 h-16 text-left justify-start"
                      onClick={() => setActiveTab('messages')}
                    >
                      <MessageSquare className="h-6 w-6 mr-3 text-blue-400" />
                      <div>
                        <div className="font-medium text-white">Team Chat</div>
                        <div className="text-sm text-gray-400">Send a message</div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="bg-black/20 border-white/10 hover:bg-black/30 h-16 text-left justify-start"
                      onClick={() => setActiveTab('tasks')}
                    >
                      <Target className="h-6 w-6 mr-3 text-purple-400" />
                      <div>
                        <div className="font-medium text-white">Assign Task</div>
                        <div className="text-sm text-gray-400">Create new task</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tasks">
                <TaskList tasks={tasks} onTaskUpdate={setTasks} />
              </TabsContent>

              <TabsContent value="messages">
                <MessagesPanel messages={messages} onSendMessage={setMessages} />
              </TabsContent>

              <TabsContent value="meetings">
                <MeetingsList meetings={meetings} onScheduleMeeting={setMeetings} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Team Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Tasks Completed</span>
                            <span className="text-white">85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Sprint Progress</span>
                            <span className="text-white">72%</span>
                          </div>
                          <Progress value={72} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Team Velocity</span>
                            <span className="text-white">94%</span>
                          </div>
                          <Progress value={94} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-black/40 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Messages sent today</span>
                          <span className="text-white font-medium">47</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Meetings this week</span>
                          <span className="text-white font-medium">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Tasks created</span>
                          <span className="text-white font-medium">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Average response time</span>
                          <span className="text-white font-medium">2.3h</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Video Call Overlay */}
        {isVideoCallActive && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-lg p-6 max-w-4xl w-full mx-4">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Team Video Call</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEndVideoCall}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Video Grid Placeholder */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {teamMembers.filter(m => m.status === 'online').map((member) => (
                  <div key={member.id} className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-medium">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <p className="text-white text-sm">{member.name}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsMuted(!isMuted)}
                  className="bg-black/20 border-white/10"
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isVideoOff ? "destructive" : "outline"}
                  size="icon"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className="bg-black/20 border-white/10"
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </Button>

                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="icon"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className="bg-black/20 border-white/10"
                >
                  <ScreenShare className="h-5 w-5" />
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleEndVideoCall}
                  className="px-6"
                >
                  End Call
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Add Team Member Modal */}
        <AddTeamMemberModal
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onAddMember={handleAddMember}
        />
      </main>
    </div>
  );
}
