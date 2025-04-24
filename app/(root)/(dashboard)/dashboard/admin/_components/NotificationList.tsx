"use client";

import { useEffect, useState } from "react";
import { Bell, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AdminNotificationType } from "@/features/notifications/types/admin-notification-type";
import { getAdminNotifications } from "@/features/notifications/actions/admin-notification-action";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<AdminNotificationType[]>(
    []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const result = await getAdminNotifications();
        console.log("Fetched notifications:", result);

        if (result.error) {
          toast.error("Không thể tải thông báo");
          return;
        }

        if (result.data) {
          setNotifications(result.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Không thể tải thông báo");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const getNotificationLink = (notification: AdminNotificationType) => {
    switch (notification.type) {
      case "NEW_REPORT":
        return `/dashboard/admin/reports/${notification.target_entity_id}`;
      case "NEW_BAKERY_REGISTRATION":
        return `/dashboard/admin/bakeries/pending`;
      default:
        return "#";
    }
  };

  const getNotificationIcon = (notification: AdminNotificationType) => {
    switch (notification.type) {
      case "NEW_REPORT":
        return "🚨";
      case "NEW_BAKERY_REGISTRATION":
        return "🏪";
      default:
        return "📢";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Notifications"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {notifications.some((n) => !n.is_read) && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-medium">Thông báo</h3>
          <Link
            href="/dashboard/admin/notifications"
            className="text-sm text-muted-foreground hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <ScrollArea className="h-[calc(var(--radix-popover-content-available-height)-theme(spacing.16))] px-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Chưa có thông báo nào
              </p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {notifications.map((notification) => (
                <Link
                  key={notification.id}
                  href={getNotificationLink(notification)}
                  className={cn(
                    "flex items-start gap-4 rounded-lg p-2 transition-colors hover:bg-muted",
                    !notification.is_read && "bg-muted/50"
                  )}
                >
                  <span className="mt-1 text-xl">
                    {getNotificationIcon(notification)}
                  </span>
                  <div className="flex-1 space-y-1">
                    <p
                      className={cn(
                        "text-sm font-medium leading-none",
                        !notification.is_read && "text-primary"
                      )}
                    >
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleDateString(
                        "vi-VN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
