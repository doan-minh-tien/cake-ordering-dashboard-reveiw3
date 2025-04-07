"use client";

import { ModeToggleAnimate } from "@/components/shared/custom-ui/mode-toggle-animate";
import UserProfileDropdown from "@/components/shared/dashboard/sidebar/user-header-profile";
import { useRouter } from "next/navigation";
import NotificationComponent from "@/components/shared/custom-ui/notification-component";

interface TopRightHeaderButtonsProps {
  className?: string;
}

export default function TopRightHeaderButtons({
  className,
}: TopRightHeaderButtonsProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NotificationComponent />
      <ModeToggleAnimate />
      <UserProfileDropdown />
    </div>
  );
}
