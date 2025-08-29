"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Send } from "lucide-react";

const MessagesPanel: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  
  const messages = [
    {
      id: '1',
      sender: 'John Doe',
      message: 'Hey team, the new feature is ready for testing!',
      timestamp: '10:30 AM',
      avatar: 'JD'
    },
    {
      id: '2',
      sender: 'Jane Smith',
      message: 'Great work! I\'ll start testing it now.',
      timestamp: '10:32 AM',
      avatar: 'JS'
    },
    {
      id: '3',
      sender: 'Mike Johnson',
      message: 'Can we schedule a quick review meeting?',
      timestamp: '10:35 AM',
      avatar: 'MJ'
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <Card className="workspace-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Team Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-green-600 text-white text-xs">
                  {message.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{message.sender}</span>
                  <span className="text-xs text-gray-400">{message.timestamp}</span>
                </div>
                <p className="text-sm text-gray-300">{message.message}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="bg-black/20 border-white/10 text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesPanel;
