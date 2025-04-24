import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { ShoppingCart, Palette } from "lucide-react";

export const orderCodeColumn = {
  accessorKey: "order_code",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mã đơn hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const order = row.original;
    const orderCode = (row.getValue("order_code") as string) || "N/A";

    // Debugging info
    const hasOrderDetails = Boolean(
      order?.order_details && Array.isArray(order.order_details)
    );
    const orderDetailsLength = hasOrderDetails ? order.order_details.length : 0;

    // Inspect order details more closely
    let orderDetailsInfo = "No details";
    let customOrderFound = false;

    if (hasOrderDetails && orderDetailsLength > 0) {
      orderDetailsInfo = order.order_details
        .map((detail, index) => {
          const availableCakeValue = detail
            ? detail.available_cake === null
              ? "null"
              : detail.available_cake === undefined
              ? "undefined"
              : JSON.stringify(detail.available_cake)
            : "detail is null";

          if (detail && detail.available_cake === null) {
            customOrderFound = true;
          }

          return `Detail ${index}: available_cake = ${availableCakeValue}`;
        })
        .join(", ");
    }

    console.log(`Order ${orderCode}:`);
    console.log(
      `- Has details: ${hasOrderDetails}, Count: ${orderDetailsLength}`
    );
    console.log(`- Details info: ${orderDetailsInfo}`);
    console.log(`- Is custom order: ${customOrderFound}`);

    // This is what we will use for displaying
    const isCustomOrder = customOrderFound;

    return (
      <div className="flex items-center gap-2 min-w-[180px]">
        {isCustomOrder ? (
          <>
            <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span className="font-medium text-sm bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 px-2 py-1 rounded-md">
              {orderCode} (Custom)
            </span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-medium text-sm bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-md">
              {orderCode}
            </span>
          </>
        )}
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default orderCodeColumn;
