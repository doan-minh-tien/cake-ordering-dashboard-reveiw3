import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getBadReports } from "@/features/bad-reports/actions/bad-report-action";
import { BadReportTable } from "@/features/bad-reports/component/bad-report-table/bad-report-table";
import { SearchParams } from "@/types/table";
import React from "react";

export interface BadReportPageProps {
  searchParams: SearchParams;
}

const BadReportPage = ({ searchParams }: BadReportPageProps) => {
  const badReportPromise = getBadReports(searchParams);

  return (
    <div className="min-w-full">
      <Shell>
        <React.Suspense
          fallback={
            <DataTableSkeleton
              columnCount={5}
              searchableColumnCount={1}
              filterableColumnCount={2}
              cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
              shrinkZero
            />
          }
        >
          <div className="mb-4">
            <h1 className="text-2xl font-bold tracking-tight">
              Danh sách báo cáo
            </h1>
            <p className="text-muted-foreground">
              Quản lý và xử lý các báo cáo từ người dùng
            </p>
          </div>
          <FeatureFlagsToggle />
          <BadReportTable badReportPromise={badReportPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default BadReportPage;
