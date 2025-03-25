import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
  import { ICake } from "@/features/cakes/types/cake";
import { Row, type Column } from "@tanstack/react-table";

export const idColumn = {
  accessorKey: "id",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="ID" />
  ),
  cell: ({ row }: { row: Row<ICake> }) => (
    <div className="w-[80px]">{row.getValue("id")}</div>
  ),
  enableSorting: false,
  enableHiding: false,
} as const;

export default idColumn;
