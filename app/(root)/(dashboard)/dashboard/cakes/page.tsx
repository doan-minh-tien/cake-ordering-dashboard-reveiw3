import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getCakes } from "@/features/cakes/actions/cake-action";
import { getCustomCakes } from "@/features/cakes/actions/custome-cake-action";
import { CakeClientWrapper } from "@/features/cakes/components/cake-table/cake-client-wrapper";
import { SearchParams } from "@/types/table";
import React, { Suspense } from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const CakesPage = async ({ searchParams }: IndexPageProps) => {
  const [cakeData, customCakeData] = await Promise.all([
    getCakes(searchParams),
    getCustomCakes(searchParams),
  ]);
  return (
    <Shell>
      <Suspense
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
        <CakeClientWrapper cakeData={cakeData} customCakeData={customCakeData} />
      </Suspense>
    </Shell>
  );
};

export default CakesPage;
