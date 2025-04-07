import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IPromotion } from "@/features/promotions/types/promotion";
import { Row, type Column } from "@tanstack/react-table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const discountPercentageColumn = {
  accessorKey: "discount_percentage",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Mức giảm giá" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const discountValue = row.getValue("discount_percentage") as number ;
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex space-x-2 cursor-pointer">
              <span className="max-w-[500px] truncate font-medium text-blue-600 hover:text-blue-800 transition-colors">
                {discountValue}%
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Giảm giá: {discountValue}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IPromotion>, columnId: string, filterValue: IPromotion[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default discountPercentageColumn;
