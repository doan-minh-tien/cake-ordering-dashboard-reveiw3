"use client";

import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { INotification } from "../types/notification-type";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../utils/notification-service";

interface ButtonNotificationProps {
  className?: string;
}

export default function ButtonNotification({
  className,
}: ButtonNotificationProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Fetch notifications from API
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        // For demo purposes, add some mock data
        setNotifications([
          {
            id: "1",
            title: "Bạn có đơn hàng mới",
            content:
              "Một khách hàng vừa đặt hàng. Hãy kiểm tra và xác nhận ngay!",
            sender_type: "SYSTEM",
            type: "NEW_ORDER",
            is_read: false,
            target_entity_id: "order-123",
            bakery_id: "bakery-456",
            bakery: null,
            customer_id: null,
            customer: null,
            created_at: new Date().toISOString(),
            created_by: "system",
            updated_at: null,
            updated_by: null,
            is_deleted: false,
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);

      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleNotificationClick = (notification: INotification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to target entity based on notification type
    if (notification.type === "NEW_ORDER") {
      // Navigate to order details page
      window.location.href = `/orders/${notification.target_entity_id}`;
    }

    // Close popover
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      // Update local state
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", className)}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h4 className="font-medium">Thông báo</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={handleMarkAllAsRead}
            >
              Đánh dấu đã đọc tất cả
            </Button>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center p-4">
              <span>Đang tải...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-muted-foreground">Không có thông báo</span>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "cursor-pointer p-4 hover:bg-accent",
                    !notification.is_read && "bg-accent/50"
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex justify-between">
                    <h5 className="font-medium">{notification.title}</h5>
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="border-t p-2 text-center">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => {
              window.location.href = "/notifications";
              setIsOpen(false);
            }}
          >
            Xem tất cả thông báo
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
