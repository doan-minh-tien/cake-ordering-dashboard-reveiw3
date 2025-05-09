"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Contact, Edit, Trash2, Eye, Copy, MoreHorizontal, Loader2 } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useModal } from "@/hooks/use-modal";
import { IPromotion } from "@/features/promotions/types/promotion";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePromotion } from "@/features/promotions/action/promotion-action";
import { AlertDialog, AlertDialogHeader,  AlertDialogDescription,   AlertDialogAction, AlertDialogCancel, AlertDialogFooter, AlertDialogContent, AlertDialogTitle } from "@/components/ui/alert-dialog";
interface ActionMenuProps {
  row: Row<IPromotion>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const { onOpen } = useModal();
  const promotionId = row.original.id;
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/promotions/${promotionId}`);
  };

  const handleDeleteConfirm = async () => {
    startTransition(async () => {
      try {
        const result = await deletePromotion(promotionId);

        if (result.success) {
          toast.success(`Đã xóa khuyến mãi "${row.original.code}" thành công`);
          router.refresh();
        } else {
          toast.error(
            `Lỗi khi xóa khuyến mãi: ${
              result.error || "Đã xảy ra lỗi không xác định"
            }`
          );
        }
      } catch (error) {
        console.error("Error deleting promotion:", error);
        toast.error("Đã xảy ra lỗi khi xóa khuyến mãi. Vui lòng thử lại sau.");
      } finally {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  const handleDuplicate = () => {
    // Implement duplicate logic
    toast.info("Đang sao chép khuyến mãi...");
  };

  return (
    <>
      <DropdownMenu>
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
          onClick={() => setIsDeleteDialogOpen(true)}
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
            <AlertDialogTitle>Xác nhận xóa khuyến mãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khuyến mãi &quot;
              <span className="font-medium">{row.original.code}</span>&quot;?
              <br />
              Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn khuyến mãi khỏi hệ
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
                "Xóa khuyến mãi"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export const actionColumn: ColumnDef<IPromotion> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
