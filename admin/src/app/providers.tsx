'use client';

import React, { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "sonner";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingProvider>
        <UserProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster richColors />
        </UserProvider>
      </LoadingProvider>
    </>
  );
}
