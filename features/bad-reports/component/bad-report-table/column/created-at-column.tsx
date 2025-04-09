import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { type Column, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const createdAtColumn = {
  accessorKey: "created_at",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ngày tạo" />
  ),
  cell: ({ row }: { row: Row<IBadReport> }) => {
    const value = row.getValue("created_at") as string;

    if (!value) return null;

    try {
      const date = new Date(value);
      const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: vi });

      return <div className="font-medium">{formattedDate}</div>;
    } catch (error) {
      return <div className="font-medium">{value}</div>;
    }
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default createdAtColumn;
