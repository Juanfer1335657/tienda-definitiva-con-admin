'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ShippingCalculator, { ShippingData } from './ShippingCalculator';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  images?: { id: number; product_id: number; image_url: string; is_primary: boolean }[];
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  onRemove: (id: number) => void;
  onClear: () => void;
  whatsappNumber: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onRemove,
  onClear,
  whatsappNumber,
}: CartModalProps) {
  const [showShipping, setShowShipping] = useState(false);
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const getProductImage = (product: Product): string => {
    const primary = product.images?.find(img => img.is_primary);
    const first = product.images?.[0];
    return primary?.image_url || first?.image_url || '';
  };

  const handleShippingCalculate = (data: ShippingData) => {
    setShippingData(data);
    setShowShipping(false);
  };

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return '';
    
    let message = '🛒 *Nuevo Pedido - Hypertecnologian*\n\n';
    
    cart.forEach((item) => {
      message += `• ${item.name} - ${formatPrice(item.price)}\n`;
    });
    
    const finalTotal = total + (shippingData?.shippingPrice || 0);
    message += '\n━━━━━━━━━━━━━━━━━━━━\n';
    message += '📦 *Detalles de Envío*\n';
    message += `📍 Dirección: ${shippingData?.address}\n`;
    message += `🏙️ Ciudad: ${shippingData?.city}, ${shippingData?.department}\n`;
    message += `🚚 Transportadora: ${shippingData?.provider === 'servientrega' ? 'Servientrega' : 'Interrapidisimo'}\n`;
    message += `⏱️ Tiempo: ${shippingData?.estimatedDays}\n`;
    message += '━━━━━━━━━━━━━━━━━━━━\n\n';
    message += `💰 *Subtotal:* ${formatPrice(total)}\n`;
    message += `📬 *Envío:* ${shippingData?.shippingPrice === 0 ? 'GRATIS' : formatPrice(shippingData?.shippingPrice || 0)}\n`;
    message += `━━━━━━━━━━━━━━━━━━━━\n`;
    message += `✨ *TOTAL:* ${formatPrice(finalTotal)}\n\n`;
    message += '¡Hola! Quiero hacer este pedido. 📱';
    
    return message;
  };

  const handleCheckout = () => {
    if (shippingData) {
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(generateWhatsAppMessage())}`,
        '_blank'
      );
    } else {
      setShowShipping(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius)',
              padding: 24,
              maxWidth: 500,
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                Carrito de Compras
              </h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  padding: 4,
                }}
              >
                ✕
              </motion.button>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>
                Tu carrito está vacío
              </p>
            ) : (
              <>
                <div style={{ marginBottom: 20 }}>
                  {cart.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: 12,
                        borderBottom: '1px solid #f0f0f0',
                      }}
                    >
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          borderRadius: 8,
                          objectFit: 'cover',
                          marginRight: 12,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: 4,
                          }}
                        >
                          {item.name}
                        </p>
                        <p style={{ color: 'var(--accent)', fontWeight: 600 }}>
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemove(item.id)}
                        style={{
                          background: '#fee',
                          border: 'none',
                          color: '#d00',
                          padding: 8,
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontSize: 14,
                        }}
                      >
                        Eliminar
                      </motion.button>
                    </motion.div>
                  ))}
                </div>

                {shippingData && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      backgroundColor: '#f0f9f4',
                      padding: 16,
                      borderRadius: 12,
                      marginBottom: 16,
                      border: '1px solid var(--accent)',
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
                      Envío calculado:
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      📍 {shippingData.address}, {shippingData.city}
                    </p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      🚚 {shippingData.provider === 'servientrega' ? 'Servientrega' : 'Interrapidisimo'} - {shippingData.estimatedDays}
                    </p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
                      {shippingData.shippingPrice === 0 ? 'Envío GRATIS' : 'Envío: ' + formatPrice(shippingData.shippingPrice)}
                    </p>
                  </motion.div>
                )}

                <div
                  style={{
                    borderTop: '2px solid var(--accent)',
                    paddingTop: 16,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                      Subtotal:
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                      Envío:
                    </span>
                    <span style={{ fontSize: 16, fontWeight: 600, color: shippingData?.shippingPrice === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                      {shippingData ? (shippingData.shippingPrice === 0 ? 'GRATIS' : formatPrice(shippingData.shippingPrice)) : 'Por calcular'}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Total:
                    </span>
                    <span
                      style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: 'var(--accent)',
                      }}
                    >
                      {formatPrice(total + (shippingData?.shippingPrice || 0))}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <motion.button
                    onClick={handleCheckout}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      padding: 14,
                      backgroundColor: 'var(--accent)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 12,
                      fontSize: 16,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {shippingData ? 'Comprar por WhatsApp' : 'Calcular Envío y Comprar'}
                  </motion.button>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClear}
                      style={{
                        flex: 1,
                        padding: 14,
                        backgroundColor: '#fee',
                        color: '#d00',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Vaciar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowShipping(true)}
                      style={{
                        flex: 1,
                        padding: 14,
                        backgroundColor: '#f0f0f0',
                        color: 'var(--text-primary)',
                        border: 'none',
                        borderRadius: 12,
                        fontSize: 14,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Cambiar Envío
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
      
      <AnimatePresence>
        {showShipping && (
          <ShippingCalculator
            total={total}
            onCalculate={handleShippingCalculate}
            onClose={() => setShowShipping(false)}
          />
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}