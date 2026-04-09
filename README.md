# Bebidas San Juan - Ecommerce de Bebidas Premium

Plataforma de venta online de bebidas premium con delivery 24 horas en San Juan Capital.

## Stack Tecnológico

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions + Realtime)
- **Pagos**: Mercado Pago
- **Hosting**: Vercel
- **Notificaciones**: WhatsApp Business API

## Características Principales

- ✅ Catálogo de productos con filtros avanzados
- ✅ Carrito de compras con persistencia local
- ✅ Checkout con validación de zona de cobertura
- ✅ Pagos con Mercado Pago o efectivo
- ✅ Tracking en tiempo real del pedido
- ✅ Panel administrativo completo
- ✅ Sistema de roles (cliente, admin, repartidor)
- ✅ Notificaciones automáticas por WhatsApp

## Requisitos Previos

- Node.js 18+ 
- npm o yarn
- Cuenta de Supabase
- Cuenta de Mercado Pago
- Google Maps API Key (opcional, para autocompletado de direcciones)
- WhatsApp Business API (opcional, para notificaciones)

## Instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd bebidas-san-juan
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar el archivo `.env.example` a `.env.local` y completar con tus credenciales:

```bash
cp .env.example .env.local
```

4. **Configurar Supabase**

Ejecutar las migraciones SQL en tu proyecto Supabase (ver carpeta `/supabase/migrations`):

- Crear tablas: profiles, categories, products, orders, order_items, delivery_zones
- Configurar Row Level Security (RLS)
- Habilitar Realtime para la tabla `orders`

5. **Ejecutar en desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (admin)/           # Panel administrativo
│   ├── (shop)/            # Tienda (catálogo, producto, carrito)
│   ├── api/               # API Routes
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (shadcn/ui)
│   └── ...               # Componentes de negocio
├── hooks/                # Custom React Hooks
├── lib/                  # Utilidades y configuración
├── services/             # Servicios de API
├── store/                # Zustand stores
├── types/                # TypeScript types
└── public/               # Archivos estáticos
```

## Despliegue en Vercel

1. **Conectar repositorio a Vercel**

```bash
npm i -g vercel
vercel
```

2. **Configurar variables de entorno**

En el dashboard de Vercel, agregar todas las variables del archivo `.env.example`

3. **Configurar dominios**

- Configurar dominio personalizado en Vercel
- Actualizar `NEXT_PUBLIC_APP_URL` con el dominio de producción

## Configuración de Mercado Pago

1. Crear cuenta en https://www.mercadopago.com.ar
2. Obtener credenciales de producción: https://www.mercadopago.com.ar/developers/panel/credentials
3. Configurar webhook en Mercado Pago apuntando a: `https://tu-dominio.com/api/webhooks/mercadopago`

## Base de Datos

### Tablas Principales

- `profiles`: Usuarios del sistema (clientes, admins, repartidores)
- `categories`: Categorías de productos
- `products`: Catálogo de bebidas
- `orders`: Pedidos realizados
- `order_items`: Items de cada pedido
- `delivery_zones`: Zonas de cobertura con polígonos geográficos

### Políticas de Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado:
- Clientes solo ven sus propios pedidos
- Admins tienen acceso completo
- Repartidores solo ven pedidos asignados

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## Licencia

MIT
