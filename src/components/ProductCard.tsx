'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: isHovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
        transition: 'box-shadow 0.3s ease',
      }}
    >
      <div style={{ position: 'relative', width: '100%', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
        <motion.img
          src={product.image_url || '/hypertecnologian/placeholder.jpg'}
          alt={product.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
        />
        {product.category && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              backgroundColor: 'var(--accent)',
              color: 'white',
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'uppercase',
            }}
          >
            {product.category}
          </motion.span>
        )}
      </div>
      <div style={{ padding: 20 }}>
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          {product.name}
        </h3>
        <p
          style={{
            fontSize: 14,
            color: 'var(--text-secondary)',
            marginBottom: 16,
            lineHeight: 1.5,
          }}
        >
          {product.description}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: 'var(--accent)',
            }}
          >
            {formatPrice(product.price)}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart(product)}
          style={{
            width: '100%',
            padding: '12px 20px',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
        >
          Agregar al carrito
        </motion.button>
      </div>
    </motion.div>
  );
}