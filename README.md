# Bebidas San Juan - Ecommerce de Bebidas Premium

Plataforma de venta online y delivery 24hs de bebidas premium en San Juan Capital.

## 🚀 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Pagos**: Mercado Pago
- **Hosting**: Vercel
- **Notificaciones**: WhatsApp Business API

## 📋 Requisitos Previos

- Node.js 18+ y npm
- Cuenta de Supabase (gratis)
- Cuenta de Mercado Pago (Argentina)
- Google Maps API Key
- WhatsApp Business API (opcional para notificaciones)

## 🛠️ Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/bebidas-san-juan.git
cd bebidas-san-juan
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales reales (ver sección de configuración abajo).

4. **Ejecutar migraciones de base de datos**

Ir a tu proyecto de Supabase > SQL Editor y ejecutar:
```sql
-- Ver archivo migrations/001_initial_schema.sql
```

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🔑 Configuración de Servicios

### Supabase

1. Crear proyecto en https://supabase.com
2. Ir a Settings > API
3. Copiar:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Mercado Pago

1. Ir a https://www.mercadopago.com.ar/developers/panel/credentials
2. Activar modo producción o usar credenciales de prueba
3. Copiar:
   - Public Key → `NEXT_PUBLIC_MP_PUBLIC_KEY`
   - Access Token → `MP_ACCESS_TOKEN`

### Google Maps

1. Ir a https://console.cloud.google.com/google/maps-apis/credentials
2. Crear credencial de API Key
3. Habilitar APIs: Places API, Maps JavaScript API, Geocoding API
4. Copiar API Key → `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`

### WhatsApp Business (Opcional)

Usar un proveedor como Twilio, MessageBird o similar:
- `WHATSAPP_API_URL`: URL del endpoint
- `WHATSAPP_API_TOKEN`: Token de autenticación
- `WHATSAPP_PHONE_NUMBER`: Número verificado formato +5492641234567

## 📦 Estructura del Proyecto

```
├── app/
│   ├── (admin)/           # Rutas protegidas de admin
│   ├── (public)/          # Rutas públicas
│   ├── api/               # API routes
│   ├── globals.css
│   └── layout.tsx
├── components/            # Componentes reutilizables
├── hooks/                 # Custom React hooks
├── lib/                   # Configuración y utilidades
├── services/              # Servicios de negocio
├── types/                 # Tipos TypeScript
└── migrations/            # Migraciones SQL
```

## 🚢 Despliegue a Producción

### Vercel (Recomendado)

1. Conectar repositorio en https://vercel.com
2. Configurar variables de entorno en Settings > Environment Variables
3. Deploy automático en cada push a main

### Configuración Post-Deploy

1. **Configurar webhook de Mercado Pago**:
   - URL: `https://tu-dominio.com/api/webhooks/mercadopago`
   - Eventos: payment, merchant_order

2. **Configurar dominio personalizado** (opcional):
   - En Vercel > Settings > Domains

3. **Configurar CORS en Supabase**:
   - Settings > API > CORS
   - Agregar tu dominio de producción

## 👤 Usuarios de Prueba

### Admin
- Email: admin@bebidassanjuan.com
- Password: (configurar en Supabase Auth)

### Cliente de Prueba
- Registrarse normalmente desde /login

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Build de producción
npm run build
```

## 📊 Base de Datos

La base de datos incluye:
- **profiles**: Usuarios (customers, admin, delivery)
- **categories**: Categorías de productos
- **products**: Catálogo de bebidas
- **orders**: Pedidos con estado y tracking
- **order_items**: Items de cada pedido
- **delivery_zones**: Zonas de cobertura geográficas

Ver esquema completo en `migrations/001_initial_schema.sql`

## 🔐 Seguridad

- Row Level Security (RLS) activado en todas las tablas
- Autenticación con Supabase Auth
- Validación de roles en API routes
- Sanitización de inputs
- Rate limiting en webhooks

## 📱 Funcionalidades Principales

### Cliente
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Checkout con dirección y pago
- ✅ Tracking en tiempo real del pedido
- ✅ Historial de pedidos

### Admin
- ✅ Dashboard con métricas
- ✅ Gestión de productos (CRUD)
- ✅ Gestión de pedidos
- ✅ Asignación de repartidores
- ✅ Control de stock

### Delivery
- ✅ Ver pedidos asignados
- ✅ Actualizar estado de entrega
- ✅ Navegación GPS a dirección

## 🆘 Soporte

Para problemas o preguntas:
- Email: soporte@bebidassanjuan.com
- GitHub Issues: https://github.com/tu-usuario/bebidas-san-juan/issues

## 📄 Licencia

MIT License - ver archivo LICENSE

## 🙏 Créditos

Desarrollado por IdeaForge para Bebidas San Juan
