"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import { Row } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { useToast } from "@/components/ui/use-toast";

interface ActionMenuProps {
  row: Row<IBadReport>;
}

function ActionMenu({ row }: ActionMenuProps) {
  const router = useRouter();
  const { toast } = useToast();
  const report = row.original;

  const handleView = () => {
    router.push(`/dashboard/bad-report/${report.id}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Mở menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={handleView}
          className="cursor-pointer hover:bg-accent/50 focus:bg-accent/50"
        >
          <Eye className="mr-2 h-4 w-4 text-blue-500" />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const actionColumn = {
  id: "actions",
  cell: ({ row }: { row: Row<IBadReport> }) => <ActionMenu row={row} />,
  enableSorting: false,
  enableHiding: false,
};

export default actionColumn;
