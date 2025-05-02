import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";

// Mapping for transaction types to concise Vietnamese text
const transactionTypeToVietnamese: Record<string, string> = {
  "ADMIN_HOLD_PAYMENT": "Admin tạm giữ tiền",
  "ADMIN_TRANSFER_TO_BAKERY": "Admin chuyển tiền cho bakery",
  "ADMIN_REFUND_TO_CUSTOMER": "Admin hoàn tiền khách",
  "BAKERY_RECEIVE_PAYMENT": "Bakery nhận tiền",
  "BAKERY_WITHDRAWAL": "Bakery rút tiền",
  "CUSTOMER_PAYMENT": "Khách thanh toán",
  "CUSTOMER_REFUND": "Khách nhận hoàn tiền",
  "CUSTOMER_WITHDRAWAL": "Khách rút tiền",
};

export const typeColumn = {
  accessorKey: "transaction_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Loại giao dịch
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const type = row.getValue("transaction_type") as string;
    const vietnameseType = type ? (transactionTypeToVietnamese[type] || type) : "Không có loại";
    
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {vietnameseType}
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

export default typeColumn;
