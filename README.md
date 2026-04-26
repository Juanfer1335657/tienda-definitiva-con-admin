# Hypertecnologian - Tienda Online

Tienda online construida con Next.js 15 + Vercel que permite mostrar productos, agregarlos al carrito y realizar pedidos por WhatsApp. Panel de administración integrado para gestionar productos.

## Tabla de Contenidos

- [Tecnologias](#tecnologias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalacion](#instalacion)
- [Ejecucion](#ejecucion)
- [Configuracion Vercel](#configuracion-vercel)
  - [Neon Database](#neon-database)
  - [Vercel Blob](#vercel-blob)
  - [Variables de Entorno](#variables-de-entorno)
- [Estructura del Codigo](#estructura-del-codigo)
  - [ page.tsx](#pagetsx)
  - [lib/db.ts](#libdbts)
  - [lib/auth.ts](#libauthts)
- [Estilos](#estilos)
  - [Variables CSS](#variables-css)
  - [Paleta de Colores](#paleta-de-colores)
- [Animaciones](#animaciones)
- [Mensaje de WhatsApp](#estructura-del-mensaje-de-whatsapp)
- [Rutas](#rutas)
- [Funcionalidades](#funcionalidades)
  - [Público](#público)
  - [Admin](#admin)
- [Posibles Mejoras](#posibles-mejoras)

---

## Tecnologias

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Next.js | 15.x | Framework de UI + API |
| React | 19.x | Componentes |
| Motion | latest | Animaciones |
| Neon | latest | PostgreSQL Database |
| Vercel Blob | latest | Storage imágenes |
| TypeScript | 5.x | Tipado |

## Estructura del Proyecto

```
hypertecnologian/
├── public/
│   └── hypertecnologian/     # Imágenes de productos
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth/      # Login/logout
│   │   │   ├── products/   # CRUD productos
│   │   │   └── upload/    # Subir imágenes
│   │   ├── admin/         # Páginas admin
│   │   │   ├── dashboard/
│   │   │   └── productos/
│   │   ├── page.tsx       # Página principal
│   │   └── layout.tsx     # Layout base
│   ├── components/         # Componentes React
│   │   ├── Header.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CartModal.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── db.ts          # Conexión a Neon
│   │   └── auth.ts        # Autenticación JWT
│   ├── app/globals.css    # Estilos globales
│   └── app/layout.tsx
├── schema.sql            # Schema de base de datos
├── .env.example         # Variables de entorno ejemplo
└── package.json
```

## Instalacion

1. Clonar o descargar el proyecto
2. Instalar dependencias:

```bash
npm install
```

## Ejecucion

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El proyecto se abrira en `http://localhost:3000`

## Configuracion Vercel

### 1. Provisionar Neon Database

1. Ir a [Vercel Marketplace](https://vercel.com/marketplace)
2. Buscar "Neon" o "Postgres"
3. Click en "Install"
4. Seleccionar o crear un proyecto
5. Configurar:
   - **Nombre:** hypertecnologian-db
   - **Region:** us-east-1 (o la mas cercana)
6. Click en "Create"

### 2. Provisionar Vercel Blob

1. Ir a [Vercel Marketplace](https://vercel.com/marketplace)
2. Buscar "Vercel Blob" o "Blob Storage"
3. Click en "Install"
4. Configurar:
   - **Nombre:** hypertecnologian-images
5. Click en "Create"

### 3. Variables de Entorno

Despues deProvisionar, las variables se configuraran automaticamente. Verificar que existan:

```
DATABASE_URL=postgres://...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

Tambien agregar:

```
JWT_SECRET=una-clave-secreta-segura
NEXT_PUBLIC_WHATSAPP_NUMBER=573015851969
```

### 4. Ejecutar Schema

1. Ir al dashboard de Neon
2. Abrir el Query Editor
3. Copiar y ejecutar el contenido de `schema.sql`

## Estructura del Codigo

### page.tsx

Componente principal que renderiza:
- Header con logo y boton del carrito
- Seccion hero con titulo animado
- Grid de productos
- Modal del carrito
- Footer

### lib/db.ts

Funciones de base de datos:

| Funcion | Descripcion |
|---------|-------------|
| `getProducts()` | Obtiene todos los productos |
| `getProduct(id)` | Obtiene un producto por ID |
| `createProduct(data)` | Crea un nuevo producto |
| `updateProduct(id, data)` | Actualiza un producto |
| `deleteProduct(id)` | Elimina un producto |
| `getAdmin(email)` | Obtiene admin por email |
| `createAdmin(email, hash)` | Crea un nuevo admin |

### lib/auth.ts

Funciones de autenticacion:

| Funcion | Descripcion |
|---------|-------------|
| `createToken(payload)` | Crea token JWT |
| `verifyToken(token)` | Verifica token JWT |
| `getSession()` | Obtiene sesion actual |
| `setSession(email)` | Guarda sesion en cookie |
| `clearSession()` | Elimina sesion |

## Estilos

### Variables CSS

En `src/app/globals.css`:

```css
:root {
  --bg-primary: #FAFAFA;        /* Fondo principal */
  --bg-secondary: #FFFFFF;        /* Fondo de tarjetas */
  --text-primary: #1A1A1A;      /* Texto principal */
  --text-secondary: #6B7280;      /* Texto secundario */
  --accent: #10B981;              /* Color de acento (verde) */
  --accent-hover: #059669;        /* Color hover del acento */
  --gold: #D4AF37;               /* Color dorado */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1);
  --radius: 16px;                /* Radio de bordes */
}
```

### Paleta de Colores

| Elemento | Color | Uso |
|----------|-------|-----|
| Fondo principal | #FAFAFA | Body de la pagina |
| Fondo secundario | #FFFFFF | Tarjetas, modal |
| Texto principal | #1A1A1A | Titulos, precios |
| Texto secundario | #6B7280 | Descripciones |
| Acento (verde) | #10B981 | Botones, precios |
| Hover acento | #059669 | Estados hover |
| Dorado | #D4AF37 | Highlights especiales |

### Tipografia

- **Fuente:** Inter (Google Fonts)
- **Pesos:** 300, 400, 500, 600, 700

## Animaciones

El proyecto usa **Motion** (Framer Motion) para animaciones:

| Elemento | Animacion |
|---------|----------|
| Hero entrance | Fade in + slide up |
| Letras del titulo | Stagger individual |
| Productos | Scale + fade in |
| ProductCard hover | Scale 1.02 + zoom imagen |
| Modal | Backdrop fade + scale |
| Botones hover/tap | Scale responsive |
| Carrito badge | Pop animation |

## Estructura del Mensaje de WhatsApp

```
Nuevo Pedido!

Apple Premium - $3,500
Reloj Luxus Gold - $2,400,000
Gafas Urban - $185,000

Total: $2,588,500

Hola! Quiero hacer este pedido
```

## Rutas

| Ruta | Descripcion | Acceso |
|------|-----------|--------|
| `/` | Catalogo publica | Publico |
| `/admin` | Login admin | Publico |
| `/admin/dashboard` | Panel admin | Protegido |
| `/admin/productos` | Lista productos | Protegido |
| `/admin/productos/nuevo` | Agregar producto | Protegido |
| `/admin/productos/[id]` | Editar producto | Protegido |

## Funcionalidades

### Público
- [x] Ver catalogo de productos (desde DB)
- [x] Agregar productos al carrito
- [x] Modal emergente del carrito
- [x] Eliminar productos del carrito
- [x] Vaciar carrito completamente
- [x] Calcular total automaticamente
- [x] Enviar pedido formateado por WhatsApp
- [x] Indicador de cantidad en el carrito (badge)
- [x] Diseno responsive (mobile, tablet, desktop)
- [x] Animaciones suaves
- [x] Precio en COP con formato colombiano
- [x] Badge de categoria en productos
- [x] Efecto zoom en imagenes al hacer hover

### Admin
- [x] Login con email/password
- [x] Panel dashboard
- [x] Lista de productos con tabla
- [x] Agregar nuevo producto (texto + imagen)
- [x] Editar producto existente
- [x] Eliminar producto
- [x] Subir imagenes a Vercel Blob

## Posibles Mejoras

- [ ] Filtros por categoria
- [ ] Barra de busqueda
- [ ] Persistencia del carrito (localStorage)
- [ ] Pagina de detalle del producto
- [ ] Sistema de categorias
- [ ] Animacion al agregar al carrito
- [ ] Notificaciones toast
- [ ] Formulario de datos del cliente
- [ ] Historial de pedidos
- [ ] Multiples metodos de envio
- [ ] Soporte para multiples idiomas
- [ ] Modo oscuro

## Autor

**Hypertecnologian**

## Numero de Contacto

+57 3015851969