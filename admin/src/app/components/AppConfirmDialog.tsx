
"use client";

import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
   AlertDialogAction,
   AlertDialogOverlay,
} from "@/components/ui/alert-dialog";

interface AppConfirmDialogProps {
   open: boolean;
   setOpen: (open: boolean) => void;
   title: string;
   description: string;
   confirmText?: string;
   cancelText?: string;
   onConfirm: () => void;
   overlayClassName?: string;
}

export function AppConfirmDialog({
   open,
   setOpen,
   title,
   description,
   onConfirm,
   confirmText = "Xác nhận",
   cancelText = "Hủy",
   overlayClassName,                // Allow custom content style if needed
}: AppConfirmDialogProps) {
   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogOverlay className={overlayClassName} />
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>{title}</AlertDialogTitle>
               <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-800'>
                  {cancelText}
               </AlertDialogCancel>
               <AlertDialogAction
                  className='bg-red-600 hover:bg-red-700 text-white'
                  onClick={onConfirm}
               >
                  {confirmText}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
}
