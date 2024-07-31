import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers'

export function middleware(req: NextRequest) {
  const cookieStore = cookies()
  const userId = cookieStore.get('userId')

  // Check if the userId cookie exists
  if (!userId) {
    const userId = uuidv4();
    const response = NextResponse.next()
    response.cookies.set({
      name: 'userId',
      value: userId,
      path: '/',
    })
    return response
  }
}

export const config = {
  matcher: '/:path*', // Apply this middleware to all routes
};
