'use client';

import { useState, useEffect } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchProducts();
  }, []);

  useEffect(() => {
    if (mounted && cart.length > 0) {
      setIsCartOpen(true);
    }
  }, [cart.length, mounted]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([
        {
          id: 1,
          name: 'Apple Premium',
          description: 'Manzana Premium de la mejor calidad',
          price: 3500,
          image_url: '/hypertecnologian/Apple.jpg',
          category: 'Fruta',
        },
        {
          id: 2,
          name: 'Reloj Luxus Gold',
          description: 'Reloj de lujo estilo oro',
          price: 2400000,
          image_url: '/hypertecnologian/reloj_luxus.jpg',
          category: 'Accesorio',
        },
        {
          id: 3,
          name: 'Gafas Urban',
          description: 'Gafas estilo urbano',
          price: 185000,
          image_url: '/hypertecnologian/Gafas.jpg',
          category: 'Moda',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  if (!mounted) return null;

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