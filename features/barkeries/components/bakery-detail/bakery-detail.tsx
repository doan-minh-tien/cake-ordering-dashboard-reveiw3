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
  Cake,
  Store,
  Camera,
  X,
  CreditCard,
  Check,
  Pencil,
  Package,
  Users,
  Star,
  Receipt,
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
import { IBarkery } from "../../types/barkeries-type";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
interface BakeryDetailProps {
  bakery: IBarkery | null;
}

const BakeryDetail = ({ bakery }: BakeryDetailProps) => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  if (!bakery) {
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

  const getVerificationStatus = () => {
    if (bakery.status) {
      return {
        status: "CONFIRMED",
        icon: <ShieldCheck className="h-4 w-4" />,
      };
    } else if (bakery.front_card_file && bakery.back_card_file) {
      return {
        status: "PENDING",
        icon: <AlertCircle className="h-4 w-4" />,
      };
    } else {
      return {
        status: "UNVERIFIED",
        icon: <X className="h-4 w-4" />,
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="mb-8">
        {/* Cover Image */}
        <div className="relative w-full h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg mb-4">
          <Image
            src={
              bakery.shop_image_files[0]?.file_url ||
              "/api/placeholder/1200/400"
            }
            alt={bakery.bakery_name}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

          {/* Verification & Type Badges */}
          <div className="absolute top-4 right-4 flex gap-2">
            {/* Verification Badge */}
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 py-1.5 px-3 border-0 shadow-md font-medium animate-fadeIn rounded-full ${
                verificationStatus.status === "CONFIRMED"
                  ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                  : verificationStatus.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300"
                  : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
              }`}
            >
              {verificationStatus.icon}
              {verificationStatus.status === "CONFIRMED" ? "Đã xác minh" : verificationStatus.status === "PENDING" ? "Đang xem xét" : "Chưa xác minh"}
            </Badge>
            {/* Bakery Type Badge */}
            <Badge
              variant="outline"
              className="py-1.5 px-3 border-0 shadow-md font-medium animate-fadeIn rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300"
            >
              Tiệm bánh
            </Badge>
          </div>
        </div>

        {/* Profile Image, Name, Location & Edit Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-20 px-4 sm:px-8">
           {/* Profile Image */}
           <div className="flex-shrink-0">
             <div className="relative h-28 w-28 sm:h-32 sm:w-32 rounded-full overflow-hidden border-4 border-background dark:border-gray-800 shadow-lg">
               <Image
                 src={bakery.avatar_file.file_url || "/api/placeholder/128/128"}
                 alt={`${bakery.bakery_name} logo`}
                 fill
                 className="object-cover"
               />
             </div>
           </div>

           {/* Name, Location */}
           <div className="flex-1 min-w-0 mt-3 sm:mt-0 sm:pb-2">
             <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80 mb-1 truncate">
               {bakery.bakery_name}
             </h1>
             <div className="flex items-center gap-2 text-muted-foreground text-sm sm:text-base">
               <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
               <p className="truncate">{bakery.address}</p>
             </div>
           </div>

           {/* Edit Button */}
           <div className="mt-2 sm:mt-0 sm:pb-2">
             <EditButton bakeryId={bakery.id} />
           </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatCard
          icon={<Store className="h-6 w-6" />}
          title="Thông tin cơ bản"
          value={bakery.confirmed_at ? "Đã xác nhận" : "Chưa xác nhận"}
          description={`Ngày tạo: ${formatDate(
            bakery.avatar_file.created_at
          )}`}
        />
        <StatCard
          icon={<Cake className="h-6 w-6" />}
          title="Sản phẩm"
          value="0 Sản phẩm"
          description="Chưa có sản phẩm nào"
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6" />}
          title="Doanh thu"
          value={`${formatCurrency(bakery.metric?.total_revenue ?? 0)}`}
          description="Chưa có dữ liệu doanh thu"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Left Column - Main Content (Tabs) */}
        <div className="md:col-span-8">
          {/* Tab Navigation */}
          <nav className="mb-8 bg-background rounded-lg overflow-hidden border dark:border-gray-700 shadow-sm">
            <div className="flex border-b dark:border-gray-700">
              <TabButton
                active={activeTab === "overview"}
                onClick={() => setActiveTab("overview")}
              >
                <Info className="h-4 w-4" />
                Thông tin
              </TabButton>
              <TabButton
                active={activeTab === "images"}
                onClick={() => setActiveTab("images")}
              >
                <Camera className="h-4 w-4" />
                Hình ảnh
              </TabButton>
              <TabButton
                active={activeTab === "location"}
                onClick={() => setActiveTab("location")}
              >
                <MapPin className="h-4 w-4" />
                Vị trí
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
          <div className="space-y-8">
            {activeTab === "overview" && (
              <Card className="overflow-hidden shadow-sm border dark:border-gray-700">
                <CardHeader className="bg-muted/30 dark:bg-muted/50 py-5 border-b dark:border-gray-700">
                  <CardTitle className="text-xl flex items-center gap-2.5">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Store Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Store className="h-5 w-5 text-primary" />
                        Thông tin cửa hàng
                      </h3>
                      <ul className="space-y-3 pl-1">
                        <InfoItem
                          icon={<Store className="h-5 w-5 text-muted-foreground" />}
                          label="Tên cửa hàng"
                          value={bakery.bakery_name}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.bakery_name)}
                        />
                        <InfoItem
                          icon={<MapPin className="h-5 w-5 text-muted-foreground" />}
                          label="Địa chỉ"
                          value={bakery.address}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.address)}
                        />
                        <InfoItem
                          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
                          label="Mã số thuế"
                          value={bakery.tax_code}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.tax_code)}
                        />
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Thông tin liên hệ
                      </h3>
                      <ul className="space-y-3 pl-1">
                        <InfoItem
                          icon={<Phone className="h-5 w-5 text-muted-foreground" />}
                          label="Điện thoại"
                          value={bakery.phone}
                          copyable
                          onCopy={() => copyToClipboard(bakery.phone)}
                        />
                        <InfoItem
                          icon={<Mail className="h-5 w-5 text-muted-foreground" />}
                          label="Email"
                          value={bakery.email}
                          copyable
                          onCopy={() => copyToClipboard(bakery.email)}
                        />
                        <InfoItem
                          icon={
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                          }
                          label="Tài khoản ngân hàng"
                          value={bakery.bank_account || "Chưa cập nhật"}
                          copyable={false}
                          onCopy={() =>
                            copyToClipboard(bakery.bank_account || "")
                          }
                        />
                      </ul>
                    </div>
                  </div>

                  <Separator />

                  {/* New Descriptions Section - Refactored into a single Card */}
                  <Card className="overflow-hidden shadow-sm border dark:border-gray-700/60 bg-muted/20 dark:bg-muted/30">
                    <CardHeader className="pb-4 pt-5">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Mô tả chi tiết
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                      {/* Bakery Description */}
                      <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Store className="h-4 w-4 text-primary/80" />
                          Mô tả cửa hàng
                        </h4>
                        <p className="text-foreground/90 dark:text-foreground/80 leading-relaxed text-sm pl-6">
                          {bakery.bakery_description ||
                            "Chưa có mô tả về cửa hàng"}
                        </p>
                      </div>

                      <Separator className="my-4 dark:bg-gray-600/50" />

                      {/* Cake Description */}
                       <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <Cake className="h-4 w-4 text-primary/80" />
                          Mô tả sản phẩm
                        </h4>
                        <p className="text-foreground/90 dark:text-foreground/80 leading-relaxed text-sm pl-6">
                          {bakery.cake_description ||
                            "Chưa có mô tả về sản phẩm"}
                        </p>
                      </div>

                      <Separator className="my-4 dark:bg-gray-600/50" />

                      {/* Price Description */}
                       <div>
                        <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="h-4 w-4 text-primary/80" />
                          Mô tả giá cả
                        </h4>
                         <p className="text-foreground/90 dark:text-foreground/80 leading-relaxed text-sm pl-6">
                          {bakery.price_description ||
                            "Chưa có mô tả về giá cả"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Separator />

                  {/* Metrics Information - Redesigned */}
                  {bakery.metric && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          Thống kê
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          <MetricDisplay
                            icon={<Package className="h-5 w-5" />}
                            title="Tổng đơn hàng"
                            value={bakery.metric.orders_count?.toString() || "0"}
                          />
                          <MetricDisplay
                            icon={<Users className="h-5 w-5" />}
                            title="Khách hàng"
                            value={bakery.metric.customers_count?.toString() || "0"}
                          />
                          <MetricDisplay
                            icon={<Receipt className="h-5 w-5" />}
                            title="Giá trị đơn TB"
                            value={bakery.metric?.average_order_value
                              ? formatCurrency(bakery.metric.average_order_value)
                              : "N/A"}
                          />
                          <MetricDisplay
                            icon={<DollarSign className="h-5 w-5" />}
                            title="Doanh thu (Shop)"
                            value={formatCurrency(bakery.metric?.total_revenue ?? 0)}
                          />
                          <MetricDisplay
                            icon={<DollarSign className="h-5 w-5" />}
                            title="Doanh thu (Hệ thống)"
                            value={formatCurrency(bakery.metric?.app_revenue ?? 0)}
                          />
                          <MetricDisplay
                            icon={<Star className="h-5 w-5" />}
                            title="Đánh giá TB"
                            value={(bakery.metric?.rating_average ?? 0) > 0
                              ? (bakery.metric?.rating_average ?? 0).toFixed(1)
                              : "N/A"}
                          />
                        </div>
                      </div>
                      <Separator className="mt-8" />
                    </>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Thời gian hoạt động
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-muted/50 dark:bg-muted/60 rounded-lg p-4 border dark:border-gray-700/50">
                        <p className="text-sm text-muted-foreground mb-1">
                          Thứ 2 - Thứ 6
                        </p>
                        <p className="text-lg font-medium">07:00 - 21:00</p>
                      </div>
                      <div className="bg-muted/50 dark:bg-muted/60 rounded-lg p-4 border dark:border-gray-700/50">
                        <p className="text-sm text-muted-foreground mb-1">
                          Thứ 7 - Chủ nhật
                        </p>
                        <p className="text-lg font-medium">08:00 - 22:00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "images" && (
              <Card className="overflow-hidden shadow-sm border dark:border-gray-700">
                <CardHeader className="bg-muted/30 dark:bg-muted/50 py-5 border-b dark:border-gray-700">
                  <CardTitle className="text-xl flex items-center gap-2.5">
                    <Camera className="h-5 w-5 text-primary" />
                    Hình ảnh cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="space-y-8">
                    {/* Main display image */}
                    <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                      <Image
                        src={
                          activeImage ||
                          bakery.shop_image_files[0]?.file_url ||
                          bakery.avatar_file.file_url
                        }
                        alt="Hình ảnh cửa hàng"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Thumbnail grid */}
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                      {[bakery.avatar_file, ...bakery.shop_image_files].slice(0, 0).map(
                        (image, index) => (
                          <div
                            key={image.id}
                            className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-90
                                    ${
                                      activeImage === image.file_url ||
                                      (!activeImage && index === 0)
                                        ? "ring-2 ring-primary dark:ring-offset-background dark:ring-offset-2 shadow-md"
                                        : "border border-muted dark:border-gray-700"
                                    }`}
                            onClick={() => setActiveImage(image.file_url)}
                          >
                            <Image
                              src={image.file_url}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "location" && (
              <Card className="overflow-hidden shadow-sm border dark:border-gray-700">
                <CardHeader className="bg-muted/30 dark:bg-muted/50 py-5 border-b dark:border-gray-700">
                  <CardTitle className="text-xl flex items-center gap-2.5">
                    <MapPin className="h-5 w-5 text-primary" />
                    Vị trí cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md bg-muted dark:bg-muted/50 mb-8">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6 bg-white/90 dark:bg-background/90 rounded-lg shadow-md backdrop-blur-sm">
                        <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
                        <p className="text-lg font-medium mb-2">
                          {bakery.address}
                        </p>
                        <p className="text-sm text-muted-foreground mb-4">
                          Tọa độ: {bakery.latitude}, {bakery.longitude}
                        </p>
                        <Button size="sm" className="gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Mở bản đồ
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <CoordinateCard
                      label="Vĩ độ (Latitude)"
                      value={bakery.latitude}
                      onCopy={() => copyToClipboard(bakery.latitude)}
                    />
                    <CoordinateCard
                      label="Kinh độ (Longitude)"
                      value={bakery.longitude}
                      onCopy={() => copyToClipboard(bakery.longitude)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "history" && (
              <Card className="overflow-hidden shadow-sm border dark:border-gray-700">
                <CardHeader className="bg-muted/30 dark:bg-muted/50 py-5 border-b dark:border-gray-700">
                  <CardTitle className="text-xl flex items-center gap-2.5">
                    <Calendar className="h-5 w-5 text-primary" />
                    Lịch sử hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8">
                  <ScrollArea className="h-[400px] pr-4">
                    <ActivityTimeline bakery={bakery} formatDate={formatDate} />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
         <div className="md:col-span-4">
          <Card className="sticky top-6 shadow-sm border dark:border-gray-700">
            <CardHeader className="bg-muted/30 dark:bg-muted/50 py-5 border-b dark:border-gray-700">
              <CardTitle className="text-xl flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Tình trạng xác minh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className={`p-4 rounded-lg mb-6 flex items-center gap-4 shadow-sm border ${
                  verificationStatus.status === "CONFIRMED"
                    ? "bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700/50"
                    : verificationStatus.status === "PENDING"
                    ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-700/50"
                    : "bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-700/50"
                }`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  verificationStatus.status === "CONFIRMED"
                    ? "bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400"
                    : verificationStatus.status === "PENDING"
                    ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-800/50 dark:text-yellow-400"
                    : "bg-red-100 text-red-600 dark:bg-red-800/50 dark:text-red-400"
                }`}>
                  {React.cloneElement(verificationStatus.icon, { className: "h-5 w-5" })}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${
                    verificationStatus.status === "CONFIRMED"
                      ? "text-green-800 dark:text-green-300"
                      : verificationStatus.status === "PENDING"
                      ? "text-yellow-800 dark:text-yellow-300"
                      : "text-red-800 dark:text-red-300"
                  }`}>
                    {verificationStatus.status === "CONFIRMED" ? "Đã xác minh" : verificationStatus.status === "PENDING" ? "Đang xem xét" : "Chưa xác minh"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {bakery.confirmed_at
                      ? `Xác minh ngày ${formatDate(bakery.confirmed_at)}`
                      : bakery.front_card_file
                        ? "Đang chờ xác minh từ quản trị viên"
                        : "Cần cập nhật thông tin xác minh"}
                  </p>
                </div>
              </div>

              <Separator className="my-6 dark:bg-gray-700" />

              <div className="space-y-3">
                <h3 className="text-base font-medium mb-2">Yêu cầu xác minh:</h3>
                <VerificationItem
                  title="Thông tin cơ bản"
                  description={`Tên: ${bakery.owner_name}`}
                  completed={true}
                />
                <VerificationItem
                  title="Giấy tờ tùy thân"
                  description="CMND/CCCD"
                  completed={!!bakery.front_card_file}
                />
                <VerificationItem
                  title="Giấy phép kinh doanh"
                  description="Đăng ký kinh doanh"
                  completed={!!bakery.tax_code}
                />
                <VerificationItem
                  title="Xác minh bởi quản trị viên"
                  description="Được admin kiểm duyệt"
                  completed={!!bakery.confirmed_at}
                />
              </div>

              {!bakery.confirmed_at && (
                <>
                  <Separator className="my-6 dark:bg-gray-700" />
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {bakery.front_card_file
                        ? "Đã gửi yêu cầu xác minh. Vui lòng chờ quản trị viên xét duyệt."
                        : "Bạn cần cập nhật đầy đủ thông tin để được xác minh."}
                    </p>
                    <Button
                      className="w-full gap-2"
                      disabled={!!bakery.front_card_file}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {bakery.front_card_file
                        ? "Đã gửi yêu cầu"
                        : "Gửi yêu cầu xác minh"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const StatCard = ({
  icon,
  title,
  value,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
}) => (
  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-muted/30 dark:border-gray-700/50 hover:border-primary/30 dark:hover:border-primary/70">
    <CardContent className="p-5 text-center">
      <div className="mb-3 inline-flex items-center justify-center p-3 rounded-full bg-primary/10 dark:bg-primary/20">
        <div className="text-primary h-6 w-6">
          {React.cloneElement(icon as React.ReactElement, { className: "h-full w-full" })}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <p className="text-2xl font-semibold mb-1.5">{value}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
    </CardContent>
  </Card>
);

const TabButton = ({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 text-sm font-medium transition-all relative border-b-2
      ${
        active
          ? "text-primary border-primary"
          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/30 dark:hover:bg-muted/50"
      }`}
  >
    {children}
  </button>
);

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
  <li className="flex items-start gap-4 text-sm group p-3 rounded-md hover:bg-muted/30 dark:hover:bg-muted/50 transition-colors">
    <div className="h-5 w-5 mt-1 text-primary/80 flex-shrink-0">{icon}</div>
    <div className="flex-1 min-w-0">
      <span className="text-muted-foreground block text-xs mb-0.5">{label}</span>
      <div className="flex items-center gap-1.5 mt-0">
        <span className="font-medium break-words">{value}</span>
        {copyable && (
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  onClick={onCopy}
                >
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sao chép</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  </li>
);

const CoordinateCard = ({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) => (
  <div className="bg-muted/50 dark:bg-muted/60 rounded-lg p-5 flex items-center justify-between gap-4 border dark:border-gray-700/50">
    <div className="min-w-0">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium truncate">{value}</p>
    </div>
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full flex-shrink-0"
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
  </div>
);

const ActivityTimeline = ({
  bakery,
  formatDate,
}: {
  bakery: IBarkery;
  formatDate: (date: string) => string;
}) => (
  <div className="space-y-6">
    <TimelineItem
      color="bg-green-500"
      title="Tài khoản được tạo"
      date={formatDate(bakery.created_at)}
      description={`Tài khoản được tạo bởi ${bakery.created_by || "hệ thống"}`}
    />

    {bakery.updated_at && bakery.updated_at !== bakery.created_at && (
      <TimelineItem
        color="bg-blue-500"
        title="Thông tin được cập nhật"
        date={formatDate(bakery.updated_at)}
        description={`Cập nhật bởi ${bakery.updated_by || "hệ thống"}`}
      />
    )}

    {bakery.confirmed_at && (
      <TimelineItem
        color="bg-teal-500"
        title="Tài khoản được xác nhận"
        date={formatDate(bakery.confirmed_at)}
        description="Tài khoản đã được xác nhận và có thể hoạt động"
      />
    )}

    {bakery.banned_at && (
      <TimelineItem
        color="bg-red-500"
        title="Tài khoản bị cấm"
        date={formatDate(bakery.banned_at)}
        description="Tài khoản đã bị cấm và không thể hoạt động"
      />
    )}
  </div>
);

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
  <div className="relative pl-8 py-2 border-l-2 border-muted dark:border-gray-700">
    <div
      className={`absolute -left-[9px] top-3 h-4 w-4 rounded-full ${color} shadow-md border-2 border-background dark:border-gray-800`}
    ></div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground mt-0.5">{date}</p>
      <div className="mt-2 p-3 bg-muted/50 dark:bg-muted/60 rounded-lg text-sm leading-relaxed border dark:border-gray-700/50">
        {description}
      </div>
    </div>
  </div>
);

const VerificationItem = ({
  title,
  description,
  completed,
}: {
  title: string;
  description: string;
  completed: boolean;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/20 dark:hover:bg-muted/40 transition-colors">
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center shadow-sm transition-colors flex-shrink-0 ${
        completed
          ? "bg-green-100 text-green-600 dark:bg-green-800/50 dark:text-green-400"
          : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      }`}
    >
      {completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground truncate">{description}</p>
    </div>
  </div>
);

const EditButton = ({ bakeryId }: { bakeryId: string }) => {
  const { data: session } = useSession();

  if (!session?.user) return null;

  const userRole = session.user.role;
  const bakeryEntityId = session.user.entity?.id;

  // Only show edit button for bakery owners
  if (userRole === "BAKERY" && bakeryEntityId === bakeryId) {
    return (
      <Link href="/dashboard/bakeries/edit">
        <Button variant="outline" className="flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Edit Profile
        </Button>
      </Link>
    );
  }

  return null;
};

// New MetricDisplay Component
const MetricDisplay = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => (
  <div className="flex items-center gap-4 rounded-lg p-4 border bg-muted/40 dark:bg-muted/50 dark:border-gray-700/60 hover:bg-muted/60 dark:hover:bg-muted/70 transition-colors shadow-sm">
    <div className="flex-shrink-0 text-primary p-2 bg-primary/10 dark:bg-primary/20 rounded-md">
      {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5" })}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-muted-foreground truncate mb-0.5">{title}</p>
      <p className="text-lg font-semibold truncate">{value}</p>
    </div>
  </div>
);

export default BakeryDetail;
