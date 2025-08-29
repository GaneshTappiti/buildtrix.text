import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { IdeaInput } from "@/types/ideaforge";

interface NewIdeaModalProps {
  onCreateIdea: (idea: IdeaInput) => void;
}

const NewIdeaModal: React.FC<NewIdeaModalProps> = ({ onCreateIdea }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newIdea: IdeaInput = {
      title: title.trim(),
      description: description.trim(),
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    };
    
    onCreateIdea(newIdea);
    handleReset();
    
    // Close modal
    const closeButton = document.querySelector("[data-dialog-close]") as HTMLButtonElement;
    if (closeButton) closeButton.click();
  };
  
  const handleReset = () => {
    setTitle("");
    setDescription("");
    setTags("");
  };

  return (
    <DialogContent className="sm:max-w-[550px] bg-black/90 backdrop-blur-xl border-white/10">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Create New Idea</DialogTitle>
          <DialogDescription className="text-gray-400">
            Capture your idea details. You can always edit this later.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium text-white">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Name your idea"
              required
              autoFocus
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium text-white">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe what your idea is about"
              rows={3}
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid gap-2">
            <label htmlFor="tags" className="text-sm font-medium text-white">
              Tags
            </label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="AI, Mobile App, SaaS (comma separated)"
              className="bg-black/20 border-white/10 text-white placeholder:text-gray-400"
            />
            <p className="text-xs text-gray-400">
              Separate tags with commas
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={handleReset} className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="bg-green-600 hover:bg-green-700">Create Idea</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewIdeaModal;
