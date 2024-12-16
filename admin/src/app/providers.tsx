'use client';

import React, { ReactNode } from 'react';
import { UserProvider } from '@/contexts/UserContext';
import { LoadingProvider } from '@/contexts/LoadingContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from "sonner";
import ProtectedRoute from './ProtectedRoute';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <LoadingProvider>
        <UserProvider>
          <ProtectedRoute>
            <TooltipProvider>{children}</TooltipProvider>
          </ProtectedRoute>
          <Toaster richColors />
        </UserProvider>
      </LoadingProvider>
    </>
  );
}
