'use server';

import { UserLogin } from '@/types/user';
import { cookies } from 'next/headers';


export async function getAuthTokenFromServerCookies(): Promise<string | null> {
  try {
    const cookieStore = cookies();

    const token = (await cookieStore).get('accessToken');
    if (!token) {
      console.warn('accessToken cookie not found');
      return null;
    }

    // Kiểm tra tính hợp lệ của JWT
    if (!token.value.includes('.')) {
      console.warn('Invalid JWT format in accessToken cookie');
      return null;
    }

    return token.value;
  } catch (error) {
    console.error('Error getting access token from cookies:', error);
    return null;
  }
}

export async function getUserFromServerCookies(): Promise<UserLogin | null> {
  try {
    const cookieStore = cookies();

    const userDetails = (await cookieStore).get('userDetails');

    if (!userDetails) {
      console.warn('userDetails cookie not found');
      return null;
    }

    try {
      const parsedUserDetails = JSON.parse(userDetails.value) as UserLogin;
      return parsedUserDetails;
    } catch (error) {
      console.error('Error parsing userDetails cookie:', error);
      return null;
    }
  } catch (error) {
    console.error('Error getting user details from cookies:', error);
    return null;
  }
}

