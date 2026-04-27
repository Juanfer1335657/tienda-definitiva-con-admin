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

  if (showShipping) {
    return (
      <ShippingCalculator
        total={total}
        onCalculate={handleShippingCalculate}
        onClose={() => setShowShipping(false)}
      />
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="cart-modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="cart-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="cart-header">
              <h2 className="cart-title">Carrito de Compras</h2>
              <button className="cart-close-btn" onClick={onClose}>✕</button>
            </div>

            {cart.length === 0 ? (
              <p className="cart-empty">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>
                        <p className="cart-item-price">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => onRemove(item.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  {shippingData && (
                    <div className="cart-shipping">
                      <span>Envío</span>
                      <span>{shippingData.shippingPrice === 0 ? 'GRATIS' : formatPrice(shippingData.shippingPrice)}</span>
                    </div>
                  )}
                  <div className="cart-total">
                    <span>Total</span>
                    <span className="cart-total-price">
                      {formatPrice(total + (shippingData?.shippingPrice || 0))}
                    </span>
                  </div>
                </div>

                {shippingData && (
                  <div className="cart-shipping-info">
                    <p>📍 {shippingData.address}</p>
                    <p>🏙️ {shippingData.city}, {shippingData.department}</p>
                    <p>🚚 {shippingData.provider === 'servientrega' ? 'Servientrega' : 'Interrapidisimo'} - {shippingData.estimatedDays}</p>
                  </div>
                )}

                <div className="cart-actions">
                  <button className="cart-btn-secondary" onClick={onClear}>
                    Vaciar Carrito
                  </button>
                  <button className="cart-btn-primary" onClick={handleCheckout}>
                    {shippingData ? 'Enviar Pedido' : 'Calcular Envío'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}