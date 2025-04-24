"use server";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { apiRequest } from "@/lib/api/api-handler/generic";
import {
  AdminOverviewType,
  AdminDashboardOverviewType,
  convertToAdminDashboardOverview,
} from "../types/admin-overview-type";

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
export async function getAdminTotalRevenue() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/admins/sales-overview`)
    );

    if (result.success && result.data.payload) {
      return {
        amount: result.data.payload.totalRevenues || 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      };
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
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
export async function getPendingBakeries() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/bakeries?status=PENDING`)
    );

    if (result.success && result.data.payload) {
      return {
        amount: result.data.payload.length || 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      };
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching pending bakeries:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}

/**
 * Lấy tổng số khách hàng từ API `/admins/sales-overview`
 */
export async function getTotalCustomers() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/admins/sales-overview`)
    );

    if (result.success && result.data.payload) {
      return {
        amount: result.data.payload.totalCustomers || 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      };
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}

/**
 * Lấy tổng số cửa hàng từ API `/admins/sales-overview`
 */
export async function getTotalBakeries() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/admins/sales-overview`)
    );

    if (result.success && result.data.payload) {
      return {
        amount: result.data.payload.totalBakeries || 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      };
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching total bakeries:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}
