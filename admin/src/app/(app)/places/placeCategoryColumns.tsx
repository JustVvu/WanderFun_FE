import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "@/app/components/data_table/DataTableColumnHeader"

import { useRouter } from "next/navigation"
import { deletePlaceCategory } from "@/app/services/places/placeCategoriesServices"
import { useLoading } from "@/contexts/LoadingContext"
import { PlaceCategory } from "@/models/places/placeCategory"

export function useColumns(refetchData: () => void): ColumnDef<PlaceCategory>[] {
   const router = useRouter();
   const { setLoadingState } = useLoading();

   const handleDeletePlaceCategory = async (placeCategoryId: number) => {
      try {
         setLoadingState(true);
         await deletePlaceCategory(placeCategoryId.toString(), refetchData);
      }
      catch (err) {
         console.log(err);
      }
      finally {
         refetchData();
         setLoadingState(false);
      }
   }

   return [
      {
         id: "select",
         header: ({ table }) => (
            <Checkbox
               checked={
                  table.getIsAllPageRowsSelected() ||
                  (table.getIsSomePageRowsSelected() && "indeterminate")
               }
               onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
               aria-label="Select all"
               className="translate-y-[2px] mr-[4px] data-[state=checked]:bg-blue2 border-blue2"
            />
         ),
         cell: ({ row }) => (
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={(value) => row.toggleSelected(!!value)}
               aria-label="Select row"
               className="translate-y-[2px] mr-[4px] data-[state=checked]:bg-blue2 border-blue2"
            />
         ),
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: "name",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[200px]" column={column} title="Tên tiếng Việt" />
         ),
         cell: ({ row }) => <div className="w-[200px] truncate ">{row.getValue("name")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         accessorKey: "nameEn",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[200px]" column={column} title="Tên tiếng Anh" />
         ),
         cell: ({ row }) => <div className="w-[200px] truncate ">{row.getValue("nameEn")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         id: "actions",
         cell: ({ row }) => {
            const placeCategory = row.original
            return (
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem
                        onClick={() => {
                           router.push(`/placeCategorys/add?id=${placeCategory.id}`);
                        }}
                     >
                        Chỉnh sửa phân loại
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => {
                           handleDeletePlaceCategory(placeCategory.id);
                        }}
                     >
                        Xóa phân loại
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )
         },
      },
   ]
}
