import { OrderStatus } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  Package, 
  XCircle 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<OrderStatus, {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: {
    label: 'Pendiente',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    icon: Clock
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: CheckCircle
  },
  preparing: {
    label: 'Preparando',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: ChefHat
  },
  on_the_way: {
    label: 'En camino',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    icon: Truck
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: Package
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle
  }
};

const sizeClasses = {
  sm: {
    container: 'px-2 py-1 text-xs',
    icon: 'w-3 h-3'
  },
  md: {
    container: 'px-3 py-1.5 text-sm',
    icon: 'w-4 h-4'
  },
  lg: {
    container: 'px-4 py-2 text-base',
    icon: 'w-5 h-5'
  }
};

export default function OrderStatusBadge({ 
  status, 
  size = 'md',
  showIcon = true 
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClass = sizeClasses[size];
  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full border
        ${config.color} ${config.bgColor} ${config.borderColor}
        ${sizeClass.container}
      `}
    >
      {showIcon && <Icon className={sizeClass.icon} />}
      <span>{config.label}</span>
    </span>
  );
}

export function OrderStatusTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const steps: Array<{ status: OrderStatus; label: string }> = [
    { status: 'pending', label: 'Pedido recibido' },
    { status: 'confirmed', label: 'Confirmado' },
    { status: 'preparing', label: 'Preparando' },
    { status: 'on_the_way', label: 'En camino' },
    { status: 'delivered', label: 'Entregado' }
  ];

  const currentIndex = steps.findIndex(step => step.status === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <XCircle className="w-6 h-6" />
          <div>
            <p className="font-bold">Pedido cancelado</p>
            <p className="text-sm">Este pedido ha sido cancelado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-bold text-gray-900 mb-4">Estado del pedido</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const config = statusConfig[step.status];
          const Icon = config.icon;

          return (
            <div key={step.status} className="flex items-start gap-4">
              <div className="relative flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full border-2 flex items-center justify-center
                    ${isCompleted 
                      ? `${config.bgColor} ${config.borderColor} ${config.color}` 
                      : 'bg-gray-100 border-gray-300 text-gray-400'
                    }
                    ${isCurrent ? 'ring-4 ring-purple-100' : ''}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-0.5 h-12 mt-2
                      ${isCompleted ? 'bg-purple-600' : 'bg-gray-300'}
                    `}
                  />
                )}
              </div>

              <div className="flex-1 pt-2">
                <p
                  className={`
                    font-semibold
                    ${isCompleted ? 'text-gray-900' : 'text-gray-500'}
                  `}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-sm text-purple-600 mt-1">
                    En proceso...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
