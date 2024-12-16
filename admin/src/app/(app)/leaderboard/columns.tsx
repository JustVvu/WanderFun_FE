"use client"

import { ColumnDef } from "@tanstack/react-table"

import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTableColumnHeader } from "../../components/data_table/DataTableColumnHeader"
import { Badge } from "@/components/ui/badge"


export type Place = {
   placeName: string
   totalCheckin: number
   avgRating: number
}

export type User = {
   id: string
   userName: string
   totalCheckin: number
   totalPoint: number
}

export const columnsPlace: ColumnDef<Place>[] = [
   {
      id: "rank",
      header: ({ column }) => (
         <DataTableColumnHeader className="text-black text-center" column={column} title="Rank" />
      ),
      cell: ({ row }) => {
         const rank = row.index + 1;
         let rankContent;

         switch (rank) {
            case 1:
               rankContent = <Badge className=" text-center "> {rank}</Badge>;
               break;
            case 2:
               rankContent = <Badge className="text-center"> {rank}</Badge>;
               break;
            case 3:
               rankContent = <Badge className="text-center"> {rank}</Badge>;
               break;
            default:
               rankContent = <Badge className="text-center">{rank}</Badge>;
         }

         return rankContent;
      },
      enableSorting: false,
      enableHiding: false,
   },
   {
      accessorKey: "placeName",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-[200px]" column={column} title="Tên địa điểm" />
      ),
      cell: ({ row }) => <div className="w-[200px] truncate ">{row.getValue("placeName")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "avgRating",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Đánh giá trung bình" />
      ),
      cell: ({ row }) => <div className="w-full text-center">{row.getValue("avgRating")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "totalCheckin",
      header: ({ column }) => (
         <DataTableColumnHeader className="w-fit place-self-center" column={column} title="Tổng lượt check-in" />
      ),
      cell: ({ row }) => <div className="w-full text-center">{row.getValue("totalCheckin")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
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
                     onClick={() => console.log(place)}
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



export const columnsUser: ColumnDef<User>[] = [
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
      accessorKey: "totalCheckin",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Tổng lượt check-in" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("totalCheckin")}</div>,
      enableSorting: true,
      enableHiding: false,
   },
   {
      accessorKey: "totalPoint",
      header: ({ column }) => (
         <DataTableColumnHeader column={column} title="Tổng điểm" />
      ),
      cell: ({ row }) => <div className="w-fit">{row.getValue("Tổng điểm")}</div>,
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
