import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICustomerType } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";

export const addressColumn = {
  accessorKey: "address",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Địa chỉ" />
  ),
  cell: ({ row }: { row: Row<ICustomerType> }) => (
    <div className="w-[80px]">{row.getValue("address")}</div>
  ),
  enableSorting: false,
  enableHiding: false,
} as const;

export default addressColumn;
