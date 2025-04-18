// app/places/form-schema.ts
import { z } from "zod";

export const placeFormSchema = z.object({
   // Basic place information
   name: z.string().min(1, "Tên địa điểm không được để trống"),
   alternativeName: z.string().optional(),
   categoryId: z.string().min(1, "Phân loại địa điểm không được để trống"),

   // Address information
   address: z.object({
      provinceCode: z.string(),
      districtCode: z.string(),
      wardCode: z.string().optional(),
      street: z.string(),
   }),

   // Coordinates
   longitude: z.string().min(1, "Kinh độ không được để trống"),
   latitude: z.string().min(1, "Vĩ độ không được để trống"),

   // Cover image
   coverImage: z.object({
      imageUrl: z.string(),
      imagePublicId: z.string(),
   }),

   // Place details
   placeDetail: z.object({
      description: z.string().min(1, "Mô tả không được để trống"),
      checkInPoint: z.string().min(1, "Điểm số Check-in không được để trống"),
      checkInRangeMeter: z.string().min(1, "Khoảng cách Check-in không được để trống"),
      timeOpen: z.date(),
      timeClose: z.date(),
      isClosed: z.boolean(),
      bestTimeToVisit: z.string().optional(),
      priceRangeTop: z.string().optional(),
      priceRangeBottom: z.string().optional(),
      isVerified: z.boolean().default(false),
      alternativeName: z.string().optional(),
      operator: z.string().optional(),
      url: z.string().optional(),

      // Sections
      sectionList: z.array(
         z.object({
            title: z.string().min(1, "Tiêu đề không được để trống"),
            content: z.string().min(1, "Nội dung không được để trống"),
            image: z.object({
               imageUrl: z.string(),
               imagePublicId: z.string(),
            }),
         })
      ),
   }),
});

// Type for the form values
export type PlaceFormValues = z.infer<typeof placeFormSchema>;

// Default values for the form
export const defaultFormValues: PlaceFormValues = {
   name: "",
   alternativeName: "",
   categoryId: "",
   address: {
      provinceCode: "",
      districtCode: "",
      wardCode: "",
      street: "",
   },
   longitude: "",
   latitude: "",
   coverImage: {
      imageUrl: "",
      imagePublicId: "",
   },
   placeDetail: {
      description: "",
      checkInPoint: "",
      checkInRangeMeter: "",
      timeOpen: new Date(new Date().setHours(0, 0, 0, 0)),
      timeClose: new Date(new Date().setHours(0, 0, 0, 0)),
      isClosed: false,
      bestTimeToVisit: "",
      priceRangeTop: "",
      priceRangeBottom: "",
      isVerified: false,
      alternativeName: "",
      operator: "",
      url: "",
      sectionList: [
         {
            title: "",
            content: "",
            image: {
               imageUrl: "",
               imagePublicId: "",
            },
         },
      ],
   },
};

// Helper function to map form values to API payload
export const mapFormValuesToApiPayload = (values: PlaceFormValues) => {
   return {
      ...values,
      longitude: parseFloat(values.longitude),
      latitude: parseFloat(values.latitude),
      placeDetail: {
         ...values.placeDetail,
         checkInPoint: parseInt(values.placeDetail.checkInPoint),
         checkInRangeMeter: parseFloat(values.placeDetail.checkInRangeMeter),
         timeOpen: values.placeDetail.timeOpen.toLocaleTimeString(
            'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
         ),
         timeClose: values.placeDetail.timeClose.toLocaleTimeString(
            'vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }
         ),
         priceRangeTop: values.placeDetail.priceRangeTop ? parseInt(values.placeDetail.priceRangeTop) : undefined,
         priceRangeBottom: values.placeDetail.priceRangeBottom ? parseInt(values.placeDetail.priceRangeBottom) : undefined,
      }
   };
};