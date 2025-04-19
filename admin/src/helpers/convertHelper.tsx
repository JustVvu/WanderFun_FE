export function parseTimeString(timeInput: string | Date): Date {
   // Convert Date to string if necessary
   const timeString = timeInput instanceof Date ? timeInput.toTimeString().split(' ')[0] : timeInput;

   const [hours, minutes, seconds] = timeString.split(':').map(Number);
   const date = new Date();
   date.setHours(hours, minutes, seconds || 0, 0); // Default seconds to 0 if not provided
   return date;
}