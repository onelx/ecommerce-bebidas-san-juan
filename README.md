# Ecommerce Bebidas San Juan

Plataforma de venta online de bebidas premium con delivery 24hs en San Juan. Sistema de pedidos en tiempo real con tracking de entregas.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Autenticación**: Supabase Auth
- **Pagos**: Mercado Pago
- **Mapas**: Google Maps API
- **Hosting**: Vercel

## 📋 Prerequisitos

- Node.js 18+ y npm/yarn
- Cuenta en Supabase (gratuita)
- Cuenta en Mercado Pago (cuenta vendedor)
- Google Maps API Key (opcional para autocompletado de direcciones)

## 🛠️ Setup Local

### 1. Clonar el repositorio

```bash
git clone [tu-repo]
cd ecommerce-bebidas-sanjuan
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Crear un proyecto en [Supabase](https://app.supabase.com)
2. Ejecutar las migraciones SQL (ver sección Database Setup)
3. Obtener las credenciales: Settings > API

### 4. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Completar todas las variables en `.env.local` con tus credenciales.

### 5. Iniciar servidor de desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Database Setup

Ejecutá este SQL en el SQL Editor de Supabase:

```sql
-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enum types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'delivery');
CREATE TYPE payment_method AS ENUM ('mercadopago', 'cash');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled');

-- Tabla de perfiles (extiende auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_pack BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de zonas de delivery
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  polygon GEOGRAPHY(POLYGON, 4326),
  delivery_fee DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de pedidos
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number SERIAL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_lat DECIMAL(10,8),
  delivery_lng DECIMAL(11,8),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status DEFAULT 'pending',
  mp_preference_id TEXT,
  mp_payment_id TEXT,
  status order_status DEFAULT 'pending',
  delivery_person_id UUID REFERENCES profiles(id),
  notes TEXT,
  include_ice BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- Tabla de items de pedido
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Índices para performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- RLS (Row Level Security) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura
CREATE POLICY "Categories públicas" ON categories FOR SELECT TO public USING (true);
CREATE POLICY "Productos públicos" ON products FOR SELECT TO public USING (is_available = true);

-- Políticas de orders (lectura por email o auth)
CREATE POLICY "Ver propios pedidos" ON orders FOR SELECT TO public 
  USING (customer_email = auth.jwt()->>'email' OR auth.uid() IN (
    SELECT id FROM profiles WHERE role IN ('admin', 'delivery')
  ));

-- Políticas admin
CREATE POLICY "Admin full access orders" ON orders FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));

CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated
  USING (auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin'));
```

### 6. Seed de datos iniciales (opcional)

```sql
-- Categorías
INSERT INTO categories (name, slug, image_url, "order") VALUES
  ('Cervezas', 'cervezas', 'https://placehold.co/400x300/FFA500/white?text=Cervezas', 1),
  ('Vinos', 'vinos', 'https://placehold.co/400x300/8B0000/white?text=Vinos', 2),
  ('Espumantes', 'espumantes', 'https://placehold.co/400x300/FFD700/white?text=Espumantes', 3),
  ('Fernet', 'fernet', 'https://placehold.co/400x300/654321/white?text=Fernet', 4),
  ('Packs', 'packs', 'https://placehold.co/400x300/4169E1/white?text=Packs', 5);

-- Usuario admin de prueba (cambiar credenciales en producción)
INSERT INTO profiles (id, full_name, phone, role) 
VALUES ('uuid-del-usuario-admin', 'Admin', '+542645555555', 'admin');
```

## 🚢 Deploy en Vercel

1. Hacer push a GitHub/GitLab
2. Importar proyecto en [Vercel](https://vercel.com)
3. Configurar las variables de entorno
4. Deploy automático

## 📱 Funcionalidades Principales

- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras con persistencia
- ✅ Checkout con Mercado Pago o efectivo
- ✅ Validación de zona de cobertura
- ✅ Tracking en tiempo real del pedido
- ✅ Panel admin para gestión de pedidos y productos
- ✅ Notificaciones automáticas por WhatsApp
- ✅ Sistema de roles (cliente, admin, repartidor)

## 🔐 Roles y Permisos

- **Customer**: Ver productos, hacer pedidos, trackear entregas
- **Admin**: Gestión completa de productos, pedidos y usuarios
- **Delivery**: Ver pedidos asignados, actualizar estado de entrega

## 📞 Soporte

Para consultas técnicas o comerciales: [tu-email@ejemplo.com]

## 📄 Licencia

Propietario: [Tu Empresa]. Todos los derechos reservados.
