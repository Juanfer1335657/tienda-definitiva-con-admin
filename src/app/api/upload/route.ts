export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const { image, name } = await request.json();
    
    if (!image || !name) {
      return NextResponse.json({ error: 'Imagen y nombre requeridos' }, { status: 400 });
    }

    const match = image.match(/^data:image\/(\w+);base64,/);
    if (!match) {
      return NextResponse.json({ error: 'Formato de imagen no válido' }, { status: 400 });
    }

    const mimeType = match[1];
    const validTypes = ['png', 'jpg', 'jpeg', 'webp'];
    
    if (!validTypes.includes(mimeType)) {
      return NextResponse.json({ error: 'Formato no soportado. Usa PNG, JPG o WEBP' }, { status: 400 });
    }

    const contentType = mimeType === 'jpg' ? 'image/jpeg' : `image/${mimeType}`;
    const extension = mimeType === 'jpg' ? 'jpg' : (mimeType === 'jpeg' ? 'jpg' : mimeType);
    const fileName = name.replace(/\.[^.]+$/, '') + '.' + extension;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    const blob = await put(`products/${fileName}`, buffer, {
      contentType,
      access: 'public',
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Error al subir imagen' }, { status: 500 });
  }
}