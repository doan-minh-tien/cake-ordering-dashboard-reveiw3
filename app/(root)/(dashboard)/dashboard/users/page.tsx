import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { FeatureFlagsToggle } from "@/components/data-table/custom-table/featureflag-toogle";
import { Shell } from "@/components/shared/custom-ui/shell";
import { getUsers } from "@/features/users/actions/users-action";
import { UsersTable } from "@/features/users/components/user-table/user-table";
import { SearchParams } from "@/types/table";
import React from "react";

export interface IndexPageProps {
  searchParams: SearchParams;
}

const UserPage = ({ searchParams }: IndexPageProps) => {
  // Call
  const usersPromise = getUsers(searchParams);

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
          <UsersTable usersPromise={usersPromise} />
        </React.Suspense>
      </Shell>
    </div>
  );
};

export default UserPage;
