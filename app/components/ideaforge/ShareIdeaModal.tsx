"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Copy, 
  Mail, 
  MessageSquare, 
  Globe, 
  Lock,
  Users,
  Link as LinkIcon,
  Twitter,
  Linkedin,
  Facebook
} from "lucide-react";

interface ShareIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaTitle?: string;
  ideaDescription?: string;
}

const ShareIdeaModal: React.FC<ShareIdeaModalProps> = ({ 
  isOpen, 
  onClose, 
  ideaTitle = "My Startup Idea",
  ideaDescription = "An innovative solution to a common problem"
}) => {
  const { toast } = useToast();
  const [shareSettings, setShareSettings] = useState({
    isPublic: false,
    allowComments: true,
    allowCollaboration: false,
    requireApproval: true
  });
  const [customMessage, setCustomMessage] = useState('');
  const [shareLink] = useState(`https://builderblueprint.ai/ideas/${Math.random().toString(36).substr(2, 9)}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: "Link Copied!",
        description: "Share link has been copied to your clipboard.",
      });
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const text = `Check out my startup idea: ${ideaTitle}`;
    const url = shareLink;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handleEmailShare = () => {
    const subject = `Startup Idea: ${ideaTitle}`;
    const body = `Hi,\n\nI'd love to share my startup idea with you: ${ideaTitle}\n\n${ideaDescription}\n\nCheck it out here: ${shareLink}\n\n${customMessage}\n\nBest regards`;
    
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-5 w-5 text-green-400" />
            Share Your Idea
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Idea Preview */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <h3 className="font-semibold text-white mb-2">{ideaTitle}</h3>
            <p className="text-gray-300 text-sm">{ideaDescription}</p>
          </div>

          {/* Share Settings */}
          <div className="space-y-4">
            <h4 className="font-medium text-white">Privacy Settings</h4>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Public Visibility</Label>
                  <p className="text-xs text-gray-400">Make this idea discoverable by others</p>
                </div>
                <Switch
                  checked={shareSettings.isPublic}
                  onCheckedChange={(checked) => 
                    setShareSettings(prev => ({ ...prev, isPublic: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Allow Comments</Label>
                  <p className="text-xs text-gray-400">Let others provide feedback</p>
                </div>
                <Switch
                  checked={shareSettings.allowComments}
                  onCheckedChange={(checked) => 
                    setShareSettings(prev => ({ ...prev, allowComments: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-white">Collaboration</Label>
                  <p className="text-xs text-gray-400">Allow others to edit and contribute</p>
                </div>
                <Switch
                  checked={shareSettings.allowCollaboration}
                  onCheckedChange={(checked) => 
                    setShareSettings(prev => ({ ...prev, allowCollaboration: checked }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Share Link */}
          <div className="space-y-3">
            <Label className="text-white">Share Link</Label>
            <div className="flex gap-2">
              <Input
                value={shareLink}
                readOnly
                className="bg-black/20 border-white/10 text-white"
              />
              <Button onClick={handleCopyLink} variant="outline" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs">
              {shareSettings.isPublic ? (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <Globe className="h-3 w-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  Private
                </Badge>
              )}
              {shareSettings.allowComments && (
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Comments
                </Badge>
              )}
              {shareSettings.allowCollaboration && (
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  <Users className="h-3 w-3 mr-1" />
                  Collaboration
                </Badge>
              )}
            </div>
          </div>

          {/* Custom Message */}
          <div className="space-y-2">
            <Label className="text-white">Custom Message (Optional)</Label>
            <Textarea
              placeholder="Add a personal message to share with your idea..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Share Options */}
          <div className="space-y-3">
            <Label className="text-white">Share Via</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleEmailShare}
                variant="outline"
                className="justify-start border-white/10 hover:bg-white/5"
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              
              <Button
                onClick={() => handleSocialShare('twitter')}
                variant="outline"
                className="justify-start border-white/10 hover:bg-white/5"
              >
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              
              <Button
                onClick={() => handleSocialShare('linkedin')}
                variant="outline"
                className="justify-start border-white/10 hover:bg-white/5"
              >
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              
              <Button
                onClick={() => handleSocialShare('facebook')}
                variant="outline"
                className="justify-start border-white/10 hover:bg-white/5"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast({
                  title: "Idea Shared!",
                  description: "Your idea has been shared successfully.",
                });
                onClose();
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Idea
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareIdeaModal;
