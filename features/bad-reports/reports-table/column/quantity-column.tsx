import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IPromotion } from "@/features/promotions/types/promotion";
import { Row, type Column } from "@tanstack/react-table";

export const quantityColumn = {
  accessorKey: "quantity",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Số lượng" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const quantity = row.getValue("quantity");
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {quantity as number}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IPromotion>, columnId: string, filterValue: IPromotion[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default quantityColumn;
