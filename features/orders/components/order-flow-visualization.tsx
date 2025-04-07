"use client";

import { IOrder } from "../types/order-type";
import { cn } from "@/lib/utils";

const OrderStatus = {
  PENDING: 0,
  WAITING_BAKERY_CONFIRM: 1,
  PROCESSING: 2,
  READY_FOR_PICKUP: 3,
  SHIPPING: 4,
  COMPLETED: 5,
  CANCELED: -1,
};

const orderStatusLabels = {
  PENDING: "Chờ thanh toán",
  WAITING_BAKERY_CONFIRM: "Chờ xác nhận",
  PROCESSING: "Đang xử lý",
  READY_FOR_PICKUP: "Sẵn sàng giao",
  SHIPPING: "Vận chuyển",
  COMPLETED: "Hoàn thành",
  CANCELED: "Đã hủy",
};

const orderStatusDescriptions = {
  PENDING: "Đơn hàng mới được tạo, chờ khách hàng thanh toán",
  WAITING_BAKERY_CONFIRM: "Chờ bakery xác nhận đơn hàng",
  PROCESSING: "Bakery đang xử lý đơn hàng",
  READY_FOR_PICKUP: "Bakery đã hoàn thành, sẵn sàng giao",
  SHIPPING: "Đang vận chuyển đơn hàng đến khách",
  COMPLETED: "Khách hàng đã xác nhận đơn hàng",
  CANCELED: "Đơn hàng đã bị hủy",
};

interface OrderFlowVisualizationProps {
  order: IOrder;
}

export default function OrderFlowVisualization({
  order,
}: OrderFlowVisualizationProps) {
  const currentStatus = order.order_status;
  const currentStep =
    OrderStatus[currentStatus as keyof typeof OrderStatus] || -2;

  const steps = [
    { id: "PENDING", label: "Chờ thanh toán" },
    { id: "WAITING_BAKERY_CONFIRM", label: "Chờ xác nhận" },
    { id: "PROCESSING", label: "Đang xử lý" },
    { id: "READY_FOR_PICKUP", label: "Sẵn sàng giao" },
    { id: "SHIPPING", label: "Vận chuyển" },
    { id: "COMPLETED", label: "Hoàn thành" },
  ];

  if (currentStatus === "CANCELED") {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold text-red-700">
            Đơn hàng đã bị hủy
          </div>
          <p className="text-sm text-red-600 mt-1">
            {order.canceled_reason
              ? `Lý do: ${order.canceled_reason}`
              : "Không có lý do"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-6 px-4 bg-white border rounded-lg">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 w-full h-1 bg-slate-200">
          <div
            className={cn(
              "absolute top-0 left-0 h-full bg-teal-500 transition-all duration-500",
              currentStep === -2 ? "w-0" : ""
            )}
            style={{
              width: `${Math.max(
                0,
                Math.min(100, (currentStep / (steps.length - 1)) * 100)
              )}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            const isActive =
              OrderStatus[step.id as keyof typeof OrderStatus] <= currentStep;
            const isCurrent =
              OrderStatus[step.id as keyof typeof OrderStatus] === currentStep;

            return (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                    isActive
                      ? "border-teal-500 bg-teal-500 text-white"
                      : "border-slate-300 bg-white text-slate-400",
                    isCurrent ? "ring-4 ring-teal-100" : ""
                  )}
                >
                  {index + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-center">
                  <span
                    className={cn(
                      isActive ? "text-teal-700" : "text-slate-500",
                      isCurrent ? "font-semibold" : ""
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {isCurrent && (
                  <div className="mt-1 text-xs text-teal-600 max-w-[100px] text-center">
                    {
                      orderStatusDescriptions[
                        step.id as keyof typeof orderStatusDescriptions
                      ]
                    }
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status Description */}
      <div className="mt-8 text-center text-sm text-slate-600">
        {currentStatus && (
          <div>
            <span className="font-semibold">Trạng thái hiện tại:</span>{" "}
            <span className="text-teal-700 font-medium">
              {orderStatusLabels[
                currentStatus as keyof typeof orderStatusLabels
              ] || currentStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
