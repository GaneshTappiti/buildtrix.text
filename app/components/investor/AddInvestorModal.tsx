"use client"

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface AddInvestorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddInvestorModal: React.FC<AddInvestorModalProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    firm: '',
    email: '',
    location: '',
    website: '',
    description: '',
    focusAreas: [] as string[],
    investmentRange: ''
  });
  const [newFocusArea, setNewFocusArea] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would submit to the backend
    console.log('Adding investor:', formData);
    
    toast({
      title: "Investor Added!",
      description: "The investor has been added to your network.",
    });
    
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      firm: '',
      email: '',
      location: '',
      website: '',
      description: '',
      focusAreas: [],
      investmentRange: ''
    });
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !formData.focusAreas.includes(newFocusArea.trim())) {
      setFormData(prev => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()]
      }));
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.filter(a => a !== area)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-black/90 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Plus className="h-5 w-5 text-green-400" />
            Add New Investor
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-black/20 border-white/10 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firm" className="text-white">Firm *</Label>
              <Input
                id="firm"
                value={formData.firm}
                onChange={(e) => setFormData(prev => ({ ...prev, firm: e.target.value }))}
                className="bg-black/20 border-white/10 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-white">Website</Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              className="bg-black/20 border-white/10 text-white"
              placeholder="https://"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentRange" className="text-white">Investment Range</Label>
            <Input
              id="investmentRange"
              value={formData.investmentRange}
              onChange={(e) => setFormData(prev => ({ ...prev, investmentRange: e.target.value }))}
              className="bg-black/20 border-white/10 text-white"
              placeholder="e.g., $500K - $5M"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Focus Areas</Label>
            <div className="flex gap-2">
              <Input
                value={newFocusArea}
                onChange={(e) => setNewFocusArea(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
                placeholder="Add focus area"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
              />
              <Button type="button" onClick={addFocusArea} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {formData.focusAreas.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.focusAreas.map((area, index) => (
                  <Badge key={index} className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    {area}
                    <button
                      type="button"
                      onClick={() => removeFocusArea(area)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
              placeholder="Brief description of the investor's background and investment thesis..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Investor
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInvestorModal;
