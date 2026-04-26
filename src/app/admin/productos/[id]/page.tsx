'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function EditProduct() {
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const fetchProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) {
        throw new Error('Producto no encontrado');
      }
      const data = await res.json();
      setName(data.name);
      setDescription(data.description || '');
      setPrice(data.price.toString());
      setCategory(data.category || '');
      setPreview(data.image_url);
    } catch (err) {
      console.error('Error fetching product:', err);
      router.push('/admin/productos');
    } finally {
      setFetching(false);
    }
  }, [id, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProduct();
  }, [fetchProduct]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let imageUrl = preview || '';
      
      if (preview && preview.startsWith('data:')) {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: preview, 
            name: id + '-' + name.toLowerCase().replace(/\s+/g, '-') + '.jpg' 
          }),
        });
        
        if (res.ok) {
          const data = await res.json();
          imageUrl = data.url;
        }
      }

      const productRes = await fetch('/api/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id),
          name,
          description,
          price: parseInt(price),
          image_url: imageUrl,
          category,
        }),
      });

      if (!productRes.ok) {
        throw new Error('Error al actualizar producto');
      }

      router.push('/admin/productos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar producto');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--text-secondary)',
            borderTopColor: 'var(--accent)',
            borderRadius: '50%',
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '16px 24px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: 'var(--text-primary)',
            }}
          >
            Editar Producto
          </h1>
          <Link
            href="/admin/productos"
            style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}
          >
            ← Volver
          </Link>
        </div>
      </motion.header>

      <main style={{ padding: '40px 24px', maxWidth: 800, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: 32,
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Imagen del Producto
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed #ddd',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  backgroundColor: preview ? '#f9f9f9' : '#f9f9f9',
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Click para seleccionar imagen
                  </p>
                )}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 16,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 16,
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Precio (COP) *
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                min="0"
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 16,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Electrónica, Moda, Accesorios"
                style={{
                  width: '100%',
                  padding: 12,
                  border: '1px solid #ddd',
                  borderRadius: 8,
                  fontSize: 16,
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  color: '#d00',
                  fontSize: 14,
                  marginBottom: 16,
                  padding: 12,
                  backgroundColor: '#fee',
                  borderRadius: 8,
                }}
              >
                {error}
              </motion.p>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  flex: 1,
                  padding: 14,
                  backgroundColor: loading ? '#ccc' : 'var(--accent)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </motion.button>
              <Link
                href="/admin/productos"
                style={{
                  padding: 14,
                  backgroundColor: '#f5f5f5',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: 12,
                  fontSize: 16,
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-block',
                }}
              >
                Cancelar
              </Link>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}