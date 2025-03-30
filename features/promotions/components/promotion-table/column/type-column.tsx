import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IPromotion } from "@/features/promotions/types/promotion";
import { Row, type Column } from "@tanstack/react-table";

export const typeColumn = {
  accessorKey: "voucher_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Loại" />
  ),
  cell: ({ row }: { row: Row<IPromotion> }) => {
    const type = row.getValue("voucher_type");
    const formattedType = type ? type : "Không có loại";
    return (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {formattedType as string}
        </span>
      </div>
    );
  },
  enableSorting: false,
  enableHiding: false,
  filterFn: (row: Row<IPromotion>, columnId: string, filterValue: IPromotion[]) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default typeColumn;
