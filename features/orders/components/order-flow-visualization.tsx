"use client";

import { IOrder } from "../types/order-type";
import { cn } from "@/lib/utils";

const OrderStatus = {
  WAITING_BAKERY_CONFIRM: 1,
  PROCESSING: 2,
  READY_FOR_PICKUP: 3,
  SHIPPING: 4,
  COMPLETED: 5,
  CANCELED: -1,
};

interface OrderFlowVisualizationProps {
  order: IOrder;
}

export default function OrderFlowVisualization({
  order,
}: OrderFlowVisualizationProps) {
  const currentStatus = order.order_status;
  const currentStep =
    OrderStatus[currentStatus as keyof typeof OrderStatus] || 0;

  // Determine step labels based on shipping_type
  const getStepLabel = (stepId: string) => {
    if (stepId === "SHIPPING") {
      return `Đang giao hàng${
        order.shipping_type ? ` (${order.shipping_type})` : ""
      }`;
    } else if (stepId === "READY_FOR_PICKUP") {
      return "Sẵn sàng giao";
    } else if (stepId === "WAITING_BAKERY_CONFIRM") {
      return "Chờ xác nhận";
    } else if (stepId === "PROCESSING") {
      return "Đang xử lý";
    } else if (stepId === "COMPLETED") {
      return "Hoàn thành";
    }
    return stepId;
  };

  const steps = [
    {
      id: "WAITING_BAKERY_CONFIRM",
      label: getStepLabel("WAITING_BAKERY_CONFIRM"),
    },
    { id: "PROCESSING", label: getStepLabel("PROCESSING") },
    { id: "READY_FOR_PICKUP", label: getStepLabel("READY_FOR_PICKUP") },
    { id: "SHIPPING", label: getStepLabel("SHIPPING") },
    { id: "COMPLETED", label: getStepLabel("COMPLETED") },
  ];

  if (currentStatus === "CANCELED") {
    return (
      <div className="w-full p-4 bg-red-50 dark:bg-slate-800/70 border border-red-200 dark:border-red-700/50 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-700 dark:text-red-400">
            Đơn hàng đã bị hủy
          </div>
          <p className="text-sm text-red-600 dark:text-red-400/80 mt-1">
            {order.canceled_reason
              ? `Lý do: ${order.canceled_reason}`
              : "Không có lý do"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 bg-gray-50 dark:bg-slate-800/50 rounded-lg border border-gray-200 dark:border-slate-700/30">
      <div className="w-full relative flex items-center justify-between px-4 sm:px-8">
        {/* Background connecting line (gray) */}
        <div className="absolute top-5 left-0 right-0 h-[6px] bg-gray-200 dark:bg-gray-700"></div>

        {/* Completed connecting line (blue) */}
        <div
          className="absolute top-5 left-0 h-[6px] bg-blue-500 dark:bg-blue-400 transition-all duration-500"
          style={{
            width: `calc(${Math.max(
              0,
              Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 100)
            )}% + ${currentStep > 1 ? "10px" : "0px"})`,
            zIndex: 1,
          }}
        ></div>

        {steps.map((step, index) => {
          const stepValue = OrderStatus[step.id as keyof typeof OrderStatus];
          const isCompleted = stepValue < currentStep;
          const isActive = stepValue === currentStep;
          const isPending = stepValue > currentStep;

          // Only show relevant steps based on current status
          const isHidden =
            (step.id === "SHIPPING" && currentStatus === "READY_FOR_PICKUP") ||
            (step.id === "READY_FOR_PICKUP" && currentStatus === "SHIPPING");

          if (isHidden && !isActive && !isCompleted) {
            return null;
          }

          return (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ zIndex: 2 }}
            >
              {/* Step number indicator */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-[3px] flex items-center justify-center text-base font-semibold mb-2 shadow-md",
                  isActive
                    ? "bg-blue-500 border-white text-white dark:bg-blue-400 dark:border-blue-200"
                    : isCompleted
                    ? "bg-blue-500 border-blue-500 text-white dark:bg-blue-400 dark:border-blue-400"
                    : "bg-white border-gray-300 text-gray-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"
                )}
              >
                {index + 1}
              </div>

              {/* Step label */}
              <div className="text-center max-w-[120px]">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive
                      ? "text-gray-700 dark:text-gray-200"
                      : isCompleted
                      ? "text-gray-700 dark:text-gray-200"
                      : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
