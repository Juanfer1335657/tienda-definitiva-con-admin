'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from '@/components/Header';
import ProductCard, { Product } from '@/components/ProductCard';
import CartModal from '@/components/CartModal';
import Footer from '@/components/Footer';

const WHATSAPP_NUMBER = '573015851969';

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.5,
    },
  }),
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const mountedRef = useRef(false);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (mountedRef.current) {
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      if (mountedRef.current) {
        setProducts([]);
      }
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

  useEffect(() => {
    if (cart.length > 0) {
      setIsCartOpen(true);
    }
  }, [cart.length]);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, product]);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const heroTitle = 'Hypertecnologian';
  const heroLetters = heroTitle.split('');

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)',
      }}
    >
      <Header cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          padding: '80px 24px',
          textAlign: 'center',
          background:
            'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
        }}
      >
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 'clamp(40px, 8vw, 64px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 16,
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0px',
          }}
        >
          {heroLetters.map((letter, i) => (
            <motion.span
              key={i}
              custom={i}
              variants={letterVariants}
              initial="hidden"
              animate="visible"
              style={{
                display: 'inline-block',
                color: letter === 'n' ? 'var(--accent)' : 'inherit',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            fontSize: 'clamp(16px, 3vw, 20px)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          Los mejores productos tecnológicos directamente en tus manos. Calidad garantizada,
          entrega inmediata y el mejor servicio.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ marginTop: 32 }}
        >
          <motion.a
            href="#productos"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'inline-block',
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
        </motion.div>
      </motion.section>

      <section
        id="productos"
        style={{
          padding: '64px 24px',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <motion.h3
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 'clamp(24px, 5vw, 32px)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 32,
            textAlign: 'center',
          }}
        >
          Productos Destacados
        </motion.h3>

        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 300,
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
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: 64,
              color: 'var(--text-secondary)',
            }}
          >
            <p style={{ fontSize: 18, marginBottom: 16 }}>
              No hay productos disponibles
            </p>
            <p>¡Vuelve pronto para ver nuestro catálogo!</p>
          </motion.div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 24,
            }}
          >
            <AnimatePresence>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} onAddToCart={addToCart} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <Footer />

      <motion.button
        onClick={() => setIsCartOpen(true)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 64,
          height: 64,
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
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {cart.length > 0 && (
          <motion.span
            key={cart.length}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute',
              top: -4,
              right: -4,
              width: 22,
              height: 22,
              borderRadius: '50%',
              backgroundColor: '#d00',
              color: 'white',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {cart.length}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isCartOpen && (
          <CartModal
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
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