"use server";

import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { apiRequest } from "@/lib/api/api-handler/generic";
import {
  AdminOverviewType,
  AdminDashboardOverviewType,
  convertToAdminDashboardOverview,
} from "../types/admin-overview-type";
import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import {
  IAdminTotalRevenue,
  IPendingBakeries,
  ITotalCustomers,
  ITotalBakeries,
  DateRangeParams,
} from "@/features/reports/types/admin-report-type";
import { differenceInDays, parseISO, isValid } from "date-fns";

/**
 * Helper function để log dữ liệu với format JSON
 */
function logData(label: string, data: any) {
  try {
    console.log(`${label}:`, JSON.stringify(data, null, 2));
  } catch (error) {
    console.log(`${label}: [Cannot stringify]`, data);
  }
}

/**
 * Lấy dữ liệu tổng quan từ API `/admins/sales-overview`
 */
export async function getSalesOverview(): Promise<AdminOverviewType | null> {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    console.error("No valid session found for admin dashboard");
    return null;
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/admins/sales-overview`)
    );

    if (result.success && result.data.payload) {
      return result.data.payload as AdminOverviewType;
    }

    console.error("Failed to fetch sales overview data");
    return null;
  } catch (error) {
    console.error("Error fetching sales overview data:", error);
    return null;
  }
}

/**
 * Lấy dữ liệu tổng quan đã chuyển đổi sang định dạng hiển thị trên dashboard
 */
export async function getAdminDashboardOverview(): Promise<AdminDashboardOverviewType> {
  const overviewData = await getSalesOverview();

  if (!overviewData) {
    console.log("No overview data found, returning default values");
    // Trả về giá trị mặc định nếu không có dữ liệu
    return {
      totalRevenue: {
        amount: 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      },
      totalBakeries: {
        amount: 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      },
      totalReports: {
        amount: 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      },
      totalCustomers: {
        amount: 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      },
    };
  }

  logData("Converting overview data", overviewData);
  return convertToAdminDashboardOverview(overviewData);
}

/**
 * Lấy tổng doanh thu từ API `/admins/sales-overview`
 */
export async function getAdminTotalRevenue(params: DateRangeParams = {}): Promise<IAdminTotalRevenue> {
  noStore();
  const { dateFrom, dateTo } = params;

  let url = `/admins/total-revenue`;
  if (dateFrom && dateTo) {
    url += `?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchSingleData<IAdminTotalRevenue>(url);

  if (!result.success || !result.data?.data) {
    console.error("Failed to fetch admin total revenue:", result.success ? "Data not found" : "API error");
    return {
      amount: 0,
      change: 0,
      comparisonPeriod: "tháng trước",
    };
  }

  return result.data.data;
}

/**
 * Lấy tổng số khách hàng
 */
export async function getAdminTotalCustomers() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalCustomers || 0,
    change: 0,
    comparisonPeriod: "tháng trước",
  };
}

/**
 * Lấy tổng số cửa hàng
 */
export async function getAdminTotalBakeries() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalBakeries || 0,
    change: 0,
    comparisonPeriod: "tháng trước",
  };
}

/**
 * Lấy tổng số báo cáo chờ duyệt
 */
export async function getAdminTotalReports() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalReports || 0,
    change: 0,
    comparisonPeriod: "tháng trước",
  };
}

/**
 * Lấy tất cả dữ liệu metrics trong một lần gọi API
 */
export async function getAdminDashboardMetrics() {
  noStore();

  const salesData = await getSalesOverview();

  if (!salesData) {
    return {
      totalRevenue: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      totalCustomers: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      totalBakeries: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      totalReports: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
    };
  }

  return {
    totalRevenue: {
      amount: salesData.totalRevenues,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalCustomers: {
      amount: salesData.totalCustomers,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalBakeries: {
      amount: salesData.totalBakeries,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalReports: {
      amount: salesData.totalReports,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
  };
}

/**
 * Lấy số lượng bakery đang chờ duyệt từ API `/bakeries`
 */
export async function getPendingBakeries(): Promise<IPendingBakeries> {
  noStore();

  const result = await fetchSingleData<IPendingBakeries>(`/admins/pending-bakeries`);

  if (!result.success || !result.data?.data) {
    console.error("Failed to fetch pending bakeries:", result.success ? "Data not found" : "API error");
    return {
      amount: 0,
      change: 0,
      comparisonPeriod: "tháng trước",
    };
  }

  return result.data.data;
}

/**
 * Lấy tổng số khách hàng từ API `/admins/sales-overview`
 */
export async function getTotalCustomers(params: DateRangeParams = {}): Promise<ITotalCustomers> {
  noStore();
  const { dateFrom, dateTo } = params;

  let url = `/admins/total-customers`;
  if (dateFrom && dateTo) {
    url += `?dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchSingleData<ITotalCustomers>(url);

  if (!result.success || !result.data?.data) {
    console.error("Failed to fetch total customers:", result.success ? "Data not found" : "API error");
    return {
      amount: 0,
      change: 0,
      comparisonPeriod: "tháng trước",
    };
  }

  return result.data.data;
}

/**
 * Lấy tổng số cửa hàng từ API `/admins/sales-overview`
 */
export async function getTotalBakeries(): Promise<ITotalBakeries> {
  noStore();

  const result = await fetchSingleData<ITotalBakeries>(`/admins/total-bakeries`);

  if (!result.success || !result.data?.data) {
    console.error("Failed to fetch total bakeries:", result.success ? "Data not found" : "API error");
    return {
      amount: 0,
      change: 0,
      comparisonPeriod: "tháng trước",
    };
  }

  return result.data.data;
}

// Define data item structures similar to report-action.ts
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

/**
 * Lấy dữ liệu biểu đồ sales overview cho admin
 */
export async function getSaleOverview(params: {
  type: "REVENUE" | "BAKERIES" | "CUSTOMERS";
  dateFrom?: string;
  dateTo?: string;
}): Promise<ApiListResponse<TimeSeriesDataItem>> {
  noStore();

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

  // Use admin-specific endpoint   // REVENUE, BAKERIES, CUSTOMERS
  let url = `/admins/chart?type=${type}&format=${formatParam}`;
  if (dateFrom && dateTo) {
    url += `&dateFrom=${encodeURIComponent(dateFrom)}&dateTo=${encodeURIComponent(dateTo)}`;
  }

  const result = await fetchListData<any>(url);

  if (!result.success) {
    console.error("Failed to fetch admin sale overview:", "API error");
    return { data: [], pageCount: 0, error: "Failed to fetch data" };
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

  console.log("Admin formatted data (first item):", formattedData.length > 0 ? formattedData[0] : "No data");

  return { 
    data: formattedData, 
    pageCount: result.data.pageCount || 0,
    error: result.data.error 
  };
}



export type OverviewType = {
  totalRevenues: number;
  totalBakeries: number;
  totalReports: number;
  totalCustomers: number;
  totalProducts: number;
};

export async function getOverview(params: DateRangeParams = {}): Promise<ApiSingleResponse<OverviewType>> {
  noStore();

  const session = await auth();
  const { dateFrom, dateTo } = params;
  
  let url = `/admins/sales-overview`;
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
