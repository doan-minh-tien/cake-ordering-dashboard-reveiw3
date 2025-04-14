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
    if (bakery.confirmed_at) {
      return {
        status: "Đã xác minh",
        icon: <ShieldCheck className="h-4 w-4" />,
      };
    } else if (bakery.front_card_file && bakery.back_card_file) {
      return {
        status: "Đang xem xét",
        icon: <AlertCircle className="h-4 w-4" />,
      };
    } else {
      return {
        status: "Chưa xác minh",
        icon: <X className="h-4 w-4" />,
      };
    }
  };

  const verificationStatus = getVerificationStatus();

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6 shadow-md">
          <Image
            src={
              bakery.shop_image_files[0]?.file_url ||
              "/api/placeholder/1200/400"
            }
            alt={bakery.bakery_name}
            fill
            className="object-cover transform hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Bakery Profile Image */}
          <div className="absolute -bottom-16 left-8">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <Image
                src={bakery.avatar_file.file_url || "/api/placeholder/128/128"}
                alt={`${bakery.bakery_name} logo`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 py-2 px-3 border-0 !shadow-md !font-medium animate-fadeIn"
              style={{
                background:
                  verificationStatus.status === "Đã xác minh"
                    ? "linear-gradient(135deg, #10b981 0%, #34d399 100%)"
                    : verificationStatus.status === "Đang xem xét"
                    ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                    : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                color: "white",
              }}
            >
              {verificationStatus.icon}
              {verificationStatus.status}
            </Badge>
            <Badge
              variant="outline"
              className="py-2 px-3 border-0 !shadow-md !font-medium animate-fadeIn"
              style={{
                background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                color: "white",
              }}
            >
              Tiệm bánh
            </Badge>
          </div>
        </div>

        {/* Bakery Name and Location */}
        <div className="ml-40 mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {bakery.bakery_name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <p>{bakery.address}</p>
            </div>
          </div>

          <EditButton bakeryId={bakery.id} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatCard
            icon={<Store className="h-5 w-5" />}
            title="Thông tin cơ bản"
            value={bakery.confirmed_at ? "Đã xác nhận" : "Chưa xác nhận"}
            description={`Ngày tạo: ${formatDate(
              bakery.avatar_file.created_at
            )}`}
          />
          <StatCard
            icon={<Cake className="h-5 w-5" />}
            title="Sản phẩm"
            value="0 Sản phẩm"
            description="Chưa có sản phẩm nào"
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            title="Doanh thu"
            value="0₫"
            description="Chưa có dữ liệu doanh thu"
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
          <div className="space-y-6">
            {activeTab === "overview" && (
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Thông tin chi tiết
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Information */}
                    <div>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                        <Store className="h-4 w-4 text-primary" />
                        Thông tin cửa hàng
                      </h3>
                      <ul className="space-y-3 pl-1">
                        <InfoItem
                          icon={<Store className="text-muted-foreground" />}
                          label="Tên cửa hàng"
                          value={bakery.bakery_name}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.bakery_name)}
                        />
                        <InfoItem
                          icon={<MapPin className="text-muted-foreground" />}
                          label="Địa chỉ"
                          value={bakery.address}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.address)}
                        />
                        <InfoItem
                          icon={<FileText className="text-muted-foreground" />}
                          label="Mã số thuế"
                          value={bakery.tax_code}
                          copyable={false}
                          onCopy={() => copyToClipboard(bakery.tax_code)}
                        />
                      </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Thông tin liên hệ
                      </h3>
                      <ul className="space-y-3 pl-1">
                        <InfoItem
                          icon={<Phone className="text-muted-foreground" />}
                          label="Điện thoại"
                          value={bakery.phone}
                          copyable
                          onCopy={() => copyToClipboard(bakery.phone)}
                        />
                        <InfoItem
                          icon={<Mail className="text-muted-foreground" />}
                          label="Email"
                          value={bakery.email}
                          copyable
                          onCopy={() => copyToClipboard(bakery.email)}
                        />
                        <InfoItem
                          icon={
                            <CreditCard className="text-muted-foreground" />
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

                  <div>
                    <h3 className="text-base font-medium mb-4 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Thời gian hoạt động
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Thứ 2 - Thứ 6
                        </p>
                        <p className="text-lg font-medium">07:00 - 21:00</p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-4">
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
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Camera className="h-5 w-5 text-primary" />
                    Hình ảnh cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
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
                    <div className="grid grid-cols-5 gap-3">
                      {[bakery.avatar_file, ...bakery.shop_image_files].map(
                        (image, index) => (
                          <div
                            key={image.id}
                            className={`relative aspect-square overflow-hidden rounded-lg cursor-pointer transition-all hover:opacity-90
                                    ${
                                      activeImage === image.file_url ||
                                      (!activeImage && index === 0)
                                        ? "ring-2 ring-primary shadow-md"
                                        : "border border-muted"
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
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Vị trí cửa hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md bg-muted mb-6">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center p-6 bg-white/90 rounded-lg shadow-md">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Card className="overflow-hidden">
                <CardHeader className="bg-muted/50 py-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Lịch sử hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ScrollArea className="h-96 pr-4">
                    <ActivityTimeline bakery={bakery} formatDate={formatDate} />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div>
          <Card className="sticky top-6">
            <CardHeader className="bg-muted/50 py-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Tình trạng xác minh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div
                className={`p-4 rounded-lg mb-4 flex items-center gap-3 shadow-sm ${
                  verificationStatus.status === "Đã xác minh"
                    ? "bg-emerald-400 text-emerald-950 dark:bg-emerald-500 dark:text-emerald-50"
                    : verificationStatus.status === "Đang xem xét"
                    ? "bg-amber-400 text-amber-950 dark:bg-amber-500 dark:text-amber-50"
                    : "bg-rose-400 text-rose-950 dark:bg-rose-500 dark:text-rose-50"
                }`}
              >
                <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                  {verificationStatus.icon}
                </div>
                <div>
                  <p className="font-medium">{verificationStatus.status}</p>
                  <p className="text-sm">
                    {bakery.confirmed_at
                      ? `Xác minh ngày ${formatDate(bakery.confirmed_at)}`
                      : bakery.front_card_file
                      ? "Đang chờ xác minh từ quản trị viên"
                      : "Cần cập nhật thông tin xác minh"}
                  </p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Yêu cầu xác minh:</h3>
                <VerificationItem
                  title="Thông tin cơ bản"
                  description={`Tên:  ${bakery.owner_name}`}
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
                  <Separator className="my-4" />
                  <div className="space-y-3">
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
  <Card className="overflow-hidden hover:shadow-md transition-all duration-300 border border-muted/30">
    <CardContent className="p-0">
      <div className="flex items-center">
        <div className="bg-primary/10 p-4 flex items-center justify-center">
          <div className="text-primary h-8 w-8">{icon}</div>
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold mt-1">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
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
    className={`flex items-center gap-2 py-3 px-4 text-sm font-medium transition-all relative
      ${
        active
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
      }`}
  >
    {children}
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-fadeIn"></span>
    )}
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
  <li className="flex items-start gap-3 text-sm group p-2 rounded-md hover:bg-muted/30 transition-colors">
    <div className="h-5 w-5 mt-0.5 text-primary/70">{icon}</div>
    <div className="flex-1">
      <span className="text-muted-foreground block">{label}</span>
      <div className="flex items-center gap-1 mt-1">
        <span className="font-medium">{value}</span>
        {copyable && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={onCopy}
                >
                  <Copy className="h-3 w-3" />
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
  <div className="bg-muted/50 rounded-lg p-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
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
  <div className="relative pl-6 border-l border-muted">
    <div className="space-y-6">
      {bakery.confirmed_at && (
        <TimelineItem
          color="bg-green-500"
          title="Xác nhận thông tin"
          date={formatDate(bakery.confirmed_at)}
          description="Admin đã xác nhận thông tin tiệm bánh và cho phép hoạt động trên hệ thống."
        />
      )}

      {bakery.shop_image_files?.length > 0 && (
        <TimelineItem
          color="bg-blue-500"
          title="Cập nhật hình ảnh"
          date={formatDate(
            bakery.shop_image_files[0]?.created_at || bakery.confirmed_at
          )}
          description="Chủ tiệm đã cập nhật hình ảnh cửa hàng"
        />
      )}

      {bakery.front_card_file && (
        <TimelineItem
          color="bg-blue-500"
          title="Cập nhật thông tin xác minh"
          date={formatDate(bakery.front_card_file.created_at)}
          description="Chủ tiệm đã cập nhật thông tin CMND/CCCD và thông tin xác minh"
        />
      )}

      <TimelineItem
        color="bg-blue-500"
        title="Tạo tài khoản"
        date={formatDate(bakery.avatar_file.created_at)}
        description="Chủ tiệm đã tạo tài khoản và nhập thông tin cơ bản"
      />
    </div>
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
  <div className="relative">
    <div
      className={`absolute -left-[25px] top-1 h-4 w-4 rounded-full ${color} shadow-md`}
    ></div>
    <div>
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{date}</p>
      <div className="mt-2 p-3 bg-muted/50 rounded-lg text-sm">
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
  <div className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/20 transition-colors">
    <div
      className={`h-6 w-6 rounded-full flex items-center justify-center shadow-sm transition-colors
        ${
          completed
            ? "bg-emerald-400 text-emerald-950 dark:bg-emerald-500 dark:text-emerald-50"
            : "bg-muted text-muted-foreground"
        }`}
    >
      {completed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
    </div>
    <div>
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
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

export default BakeryDetail;
