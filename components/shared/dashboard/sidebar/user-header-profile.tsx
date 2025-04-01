"use client";
import { User, Settings, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { signOut } from "next-auth/react";
import AlertModal from "@/components/modals/alert-modal";
import { useCallback, useEffect, useState } from "react";

const UserProfileDropdown = () => {
  const router = useRouter();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [forceCloseDropdown, setForceCloseDropdown] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      await signOut({ callbackUrl: '/' });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [router]);

  // fix bug need close dropdown befoce open modal -> bug pointer-none (fix done)
  useEffect(() => {
    if (openUpdateModal) {
      setForceCloseDropdown(true);
      setTimeout(() => setForceCloseDropdown(false), 300);
    }
  }, [openUpdateModal]);

  return (
    <>
      <AlertModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        onConfirm={handleLogout}
        title="Đăng xuất"
        description="Bạn có chắc chắn với hành động này không?"
      />

      {!forceCloseDropdown && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="ml-2 hover:bg-secondary/80 transition-colors"
            >
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-bold">
              Tài khoản của tôi
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
              onClick={(e) => {
                e.preventDefault();
                setOpenUpdateModal(true);
              }}
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
};

export default UserProfileDropdown;
