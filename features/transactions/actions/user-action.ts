"use server";

import {
  ApiSingleResponse,
  fetchSingleData,
} from "@/lib/api/api-handler/generic";
import { unstable_noStore as noStore } from "next/cache";

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export async function getUserInfo(
  userId: string
): Promise<ApiSingleResponse<UserInfo>> {
  noStore();
  const result = await fetchSingleData<UserInfo>(`/customers/${userId}`);
  if (!result.success) {
    console.error("Failed to fetch user info:", result.error);
    return {
      data: null,
    };
  }
  return result.data;
}
