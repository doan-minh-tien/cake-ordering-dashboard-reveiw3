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
          bgColor: "bg-gray-100 dark:bg-gray-800",
          textColor: "text-gray-700 dark:text-gray-300",
        };

      switch (status.toUpperCase()) {
        case "PENDING":
          return {
            label: "Chờ thanh toán",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
            textColor: "text-amber-700 dark:text-amber-400",
          };
        case "PROCESSING":
          return {
            label: "Đang xử lý",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            textColor: "text-blue-700 dark:text-blue-400",
          };
        case "COMPLETED":
        case "HOÀN THÀNH":
          return {
            label: "Hoàn thành",
            bgColor: "bg-green-500 dark:bg-green-600",
            textColor: "text-white",
          };
        case "CANCELLED":
        case "CANCELED":
          return {
            label: "Đã hủy",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-700 dark:text-red-400",
          };
        case "DELIVERING":
        case "SHIPPING":
          return {
            label: "Vận chuyển",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            textColor: "text-purple-700 dark:text-purple-400",
          };
        case "SHIPPING_COMPLETED":
          return {
            label: "Giao hàng hoàn tất",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
            textColor: "text-emerald-700 dark:text-emerald-400",
          };
        case "REPORT_PENDING":
          return {
            label: "Khiếu nại đang xử lý",
            bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
            textColor: "text-yellow-700 dark:text-yellow-400",
          };
        case "FAULTY":
          return {
            label: "Đơn hàng lỗi",
            bgColor: "bg-red-100 dark:bg-red-900/30",
            textColor: "text-red-700 dark:text-red-400",
          };
        case "READY_FOR_PICKUP":
          return {
            label: "Sẵn sàng giao",
            bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
            textColor: "text-indigo-700 dark:text-indigo-400",
          };
        case "WAITING_BAKERY_CONFIRM":
          return {
            label: "Đợi xác nhận",
            bgColor: "bg-cyan-100 dark:bg-cyan-800/50",
            textColor: "text-cyan-800 dark:text-cyan-200",
          };
        default:
          // For any other value, just use the value directly
          return {
            label: status,
            bgColor: "bg-gray-100 dark:bg-gray-800",
            textColor: "text-gray-700 dark:text-gray-300",
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
