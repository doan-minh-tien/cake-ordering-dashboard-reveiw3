"use client";

import { IOrder } from "../types/order-type";
import { cn } from "@/lib/utils";
import { AlertTriangle, Check, Clock } from "lucide-react";

const OrderStatus = {
  WAITING_BAKERY_CONFIRM: 1,
  PROCESSING: 2,
  SHIPPING: 3,
  SHIPPING_COMPLETED: 4,
  COMPLETED: 5,
  PICKUP: 3,
  READY_FOR_PICKUP: 3,
  REPORT_PENDING: -2,
  FAULTY: -3,
  CANCELED: -1,
};

interface OrderFlowVisualizationProps {
  order: IOrder;
}

export default function OrderFlowVisualization({
  order,
}: OrderFlowVisualizationProps) {
  const currentStatus = order.order_status;
  const isPickupOrder = order.shipping_type?.toUpperCase() === "PICKUP";

  // Map various statuses to our simplified flow
  let mappedStatus = currentStatus;

  // For pickup orders, map READY_FOR_PICKUP, SHIPPING, SHIPPING_COMPLETED to PICKUP
  if (isPickupOrder) {
    if (currentStatus === "READY_FOR_PICKUP" || currentStatus === "SHIPPING") {
      mappedStatus = "PICKUP";
    } else if (currentStatus === "SHIPPING_COMPLETED") {
      mappedStatus = "COMPLETED";
    }
  } else {
    // For regular orders, keep original mapping
    if (currentStatus === "READY_FOR_PICKUP") {
      mappedStatus = "PROCESSING";
    }
  }

  const currentStep =
    OrderStatus[mappedStatus as keyof typeof OrderStatus] || 0;

  // Check if order is in report flow
  const isReportFlow =
    currentStatus === "REPORT_PENDING" || currentStatus === "FAULTY";

  // Determine step labels based on shipping_type
  const getStepLabel = (stepId: string) => {
    if (
      stepId === "SHIPPING" ||
      stepId === "PICKUP" ||
      stepId === "READY_FOR_PICKUP"
    ) {
      // Check shipping type to differentiate between pickup and delivery
      if (isPickupOrder) {
        return "Lấy tại chỗ";
      } else {
        return "Giao hàng";
      }
    } else if (stepId === "WAITING_BAKERY_CONFIRM") {
      return "Chờ xác nhận";
    } else if (stepId === "PROCESSING") {
      return "Đang xử lý";
    } else if (stepId === "SHIPPING_COMPLETED") {
      if (isPickupOrder) {
        return "Hoàn thành";
      }
      return "Giao hàng hoàn tất";
    } else if (stepId === "COMPLETED") {
      return "Hoàn thành";
    } else if (stepId === "REPORT_PENDING") {
      return "Đang xử lý khiếu nại";
    } else if (stepId === "FAULTY") {
      return "Đơn hàng lỗi";
    }
    return stepId;
  };

  // Define normal flow steps based on shipping type
  const normalSteps = isPickupOrder
    ? [
        {
          id: "WAITING_BAKERY_CONFIRM",
          label: getStepLabel("WAITING_BAKERY_CONFIRM"),
        },
        { id: "PROCESSING", label: getStepLabel("PROCESSING") },
        { id: "PICKUP", label: getStepLabel("PICKUP") },
        { id: "COMPLETED", label: getStepLabel("COMPLETED") },
      ]
    : [
        {
          id: "WAITING_BAKERY_CONFIRM",
          label: getStepLabel("WAITING_BAKERY_CONFIRM"),
        },
        { id: "PROCESSING", label: getStepLabel("PROCESSING") },
        { id: "SHIPPING", label: getStepLabel("SHIPPING") },
        { id: "SHIPPING_COMPLETED", label: getStepLabel("SHIPPING_COMPLETED") },
        { id: "COMPLETED", label: getStepLabel("COMPLETED") },
      ];

  // Define report flow steps
  const reportSteps = [
    {
      id: "WAITING_BAKERY_CONFIRM",
      label: getStepLabel("WAITING_BAKERY_CONFIRM"),
    },
    { id: "PROCESSING", label: getStepLabel("PROCESSING") },
    { id: "SHIPPING", label: getStepLabel("SHIPPING") },
    { id: "SHIPPING_COMPLETED", label: getStepLabel("SHIPPING_COMPLETED") },
    { id: "REPORT_PENDING", label: getStepLabel("REPORT_PENDING") },
    { id: "FAULTY", label: getStepLabel("FAULTY") },
  ];

  // Choose which steps to display based on flow
  const steps = isReportFlow ? reportSteps : normalSteps;

  if (currentStatus === "CANCELED") {
    return (
      <div className="w-full p-5 bg-red-50/80 dark:bg-red-950/10 border border-red-200 dark:border-red-800/40 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/5">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 text-red-500 dark:text-red-400 mb-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="text-lg font-semibold text-red-700 dark:text-red-400">
            Đơn hàng đã bị hủy
          </div>
          <p className="text-sm text-red-600 dark:text-red-400/80 mt-1 max-w-md mx-auto">
            {order.canceled_reason
              ? `Lý do: ${order.canceled_reason}`
              : "Không có lý do"}
          </p>
        </div>
      </div>
    );
  }

  if (isReportFlow) {
    return (
      <div className="w-full">
        <div className="w-full p-4 mb-4 bg-yellow-50/80 dark:bg-yellow-950/10 border border-yellow-200 dark:border-yellow-800/40 rounded-lg shadow-sm dark:shadow-md dark:shadow-black/5">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
            </div>
            <div>
              <h4 className="font-medium text-yellow-800 dark:text-yellow-300">
                {currentStatus === "REPORT_PENDING"
                  ? "Khiếu nại đang xử lý"
                  : "Đơn hàng bị lỗi"}
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {currentStatus === "REPORT_PENDING"
                  ? "Đơn hàng đang trong quá trình xử lý khiếu nại từ khách hàng"
                  : "Đơn hàng đã được xác nhận lỗi sau khi xử lý khiếu nại"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full py-8 px-4 bg-zinc-50 dark:bg-slate-900/60 rounded-lg border border-gray-200 dark:border-slate-800/60 shadow-sm dark:shadow-md dark:shadow-black/5">
          <div className="w-full relative flex items-center justify-between px-2 sm:px-8 max-w-4xl mx-auto">
            {/* Background connecting line (gray) */}
            <div className="absolute top-6 left-0 right-0 h-[4px] bg-gray-200 dark:bg-gray-700/60 rounded-full"></div>

            {/* Progress line */}
            <div
              className={cn(
                "absolute top-6 left-0 h-[4px] rounded-full transition-all duration-500",
                currentStatus === "REPORT_PENDING"
                  ? "bg-yellow-500 dark:bg-yellow-500/70"
                  : "bg-red-500 dark:bg-red-500/70"
              )}
              style={{
                width: `calc(${Math.max(
                  0,
                  Math.min(
                    100,
                    (steps.indexOf(
                      steps.find((s) => s.id === mappedStatus) || steps[0]
                    ) /
                      (steps.length - 1)) *
                      100
                  )
                )}% + ${
                  steps.indexOf(
                    steps.find((s) => s.id === mappedStatus) || steps[0]
                  ) > 0
                    ? "10px"
                    : "0px"
                })`,
                zIndex: 1,
              }}
            ></div>

            {steps.map((step, index) => {
              const isCompleted =
                index <
                steps.indexOf(
                  steps.find((s) => s.id === mappedStatus) || steps[0]
                );
              const isActive = step.id === mappedStatus;
              const isPending =
                index >
                steps.indexOf(
                  steps.find((s) => s.id === mappedStatus) || steps[0]
                );

              // Special styling for report flow
              const isReportStep =
                step.id === "REPORT_PENDING" || step.id === "FAULTY";

              // Determine circle colors
              let circleClasses = "";
              let iconColor = "";

              if (isActive && isReportStep && step.id === "REPORT_PENDING") {
                circleClasses =
                  "bg-yellow-500 border-yellow-200 text-white dark:bg-yellow-600 dark:border-yellow-400";
                iconColor = "text-white";
              } else if (isActive && isReportStep && step.id === "FAULTY") {
                circleClasses =
                  "bg-red-500 border-red-200 text-white dark:bg-red-600 dark:border-red-400";
                iconColor = "text-white";
              } else if (isActive) {
                circleClasses =
                  "bg-primary border-primary text-white dark:bg-primary dark:border-primary";
                iconColor = "text-white";
              } else if (isCompleted) {
                circleClasses =
                  "bg-primary border-primary text-white dark:bg-primary dark:border-primary";
                iconColor = "text-white";
              } else {
                circleClasses =
                  "bg-white border-gray-300 text-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400";
                iconColor = "text-gray-400 dark:text-slate-400";
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
                      "w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-semibold mb-2 shadow-sm transition-all",
                      circleClasses
                    )}
                  >
                    {isCompleted ? (
                      <Check className={`h-5 w-5 ${iconColor}`} />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step label */}
                  <div className="text-center max-w-[120px]">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isActive
                          ? "text-gray-800 dark:text-gray-100"
                          : isCompleted
                          ? "text-gray-800 dark:text-gray-100"
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
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 bg-zinc-50 dark:bg-slate-900/60 rounded-lg border border-gray-200 dark:border-slate-800/60 shadow-sm dark:shadow-md dark:shadow-black/5">
      <div className="w-full relative flex items-center justify-between px-2 sm:px-8 max-w-4xl mx-auto">
        {/* Background connecting line (gray) */}
        <div className="absolute top-6 left-0 right-0 h-[4px] bg-gray-200 dark:bg-gray-700/60 rounded-full"></div>

        {/* Completed connecting line (blue) */}
        <div
          className="absolute top-6 left-0 h-[4px] bg-primary dark:bg-primary/70 rounded-full transition-all duration-500"
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

          // Special icon for shipping completed (waiting period)
          const isWaitingPeriod = step.id === "SHIPPING_COMPLETED" && isActive;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center"
              style={{ zIndex: 2 }}
            >
              {/* Step number indicator */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center text-base font-semibold mb-2 shadow-sm transition-all",
                  isActive
                    ? "bg-primary border-primary text-white dark:bg-primary dark:border-primary"
                    : isCompleted
                    ? "bg-primary border-primary text-white dark:bg-primary dark:border-primary"
                    : "bg-white border-gray-300 text-gray-400 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-white" />
                ) : isWaitingPeriod ? (
                  <Clock className="h-5 w-5 text-white" />
                ) : (
                  index + 1
                )}
              </div>

              {/* Step label */}
              <div className="text-center max-w-[120px]">
                <span
                  className={cn(
                    "text-sm font-medium",
                    isActive
                      ? "text-gray-800 dark:text-gray-100"
                      : isCompleted
                      ? "text-gray-800 dark:text-gray-100"
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
