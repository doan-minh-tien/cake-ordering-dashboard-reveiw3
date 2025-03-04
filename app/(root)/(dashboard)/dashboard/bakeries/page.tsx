import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getBakeries } from "@/features/barkeries/actions/barkeries-action";
import { BakeriesTable } from "@/features/barkeries/components/bakery-table/bakery-table";
import { SearchParams } from "@/types/table";
import React from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}
const BarkeriesPage = ({ searchParams }: IndexPageProps) => {
  const bakeryPromise = getBakeries(searchParams);

  return (
    <div className="min-w-full ">
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
          <FeatureFlagsToggle />

          <BakeriesTable bakeryPromise={bakeryPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default BarkeriesPage;
