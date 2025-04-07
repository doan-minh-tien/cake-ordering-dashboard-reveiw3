"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonSecondNotificationProps {
  className?: string;
  onClick?: () => void;
}

export default function ButtonSecondNotification({
  className,
  onClick,
}: ButtonSecondNotificationProps) {
  const unreadCount = 3; // Replace with actual notification count from API

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "relative hover:bg-secondary/80 transition-colors",
        className
      )}
      onClick={onClick}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Button>
  );
}
