import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBarkery } from "@/features/barkeries/types/barkeries-type";
import { Row, type Column } from "@tanstack/react-table";
import { access } from "fs";

export const phoneNumColumn = {
  accessorKey: "phone",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Số điện thoại" />
  ),
  cell: ({ row }: { row: Row<IBarkery> }) => {
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("phone")}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IBarkery>, columnId: string, filterValue: IBarkery[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;
export default phoneNumColumn;
