"use client";

import React, { useState, useRef, useEffect } from "react";
import { IOrder } from "../../types/order-type";
import { formatCurrency, cn } from "@/lib/utils";
import { ICake } from "@/features/cakes/types/cake";
import {
  ICustomCake,
  IPartSelection,
} from "@/features/cakes/types/custome-cake";
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
  Cake,
  Palette,
  CakeSlice,
  Gift,
  BringToFront,
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
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import {
  beingToNext,
  beingToNextWithFileBase64,
} from "../../actions/order-action";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { getCake } from "@/features/cakes/actions/cake-action";
import { getCustomCakeById } from "@/features/cakes/actions/custome-cake-action";
import { getCakeImageById } from "@/features/cakes/actions/cake-image-action";
import { getPartOptionById } from "@/features/ingredients/actions/cake-part-action";
import { getExtraOptionById } from "@/features/ingredients/actions/cake-extra-option-action";
import { getDecorationOptionById } from "@/features/ingredients/actions/cake-decoration-action";
import { getMessageOptionById } from "@/features/ingredients/actions/cake-message-option-action";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderDetailComponentProps {
  order: IOrder | null;
}

interface PartOptionDetail {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  is_default: boolean;
  type: string;
}

interface ExtraOptionDetail {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  is_default: boolean;
  type: string;
}

interface DecorationOptionDetail {
  id: string;
  name: string;
  price: number;
  color: string;
  description: string;
  is_default: boolean;
  type: string;
}

type CakeDetail = {
  id: string;
  name?: string;
  description?: string;
  category?: {
    id: string;
    name: string;
  };
  ingredients?: Array<{
    id: string;
    name: string;
  }>;
  total_price?: number;
  custom_cake_name?: string | null;
  custom_cake_description?: string | null;
  recipe?: string | null;
  part_selections?: any[];
  extra_selections?: any[];
  decoration_selections?: any[];
  message_selection?: any;
  partOptionDetails?: Record<string, PartOptionDetail>;
  extraOptionDetails?: Record<string, ExtraOptionDetail>;
  decorationOptionDetails?: Record<string, DecorationOptionDetail>;
};

const OrderDetailComponent = ({ order }: OrderDetailComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [orderItemDetails, setOrderItemDetails] = useState<{
    [key: string]: CakeDetail | null;
  }>({});
  const [supportImages, setSupportImages] = useState<{ [key: string]: string }>(
    {}
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!order) return;

      setIsLoadingDetails(true);

      // Fetch details for each order item
      const detailsPromises = order.order_details.map(async (detail) => {
        if (detail.available_cake_id) {
          const result = await getCake(detail.available_cake_id);
          if (result.data) {
            const cakeDetail: CakeDetail = {
              id: result.data.id,
              name: result.data.available_cake_name,
              description: result.data.available_cake_description,
              category: {
                id: result.data.available_cake_type,
                name: result.data.available_cake_type,
              },
            };
            return { [detail.id]: cakeDetail };
          }
        } else if (detail.custom_cake_id) {
          const result = await getCustomCakeById(detail.custom_cake_id);
          if (result?.data) {
            // Khởi tạo các maps cho option details
            const partOptionDetails: Record<string, PartOptionDetail> = {};
            const extraOptionDetails: Record<string, ExtraOptionDetail> = {};
            const decorationOptionDetails: Record<
              string,
              DecorationOptionDetail
            > = {};

            // Lấy thông tin chi tiết cho các part options
            if (
              result.data.part_selections &&
              result.data.part_selections.length > 0
            ) {
              const partOptionIds = [
                ...new Set(
                  result.data.part_selections.map((p) => p.part_option_id)
                ),
              ];
              await Promise.all(
                partOptionIds.map(async (id) => {
                  const partResult = await getPartOptionById(id);
                  if (partResult.data) {
                    partOptionDetails[id] = partResult.data;
                  }
                })
              );
            }

            // Lấy thông tin chi tiết cho các extra options
            if (
              result.data.extra_selections &&
              result.data.extra_selections.length > 0
            ) {
              const extraOptionIds = [
                ...new Set(
                  result.data.extra_selections.map((e) => e.extra_option_id)
                ),
              ];
              await Promise.all(
                extraOptionIds.map(async (id) => {
                  const extraResult = await getExtraOptionById(id);
                  if (extraResult.data) {
                    extraOptionDetails[id] = extraResult.data;
                  }
                })
              );
            }

            // Lấy thông tin chi tiết cho các decoration options
            if (
              result.data.decoration_selections &&
              result.data.decoration_selections.length > 0
            ) {
              const decorationOptionIds = [
                ...new Set(
                  result.data.decoration_selections.map(
                    (d) => d.decoration_option_id
                  )
                ),
              ];
              await Promise.all(
                decorationOptionIds.map(async (id) => {
                  const decorationResult = await getDecorationOptionById(id);
                  if (decorationResult.data) {
                    decorationOptionDetails[id] = decorationResult.data;
                  }
                })
              );
            }

            const customCakeDetail: CakeDetail = {
              id: result.data.id,
              custom_cake_name: result.data.custom_cake_name,
              custom_cake_description: result.data.custom_cake_description,
              total_price: result.data.total_price,
              recipe: result.data.recipe,
              part_selections: result.data.part_selections || [],
              extra_selections: result.data.extra_selections || [],
              decoration_selections: result.data.decoration_selections || [],
              message_selection: result.data.message_selection,
              partOptionDetails,
              extraOptionDetails,
              decorationOptionDetails,
            };
            return { [detail.id]: customCakeDetail };
          }
        }
        return { [detail.id]: null };
      });

      const details = await Promise.all(detailsPromises);
      const detailsMap = details.reduce<{ [key: string]: CakeDetail | null }>(
        (acc, curr) => ({ ...acc, ...curr }),
        {}
      );
      setOrderItemDetails(detailsMap);

      // Fetch support images if any
      if (order.order_supports && order.order_supports.length > 0) {
        const imagePromises = order.order_supports
          .filter((support) => support.file_id)
          .map(async (support) => {
            const result = await getCakeImageById(support.file_id);
            return result.success
              ? { [support.id]: result.data.file_url }
              : null;
          });

        const images = await Promise.all(imagePromises);
        const imagesMap = images
          .filter((img): img is { [key: string]: string } => img !== null)
          .reduce((acc, curr) => ({ ...acc, ...curr }), {});
        setSupportImages(imagesMap);
      }

      setIsLoadingDetails(false);
    };

    fetchOrderDetails();
  }, [order]);

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

    // Check if this is a pickup order
    const isPickupOrder = order?.shipping_type?.toUpperCase() === "PICKUP";

    switch (status.toUpperCase()) {
      case "PENDING":
      case "WAITING_BAKERY_CONFIRM":
        return {
          label: "Chờ xác nhận",
          bgColor: "bg-amber-100 dark:bg-amber-900/30",
          textColor: "text-amber-700 dark:text-amber-400",
        };
      case "PROCESSING":
        return {
          label: "Đang xử lý",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
          textColor: "text-blue-700 dark:text-blue-400",
        };
      case "PICKUP":
      case "READY_FOR_PICKUP":
      case isPickupOrder && "SHIPPING" ? "SHIPPING" : "":
        return {
          label: "Lấy tại chỗ",
          bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
          textColor: "text-indigo-700 dark:text-indigo-400",
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
        if (isPickupOrder) {
          return {
            label: "Lấy tại chỗ",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
            textColor: "text-indigo-700 dark:text-indigo-400",
          };
        }
        return {
          label: "Giao hàng",
          bgColor: "bg-purple-100 dark:bg-purple-900/30",
          textColor: "text-purple-700 dark:text-purple-400",
        };
      case "SHIPPING_COMPLETED":
        // Skip this status for pickup orders - will go directly to COMPLETED
        if (isPickupOrder) {
          return {
            label: "Hoàn thành",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            textColor: "text-green-700 dark:text-green-400",
          };
        }
        return {
          label: "Giao hàng hoàn tất",
          bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
          textColor: "text-emerald-700 dark:text-emerald-400",
        };
      case "REPORT_PENDING":
        return {
          label: "Khiếu nại đang xử lý",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          textColor: "text-yellow-700 dark:text-yellow-400",
        };
      case "FAULTY":
        return {
          label: "Đơn hàng lỗi",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          textColor: "text-red-700 dark:text-red-400",
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
    const isPickupOrder = order.shipping_type?.toUpperCase() === "PICKUP";

    // Special handling for pickup orders
    if (isPickupOrder) {
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
            text: "Bánh đã sẵn sàng để lấy",
            color: "bg-indigo-600 hover:bg-indigo-700",
            description:
              "Chuyển đơn hàng sang trạng thái lấy tại chỗ? Bạn có thể tải lên hình ảnh bánh hoàn thiện (không bắt buộc).",
            confirmText: "Xác nhận sẵn sàng",
            requiresFile: true,
            fileOptional: true,
          };
        case "PICKUP":
        case "READY_FOR_PICKUP":
        case "SHIPPING": // Also handle SHIPPING status for pickup orders
          return {
            text: "Hoàn thành đơn hàng",
            color: "bg-green-600 hover:bg-green-700",
            description:
              "Xác nhận khách hàng đã nhận bánh và hoàn thành đơn hàng?",
            confirmText: "Xác nhận hoàn thành",
            requiresFile: false,
          };
        case "SHIPPING_COMPLETED":
          return {
            text: "Hoàn thành đơn hàng",
            color: "bg-green-600 hover:bg-green-700",
            description: "Xác nhận đơn hàng đã hoàn thành?",
            confirmText: "Xác nhận hoàn thành",
            requiresFile: false,
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
    }

    // Original handling for non-pickup orders
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
          text: "Chuyển sang giao hàng",
          color: "bg-green-600 hover:bg-green-700",
          description:
            "Chuyển đơn hàng sang trạng thái giao hàng? Bạn có thể tải lên hình ảnh bánh hoàn thiện (không bắt buộc).",
          confirmText: "Chuyển trạng thái",
          requiresFile: true,
          fileOptional: true,
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
          text: "Xác nhận giao hàng thành công",
          color: "bg-emerald-600 hover:bg-emerald-700",
          description:
            "Xác nhận đơn hàng đã được giao thành công? Sau khi xác nhận, đơn hàng sẽ vào thời gian chờ 1 giờ trước khi hoàn tất.",
          confirmText: "Xác nhận giao hàng",
          requiresFile: false,
        };
      case "SHIPPING_COMPLETED":
        return {
          text: "Đơn hàng đang trong thời gian chờ",
          color: "bg-amber-600 hover:bg-amber-700",
          description:
            "Đơn hàng đang trong thời gian chờ 1 giờ để khách hàng kiểm tra. Nếu không có vấn đề gì, đơn hàng sẽ tự động chuyển sang trạng thái hoàn thành.",
          confirmText: "Đã hiểu",
          requiresFile: false,
          disableAction: true,
        };
      case "REPORT_PENDING":
        return {
          text: "Đơn hàng đang được xử lý khiếu nại",
          color: "bg-yellow-600 hover:bg-yellow-700",
          description:
            "Đơn hàng đang trong quá trình xử lý khiếu nại từ khách hàng.",
          confirmText: "Đã hiểu",
          requiresFile: false,
          disableAction: true,
        };
      case "FAULTY":
        return {
          text: "Đơn hàng bị lỗi",
          color: "bg-red-600 hover:bg-red-700",
          description: "Đơn hàng đã được xác nhận lỗi sau khi xử lý khiếu nại.",
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
          // No file uploaded, use the regular action
          result = await beingToNext(order.id);
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
    !(
      order.shipping_type?.toUpperCase() !== "PICKUP" &&
      order.order_status === "SHIPPING"
    ) &&
    // New statuses that don't need action buttons from bakery side
    order.order_status !== "REPORT_PENDING" &&
    order.order_status !== "FAULTY";

  const statusInfo = getStatusInfo(order.order_status);
  const actionConfig = getActionButtonConfig(order.order_status);

  // Skeleton component for cake details
  const CakeDetailSkeleton = () => (
    <div className="space-y-6">
      {Array.from({ length: order?.order_details.length || 2 }).map(
        (_, index) => (
          <div
            key={index}
            className="group relative flex flex-col space-y-4 rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <div className="text-right">
                <Skeleton className="h-3 w-16 ml-auto" />
                <Skeleton className="h-4 w-24 ml-auto mt-1" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />

              <div className="space-y-2">
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Button
        onClick={() => router.back()}
        variant="ghost"
        size="default"
        className="mb-5 flex items-center text-primary hover:text-primary/80 hover:bg-primary/10 font-medium"
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
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Tag size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-semibold text-primary">{order.order_code}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <Clock size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày tạo đơn</p>
            <p className="font-semibold text-primary">
              {order.paid_at ? formatDate(order.paid_at) : "Không xác định"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/10 text-primary">
            <CreditCard size={18} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái đơn hàng</p>
            <p className="font-semibold text-primary">
              {order.order_status
                ? getStatusInfo(order.order_status).label
                : "Không xác định"}
            </p>
          </div>
        </div>
      </div>

      <OrderFlowVisualization order={order} />

      {/* Chi tiết sản phẩm */}
      <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
        <CardHeader className="pb-2 pt-6">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Tag size={18} className="text-primary" /> Chi tiết sản phẩm
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDetails ? (
            <CakeDetailSkeleton />
          ) : (
            <div className="space-y-6">
              {order.order_details.map((detail, index) => {
                const cakeDetails = orderItemDetails[detail.id];
                const isAvailableCake = !!detail.available_cake_id;
                return (
                  <div
                    key={detail.id}
                    className="group relative flex flex-col space-y-4 rounded-lg border p-4 transition-all hover:shadow-md dark:border-gray-800"
                  >
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {isAvailableCake ? (
                            <Cake className="h-5 w-5 text-primary" />
                          ) : (
                            <Palette className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {isAvailableCake ? "Bánh có sẵn" : "Bánh tùy chỉnh"}{" "}
                            #{index + 1}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Mã sản phẩm: {detail.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Thành tiền
                        </p>
                        <p className="font-semibold text-green-600 dark:text-green-500">
                          {formatCurrency(detail.sub_total_price)}
                        </p>
                      </div>
                    </div>

                    {/* Cake Details Section */}
                    {cakeDetails && (
                      <div className="space-y-2">
                        {isAvailableCake ? (
                          // Hiển thị thông tin bánh có sẵn
                          <>
                            <div className="space-y-1">
                              <h4 className="font-medium text-foreground">
                                {cakeDetails.name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {cakeDetails.description}
                              </p>
                            </div>
                            {cakeDetails.category && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  Loại:
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {cakeDetails.category.name}
                                </Badge>
                              </div>
                            )}
                          </>
                        ) : (
                          // Hiển thị thông tin bánh tùy chỉnh
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <h4 className="font-medium text-foreground">
                                {cakeDetails.custom_cake_name}
                              </h4>
                              {cakeDetails.custom_cake_description && (
                                <p className="text-sm text-muted-foreground">
                                  {cakeDetails.custom_cake_description}
                                </p>
                              )}
                            </div>

                            <Accordion
                              type="single"
                              collapsible
                              className="w-full border rounded-md"
                            >
                              {/* Thành phần cơ bản */}
                              {cakeDetails.part_selections &&
                                cakeDetails.part_selections.length > 0 && (
                                  <AccordionItem
                                    value="part-selections"
                                    className="border-b"
                                  >
                                    <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-900/30">
                                          <CakeSlice className="h-3.5 w-3.5 text-amber-500" />
                                        </div>
                                        <span className="text-sm font-medium">
                                          Thành phần cơ bản (
                                          {cakeDetails.part_selections.length})
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-0 pb-3 px-4">
                                      <div className="grid grid-cols-1 gap-2">
                                        {(
                                          Object.entries(
                                            cakeDetails.part_selections.reduce(
                                              (acc, part) => {
                                                if (!acc[part.part_type]) {
                                                  acc[part.part_type] = [];
                                                }
                                                acc[part.part_type].push(part);
                                                return acc;
                                              },
                                              {} as Record<string, any[]>
                                            )
                                          ) as [string, any[]][]
                                        ).map(([type, parts]) => (
                                          <div key={type} className="py-1">
                                            <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                                              <span className="text-xs font-medium">
                                                {type}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                ({parts.length})
                                              </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1 ml-3">
                                              {parts.map((part: any) => {
                                                const partDetail =
                                                  cakeDetails
                                                    .partOptionDetails?.[
                                                    part.part_option_id
                                                  ];
                                                return (
                                                  <div
                                                    key={part.id}
                                                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                                                  >
                                                    {partDetail ? (
                                                      <>
                                                        <div
                                                          className="w-2 h-2 rounded-full"
                                                          style={{
                                                            backgroundColor:
                                                              partDetail.color ||
                                                              "#ccc",
                                                          }}
                                                        ></div>
                                                        <span>
                                                          {partDetail.name}
                                                        </span>
                                                        {partDetail.price >
                                                          0 && (
                                                          <span className="text-green-600">
                                                            +
                                                            {formatCurrency(
                                                              partDetail.price
                                                            )}
                                                          </span>
                                                        )}
                                                      </>
                                                    ) : (
                                                      <span>
                                                        {part.part_option_id.slice(
                                                          0,
                                                          6
                                                        )}
                                                      </span>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                              {/* Phần thêm */}
                              {cakeDetails.extra_selections &&
                                cakeDetails.extra_selections.length > 0 && (
                                  <AccordionItem
                                    value="extra-selections"
                                    className="border-b"
                                  >
                                    <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-pink-100 dark:bg-pink-900/30">
                                          <Gift className="h-3.5 w-3.5 text-pink-500" />
                                        </div>
                                        <span className="text-sm font-medium">
                                          Phần thêm (
                                          {cakeDetails.extra_selections.length})
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-0 pb-3 px-4">
                                      <div className="grid grid-cols-1 gap-2">
                                        {(
                                          Object.entries(
                                            cakeDetails.extra_selections.reduce(
                                              (acc, extra) => {
                                                if (!acc[extra.extra_type]) {
                                                  acc[extra.extra_type] = [];
                                                }
                                                acc[extra.extra_type].push(
                                                  extra
                                                );
                                                return acc;
                                              },
                                              {} as Record<string, any[]>
                                            )
                                          ) as [string, any[]][]
                                        ).map(([type, extras]) => (
                                          <div key={type} className="py-1">
                                            <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                                              <span className="text-xs font-medium">
                                                {type}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                ({extras.length})
                                              </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1 ml-3">
                                              {extras.map((extra: any) => {
                                                const extraDetail =
                                                  cakeDetails
                                                    .extraOptionDetails?.[
                                                    extra.extra_option_id
                                                  ];
                                                return (
                                                  <div
                                                    key={extra.id}
                                                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                                                  >
                                                    {extraDetail ? (
                                                      <>
                                                        <div
                                                          className="w-2 h-2 rounded-full"
                                                          style={{
                                                            backgroundColor:
                                                              extraDetail.color ||
                                                              "#ccc",
                                                          }}
                                                        ></div>
                                                        <span>
                                                          {extraDetail.name}
                                                        </span>
                                                        {extraDetail.price >
                                                          0 && (
                                                          <span className="text-green-600">
                                                            +
                                                            {formatCurrency(
                                                              extraDetail.price
                                                            )}
                                                          </span>
                                                        )}
                                                      </>
                                                    ) : (
                                                      <span>
                                                        {extra.extra_option_id.slice(
                                                          0,
                                                          6
                                                        )}
                                                      </span>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                              {/* Trang trí */}
                              {cakeDetails.decoration_selections &&
                                cakeDetails.decoration_selections.length >
                                  0 && (
                                  <AccordionItem
                                    value="decoration-selections"
                                    className="border-b"
                                  >
                                    <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 transition-colors">
                                      <div className="flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                                          <BringToFront className="h-3.5 w-3.5 text-purple-500" />
                                        </div>
                                        <span className="text-sm font-medium">
                                          Trang trí (
                                          {
                                            cakeDetails.decoration_selections
                                              .length
                                          }
                                          )
                                        </span>
                                      </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pt-0 pb-3 px-4">
                                      <div className="grid grid-cols-1 gap-2">
                                        {(
                                          Object.entries(
                                            cakeDetails.decoration_selections.reduce(
                                              (acc, decoration) => {
                                                if (
                                                  !acc[
                                                    decoration.decoration_type
                                                  ]
                                                ) {
                                                  acc[
                                                    decoration.decoration_type
                                                  ] = [];
                                                }
                                                acc[
                                                  decoration.decoration_type
                                                ].push(decoration);
                                                return acc;
                                              },
                                              {} as Record<string, any[]>
                                            )
                                          ) as [string, any[]][]
                                        ).map(([type, decorations]) => (
                                          <div key={type} className="py-1">
                                            <div className="flex items-center gap-2">
                                              <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                                              <span className="text-xs font-medium">
                                                {type}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                ({decorations.length})
                                              </span>
                                            </div>
                                            <div className="mt-1 flex flex-wrap gap-1 ml-3">
                                              {decorations.map(
                                                (decoration: any) => {
                                                  const decorationDetail =
                                                    cakeDetails
                                                      .decorationOptionDetails?.[
                                                      decoration
                                                        .decoration_option_id
                                                    ];
                                                  return (
                                                    <div
                                                      key={decoration.id}
                                                      className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-muted/80 transition-colors flex items-center gap-1.5"
                                                    >
                                                      {decorationDetail ? (
                                                        <>
                                                          <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{
                                                              backgroundColor:
                                                                decorationDetail.color ||
                                                                "#ccc",
                                                            }}
                                                          ></div>
                                                          <span>
                                                            {
                                                              decorationDetail.name
                                                            }
                                                          </span>
                                                          {decorationDetail.price >
                                                            0 && (
                                                            <span className="text-green-600">
                                                              +
                                                              {formatCurrency(
                                                                decorationDetail.price
                                                              )}
                                                            </span>
                                                          )}
                                                        </>
                                                      ) : (
                                                        <span>
                                                          {decoration.decoration_option_id.slice(
                                                            0,
                                                            6
                                                          )}
                                                        </span>
                                                      )}
                                                    </div>
                                                  );
                                                }
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </AccordionContent>
                                  </AccordionItem>
                                )}

                              {/* Message nếu có */}
                              {cakeDetails.message_selection && (
                                <AccordionItem value="message-selection">
                                  <AccordionTrigger className="py-3 px-4 hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                        <FileText className="h-3.5 w-3.5 text-blue-500" />
                                      </div>
                                      <span className="text-sm font-medium">
                                        Lời nhắn
                                      </span>
                                    </div>
                                  </AccordionTrigger>
                                  <AccordionContent className="pt-0 pb-3 px-4">
                                    <div className="rounded-md bg-muted/50 p-2 text-sm text-muted-foreground">
                                      {cakeDetails.message_selection.message ||
                                        "Không có lời nhắn"}
                                      {cakeDetails.message_selection.text && (
                                        <p className="mt-1 font-medium">
                                          {cakeDetails.message_selection.text}
                                        </p>
                                      )}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              )}
                            </Accordion>

                            {/* Recipe nếu có */}
                            {cakeDetails.recipe && (
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/30">
                                    <FileText className="h-3.5 w-3.5 text-green-500" />
                                  </div>
                                  <h5 className="text-sm font-medium">
                                    Công thức
                                  </h5>
                                </div>
                                <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
                                  {cakeDetails.recipe}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Order Notes Section */}
                    {detail.cake_note && (
                      <div className="rounded-lg border border-dashed border-yellow-200 bg-yellow-50/50 p-3 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          <span className="font-medium">Ghi chú:</span>{" "}
                          {detail.cake_note}
                        </p>
                      </div>
                    )}

                    {/* Quantity Badge */}
                    <div className="absolute right-4 top-4">
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                        x{detail.quantity}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t bg-muted/10 p-6 dark:border-gray-800">
          <div className="flex w-full flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Tổng số sản phẩm:</span>
              <span className="font-medium text-foreground">
                {order.order_details.reduce(
                  (acc, curr) => acc + curr.quantity,
                  0
                )}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Tổng tiền sản phẩm:
              </span>
              <span className="text-xl font-semibold text-green-600 dark:text-green-500">
                {formatCurrency(order.total_product_price)}
              </span>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Order Support Images */}
      {order.order_supports && order.order_supports.length > 0 && (
        <Card className="border dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-violet-400 to-fuchsia-500"></div>
          <CardHeader className="pb-2 pt-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" /> Hình ảnh hỗ trợ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {order.order_supports.map((support) => (
                <div
                  key={support.id}
                  className="group relative overflow-hidden rounded-lg border dark:border-gray-800 transition-all hover:shadow-md"
                >
                  {supportImages[support.id] ? (
                    <div className="relative aspect-square">
                      <Image
                        src={supportImages[support.id]}
                        alt="Hình ảnh hỗ trợ"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  ) : support.file_id ? (
                    <div className="flex aspect-square items-center justify-center bg-muted">
                      <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : null}
                  {support.content && (
                    <div className="absolute inset-x-0 bottom-0 p-4 text-sm">
                      <p className="text-muted-foreground group-hover:text-white transition-colors">
                        {support.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
                          Hình ảnh bánh hoàn thiện{" "}
                          {actionConfig.fileOptional && "(không bắt buộc)"}
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
                  )}

                  <DialogFooter>
                    <Button
                      onClick={() => setIsActionDialogOpen(false)}
                      variant="outline"
                      type="button"
                    >
                      Hủy
                    </Button>
                    <Button
                      onClick={handleMoveToNextStatus}
                      disabled={
                        isLoading ||
                        (actionConfig.requiresFile &&
                          !actionConfig.fileOptional &&
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
