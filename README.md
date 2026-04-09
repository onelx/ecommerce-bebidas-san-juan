# 🍺 Ecommerce Bebidas San Juan

Plataforma de venta online de bebidas premium con delivery 24hs en San Juan, Argentina.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + React 18
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Pagos**: Mercado Pago
- **Mapas**: Google Maps API
- **Hosting**: Vercel

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Mercado Pago Developers](https://www.mercadopago.com.ar/developers)
- API Key de [Google Maps](https://console.cloud.google.com/)

## 🛠️ Instalación y Setup

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd ecommerce-bebidas-sanjuan
npm install
```

### 2. Configurar Supabase

1. Crea un nuevo proyecto en [Supabase](https://supabase.com/dashboard)
2. Ve a `Settings > API` y copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Ejecutar migraciones de base de datos

Ve a SQL Editor en Supabase y ejecuta el script de migración:

```sql
-- Ver archivo: supabase/migrations/001_initial_schema.sql
```

### 4. Configurar variables de entorno

```bash
cp .env.example .env
```

Completa todas las variables en el archivo `.env` con tus credenciales reales.

### 5. Configurar Mercado Pago

1. Ve a [Mercado Pago Developers](https://www.mercadopago.com.ar/developers/panel)
2. Crea una aplicación nueva
3. Copia tus credenciales de TEST para desarrollo
4. Configura la URL de webhooks: `https://tu-dominio.com/api/webhooks/mercadopago`

### 6. Configurar Google Maps

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto y activa las APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Crea credenciales (API Key)
4. Restringe la key a tu dominio en producción

## 🏃 Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🏗️ Build para producción

```bash
npm run build
npm start
```

## 📦 Deploy en Vercel

1. Conecta tu repositorio en [Vercel](https://vercel.com)
2. Configura las variables de entorno (todas las del `.env`)
3. Deploy automático en cada push a `main`

## 🗄️ Estructura del Proyecto

```
/app
  /api              # API Routes (endpoints REST)
  /admin            # Dashboard administrativo
  /(shop)           # Rutas del ecommerce
    /catalogo       # Catálogo de productos
    /producto       # Detalle de producto
    /carrito        # Carrito de compras
    /checkout       # Proceso de pago
    /tracking       # Seguimiento de pedido
  /login            # Autenticación
/components         # Componentes reutilizables
/hooks              # Custom React Hooks
/lib                # Utilidades y configuración
/services           # Lógica de negocio
/types              # Definiciones TypeScript
/supabase           # Migraciones y funciones
```

## 🔑 Usuarios de prueba

### Cliente
- Email: cliente@test.com
- Password: test123

### Admin
- Email: admin@bebidassanjuan.com
- Password: (configurado en ADMIN_PASSWORD)

## 🧪 Testing de Pagos (Mercado Pago)

Usa estas tarjetas de prueba:

- **Aprobado**: 5031 7557 3453 0604 | CVV: 123 | Exp: 11/25
- **Rechazado**: 5031 4332 1540 6351 | CVV: 123 | Exp: 11/25

Más info: [Tarjetas de prueba MP](https://www.mercadopago.com.ar/developers/es/docs/checkout-api/testing)

## 📱 Funcionalidades Principales

- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Checkout con validación de zona de entrega
- ✅ Pago con Mercado Pago o efectivo
- ✅ Tracking en tiempo real con Supabase Realtime
- ✅ Panel admin para gestión de pedidos y productos
- ✅ Notificaciones por WhatsApp (opcional)
- ✅ Delivery 24hs en San Juan

## 🔐 Seguridad

- Row Level Security (RLS) habilitado en todas las tablas
- Validación de zona de entrega server-side
- Webhooks firmados de Mercado Pago
- Service Role Key solo en server-side

## 📞 Soporte

Para consultas: soporte@bebidassanjuan.com

## 📄 Licencia

Proyecto privado - Todos los derechos reservados
