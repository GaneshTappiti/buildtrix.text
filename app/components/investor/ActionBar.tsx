"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  Download,
  Share2
} from "lucide-react";

interface ActionBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterClick: () => void;
  onAddClick: () => void;
  className?: string;
}

const ActionBar: React.FC<ActionBarProps> = ({
  searchQuery,
  onSearchChange,
  onFilterClick,
  onAddClick,
  className
}) => {
  return (
    <div className={`flex flex-col md:flex-row gap-4 ${className}`}>
      {/* Search Bar */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search investors by name, company, position, or focus areas..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-black/20 border-white/10 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onFilterClick}
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="border-white/10 hover:bg-white/5 text-white"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default ActionBar;
