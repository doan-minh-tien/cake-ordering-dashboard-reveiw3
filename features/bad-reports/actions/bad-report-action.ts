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
import { IBadReport } from "../types/bad-report";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

export const getBadReports = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IBadReport>> => {
  noStore();
  const session = await auth();
  const result = await fetchListData<IBadReport>(
    `/bakeries/${session?.user.entity.id}/reports`,
    searchParams
  );

  if (!result.success) {
    console.error("Failed to fetch list IBadReport:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

