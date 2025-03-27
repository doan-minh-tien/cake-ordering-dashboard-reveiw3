"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  apiRequest,
  ApiListResponse,
  fetchListData,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeExtraOptionType } from "../types/cake-extra-option-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getCakeExtraOptions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeExtraOptionType>> => {
  noStore();

  const result = await fetchListData<ICakeExtraOptionType>(
    "/extra_options",
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list ICakeExtraOptionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

export const updateCakeExtraOption = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();

  const result = await apiRequest(() =>
    axiosAuth.put(`/extra_options/${id}`, data)
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/ingredients");

  return { success: true, data: result.data };
};
