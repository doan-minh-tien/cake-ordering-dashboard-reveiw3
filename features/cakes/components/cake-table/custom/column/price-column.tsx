import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";

export const priceColumn = {
  accessorKey: "total_price",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Giá" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const price = row.getValue("total_price") as number;

    // Format to VND
    const formattedPrice = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

    return <div className="font-medium">{formattedPrice}</div>;
  },
} as const;

export default priceColumn;
