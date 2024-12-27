import { NextRequest, NextResponse } from 'next/server';

const publicRoutes = ['/login'];

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const currentPath = request.nextUrl.pathname;

  if (accessToken) {
    if (publicRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    if (currentPath === '/') {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  } else {
    if (!publicRoutes.includes(currentPath)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/home',
    '/places',
    '/places/add',
    '/places/map-add',
    '/leaderboard',
    '/login',
    '/users',
  ],
};
