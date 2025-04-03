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
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";
import { ICake } from "@/features/cakes/types/cake";
import {
  ICategoryDistributionType,
  IProductPerformanceType,
  OverviewType,
} from "../types/overview-type";

export async function getProductPerformance(): Promise<
  ApiSingleResponse<IProductPerformanceType>
> {
  noStore();

  const session = await auth();

  const result = await fetchSingleData<IProductPerformanceType>(
    `/bakeries/${session?.user.entity.id}/products_performance`
  );
  if (!result.success) {
    console.error("Failed to fetch product performance:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getCategoryDistribution(): Promise<
  ApiSingleResponse<ICategoryDistributionType>
> {
  noStore();

  const session = await auth();

  const result = await fetchSingleData<ICategoryDistributionType>(
    `/bakeries/${session?.user.entity.id}/category_distribution`
  );

  if (!result.success) {
    console.error("Failed to fetch category distribution:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getOverview(): Promise<ApiSingleResponse<OverviewType>> {
  noStore();

  const session = await auth();

  const result = await fetchSingleData<OverviewType>(
    `/bakeries/${session?.user.entity.id}/overview`
  );

  if (!result.success) {
    console.error("Failed to fetch overview:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getSaleOverview(params: {
  type: "REVENUE" | "ORDERS" | "CUSTOMERS";
  year: number;
}): Promise<ApiListResponse<number>> {
  noStore();

  const session = await auth();

  const { type = "REVENUE", year = 2025 } = params;

  const result = await fetchListData<number>(
    `/bakeries/${session?.user.entity.id}/sales_overview?type=${type}&year=${year}`
  );

  if (!result.success) {
    console.error("Failed to fetch sale overview:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }
  return result.data;
}
