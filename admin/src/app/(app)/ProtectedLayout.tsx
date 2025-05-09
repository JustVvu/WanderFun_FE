'use client';

import { useUser } from '@/contexts/UserContext';

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();

  if (!isAuthenticated) {
    return;
  }

  return <>{children}</>;
};

export default ProtectedLayout;
