import { formatDate, formatDueDate, formatCalendarDate, formatDisplayDate, formatRelativeTime, isSameDay, formatDateForInput } from '../app/utils/dateUtils';

// Test function to verify our date utilities work correctly
function testDateUtils() {
  const testDate = new Date('2025-08-06T10:30:00Z'); // August 6, 2025
  const today = new Date();
  
  console.log('🧪 Testing Date Utilities');
  console.log('========================');
  
  console.log('Test Date:', testDate.toISOString());
  console.log('');
  
  console.log('formatDate (default):', formatDate(testDate));
  console.log('formatDueDate:', formatDueDate(testDate));
  console.log('formatCalendarDate:', formatCalendarDate(testDate));
  console.log('formatDisplayDate:', formatDisplayDate(testDate));
  console.log('formatRelativeTime:', formatRelativeTime(testDate));
  console.log('formatDateForInput:', formatDateForInput(testDate));
  console.log('');
  
  // Test with string input
  console.log('String Input Tests:');
  console.log('formatDisplayDate (string):', formatDisplayDate('2025-08-06'));
  console.log('formatDueDate (string):', formatDueDate('2025-08-06'));
  console.log('');
  
  // Test isSameDay
  console.log('isSameDay Tests:');
  console.log('Same date:', isSameDay('2025-08-06', '2025-08-06T15:30:00Z'));
  console.log('Different date:', isSameDay('2025-08-06', '2025-08-07'));
  console.log('');
  
  // Test error handling
  console.log('Error Handling Tests:');
  console.log('Invalid date:', formatDisplayDate('invalid-date'));
  console.log('formatDueDate invalid:', formatDueDate('invalid'));
  console.log('');
  
  // Test consistency (this is the key fix for hydration)
  console.log('Consistency Tests (Server/Client should match):');
  const dateString = '2025-08-06';
  const result1 = formatDisplayDate(dateString);
  const result2 = formatDisplayDate(dateString);
  console.log('Call 1:', result1);
  console.log('Call 2:', result2);
  console.log('Consistent:', result1 === result2);
  
  console.log('✅ Date utility tests complete');
}

if (typeof window === 'undefined') {
  // Node.js environment
  testDateUtils();
} else {
  // Browser environment
  window.testDateUtils = testDateUtils;
  console.log('Date utilities loaded. Run testDateUtils() in console to test.');
}

export { testDateUtils };
