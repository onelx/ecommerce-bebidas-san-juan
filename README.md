# Ecommerce Bebidas San Juan

Plataforma de venta online de bebidas premium con delivery 24hs en San Juan, Argentina.

## Características

- 🚀 Catálogo de productos con filtros avanzados
- 🛒 Carrito de compras con persistencia local
- 💳 Integración con Mercado Pago
- 📍 Validación de zonas de cobertura
- 🚚 Tracking en tiempo real de pedidos
- 👨‍💼 Panel administrativo completo
- 📱 100% responsive y mobile-first
- ⚡ Delivery 24 horas

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Pagos**: Mercado Pago
- **Estado**: Zustand + React Query
- **Hosting**: Vercel

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase
- Cuenta en Mercado Pago (vendedor)
- Cuenta en Google Cloud (para Maps API)

## Instalación

1. **Clonar el repositorio**
```bash
git clone <repo-url>
cd ecommerce-bebidas-sanjuan
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Editar `.env.local` con tus credenciales reales.

4. **Configurar Supabase**

Ejecutar las migraciones SQL en tu proyecto de Supabase (ver carpeta `/supabase/migrations`).

Habilitar Row Level Security (RLS) en todas las tablas.

Configurar políticas de seguridad según los archivos de migración.

5. **Ejecutar en desarrollo**
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Configuración de Supabase

### 1. Crear proyecto en Supabase
- Ir a https://app.supabase.com
- Crear nuevo proyecto
- Copiar URL y anon key

### 2. Ejecutar migraciones
Ejecutar el SQL de la carpeta `supabase/migrations` en el editor SQL de Supabase.

### 3. Configurar Storage
Crear buckets:
- `product-images` (público)
- `category-images` (público)

### 4. Configurar Realtime
Habilitar Realtime en la tabla `orders` para tracking en vivo.

## Configuración de Mercado Pago

1. Crear cuenta de vendedor en https://www.mercadopago.com.ar
2. Ir a Developers > Credenciales
3. Copiar Public Key y Access Token
4. Configurar webhook URL en MP: `https://tu-dominio.com/api/webhooks/mercadopago`

## Despliegue en Vercel

1. **Conectar repositorio**
```bash
npm install -g vercel
vercel login
vercel
```

2. **Configurar variables de entorno**
En el dashboard de Vercel, agregar todas las variables de `.env.example`

3. **Desplegar**
```bash
vercel --prod
```

## Estructura del Proyecto

```
├── app/
│   ├── (admin)/          # Rutas del panel admin
│   ├── (auth)/           # Rutas de autenticación
│   ├── (shop)/           # Rutas de la tienda
│   ├── api/              # API Routes
│   ├── globals.css       # Estilos globales
│   └── layout.tsx        # Layout raíz
├── components/           # Componentes reutilizables
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuración
├── services/             # Servicios de API
├── types/                # Tipos TypeScript
└── public/               # Archivos estáticos
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## Testing

```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage
```

## Roadmap

- [ ] Integración con WhatsApp Business API
- [ ] Programa de puntos y fidelización
- [ ] App móvil nativa (React Native)
- [ ] Integración con sistemas de facturación (AFIP)
- [ ] Multi-tienda (expandir a otras provincias)
- [ ] Análisis predictivo de stock

## Soporte

Para soporte, enviar email a soporte@bebidassanjuan.com

## Licencia

Propietario. Todos los derechos reservados.
