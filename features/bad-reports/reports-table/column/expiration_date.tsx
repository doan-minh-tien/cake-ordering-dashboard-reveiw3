import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IPromotion } from "@/features/promotions/types/promotion";
import { Row, type Column } from "@tanstack/react-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const expirationDateColumn = {
  accessorKey: "expiration_date",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ngày hết hạn" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const expirationDate = row.getValue("expiration_date") as string;

    // Format the date and time
    const formattedDate = new Date(expirationDate).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, 
    });

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex space-x-2 cursor-pointer">
              <span className="max-w-[500px] truncate font-medium text-green-600 hover:text-green-800 transition-colors">
                {formattedDate}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ngày hết hạn: {formattedDate}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (
    row: Row<IPromotion>,
    columnId: string,
    filterValue: IPromotion[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default expirationDateColumn;
