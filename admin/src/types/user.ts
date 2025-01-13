export interface LoginCredentials {
   email: string;
   password: string;
   rememberMe?: boolean;
}

export interface UserLogin {
   id: number;
   email: string;
   accessToken: string;
   refreshToken: string;
}

export interface User {
   id: number;
   firstName: string;
   lastName: string;
   email: string;
   isVerified: boolean;
   avatarUrl: string;
   avatarPublicId: string;
   dateOfBirth: string;
   gender: string;
   phoneNumber: string;
   point: number;
}