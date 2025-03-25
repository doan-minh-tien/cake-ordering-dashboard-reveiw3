import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { ICake } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";

export const typeColumn = {
  accessorKey: "available_cake_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Loại" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => {
    const type = row.getValue("available_cake_type");
    const formattedType = type ? type : "Không có loại";
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formattedType as string}
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

export default typeColumn;
