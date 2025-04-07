import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { IOrder } from "@/features/orders/types/order-type";
import { Row, type Column } from "@tanstack/react-table";
import { QrCode } from "lucide-react";

export const paymentTypeColumn = {
  accessorKey: "payment_type",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <DataTableColumnHeader column={column} title="Phương thức thanh toán" />
  ),
  cell: ({ row }: { row: Row<IOrder> }) => {
    const paymentType = row.original.payment_type || "";

    // Get payment type label
    const getPaymentLabel = (type: string) => {
      if (!type) return "Không xác định";

      switch (type.toUpperCase()) {
        case "CASH":
          return "Tiền mặt";
        case "CREDIT_CARD":
          return "Thẻ tín dụng";
        case "BANK_TRANSFER":
          return "Chuyển khoản";
        case "E_WALLET":
          return "Ví điện tử";
        case "QR_CODE":
          return "QR Code";
        default:
          return type;
      }
    };

    // Check if it's a QR code payment
    const isQrCode =
      paymentType.toUpperCase() === "QR_CODE" ||
      paymentType.toUpperCase() === "E_WALLET";

    return (
      <div className="flex items-center gap-2 min-w-[160px]">
        <div className="flex items-center gap-1.5 text-slate-500">
          <QrCode className="h-5 w-5" />
          <span className="text-sm">
            {isQrCode ? "QR_CODE" : getPaymentLabel(paymentType)}
          </span>
        </div>
      </div>
    );
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default paymentTypeColumn;
