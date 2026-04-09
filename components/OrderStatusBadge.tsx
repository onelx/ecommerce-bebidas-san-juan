import { OrderStatus } from '@/types';
import { 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Truck, 
  Package, 
  XCircle 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const statusConfig: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: Clock,
    description: 'Esperando confirmación'
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: CheckCircle2,
    description: 'Pedido confirmado'
  },
  preparing: {
    label: 'Preparando',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: ChefHat,
    description: 'Preparando tu pedido'
  },
  on_the_way: {
    label: 'En Camino',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    icon: Truck,
    description: 'El repartidor va hacia vos'
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: Package,
    description: 'Pedido entregado'
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: XCircle,
    description: 'Pedido cancelado'
  }
};

export default function OrderStatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className = ''
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span 
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full
        ${config.bgColor} ${config.color} ${sizeClasses[size]} ${className}
      `}
      title={config.description}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}

export function OrderStatusTimeline({ 
  currentStatus 
}: { 
  currentStatus: OrderStatus 
}) {
  const timelineSteps: OrderStatus[] = [
    'pending',
    'confirmed',
    'preparing',
    'on_the_way',
    'delivered'
  ];

  const currentIndex = timelineSteps.indexOf(currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-3 text-red-700">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Pedido Cancelado</p>
            <p className="text-sm text-red-600">Este pedido fue cancelado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timelineSteps.map((step, index) => {
        const config = statusConfig[step];
        const Icon = config.icon;
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isPending = index > currentIndex;

        return (
          <div key={step} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${isCompleted ? 'bg-green-100 border-green-500' : ''}
                  ${isCurrent ? `${config.bgColor} border-current ${config.color}` : ''}
                  ${isPending ? 'bg-gray-100 border-gray-300' : ''}
                `}
              >
                <Icon 
                  className={`
                    w-5 h-5
                    ${isCompleted ? 'text-green-600' : ''}
                    ${isCurrent ? config.color : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}
                />
              </div>
              {index < timelineSteps.length - 1 && (
                <div 
                  className={`
                    w-0.5 h-12 transition-all
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>

            <div className="flex-1 pb-8">
              <p 
                className={`
                  font-semibold mb-1
                  ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
                `}
              >
                {config.label}
              </p>
              <p 
                className={`
                  text-sm
                  ${isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'}
                `}
              >
                {config.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
