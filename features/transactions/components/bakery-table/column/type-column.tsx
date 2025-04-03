import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";

export const typeColumn = {
  accessorKey: "transaction_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Loại giao dịch" />
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const type = row.getValue("transaction_type");
    const formattedType = type ? type : "Không có loại";
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formattedType as string}
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

export default typeColumn;
