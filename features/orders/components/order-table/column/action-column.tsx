"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  ArrowRight,
  X,
  Upload,
  Image as ImageIcon,
  Loader,
} from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useRouter } from "nextjs-toploader/app";
import { IOrder } from "@/features/orders/types/order-type";
import {
  beingToNext,
  cancelOrder,
  beingToNextWithFileBase64,
} from "@/features/orders/actions/order-action";
import { useState, useRef } from "react";
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
import { Input } from "@/components/ui/input";

interface ActionMenuProps {
  row: Row<IOrder>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const orderStatus = row.original.order_status;
  const orderId = row.original.id;

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
      if (orderStatus === "PROCESSING") {
        // Check if a file has been uploaded
        if (uploadedFiles.length > 0) {
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
              orderId,
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
          // No file uploaded, use the regular action
          result = await beingToNext(orderId);
        }
      } else {
        // For non-PROCESSING statuses, use the regular beingToNext action
        result = await beingToNext(orderId);
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

  // Function to get action button text based on status
  const getActionButtonText = (status: string) => {
    const isPickupOrder =
      row.original.shipping_type?.toUpperCase() === "PICKUP";

    if (isPickupOrder) {
      switch (status) {
        case "WAITING_BAKERY_CONFIRM":
          return "Xác nhận đơn hàng";
        case "PROCESSING":
          return "Chuyển sang lấy tại chỗ";
        case "READY_FOR_PICKUP":
        case "SHIPPING":
          return "Hoàn thành đơn hàng";
        default:
          return "Chuyển trạng thái tiếp theo";
      }
    }

    // Default text for non-pickup orders
    switch (status) {
      case "WAITING_BAKERY_CONFIRM":
        return "Xác nhận đơn hàng";
      case "PROCESSING":
        return "Chuyển sang sẵn sàng giao";
      case "READY_FOR_PICKUP":
        return "Chuyển sang vận chuyển";
      case "SHIPPING":
        return "Xác nhận giao hàng thành công";
      case "SHIPPING_COMPLETED":
        return "Đơn hàng đang trong thời gian chờ";
      case "REPORT_PENDING":
        return "Đơn hàng đang được xử lý khiếu nại";
      case "FAULTY":
        return "Đơn hàng bị lỗi";
      default:
        return "Chuyển trạng thái tiếp theo";
    }
  };

  // Render status-specific action button based on status
  const renderStatusActions = () => {
    // Don't show next status button for these statuses
    if (
      orderStatus === "PENDING" ||
      orderStatus === "COMPLETED" ||
      orderStatus === "CANCELED" ||
      orderStatus === "SHIPPING_COMPLETED" ||
      orderStatus === "REPORT_PENDING" ||
      orderStatus === "FAULTY"
    ) {
      return null;
    }

    // For PROCESSING status, we need to have a special dialog for file upload
    if (orderStatus === "PROCESSING") {
      return (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsActionDialogOpen(true);
              }}
              className="cursor-pointer text-green-600 focus:text-green-600"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              <span>{getActionButtonText(orderStatus)}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận thao tác</DialogTitle>
              <DialogDescription>
                {row.original.shipping_type?.toUpperCase() === "PICKUP"
                  ? "Chuyển đơn hàng sang trạng thái lấy tại chỗ? Bạn có thể tải lên hình ảnh bánh hoàn thiện (không bắt buộc)."
                  : "Chuyển đơn hàng sang trạng thái sẵn sàng giao? Bạn có thể tải lên hình ảnh bánh hoàn thiện (không bắt buộc)."}
              </DialogDescription>
            </DialogHeader>

            <div className="my-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="cake-image" className="text-md font-medium">
                  Hình ảnh bánh hoàn thiện (không bắt buộc)
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
                      Nhấp vào &quot;Tải ảnh lên&quot; để chọn hình ảnh
                    </p>
                  </div>
                )}
              </div>
            </div>

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
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 transition-all hover:opacity-90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <Loader className="h-3 w-3 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Chuyển trạng thái"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    // For SHIPPING status, add confirmation dialog
    if (orderStatus === "SHIPPING") {
      return (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogTrigger asChild>
            <DropdownMenuItem
              onClick={(e) => {
                e.preventDefault();
                setIsActionDialogOpen(true);
              }}
              className="cursor-pointer text-emerald-600 focus:text-emerald-600"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              <span>{getActionButtonText(orderStatus)}</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận giao hàng thành công</DialogTitle>
              <DialogDescription>
                {row.original.shipping_type &&
                row.original.shipping_type.toLowerCase().includes("pickup")
                  ? "Xác nhận khách hàng đã nhận bánh tại cửa hàng? Sau khi xác nhận, đơn hàng sẽ vào thời gian chờ 1 giờ trước khi hoàn tất."
                  : "Xác nhận đơn hàng đã được giao thành công? Sau khi xác nhận, đơn hàng sẽ vào thời gian chờ 1 giờ trước khi hoàn tất."}
              </DialogDescription>
            </DialogHeader>

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
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-700 transition-all hover:opacity-90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-1.5">
                    <Loader className="h-3 w-3 animate-spin" />
                    <span>Đang xử lý...</span>
                  </div>
                ) : (
                  "Xác nhận giao hàng"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    // For other statuses, use the simple dropdown item
    return (
      <DropdownMenuItem
        onClick={handleMoveToNextStatus}
        className="cursor-pointer text-green-600 focus:text-green-600"
        disabled={isLoading}
      >
        <ArrowRight className="mr-2 h-4 w-4" />
        <span>{getActionButtonText(orderStatus)}</span>
      </DropdownMenuItem>
    );
  };

  const showCancelOption = () => {
    // Only allow cancellation at WAITING_BAKERY_CONFIRM stage
    // Don't show for PENDING since that's handled by the customer
    return (
      orderStatus !== "PENDING" &&
      orderStatus !== "COMPLETED" &&
      orderStatus !== "CANCELED" &&
      orderStatus !== "SHIPPING_COMPLETED" &&
      orderStatus !== "REPORT_PENDING" &&
      orderStatus !== "FAULTY" &&
      orderStatus === "WAITING_BAKERY_CONFIRM"
    );
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open actions menu"
            variant="ghost"
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem
            onClick={() => router.push(`/dashboard/orders/${orderId}`)}
            className="cursor-pointer"
          >
            <Eye className="mr-2 h-4 w-4" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>

          {/* Status-specific actions */}
          {renderStatusActions()}

          {showCancelOption() && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDialogOpen(true);
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  <span>Hủy đơn hàng</span>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Hủy đơn hàng</DialogTitle>
                  <DialogDescription>
                    Nhập lý do hủy đơn hàng này. Hành động này không thể hoàn
                    tác.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="reason" className="text-md font-medium">
                      Lý do hủy
                    </Label>
                    <Textarea
                      id="reason"
                      placeholder="Nhập lý do hủy đơn hàng..."
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="min-h-[120px] resize-none focus-visible:ring-primary"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    Hủy
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleCancelOrder}
                    disabled={isLoading}
                    className="transition-all hover:opacity-90"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-1.5">
                        <Loader className="h-3 w-3 animate-spin" />
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      "Xác nhận hủy"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const actionColumn: ColumnDef<IOrder> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
