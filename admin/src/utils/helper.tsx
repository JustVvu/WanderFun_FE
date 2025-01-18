import { Category } from "@/types/place";

export const mapCategoryToEnum = (category: string): Category => {
   switch (category) {
      case "MUSEUM":
         return Category.MUSEUM;
      case "HOTEL":
         return Category.HOTEL;
      case "ENTERTAINMENT":
         return Category.ENTERTAINMENT;
      case "PARK":
         return Category.PARK;
      case "RESTAURANT":
         return Category.RESTAURANT;
      case "SHOPPING":
         return Category.SHOPPING;
      case "OTHER":
         return Category.OTHER;
      default:
         return Category.OTHER; // Default to OTHER if the category is not recognized
   }
};

export function parseTimeString(timeInput: string | Date): Date {
   // Convert Date to string if necessary
   const timeString = timeInput instanceof Date ? timeInput.toTimeString().split(' ')[0] : timeInput;

   const [hours, minutes, seconds] = timeString.split(':').map(Number);
   const date = new Date();
   date.setHours(hours, minutes, seconds || 0, 0); // Default seconds to 0 if not provided
   return date;
}