"use client";

import { useInfiniteNotifications } from "@/features/notifications/react-query/query";
import { useState, useRef, useEffect, useCallback } from "react";
import { BellIcon, BellRingIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { INotification } from "@/features/notifications/types/notification-type";

export default function NotificationComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const popoverRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Use the hook we created
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteNotifications();

  console.log("Notification pages:", infiniteData?.pages?.length);

  // Flatten all pages of notifications into a single array
  const allNotifications =
    infiniteData?.pages.flatMap((page) => page.data) || [];
  const unreadCount = allNotifications.filter((noti) => !noti.is_read).length;

  // Set up intersection observer for infinite loading
  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log("Loading next page of notifications");
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(onIntersect, {
      rootMargin: "0px 0px 200px 0px",
      threshold: 0.1,
    });

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onIntersect, hasNextPage, loadMoreRef.current, isOpen]);

  // Handle click outside to close popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: INotification) => {
    // Always navigate to target entity if available
    if (notification.target_entity_id) {
      const type = notification.type as string;
      if (type.includes("ORDER")) {
        router.push(`/dashboard/orders/${notification.target_entity_id}`);
      } else if (type.includes("PAYMENT")) {
        router.push(`/dashboard/payments/${notification.target_entity_id}`);
      } else if (type.includes("DELIVERY")) {
        router.push(`/dashboard/deliveries/${notification.target_entity_id}`);
      } else {
        router.push("/dashboard");
      }
    } else {
      // Fallback routes
      const type = notification.type as string;
      if (type.includes("ORDER")) {
        router.push("/dashboard/orders");
      } else if (type.includes("PAYMENT")) {
        router.push("/dashboard/payments");
      } else if (type.includes("DELIVERY")) {
        router.push("/dashboard/deliveries");
      } else {
        router.push("/dashboard");
      }
    }
    setIsOpen(false);
  };

  function getNotificationIcon(type: string) {
    switch (type) {
      case "NEW_ORDER":
        return "🛒";
      case "ORDER_CONFIRMATION":
        return "✅";
      case "ORDER_CANCELLATION":
        return "❌";
      case "PAYMENT_CONFIRMATION":
        return "💰";
      case "DELIVERY_STATUS":
        return "🚚";
      default:
        return "📣";
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {unreadCount > 0 ? (
            <>
              <BellRingIcon className="h-5 w-5" />
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                variant="destructive"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            </>
          ) : (
            <BellIcon className="h-5 w-5" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        ref={popoverRef}
        className="w-80 p-0 max-h-[70vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={() => router.push("/dashboard/notifications")}
          >
            View All
          </Button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto py-1">
          {isLoading ? (
            Array(3)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="p-3 border-b flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))
          ) : allNotifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            <>
              {allNotifications.map((notification: INotification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b flex items-start gap-3 hover:bg-accent/50 cursor-pointer ${
                    !notification.is_read ? "bg-accent/30" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.content}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  )}
                </div>
              ))}

              {/* Load more reference element */}
              {hasNextPage && (
                <div
                  ref={loadMoreRef}
                  className="h-16 w-full flex items-center justify-center border-t"
                >
                  {isFetchingNextPage ? (
                    <div className="py-2 flex flex-col items-center justify-center">
                      <Skeleton className="h-5 w-5 rounded-full mb-1" />
                      <span className="text-xs text-muted-foreground">
                        Loading more...
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Scroll for more
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
