import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { DataTableColumnHeader } from '@/app/components/data_table/DataTableColumnHeader';
import { deletePlace } from '@/app/services/places/placesServices';
import {
   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
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

   const handleDeletePlace = async (placeId: number) => {
      try {
         setLoadingState(true);
         await deletePlace(placeId.toString(), refetchData);
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
            <DataTableColumnHeader className="w-[100px] " column={column} title="Điểm đánh giá" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("rating")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         accessorKey: "totalRating",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[100px]" column={column} title="Lượt đánh giá" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("totalRating")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         accessorKey: "totalFeedback",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-[100px]" column={column} title="Lượt nhận xét" />
         ),
         cell: ({ row }) => <div className="w-[100px] text-center">{row.getValue("totalFeedback")}</div>,
         enableSorting: true,
         enableHiding: false,
      },
      {
         id: "actions",
         cell: ({ row }) => {
            const place = row.original
            return (
               <AlertDialog>
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
                              router.push(`/places/add?id=${place.id}`);
                           }}
                        >
                           Chỉnh sửa địa điểm
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem>
                              Xóa địa điểm
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle className='text-lg font-semibold text-gray-900'>
                           Xác nhận xóa địa điểm
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-sm text-gray-600'>
                           Bạn có chắc chắn muốn xóa địa điểm <span className='font-semibold'>{place.name}</span> không?
                           Hành động này sẽ không thể hoàn tác.
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-800'>
                           Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                           className='bg-red-600 hover:bg-red-700 text-white'
                           onClick={() => {
                              handleDeletePlace(place.id);
                           }}
                        >
                           Xác nhận
                        </AlertDialogAction>
                     </AlertDialogFooter>
                  </AlertDialogContent>
               </AlertDialog>
            )
         },
      },
   ]
}
