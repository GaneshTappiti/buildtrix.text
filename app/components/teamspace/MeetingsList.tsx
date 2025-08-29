"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, Users, Plus } from "lucide-react";

const MeetingsList: React.FC = () => {
  const meetings = [
    {
      id: '1',
      title: 'Daily Standup',
      time: '9:00 AM',
      date: 'Today',
      attendees: 8,
      type: 'recurring',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Sprint Planning',
      time: '2:00 PM',
      date: 'Tomorrow',
      attendees: 6,
      type: 'meeting',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Design Review',
      time: '11:00 AM',
      date: 'Jan 22',
      attendees: 4,
      type: 'review',
      status: 'scheduled'
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'recurring': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'meeting': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'review': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="workspace-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Meetings
        </CardTitle>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Schedule
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting.id} className="p-3 rounded-lg bg-black/20 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-white">{meeting.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {meeting.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meeting.attendees}
                  </div>
                </div>
              </div>
              <Badge className={getTypeColor(meeting.type)}>
                {meeting.type}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 border-white/10 hover:bg-white/5">
                <Video className="h-3 w-3 mr-1" />
                Join
              </Button>
              <Button size="sm" variant="outline" className="border-white/10 hover:bg-white/5">
                Details
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default MeetingsList;
