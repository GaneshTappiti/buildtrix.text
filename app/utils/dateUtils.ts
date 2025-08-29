/**
 * Date utilities to prevent hydration mismatches
 * Always use these utilities to ensure consistent date formatting between server and client
 */

export interface DateFormatOptions {
  locale?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  includeTime?: boolean;
}

/**
 * Format date consistently between server and client
 * Prevents hydration mismatches by using a fixed locale
 */
export function formatDate(
  date: Date | string,
  options: DateFormatOptions = {}
): string {
  const {
    locale = 'en-US',
    dateStyle = 'short',
    includeTime = false
  } = options;

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    dateStyle,
  };

  if (includeTime) {
    formatOptions.timeStyle = options.timeStyle || 'short';
  }

  return dateObj.toLocaleDateString(locale, formatOptions);
}

/**
 * Format date for "Due" display
 * Returns format like "Due 8/6/2025"
 */
export function formatDueDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Due: Invalid Date';
  }

  // Use specific format to ensure consistency
  return `Due ${dateObj.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric'
  })}`;
}

/**
 * Format date for calendar display
 * Returns format like "Aug 6, 2025"
 */
export function formatCalendarDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format date for display in lists and cards
 * Returns format like "MMM dd, yyyy"
 */
export function formatDisplayDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format relative time (e.g., "2 days ago", "Tomorrow")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const diffTime = dateObj.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;
  
  // For dates further out, return formatted date
  return formatDisplayDate(dateObj);
}

/**
 * Check if two dates are the same day
 */
export function isSameDay(date1: Date | string, date2: Date | string): boolean {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

/**
 * Get date in YYYY-MM-DD format for input fields
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return dateObj.toISOString().split('T')[0];
}
