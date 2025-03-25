
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
    
export const priceColumn = {
  accessorKey: "available_cake_price",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Giá" />
  ),
    cell: ({ row }: { row: Row<ICake> }) => {
        const price = row.getValue("available_cake_price");
        const formattedPrice = price ? formatCurrency(price as number) : "Không có giá";
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formattedPrice}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<ICake>, columnId: string, filterValue: ICake[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default priceColumn;
