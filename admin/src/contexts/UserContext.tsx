'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import client from '@/services/client';
import { useLoading } from './LoadingContext';
import { toast } from 'sonner';

export interface LoginCredentials {
   email: string;
   password: string;
   rememberMe?: boolean;
}

export interface UserDto {
   id: number;
   firstName: string;
   lastName: string;
   email: string;
   accessToken: string;
   refreshToken: string;
}

export interface RespondDto {
   statusCode: string;
   message: string;
   data: UserDto;
}

interface IUserContext {
   accessToken: string | null;
   refreshToken: string | null;
   setAccessToken: (accessToken: string | null) => void;
   setRefreshToken: (refreshToken: string | null) => void;
   isAuthenticated: boolean;
   userDetails: UserDto | null;
   login: (loginCreds: LoginCredentials | null) => Promise<boolean>;
   logout: () => void;
}

const UserContext = createContext<IUserContext | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
   const [accessToken, setAccessToken] = useState<string | null>(null);
   const [refreshToken, setRefreshToken] = useState<string | null>(null);
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   const [userDetails, setUserDetails] = useState<UserDto | null>(null);
   const { setLoadingState } = useLoading();

   const router = useRouter();

   const login = async (loginCreds: LoginCredentials | null): Promise<boolean> => {

      if (!loginCreds) {
         toast.error('Thông tin đăng nhập không hợp lệ!');
         return false;
      }

      const response = await client<RespondDto>('/auth/login', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(loginCreds),
      });

      if (loginCreds.rememberMe) {
         localStorage.setItem('userDetails', JSON.stringify(response.data));
         localStorage.setItem('rememberedEmail', loginCreds.email);
      }

      if (response.statusCode.includes('40')) {
         toast.error('Đăng nhập thất bại. Mã lỗi: ' + response.statusCode);
         return false;
      }
      if (response.statusCode.includes('50')) {
         toast.error('Lỗi server. Mã lỗi: ' + response.statusCode);
         return false;
      }

      setAccessToken(response.data.accessToken);
      setRefreshToken(response.data.refreshToken);

      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);

      setIsAuthenticated(true);
      setUserDetails(response.data);
      router.push('/');
      return true;
   };

   const logout = (): void => {
      setLoadingState(true);
      try {
         localStorage.removeItem('userDetails');
         localStorage.removeItem('rememberedEmail');
         setAccessToken(null);
         setRefreshToken(null);
         setIsAuthenticated(false);
         setUserDetails(null);
         router.push('/login');
      } catch (error) {
         console.error('Logout failed:', error);
         toast.error('Failed to logout. Please try again.');
      } finally {
         setLoadingState(false);
      }
   };

   useEffect(() => {
      const storedUserDetails = localStorage.getItem('userDetails');

      if (storedUserDetails) {
         try {
            const parsedUserDetails = JSON.parse(storedUserDetails);
            if (parsedUserDetails && parsedUserDetails.accessToken) {
               setAccessToken(parsedUserDetails.accessToken);
               setIsAuthenticated(true);
               setUserDetails(parsedUserDetails);
            } else {
               localStorage.removeItem('userDetails');
               setIsAuthenticated(false);
               setUserDetails(null);
            }
         } catch (error) {
            console.error('Error parsing stored user details:', error);
            localStorage.removeItem('userDetails');
            setIsAuthenticated(false);
            setUserDetails(null);
         }
      } else {
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
