// components/NavigationLoadingListener.tsx
'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

export default function NavigationLoadingListener() {
   const pathname = usePathname();
   const { setLoadingState } = useLoading();
   const prevPathname = useRef(pathname);

   useEffect(() => {
      // If the pathname has changed, trigger the loading state.
      if (pathname !== prevPathname.current) {
         setLoadingState(true);

         // For demonstration, we're using a timeout to turn off the loading state.
         // Adjust this logic as needed for your app (or consider using Suspense / loading.js).
         setTimeout(() => {
            setLoadingState(false);
         }, 500);

         prevPathname.current = pathname;
      }
   }, [pathname, setLoadingState]);

   return null;
}
