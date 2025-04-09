import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { type Column, Row } from "@tanstack/react-table";

const contentColumn = {
  accessorKey: "content",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Nội dung" />
  ),
  cell: ({ row }: { row: Row<IBadReport> }) => {
    const content = row.getValue("content") as string;

    return <div className="max-w-[500px] truncate font-medium">{content}</div>;
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default contentColumn;
