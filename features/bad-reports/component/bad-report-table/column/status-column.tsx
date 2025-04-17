import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { type Column, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

const StatusLabels = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  RESOLVED: "Đã xử lý",
  REJECTED: "Từ chối",
  ACCEPTED: "Đã chấp nhận",
};

const statusStyles = {
  PENDING:
    "bg-yellow-200 text-yellow-800 hover:bg-yellow-300 hover:text-yellow-900",
  PROCESSING: "bg-blue-200 text-blue-800 hover:bg-blue-300 hover:text-blue-900",
  RESOLVED:
    "bg-green-200 text-green-800 hover:bg-green-300 hover:text-green-900",
  REJECTED: "bg-red-200 text-red-800 hover:bg-red-300 hover:text-red-900",
  ACCEPTED: "bg-teal-200 text-teal-800 hover:bg-teal-300 hover:text-teal-900",
};

const statusColumn = {
  accessorKey: "status",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Trạng thái" />
  ),
  cell: ({ row }: { row: Row<IBadReport> }) => {
    const status = row.getValue("status") as string;
    const label = StatusLabels[status as keyof typeof StatusLabels] || status;
    const style = statusStyles[status as keyof typeof statusStyles] || "";

    return (
      <Badge className={style} variant="outline">
        {label}
      </Badge>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default statusColumn;
