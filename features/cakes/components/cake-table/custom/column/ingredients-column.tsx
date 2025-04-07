import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Row, type Column } from "@tanstack/react-table";
import { ICustomCake } from "@/features/cakes/types/custome-cake";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ingredientsColumn = {
  id: "ingredients",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Thành phần" />
  ),
  cell: ({ row }: { row: Row<ICustomCake> }) => {
    const cake = row.original;

    // Count ingredient types and their counts
    const partCount = cake.part_selections.length;
    const extraCount = cake.extra_selections.length;
    const decorationCount = cake.decoration_selections.length;

    // Total number of ingredients
    const totalIngredients = partCount + extraCount + decorationCount;

    // Group part selections by type for detailed tooltip
    const partTypes = cake.part_selections.map((part) => part.part_type);
    const extraTypes = cake.extra_selections.map((extra) => extra.extra_type);
    const decorationTypes = cake.decoration_selections.map(
      (deco) => deco.decoration_type
    );

    return (
      <div className="flex flex-wrap gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="inline-flex">
                <Badge
                  variant="outline"
                  className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20"
                >
                  {totalIngredients} thành phần
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent className="max-w-[300px]">
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-sm">
                    Phần cơ bản ({partCount}):
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {partTypes.map((type, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs"
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                {extraCount > 0 && (
                  <div>
                    <span className="font-semibold text-sm">
                      Phần thêm ({extraCount}):
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {extraTypes.map((type, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {decorationCount > 0 && (
                  <div>
                    <span className="font-semibold text-sm">
                      Trang trí ({decorationCount}):
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {decorationTypes.map((type, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  },
} as const;

export default ingredientsColumn;
