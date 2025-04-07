"use client";

import * as React from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";

import {
  DataTableFilterableColumn,
  DataTableSearchableColumn,
  Option,
} from "@/types/table";
import { toast } from "sonner";

import { generateColumnLabels } from "@/components/data-table/column-label-mapping";

import { fetchOrderTableColumnDefs } from "./order-table-column-def";
import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
// import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { getOrders } from "../../actions/order-action";
import { IOrder } from "../../types/order-type";

interface OrderTableProps {
  orderPromise: ReturnType<typeof getOrders>;
}

export function OrderTable({ orderPromise }: OrderTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);
  const enableFloatingBar = featureFlags.includes("floatingBar");
  const { data, pageCount } = React.use(orderPromise);

  const columns = React.useMemo<ColumnDef<IOrder, unknown>[]>(
    () => fetchOrderTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  // Status options for filtering
  const orderStatusOptions: Option[] = [
    { label: "Chờ xử lý", value: "PENDING" },
    { label: "Đang xử lý", value: "PROCESSING" },
    { label: "Hoàn thành", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELLED" },
    { label: "Đang giao", value: "DELIVERING" },
    { label: "Sẵn sàng nhận", value: "READY_FOR_PICKUP" },
  ];

  // Payment type options for filtering
  const paymentTypeOptions: Option[] = [
    { label: "Tiền mặt", value: "CASH" },
    { label: "Thẻ tín dụng", value: "CREDIT_CARD" },
    { label: "Chuyển khoản", value: "BANK_TRANSFER" },
    { label: "Ví điện tử", value: "E_WALLET" },
  ];

  const searchableColumns: DataTableSearchableColumn<IOrder>[] = [
    {
      id: "order_code",
      title: "Mã đơn hàng",
    },
    {
      id: "customer_id",
      title: "Tên khách hàng",
    },
    {
      id: "shipping_address",
      title: "Địa chỉ giao hàng",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<IOrder>[] = [
    {
      id: "order_status",
      title: "Trạng thái đơn hàng",
      options: orderStatusOptions,
    },
    {
      id: "payment_type",
      title: "Phương thức thanh toán",
      options: paymentTypeOptions,
    },
  ];

  const { dataTable } = useDataTable({
    data,
    columns,
    pageCount,
    searchableColumns,
    filterableColumns,
  });

  return (
    <div className="h-full flex flex-col">
      <DataTable
        dataTable={dataTable}
        // floatingBarContent={
        //   enableFloatingBar ? <TasksTableFloatingBar table={dataTable} /> : null
        // }
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
