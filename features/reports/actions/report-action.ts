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
import { differenceInDays, parseISO, isValid } from "date-fns";

interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}

export async function getProductPerformance(params: DateRangeParams = {}): Promise<
  ApiSingleResponse<IProductPerformanceType>
> {
  noStore();

  const session = await auth();
  const { dateFrom, dateTo } = params;
  
  let url = `/bakeries/${session?.user.entity.id}/products_performance`;
  if (dateFrom && dateTo) {
    url += `?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchSingleData<IProductPerformanceType>(url);
  if (!result.success) {
    console.error("Failed to fetch product performance:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getCategoryDistribution(params: DateRangeParams = {}): Promise<
  ApiSingleResponse<ICategoryDistributionType>
> {
  noStore();

  const session = await auth();
  const { dateFrom, dateTo } = params;
  
  let url = `/bakeries/${session?.user.entity.id}/category_distribution`;
  if (dateFrom && dateTo) {
    url += `?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchSingleData<ICategoryDistributionType>(url);

  if (!result.success) {
    console.error("Failed to fetch category distribution:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getOverview(params: DateRangeParams = {}): Promise<ApiSingleResponse<OverviewType>> {
  noStore();

  const session = await auth();
  const { dateFrom, dateTo } = params;
  
  let url = `/bakeries/${session?.user.entity.id}/overview`;
  if (dateFrom && dateTo) {
    url += `?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchSingleData<OverviewType>(url);

  if (!result.success) {
    console.error("Failed to fetch overview:", result.error);
    return { data: null };
  }
  return result.data;
}

// Define data item structures
interface DailyDataItem {
  date: string;
  value: number;
}

interface MonthlyDataItem {
  month: string;
  value: number;
}

// Union type for both formats
type TimeSeriesDataItem = DailyDataItem | MonthlyDataItem;

export async function getSaleOverview(params: {
  type: "REVENUE" | "ORDERS" | "CUSTOMERS";
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiListResponse<TimeSeriesDataItem>> {
  noStore();

  const session = await auth();
  const { type = "REVENUE", dateFrom, dateTo } = params;

  // Determine if we should use daily or monthly format based on date range
  let useMonthlyFormat = false;
  let formatParam = "daily";
  
  if (dateFrom && dateTo) {
    try {
      const fromDate = parseISO(dateFrom);
      const toDate = parseISO(dateTo);
      
      if (isValid(fromDate) && isValid(toDate)) {
        const daysDiff = differenceInDays(toDate, fromDate);
        
        // If date range is more than 31 days, use monthly format
        if (daysDiff > 31) {
          useMonthlyFormat = true;
          formatParam = "monthly";
        }
      }
    } catch (error) {
      console.error("Error parsing dates:", error);
    }
  }

  let url = `/bakeries/${session?.user.entity.id}/sales_overview?type=${type}&format=${formatParam}`;
  if (dateFrom && dateTo) {
    url += `&dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchListData<any>(url);

  if (!result.success) {
    console.error("Failed to fetch sale overview:", result.error);
    return { data: [], pageCount: 0, error: result.error };
  }

  // Process the API response
  let formattedData: TimeSeriesDataItem[] = [];
  
  // Check the format of the API response
  if (Array.isArray(result.data.data)) {
    if (result.data.data.length > 0) {
      // Determine the data format from the first item
      const firstItem = result.data.data[0];
      
      if (typeof firstItem === 'object') {
        if ('date' in firstItem) {
          // Data is already in daily format
          formattedData = result.data.data as DailyDataItem[];
        } else if ('month' in firstItem) {
          // Data is already in monthly format
          formattedData = result.data.data as MonthlyDataItem[];
        } else {
          // Unknown object format, use empty array
          formattedData = [];
        }
      } else if (typeof firstItem === 'number') {
        // Legacy format (array of numbers)
        const currentYear = new Date().getFullYear();
        formattedData = result.data.data.map((value: number, index: number) => {
          // Create a date for the first day of each month
          const month = (index + 1).toString().padStart(2, '0');
          return {
            month: `${currentYear}-${month}`,
            value: value
          } as MonthlyDataItem;
        });
      }
    }
  }

  console.log("Formatted data (first item):", formattedData.length > 0 ? formattedData[0] : "No data");

  return { 
    data: formattedData, 
    pageCount: result.data.pageCount || 0,
    error: result.data.error 
  };
}
