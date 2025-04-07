import { ICustomCake } from "../../types/custome-cake";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CakeSlice, Gift, BringToFront } from "lucide-react";

interface IngredientsListProps {
  cake: ICustomCake | null;
}

export function IngredientsList({ cake }: IngredientsListProps) {
  // Group ingredients by type
  const partSelections = cake?.part_selections || [];
  const extraSelections = cake?.extra_selections || [];
  const decorationSelections = cake?.decoration_selections || [];

  // Get counts
  const partCount = partSelections.length;
  const extraCount = extraSelections.length;
  const decorationCount = decorationSelections.length;
  const totalCount = partCount + extraCount + decorationCount;

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Thành phần ({totalCount})</span>
          <Badge variant="outline" className="ml-2">
            {totalCount} loại
          </Badge>
        </CardTitle>
        <CardDescription>
          Chi tiết thành phần của bánh tùy chỉnh
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {partCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <CakeSlice className="h-5 w-5 text-amber-500" />
              <h3 className="text-lg">Thành phần cơ bản</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {partSelections.map((part) => (
                <div
                  key={part.id}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <div className="font-medium">{part.part_type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {extraCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <Gift className="h-5 w-5 text-pink-500" />
              <h3 className="text-lg">Phần thêm</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {extraSelections.map((extra) => (
                <div
                  key={extra.id}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <div className="font-medium">{extra.extra_type}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {decorationCount > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-medium">
              <BringToFront className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg">Trang trí</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {decorationSelections.map((decoration) => (
                <div
                  key={decoration.id}
                  className="flex items-center p-2 border rounded-md bg-muted/30"
                >
                  <div className="font-medium">
                    {decoration.decoration_type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalCount === 0 && (
          <div className="text-center text-muted-foreground py-8">
            Không có thành phần nào được thêm vào bánh
          </div>
        )}
      </CardContent>
    </Card>
  );
}
