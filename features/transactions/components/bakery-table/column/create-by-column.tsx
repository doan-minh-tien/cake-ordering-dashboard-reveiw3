"use client";

import { TransactionType } from "@/features/transactions/types/transaction-type";
import { Row, type Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserInfo } from "@/features/transactions/react-query/user-query";

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

export const createByColumn = {
  accessorKey: "created_by",
  header: ({ column }: { column: Column<any, unknown> }) => (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="-ml-3 h-8 font-bold text-base"
    >
      Giao dịch bởi
      <CaretSortIcon className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }: { row: Row<TransactionType> }) => {
    const userId = row.getValue("created_by") as string;
    return <UserCell userId={userId} />;
  },
  enableSorting: true,
  enableHiding: false,
} as const;

export default createByColumn;
