'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import client from '@/services/client';
import { useLoading } from './LoadingContext';
import { UserLogin, LoginCredentials } from '@/types/user';
import { toast } from 'sonner';

interface IUserContext {
   accessToken: string | null;
   refreshToken: string | null;
   setAccessToken: (accessToken: string | null) => void;
   setRefreshToken: (refreshToken: string | null) => void;
   isAuthenticated: boolean;
   userDetails: UserLogin | null;
   login: (loginCreds: LoginCredentials | null) => Promise<boolean>;
   logout: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
   const [accessToken, setAccessToken] = useState<string | null>(null);
   const [refreshToken, setRefreshToken] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   const [userDetails, setUserDetails] = useState<UserLogin | null>(null);
   const { setLoadingState } = useLoading();

   const router = useRouter();

   const login = async (loginCreds: LoginCredentials | null): Promise<boolean> => {

      if (!loginCreds) {
         toast.error('Thông tin đăng nhập không hợp lệ!');
         return false;
      }
      try {
         const response = await client<UserLogin>('/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginCreds),
         });

         if (loginCreds.rememberMe) {
            localStorage.setItem('userDetails', JSON.stringify(response));
            document.cookie = `accessToken=${response.data.accessToken}; path=/; max-age=604800; SameSite=Strict; Secure`;
            document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=604800; SameSite=Strict; Secure`;
         }
         else {
            sessionStorage.setItem('userDetails', JSON.stringify(response));
            document.cookie = `accessToken=${response.data.accessToken}; path=/; SameSite=Strict; Secure`;
            document.cookie = `refreshToken=${response.data.refreshToken}; path=/; SameSite=Strict; Secure`;
         }

         setAccessToken(response.data.accessToken);
         setRefreshToken(response.data.refreshToken);
         setIsAuthenticated(true);
         setUserDetails(response.data);
         setLoadingState(true);
         setTimeout(() => {
            router.push('/home');
         }, 2000);
         setLoadingState(false);
         return true;

      } catch (error) {
         console.error('Login failed:', error);
         toast.error('Đăng nhập thất bại!');
         return false;
      }
   };

   const logout = (): void => {
      setLoadingState(true);
      try {
         localStorage.removeItem('userDetails');
         localStorage.removeItem('rememberedEmail');
         sessionStorage.removeItem('userDetails');
         document.cookie =
            'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
         document.cookie =
            'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict; Secure';
         setAccessToken(null);
         setRefreshToken(null);
         setIsAuthenticated(false);
         setUserDetails(null);
         router.push('/login');
      } catch (error) {
         console.error('Logout failed:', error);
         toast.error('Đăng xuất thất bại!');
      } finally {
         setLoadingState(false);
      }
   };

   useEffect(() => {
      const getCookie = (name: string): string | null => {
         const value = `; ${document.cookie}`;
         const parts = value.split(`; ${name}=`);
         if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
         return null;
      };

      const accessToken = getCookie('accessToken');
      const storedUserDetails = localStorage.getItem('userDetails') || sessionStorage.getItem('userDetails');

      if (accessToken && storedUserDetails) {
         try {
            const parsedUserDetails = JSON.parse(storedUserDetails);

            setAccessToken(parsedUserDetails.accessToken);
            setIsAuthenticated(true);
            setUserDetails(parsedUserDetails);
         } catch (error) {
            console.error('Error parsing stored user details:', error);
            setAccessToken(null);
            setIsAuthenticated(false);
            setUserDetails(null);
         }

      } else {
         setAccessToken(null);
         setIsAuthenticated(false);
         setUserDetails(null);

         const publicRoutes = /\/(login)/;
         if (!publicRoutes.test(window.location.pathname)) {
            router.push('/login');
         }
      }
   }, [router]);

   const value = {
      login,
      logout,
      accessToken,
      refreshToken,
      setAccessToken,
      setRefreshToken,
      isAuthenticated,
      userDetails,
   };

   return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): IUserContext => {
   const context = useContext(UserContext);

   if (context === undefined) {
      throw new Error('useUser must be used within a UserProvider');
   }

   return context;
};
