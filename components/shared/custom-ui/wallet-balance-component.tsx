"use client";

import { useWalletBalance } from "@/features/transactions/react-query/wallet-query";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function WalletBalanceComponent() {
  const { data: walletData, isLoading, error } = useWalletBalance();

  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined) return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground mr-1">
          Số dư:
        </span>
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  if (error || !walletData) {
    return (
      <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-md">
        <Wallet className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Số dư: N/A
        </span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-md cursor-pointer hover:bg-primary/20 transition-colors">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              Số dư: {formatCurrency(walletData.balance)}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Số dư ví hiện tại</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
