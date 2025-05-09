import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getPromotions } from "@/features/promotions/action/promotion-action";
import { PromotionsTable } from "@/features/promotions/components/promotion-table/promotion-table";
import { SearchParams } from "@/types/table";
import React from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}
const PromotionsPage = ({ searchParams }: IndexPageProps) => {
  const promotionPromise = getPromotions(searchParams);

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

          <PromotionsTable promotionPromise={promotionPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default PromotionsPage;
