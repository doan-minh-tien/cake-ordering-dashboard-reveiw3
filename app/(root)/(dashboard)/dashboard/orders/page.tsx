import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getCakes } from "@/features/cakes/actions/cake-action";
import { getOrders } from "@/features/orders/actions/order-action";
import { SearchParams } from "@/types/table";
import React, { Suspense } from "react";
import { OrderTable } from "@/features/orders/components/order-table/order-table";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const OrdersPage =  ({ searchParams }: IndexPageProps) => {


    const orderData = getOrders(searchParams);

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
        <OrderTable orderPromise={orderData} />
      </Suspense>
    </Shell>
  );
};

export default OrdersPage;
