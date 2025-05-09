'use client';

import React, { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "sonner";
import NavigationLoadingListener from '@/components/NavigationLoadingListener';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingProvider>
        <NavigationLoadingListener />
        <UserProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </UserProvider>
      </LoadingProvider>
    </>
  );
}
