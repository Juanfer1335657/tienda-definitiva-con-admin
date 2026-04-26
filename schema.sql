-- Schema para Neon PostgreSQL
-- Ejecutar este script en tu base de datos de Neon

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insertar productos de ejemplo (opcional)
INSERT INTO products (name, description, price, image_url, category) VALUES
  ('Apple Premium', 'Manzana Premium de la mejor calidad', 3500, '/images/Apple.jpg', 'Fruta'),
  ('Reloj Luxus Gold', 'Reloj de lujo estilo oro', 2400000, '/images/reloj_luxus.jpg', 'Accesorio'),
  ('Gafas Urban', 'Gafas estilo urbano', 185000, '/images/Gafas.jpg', 'Moda')
ON CONFLICT DO NOTHING;