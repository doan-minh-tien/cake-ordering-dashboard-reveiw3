import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import DecorationTypesUI from "@/features/ingredients/components/decoration-types-ui";

export const metadata: Metadata = {
  title: "Quản lý trang trí bánh | Cake Shop",
  description: "Quản lý các loại trang trí bánh",
};

export default function DecorationTypesUIPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý trang trí bánh
        </h1>
        <p className="text-muted-foreground mt-2">
          Danh sách các loại trang trí bánh và công cụ quản lý
        </p>
      </div>
      <Separator />
      <DecorationTypesUI />
    </div>
  );
}
