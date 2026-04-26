export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña son requeridos' }, { status: 400 });
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    await setSession(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}