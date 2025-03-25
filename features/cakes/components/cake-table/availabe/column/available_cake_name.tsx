import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";

export const availableCakeNameColumn = {
  accessorKey: "available_cake_name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên bánh" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("available_cake_name")}
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

export default availableCakeNameColumn;
