"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  FileText,
  User,
  AlertCircle,
  Copy,
  Info,
  ExternalLink,
  DollarSign,
  MessageCircle,
  Store,
  Camera,
  X,
  Check,
  Clipboard,
  Link as LinkIcon,
} from "lucide-react";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IBadReport } from "../../types/bad-report-type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AlertModal from "../alert-modal/alert-modal";
import { updateBadReportStatus } from "../../actions/bad-report-action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface BadReportDetailProps {
  report: IBadReport | null;
}

const BadReportDetail = ({ report }: BadReportDetailProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [showStatusAlert, setShowStatusAlert] = useState(false);
  const [isApprove, setIsApprove] = useState(false);
  const [showResolveAlert, setShowResolveAlert] = useState(false);
  const [isPending, setIsPending] = useState(false);

  if (!report) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-lg font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ xử lý",
          icon: <Clock className="h-4 w-4" />,
          color: "bg-yellow-500",
          textColor: "text-yellow-500",
          bgColor: "bg-yellow-100",
        };
      case "PROCESSING":
        return {
          label: "Đang xử lý",
          icon: <AlertCircle className="h-4 w-4" />,
          color: "bg-blue-500",
          textColor: "text-blue-500",
          bgColor: "bg-blue-100",
        };
      case "RESOLVED":
        return {
          label: "Đã xử lý",
          icon: <Check className="h-4 w-4" />,
          color: "bg-green-500",
          textColor: "text-green-500",
          bgColor: "bg-green-100",
        };
      case "REJECTED":
        return {
          label: "Từ chối",
          icon: <X className="h-4 w-4" />,
          color: "bg-red-500",
          textColor: "text-red-500",
          bgColor: "bg-red-100",
        };
      case "ACCEPTED":
        return {
          label: "Đã chấp nhận",
          icon: <Check className="h-4 w-4" />,
          color: "bg-teal-500",
          textColor: "text-teal-500",
          bgColor: "bg-teal-100",
        };
      default:
        return {
          label: status,
          icon: <Info className="h-4 w-4" />,
          color: "bg-gray-500",
          textColor: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  };

  const statusInfo = getStatusInfo(report.status);
  const reportTypeInfo = getReportTypeInfo(report.type);

  function getReportTypeInfo(type: string) {
    switch (type) {
      case "BAKERY_REPORT":
        return {
          label: "Báo cáo tiệm bánh",
          icon: <Store className="h-4 w-4" />,
          color: "bg-purple-500",
          textColor: "text-purple-500",
          bgColor: "bg-purple-100",
        };
      case "ORDER_REPORT":
        return {
          label: "Báo cáo đơn hàng",
          icon: <Clipboard className="h-4 w-4" />,
          color: "bg-indigo-500",
          textColor: "text-indigo-500",
          bgColor: "bg-indigo-100",
        };
      default:
        return {
          label: type,
          icon: <Info className="h-4 w-4" />,
          color: "bg-gray-500",
          textColor: "text-gray-500",
          bgColor: "bg-gray-100",
        };
    }
  }

  const handleStatusUpdate = async () => {
    try {
      setIsPending(true);
      const result = await updateBadReportStatus(report.id, isApprove);

      if (result.success) {
        toast.success(
          isApprove ? "Đã bắt đầu xử lý báo cáo" : "Đã từ chối báo cáo"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Đã có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Đã có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setIsPending(false);
      setShowStatusAlert(false);
    }
  };

  const handleResolve = () => {
    // Add your resolve logic here
    console.log("Resolving report...");
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6">
      {/* Hero Section - Full Width Banner with Glass Effect */}
      <div className="mb-8">
        <div className="relative w-full h-52 sm:h-60 md:h-64 rounded-xl overflow-hidden shadow-xl border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/50 to-black/30"></div>
          <div className={`absolute inset-0 ${statusInfo.bgColor} opacity-20`}></div>
          <div className="absolute inset-0 bg-[url('/images/pattern-bg.png')] opacity-10 bg-repeat"></div>
          
          {/* Animated Background Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/40 via-primary/80 to-primary/40 opacity-80"></div>
          
          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl opacity-30"></div>
          <div className="absolute bottom-1/3 left-1/3 w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500/20 to-transparent blur-xl opacity-30"></div>
          
          {/* Report Type Badge */}
          <div className="absolute top-5 left-5 z-10">
            <Badge 
              variant="outline" 
              className="py-1.5 px-3 bg-opacity-90 backdrop-blur-md shadow-lg border-0 animate-fadeIn"
              style={{
                background: `rgba(${reportTypeInfo.textColor === 'text-purple-500' ? '147, 51, 234' : '79, 70, 229'}, 0.15)`,
                color: reportTypeInfo.textColor === 'text-purple-500' ? 'rgb(147, 51, 234)' : 'rgb(79, 70, 229)'
              }}
            >
              <div className="flex items-center gap-1.5">
                {reportTypeInfo.icon}
                <span className="font-medium">{reportTypeInfo.label}</span>
              </div>
            </Badge>
          </div>

          {/* Report Status */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 drop-shadow-md tracking-tight">
              Báo cáo <span className="text-primary-foreground">#{report.id.substring(0, 8)}</span>
            </h1>
            <Badge
              variant="outline"
              className="inline-flex items-center gap-1.5 py-2 px-4 border-0 shadow-lg font-medium text-lg animate-fadeIn backdrop-blur-md"
              style={{
                background:
                  report.status === "RESOLVED" || report.status === "ACCEPTED"
                    ? "linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(52, 211, 153, 0.9) 100%)"
                    : report.status === "PROCESSING"
                    ? "linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(96, 165, 250, 0.9) 100%)"
                    : report.status === "PENDING"
                    ? "linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(251, 191, 36, 0.9) 100%)"
                    : "linear-gradient(135deg, rgba(239, 68, 68, 0.8) 0%, rgba(248, 113, 113, 0.9) 100%)",
                color: "white",
                backdropFilter: "blur(4px)"
              }}
            >
              {statusInfo.icon}
              <span>{statusInfo.label}</span>
            </Badge>
          </div>
          
          {/* Creation Date */}
          <div className="absolute bottom-4 right-5 text-white/90 text-sm backdrop-blur-md bg-black/30 px-3 py-1.5 rounded-full shadow-md">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(report.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Flexible Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Sidebar - Status Card on Desktop, Top on Mobile */}
        <div className="xl:col-span-3 order-2 xl:order-1 space-y-6">
          {/* Status Card */}
          <Card className="overflow-hidden shadow-lg border border-muted/60 hover:border-muted/80 transition-all duration-300">
            <CardHeader className="bg-muted/30 py-4 border-b border-muted/30">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Trạng thái báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                  <div className={`p-2.5 rounded-full ${statusInfo.bgColor}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Trạng thái hiện tại</p>
                    <p className={`${statusInfo.textColor} font-semibold text-lg`}>
                      {statusInfo.label}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 p-3 bg-muted/10 rounded-lg">
                    <p className="font-medium text-sm text-muted-foreground">Ngày tạo</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">{formatDate(report.created_at)}</span>
                    </div>
                  </div>

                  {report.updated_at ? (
                    <div className="space-y-1 p-3 bg-muted/10 rounded-lg">
                      <p className="font-medium text-sm text-muted-foreground">Cập nhật lần cuối</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-medium">{formatDate(report.updated_at)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1 p-3 bg-muted/10 rounded-lg">
                      <p className="font-medium text-sm text-muted-foreground">ID Báo cáo</p>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-medium truncate">{report.id.substring(0, 10)}...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-2">
                  <p className="font-medium flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Thao tác
                  </p>

                  {report.status === "PENDING" && (
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        className="w-full group relative overflow-hidden"
                        variant="default"
                        onClick={() => {
                          setIsApprove(true);
                          setShowStatusAlert(true);
                        }}
                        disabled={isPending}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-light via-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>Đang xử lý...</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>Bắt đầu xử lý</span>
                            </>
                          )}
                        </span>
                      </Button>
                      <Button
                        className="w-full group relative overflow-hidden"
                        variant="destructive"
                        onClick={() => {
                          setIsApprove(false);
                          setShowStatusAlert(true);
                        }}
                        disabled={isPending}
                      >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-500 via-red-600 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isPending ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>Đang xử lý...</span>
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              <span>Từ chối báo cáo</span>
                            </>
                          )}
                        </span>
                      </Button>
                    </div>
                  )}

                  {report.status === "PROCESSING" && (
                    <Button
                      className="w-full group relative overflow-hidden"
                      variant="default"
                      onClick={() => setShowResolveAlert(true)}
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-green-500 via-green-600 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Check className="h-4 w-4" />
                        <span>Đánh dấu đã giải quyết</span>
                      </span>
                    </Button>
                  )}

                  {(report.status === "RESOLVED" ||
                    report.status === "REJECTED" ||
                    report.status === "ACCEPTED") && (
                    <Button 
                      className="w-full"
                      variant="outline"
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Mở lại báo cáo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area - Takes up most space */}
        <div className="xl:col-span-9 order-1 xl:order-2">
          {/* Stats Cards in a row on desktop, column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard
              icon={<MessageCircle className="h-5 w-5" />}
              title="Loại báo cáo"
              value={reportTypeInfo.label}
              description={`Tạo ngày: ${formatDate(report.created_at)}`}
              bgColor={reportTypeInfo.bgColor}
              iconColor={reportTypeInfo.textColor}
            />
            <StatCard
              icon={<User className="h-5 w-5" />}
              title="Người báo cáo"
              value={report.customer.name}
              description={`Số điện thoại: ${report.customer.phone}`}
              bgColor="bg-blue-50"
              iconColor="text-blue-500"
            />
            <StatCard
              icon={<Store className="h-5 w-5" />}
              title="Tiệm bánh liên quan"
              value={report.bakery.bakery_name}
              description={`Địa chỉ: ${report.bakery.address.substring(0, 30)}...`}
              bgColor="bg-emerald-50"
              iconColor="text-emerald-500"
            />
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <nav className="flex space-x-1 p-1 bg-muted/20 backdrop-blur-sm rounded-lg overflow-hidden border shadow-sm">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              >
                <Info className="h-4 w-4" />
                Chi tiết báo cáo
              </TabButton>
              <TabButton
                active={activeTab === "files"}
                onClick={() => setActiveTab("files")}
              >
                <FileText className="h-4 w-4" />
                Tài liệu đính kèm
                {report.report_files && report.report_files.length > 0 && (
                  <span className="ml-1.5 py-0.5 px-1.5 text-xs rounded-full bg-primary/20 text-primary">
                    {report.report_files.length}
                  </span>
                )}
              </TabButton>
              <TabButton
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              >
                <Calendar className="h-4 w-4" />
                Lịch sử
              </TabButton>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <Card className="overflow-hidden shadow-md border border-muted/60 transition-all duration-300">
                <CardHeader className="bg-muted/30 py-4 border-b border-muted/30">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin chi tiết báo cáo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0 divide-y divide-muted/30">
                    {/* Report Content */}
                    <div className="animate-fadeIn p-6">
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-primary/90">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        Nội dung báo cáo
                      </h3>

                      <div className="p-5 border rounded-lg bg-muted/10 hover:bg-muted/20 transition-colors duration-300 shadow-sm">
                        <p className="whitespace-pre-line text-pretty">{report.content}</p>
                      </div>
                    </div>

                    {/* Customer Information */}
                    <div className="animate-fadeIn p-6 bg-muted/5" style={{ animationDelay: '100ms' }}>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-primary/90">
                        <User className="h-4 w-4 text-primary" />
                        Thông tin người báo cáo
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                          icon={<User className="h-4 w-4 text-primary" />}
                          label="Tên khách hàng"
                          value={report.customer.name}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.customer.name)}
                        />
                        <InfoItem
                          icon={<Phone className="h-4 w-4 text-primary" />}
                          label="Số điện thoại"
                          value={report.customer.phone}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.customer.phone)}
                        />
                        <InfoItem
                          icon={<Mail className="h-4 w-4 text-primary" />}
                          label="Email"
                          value={report.customer.email}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.customer.email)}
                        />
                        <InfoItem
                          icon={<MapPin className="h-4 w-4 text-primary" />}
                          label="Địa chỉ"
                          value={report.customer.address}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.customer.address)}
                        />
                      </div>
                    </div>

                    {/* Bakery Information */}
                    <div className="animate-fadeIn p-6" style={{ animationDelay: '200ms' }}>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-primary/90">
                        <Store className="h-4 w-4 text-primary" />
                        Thông tin tiệm bánh
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                          icon={<Store className="h-4 w-4 text-primary" />}
                          label="Tên tiệm bánh"
                          value={report.bakery.bakery_name}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.bakery.bakery_name)}
                        />
                        <InfoItem
                          icon={<Phone className="h-4 w-4 text-primary" />}
                          label="Số điện thoại"
                          value={report.bakery.phone}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.bakery.phone)}
                        />
                        <InfoItem
                          icon={<Mail className="h-4 w-4 text-primary" />}
                          label="Email"
                          value={report.bakery.email}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.bakery.email)}
                        />
                        <InfoItem
                          icon={<MapPin className="h-4 w-4 text-primary" />}
                          label="Địa chỉ"
                          value={report.bakery.address}
                          copyable={true}
                          onCopy={() => copyToClipboard(report.bakery.address)}
                        />
                      </div>
                    </div>

                    {report.order_id && (
                      <>
                        {/* Order Information */}
                        <div className="animate-fadeIn p-6 bg-muted/5" style={{ animationDelay: '300ms' }}>
                          <h3 className="text-base font-medium mb-4 flex items-center gap-2 text-primary/90">
                            <Clipboard className="h-4 w-4 text-primary" />
                            Thông tin đơn hàng
                          </h3>

                          <div className="space-y-5">
                            <InfoItem
                              icon={<Clipboard className="h-4 w-4 text-primary" />}
                              label="Mã đơn hàng"
                              value={report.order_id}
                              copyable={true}
                              onCopy={() => copyToClipboard(report.order_id || "")}
                            />
                            
                            {report.order && (
                              <>
                                {/* Order Summary Box */}
                                <div className="p-4 border rounded-lg bg-muted/10 shadow-sm">
                                  <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-medium flex items-center gap-2">
                                      <DollarSign className="h-4 w-4 text-primary" />
                                      <span>Tổng quan đơn hàng</span>
                                    </h4>
                                    <Badge 
                                      variant="outline"
                                      className={`py-1 px-3 ${
                                        report.order.order_status === "COMPLETED" 
                                          ? "bg-green-100 text-green-800" 
                                          : report.order.order_status === "CANCELED" 
                                          ? "bg-red-100 text-red-800" 
                                          : report.order.order_status === "REPORT_PENDING"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {report.order.order_status === "COMPLETED" 
                                        ? "Đã hoàn thành" 
                                        : report.order.order_status === "CANCELED" 
                                        ? "Đã hủy" 
                                        : report.order.order_status === "REPORT_PENDING"
                                        ? "Đang chờ xử lý báo cáo"
                                        : report.order.order_status}
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                                    <div className="p-2 bg-primary/5 rounded-md text-center">
                                      <p className="text-xs text-muted-foreground">Giá trị đơn hàng</p>
                                      <p className="font-medium">{report.order.total_product_price.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <div className="p-2 bg-primary/5 rounded-md text-center">
                                      <p className="text-xs text-muted-foreground">Phí vận chuyển</p>
                                      <p className="font-medium">{report.order.shipping_fee.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                    <div className="p-2 bg-primary/5 rounded-md text-center">
                                      <p className="text-xs text-muted-foreground">Khoảng cách</p>
                                      <p className="font-medium">{report.order.shipping_distance.toFixed(1)}km</p>
                                    </div>
                                    <div className="p-2 bg-primary/5 rounded-md text-center">
                                      <p className="text-xs text-muted-foreground">Tổng thanh toán</p>
                                      <p className="font-medium text-primary">{report.order.total_customer_paid.toLocaleString('vi-VN')}đ</p>
                                    </div>
                                  </div>
                                  
                                  {report.order.order_status === "REPORT_PENDING" && (
                                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                                      <div className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                                        <div>
                                          <h4 className="font-medium text-yellow-700 mb-1">Đơn hàng đang trong trạng thái báo cáo</h4>
                                          <p className="text-yellow-600 text-sm">Đơn hàng này đã bị khách hàng báo cáo và đang chờ xử lý.</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Order Details in Tabs */}
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="flex border-b">
                                    <button
                                      className={`py-2 px-4 font-medium text-sm ${
                                        true ? "border-b-2 border-primary" : "text-muted-foreground"
                                      }`}
                                    >
                                      Chi tiết đơn hàng
                                    </button>
                                  </div>
                                  
                                  <div className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                      <InfoItem
                                        icon={<MapPin className="h-4 w-4 text-primary" />}
                                        label="Địa chỉ giao hàng"
                                        value={report.order.shipping_address}
                                        copyable={true}
                                        onCopy={() => copyToClipboard(report.order.shipping_address)}
                                      />
                                      
                                      <InfoItem
                                        icon={<Phone className="h-4 w-4 text-primary" />}
                                        label="Số điện thoại đặt hàng"
                                        value={report.order.phone_number}
                                        copyable={true}
                                        onCopy={() => copyToClipboard(report.order.phone_number)}
                                      />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <InfoItem
                                        icon={<Clock className="h-4 w-4 text-primary" />}
                                        label="Thời gian đặt hàng"
                                        value={formatDate(report.order.created_at)}
                                        copyable={false}
                                        onCopy={() => {}}
                                      />
                                      
                                      <InfoItem
                                        icon={<DollarSign className="h-4 w-4 text-primary" />}
                                        label="Phương thức thanh toán"
                                        value={report.order.payment_type === "QR_CODE" ? "Thanh toán QR Code" : report.order.payment_type === "CASH" ? "Thanh toán tiền mặt" : report.order.payment_type}
                                        copyable={false}
                                        onCopy={() => {}}
                                      />
                                    </div>
                                    
                                    {report.order.order_note && (
                                      <div className="mt-4">
                                        <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
                                          <Info className="h-3.5 w-3.5 text-primary" />
                                          Ghi chú đơn hàng:
                                        </h4>
                                        <p className="text-muted-foreground text-sm p-3 bg-muted/10 rounded border border-muted/20">
                                          {report.order.order_note}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="flex justify-end pt-4">
                                  <Button 
                                    variant="outline" 
                                    className="bg-muted/10 hover:bg-muted/30"
                                    asChild
                                  >
                                    <Link href={`/dashboard/orders/${report.order_id || ''}`}>
                                      <Clipboard className="mr-2 h-4 w-4" />
                                      Xem chi tiết đơn hàng
                                      <ExternalLink className="ml-2 h-3.5 w-3.5 opacity-70" />
                                    </Link>
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "files" && (
              <Card className="overflow-hidden shadow-md border border-muted/60 transition-all duration-300">
                <CardHeader className="bg-muted/30 py-4 border-b border-muted/30">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Tài liệu đính kèm
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {report.report_files && report.report_files.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {report.report_files.map((file, index) => {
                        // Type guard to check if file is a string or an object
                        const fileUrl = typeof file === 'string' ? file : ('file_url' in file ? file.file_url : '');
                        const fileName = typeof file === 'string' ? `Tài liệu ${index + 1}` : ('file_name' in file ? file.file_name : `Tài liệu ${index + 1}`);
                        
                        return (
                          <Card key={index} className="overflow-hidden animate-fadeIn group hover:shadow-md transition-all duration-300 border border-muted/40 hover:border-primary/20" style={{ animationDelay: `${index * 100}ms` }}>
                            <div className="relative aspect-video overflow-hidden">
                              <Image
                                src={fileUrl}
                                alt={`Tài liệu ${index + 1}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                                onClick={() => window.open(fileUrl, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                            <CardContent className="p-3">
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-medium truncate max-w-[calc(100%-40px)]">
                                  {fileName}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(fileUrl, "_blank")}
                                  className="h-7 w-7 rounded-full p-0"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                      <p className="text-muted-foreground font-medium">
                        Không có tài liệu đính kèm
                      </p>
                      <p className="text-muted-foreground text-sm mt-1">
                        Báo cáo này không có tập tin nào được đính kèm
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <Card className="overflow-hidden shadow-md border border-muted/60 transition-all duration-300">
                <CardHeader className="bg-muted/30 py-4 border-b border-muted/30">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Lịch sử thay đổi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ActivityTimeline report={report} formatDate={formatDate} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Alert Modals */}
      <AlertModal
        isOpen={showStatusAlert}
        onClose={() => !isPending && setShowStatusAlert(false)}
        onConfirm={handleStatusUpdate}
        title={isApprove ? "Xác nhận xử lý" : "Xác nhận từ chối"}
        description={
          isApprove
            ? "Bạn có chắc chắn muốn bắt đầu xử lý báo cáo này?"
            : "Bạn có chắc chắn muốn từ chối báo cáo này?"
        }
        actionLabel={
          isPending ? "Đang xử lý..." : isApprove ? "Bắt đầu xử lý" : "Từ chối"
        }
        variant={isApprove ? "default" : "destructive"}
      />

      <AlertModal
        isOpen={showResolveAlert}
        onClose={() => setShowResolveAlert(false)}
        onConfirm={handleResolve}
        title="Xác nhận giải quyết"
        description="Bạn có chắc chắn muốn đánh dấu báo cáo này là đã giải quyết?"
        actionLabel="Đánh dấu đã giải quyết"
      />
    </div>
  );
};

// Activity Timeline component
const ActivityTimeline = ({
  report,
  formatDate,
}: {
  report: IBadReport;
  formatDate: (date: string) => string;
}) => (
  <div className="space-y-6">
    <TimelineItem
      color="bg-green-500"
      title="Báo cáo được tạo"
      date={formatDate(report.created_at)}
      description={`Báo cáo được tạo bởi ${report.customer.name}`}
    />

    {report.updated_at && report.updated_at !== report.created_at && (
      <TimelineItem
        color="bg-blue-500"
        title="Báo cáo được cập nhật"
        date={formatDate(report.updated_at)}
        description="Thông tin báo cáo được cập nhật"
      />
    )}

    {report.status === "RESOLVED" && (
      <TimelineItem
        color="bg-teal-500"
        title="Báo cáo được giải quyết"
        date={formatDate(report.updated_at || report.created_at)}
        description="Báo cáo đã được xử lý và đánh dấu là giải quyết"
      />
    )}

    {report.status === "REJECTED" && (
      <TimelineItem
        color="bg-red-500"
        title="Báo cáo bị từ chối"
        date={formatDate(report.updated_at || report.created_at)}
        description="Báo cáo đã bị từ chối"
      />
    )}
  </div>
);

// Timeline Item component
const TimelineItem = ({
  color,
  title,
  date,
  description,
}: {
  color: string;
  title: string;
  date: string;
  description: string;
}) => (
  <div className="flex animate-fadeIn">
    <div className="flex flex-col items-center mr-4">
      <div className={`${color} rounded-full p-1 w-3 h-3 shadow-md relative`}>
        {/* Pulse effect */}
        <div className={`absolute inset-0 ${color} rounded-full animate-pulse opacity-70`}></div>
      </div>
      <div className="bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800 flex-grow w-0.5 my-1"></div>
    </div>
    <div className="bg-muted/30 hover:bg-muted/50 rounded-lg p-4 flex-grow shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-start">
        <h4 className="font-medium flex items-center gap-2">
          {title === "Báo cáo được tạo" && <FileText className="h-3.5 w-3.5 text-green-500" />}
          {title === "Báo cáo được cập nhật" && <Clock className="h-3.5 w-3.5 text-blue-500" />}
          {title === "Báo cáo được giải quyết" && <Check className="h-3.5 w-3.5 text-teal-500" />}
          {title === "Báo cáo bị từ chối" && <X className="h-3.5 w-3.5 text-red-500" />}
          {title}
        </h4>
        <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-full">{date}</span>
      </div>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

// Info Item component
const InfoItem = ({
  icon,
  label,
  value,
  copyable = false,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  copyable: boolean;
  onCopy: () => void;
}) => (
  <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
    <div className="p-2 rounded-full bg-primary/10">{icon}</div>
    <div className="flex-grow min-w-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium truncate">{value}</p>
    </div>
    {copyable && (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={onCopy}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sao chép</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )}
  </div>
);

// Stat Card component
const StatCard = ({
  icon,
  title,
  value,
  description,
  bgColor = "bg-primary/5",
  iconColor = "text-primary",
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
}) => (
  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group animate-fadeIn">
    <CardContent className="p-0">
      <div className="flex items-start gap-4 p-6 relative">
        <div className={`${bgColor} p-3 rounded-lg transition-all duration-300 group-hover:scale-110`}>
          <div className={`${iconColor} transition-all duration-300`}>{icon}</div>
        </div>
        <div className="z-10">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold mt-1 transition-all duration-300 group-hover:text-primary">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
        {/* Decorative element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-50 transition-all duration-300 -z-0"></div>
      </div>
    </CardContent>
  </Card>
);

// Tab Button component
const TabButton = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <Button
    variant={active ? "default" : "ghost"}
    className={`h-10 gap-1.5 text-sm font-medium rounded-none relative overflow-hidden transition-all duration-300 ${
      active 
        ? "bg-primary text-primary-foreground" 
        : "hover:bg-primary/5"
    }`}
    onClick={onClick}
  >
    <div className="flex items-center gap-1.5 z-10 relative">
      {children}
    </div>
    {active && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white animate-fadeIn"></div>
    )}
  </Button>
);

export default BadReportDetail;
