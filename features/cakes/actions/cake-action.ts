

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData, ApiSingleResponse,fetchSingleData, apiRequest, Result } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICake } from "../types/cake";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

export const getCakes = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICake>> => {
  noStore();

  const session = await auth();
  const result = await fetchListData<ICake>(`/available_cakes?bakeryId=${session?.user.entity.id}`, searchParams);

  if (!result.success) {
    console.error("Failed to fetch list ICake:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};



export async function getCake(
  params: string
): Promise<ApiSingleResponse<ICake>> {
  noStore();

  const result = await fetchSingleData<ICake>(
    `/available_cakes/${params}`
  );
  if (!result.success) {
    console.error("Failed to fetch cake by ID:", result.error);
    return { data: null };
  }
  return result.data;
}


export async function updateCake(
  data: any,
  params: string
): Promise<Result<void>> {
  noStore();

  console.log(data);
  console.log(params)
  const result = await apiRequest(() =>
    axiosAuth.put(`/available_cakes/${params}`, data)
  );
  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath(`/dashboard/cakes/${params}`);

  return { success: true, data: undefined };
}
