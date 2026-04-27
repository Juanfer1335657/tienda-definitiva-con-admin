'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/Header';
import ProductCard, { Product } from '@/components/ProductCard';
import CartModal from '@/components/CartModal';
import Footer from '@/components/Footer';

const WHATSAPP_NUMBER = '573015851969';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (cart.length > 0 && !isCartOpen) {
      setIsCartOpen(true);
    }
  }, [cart.length, isCartOpen]);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const newCart = [...prev, product];
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header cartCount={cart.length} onCartClick={openCart} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        }}
      >
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            fontSize: 'clamp(36px, 8vw, 56px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
          }}
        >
          Hypertecnologian <span style={{ color: 'var(--accent)' }}>🛒</span>
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            fontSize: 'clamp(14px, 3vw, 18px)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Los mejores productos tecnológicos directamente en tus manos. Calidad garantizada,
          entrega inmediata y el mejor servicio.
        </motion.p>
        <motion.a
          href="#productos"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'inline-block',
            marginTop: 32,
            padding: '14px 32px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Ver Productos
        </motion.a>
      </motion.section>

      <section
        id="productos"
        style={{
          padding: '64px 24px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <h3 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 32, textAlign: 'center' }}>
          Productos Destacados
        </h3>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
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
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 64, color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: 18, marginBottom: 16 }}>No hay productos disponibles</p>
            <p>¡Vuelve pronto para ver nuestro catálogo!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
              >
                <ProductCard product={product} onAddToCart={addToCart} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <Footer />

      <motion.button
        onClick={openCart}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          backgroundColor: 'var(--accent)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: 0,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {cart.length > 0 && (
          <span style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#d00',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {cart.length}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={closeCart}
            cart={cart}
            onRemove={removeFromCart}
            onClear={clearCart}
            whatsappNumber={WHATSAPP_NUMBER}
          />
        )}
      </AnimatePresence>
    </div>
  );
}