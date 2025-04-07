"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { IOrder } from "../types/order-type";
import { beingToNext, cancelOrder } from "../actions/order-action";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowRight, X, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface OrderStatusActionsProps {
  order: IOrder;
}

export default function OrderStatusActions({ order }: OrderStatusActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const status = order.order_status;
  const orderId = order.id;

  const handleMoveToNextStatus = async () => {
    try {
      setIsLoading(true);
      const result = await beingToNext(orderId);
      if (result.success) {
        toast.success("Đã chuyển trạng thái đơn hàng");
        router.refresh();
      } else {
        toast.error("Không thể chuyển trạng thái đơn hàng");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn");
      return;
    }

    try {
      setIsLoading(true);
      const result = await cancelOrder(orderId, cancelReason);
      if (result.success) {
        toast.success("Đã hủy đơn hàng");
        setIsDialogOpen(false);
        setCancelReason("");
        router.refresh();
      } else {
        toast.error("Không thể hủy đơn hàng");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get action button text and color based on status
  const getActionButtonConfig = (status: string) => {
    switch (status) {
      case "WAITING_BAKERY_CONFIRM":
        return {
          text: "Xác nhận đơn hàng",
          color: "bg-blue-600 hover:bg-blue-700",
        };
      case "PROCESSING":
        return {
          text: "Chuyển sang sẵn sàng giao",
          color: "bg-green-600 hover:bg-green-700",
        };
      case "READY_FOR_PICKUP":
        return {
          text: "Chuyển sang vận chuyển",
          color: "bg-indigo-600 hover:bg-indigo-700",
        };
      case "SHIPPING":
        return {
          text: "Xác nhận hoàn thành",
          color: "bg-teal-600 hover:bg-teal-700",
        };
      default:
        return {
          text: "Chuyển trạng thái tiếp theo",
          color: "bg-green-600 hover:bg-green-700",
        };
    }
  };

  // For PENDING state, show an information alert
  if (status === "PENDING") {
    return (
      <Alert
        variant="default"
        className="bg-amber-50 border-amber-200 text-amber-800"
      >
        <Clock className="h-4 w-4" />
        <AlertTitle>Đơn hàng đang chờ thanh toán</AlertTitle>
        <AlertDescription>
          Đơn hàng này đang ở trạng thái chờ thanh toán từ khách hàng. Sau khi
          khách hàng thanh toán, trạng thái sẽ chuyển sang "Chờ xác nhận".
        </AlertDescription>
      </Alert>
    );
  }

  // If completed or canceled, no actions needed
  if (status === "COMPLETED" || status === "CANCELED") {
    return (
      <Alert
        variant={status === "COMPLETED" ? "default" : "destructive"}
        className={
          status === "COMPLETED"
            ? "bg-green-50 border-green-200 text-green-800"
            : undefined
        }
      >
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>
          {status === "COMPLETED"
            ? "Đơn hàng đã hoàn thành"
            : "Đơn hàng đã bị hủy"}
        </AlertTitle>
        <AlertDescription>
          {status === "COMPLETED"
            ? "Đơn hàng này đã được hoàn thành thành công. Không cần thực hiện thêm hành động nào."
            : `Đơn hàng này đã bị hủy. ${
                order.canceled_reason ? `Lý do: ${order.canceled_reason}` : ""
              }`}
        </AlertDescription>
      </Alert>
    );
  }

  const { text, color } = getActionButtonConfig(status);
  const showCancelOption =
    status !== "PENDING" && status !== "COMPLETED" && status !== "CANCELED";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Thao tác đơn hàng</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          className={`flex items-center ${color}`}
          onClick={handleMoveToNextStatus}
          disabled={isLoading}
        >
          <ArrowRight className="mr-2 h-4 w-4" />
          {text}
        </Button>

        {showCancelOption && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                className="flex items-center"
                disabled={isLoading}
              >
                <X className="mr-2 h-4 w-4" />
                Hủy đơn hàng
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Hủy đơn hàng</DialogTitle>
                <DialogDescription>
                  Nhập lý do hủy đơn hàng này. Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="reason">Lý do hủy</Label>
                  <Textarea
                    id="reason"
                    placeholder="Nhập lý do hủy đơn hàng..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Hủy
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleCancelOrder}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Xác nhận hủy"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
