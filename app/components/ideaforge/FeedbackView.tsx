"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Star,
  Users,
  TrendingUp
} from "lucide-react";
import IdeaProgressOverview from "./IdeaProgressOverview";

interface FeedbackItem {
  id: string;
  author: string;
  content: string;
  type: 'positive' | 'negative' | 'suggestion';
  timestamp: string;
  likes: number;
}

interface FeedbackViewProps {
  ideaId?: string;
}

const FeedbackView: React.FC<FeedbackViewProps> = ({ ideaId }) => {
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | 'suggestion'>('positive');
  
  // Mock feedback data
  const [feedback] = useState<FeedbackItem[]>([
    {
      id: '1',
      author: 'Sarah Chen',
      content: 'This is a brilliant idea! The market timing seems perfect for this type of solution.',
      type: 'positive',
      timestamp: '2 hours ago',
      likes: 12
    },
    {
      id: '2',
      author: 'Mike Johnson',
      content: 'Have you considered the competition from existing players? Might need stronger differentiation.',
      type: 'negative',
      timestamp: '4 hours ago',
      likes: 8
    },
    {
      id: '3',
      author: 'Alex Rivera',
      content: 'Consider adding a freemium model to lower the barrier to entry for new users.',
      type: 'suggestion',
      timestamp: '1 day ago',
      likes: 15
    }
  ]);

  const handleSubmitFeedback = () => {
    if (!newFeedback.trim()) return;
    
    // In a real app, this would submit to the backend
    console.log('Submitting feedback:', { content: newFeedback, type: feedbackType });
    setNewFeedback('');
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'positive': return <ThumbsUp className="h-4 w-4 text-green-500" />;
      case 'negative': return <ThumbsDown className="h-4 w-4 text-red-500" />;
      case 'suggestion': return <Star className="h-4 w-4 text-yellow-500" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getFeedbackBadgeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'negative': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'suggestion': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <IdeaProgressOverview
        wikiProgress={75}
        blueprintProgress={60}
        journeyProgress={40}
        feedbackProgress={30}
        showOverallProgress={true}
      />

      {/* Feedback Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-effect-theme workspace-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <ThumbsUp className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-sm text-gray-400">Positive</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-theme workspace-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Star className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-gray-400">Suggestions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect-theme workspace-hover">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">89</p>
                <p className="text-sm text-gray-400">Contributors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add New Feedback */}
      <Card className="glass-effect-theme">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-400" />
            Share Your Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            {(['positive', 'negative', 'suggestion'] as const).map((type) => (
              <Button
                key={type}
                variant={feedbackType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFeedbackType(type)}
                className={feedbackType === type ?
                  'workspace-button' :
                  'border-green-500/30 text-green-400 hover:bg-green-600/10'
                }
              >
                {getFeedbackIcon(type)}
                <span className="ml-2 capitalize">{type}</span>
              </Button>
            ))}
          </div>

          <Textarea
            placeholder="Share your thoughts, suggestions, or concerns about this idea..."
            value={newFeedback}
            onChange={(e) => setNewFeedback(e.target.value)}
            className="min-h-[100px] bg-black/30 border-green-500/20 text-white placeholder:text-gray-500 focus:border-green-500/40"
          />

          <Button
            onClick={handleSubmitFeedback}
            disabled={!newFeedback.trim()}
            className="workspace-button"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Feedback
          </Button>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <div className="space-y-4">
        <h3 className="workspace-heading flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-400" />
          Community Feedback
        </h3>

        {feedback.map((item) => (
          <Card key={item.id} className="glass-effect-theme workspace-hover">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-green-600 text-white text-sm">
                    {item.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white">{item.author}</span>
                    <Badge className={getFeedbackBadgeColor(item.type)}>
                      {getFeedbackIcon(item.type)}
                      <span className="ml-1 capitalize">{item.type}</span>
                    </Badge>
                    <span className="text-sm text-gray-400">{item.timestamp}</span>
                  </div>

                  <p className="text-gray-300">{item.content}</p>

                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-600/10">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-400 hover:bg-green-600/10">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeedbackView;
