import { notFound } from "next/navigation";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getCustomCakeById } from "@/features/cakes/actions/custome-cake-action";
import { IngredientsList } from "@/features/cakes/components/cake-details/IngredientsList";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Cake, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CakeDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function CakeDetailsPage({
  params,
}: CakeDetailsPageProps) {
  const { id } = params;

  // Fetch cake details from the API
  const customCake = await getCustomCakeById(id);

  if (!customCake) {
    notFound();
  }

  // Format date
  const formattedDate = format(
    new Date(customCake.data?.created_at || ""),
    "dd MMMM yyyy, HH:mm",
    { locale: vi }
  );

  // Format price
  const formattedPrice = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(customCake.data?.total_price || 0);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full"
            >
              <Link href="/dashboard/cakes">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Quay lại</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Chi tiết bánh tùy chỉnh</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main info card */}
          <Card className="md:col-span-2 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle>
                {customCake.data?.custom_cake_name || "Bánh không tên"}
              </CardTitle>
              <CardDescription>Tạo lúc: {formattedDate}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Khách hàng
                  </h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {customCake.data?.customer.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {customCake.data?.customer.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customCake.data?.customer.phone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bakery info */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Tiệm bánh
                  </h3>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        <Store className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {customCake.data?.bakery.bakery_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {customCake.data?.bakery.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Message and price info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Thông điệp
                  </h3>
                  <div className="p-3 border rounded-md bg-muted/30">
                    {customCake.data?.message_selection.message ||
                      "Không có thông điệp"}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Giá
                  </h3>
                  <div className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Cake className="h-5 w-5 text-primary" />
                      <span>Tổng tiền</span>
                    </div>
                    <div className="font-medium text-lg">{formattedPrice}</div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {customCake.data?.custom_cake_description && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Mô tả
                    </h3>
                    <div className="p-3 border rounded-md bg-muted/30">
                      {customCake.data?.custom_cake_description}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ingredients list */}
          <div className="md:col-span-1">
            <IngredientsList cake={customCake.data} />
          </div>
        </div>
      </div>
    </Shell>
  );
}
