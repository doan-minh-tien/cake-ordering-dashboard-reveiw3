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
import { Contact, Edit, Trash2, Eye, Copy, MoreHorizontal } from "lucide-react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useModal } from "@/hooks/use-modal";
import { IPromotion } from "@/features/promotions/types/promotion";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface ActionMenuProps {
  row: Row<IPromotion>;
}

const ActionMenu = ({ row }: ActionMenuProps) => {
  const { onOpen } = useModal();
  const promotionId = row.original.id;

  const router = useRouter();

  const handleView = () => {
    router.push(`/dashboard/promotions/${promotionId}`);
  };

  const handleEdit = () => {
    // Navigate to edit page
    router.push(`/dashboard/promotions/edit/${promotionId}`);
  };

  const handleDelete = () => {
    // Implement delete logic
  };

  const handleDuplicate = () => {
    // Implement duplicate logic
    toast.info("Đang sao chép khuyến mãi...");
  };

  return (
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
          onClick={handleEdit}
          className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
        >
          <Edit className="mr-2 h-4 w-4 text-green-500" />
          <span>Chỉnh sửa</span>
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
          onClick={handleDelete}
          className="cursor-pointer text-red-500 hover:!bg-red-50 focus:!bg-red-50"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const actionColumn: ColumnDef<IPromotion> = {
  id: "actions",
  cell: ({ row }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
} as const;

export default actionColumn;
