'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_primary: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  images?: ProductImage[];
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const mountedRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (mountedRef.current) setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    return () => { mountedRef.current = false; };
  }, [fetchProducts]);

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert('Error al eliminar producto');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
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
            maxWidth: 1200,
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
            Productos
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              href="/admin/dashboard"
              style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: 14 }}
            >
              Dashboard
            </Link>
            <Link
              href="/"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}
            >
              Ver Tienda
            </Link>
          </div>
        </div>
      </motion.header>

      <main style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Lista de Productos ({products.length})
          </h2>
          <Link href="/admin/productos/nuevo">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '12px 20px',
                backgroundColor: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
            >
              + Nuevo Producto
            </motion.button>
          </Link>
        </div>

        {products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: 64,
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>
              No hay productos
            </p>
            <Link
              href="/admin/productos/nuevo"
              style={{ color: 'var(--accent)', textDecoration: 'none' }}
            >
              Agregar el primer producto
            </Link>
          </motion.div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Imágenes
                  </th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Nombre
                  </th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Precio
                  </th>
                  <th style={{ padding: 16, textAlign: 'left', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Categoría
                  </th>
                  <th style={{ padding: 16, textAlign: 'right', fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ delay: index * 0.05 }}
                      style={{ borderTop: '1px solid #eee' }}
                    >
                      <td style={{ padding: 16 }}>
                        <div style={{ display: 'flex', gap: 4 }}>
                          {product.images?.slice(0, 3).map((img) => (
                            <img
                              key={img.id}
                              src={img.image_url}
                              alt=""
                              style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                borderRadius: 8,
                                border: img.is_primary ? '2px solid var(--accent)' : '1px solid #eee',
                              }}
                            />
                          ))}
                          {(product.images?.length || 0) > 3 && (
                            <div
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: 8,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 12,
                                color: 'var(--text-secondary)',
                              }}
                            >
                              +{product.images!.length - 3}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: 16 }}>
                        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {product.name}
                        </p>
                        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                          {product.description}
                        </p>
                      </td>
                      <td style={{ padding: 16 }}>
                        <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                          {formatPrice(product.price)}
                        </span>
                      </td>
                      <td style={{ padding: 16 }}>
                        <span
                          style={{
                            backgroundColor: '#f0f0f0',
                            padding: '4px 12px',
                            borderRadius: 20,
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {product.category || 'Sin categoría'}
                        </span>
                      </td>
                      <td style={{ padding: 16, textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                          <Link href={`/admin/productos/${product.id}`}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                padding: '8px 16px',
                                backgroundColor: 'var(--accent)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 8,
                                fontSize: 13,
                                cursor: 'pointer',
                                textDecoration: 'none',
                              }}
                            >
                              Editar
                            </motion.button>
                          </Link>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#fee',
                              color: '#d00',
                              border: 'none',
                              borderRadius: 8,
                              fontSize: 13,
                              cursor: deleting === product.id ? 'not-allowed' : 'pointer',
                              opacity: deleting === product.id ? 0.5 : 1,
                            }}
                          >
                            {deleting === product.id ? '...' : 'Eliminar'}
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}