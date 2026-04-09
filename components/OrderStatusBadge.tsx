'use client';

import { OrderStatus } from '@/types';
import {
  Clock,
  CheckCircle,
  ChefHat,
  Truck,
  PackageCheck,
  XCircle,
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: 'Pendiente',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    borderColor: 'border-yellow-300',
    Icon: Clock,
  },
  confirmed: {
    label: 'Confirmado',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-300',
    Icon: CheckCircle,
  },
  preparing: {
    label: 'Preparando',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-300',
    Icon: ChefHat,
  },
  on_the_way: {
    label: 'En camino',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-100',
    borderColor: 'border-indigo-300',
    Icon: Truck,
  },
  delivered: {
    label: 'Entregado',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    borderColor: 'border-green-300',
    Icon: PackageCheck,
  },
  cancelled: {
    label: 'Cancelado',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    Icon: XCircle,
  },
};

export default function OrderStatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];

  if (!config) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
        Desconocido
      </span>
    );
  }

  const { label, color, bgColor, borderColor, Icon } = config;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border ${bgColor} ${color} ${borderColor} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </span>
  );
}
