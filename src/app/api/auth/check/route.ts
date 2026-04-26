import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.json({ success: true, email: session.email });
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
}