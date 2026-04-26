'use client';

import { motion } from 'motion/react';

export default function Footer() {
  return (
    <motion.footer
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '48px 24px',
        marginTop: 64,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 32,
        }}
      >
        <div>
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: 16,
            }}
          >
            Hypertecnologian
          </h3>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Tu tienda online de confianza para los mejores productos tecnológicos.
          </p>
        </div>
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Contacto
          </h4>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            WhatsApp: +57 3015851969
          </p>
          <p style={{ color: 'var(--text-secondary)' }}>Email: info@hypertecnologian.com</p>
        </div>
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Enlaces
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <a
              href="#"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Términos y condiciones
            </a>
            <a
              href="#"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Política de privacidad
            </a>
            <a
              href="#"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Envíos
            </a>
          </div>
        </div>
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Síguenos
          </h4>
          <div style={{ display: 'flex', gap: 12 }}>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: 'var(--accent)' }}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.637H7.079v-3.473h3.054V9.413c0-3.003 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H17.14c-1.491 0-1.956.447-1.956 1.463v1.812h3.325l-.532 3.473h-2.793v8.637C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.1, color: 'var(--accent)' }}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.227 2.74.064 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.056 8.164 6.999 8.164 1.831 0 2.35-.055 3.564-.196 1.497-.174 2.437-1.195 2.612-2.692.141-.874.196-1.433.196-3.564 0-3.259-.014-3.667-.072-4.947-.2-4.358-2.056-8.164-6.999-8.164C12.667.014 12.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </motion.a>
            <motion.a
              href="https://wa.me/573015851969"
              whileHover={{ scale: 1.1, color: 'var(--accent)' }}
              style={{
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.646.075-.372-.165-1.495-.909-2.838-2.142-1.23-1.094-2.061-2.447-2.304-2.863-.297-.48-.015-.643.224-.873l.372-.483c.223-.273.595-.347.795-.347.198 0 .42-.021.597-.074.178-.052.446-.149.671-.372.149-.148.223-.347.297-.521.074-.174.037-.321.019-.445-.021-.124-.223-.595-.297-.771-.074-.174-.595-.744-1.387-1.486-1.091-1.018-1.837-1.549-2.282-1.988-.371-.366-.446-.521-.62-.521-.173 0-.421-.015-.597.074-.178.089-.371.199-.52.371-.148.172-.772.771-.772 1.854 0 1.078.789 2.142 1.405 2.77.594.595 1.371.917 1.705 1.115.371.221 1.042.074 1.428-.321.385-.372.595-.848.669-1.131.074-.297.02-.521-.015-.724-.021-.124-.223-.595-.297-.771zM12.662 20.371c-1.091 0-2.142-.297-2.982-1.04-.772-.744-1.237-1.737-1.271-1.851-.022-.124-.148-.198-.297-.297-.149-.074-.372-.021-.52.015-.149.074-1.237.743-1.484 2.142-.222 1.262-.074 2.616.371 3.549.445.933 1.155 1.866 2.282 2.77 1.094.744 2.103 1.237 3.035 1.484.198.052.371.074.52.074.149 0 .371-.021.52-.074s.371-.149.445-.223c.074-.074.148-.198.223-.37.074-.174.037-.297.015-.371-.022-.124-.743-1.854-1.008-2.516-.297-.744-.595-1.272-.848-1.487-.149-.124-.297-.221-.52-.37h-.015z" />
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          paddingTop: 32,
          marginTop: 32,
          borderTop: '1px solid #eee',
          textAlign: 'center',
        }}
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          © 2024 Hypertecnologian. Todos los derechos reservados.
        </p>
      </div>
    </motion.footer>
  );
}