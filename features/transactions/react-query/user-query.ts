"use client";

import { useQuery } from "@tanstack/react-query";
import { getBakeryInfo, getUserInfo, UserInfo } from "../actions/user-action";
import { IBakery } from "@/features/cakes/types/cake";

/**
 * Determines if the transaction should show bakery or customer info
 */
export function shouldShowBakery(transactionType: string): boolean {
  const bakeryTransactionTypes = [
    "ADMIN_TRANSFER_TO_BAKERY",
    "BAKERY_RECEIVE_PAYMENT"
  ];
  
  return bakeryTransactionTypes.includes(transactionType);
}

/**
 * Custom hook for fetching user information with React Query
 */
export function useUserInfo(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async (): Promise<UserInfo | null> => {
      if (!userId || userId === "00000000-0000-0000-0000-000000000000") {
        return {
          id: "00000000-0000-0000-0000-000000000000",
          name: "System",
          email: "system@example.com",
          phone: "",
          address: "",
          created_at: "",
          updated_at: "",
          is_deleted: false
        };
      }

      const result = await getUserInfo(userId);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
} 

export function useBakeryInfo(bakeryId: string) {
  return useQuery({
    queryKey: ["bakery", bakeryId],
    queryFn: async (): Promise<IBakery | null> => {
        if (!bakeryId || bakeryId === "00000000-0000-0000-0000-000000000000") {
            return null;
        }
        const result = await getBakeryInfo(bakeryId);
        return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}