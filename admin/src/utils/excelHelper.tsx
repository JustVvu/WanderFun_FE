// helpers/excelReaderHelper.ts
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