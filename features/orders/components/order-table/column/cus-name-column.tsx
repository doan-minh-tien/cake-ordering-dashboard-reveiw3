import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

export const cusNameColumn = {
  accessorKey: "customer.name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên khách hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const customer = row.original.customer || {};
    const customerName = customer.name || "Không xác định";
    const customerId = customer.id || row.original.customer_id || "";

    const displayCustomerId = customerId ? customerId.slice(0, 8) : "N/A";

    return (
      <div className="flex flex-col min-w-[150px]">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{customerName}</span>
        </div>
        <span className="text-xs text-muted-foreground ml-5">
          #{displayCustomerId}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;

export default cusNameColumn;
