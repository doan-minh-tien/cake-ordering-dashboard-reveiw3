import React from 'react'
import { IOrder } from '../../types/order-type';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Clock, CreditCard, Truck, User, Phone, FileText, Tag, CheckCircle } from 'lucide-react';

interface OrderDetailComponentProps {
    order: IOrder | null;
}

const OrderDetailComponent = ({order}: OrderDetailComponentProps) => {
  if (!order) return <div className="flex justify-center items-center h-64">
    <p className="text-muted-foreground">Không tìm thấy thông tin đơn hàng</p>
  </div>;

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'completed': return 'bg-success/20 text-success';
      case 'pending': return 'bg-warning/20 text-warning';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      case 'processing': return 'bg-primary/20 text-primary';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="border-b border-border pb-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Chi tiết đơn hàng</h2>
          <div className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.order_status)}`}>
            {order.order_status}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground flex items-center gap-2">
            <Tag size={16} />
            Mã đơn hàng: <span className="font-semibold text-foreground">{order.order_code}</span>
          </p>
          <p className="text-muted-foreground">
            Đặt ngày: <span className="font-semibold text-foreground">{new Date(order.paid_at).toLocaleDateString('vi-VN')}</span>
          </p>
        </div>
      </div>

      {/* Order Info and Customer Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Customer Information */}
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User size={18} /> Thông tin khách hàng
          </h3>
          <div className="space-y-3">
            <p className="text-muted-foreground flex items-center gap-2">
              <User size={16} className="text-muted-foreground/60" />
              {order.customer.name}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Phone size={16} className="text-muted-foreground/60" />
              {order.phone_number || order.customer.phone}
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin size={16} className="text-muted-foreground/60" />
              {order.shipping_address || order.customer.address}
            </p>
          </div>
        </div>

        {/* Order Information */}
        <div className="bg-muted rounded-lg p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText size={18} /> Thông tin đơn hàng
          </h3>
          <div className="space-y-3">
            <p className="text-muted-foreground flex items-center gap-2">
              <CreditCard size={16} className="text-muted-foreground/60" />
              Phương thức thanh toán: <span className="font-medium text-foreground">{order.payment_type}</span>
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Truck size={16} className="text-muted-foreground/60" />
              Phương thức vận chuyển: <span className="font-medium text-foreground">{order.shipping_type}</span>
            </p>
            <p className="text-muted-foreground flex items-center gap-2">
              <Clock size={16} className="text-muted-foreground/60" />
              Thời gian giao hàng: <span className="font-medium text-foreground">{order.shipping_time} phút</span>
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">Chi tiết sản phẩm</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ghi chú</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Số lượng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Tổng</th>
              </tr>
            </thead>
            <tbody className="bg-background divide-y divide-border">
              {order.order_details.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {item.custom_cake_id ? 'Bánh tùy chỉnh' : 'Bánh có sẵn'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {item.cake_note || '--'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatCurrency(item.sub_total_price / item.quantity)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                    {formatCurrency(item.sub_total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-muted rounded-lg p-4">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tổng kết đơn hàng</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tổng tiền sản phẩm:</span>
            <span className="font-medium text-foreground">{formatCurrency(order.total_product_price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phí vận chuyển:</span>
            <span className="font-medium text-foreground">{formatCurrency(order.shipping_fee)}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Giảm giá:</span>
              <span className="font-medium text-success">-{formatCurrency(order.discount_amount)}</span>
            </div>
          )}
          {order.voucher_code && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã giảm giá:</span>
              <span className="font-medium text-foreground">{order.voucher_code}</span>
            </div>
          )}
          <div className="border-t border-border pt-2 mt-2">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-foreground">Thành tiền:</span>
              <span className="text-primary">{formatCurrency(order.total_customer_paid)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {order.order_note && (
        <div className="mt-6 p-4 bg-warning/10 rounded-lg">
          <h3 className="text-md font-semibold text-foreground mb-2 flex items-center gap-2">
            <FileText size={18} /> Ghi chú đơn hàng
          </h3>
          <p className="text-muted-foreground">{order.order_note}</p>
        </div>
      )}
    </div>
  )
}

export default OrderDetailComponent