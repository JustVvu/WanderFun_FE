import { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
   extends React.HTMLAttributes<HTMLDivElement> {
   column: Column<TData, TValue>
   title: string
}

export function DataTableColumnHeader<TData, TValue>({
   column,
   title,
   className,
}: DataTableColumnHeaderProps<TData, TValue>) {
   if (!column.getCanSort()) {
      return <div className={cn(className)}>{title}</div>
   }

   return (
      <div className={cn("flex items-center space-x-2 ", className)}>
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8 data-[state=open]:bg-blue2o data-[state=open]:text-blue2 hover:bg-blue2o hover:text-blue2 text-[14px] text-black4"
               >
                  <span>{title}</span>
                  {column.getIsSorted() === "desc" ? (
                     <ArrowDown />
                  ) : column.getIsSorted() === "asc" ? (
                     <ArrowUp />
                  ) : (
                     <ChevronsUpDown />
                  )}
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" >
               <DropdownMenuItem
                  onClick={() => column.toggleSorting(false)}
                  className="focus:bg-blue2o"
               >
                  <ArrowUp className="h-3.5 w-3.5 text-blue2" />
                  A-Z
               </DropdownMenuItem>
               <DropdownMenuItem
                  onClick={() => column.toggleSorting(true)}
                  className="focus:bg-blue2o"
               >
                  <ArrowDown className="h-3.5 w-3.5 text-blue2" />
                  Z-A
               </DropdownMenuItem>
               <DropdownMenuSeparator />
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}