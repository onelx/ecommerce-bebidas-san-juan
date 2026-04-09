# Ecommerce Bebidas San Juan

Plataforma de venta online de bebidas premium con delivery 24hs en San Juan.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Pagos**: Mercado Pago
- **Mapas**: Google Maps API
- **Hosting**: Vercel

## 📋 Prerequisitos

- Node.js 18+ y npm/yarn
- Cuenta de Supabase
- Cuenta de Mercado Pago (credenciales de prueba o producción)
- API Key de Google Maps

## 🛠️ Instalación

1. **Clonar el repositorio**

```bash
git clone <tu-repo>
cd ecommerce-bebidas-sj
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiá `.env.example` a `.env.local` y completá todas las variables:

```bash
cp .env.example .env.local
```

4. **Configurar Supabase**

- Creá un proyecto en [Supabase](https://app.supabase.com)
- Ejecutá las migraciones SQL (ver carpeta `/supabase/migrations`)
- Configurá las políticas RLS según documentación

5. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Base de Datos

### Migraciones

Las migraciones SQL están en `/supabase/migrations/`. Ejecutalas en orden en tu proyecto de Supabase.

### Esquema Principal

- **profiles**: Usuarios y roles (customer, admin, delivery)
- **categories**: Categorías de productos
- **products**: Productos con stock y precios
- **orders**: Pedidos con estados y tracking
- **order_items**: Items de cada pedido
- **delivery_zones**: Zonas de cobertura con polígonos geográficos

## 🔐 Autenticación

El sistema usa Supabase Auth con:
- Email/Password para usuarios registrados
- Modo invitado para compras sin registro
- Roles: customer, admin, delivery

## 💳 Integración Mercado Pago

1. Configurá tus credenciales en `.env.local`
2. El webhook debe apuntar a: `https://tu-dominio.com/api/webhooks/mercadopago`
3. Configurá el webhook en tu panel de Mercado Pago

## 🗺️ Google Maps

Necesitás habilitar las siguientes APIs:
- Maps JavaScript API
- Geocoding API
- Places API

## 🚀 Deploy en Vercel

1. **Conectá el repositorio**

```bash
vercel
```

2. **Configurá variables de entorno**

Agregá todas las variables de `.env.local` en Vercel Dashboard.

3. **Deploy**

```bash
vercel --prod
```

## 📱 Funcionalidades Principales

### Para Clientes
- Catálogo de productos con filtros
- Carrito de compras persistente
- Checkout con validación de zona
- Pago online (Mercado Pago) o efectivo
- Tracking en tiempo real del pedido

### Para Administradores
- Dashboard con métricas del día
- Gestión de productos (CRUD)
- Gestión de pedidos
- Asignación de repartidores
- Notificaciones por WhatsApp

### Para Repartidores
- Vista de pedidos asignados
- Actualización de estados
- Información de entrega

## 🔧 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificación de tipos
```

## 📄 Licencia

Propietario - Todos los derechos reservados

## 🆘 Soporte

Para problemas o consultas, contactá a: soporte@bebidasanjuan.com
