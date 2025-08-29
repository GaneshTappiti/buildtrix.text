"use client"

import { cn } from "@/lib/utils";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
};

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-6 py-4',
  lg: 'px-8 py-6'
};

export function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = 'full',
  padding = 'md'
}: ResponsiveContainerProps) {
  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6'
};

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gridClasses = [
    'grid',
    gapClasses[gap]
  ];

  // Add responsive column classes
  if (cols.default) gridClasses.push(`grid-cols-${cols.default}`);
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div className={cn(gridClasses.join(' '), className)}>
      {children}
    </div>
  );
}

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal' | 'responsive';
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  className?: string;
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch'
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around'
};

export function ResponsiveStack({
  children,
  direction = 'vertical',
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  className = ''
}: ResponsiveStackProps) {
  const stackClasses = [
    'flex',
    gapClasses[gap],
    alignClasses[align],
    justifyClasses[justify]
  ];

  // Add direction classes
  if (direction === 'vertical') {
    stackClasses.push('flex-col');
  } else if (direction === 'horizontal') {
    stackClasses.push('flex-row');
  } else if (direction === 'responsive') {
    stackClasses.push('flex-col md:flex-row');
  }

  return (
    <div className={cn(stackClasses.join(' '), className)}>
      {children}
    </div>
  );
}

// Hook for responsive breakpoints
export function useResponsive() {
  const [breakpoint, setBreakpoint] = React.useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  React.useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl'
  };
}

import React from 'react';
