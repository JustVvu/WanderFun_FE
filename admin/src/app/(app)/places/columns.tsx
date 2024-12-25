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
import { DataTableColumnHeader } from "@/app/components/data_table/DataTableColumnHeader"

import { Place } from "@/types/place"

export const columns: ColumnDef<Place>[] = [
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
      accessorKey: "address",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Địa chỉ" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("address")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "operator",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Tổ chức sở hữu" />
      ),
      cell: ({ row }) => <div className="w-full text-center">{row.getValue("operator")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "category",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Phân loại" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("category")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   // {
   //    accessorKey: "avgRating",
   //    header: ({ column }) => (
   //       <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Đánh giá trung bình" />
   //    ),
   //    cell: ({ row }) => <div className="w-full text-center">{row.getValue("avgRating")}</div>,
   //    enableSorting: true,
   //    enableHiding: false,
   // },
   {
      id: "actions",
      cell: ({ row }) => {
         const place = row.original
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
                     onClick={() => console.log("Place", place)}
                  >
                     Copy place ID
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Xem chi tiết địa điểm</DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )
      },
   },
]
