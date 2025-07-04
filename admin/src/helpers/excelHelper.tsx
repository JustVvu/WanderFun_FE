// helpers/excelReaderHelper.ts
import { CreatePlacePayload } from '@/models/places/place';
import * as XLSX from 'xlsx';

export const readExcelFile = (file: File): Promise<unknown[][]> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (evt: ProgressEvent<FileReader>) => {
         const data = evt.target?.result;
         try {
            // Parse the binary string into a workbook
            const workbook = XLSX.read(data, { type: 'binary' });
            // Select the first sheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            // Convert the worksheet into a JSON array (array of arrays)
            const jsonData: unknown[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            resolve(jsonData);
         } catch (error) {
            reject(error);
         }
      };

      reader.onerror = (error) => {
         reject(error);
      };

      // Read the file as a binary string
      reader.readAsArrayBuffer(file);
   });
};

export const convertExcelArrayToJSON = (data: unknown[][]): Record<string, unknown>[] => {
   if (data.length === 0) return [];

   const rawHeaders = data[0].map((h) => String(h));
   const headers = rawHeaders.map((h) => h.charAt(0).toLowerCase() + h.slice(1));

   return data.slice(1).map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, i) => {
         obj[header] = row[i];
      });
      return obj;
   });
};

// export const adminExcelImportHelper = (
//    items: Record<string, unknown>[]
// ): CreatePlacePayload[] => {
//    return items.map((item) => ({
//       name: String(item.name ?? ''),
//       address: {
//          provinceCode: String(item.provinceCode ?? ''),
//          districtCode: String(item.districtCode ?? ''),
//          wardCode: String(item.wardCode ?? ''),
//          street: String(item.street ?? ''),
//       },
//       categoryId: String(item.categoryId ?? ''),
//       longitude: String(item.longitude ?? ''),
//       latitude: String(item.latitude ?? ''),
//       coverImage: {
//          imageUrl: String(item.imageUrl ?? ''),
//          imagePublicId: String(item.imagePublicId ?? ''),
//       },
//    }));
// };

export const excelImportHelper = async (
   items: Record<string, unknown>[]
): Promise<CreatePlacePayload[]> => {
   // Process each item sequentially due to API calls
   const results: CreatePlacePayload[] = [];

   for (const item of items) {
      try {
         // Extract province and district names from the Excel data
         const provinceName = String(item.province ?? '');
         const districtName = String(item.district ?? '');
         const wardName = String(item.ward ?? '');

         /*
         let provinceCode = String(item.provinceCode ?? '');
         let districtCode = String(item.districtCode ?? '');
         let wardCode = String(item.wardCode ?? '');

         if (!provinceCode && provinceName) {
            try {
               const province = await getProvinceByName(provinceName);
               provinceCode = province.code;
            } catch (error) {
               console.error(`Failed to fetch province code for "${provinceName}":`, error);
            }
         }

if (!districtCode && districtName && provinceCode) {
   try {
      const district = await getDistrictByNameAndProvinceCode(districtName, provinceCode);
      districtCode = district.code;
   } catch (error) {
      console.error(`Failed to fetch district code for "${districtName}" in province "${provinceCode}":`, error);
   }
}

         if (!wardCode && wardName && districtCode) {
            try {
               const ward = await getWardByNameAndDistrictCode(wardName, districtCode);
               wardCode = ward.code;
            } catch (error) {
               console.error(`Failed to fetch ward code for "${wardName}" in district "${districtCode}":`, error);
            }
         }
         */

         // Create the place payload with resolved codes
         const placePayload: CreatePlacePayload = {
            name: String(item.name ?? ''),
            address: {
               provinceName,
               districtName,
               wardName,
               street: String(item.street ?? ''),
            },
            categoryId: String(item.categoryId ?? ''),
            longitude: String(item.longitude ?? ''),
            latitude: String(item.latitude ?? ''),
            coverImage: {
               imageUrl: String(item.imageUrl ?? ''),
               imagePublicId: String(item.imagePublicId ?? ''),
            },
            placeDetail: {
               description: String(item.description ?? ''),
               checkInPoint: Number(item.checkPoint ?? 0),
               checkInRangeMeter: Number(item.checkRange ?? 0),
               timeOpen: String(item.openTime ?? ''),
               timeClose: String(item.closeTime ?? ''),
               isClosed: Boolean(item.isClosed ?? false),
               priceRangeTop: Number(item.priceTop ?? 0),
               priceRangeBottom: Number(item.priceBottom ?? 0),
               bestTimeToVisit: String(item.bestTime ?? ''),
               isVerified: Boolean(item.isVerified ?? false),
               alternativeName: String(item.altName ?? ''),
               operator: String(item.operator ?? ''),
               url: String(item.url ?? ''),
            }
         };

         results.push(placePayload);
      } catch (error) {
         console.error('Error processing item:', item, error);
      }
   }

   return results;
};


export const processExcelDataByColumnNames = (
   data: unknown[][],
   columnsToMerge: string[]
): string[] => {
   if (data.length === 0) return [];

   // Assume first row is the header row
   const headerRow = data[0] as string[];

   // Get the indexes for each column based on the header names
   const columnIndexes = columnsToMerge.map((colName) => headerRow.findIndex((header) => header === colName));

   // Process each subsequent row, merging values from the desired columns
   return data.slice(1).map((row) => {
      const mergedValues = columnIndexes.map((colIndex) => {
         // If the column name wasn't found or cell is undefined, return empty string.
         if (colIndex === -1 || row[colIndex] === undefined) return "";
         return String(row[colIndex]);
      });
      // Filter out empty strings and join with ", "
      return mergedValues.filter((val) => val !== "").join(", ");
   });
};

export const exportDataToExcel = (
   data: Record<string, unknown>[],
   fileName: string = 'exported_results.xlsx'
): void => {
   // Create a worksheet from the JSON data
   const worksheet = XLSX.utils.json_to_sheet(data);
   // Create a new workbook and append the worksheet
   const workbook = XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
   // Trigger the file download
   XLSX.writeFile(workbook, fileName);
};