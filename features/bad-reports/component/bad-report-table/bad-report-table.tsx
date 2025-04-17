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
import { IBadReport } from "../../types/bad-report-type";
import { fetchBadReportTableColumnDefs } from "./bad-report-column-def";
import { getBadReports } from "../../actions/bad-report-action";

interface BadReportTableProps {
  badReportPromise: ReturnType<typeof getBadReports>;
}

export function BadReportTable({ badReportPromise }: BadReportTableProps) {
  const featureFlags = useFeatureFlagsStore((state) => state.featureFlags);
  const enableFloatingBar = featureFlags.includes("floatingBar");

  const { data, pageCount } = React.use(badReportPromise);

  const columns = React.useMemo<ColumnDef<IBadReport, unknown>[]>(
    () => fetchBadReportTableColumnDefs(),
    []
  );
  const labels = generateColumnLabels(columns);

  const searchableColumns: DataTableSearchableColumn<IBadReport>[] = [
    {
      id: "id",
      title: "ID báo cáo",
    },
    {
      id: "content",
      title: "Nội dung báo cáo",
    },
    {
      id: "customer_id",
      title: "Tên khách hàng",
    },
  ];

  const filterableColumns: DataTableFilterableColumn<IBadReport>[] = [
    {
      id: "type",
      title: "Loại báo cáo",
      options: [
        { label: "Báo cáo tiệm bánh", value: "BAKERY_REPORT" },
        { label: "Báo cáo đơn hàng", value: "ORDER_REPORT" },
      ],
    },
    {
      id: "status",
      title: "Trạng thái",
      options: [
        { label: "Đang chờ xử lý", value: "PENDING" },
        { label: "Đang xử lý", value: "PROCESSING" },
        { label: "Đã xử lý", value: "RESOLVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
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
        columns={columns}
        searchableColumns={searchableColumns}
        filterableColumns={filterableColumns}
        columnLabels={labels}
      />
    </div>
  );
}
