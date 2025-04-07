import React from "react";
import { IOrder } from "../../types/order-type";
import { formatCurrency, cn } from "@/lib/utils";
import {
  MapPin,
  Clock,
  CreditCard,
  Truck,
  User,
  Phone,
  FileText,
  Tag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface OrderDetailComponentProps {
  order: IOrder | null;
}

const OrderDetailComponent = ({ order }: OrderDetailComponentProps) => {
  if (!order)
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-2">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-muted-foreground">
          Không tìm thấy thông tin đơn hàng
        </p>
      </div>
    );

  const getStatusInfo = (status: string) => {
    if (!status)
      return {
        label: "Không xác định",
        bgColor: "bg-gray-100 dark:bg-gray-800",
        textColor: "text-gray-700 dark:text-gray-300",
      };

    switch (status.toUpperCase()) {
      case "PENDING":
        return {
          label: "Chờ xử lý",
          bgColor: "bg-amber-100 dark:bg-amber-900/30",
          textColor: "text-amber-700 dark:text-amber-400",
        };
      case "PROCESSING":
        return {
          label: "Đang xử lý",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-700 dark:text-blue-400",
        };
      case "COMPLETED":
      case "HOÀN THÀNH":
        return {
          label: "Hoàn thành",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          textColor: "text-green-700 dark:text-green-400",
        };
      case "CANCELLED":
      case "CANCELED":
        return {
          label: "Đã hủy",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-700 dark:text-red-400",
        };
      case "DELIVERING":
        return {
          label: "Đang giao",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-700 dark:text-purple-400",
        };
      case "READY_FOR_PICKUP":
        return {
          label: "Sẵn sàng nhận",
          bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
          textColor: "text-indigo-700 dark:text-indigo-400",
        };
      case "WAITING_BAKERY_CONFIRM":
        return {
          label: "Đợi xác nhận",
          bgColor: "bg-slate-100 dark:bg-slate-800/60",
          textColor: "text-slate-700 dark:text-slate-300",
        };
      default:
        // For any other value, just use the value directly
        return {
          label: status,
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-700 dark:text-gray-300",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const statusInfo = getStatusInfo(order.order_status);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <Card className="mb-6 border dark:border-neutral-800">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Chi tiết đơn hàng
              </CardTitle>
              <p className="text-muted-foreground flex items-center gap-2 mt-2">
                <Tag size={16} className="text-muted-foreground" />
                <span>Mã đơn: </span>
                <span className="font-semibold text-foreground">
                  {order.order_code}
                </span>
              </p>
            </div>
            <span
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium",
                statusInfo.bgColor,
                statusInfo.textColor
              )}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">
            Đặt ngày:{" "}
            <span className="font-medium text-foreground">
              {formatDate(order.paid_at)}
            </span>
          </p>
        </CardHeader>
      </Card>

      {/* Order Info and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Information */}
        <Card className="border dark:border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User size={18} className="text-primary" /> Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.phone_number || order.customer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.shipping_address || order.customer.address}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Địa chỉ giao hàng
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card className="border dark:border-neutral-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CreditCard
                  size={18}
                  className="text-muted-foreground mt-0.5"
                />
                <div>
                  <p className="font-medium text-foreground">
                    {order.payment_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phương thức thanh toán
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.shipping_type}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phương thức vận chuyển
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={18} className="text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">
                    {order.shipping_time} phút
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Thời gian giao hàng dự kiến
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details */}
      <Card className="mb-8 border dark:border-neutral-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Chi tiết sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr className="bg-muted">
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ghi chú
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    SL
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Thành tiền
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {order.order_details.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-foreground">
                      <div className="font-medium">
                        {item.custom_cake_id ? "Bánh tùy chỉnh" : "Bánh có sẵn"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {item.cake_note || "--"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground text-right">
                      {formatCurrency(item.sub_total_price / item.quantity)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium text-right">
                      {formatCurrency(item.sub_total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="mb-6 border dark:border-neutral-800">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">
            Tổng kết đơn hàng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tổng tiền sản phẩm:</span>
              <span className="font-medium text-foreground">
                {formatCurrency(order.total_product_price)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Phí vận chuyển:</span>
              <span className="font-medium text-foreground">
                {formatCurrency(order.shipping_fee)}
              </span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Giảm giá:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -{formatCurrency(order.discount_amount)}
                </span>
              </div>
            )}
            {order.voucher_code && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mã giảm giá:</span>
                <span className="font-medium text-foreground">
                  {order.voucher_code}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-foreground font-semibold">Thành tiền:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(order.total_customer_paid)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Section */}
      {order.order_note && (
        <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
          <CardContent className="pt-6">
            <div className="flex gap-3 items-start">
              <FileText
                size={20}
                className="text-amber-600 dark:text-amber-400 mt-0.5"
              />
              <div>
                <h3 className="text-md font-semibold text-foreground mb-2">
                  Ghi chú đơn hàng
                </h3>
                <p className="text-muted-foreground">{order.order_note}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderDetailComponent;
