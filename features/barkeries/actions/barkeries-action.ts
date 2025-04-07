"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData, ApiSingleResponse,fetchSingleData, apiRequest, Result } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { IBarkery } from "../types/barkeries-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getBakeries = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IBarkery>> => {
  noStore();

  const result = await fetchListData<IBarkery>("/bakeries", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IBarkery:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};


export async function getBakery(
  params: string
): Promise<ApiSingleResponse<IBarkery>> {
  noStore();

  const result = await fetchSingleData<IBarkery>(
    `/bakeries/${params}`
  );
  if (!result.success) {
    console.error("Failed to fetch bakery by ID:", result.error);
    return { data: null };
  }
  return result.data;
}



export async function approveBakery(
  params: string
): Promise<Result<void>> {
  noStore();

  console.log(params);
  const result = await apiRequest(() =>
    axiosAuth.get(`/bakeries/${params}/approve`)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/bakeries/${params}`);

  return { success: true, data: undefined };
}
