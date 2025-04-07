import React from "react";
import { getOrder } from "@/features/orders/actions/order-action";
import OrderDetailComponent from "@/features/orders/components/order-detail/order-detail-component";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const OrderDetailPage = async ({ params }: { params: { id: string } }) => {
  //   const bakery = await getBakery(params.id);

  const [orderResponse] = await Promise.all([getOrder(params.id)]);

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm" className="gap-1">
          <Link href="/dashboard/orders">
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </Link>
        </Button>
      </div>

      <OrderDetailComponent order={orderResponse?.data} />
    </div>
  );
};

export default OrderDetailPage;
