"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserInfo, UserInfo } from "../actions/user-action";

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