import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";

export const orderDateColumn = {
  accessorKey: "paid_at",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ngày đặt hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const paidAt = row.original.paid_at || "";

    // Format the date
    const formatDate = (dateString: string) => {
      if (!dateString) return "Không xác định";

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Không hợp lệ";

        // Format time as HH:MM
        const time = date.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        // Format date as DD/MM/YYYY
        const formattedDate = date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        return `${time} ${formattedDate}`;
      } catch (error) {
        return "Không xác định";
      }
    };

    return (
      <div className="flex items-center min-w-[150px]">
        <span className="text-sm text-foreground">{formatDate(paidAt)}</span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderDateColumn;
