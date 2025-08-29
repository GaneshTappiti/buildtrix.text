"use client"

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Share2, 
  Eye,
  Clock,
  Star
} from "lucide-react";

interface PitchDeckViewProps {
  className?: string;
}

const PitchDeckView: React.FC<PitchDeckViewProps> = ({ className }) => {
  const pitchDecks = [
    {
      id: '1',
      title: 'AI Fitness Coach - Series A Deck',
      company: 'FitAI',
      stage: 'Series A',
      views: 1250,
      lastUpdated: '2 days ago',
      rating: 4.8
    },
    {
      id: '2',
      title: 'EcoLogistics - Seed Round',
      company: 'EcoLogistics',
      stage: 'Seed',
      views: 890,
      lastUpdated: '1 week ago',
      rating: 4.6
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Pitch Decks</h3>
        <Button size="sm" className="bg-green-600 hover:bg-green-700">
          <FileText className="h-4 w-4 mr-2" />
          Upload Deck
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pitchDecks.map((deck) => (
          <Card key={deck.id} className="workspace-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">{deck.title}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {deck.stage}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-gray-400">
                  <Star className="h-3 w-3 text-yellow-400" />
                  {deck.rating}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {deck.views} views
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {deck.lastUpdated}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-3 w-3" />
                </Button>
                <Button size="sm" variant="outline">
                  <Share2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PitchDeckView;
