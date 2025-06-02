"use client"

import { MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';

import { DataTableColumnHeader } from '@/app/components/data_table/DataTableColumnHeader';
import { changeAccountStatus } from '@/app/services/usersServices';
import {
   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
   DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useLoading } from '@/contexts/LoadingContext';
import { Account } from '@/models/users/account';
import { ColumnDef } from '@tanstack/react-table';

//import { useRouter } from "next/router"


export function useColumns(refetchData: () => void): ColumnDef<Account>[] {
   //const router = useRouter();
   const { setLoadingState } = useLoading();

   const handleChangeAccountStatus = async (accountId: number) => {
      try {
         setLoadingState(true)
         console.log("Changing account status for:", accountId);
         await changeAccountStatus(accountId)
      } catch (error) {
         toast.error(`Lỗi khi thay đổi trạng thái tài khoản: ${String(error)}`);
      } finally {
         setLoadingState(false)
         refetchData();
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
               className="translate-y-[2px] data-[state=checked]:bg-blue2 border-blue2"
            />
         ),
         cell: ({ row }) => (
            <Checkbox
               checked={row.getIsSelected()}
               onCheckedChange={(value) => row.toggleSelected(!!value)}
               aria-label="Select row"
               className="translate-y-[2px] data-[state=checked]:bg-blue2 border-blue2"
            />
         ),
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: "email",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Email" />
         ),
         cell: ({ row }) =>
            <div className="w-fit">
               {row.getValue("email")}
            </div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "verified",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Xác nhận Email" />
         ),
         cell: ({ row }) =>
            <Card className={`w-fit px-2 py-[2px] place-self-center border-none font-medium
            ${row.original.verified === true ? "bg-green-50 text-green1" : "bg-red-100 text-red4"}`}>
               {row.original.verified === true ? "Đã xác nhận" : "Chưa xác nhận"}
            </Card>,
         enableSorting: false,
         enableHiding: true,
      },

      {
         accessorKey: "active",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Trạng thái" />
         ),
         cell: ({ row }) =>
            <Card className={`w-fit px-2 py-[2px] place-self-center border-none font-medium
            ${row.original.active === true ? "bg-green-50 text-green3" : "bg-red-100 text-red4"}`}>
               {row.original.active === true ? "Hoạt động" : "Bị khóa"}
            </Card>,
         enableSorting: false,
         enableHiding: true,
      },
      {
         id: "actions",
         cell: ({ row }) => {
            const account = row.original
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
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem
                              className="cursor-pointer"
                           >
                              {account.active === true ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                           </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                           onClick={() => {
                              console.log(account)
                           }}
                        >
                           Xem chi tiết người dùng
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
                  <AlertDialogContent>
                     <AlertDialogHeader>
                        <AlertDialogTitle className='text-lg font-semibold text-gray-900'>
                           {account.active === true ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className='text-sm text-gray-600'>
                           Bạn có chắc chắn muốn {account.active === true ? "khóa" : "mở khóa"} tài khoản của người dùng này không?
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <AlertDialogFooter>
                        <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-800'>
                           Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction
                           className='bg-red-600 hover:bg-red-700 text-white'
                           onClick={() => {
                              handleChangeAccountStatus(account.id)
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
