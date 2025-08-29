"use client";

import React from "react";
import { StoredIdea } from "@/types/ideaforge";

interface WikiViewProps {
  idea: StoredIdea;
  onUpdate?: (updates: Partial<StoredIdea>) => void;
}

const WikiView: React.FC<WikiViewProps> = ({ idea, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="text-white">Wiki View for {idea.title}</div>
    </div>
  );
};

export default WikiView;
