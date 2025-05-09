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

import { fetchCakeTableColumnDefs } from "./cake-table-column-def";
import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
// import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { getCakes } from "../../../actions/cake-action";
import { ICake } from "../../../types/cake";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
interface CakeTableProps {
  data: ApiListResponse<ICake>;
}

export function CakeTable({ data }: CakeTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);

  const enableFloatingBar = featureFlags.includes("floatingBar");
  const { data: cakeData, pageCount } = data;

  const columns = React.useMemo<ColumnDef<ICake, unknown>[]>(
    () => fetchCakeTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  console.log(enableFloatingBar);

  const searchableColumns: DataTableSearchableColumn<ICake>[] = [
    {
      id: "available_cake_name",
      title: "Tên bánh",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<ICake>[] = [
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
    data: cakeData,
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
        newRowLink="/dashboard/cakes/create-cake"
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
