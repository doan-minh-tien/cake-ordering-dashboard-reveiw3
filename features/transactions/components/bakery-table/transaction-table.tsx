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


import { fetchTransactionTableColumnDefs} from "./transaction-table-column-def";
import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
// import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { TransactionType } from "../../types/transaction-type";
import { getTransactions } from "../../actions/transactions-action";  
interface TransactionTableProps {
  transactionPromise: ReturnType<typeof getTransactions>;
}

export function TransactionTable({ transactionPromise }: TransactionTableProps) {

  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);

  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { data, pageCount } = React.use(transactionPromise);

  // console.log(data)

  // [
  //   {
  //     "wallet_id": "57b68558-cbce-4da6-adc9-8af0277ce110",
  //     "wallet": {
  //       "balance": 281007.08,
  //       "id": "57b68558-cbce-4da6-adc9-8af0277ce110",
  //       "created_at": "2025-04-19T00:33:46.098272",
  //       "created_by": "00000000-0000-0000-0000-000000000000",
  //       "updated_at": "2025-04-22T15:16:55.314906",
  //       "updated_by": "00000000-0000-0000-0000-000000000000",
  //       "is_deleted": false
  //     },
  //     "amount": 12000,
  //     "transaction_type": "ADMIN_HOLD_PAYMENT",
  //     "content": "Hệ thống tạm giữ 12,000đ từ đơn hàng #202504221516412020",
  //     "order_target_id": "1c76d39c-0afe-456f-a734-ca4f2f592903",
  //     "order_target_code": "202504221516412020",
  //     "target_user_id": null,
  //     "target_user_type": null,
  //     "id": "de269ffb-56dc-4c4a-821f-484a5c187045",
  //     "created_at": "2025-04-22T15:16:55.314816",
  //     "created_by": "00000000-0000-0000-0000-000000000000",
  //     "updated_at": null,
  //     "updated_by": null,
  //     "is_deleted": false
  //   },
  
  // ]

  const columns = React.useMemo<ColumnDef<TransactionType, unknown>[]>(
    () => fetchTransactionTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);


console.log(enableFloatingBar)
  

  const searchableColumns: DataTableSearchableColumn<TransactionType>[] = [
    {
      id: "id",
      title: "dịch vụ",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<TransactionType>[] = [
    // {
    //   id: "name",
    //   title: "Trạng thái",
    //   options: Object.entries(ServiceTypeNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // {
    //   id: "id",
    //   title: "Tiến Lọc",
    //   options: Object.entries(ServiceTypeNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // test mode
    // {
    //   id: "status",
    //   title: "Trạng thái xử lý",
    //   options: Object.entries(ProcessStatusNames).map(([value, label]) => ({
    //     label,
    //     value,
    //   })),
    // },
    // test mode
    // {
    //   id: "status",
    //   title: "Trạng thái đơn",
    //   options: Object.entries(OrderStatusMap).reduce((acc, [value, label]) => {
    //     if (typeof label === "string") {
    //       acc.push({ label, value });
    //     }
    //     return acc;
    //   }, [] as Option[]),
    // },
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
