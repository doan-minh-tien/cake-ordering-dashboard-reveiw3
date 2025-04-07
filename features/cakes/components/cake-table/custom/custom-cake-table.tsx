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

import { useFeatureFlagsStore } from "@/hooks/use-feature-flag";
// import { TasksTableFloatingBar } from "@/components/data-table/custom-table/data-table-floating-bar";
import { ApiListResponse } from "@/lib/api/api-handler/generic";
import { ICustomCake } from "../../../types/custome-cake";
import { fetchCustomCakeTableColumnDefs } from "./custome-cake-column-def";

// Extended type with ingredients count property
type CustomCakeWithIngredients = ICustomCake & { ingredients: number };

interface CakeTableProps {
  data: ApiListResponse<ICustomCake>;
}

export function CustomCakeTable({ data }: CakeTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);
  const enableFloatingBar = featureFlags.includes("floatingBar");
  const { data: cakeData, pageCount } = data;

  const columns = React.useMemo<ColumnDef<ICustomCake, unknown>[]>(
    () => fetchCustomCakeTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  // Create price ranges for filtering
  const priceRanges: Option[] = [
    { label: "Dưới 100,000 VNĐ", value: "0-100000" },
    { label: "100,000 - 300,000 VNĐ", value: "100000-300000" },
    { label: "300,000 - 500,000 VNĐ", value: "300000-500000" },
    { label: "Trên 500,000 VNĐ", value: "500000-9999999999" },
  ];

  // Create ingredient count ranges for filtering
  const ingredientCountRanges: Option[] = [
    { label: "Ít (1-5 thành phần)", value: "1-5" },
    { label: "Trung bình (6-10 thành phần)", value: "6-10" },
    { label: "Nhiều (11-15 thành phần)", value: "11-15" },
    { label: "Rất nhiều (>15 thành phần)", value: "16-100" },
  ];

  const searchableColumns: DataTableSearchableColumn<ICustomCake>[] = [
    {
      id: "custom_cake_name",
      title: "Tên bánh",
    },
    {
      id: "customer" as keyof ICustomCake,
      title: "Tên khách hàng",
    },
    {
      id: "bakery" as keyof ICustomCake,
      title: "Tên tiệm bánh",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<ICustomCake>[] = [
    {
      id: "total_price",
      title: "Giá",
      options: priceRanges,
    },
    {
      // Using string literal since 'ingredients' will be added to the objects
      id: "ingredients" as any,
      title: "Số thành phần",
      options: ingredientCountRanges,
    },
  ];

  // Extend data with ingredient counts for filtering
  const extendedData = React.useMemo(() => {
    return cakeData.map((cake) => ({
      ...cake,
      ingredients:
        cake.part_selections.length +
        cake.extra_selections.length +
        cake.decoration_selections.length,
    }));
  }, [cakeData]);

  const { dataTable } = useDataTable({
    // Cast the extended data to be compatible with the columns
    data: extendedData as ICustomCake[],
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
