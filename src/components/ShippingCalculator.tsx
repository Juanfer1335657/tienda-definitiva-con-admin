'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { departments } from '@/lib/colombia';

export interface ShippingData {
  department: string;
  city: string;
  address: string;
  provider: 'servientrega' | 'interrapidisimo';
  shippingPrice: number;
  estimatedDays: string;
}

interface ShippingCalculatorProps {
  total: number;
  onCalculate: (shippingData: ShippingData) => void;
  onClose: () => void;
}

const providers = [
  {
    id: 'servientrega' as const,
    name: 'Servientrega',
    logo: '🚚',
    basePrice: 8000,
    pricePerKg: 2500,
    freeShippingAt: 150000,
  },
  {
    id: 'interrapidisimo' as const,
    name: 'Interrapidisimo',
    logo: '⚡',
    basePrice: 6000,
    pricePerKg: 2000,
    freeShippingAt: 120000,
  },
];

const estimatedDaysMap: Record<string, Record<string, string>> = {
  servientrega: {
    'Bogotá D.C.': '1-2 días',
    'Antioquia': '2-3 días',
    'Valle del Cauca': '2-3 días',
    'Atlántico': '2-3 días',
    'Cundinamarca': '1-2 días',
    'Risaralda': '2-3 días',
    'Tolima': '2-3 días',
    'Huila': '2-3 días',
    'Cauca': '3-4 días',
    'Nariño': '3-5 días',
    'Santander': '2-3 días',
    'Norte de Santander': '3-4 días',
    'default': '3-5 días',
  },
  interrapidisimo: {
    'Bogotá D.C.': '1-2 días',
    'Antioquia': '1-2 días',
    'Valle del Cauca': '1-2 días',
    'Atlántico': '1-2 días',
    'Cundinamarca': '1-2 días',
    'Risaralda': '2-3 días',
    'default': '2-3 días',
  },
};

function calculateShipping(provider: typeof providers[0], weight: number, total: number, isLocal: boolean): number {
  const baseWeight = 0.5;
  const additionalWeight = Math.max(0, weight - baseWeight);
  let price = provider.basePrice + (additionalWeight * provider.pricePerKg);
  
  if (isLocal) {
    price = provider.basePrice * 0.7;
  }
  
  if (total >= provider.freeShippingAt) {
    price = 0;
  }
  
  return Math.round(price);
}

function getEstimatedDays(provider: 'servientrega' | 'interrapidisimo', department: string): string {
  const departmentDays = estimatedDaysMap[provider][department];
  return departmentDays || estimatedDaysMap[provider]['default'];
}

export default function ShippingCalculator({ total, onCalculate, onClose }: ShippingCalculatorProps) {
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'servientrega' | 'interrapidisimo' | null>(null);
  const [weight] = useState(0.5);
  const [calculations, setCalculations] = useState<Array<{ provider: typeof providers[0]; price: number; days: string }>>([]);

  const cities = department ? departments.find(d => d.name === department)?.cities || [] : [];

  const isLocal = department === 'Cundinamarca' || department === 'Bogotá D.C.';

  const handleCalculate = () => {
    if (!department || !city || !address || !selectedProvider) return;
    
    const provider = providers.find(p => p.id === selectedProvider)!;
    const price = calculateShipping(provider, weight, total, isLocal);
    const days = getEstimatedDays(selectedProvider, department);
    
    onCalculate({
      department,
      city,
      address,
      provider: selectedProvider,
      shippingPrice: price,
      estimatedDays: days,
    });
  };

  const handleCheckPrices = () => {
    if (!department) return;
    
    const results = providers.map(provider => ({
      provider,
      price: calculateShipping(provider, weight, total, isLocal),
      days: getEstimatedDays(provider.id, department),
    }));
    
    setCalculations(results);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        zIndex: 1001,
        padding: 20,
      }}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius)',
          padding: 24,
          maxWidth: 500,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)' }}>
            Calcular Envío
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
            }}
          >
            ✕
          </motion.button>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Departamento *
          </label>
          <select
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setCity('');
              setCalculations([]);
            }}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: 16,
              backgroundColor: 'white',
            }}
          >
            <option value="">Seleccionar departamento</option>
            {departments.map((dept) => (
              <option key={dept.name} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Ciudad *
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!department}
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: 16,
              backgroundColor: 'white',
            }}
          >
            <option value="">Seleccionar ciudad</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Dirección *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Ej: Cra 15 #45-67, Apto 301"
            style={{
              width: '100%',
              padding: 12,
              border: '1px solid #ddd',
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Peso estimado: {weight} kg
          </p>
          {total >= 120000 && (
            <p style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600 }}>
              ¡Tu compra qualifies para envío gratis con algunos proveedores!
            </p>
          )}
        </div>

        {department && (
          <motion.button
            onClick={handleCheckPrices}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              width: '100%',
              padding: 14,
              backgroundColor: '#f0f0f0',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            Ver precios de envío
          </motion.button>
        )}

        {calculations.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              Opciones de envío:
            </p>
            {calculations.map(({ provider, price, days }) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedProvider(provider.id)}
                style={{
                  padding: 16,
                  border: `2px solid ${selectedProvider === provider.id ? 'var(--accent)' : '#eee'}`,
                  borderRadius: 12,
                  marginBottom: 12,
                  cursor: 'pointer',
                  backgroundColor: selectedProvider === provider.id ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>{provider.logo}</span>
                    <div>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{provider.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Tiempo: {days}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {price === 0 ? (
                      <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)' }}>GRATIS</p>
                    ) : (
                      <>
                        <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                          ${price.toLocaleString('es-CO')}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            onClick={handleCalculate}
            disabled={!department || !city || !address || !selectedProvider}
            whileHover={{ scale: selectedProvider ? 1.02 : 1 }}
            whileTap={{ scale: selectedProvider ? 0.98 : 1 }}
            style={{
              flex: 1,
              padding: 14,
              backgroundColor: selectedProvider ? 'var(--accent)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: selectedProvider ? 'pointer' : 'not-allowed',
            }}
          >
            Confirmar Envío
          </motion.button>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: 14,
              backgroundColor: '#f5f5f5',
              color: 'var(--text-primary)',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}