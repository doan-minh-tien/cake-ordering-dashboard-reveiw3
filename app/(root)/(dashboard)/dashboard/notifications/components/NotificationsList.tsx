"use client";

import { useState } from "react";
import { useInfiniteNotifications } from "@/features/notifications/react-query/query";
import {
  INotification,
  NotificationType,
} from "@/features/notifications/types/notification-type";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCheck, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const notificationTypeLabels: Record<NotificationType, string> = {
  NEW_ORDER: "Đơn hàng mới",
  ORDER_CONFIRMATION: "Xác nhận đơn hàng",
  ORDER_CANCELLATION: "Hủy đơn hàng",
  PAYMENT_CONFIRMATION: "Xác nhận thanh toán",
  DELIVERY_STATUS: "Trạng thái giao hàng",
};

export default function NotificationsList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteNotifications(10);

  const getNotificationTypeColor = (type: NotificationType) => {
    const colors: Record<NotificationType, string> = {
      NEW_ORDER: "bg-blue-500 dark:bg-blue-600",
      ORDER_CONFIRMATION: "bg-green-500 dark:bg-green-600",
      ORDER_CANCELLATION: "bg-red-500 dark:bg-red-600",
      PAYMENT_CONFIRMATION: "bg-purple-500 dark:bg-purple-600",
      DELIVERY_STATUS: "bg-yellow-500 dark:bg-yellow-600",
    };
    return colors[type];
  };

  const allNotifications = data?.pages.flatMap((page) => page.data) || [];
  const unreadCount = allNotifications.filter(
    (notification) => !notification.is_read
  ).length;

  const filteredNotifications = allNotifications.filter((notification) => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterType === "all" ||
      (filterType === "unread" && !notification.is_read) ||
      (filterType === "read" && notification.is_read);

    return matchesSearch && matchesFilter;
  });

  if (error) {
    return (
      <Card className="flex flex-col items-center justify-center p-6 text-center bg-red-100 dark:bg-red-800/20">
        <Bell className="mb-2 h-12 w-12 text-red-500 dark:text-red-300" />
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-300">
          Đã có lỗi xảy ra
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Không thể tải thông báo. Vui lòng thử lại sau.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Tìm kiếm thông báo..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Lọc thông báo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="unread">Chưa đọc</SelectItem>
              <SelectItem value="read">Đã đọc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-4 bg-slate-100 dark:bg-slate-700/40">
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </Card>
          ))
        ) : filteredNotifications.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-6 text-center bg-slate-100 dark:bg-slate-700/40">
            <Bell className="mb-2 h-12 w-12 text-gray-500 dark:text-gray-300" />
            <h3 className="text-lg font-semibold">Không có thông báo</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chưa có thông báo nào phù hợp với bộ lọc của bạn
            </p>
          </Card>
        ) : (
          <>
            {filteredNotifications.map((notification: INotification) => (
              <Card
                key={notification.id}
                className={`p-4 transition-colors hover:bg-blue-50 dark:hover:bg-slate-700/70 ${
                  !notification.is_read
                    ? "border-l-4 border-l-blue-500 dark:border-l-blue-400 bg-blue-100 dark:bg-blue-800/30"
                    : "bg-slate-50 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{notification.title}</h3>
                      {!notification.is_read && (
                        <Badge
                          variant="default"
                          className="bg-blue-500 dark:bg-blue-600"
                        >
                          Mới
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {notification.content}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>
                        {formatDistanceToNow(
                          new Date(notification.created_at),
                          {
                            addSuffix: true,
                            locale: vi,
                          }
                        )}
                      </span>
                      <span>•</span>
                      <Badge
                        variant="secondary"
                        className={`${getNotificationTypeColor(
                          notification.type
                        )} text-white`}
                      >
                        {notificationTypeLabels[notification.type]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mx-auto mt-4 flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-700/30 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
              >
                {isFetchingNextPage ? (
                  <span>Đang tải...</span>
                ) : (
                  <span>Xem thêm</span>
                )}
              </button>
            )}
            {isFetchingNextPage && (
              <div className="mt-4 space-y-4">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card
                    key={index}
                    className="p-4 bg-slate-100 dark:bg-slate-700/40"
                  >
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
