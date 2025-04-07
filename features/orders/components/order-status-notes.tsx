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
          color: "bg-amber-50 border-amber-200 text-amber-700",
        };
      case "WAITING_BAKERY_CONFIRM":
        return {
          title: "Chờ xác nhận từ bakery",
          note: "Khách đã đặt và thanh toán. Đợi bakery xác nhận có thể làm bánh.",
          color: "bg-blue-50 border-blue-200 text-blue-700",
        };
      case "PROCESSING":
        return {
          title: "Đang xử lý",
          note: "Bakery đang xử lý đơn hàng. Khách hàng đã được thông báo.",
          color: "bg-indigo-50 border-indigo-200 text-indigo-700",
        };
      case "READY_FOR_PICKUP":
        return {
          title: "Sẵn sàng giao hàng",
          note: "Bánh đã làm xong, chờ giao cho khách. Shipper sẽ nhận đơn này.",
          color: "bg-purple-50 border-purple-200 text-purple-700",
        };
      case "SHIPPING":
        return {
          title: "Đang vận chuyển",
          note: "Đơn hàng đang được vận chuyển đến khách. Khách đã nhận thông báo.",
          color: "bg-teal-50 border-teal-200 text-teal-700",
        };
      case "COMPLETED":
        return {
          title: "Đơn hàng hoàn thành",
          note: "Khách hàng đã nhận bánh và xác nhận hoàn thành đơn hàng.",
          color: "bg-green-50 border-green-200 text-green-700",
        };
      case "CANCELED":
        return {
          title: "Đơn hàng đã hủy",
          note: order.canceled_reason
            ? `Lý do hủy: ${order.canceled_reason}`
            : "Đơn hàng đã bị hủy.",
          color: "bg-red-50 border-red-200 text-red-700",
        };
      default:
        return {
          title: "Trạng thái không xác định",
          note: "Không có thông tin về trạng thái đơn hàng.",
          color: "bg-gray-50 border-gray-200 text-gray-700",
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

  const { title, note, color } = getStatusNote();
  const additionalNote = additionalInfo();

  return (
    <div className={`p-4 rounded-lg border ${color} relative overflow-hidden`}>
      <div className="absolute -right-5 -top-5 opacity-10">
        <StickyNote size={100} />
      </div>

      <div className="relative z-10">
        <h3 className="font-medium text-lg mb-2 flex items-center">
          <StickyNote className="h-4 w-4 mr-2" />
          {title}
        </h3>
        <p className="text-sm mb-2">{note}</p>

        {additionalNote && (
          <div className="mt-3 pt-3 border-t border-dashed border-current border-opacity-30">
            <p className="text-sm italic">
              <span className="font-medium">Lưu ý:</span> {additionalNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
