import React from 'react';

import {
   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
   AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface AppAleartDialogProps {
   isOpen: boolean;
   onChange: (open: boolean) => void;
   title?: string;
   description?: string;
   onConfirm?: () => void;
}

export default function AppAlertDialog({
   isOpen,
   onChange,
   title,
   description,
   onConfirm,
}: AppAleartDialogProps
) {

   // Still WIP (try not to use)

   return (
      <AlertDialog open={isOpen} onOpenChange={onChange}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle className='text-lg font-semibold text-gray-900'>
                  {title || 'Xác nhận'}
               </AlertDialogTitle>
               <AlertDialogDescription className='text-sm text-gray-600'>
                  {description || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className='bg-gray-200 hover:bg-gray-300 text-gray-800'>
                  Hủy
               </AlertDialogCancel>
               <AlertDialogAction
                  className='bg-blue-600 hover:bg-blue-700 text-white'
                  onClick={onConfirm}
               >
                  Xác nhận
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}
