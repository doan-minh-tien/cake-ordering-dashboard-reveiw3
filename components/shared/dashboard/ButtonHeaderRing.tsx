"use client";

import { BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { fetchUnreadNotificationsCount } from "@/features/notifications/utils/notification-api";

interface ButtonHeaderRingProps {
  className?: string;
  onClick?: () => void;
}

export default function ButtonHeaderRing({
  className,
  onClick,
}: ButtonHeaderRingProps) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUnreadCount = async () => {
      setIsLoading(true);
      try {
        const count = await fetchUnreadNotificationsCount();
        setUnreadCount(count);
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getUnreadCount();

    // Set up polling to check for new notifications every minute
    const intervalId = setInterval(getUnreadCount, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative hover:bg-secondary/80 transition-colors",
        isLoading && "opacity-70",
        className
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      <BellRing className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
}
