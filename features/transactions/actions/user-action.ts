"use server";

import { IBakery } from "@/features/cakes/types/cake";
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


export async function getBakeryInfo(
  bakeryId: string
): Promise<ApiSingleResponse<IBakery>> {
  noStore();
  const result = await fetchSingleData<IBakery>(`/bakeries/${bakeryId}`);
  if (!result.success) {
    console.error("Failed to fetch bakery info:", result.error);
    return {
      data: null,
    };
  }
  return result.data;
}
