import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { MapPin } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const shippingAddressColumn = {
  accessorKey: "shipping_address",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Địa chỉ giao hàng" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const address = row.original.shipping_address || "";

    // Truncate address if it's too long
    const truncateAddress = (addr: string, maxLength = 20) => {
      if (!addr) return "Không có địa chỉ";
      if (addr.length <= maxLength) return addr;
      return `${addr.substring(0, maxLength)}...`;
    };

    return (
      <div className="min-w-[250px]">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 flex-shrink-0 text-red-500" />
                <span className="text-sm truncate">
                  {!address ? "Không có địa chỉ" : address}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" className="max-w-xs">
              <p>{address || "Không có địa chỉ"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
} as const;

export default shippingAddressColumn;
