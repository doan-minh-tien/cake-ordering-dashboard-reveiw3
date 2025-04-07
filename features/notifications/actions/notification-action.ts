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
import { INotification } from "../types/notification-type";
import { auth } from "@/lib/next-auth/auth";

export const getNotifications = async (
  searchParams?: SearchParams
): Promise<ApiListResponse<INotification>> => {
  noStore();
  console.log("getNotifications", searchParams);
  const session = await auth();

  const result = await fetchListData<INotification>(
    `/bakeries/${session?.user.entity.id}/notifications`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list INotification:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};
