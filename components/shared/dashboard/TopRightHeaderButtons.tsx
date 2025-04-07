"use client";

import { ModeToggleAnimate } from "@/components/shared/custom-ui/mode-toggle-animate";
import UserProfileDropdown from "@/components/shared/dashboard/sidebar/user-header-profile";
import ButtonHeaderRing from "@/components/shared/dashboard/ButtonHeaderRing";
import { useRouter } from "next/navigation";

interface TopRightHeaderButtonsProps {
  className?: string;
}

export default function TopRightHeaderButtons({
  className,
}: TopRightHeaderButtonsProps) {
  const router = useRouter();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <ButtonHeaderRing onClick={() => router.push("/notifications")} />
      <ModeToggleAnimate />
      <UserProfileDropdown />
    </div>
  );
}
