"use server";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { apiRequest, fetchSingleData } from "@/lib/api/api-handler/generic";

// Định nghĩa kiểu dữ liệu cho response của API sales overview
export interface SalesOverviewData {
  totalRevenues: number;
  totalBakeries: number;
  totalReports: number;
  totalCustomers: number;
  totalProducts: number;
}

// Định nghĩa kiểu dữ liệu cho metric hiển thị
export interface MetricData {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

/**
 * Lấy dữ liệu tổng quan từ API `/admins/sales-overview`
 */
export async function getSalesOverview() {
  noStore();

  const session = await auth();

  if (!session?.user?.id) {
    console.error("No valid session found for admin dashboard metrics");
    return null;
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/admins/sales-overview`)
    );

    if (result.success && result.data.payload) {
      return result.data.payload as SalesOverviewData;
    }

    console.error("Failed to fetch sales overview data");
    return null;
  } catch (error) {
    console.error("Error fetching sales overview data:", error);
    return null;
  }
}

/**
 * Lấy dữ liệu tổng doanh thu
 */
export async function getAdminTotalRevenue() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalRevenues || 0,
    change: 0, // API hiện không trả về phần trăm thay đổi
    comparisonPeriod: "tháng trước",
  };
}

/**
 * Lấy số lượng khách hàng
 */
export async function getAdminCustomerCount() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalCustomers || 0,
    change: 0, // API hiện không trả về phần trăm thay đổi
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
    change: 0, // API hiện không trả về phần trăm thay đổi
    comparisonPeriod: "tháng trước",
  };
}

/**
 * Lấy số lượng báo cáo đang chờ duyệt
 */
export async function getAdminPendingBakeries() {
  noStore();

  const salesData = await getSalesOverview();

  return {
    amount: salesData?.totalReports || 0,
    change: 0, // API hiện không trả về phần trăm thay đổi
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
      customers: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      totalBakeries: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      pendingBakeries: {
        amount: 0,
        change: 0,
        comparisonPeriod: "tháng trước",
      },
    };
  }

  return {
    totalRevenue: {
      amount: salesData.totalRevenues,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    customers: {
      amount: salesData.totalCustomers,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalBakeries: {
      amount: salesData.totalBakeries,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    pendingBakeries: {
      amount: salesData.totalReports,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
  };
}
