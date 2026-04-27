'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  images?: { id: number; product_id: number; image_url: string; is_primary: boolean }[];
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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const images = useMemo(() => product.images || [], [product.images]);
  const displayImage = useMemo(() => {
    if (images.length === 0) return null;
    const primary = images.find(img => img.is_primary);
    return primary || images[0];
  }, [images]);

  const rotateImage = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (images.length > 1) {
      intervalRef.current = setInterval(rotateImage, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [images.length, rotateImage]);

  const handleAddToCart = useCallback(() => {
    onAddToCart(product);
  }, [onAddToCart, product]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          aspectRatio: '1 / 1', 
          overflow: 'hidden', 
          backgroundColor: '#f9f9f9',
        }}
      >
        {displayImage && (
          <Image
            src={displayImage.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: 'contain' }}
            priority={false}
          />
        )}
        
        {product.category && (
          <span
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
            }}
          >
            {product.category}
          </span>
        )}

        {images.length > 1 && (
          <div
            style={{
              position: 'absolute',
              bottom: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: 6,
            }}
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: index === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
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
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
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
          }}
        >
          Agregar al carrito
        </motion.button>
      </div>
    </motion.div>
  );
}