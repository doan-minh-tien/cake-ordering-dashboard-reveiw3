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
  PENDING: "bg-yellow-500 text-white",
  PROCESSING: "bg-blue-500 text-white",
  RESOLVED: "bg-green-500 text-white",
  REJECTED: "bg-red-500 text-white",
  ACCEPTED: "bg-green-500 text-white",
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
