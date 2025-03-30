"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
  apiRequest,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { IPromotion } from "../types/promotion";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

export const getPromotions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IPromotion>> => {
  noStore();

  const session = await auth();
  const result = await fetchListData<IPromotion>(
    `/vouchers?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list IPromotion:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export async function getPromotion(
  params: string
): Promise<ApiSingleResponse<IPromotion>> {
  noStore();

  const result = await fetchSingleData<IPromotion>(`/vouchers/${params}`);
  if (!result.success) {
    console.error("Failed to fetch voucher by ID:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function updatePromotion(
  data: any,
  params: string
): Promise<Result<void>> {
  noStore();

  console.log(data);
  console.log(params);
  const result = await apiRequest(() =>
    axiosAuth.put(`/vouchers/${params}`, data)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/promotions/${params}`);

  return { success: true, data: undefined };
}
