import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";

export const cakeNameColumn = {
  accessorKey: "custom_cake_name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tên bánh" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const cakeName = row.getValue("custom_cake_name") as string;

    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {cakeName || "Không có tên"}
        </span>
      </div>
    );
  },
} as const;

export default cakeNameColumn;
