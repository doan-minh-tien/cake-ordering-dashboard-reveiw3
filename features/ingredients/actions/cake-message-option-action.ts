/**
 * @file cake-message-option-action.ts
 * @description This file contains the actions related to cake message options.
 */

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData, Result, apiRequest } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeMessageOptionType } from "../types/cake-message-option-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";

export const getCakeMessageOptions = async (
  searchParams: SearchParams
): Promise<ApiListResponse<ICakeMessageOptionType>> => {
  noStore();

  const result = await fetchListData<ICakeMessageOptionType>("/message_options", searchParams);

  if (!result.success) {
    console.error("Failed to fetch list ICakeMessageOptionType:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};


export const updateCakeMessage = async (
  data: any,
  id: string
): Promise<Result<void>> => {
  noStore();
  const result = await apiRequest(() =>
    axiosAuth.put(`/message_options/${id}`, data,{
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  );

  if (!result.success) {
    return { success: false, error: result.error };
  }

  revalidatePath("/dashboard/ingredients");

  return { success: true, data: result.data };
};
