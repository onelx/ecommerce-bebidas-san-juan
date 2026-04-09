import { Clock, CheckCircle, Package, Truck, XCircle } from "lucide-react";
import type { OrderStatus } from "@/types";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

const statusConfig: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  pending: {
    label: "Pendiente",
    color: "text-yellow-700",
    bgColor: "bg-yellow-100",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmado",
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    icon: CheckCircle,
  },
  preparing: {
    label: "Preparando",
    color: "text-purple-700",
    bgColor: "bg-purple-100",
    icon: Package,
  },
  on_the_way: {
    label: "En Camino",
    color: "text-indigo-700",
    bgColor: "bg-indigo-100",
    icon: Truck,
  },
  delivered: {
    label: "Entregado",
    color: "text-green-700",
    bgColor: "bg-green-100",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Cancelado",
    color: "text-red-700",
    bgColor: "bg-red-100",
    icon: XCircle,
  },
};

const sizeClasses = {
  sm: {
    container: "px-2 py-1 text-xs",
    icon: "w-3 h-3",
  },
  md: {
    container: "px-3 py-1.5 text-sm",
    icon: "w-4 h-4",
  },
  lg: {
    container: "px-4 py-2 text-base",
    icon: "w-5 h-5",
  },
};

export default function OrderStatusBadge({
  status,
  size = "md",
  showIcon = true,
}: OrderStatusBadgeProps) {
  const config = statusConfig[status];
  const sizes = sizeClasses[size];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${sizes.container} ${config.bgColor} ${config.color} rounded-full font-semibold whitespace-nowrap`}
    >
      {showIcon && <Icon className={sizes.icon} />}
      {config.label}
    </span>
  );
}

export function OrderStatusTimeline({
  currentStatus,
  createdAt,
  deliveredAt,
}: {
  currentStatus: OrderStatus;
  createdAt: string;
  deliveredAt?: string;
}) {
  const statuses: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "on_the_way",
    "delivered",
  ];

  const currentIndex = statuses.indexOf(currentStatus);
  const isCancelled = currentStatus === "cancelled";

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <XCircle className="w-5 h-5" />
          <span className="font-semibold">Pedido Cancelado</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {statuses.map((status, index) => {
        const config = statusConfig[status];
        const Icon = config.icon;
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={status} className="flex gap-4">
            {/* Timeline Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? config.bgColor + " " + config.color
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              {index < statuses.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    isCompleted ? "bg-purple-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-2">
                <h4
                  className={`font-semibold ${
                    isCompleted ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {config.label}
                </h4>
                {isCurrent && (
                  <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                    Actual
                  </span>
                )}
              </div>

              {isCompleted && (
                <p className="text-sm text-gray-600 mt-1">
                  {status === "pending" &&
                    new Date(createdAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {status === "delivered" &&
                    deliveredAt &&
                    new Date(deliveredAt).toLocaleString("es-AR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  {status !== "pending" &&
                    status !== "delivered" &&
                    isCurrent &&
                    "En progreso..."}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
