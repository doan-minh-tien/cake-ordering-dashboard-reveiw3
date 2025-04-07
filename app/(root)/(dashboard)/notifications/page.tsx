"use client";

import { useState, useEffect } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/features/notifications/utils/notification-api";
import { INotification } from "@/features/notifications/types/notification-type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await fetchNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    const success = await markNotificationAsRead(id);
    if (success) {
      setNotifications(
        notifications.map((notification) =>
          notification.id === id
            ? { ...notification, is_read: true }
            : notification
        )
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    const success = await markAllNotificationsAsRead();
    if (success) {
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    }
  };

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.is_read) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.type === "NEW_ORDER") {
      router.push(`/orders/${notification.target_entity_id}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "d MMM yyyy, HH:mm", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  const renderNotificationType = (type: string) => {
    switch (type) {
      case "NEW_ORDER":
        return "Đơn hàng mới";
      case "ORDER_CONFIRMATION":
        return "Xác nhận đơn hàng";
      case "ORDER_CANCELLATION":
        return "Hủy đơn hàng";
      case "PAYMENT_CONFIRMATION":
        return "Xác nhận thanh toán";
      case "DELIVERY_STATUS":
        return "Trạng thái giao hàng";
      default:
        return type;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Thông báo</h1>

        {notifications.some((notification) => !notification.is_read) && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <CheckCircle className="mr-2 h-4 w-4" />
            Đánh dấu đã đọc tất cả
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-60">
          <p>Đang tải...</p>
        </div>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <p className="text-muted-foreground">Không có thông báo nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "cursor-pointer transition-colors hover:bg-accent/50",
                !notification.is_read && "bg-accent/40"
              )}
              onClick={() => handleNotificationClick(notification)}
            >
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {notification.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(notification.created_at)}
                    </span>
                    {notification.is_read ? (
                      <span className="text-xs text-muted-foreground">
                        Đã đọc
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        <span className="text-xs">Đánh dấu đã đọc</span>
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription className="text-sm">
                  {renderNotificationType(notification.type)}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p>{notification.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
