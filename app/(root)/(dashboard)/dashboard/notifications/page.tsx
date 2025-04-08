import { Suspense } from "react";
import { Shell } from "@/components/shared/custom-ui/shell";
import { Metadata } from "next";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import NotificationsList from "./components/NotificationsList";

export const metadata: Metadata = {
  title: "Thông báo | Cake Dashboard",
  description: "Xem tất cả thông báo của bạn",
};

export interface IndexPageProps {
  searchParams: Record<string, string>;
}

const NotificationsPage = async ({ searchParams }: IndexPageProps) => {
  return (
    <Shell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">Thông báo</h1>
          <p className="text-sm text-gray-500">
            Xem và quản lý tất cả thông báo của bạn
          </p>
        </div>

        <Suspense
          fallback={
            <DataTableSkeleton
              columnCount={3}
              searchableColumnCount={1}
              filterableColumnCount={1}
              cellWidths={["10rem", "40rem", "12rem"]}
              shrinkZero
            />
          }
        >
          <NotificationsList />
        </Suspense>
      </div>
    </Shell>
  );
};

export default NotificationsPage;
