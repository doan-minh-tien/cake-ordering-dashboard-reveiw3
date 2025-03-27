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

export const getCakeDecorations = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeDecorationType>> => {
  noStore();

  const result = await fetchListData<ICakeDecorationType>(
    "/decoration_options",
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
