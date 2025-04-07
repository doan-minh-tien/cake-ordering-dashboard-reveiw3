import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const dateColumn = {
  accessorKey: "created_at",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Ngày tạo" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const dateStr = row.getValue("created_at") as string;
    const date = new Date(dateStr);

    // Format date as dd/MM/yyyy HH:mm
    const formattedDate = format(date, "dd/MM/yyyy HH:mm", { locale: vi });

    return <div className="font-medium">{formattedDate}</div>;
  },
} as const;

export default dateColumn;
