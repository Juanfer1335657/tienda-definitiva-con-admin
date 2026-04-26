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

const WAREHOUSE = { city: 'Manizales', department: 'Caldas' };

const providers = [
  {
    id: 'servientrega' as const,
    name: 'Servientrega',
    logo: '🚚',
  },
  {
    id: 'interrapidisimo' as const,
    name: 'Interrapidisimo',
    logo: '⚡',
  },
];

const shippingZones: Record<string, { servientrega: number; interrapidisimo: number; days: string }> = {
  'Caldas': { servientrega: 5500, interrapidisimo: 4500, days: '1 día' },
  'Risaralda': { servientrega: 6500, interrapidisimo: 5500, days: '1-2 días' },
  'Quindío': { servientrega: 6500, interrapidisimo: 5500, days: '1-2 días' },
  'Antioquia': { servientrega: 9500, interrapidisimo: 8000, days: '2-3 días' },
  'Tolima': { servientrega: 8500, interrapidisimo: 7000, days: '2 días' },
  'Huila': { servientrega: 10500, interrapidisimo: 9000, days: '2-3 días' },
  'Cundinamarca': { servientrega: 12000, interrapidisimo: 10000, days: '2-3 días' },
  'Bogotá D.C.': { servientrega: 12000, interrapidisimo: 10000, days: '2-3 días' },
  'Valle del Cauca': { servientrega: 14000, interrapidisimo: 12000, days: '3-4 días' },
  'Cauca': { servientrega: 15000, interrapidisimo: 13000, days: '3-4 días' },
  'Nariño': { servientrega: 18000, interrapidisimo: 15000, days: '4-5 días' },
  'Casanare': { servientrega: 16000, interrapidisimo: 14000, days: '3-4 días' },
  'Meta': { servientrega: 15000, interrapidisimo: 13000, days: '3-4 días' },
  'Santander': { servientrega: 16500, interrapidisimo: 14500, days: '3-4 días' },
  'Norte de Santander': { servientrega: 19500, interrapidisimo: 17000, days: '4-5 días' },
  'Boyacá': { servientrega: 13000, interrapidisimo: 11000, days: '2-3 días' },
  'Arauca': { servientrega: 25000, interrapidisimo: 22000, days: '5-6 días' },
  'Atlántico': { servientrega: 22000, interrapidisimo: 19000, days: '4-5 días' },
  'Bolívar': { servientrega: 24000, interrapidisimo: 21000, days: '4-5 días' },
  'Córdoba': { servientrega: 21000, interrapidisimo: 18000, days: '4-5 días' },
  'Sucre': { servientrega: 24500, interrapidisimo: 21500, days: '4-5 días' },
  'Cesar': { servientrega: 23500, interrapidisimo: 20500, days: '4-5 días' },
  'La Guajira': { servientrega: 28000, interrapidisimo: 25000, days: '5-6 días' },
  'Magdalena': { servientrega: 26000, interrapidisimo: 23000, days: '5-6 días' },
  'San Andrés y Providencia': { servientrega: 45000, interrapidisimo: 40000, days: '6-8 días' },
  'Caquetá': { servientrega: 22000, interrapidisimo: 19000, days: '4-5 días' },
  'Putumayo': { servientrega: 25000, interrapidisimo: 22000, days: '5-6 días' },
  'Amazonas': { servientrega: 42000, interrapidisimo: 38000, days: '7-9 días' },
  'Guainía': { servientrega: 45000, interrapidisimo: 40000, days: '7-9 días' },
  'Guaviare': { servientrega: 28000, interrapidisimo: 25000, days: '5-6 días' },
  'Vaupés': { servientrega: 50000, interrapidisimo: 45000, days: '8-10 días' },
  'Vichada': { servientrega: 45000, interrapidisimo: 40000, days: '7-9 días' },
  'default': { servientrega: 18000, interrapidisimo: 15000, days: '4-5 días' },
};

function getShippingPrice(provider: 'servientrega' | 'interrapidisimo', department: string): { price: number; days: string } {
  const zone = shippingZones[department] || shippingZones['default'];
  return {
    price: provider === 'servientrega' ? zone.servientrega : zone.interrapidisimo,
    days: zone.days,
  };
}

export default function ShippingCalculator({ total, onCalculate, onClose }: ShippingCalculatorProps) {
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<'servientrega' | 'interrapidisimo' | null>(null);

  const cities = department ? departments.find(d => d.name === department)?.cities || [] : [];

  const validateAddress = (addr: string): boolean => {
    const cleaned = addr.trim().toLowerCase();
    const patterns = [
      /^(carrera|cra|calle|cl|transversal|transv|av\.?|avenida|diagonal|diag)\s+\d+[\s#\-]?\d*[\s,]*[\w\s]*$/i,
      /^\d+[\s#\-]\d+[\s,]*[\w\s]*$/i,
      /^(carrera|cra|calle|cl)\s+\d+$/i,
      /^(transversal|transv|av\.?|avenida|diagonal|diag)\s+\d+$/i,
    ];
    return patterns.some(p => p.test(cleaned));
  };

  const handleAddressChange = (value: string) => {
    setAddress(value);
    if (value.length > 0 && !validateAddress(value)) {
      setAddressError('Ingresa una dirección válida (ej: Cra 15 #45-67)');
    } else {
      setAddressError('');
    }
  };

  const handleCalculate = () => {
    if (!department || !city || !address) return;
    
    if (!validateAddress(address)) {
      setAddressError('Ingresa una dirección válida (ej: Cra 15 #45-67)');
      return;
    }
    
    const provider = selectedProvider || 'servientrega';
    const { price, days } = getShippingPrice(provider, department);
    
    onCalculate({
      department,
      city,
      address,
      provider,
      shippingPrice: price,
      estimatedDays: days,
    });
  };

  const handleSelectProvider = (provider: 'servientrega' | 'interrapidisimo') => {
    setSelectedProvider(provider);
  };

  const currentProvider = selectedProvider || 'servientrega';
  const currentPricing = department ? getShippingPrice(currentProvider, department) : null;

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

        <div style={{ backgroundColor: '#f0f9f4', padding: 12, borderRadius: 8, marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
            📦 Envío desde <strong>{WAREHOUSE.city}, {WAREHOUSE.department}</strong>
          </p>
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
              setSelectedProvider(null);
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
            onChange={(e) => handleAddressChange(e.target.value)}
            placeholder="Ej: Cra 15 #45-67, Apto 301"
            style={{
              width: '100%',
              padding: 12,
              border: `1px solid ${addressError ? '#d00' : '#ddd'}`,
              borderRadius: 8,
              fontSize: 16,
              boxSizing: 'border-box',
            }}
          />
          {addressError && (
            <p style={{ fontSize: 12, color: '#d00', marginTop: 4 }}>{addressError}</p>
          )}
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
            Formato: Cra/Calle/Av + número (ej: Cra 9, Calle 2, Av 15 #45-67)
          </p>
        </div>

        {department && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>
              Selecciona transportadora:
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {providers.map((provider) => {
                const pricing = getShippingPrice(provider.id, department);
                return (
                  <motion.div
                    key={provider.id}
                    onClick={() => handleSelectProvider(provider.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      flex: 1,
                      padding: 16,
                      border: `2px solid ${selectedProvider === provider.id ? 'var(--accent)' : '#eee'}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      backgroundColor: selectedProvider === provider.id ? 'rgba(16, 185, 129, 0.05)' : 'white',
                      textAlign: 'center',
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{provider.logo}</span>
                    <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14, marginTop: 8 }}>
                      {provider.name}
                    </p>
                    <p style={{ fontWeight: 700, color: 'var(--accent)', fontSize: 16, marginTop: 4 }}>
                      ${pricing.price.toLocaleString('es-CO')}
                    </p>
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 4 }}>
                      {pricing.days}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {department && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              backgroundColor: '#f0f9f4',
              padding: 16,
              borderRadius: 12,
              marginBottom: 20,
              border: '1px solid var(--accent)',
            }}
          >
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
              Resumen del envío:
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              📍 De: {WAREHOUSE.city}, {WAREHOUSE.department}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              📍 Hacia: {city || '...'}, {department}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              🚚 Transportadora: {currentProvider === 'interrapidisimo' ? 'Interrapidisimo' : 'Servientrega'}
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              ⏱️ Tiempo estimado: {currentPricing?.days}
            </p>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--accent)', marginTop: 8 }}>
              Costo de envío: ${currentPricing?.price.toLocaleString('es-CO')}
            </p>
          </motion.div>
        )}

        <div style={{ display: 'flex', gap: 12 }}>
          <motion.button
            onClick={handleCalculate}
            disabled={!department || !city || !address}
            whileHover={{ scale: department && city && address ? 1.02 : 1 }}
            whileTap={{ scale: department && city && address ? 0.98 : 1 }}
            style={{
              flex: 1,
              padding: 14,
              backgroundColor: department && city && address ? 'var(--accent)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              fontWeight: 600,
              cursor: department && city && address ? 'pointer' : 'not-allowed',
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