"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AddPhaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPhase: (phase: { title: string; description: string; duration: string }) => void;
}

const AddPhaseModal: React.FC<AddPhaseModalProps> = ({
  isOpen,
  onClose,
  onAddPhase
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && description && duration) {
      onAddPhase({ title, description, duration });
      setTitle("");
      setDescription("");
      setDuration("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Phase</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-white">Phase Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter phase title"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter phase description"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div>
            <Label htmlFor="duration" className="text-white">Duration</Label>
            <Input
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 2 weeks"
              className="bg-gray-800 border-gray-600 text-white"
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
              Add Phase
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPhaseModal;
