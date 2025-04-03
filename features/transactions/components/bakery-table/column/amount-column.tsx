import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";

export const amountColumn = {
  accessorKey: "amount",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Số tiền" />
  ),
    cell: ({ row }: { row: Row<TransactionType> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {/* // fotmat làm tron 2 số thập phân */}
          {Number(row.getValue("amount")).toFixed(2)} đ
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<TransactionType>, columnId: string, filterValue: TransactionType[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default amountColumn;
