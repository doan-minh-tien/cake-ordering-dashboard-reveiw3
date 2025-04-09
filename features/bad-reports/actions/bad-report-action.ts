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
import {
  IBadReport,
  IAdminBadReportsResponse,
  IBadReportStatistics,
  IUpdateBadReportStatusParams,
  IRespondToBadReportParams,
  IAssignBadReportParams,
  IUpdateBadReportPriorityParams,
} from "../types/bad-report-type";
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
