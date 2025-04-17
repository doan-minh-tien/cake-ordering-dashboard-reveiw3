import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

// Hàm format thời gian
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch (error) {
    return dateString;
  }
};

export const createdAtColumn = {
  accessorKey: "created_at",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Ngày tạo
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const rawDate = row.getValue("created_at") as string;
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formatDate(rawDate)}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default createdAtColumn;
