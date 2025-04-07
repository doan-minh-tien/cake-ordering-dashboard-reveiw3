import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const customerColumn = {
  accessorKey: "customer",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Khách hàng" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const customer = row.original.customer;

    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {customer.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{customer.name}</span>
          <span className="text-xs text-muted-foreground">
            {customer.phone}
          </span>
        </div>
      </div>
    );
  },
} as const;

export default customerColumn;
