# Ecommerce Bebidas San Juan

Plataforma de venta online de bebidas premium con delivery 24hs en San Juan. Sin competencia directa en el mercado local.

## 🎯 Objetivo

Facilitar la compra de bebidas para jóvenes 18-35 años en fiestas, previas y eventos, además de ofrecer soluciones B2B para restaurantes y organizadores de eventos.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Backend**: Supabase (Edge Functions + Realtime)
- **Base de Datos**: PostgreSQL (via Supabase)
- **Pagos**: Mercado Pago
- **Hosting**: Vercel
- **Mapas**: Google Maps API

## 📋 Prerequisitos

- Node.js 18+ y npm/yarn
- Cuenta en Supabase (gratuita)
- Cuenta en Mercado Pago (vendedor)
- Google Maps API Key (opcional, para direcciones)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd ecommerce-bebidas-sanjuan
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiá el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Editá `.env.local` con tus credenciales reales.

### 4. Configurar Supabase

#### 4.1 Crear proyecto en Supabase

1. Andá a [supabase.com](https://supabase.com) y creá un proyecto
2. Copiá la URL y anon key desde Project Settings > API
3. Pegá estos valores en tu `.env.local`

#### 4.2 Crear tablas

Ejecutá el siguiente SQL en el SQL Editor de Supabase:

```sql
-- Crear enum types
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'delivery');
CREATE TYPE payment_method_type AS ENUM ('mercadopago', 'cash');
CREATE TYPE payment_status_type AS ENUM ('pending', 'paid', 'failed');
CREATE TYPE order_status_type AS ENUM ('pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled');

-- Tabla profiles (extiende auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  "order" INT DEFAULT 0
);

-- Tabla products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  stock INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  is_pack BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_lat DECIMAL(10,8),
  delivery_lng DECIMAL(11,8),
  subtotal DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method payment_method_type NOT NULL,
  payment_status payment_status_type DEFAULT 'pending',
  mp_preference_id TEXT,
  mp_payment_id TEXT,
  status order_status_type DEFAULT 'pending',
  delivery_person_id UUID REFERENCES profiles(id),
  notes TEXT,
  include_ice BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

-- Tabla order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Tabla delivery_zones
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  polygon GEOGRAPHY(POLYGON, 4326),
  delivery_fee DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

-- Índices
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;

-- Políticas públicas de lectura
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_available = true);
CREATE POLICY "Public read delivery zones" ON delivery_zones FOR SELECT USING (is_active = true);

-- Políticas de orders (usuarios pueden ver sus propios pedidos)
CREATE POLICY "Users can view own orders" ON orders FOR SELECT 
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can view all orders" ON orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'delivery')
    )
  );

-- Políticas de admin
CREATE POLICY "Admins can manage products" ON products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage orders" ON orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'delivery')
    )
  );

-- Trigger para crear profile automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'phone',
    'customer'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 5. Datos iniciales (seed)

Ejecutá este SQL para cargar categorías y productos de prueba:

```sql
-- Insertar categorías
INSERT INTO categories (name, slug, image_url, "order") VALUES
('Cerveza', 'cerveza', 'https://images.unsplash.com/photo-1618885472179-5e474019f2a9', 1),
('Vino', 'vino', 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3', 2),
('Espumantes', 'espumantes', 'https://images.unsplash.com/photo-1547595628-c61a29f496f0', 3),
('Fernet', 'fernet', 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b', 4),
('Whisky', 'whisky', 'https://images.unsplash.com/photo-1527281400683-1aae777175f8', 5),
('Packs Fiesta', 'packs-fiesta', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d', 6);

-- Insertar productos de ejemplo (ajustá según tu inventario real)
INSERT INTO products (name, description, price, category_id, image_url, stock, is_available) 
SELECT 
  'Cerveza Quilmes 1L',
  'Cerveza rubia clásica argentina',
  800,
  id,
  'https://images.unsplash.com/photo-1608270586620-248524c67de9',
  100,
  true
FROM categories WHERE slug = 'cerveza';
```

### 6. Configurar Mercado Pago

1. Creá una cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
2. Obtené tus credenciales de prueba desde el panel
3. Agregá las credenciales en `.env.local`
4. Para producción, activá tu cuenta y usá las credenciales de producción

### 7. Ejecutar en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🚢 Deploy a Producción

### Vercel (recomendado)

1. Pusheá tu código a GitHub
2. Importá el proyecto en [Vercel](https://vercel.com)
3. Agregá las variables de entorno desde Vercel Dashboard
4. Deploy automático con cada push a main

### Variables de entorno en Vercel

Agregá TODAS las variables de `.env.local` en:
Settings > Environment Variables

## 📱 Funcionalidades Principales

- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Checkout con Mercado Pago y efectivo
- ✅ Validación de zona de delivery
- ✅ Tracking en tiempo real del pedido
- ✅ Panel de administración
- ✅ Gestión de productos y stock
- ✅ Sistema de roles (customer, admin, delivery)
- ✅ Notificaciones de pedido

## 🔐 Seguridad

- Row Level Security (RLS) en Supabase
- Autenticación JWT
- Variables de entorno protegidas
- Validación server-side en API routes

## 📊 Monitoreo

- Logs en Vercel Dashboard
- Analytics de Supabase
- Métricas de pagos en Mercado Pago

## 🆘 Troubleshooting

### Error de conexión a Supabase

Verificá que las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén correctas.

### Error en pagos de Mercado Pago

Asegurate de estar usando las credenciales correctas (test vs producción).

### Error de CORS

Next.js maneja CORS automáticamente. Si tenés problemas, verificá la configuración en `next.config.ts`.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados

## 👥 Contacto

Para soporte: soporte@bebidassanjuan.com
