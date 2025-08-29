import React from "react";
import { Button } from "@/components/ui/button";
import { Brain, PlusCircle } from "lucide-react";

interface IdeaEmptyStateProps {
  onCreateClick: () => void;
}

const IdeaEmptyState: React.FC<IdeaEmptyStateProps> = ({ onCreateClick }) => {
  return (
    <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center flex flex-col items-center animate-fade-in">
      <div className="rounded-full bg-green-600/20 p-6 mb-4">
        <Brain className="h-10 w-10 text-green-400" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2 text-white">Your IdeaForge is empty</h2>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">
        Start documenting your startup ideas with a powerful combination of 
        wiki-style documentation and blueprint execution tools.
      </p>
      
      <Button 
        size="lg" 
        className="gap-2 bg-green-600 hover:bg-green-700"
        onClick={onCreateClick}
      >
        <PlusCircle className="h-5 w-5" />
        Create Your First Idea
      </Button>
    </div>
  );
};

export default IdeaEmptyState;
