"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "../../components/data_table/DataTableColumnHeader"


export type User = {
   id: string
   userName: string
   birthday: string
   status: "active" | "banned"
}

export const columns: ColumnDef<User>[] = [
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
      accessorKey: "id",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-fit" column={column} title="ID" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("id")}</div>,
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "userName",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-[200px]" column={column} title="Tên người dùng" />
      ),
      cell: ({ row }) => <div className="w-[200px] truncate ">{row.getValue("userName")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "birthday",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Ngày sinh" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("birthday")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "status",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Trạng thái tài khoản" />
      ),
      cell: ({ row }) => <div className="w-full text-center">{row.getValue("status")}</div>,
      enableSorting: true,
      enableHiding: false,
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
                     onClick={() => console.log(user)}
                  >
                     Copy user ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Xem chi tiết người dùng</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )
      },
   },
]
