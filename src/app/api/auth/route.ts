export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAdmin, createAdmin } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y password requeridos' }, { status: 400 });
    }

    const admin = await getAdmin(email);
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await createAdmin(email, hashedPassword);
      await setSession(email);
      return NextResponse.json({ success: true, message: 'Admin creado exitosamente' });
    }

    const isValid = await bcrypt.compare(password, admin.password_hash);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Password incorrecto' }, { status: 401 });
    }

    await setSession(email);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}