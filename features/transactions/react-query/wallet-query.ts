"use client";

import { useQuery } from "@tanstack/react-query";
import { auth } from "@/lib/next-auth/auth";
import { apiRequest } from "@/lib/api/api-handler/generic";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

interface WalletData {
  balance: number;
  id: string;
  created_at: string;
  updated_at: string;
}

interface TransactionResponse {
  data: {
    wallet_id: string;
    auth: {
      balance: number;
      id: string;
      created_at: string;
      updated_at: string;
    };
  }[];
}

async function fetchWalletBalance(): Promise<WalletData> {
  const session = await auth();
  if (!session?.user?.wallet_id) {
    throw new Error("No wallet ID found in session");
  }

  const response = await apiRequest<TransactionResponse>(() =>
    axiosAuth.get(`/wallets/${session.user.wallet_id}/transactions?limit=1`)
  );

  if (!response.success) {
    throw new Error("Failed to fetch wallet balance");
  }

  if (!response.data?.data?.[0]?.auth) {
    throw new Error("No wallet data found");
  }

  return {
    balance: response.data.data[0].auth.balance,
    id: response.data.data[0].auth.id,
    created_at: response.data.data[0].auth.created_at,
    updated_at: response.data.data[0].auth.updated_at,
  };
}

export function useWalletBalance() {
  return useQuery({
    queryKey: ["walletBalance"],
    queryFn: fetchWalletBalance,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: true,
  });
}
