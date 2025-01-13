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
import { User } from "@/types/user"
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
         accessorKey: "id",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="ID" />
         ),
         cell: ({ row }) => <div className="w-fit">{row.getValue("id")}</div>,
         enableSorting: false,
         enableHiding: false,
      },
      {
         accessorKey: "firstname",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Firstname" />
         ),
         cell: ({ row }) => <div className="w-fit">{row.getValue("firstname")}</div>,
         enableSorting: true,
         enableHiding: true,
      },
      {
         accessorKey: "lastname",
         header: ({ column }) => (
            <DataTableColumnHeader className="w-fit" column={column} title="Lastname" />
         ),
         cell: ({ row }) => <div className="w-fit">{row.getValue("lastname")}</div>,
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
}
