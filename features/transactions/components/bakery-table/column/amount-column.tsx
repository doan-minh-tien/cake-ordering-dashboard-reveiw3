import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
};

export const amountColumn = {
  accessorKey: "amount",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Số tiền
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const amount = Number(row.getValue("amount"));
    const isNegative = amount < 0;
    const textColorClass = isNegative ? "text-red-600" : "text-green-600";

    return (
      <div className="flex items-center gap-2">
        {isNegative ? (
          <ArrowDownIcon className="h-4 w-4 text-red-600" />
        ) : (
          <ArrowUpIcon className="h-4 w-4 text-green-600" />
        )}
        <span className={`font-medium ${textColorClass}`}>
          {isNegative ? "-" : "+"}
          {formatCurrency(amount)}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<TransactionType>,
    columnId: string,
    filterValue: TransactionType[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default amountColumn;
