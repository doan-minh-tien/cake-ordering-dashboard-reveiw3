"use client";

import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo, useBakeryInfo, shouldShowBakery } from "@/features/transactions/react-query/user-query";

function UserCell({ userId }: { userId: string }) {
  const { data: user, isLoading, isError } = useUserInfo(userId);
  
  const initials = isLoading ? "..." : 
    (user?.name || "Unknown")
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={`https://avatar.vercel.sh/${userId}.png`} 
          alt={user?.name || "User"} 
        />
        <AvatarFallback className={isLoading ? "animate-pulse" : ""}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </>
        ) : (
          <>
            <span className="font-medium">
              {user?.name || "Unknown User"}
            </span>
            {user?.email && (
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                {user.email}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BakeryCell({ bakeryId }: { bakeryId: string }) {
  const { data: bakery, isLoading, isError } = useBakeryInfo(bakeryId);

  const initials = isLoading ? "..." : 
    (bakery?.bakery_name || "Unknown")
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage 
          src={`https://avatar.vercel.sh/${bakeryId}.png`} 
          alt={bakery?.bakery_name || "Bakery"} 
        />
        <AvatarFallback className={isLoading ? "animate-pulse" : ""}>
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-20 mb-1" />
            <Skeleton className="h-3 w-24" />
          </>
        ) : (
          <>
            <span className="font-medium">
              {bakery?.bakery_name || "Unknown Bakery"}
            </span>
            {bakery?.address && (
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                {bakery.address}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EntityCell({ entityId, type }: { entityId: string, type: string }) {
  // For admin hold payment, both sender and receiver are system
  if (type === "ADMIN_HOLD_PAYMENT" && entityId === "00000000-0000-0000-0000-000000000000") {
    return <UserCell userId={entityId} />;
  }

  // Determine if we should show bakery based on transaction type
  const isBakery = shouldShowBakery(type);

  return isBakery ? 
    <BakeryCell bakeryId={entityId} /> : 
    <UserCell userId={entityId} />;
}

export const targetColumn = {
  accessorKey: "target_user_id",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Bên nhận
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const targetUserId = row.getValue("target_user_id") as string;
    const createdBy = row.getValue("created_by") as string;
    const type = row.original.transaction_type;
    
    // Use target_user_id if available, otherwise fall back to created_by
    // For ADMIN_HOLD_PAYMENT, always use the system ID
    const entityId = type === "ADMIN_HOLD_PAYMENT" 
      ? "00000000-0000-0000-0000-000000000000" 
      : (targetUserId || createdBy);
    
    return <EntityCell entityId={entityId} type={type} />;
  },
  enableSorting: true,
  enableHiding: false,
  filterFn: (
    row: Row<TransactionType>,
    columnId: string,
    filterValue: TransactionType[]
  ) => {
    return filterValue.includes(row.getValue(columnId));
  },
} as const;

export default targetColumn;
