"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  apiRequest,
  fetchListData,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeDecorationType } from "../types/cake-decoration-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

export const getCakeDecorations = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeDecorationType>> => {
  noStore();
  const session = await auth();

  const result = await fetchListData<ICakeDecorationType>(
    `/decoration_options?bakeryId=${session?.user.entity.id}`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeDecorationType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export const updateCakeDecoration = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.put(`/decoration_options/${id}`, data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");

  return { success: true, data: result.data };
};
