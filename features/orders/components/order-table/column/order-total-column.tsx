import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";

export const orderTotalColumn = {
  accessorKey: "total_customer_paid",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tổng tiền" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    // Get amount
    const rawValue = row.getValue("total_customer_paid");

    // Convert to integer
    let amount = 0;
    if (typeof rawValue === "number") amount = Math.round(rawValue);
    else if (typeof rawValue === "string")
      amount = Math.round(parseFloat(rawValue) || 0);

    // Format with dot separator
    const formattedAmount = amount
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return (
      <div className="text-emerald-600 font-medium">{formattedAmount} đ</div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderTotalColumn;
