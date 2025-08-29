import React from 'react';
import { cn } from '@/lib/utils';

interface WorkspaceContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({ 
  children, 
  className 
}) => {
  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950",
      className
    )}>
      {children}
    </div>
  );
};

interface WorkspaceHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ 
  children, 
  className 
}) => {
  return (
    <header className={cn(
      "sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-white/10",
      className
    )}>
      {children}
    </header>
  );
};
