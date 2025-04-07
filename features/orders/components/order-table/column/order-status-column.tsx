import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";

export const orderStatusColumn = {
  accessorKey: "order_status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const status = row.original.order_status || "";

    // Define status styling based on status value
    const getStatusInfo = (status: string) => {
      if (!status)
        return {
          label: "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
        };

      switch (status.toUpperCase()) {
        case "PENDING":
          return {
            label: "Chờ xử lý",
            bgColor: "bg-amber-100",
            textColor: "text-amber-700",
          };
        case "PROCESSING":
          return {
            label: "Đang xử lý",
            bgColor: "bg-blue-100",
            textColor: "text-blue-700",
          };
        case "COMPLETED":
        case "HOÀN THÀNH":
          return {
            label: "Hoàn thành",
            bgColor: "bg-green-100",
            textColor: "text-green-700",
          };
        case "CANCELLED":
        case "CANCELED":
          return {
            label: "Đã hủy",
            bgColor: "bg-red-100",
            textColor: "text-red-700",
          };
        case "DELIVERING":
          return {
            label: "Đang giao",
            bgColor: "bg-purple-100",
            textColor: "text-purple-700",
          };
        case "READY_FOR_PICKUP":
          return {
            label: "Sẵn sàng nhận",
            bgColor: "bg-indigo-100",
            textColor: "text-indigo-700",
          };
        case "WAITING_BAKERY_CONFIRM":
          return {
            label: "Đợi xác nhận",
            bgColor: "bg-slate-100",
            textColor: "text-slate-700",
          };
        default:
          // For any other value, just use the value directly
          return {
            label: status,
            bgColor: "bg-gray-100",
            textColor: "text-gray-700",
          };
      }
    };

    // Check if status is "Chờ xử lý" in the incoming data
    const isWaiting = status.toLowerCase() === "chờ xử lý";

    // Get status info
    const statusInfo = getStatusInfo(status);

    return (
      <div className="flex min-w-[200px] max-w-[250px]">
        <span
          className={cn(
            "px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap",
            statusInfo.bgColor,
            statusInfo.textColor
          )}
        >
          {isWaiting ? "Chờ xử lý" : statusInfo.label}
        </span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderStatusColumn;
