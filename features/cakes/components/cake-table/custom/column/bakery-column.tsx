import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const bakeryColumn = {
  accessorKey: "bakery",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Tiệm bánh" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const bakery = row.original.bakery;

    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            {bakery.bakery_name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium">{bakery.bakery_name}</span>
          <span className="text-xs text-muted-foreground">{bakery.phone}</span>
        </div>
      </div>
    );
  },
} as const;

export default bakeryColumn;
