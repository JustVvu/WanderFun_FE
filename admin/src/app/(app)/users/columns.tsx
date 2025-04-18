"use client"

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
import { DataTableColumnHeader } from "../../components/data_table/DataTableColumnHeader"
import { User } from "@/models/user"
//import { useRouter } from "next/router"


export function useColumns(refetchData: () => void): ColumnDef<User>[] {
   //const router = useRouter();
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
         accessorKey: "firstName",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Họ" />
         ),
         cell: ({ row }) =>
            <div className="w-fit">
               {row.getValue("firstName")}
            </div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "lastName",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Tên" />
         ),
         cell: ({ row }) =>
            <div className="w-fit">
               {row.getValue("lastName")}
            </div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "email",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Email" />
         ),
         cell: ({ row }) => <div className="w-fit">{row.getValue("email")}</div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "isVerified",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Trạng thái" />
         ),
         cell: ({ row }) =>
            <div className="w-fit">
               {row.getValue("lastName") === "true" ? "Đã xác nhận" : "Chưa xác nhận"}
            </div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "point",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Điểm số" />
         ),
         cell: ({ row }) => <div className="w-fit ">{row.getValue("point")}</div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         id: "actions",
         cell: ({ row }) => {
            const user = row.original

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
                        onClick={() => refetchData()}
                     >
                        Copy user ID
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem
                        onClick={() => {
                           console.log(user)
                        }}
                     >
                        Xem chi tiết người dùng
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            )
         },
      },
   ]
}
