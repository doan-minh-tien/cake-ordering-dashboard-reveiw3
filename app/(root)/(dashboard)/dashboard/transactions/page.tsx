import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getTransactions } from "@/features/transactions/actions/transactions-action";
import { TransactionTable } from "@/features/transactions/components/bakery-table/transaction-table";
import { SearchParams } from "@/types/table";
import React from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}
const TransactionsPage = ({ searchParams }: IndexPageProps) => {
  const transactionPromise = getTransactions(searchParams);

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
          <TransactionTable transactionPromise={transactionPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default TransactionsPage;
