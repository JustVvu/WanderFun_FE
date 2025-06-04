import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AppConfirmDialog } from '@/app/components/AppConfirmDialog';
import { DataTableColumnHeader } from '@/app/components/data_table/DataTableColumnHeader';
import { deletePlace } from '@/app/services/places/placesServices';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLoading } from '@/contexts/LoadingContext';
import { Place } from '@/models/places/place';
import { ColumnDef } from '@tanstack/react-table';

export function useColumns(refetchData: () => void): ColumnDef<Place>[] {
   const router = useRouter();
   const { setLoadingState } = useLoading();
   const [openDialog, setOpenDialog] = useState(false);
   const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

   const handleDeletePlace = async () => {
      if (!selectedPlace) return;
      try {
         setLoadingState(true);
         await deletePlace(selectedPlace.id.toString(), refetchData);
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
            <DataTableColumnHeader className="w-[200px]" column={column} title="Tên địa điểm" />
         ),
         cell: ({ row }) => <div className="w-[200px] truncate ">{row.getValue("name")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         id: "address",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[200px]" column={column} title="Địa chỉ" />
         ),
         cell: ({ row }) => {
            const place = row.original;
            // Format address if available
            const address = place.address ?
               `${place.address.district.name || ''}, ${place.address.province.name || ''}`.trim() :
               '';
            return <div className="w-[200px] truncate">{address}</div>;
         },
         enableSorting: true,
         enableHiding: false,
      },
      {
         id: "category",
         header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Phân loại" />
         ),
         cell: ({ row }) => {
            const place = row.original;
            return <div className="w-[200px]">{place.category?.name || ''}</div>;
         },
         enableSorting: true,
         enableHiding: false,
      },
      {
         accessorKey: "rating",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Điểm đánh giá" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("rating")}</div>,
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: "totalRating",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[100px]" column={column} title="Lượt đánh giá" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("totalRating")}</div>,
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: "totalFeedback",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[100px]" column={column} title="Lượt nhận xét" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("totalFeedback")}</div>,
         enableSorting: false,
         enableHiding: false,
      },
      {
         id: "actions",
         cell: ({ row }) => {
            const place = row.original
            return (
               <>
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
                              router.push(`/places/detail?id=${place.id}`);
                           }}
                        >
                           Xem chi tiết địa điểm
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           onClick={() => {
                              router.push(`/places/add?id=${place.id}`);
                           }}
                        >
                           Chỉnh sửa địa điểm
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           className="cursor-pointer"
                           onClick={() => {
                              setSelectedPlace(place);
                              setOpenDialog(true);
                           }}
                        >
                           Xóa địa điểm
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>


                  <AppConfirmDialog
                     open={openDialog}
                     setOpen={setOpenDialog}
                     title="Xác nhận xóa địa điểm?"
                     description="Bạn có chắc chắn muốn xóa địa điểm này? Hành động này không thể hoàn tác."
                     onConfirm={handleDeletePlace}

                  />
               </>
            )
         },
      },
   ]
}
