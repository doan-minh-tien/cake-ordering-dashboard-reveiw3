

"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import { ApiListResponse, fetchListData } from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { ICakeMessageOptionType } from "../types/cake-message-option-type";

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
