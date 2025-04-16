"use client";

import React, { useState, useRef } from "react";
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
  ArrowRight,
  Upload,
  Image as ImageIcon,
  Loader,
  ArrowLeft,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderFlowVisualization from "../order-flow-visualization";
import OrderStatusNotes from "../order-status-notes";
import { Button } from "@/components/ui/button";
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
import { useRouter } from "next/navigation";
import {
  beingToNext,
  beingToNextWithFiles,
  beingToNextWithFileBase64,
} from "../../actions/order-action";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";

interface OrderDetailComponentProps {
  order: IOrder | null;
}

const OrderDetailComponent = ({ order }: OrderDetailComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          label: "Chờ thanh toán",
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
      case "SHIPPING":
        return {
          label: "Vận chuyển",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-700 dark:text-purple-400",
        };
      case "READY_FOR_PICKUP":
        return {
          label: "Sẵn sàng giao",
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

  // Function to get action button text and color based on status
  const getActionButtonConfig = (status: string) => {
    switch (status) {
      case "WAITING_BAKERY_CONFIRM":
        return {
          text: "Xác nhận đơn hàng",
          color: "bg-blue-600 hover:bg-blue-700",
          description: "Bạn có chắc chắn muốn xác nhận đơn hàng này không?",
          confirmText: "Xác nhận",
          requiresFile: false,
        };
      case "PROCESSING":
        return {
          text: "Chuyển sang sẵn sàng giao",
          color: "bg-green-600 hover:bg-green-700",
          description:
            "Chuyển đơn hàng sang trạng thái sẵn sàng giao? Cần tải lên hình ảnh bánh hoàn thiện.",
          confirmText: "Chuyển trạng thái",
          requiresFile: true,
        };
      case "READY_FOR_PICKUP":
        return {
          text: "Chuyển sang vận chuyển",
          color: "bg-indigo-600 hover:bg-indigo-700",
          description: "Chuyển đơn hàng sang trạng thái vận chuyển?",
          confirmText: "Xác nhận vận chuyển",
          requiresFile: false,
        };
      case "SHIPPING":
        return {
          text: "Đơn hàng đang được vận chuyển",
          color: "bg-teal-600 hover:bg-teal-700",
          description: "Đơn hàng đang được vận chuyển đến khách hàng.",
          confirmText: "Đã hiểu",
          requiresFile: false,
          disableAction: true,
        };
      default:
        return {
          text: "Chuyển trạng thái tiếp theo",
          color: "bg-green-600 hover:bg-green-700",
          description:
            "Bạn có chắc chắn muốn chuyển đơn hàng sang trạng thái tiếp theo?",
          confirmText: "Tiếp tục",
          requiresFile: false,
        };
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Clear any previous files
      setUploadedFiles([file]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      console.log(
        "File selected:",
        file.name,
        "Size:",
        file.size,
        "Type:",
        file.type
      );
    } else {
      // Clear files if none selected
      setUploadedFiles([]);
      setFilePreview(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(",")[1]); // Remove the data URL prefix
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleMoveToNextStatus = async () => {
    try {
      setIsLoading(true);

      let result;
      // If processing status and files are required, use beingToNextWithFileBase64
      if (order.order_status === "PROCESSING") {
        if (uploadedFiles.length === 0) {
          toast.error("Vui lòng tải lên hình ảnh bánh hoàn thiện");
          setIsLoading(false);
          return;
        }

        // Validate file before sending to server
        const file = uploadedFiles[0];
        if (!file || file.size === 0) {
          toast.error("Tệp không hợp lệ hoặc rỗng");
          setIsLoading(false);
          return;
        }

        // Check file size (10MB limit is common)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          toast.error(
            `Tệp quá lớn. Kích thước tối đa là ${maxSize / (1024 * 1024)}MB`
          );
          setIsLoading(false);
          return;
        }

        // Console log file properties
        console.log("File properties:", {
          name: file.name,
          type: file.type,
          size: file.size,
          lastModified: file.lastModified,
        });

        try {
          toast.info("Đang tải lên hình ảnh...");

          // Convert file to base64
          const fileBase64 = await convertFileToBase64(file);

          // Use the new server action with base64 data instead of File object
          result = await beingToNextWithFileBase64(
            order.id,
            fileBase64,
            file.name,
            file.type
          );

          console.log("Result from file upload:", result);

          if (!result.success) {
            console.error("Server action failed:", result.error);
            toast.error("Lỗi tải lên: " + (result.error || "Không xác định"));
            setIsLoading(false);
            return;
          }
        } catch (uploadError: any) {
          console.error("Error in file upload:", uploadError);
          toast.error(
            "Lỗi tải lên: " + (uploadError?.message || "Không xác định")
          );
          setIsLoading(false);
          return;
        }
      } else {
        // For non-PROCESSING statuses, use the regular beingToNext action
        result = await beingToNext(order.id);
      }

      if (result.success) {
        toast.success("Đã chuyển trạng thái đơn hàng");
        setIsActionDialogOpen(false);
        setUploadedFiles([]);
        setFilePreview(null);
        router.refresh();
      } else {
        console.error("Error result:", result);
        toast.error(result.error || "Không thể chuyển trạng thái đơn hàng");
      }
    } catch (error: any) {
      console.error("Error moving to next status:", error);
      const errorMessage = error?.message || "Đã xảy ra lỗi";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showActionButton =
    order.order_status !== "PENDING" &&
    order.order_status !== "COMPLETED" &&
    order.order_status !== "CANCELED" &&
    order.order_status !== "SHIPPING";

  const statusInfo = getStatusInfo(order.order_status);
  const actionConfig = getActionButtonConfig(order.order_status);

  return (
    <div className="space-y-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="default"
        className="mb-5 flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 font-medium"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        <span className="text-base">Quay lại</span>
      </Button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">
          Chi tiết đơn hàng
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <Tag size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-semibold text-blue-700">{order.order_code}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo đơn</p>
            <p className="font-semibold text-blue-700">
              {order.created_at
                ? formatDate(order.created_at)
                : "Không xác định"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-100 text-blue-600">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái đơn hàng</p>
            <p className="font-semibold text-blue-700">
              {order.order_status
                ? getStatusInfo(order.order_status).label
                : "Không xác định"}
            </p>
          </div>
        </div>
      </div>

      <OrderFlowVisualization order={order} />

      {/* Order Status Notes */}
      <OrderStatusNotes order={order} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-green-400 to-teal-500"></div>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <User size={18} className="text-primary" /> Thông tin khách hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <User size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">Khách hàng</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <Phone size={18} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {order.phone_number || order.customer.phone}
                  </p>
                  <p className="text-sm text-muted-foreground">Số điện thoại</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <MapPin size={18} className="text-primary" />
                </div>
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
        <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Thông tin đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <CreditCard size={18} className="text-primary" />
                </div>
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
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <Truck size={18} className="text-primary" />
                </div>
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
                <div className="p-2 rounded-full bg-primary/10 dark:bg-primary/5">
                  <Clock size={18} className="text-primary" />
                </div>
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
      <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500"></div>
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tag size={18} className="text-primary" /> Chi tiết sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.order_details?.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row justify-between gap-3 py-4 border-b dark:border-gray-800 border-dashed last:border-b-0"
              >
                <div>
                  <p className="font-medium">{item.cake_note || "Bánh"}</p>
                  <p className="text-sm text-muted-foreground">
                    Số lượng: {item.quantity}
                  </p>
                </div>
                <div className="font-semibold text-primary">
                  {formatCurrency(item.sub_total_price)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-pink-400 to-rose-500"></div>
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <CreditCard size={18} className="text-primary" /> Tổng thanh toán
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 p-3 bg-muted/30 dark:bg-gray-800/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tổng tiền sản phẩm:</span>
              <span>{formatCurrency(order.total_product_price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phí vận chuyển:</span>
              <span>{formatCurrency(order.shipping_fee)}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Giảm giá{order.voucher_code ? ` (${order.voucher_code})` : ""}
                  :
                </span>
                <span className="text-destructive">
                  -{formatCurrency(order.discount_amount)}
                </span>
              </div>
            )}
            <Separator className="my-3 bg-border dark:bg-gray-700" />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng cộng:</span>
              <span className="text-primary">
                {formatCurrency(order.total_customer_paid)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      {order.order_note && (
        <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500"></div>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-primary" /> Ghi chú đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-muted/30 dark:bg-gray-800/30 rounded-lg">
              <p className="text-muted-foreground">{order.order_note}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      {showActionButton && (
        <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-orange-500"></div>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ArrowRight size={18} className="text-primary" /> Thao tác đơn
              hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Dialog
                open={isActionDialogOpen}
                onOpenChange={setIsActionDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className={`flex items-center ${actionConfig.color} transition-all hover:shadow-md`}
                    disabled={isLoading || actionConfig.disableAction}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    {actionConfig.text}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Xác nhận thao tác</DialogTitle>
                    <DialogDescription>
                      {actionConfig.description}
                    </DialogDescription>
                  </DialogHeader>

                  {actionConfig.requiresFile && (
                    <div className="my-4 space-y-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor="cake-image"
                          className="text-md font-medium"
                        >
                          Hình ảnh bánh hoàn thiện
                        </Label>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 hover:border-primary/70 transition-colors"
                          >
                            <Upload className="h-4 w-4" />
                            Tải ảnh lên
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {uploadedFiles.length > 0
                              ? uploadedFiles[0].name
                              : "Chưa chọn tệp nào"}
                          </span>
                        </div>

                        <Input
                          ref={fileInputRef}
                          id="cake-image"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileUpload}
                        />

                        {filePreview && (
                          <div className="mt-2 relative w-full h-48 border dark:border-gray-700 rounded-md overflow-hidden shadow-sm">
                            <div
                              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
                              style={{
                                backgroundImage: `url(${filePreview})`,
                              }}
                            ></div>
                          </div>
                        )}

                        {!filePreview && (
                          <div className="mt-2 flex flex-col justify-center items-center border border-dashed dark:border-gray-700 rounded-md h-48 bg-muted/30 dark:bg-gray-800/30 transition-colors hover:border-primary/50">
                            <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground mt-2">
                              Hình ảnh bánh hoàn thiện
                            </p>
                            <p className="text-xs text-muted-foreground/70 mt-1">
                              Nhấp vào "Tải ảnh lên" để chọn hình ảnh
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <DialogFooter className="mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsActionDialogOpen(false)}
                      disabled={isLoading}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleMoveToNextStatus}
                      disabled={
                        isLoading ||
                        (actionConfig.requiresFile &&
                          uploadedFiles.length === 0)
                      }
                      className={`${actionConfig.color} transition-all hover:opacity-90`}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-1.5">
                          <Loader className="h-3 w-3 animate-spin" />
                          <span>Đang xử lý...</span>
                        </div>
                      ) : (
                        actionConfig.confirmText
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OrderDetailComponent;
