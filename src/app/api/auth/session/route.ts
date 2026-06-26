import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { token } = await request.json();

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ success: false, error: 'VALIDATION', message: 'Token required' }, { status: 400 });
  }

  const response = NextResponse.json({ success: true, data: null });

  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 86400,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, data: null });

  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
