"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData, ApiSingleResponse,fetchSingleData, apiRequest } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { IOrder } from "../types/order-type";
import { auth } from "@/lib/next-auth/auth";

export const getOrders = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IOrder>> => {
  noStore();

  const session = await auth();

  const result = await fetchListData<IOrder>(`/bakeries/${session?.user.entity.id}/orders`, searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IOrder:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};


export async function getOrder(
  params: string
): Promise<ApiSingleResponse<IOrder>> {
  noStore();

  const result = await fetchSingleData<IOrder>(
    `/orders/${params}`
  );
  if (!result.success) {
    console.error("Failed to fetch order by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

