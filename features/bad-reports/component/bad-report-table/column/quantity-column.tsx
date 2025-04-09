import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";

export const quantityColumn = {
  accessorKey: "available_cake_quantity",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Số lượng" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => {
    const quantity = row.getValue("available_cake_quantity");
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
  filterFn: (row: Row<ICake>, columnId: string, filterValue: ICake[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default quantityColumn;
