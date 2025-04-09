import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { type Column, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const TypeLabels = {
  BAKERY_REPORT: "Báo cáo tiệm bánh",
  ORDER_REPORT: "Báo cáo đơn hàng",
};

const typeStyles = {
  BAKERY_REPORT:
    "bg-purple-200 text-purple-800 hover:bg-purple-300 hover:text-purple-900",
  ORDER_REPORT:
    "bg-indigo-200 text-indigo-800 hover:bg-indigo-300 hover:text-indigo-900",
};

const typeColumn = {
  accessorKey: "type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Loại báo cáo" />
  ),
  cell: ({ row }: { row: Row<IBadReport> }) => {
    const type = row.getValue("type") as string;
    const label = TypeLabels[type as keyof typeof TypeLabels] || type;
    const style = typeStyles[type as keyof typeof typeStyles] || "";

    return (
      <Badge className={style} variant="outline">
        {label}
      </Badge>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default typeColumn;
