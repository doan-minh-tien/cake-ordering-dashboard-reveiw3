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

interface BadReportDetailProps {
  report: IBadReport | null;
}

const BadReportDetail = ({ report }: BadReportDetailProps) => {
  const [activeTab, setActiveTab] = useState("overview");

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

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-6 shadow-md">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
          <div
            className={`absolute inset-0 ${statusInfo.bgColor} opacity-10`}
          ></div>

          {/* Report Status */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Báo cáo #{report.id.substring(0, 8)}
            </h1>
            <Badge
              variant="outline"
              className="flex items-center gap-1 py-2 px-4 border-0 !shadow-md !font-medium text-lg animate-fadeIn"
              style={{
                background:
                  report.status === "RESOLVED" || report.status === "ACCEPTED"
                    ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                    : report.status === "PROCESSING"
                    ? "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)"
                    : report.status === "PENDING"
                    ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                color: "white",
              }}
            >
              {statusInfo.icon}
              <span className="ml-1">{statusInfo.label}</span>
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            description={`Địa chỉ: ${report.bakery.address.substring(
              0,
              30
            )}...`}
            bgColor="bg-emerald-50"
            iconColor="text-emerald-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <nav className="mb-6 bg-background rounded-lg overflow-hidden border shadow-sm">
            <div className="flex">
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
              </TabButton>
              <TabButton
                active={activeTab === "history"}
                onClick={() => setActiveTab("history")}
              >
                <Calendar className="h-4 w-4" />
                Lịch sử
              </TabButton>
            </div>
          </nav>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === "overview" && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin chi tiết báo cáo
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-6">
                    {/* Report Content */}
                    <div>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        Nội dung báo cáo
                      </h3>

                      <div className="p-4 border rounded-lg bg-muted/20">
                        <p className="whitespace-pre-line">{report.content}</p>
                      </div>
                    </div>

                    <Separator />

                    {/* Customer Information */}
                    <div>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
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
                          onCopy={() =>
                            copyToClipboard(report.customer.address)
                          }
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Bakery Information */}
                    <div>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                        <Store className="h-4 w-4 text-primary" />
                        Thông tin tiệm bánh
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoItem
                          icon={<Store className="h-4 w-4 text-primary" />}
                          label="Tên tiệm bánh"
                          value={report.bakery.bakery_name}
                          copyable={true}
                          onCopy={() =>
                            copyToClipboard(report.bakery.bakery_name)
                          }
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
                        <Separator />
                        {/* Order Information */}
                        <div>
                          <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                            <Clipboard className="h-4 w-4 text-primary" />
                            Thông tin đơn hàng
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem
                              icon={
                                <Clipboard className="h-4 w-4 text-primary" />
                              }
                              label="Mã đơn hàng"
                              value={report.order_id}
                              copyable={true}
                              onCopy={() =>
                                copyToClipboard(report.order_id || "")
                              }
                            />
                            <Button variant="outline" asChild>
                              <Link
                                href={`/dashboard/orders/${report.order_id}`}
                              >
                                Xem chi tiết đơn hàng
                                <ExternalLink className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "files" && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Tài liệu đính kèm
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {report.report_files && report.report_files.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {report.report_files.map((file, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src={file}
                              alt={`Tài liệu ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <p className="text-sm font-medium">
                                Tài liệu {index + 1}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(file, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Không có tài liệu đính kèm
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
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

        {/* Right Column - Actions and Status */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader className="bg-muted/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-primary" />
                Trạng thái báo cáo
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${statusInfo.bgColor}`}>
                    {statusInfo.icon}
                  </div>
                  <div>
                    <p className="font-medium">Trạng thái hiện tại</p>
                    <p className={`${statusInfo.textColor} font-semibold`}>
                      {statusInfo.label}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="font-medium">Ngày tạo</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(report.created_at)}</span>
                  </div>

                  {report.updated_at && (
                    <>
                      <p className="font-medium mt-4">Cập nhật lần cuối</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(report.updated_at)}</span>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-3">
                  <p className="font-medium">Thao tác</p>

                  {report.status === "PENDING" && (
                    <>
                      <Button className="w-full" variant="default">
                        <Clock className="mr-2 h-4 w-4" />
                        Bắt đầu xử lý
                      </Button>
                    </>
                  )}

                  {report.status === "PROCESSING" && (
                    <>
                      <Button className="w-full" variant="default">
                        <Check className="mr-2 h-4 w-4" />
                        Đánh dấu đã giải quyết
                      </Button>
                      <Button className="w-full" variant="outline">
                        <X className="mr-2 h-4 w-4" />
                        Từ chối báo cáo
                      </Button>
                    </>
                  )}

                  {(report.status === "RESOLVED" ||
                    report.status === "REJECTED" ||
                    report.status === "ACCEPTED") && (
                    <Button className="w-full" variant="outline">
                      <Clock className="mr-2 h-4 w-4" />
                      Mở lại báo cáo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Information Card */}
          <Card>
            <CardHeader className="bg-muted/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-primary" />
                Thông tin liên quan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/dashboard/customers/${report.customer_id}`}>
                    <User className="mr-2 h-4 w-4" />
                    Xem hồ sơ khách hàng
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={`/dashboard/bakeries/${report.bakery_id}`}>
                    <Store className="mr-2 h-4 w-4" />
                    Xem hồ sơ tiệm bánh
                  </Link>
                </Button>

                {report.order_id && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <Link href={`/dashboard/orders/${report.order_id}`}>
                      <Clipboard className="mr-2 h-4 w-4" />
                      Xem chi tiết đơn hàng
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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
  <div className="flex">
    <div className="flex flex-col items-center mr-4">
      <div className={`${color} rounded-full p-1 w-3 h-3`}></div>
      <div className="bg-gray-200 dark:bg-gray-700 flex-grow w-0.5 my-1"></div>
    </div>
    <div className="bg-muted/30 rounded-lg p-4 flex-grow">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{title}</h4>
        <span className="text-xs text-muted-foreground">{date}</span>
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
  <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
    <CardContent className="p-0">
      <div className="flex items-start gap-4 p-6">
        <div className={`${bgColor} p-3 rounded-lg`}>
          <div className={`${iconColor}`}>{icon}</div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
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
    className={`h-10 gap-1 text-sm font-medium rounded-none ${
      active ? "bg-primary text-primary-foreground" : ""
    }`}
    onClick={onClick}
  >
    {children}
  </Button>
);

export default BadReportDetail;
