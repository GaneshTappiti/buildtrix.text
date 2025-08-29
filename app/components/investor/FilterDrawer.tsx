"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Filter, X } from "lucide-react";

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ open, onClose, children }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="bg-black/90 border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="text-white">Advanced Filters</SheetTitle>
          <SheetDescription className="text-gray-400">
            Refine your search with detailed filters
          </SheetDescription>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Investment Range */}
          <div className="space-y-3">
            <Label className="text-white">Investment Range</Label>
            <Slider
              defaultValue={[500000, 5000000]}
              max={10000000}
              min={100000}
              step={100000}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>$100K</span>
              <span>$10M</span>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="space-y-3">
            <Label className="text-white">Focus Areas</Label>
            <div className="space-y-2">
              {['AI/ML', 'SaaS', 'FinTech', 'HealthTech', 'Climate Tech'].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox id={area} />
                  <Label htmlFor={area} className="text-gray-300">{area}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-white">Location</Label>
            <div className="space-y-2">
              {['San Francisco', 'New York', 'Austin', 'Seattle', 'Remote'].map((location) => (
                <div key={location} className="flex items-center space-x-2">
                  <Checkbox id={location} />
                  <Label htmlFor={location} className="text-gray-300">{location}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Clear All
            </Button>
            <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;
