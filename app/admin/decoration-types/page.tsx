import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import DecorationTypesShowcase from "@/features/ingredients/components/decoration-types-showcase";

export const metadata: Metadata = {
  title: "Loại trang trí bánh | Quản lý bánh",
  description: "Danh sách các loại trang trí bánh",
};

export default function DecorationTypesPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản lý loại trang trí bánh
        </h1>
        <p className="text-muted-foreground mt-2">
          Các loại trang trí bánh và các mẫu trang trí có sẵn
        </p>
      </div>
      <Separator />
      <DecorationTypesShowcase />
    </div>
  );
}
