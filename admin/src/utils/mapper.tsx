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