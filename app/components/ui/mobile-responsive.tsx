/**
 * Mobile Responsive Components
 * Provides mobile-optimized components and utilities for responsive design
 */

import React from 'react'
import { cn } from '@/lib/utils'

// Mobile Container Component
interface MobileContainerProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function MobileContainer({ 
  children, 
  className, 
  padding = 'md',
  maxWidth = 'full'
}: MobileContainerProps) {
  const paddingClasses = {
    none: '',
    sm: 'mobile-padding-sm',
    md: 'mobile-padding',
    lg: 'mobile-padding-lg'
  }

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-none'
  }

  return (
    <div className={cn(
      'mobile-container mx-auto',
      paddingClasses[padding],
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}

// Mobile Button Component
interface MobileButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  children: React.ReactNode
}

export function MobileButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: MobileButtonProps) {
  const baseClasses = 'mobile-touch-target font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary',
    ghost: 'hover:bg-accent hover:text-accent-foreground focus:ring-accent',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-accent'
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[40px]',
    md: 'px-4 py-2 text-base min-h-[44px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]'
  }

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// Mobile Card Component
interface MobileCardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
  onClick?: () => void
}

export function MobileCard({
  children,
  className,
  padding = 'md',
  interactive = false,
  onClick
}: MobileCardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div
      className={cn(
        'bg-card text-card-foreground rounded-lg border shadow-sm',
        paddingClasses[padding],
        interactive && 'mobile-touch-target cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

// Mobile Input Component
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  fullWidth?: boolean
}

export function MobileInput({
  label,
  error,
  fullWidth = true,
  className,
  ...props
}: MobileInputProps) {
  return (
    <div className={cn('space-y-2', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-foreground mobile-text">
          {label}
        </label>
      )}
      <input
        className={cn(
          'mobile-input w-full px-3 py-2 text-base bg-background border border-input rounded-md',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'placeholder:text-muted-foreground',
          'min-h-[44px]', // Ensure minimum touch target size
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive mobile-text">
          {error}
        </p>
      )}
    </div>
  )
}

// Mobile Grid Component
interface MobileGridProps {
  children: React.ReactNode
  className?: string
  cols?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  responsive?: boolean
}

export function MobileGrid({
  children,
  className,
  cols = 2,
  gap = 'md',
  responsive = true
}: MobileGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  }

  const colClasses = responsive ? {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  } : {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  return (
    <div className={cn(
      'grid',
      colClasses[cols],
      gapClasses[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Mobile Stack Component
interface MobileStackProps {
  children: React.ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export function MobileStack({
  children,
  className,
  spacing = 'md',
  align = 'stretch'
}: MobileStackProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  }

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }

  return (
    <div className={cn(
      'flex flex-col',
      spacingClasses[spacing],
      alignClasses[align],
      className
    )}>
      {children}
    </div>
  )
}

// Mobile Text Component
interface MobileTextProps {
  children: React.ReactNode
  className?: string
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  weight?: 'normal' | 'medium' | 'semibold' | 'bold'
  color?: 'default' | 'muted' | 'accent' | 'destructive'
}

export function MobileText({
  children,
  className,
  size = 'base',
  weight = 'normal',
  color = 'default'
}: MobileTextProps) {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const colorClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    destructive: 'text-destructive'
  }

  return (
    <span className={cn(
      'mobile-text',
      sizeClasses[size],
      weightClasses[weight],
      colorClasses[color],
      className
    )}>
      {children}
    </span>
  )
}
