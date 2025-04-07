import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { Hash } from "lucide-react";

export const orderCodeColumn = {
  accessorKey: "order_code",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mã đơn hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const orderCode = (row.getValue("order_code") as string) || "N/A";

    return (
      <div className="flex items-center gap-2 min-w-[180px]">
        <div className="w-[6px] h-[6px] rounded-full bg-muted-foreground/70"></div>
        <span className="font-medium text-sm text-foreground">{orderCode}</span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderCodeColumn;
