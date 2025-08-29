"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertCircle, Plus } from "lucide-react";

const TaskList: React.FC = () => {
  const tasks = [
    {
      id: '1',
      title: 'Update user authentication',
      assignee: 'John Doe',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-01-20'
    },
    {
      id: '2',
      title: 'Design new landing page',
      assignee: 'Jane Smith',
      status: 'completed',
      priority: 'medium',
      dueDate: '2024-01-18'
    },
    {
      id: '3',
      title: 'Fix mobile responsiveness',
      assignee: 'Mike Johnson',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-01-25'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-400" />;
      case 'pending': return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="workspace-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Team Tasks</CardTitle>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 rounded-lg bg-black/20 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <h4 className="font-medium text-white">{task.title}</h4>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(task.status)}>
                  {task.status.replace('-', ' ')}
                </Badge>
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Assigned to: {task.assignee}</span>
              <span>Due: {task.dueDate}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TaskList;
