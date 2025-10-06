// Shared booking-related utilities to keep components lean and reusable

/**
 * Merge a calendar date and a time string (HH:mm) into one Date object.
 * Keeps the given date's day/month/year and applies hours/minutes.
 */
export function unionDateAndTime(date: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const merged = new Date(date);
  merged.setHours(hours, minutes, 0, 0);
  return merged;
}


