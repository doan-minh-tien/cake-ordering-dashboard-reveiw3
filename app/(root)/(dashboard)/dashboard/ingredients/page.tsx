import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getCakeDecorations } from "@/features/ingredients/actions/cake-decoration-action";
import { getCakeMessageOptions } from "@/features/ingredients/actions/cake-message-option-action";
import { getCakeExtraOptions } from "@/features/ingredients/actions/cake-extra-option-action";
import { SearchParams } from "@/types/table";
import React, { Suspense } from "react";
import { getCakeParts } from "@/features/ingredients/actions/cake-part-action";
import { IngredientsClientWrapper } from "@/features/ingredients/components/ingredient-table/ingredient-client-wrapper";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const IngredientsPage = async ({ searchParams }: IndexPageProps) => {
  const [cakeDecorations, cakeMessageOptions, cakeExtraOptions, cakeParts] =
    await Promise.all([
      getCakeDecorations(searchParams),
      getCakeMessageOptions(searchParams),
      getCakeExtraOptions(searchParams),
      getCakeParts(searchParams),
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
        <IngredientsClientWrapper  
          cakeDecorations={cakeDecorations}
          cakeMessageOptions={cakeMessageOptions}
          cakeExtraOptions={cakeExtraOptions}
          cakeParts={cakeParts}
        />
      </Suspense>
    </Shell>
  );
};

export default IngredientsPage;
