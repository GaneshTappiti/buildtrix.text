import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text,
  className = '',
  fullScreen = false
}) => {
  const content = (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-green-400 ${sizeClasses[size]}`} />
      {text && (
        <p className={`text-gray-400 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Skeleton loading components
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gray-800/50 rounded-lg ${className}`}>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700/50 rounded w-1/2"></div>
      <div className="h-3 bg-gray-700/50 rounded w-2/3"></div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number; className?: string }> = ({ 
  items = 3, 
  className = '' 
}) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <SkeletonCard key={i} className="h-20" />
    ))}
  </div>
);

export const SkeletonText: React.FC<{ 
  lines?: number; 
  className?: string;
  widths?: string[];
}> = ({ 
  lines = 1, 
  className = '',
  widths = ['w-full']
}) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className={`h-4 bg-gray-700/50 rounded ${widths[i % widths.length] || 'w-full'}`}
      />
    ))}
  </div>
);

// Loading states for specific components
export const ProjectCardSkeleton: React.FC = () => (
  <div className="animate-pulse p-3 bg-black/20 rounded-lg border border-white/10">
    <div className="flex items-start justify-between mb-2">
      <div className="h-5 bg-gray-700/50 rounded w-2/3"></div>
      <div className="h-4 bg-gray-700/50 rounded w-16"></div>
    </div>
    <div className="h-3 bg-gray-700/50 rounded w-full mb-2"></div>
    <div className="flex items-center justify-between">
      <div className="h-3 bg-gray-700/50 rounded w-20"></div>
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-gray-700/50 rounded-full"></div>
        <div className="h-3 bg-gray-700/50 rounded w-8"></div>
      </div>
    </div>
  </div>
);

export const TaskCardSkeleton: React.FC = () => (
  <div className="animate-pulse p-3 bg-black/20 rounded-lg border border-white/10">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-700/50 rounded w-12"></div>
          <div className="h-3 bg-gray-700/50 rounded w-20"></div>
        </div>
      </div>
      <div className="h-4 w-4 bg-gray-700/50 rounded"></div>
    </div>
  </div>
);

export const NotificationSkeleton: React.FC = () => (
  <div className="animate-pulse p-3 rounded-lg">
    <div className="flex items-start gap-3">
      <div className="h-2 w-2 bg-gray-700/50 rounded-full mt-2"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700/50 rounded w-2/3 mb-1"></div>
        <div className="h-3 bg-gray-700/50 rounded w-full mb-1"></div>
        <div className="h-3 bg-gray-700/50 rounded w-16"></div>
      </div>
    </div>
  </div>
);

export default LoadingSpinner;
