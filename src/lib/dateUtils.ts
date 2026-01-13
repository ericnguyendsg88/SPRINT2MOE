/**
 * Centralized date formatting utility
 * System-wide date format: DD/MM/YY
 */

/**
 * Format a date as DD/MM/YY (e.g., 12/01/26)
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return '—';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '—';
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear().toString().slice(-2);
  
  return `${day}/${month}/${year}`;
}

/**
 * Format a date as DD MMM YYYY (e.g., 12 Jan 2026) - for more detailed displays
 */
export function formatDateLong(date: Date | string | null | undefined): string {
  if (!date) return '—';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) return '—';
  
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get billing cycle label for a charge based on its due date
 * Returns the month and year of the billing cycle (e.g., "Jan 2026")
 */
export function getBillingCycleLabel(dueDate: Date | string): string {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  if (isNaN(d.getTime())) return '—';
  
  return d.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Get the next billing date (5th of next billing month)
 */
export function getNextBillingDate(today: Date = new Date()): Date {
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  
  // If we're before the 5th, next billing is the 5th of this month
  if (day < 5) {
    return new Date(year, month, 5);
  }
  
  // If we're on or after the 5th, next billing is 5th of next month
  if (month === 11) {
    return new Date(year + 1, 0, 5); // January of next year
  }
  return new Date(year, month + 1, 5);
}

/**
 * Get days until next billing date
 */
export function getDaysUntilNextBilling(today: Date = new Date()): number {
  const nextBilling = getNextBillingDate(today);
  const timeDiff = nextBilling.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

/**
 * Get the billing date (5th of the month) from a due date
 * Billing Date is always the 5th of the same month as the charge's due date
 */
export function getBillingDateFromDueDate(dueDate: Date | string): Date {
  const d = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return new Date(d.getFullYear(), d.getMonth(), 5);
}

/**
 * Get the due date (30th of the month) from a billing/due date
 * Due Date is always the 30th of the same month
 */
export function getDueDateFromBillingMonth(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  // Use 30 for all months (or last day for Feb)
  const year = d.getFullYear();
  const month = d.getMonth();
  // Get last day of month to handle Feb correctly
  const lastDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(30, lastDay));
}

/**
 * Get upcoming billing cycles for a course
 * @param billingCycle - The billing frequency (monthly, quarterly, biannually, yearly)
 * @param count - Number of upcoming cycles to return
 * @param startDate - Course start date to calculate from
 * @param endDate - Course end date to limit cycles
 * @returns Array of upcoming billing cycle dates within the course period
 */
export function getUpcomingBillingCycles(
  billingCycle: 'monthly' | 'quarterly' | 'biannually' | 'yearly',
  count: number = 3,
  startDate?: Date | string | null,
  endDate?: Date | string | null
): Date[] {
  const cycles: Date[] = [];
  const today = new Date();
  
  // Parse start and end dates
  const courseStart = startDate ? (typeof startDate === 'string' ? new Date(startDate) : startDate) : today;
  const courseEnd = endDate ? (typeof endDate === 'string' ? new Date(endDate) : endDate) : null;
  
  const monthsToAdd = {
    monthly: 1,
    quarterly: 3,
    biannually: 6,
    yearly: 12,
  };
  
  // Start from course start date and find next billing cycle after today
  let currentDate = new Date(courseStart);
  currentDate.setDate(5); // Billing is on the 5th
  
  // Move forward until we find a date after today
  while (currentDate <= today) {
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd[billingCycle]);
  }
  
  // Collect upcoming cycles that are before or on the course end date
  for (let i = 0; i < count; i++) {
    // Stop if we've passed the course end date
    if (courseEnd && currentDate > courseEnd) {
      break;
    }
    cycles.push(new Date(currentDate));
    currentDate.setMonth(currentDate.getMonth() + monthsToAdd[billingCycle]);
  }
  
  return cycles;
}
