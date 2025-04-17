import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IBadReport } from "@/features/bad-reports/types/bad-report-type";
import { type Column, Row } from "@tanstack/react-table";

const customerColumn = {
  accessorKey: "customer.name",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Khách hàng" />
  ),
  cell: ({ row }: { row: Row<IBadReport> }) => {
    const customer = row.original.customer;

    return (
      <div className="flex flex-col">
        <span className="font-medium">{customer.name}</span>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default customerColumn;
