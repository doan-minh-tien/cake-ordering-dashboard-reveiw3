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
import { IBadReport } from "../types/bad-report-type";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";

// Action dành cho Bakery
export const getBadReports = async (
  searchParams: SearchParams
): Promise<ApiListResponse<IBadReport>> => {
  noStore();
  const session = await auth();
  const result = await fetchListData<IBadReport>(`/reports`, searchParams);

  if (!result.success) {
    console.error("Failed to fetch list IBadReport:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  return result.data;
};

// Lấy chi tiết báo cáo
export const getBadReportById = async (
  reportId: string
): Promise<ApiSingleResponse<IBadReport>> => {
  noStore();
  const session = await auth();
  const result = await fetchSingleData<IBadReport>(`/reports/${reportId}`);

  if (!result.success) {
    console.error(`Failed to fetch bad report ${reportId}:`, result.error);
    return { data: null, error: result.error };
  }

  return result.data;
};

// Chấp nhận báo cáo
export const approveBadReport = async (
  reportId: string
): Promise<Result<boolean>> => {
  noStore();
  const session = await auth();

  try {
    const result = await apiRequest<boolean>(() =>
      axiosAuth.get(`/reports/${reportId}/approve`)
    );

    if (result.success) {
      // Revalidate the reports list and detail page to reflect the changes
      revalidatePath("/bad-reports");
      revalidatePath(`/bad-reports/${reportId}`);
      return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
  } catch (error) {
    console.error(`Error approving bad report ${reportId}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};
