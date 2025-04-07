"use client";

import { useEffect, useState } from "react";
import { useModal } from "@/hooks/use-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBarkery } from "@/features/barkeries/types/barkeries-type";
import {
  approveBakery,
  getBakery,
} from "@/features/barkeries/actions/barkeries-action";
import { CheckCircle, Loader2, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BakeryDetailModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [bakery, setBakery] = useState<IBarkery | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const isModalOpen = isOpen && type === "bakeryDetailModal";
  const bakeryId = data.bakeryId as string;

  useEffect(() => {
    const fetchBakeryDetail = async () => {
      if (isModalOpen && bakeryId) {
        setIsLoading(true);
        try {
          const response = await getBakery(bakeryId);

          if (response.data) {
            setBakery(response.data);
          } else {
            toast({
              title: "Lỗi",
              description: "Không thể tải thông tin cửa hàng",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error fetching bakery:", error);
          toast({
            title: "Lỗi",
            description: "Đã xảy ra lỗi khi tải dữ liệu cửa hàng",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchBakeryDetail();
  }, [isModalOpen, bakeryId, toast]);

  const handleApprove = async () => {
    if (!bakery) return;

    setIsApproving(true);
    try {
      const result = await approveBakery(bakery.id);

      if (result.success) {
        toast({
          title: "Thành công",
          description: "Đã phê duyệt cửa hàng thành công",
        });
        onClose();
        router.refresh();
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể phê duyệt cửa hàng",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving bakery:", error);
      toast({
        title: "Lỗi",
        description: "Đã xảy ra lỗi khi phê duyệt cửa hàng",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const openImageInNewTab = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[75vh] overflow-y-auto p-3">
        <DialogHeader className="p-0 space-y-0.5">
          <DialogTitle className="text-sm">Thông tin cửa hàng</DialogTitle>
          <DialogDescription className="text-[10px]">
            Xem chi tiết và phê duyệt cửa hàng
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="size-5 animate-spin" />
          </div>
        ) : !bakery ? (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">
              Không tìm thấy thông tin cửa hàng
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Basic Info */}
            <div className="flex gap-2 items-start">
              <Avatar className="size-8 border">
                <AvatarImage
                  src={bakery.avatar_file?.file_url || ""}
                  alt={bakery.bakery_name}
                />
                <AvatarFallback className="text-[10px]">
                  {bakery.bakery_name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5 flex-1">
                <h3 className="text-sm font-bold">{bakery.bakery_name}</h3>
                <div className="flex items-center gap-1">
                  <span
                    className={`px-1 py-0.5 rounded-full text-[8px] ${
                      bakery.status === "CONFIRMED"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        : bakery.status === "BANNED"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {bakery.status === "CONFIRMED"
                      ? "Đã phê duyệt"
                      : bakery.status === "BANNED"
                      ? "Đã cấm"
                      : "Chờ xác nhận"}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Chủ: {bakery.owner_name}
                </p>
              </div>
            </div>

            <Separator className="my-0.5" />

            {/* Contact and Documents - 2 columns */}
            <div className="grid grid-cols-2 gap-1">
              {/* Contact Info */}
              <Card className="h-full shadow-none border">
                <CardHeader className="p-1 pb-0.5">
                  <CardTitle className="text-[10px]">
                    Thông tin liên hệ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-1 space-y-1">
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-[10px] truncate">{bakery.email}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      SĐT
                    </p>
                    <p className="text-[10px]">{bakery.phone}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      Địa chỉ
                    </p>
                    <p className="text-[10px] line-clamp-1">{bakery.address}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Documents Info */}
              <Card className="h-full shadow-none border">
                <CardHeader className="p-1 pb-0.5">
                  <CardTitle className="text-[10px]">
                    Thông tin giấy tờ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-1 space-y-1">
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      CMND
                    </p>
                    <p className="text-[10px]">{bakery.identity_card_number}</p>
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      Mã số thuế
                    </p>
                    <p className="text-[10px]">
                      {bakery.tax_code || "Không có"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Document Images */}
            <Card className="shadow-none border">
              <CardHeader className="p-1 pb-0.5">
                <CardTitle className="text-[10px]">Hình ảnh giấy tờ</CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      Mặt trước CMND
                    </p>
                    {bakery.front_card_file ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                              onClick={() =>
                                openImageInNewTab(
                                  bakery.front_card_file?.file_url || ""
                                )
                              }
                            >
                              <img
                                src={bakery.front_card_file.file_url || ""}
                                alt="CMND mặt trước"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="text-white h-3 w-3" />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="text-[10px] p-1"
                          >
                            Xem ảnh đầy đủ
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                        <p className="text-[8px] text-muted-foreground">
                          Không có hình ảnh
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[8px] font-medium text-muted-foreground">
                      Mặt sau CMND
                    </p>
                    {bakery.back_card_file ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className="h-16 rounded-md overflow-hidden bg-muted cursor-pointer relative group"
                              onClick={() =>
                                openImageInNewTab(
                                  bakery.back_card_file?.file_url || ""
                                )
                              }
                            >
                              <img
                                src={bakery.back_card_file.file_url || ""}
                                alt="CMND mặt sau"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink className="text-white h-3 w-3" />
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="text-[10px] p-1"
                          >
                            Xem ảnh đầy đủ
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <div className="h-16 rounded-md bg-muted flex items-center justify-center">
                        <p className="text-[8px] text-muted-foreground">
                          Không có hình ảnh
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shop Images */}
            {bakery.shop_image_files && bakery.shop_image_files.length > 0 && (
              <Card className="shadow-none border">
                <CardHeader className="p-1 pb-0.5">
                  <CardTitle className="text-[10px]">
                    Hình ảnh cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-1">
                  <div className="grid grid-cols-5 gap-0.5">
                    {bakery.shop_image_files
                      .slice(0, 10)
                      .map((image, index) => (
                        <TooltipProvider key={index}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div
                                className="h-12 rounded-sm overflow-hidden bg-muted cursor-pointer relative group"
                                onClick={() =>
                                  openImageInNewTab(image.file_url)
                                }
                              >
                                <img
                                  src={image.file_url}
                                  alt={`Hình cửa hàng ${index + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ExternalLink className="text-white h-2 w-2" />
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              className="text-[10px] p-1"
                            >
                              Xem ảnh đầy đủ
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                    {bakery.shop_image_files.length > 10 && (
                      <div className="h-12 rounded-sm bg-muted flex items-center justify-center">
                        <p className="text-[8px] text-muted-foreground">
                          +{bakery.shop_image_files.length - 10}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="mt-1 gap-1 flex-row justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-6 text-[10px] px-1.5"
          >
            Đóng
          </Button>
          {bakery && bakery.status === "PENDING" && (
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-6 text-[10px] px-1.5"
            >
              {isApproving ? (
                <>
                  <Loader2 className="mr-1 h-2 w-2 animate-spin" />
                  <span>Đang xử lý</span>
                </>
              ) : (
                <>
                  <CheckCircle className="mr-1 h-2 w-2" />
                  <span>Phê duyệt</span>
                </>
              )}
            </Button>
          )}
          {bakery && bakery.status === "CONFIRMED" && (
            <Button
              disabled
              size="sm"
              className="bg-green-600 text-white cursor-not-allowed h-6 text-[10px] px-1.5"
            >
              <CheckCircle className="mr-1 h-2 w-2" />
              <span>Đã phê duyệt</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
