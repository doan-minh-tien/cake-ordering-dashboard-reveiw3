"use client";

import { IOrder } from "../types/order-type";
import { StickyNote } from "lucide-react";

interface OrderStatusNotesProps {
  order: IOrder;
}

export default function OrderStatusNotes({ order }: OrderStatusNotesProps) {
  const status = order.order_status;

  const getStatusNote = () => {
    switch (status) {
      case "PENDING":
        return {
          title: "Đơn hàng chờ thanh toán",
          note: "Đơn hàng mới được tạo, chờ khách hàng thanh toán.",
          bgColor: "bg-amber-50 dark:bg-amber-900/20",
          borderColor: "border-amber-200 dark:border-amber-800/30",
          titleColor: "text-amber-900 dark:text-amber-300",
          noteColor: "text-amber-700 dark:text-amber-400",
          accentColor: "text-amber-600 dark:text-amber-300",
        };
      case "WAITING_BAKERY_CONFIRM":
        return {
          title: "Chờ xác nhận từ bakery",
          note: "Khách đã đặt và thanh toán. Đợi bakery xác nhận có thể làm bánh.",
          bgColor: "bg-violet-50 dark:bg-violet-900/20",
          borderColor: "border-violet-200 dark:border-violet-800/30",
          titleColor: "text-violet-900 dark:text-violet-300",
          noteColor: "text-violet-700 dark:text-violet-400",
          accentColor: "text-violet-600 dark:text-violet-300",
        };
      case "PROCESSING":
        return {
          title: "Đang xử lý",
          note: "Bakery đang xử lý đơn hàng. Khách hàng đã được thông báo.",
          bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
          borderColor: "border-indigo-200 dark:border-indigo-800/30",
          titleColor: "text-indigo-900 dark:text-indigo-300",
          noteColor: "text-indigo-700 dark:text-indigo-400",
          accentColor: "text-indigo-600 dark:text-indigo-300",
        };
      case "READY_FOR_PICKUP":
        return {
          title: "Sẵn sàng giao hàng",
          note: "Bánh đã làm xong, chờ giao cho khách. Shipper sẽ nhận đơn này.",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          borderColor: "border-purple-200 dark:border-purple-800/30",
          titleColor: "text-purple-900 dark:text-purple-300",
          noteColor: "text-purple-700 dark:text-purple-400",
          accentColor: "text-purple-600 dark:text-purple-300",
        };
      case "SHIPPING":
        return {
          title: "Đang vận chuyển",
          note: "Đơn hàng đang được vận chuyển đến khách. Khách đã nhận thông báo.",
          bgColor: "bg-teal-50 dark:bg-teal-900/20",
          borderColor: "border-teal-200 dark:border-teal-800/30",
          titleColor: "text-teal-900 dark:text-teal-300",
          noteColor: "text-teal-700 dark:text-teal-400",
          accentColor: "text-teal-600 dark:text-teal-300",
        };
      case "COMPLETED":
        return {
          title: "Đơn hàng hoàn thành",
          note: "Khách hàng đã nhận bánh và xác nhận hoàn thành đơn hàng.",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800/30",
          titleColor: "text-green-900 dark:text-green-300",
          noteColor: "text-green-700 dark:text-green-400",
          accentColor: "text-green-600 dark:text-green-300",
        };
      case "CANCELED":
        return {
          title: "Đơn hàng đã hủy",
          note: order.canceled_reason
            ? `Lý do hủy: ${order.canceled_reason}`
            : "Đơn hàng đã bị hủy.",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800/30",
          titleColor: "text-red-900 dark:text-red-300",
          noteColor: "text-red-700 dark:text-red-400",
          accentColor: "text-red-600 dark:text-red-300",
        };
      default:
        return {
          title: "Trạng thái không xác định",
          note: "Không có thông tin về trạng thái đơn hàng.",
          bgColor: "bg-gray-50 dark:bg-gray-800/40",
          borderColor: "border-gray-200 dark:border-gray-700/50",
          titleColor: "text-gray-900 dark:text-gray-300",
          noteColor: "text-gray-700 dark:text-gray-400",
          accentColor: "text-gray-600 dark:text-gray-300",
        };
    }
  };

  const additionalInfo = () => {
    // Add any status-specific information
    switch (status) {
      case "PENDING":
        return "Khách hàng cần thanh toán đơn hàng để tiếp tục quy trình.";
      case "WAITING_BAKERY_CONFIRM":
        return "Bakery nên xác nhận đơn hàng càng sớm càng tốt để giữ trải nghiệm khách hàng tốt nhất.";
      case "PROCESSING":
        return "Nhớ cập nhật khi đã làm xong bánh để chuyển sang trạng thái sẵn sàng giao.";
      case "READY_FOR_PICKUP":
        return "Đảm bảo bánh được đóng gói cẩn thận và an toàn cho việc vận chuyển.";
      case "SHIPPING":
        return "Theo dõi quá trình giao hàng và liên hệ khách nếu gặp vấn đề.";
      default:
        return null;
    }
  };

  const {
    title,
    note,
    bgColor,
    borderColor,
    titleColor,
    noteColor,
    accentColor,
  } = getStatusNote();
  const additionalNote = additionalInfo();

  return (
    <div
      className={`p-4 rounded-lg border ${bgColor} ${borderColor} relative overflow-hidden shadow-sm dark:shadow-md dark:shadow-black/10`}
    >
      <div className="relative z-10">
        <h3
          className={`font-semibold text-lg mb-2 flex items-center ${titleColor}`}
        >
          <StickyNote className={`h-4 w-4 mr-2 ${accentColor}`} />
          {title}
        </h3>
        <p className={`text-sm mb-2 ${noteColor}`}>{note}</p>

        {additionalNote && (
          <div className="mt-3 pt-3 border-t border-dashed border-current border-opacity-30 dark:border-opacity-20">
            <p className={`text-sm italic ${noteColor}`}>
              <span className={`font-semibold ${accentColor}`}>Lưu ý:</span>{" "}
              {additionalNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
