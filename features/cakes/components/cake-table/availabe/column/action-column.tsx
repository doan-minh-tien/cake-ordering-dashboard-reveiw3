"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Contact,
  Edit,
  Trash2,
  Eye,
  Copy,
  MoreHorizontal,
  Loader2,
} from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useModal } from "@/hooks/use-modal";
import { ICake } from "@/features/cakes/types/cake";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCakeWithFeedback } from "@/features/cakes/actions/cake-action";

interface ActionMenuProps {
  row: Row<ICake>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const { onOpen } = useModal();
  const cakeId = row.original.id;
  const cakeName = row.original.name;

  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/cakes/${cakeId}`);
  };

  const handleDeleteConfirm = () => {
    startTransition(async () => {
      try {
        // Use the new action function that handles API call and feedback
        const result = await deleteCakeWithFeedback(cakeId, cakeName);

        if (result.success && result.data) {
          toast.success(result.data.message);
          router.refresh();
        } else if (!result.success) {
          toast.error(result.error || "Có lỗi xảy ra khi xóa bánh");
        }
      } catch (error) {
        console.error("Error in delete confirmation:", error);
        toast.error("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.");
      } finally {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  const handleDuplicate = () => {
    // Implement duplicate logic
    toast.info("Đang sao chép bánh...");
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label="Open actions menu"
            variant="ghost"
            className="flex size-8 p-0 data-[state=open]:bg-accent/70 hover:bg-accent/50 focus:ring-2 focus:ring-primary/30"
          >
            <DotsHorizontalIcon className="size-4" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-[200px] border shadow-lg rounded-md"
        >
          <DropdownMenuItem
            onClick={handleView}
            className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
          >
            <Eye className="mr-2 h-4 w-4 text-blue-500" />
            <span>Xem chi tiết</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDuplicate}
            className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
          >
            <Copy className="mr-2 h-4 w-4 text-purple-500" />
            <span>Sao chép</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              setIsDropdownOpen(false);
              setIsDeleteDialogOpen(true);
            }}
            className="cursor-pointer text-red-500 hover:!bg-red-50 focus:!bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bánh</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bánh "
              <span className="font-medium">{cakeName}</span>"?
              <br />
              Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn bánh khỏi hệ
              thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isPending}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600 focus:bg-red-600"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa bánh"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const actionColumn: ColumnDef<ICake> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
