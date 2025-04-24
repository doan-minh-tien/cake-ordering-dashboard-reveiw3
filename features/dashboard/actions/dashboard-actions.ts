"use server";

import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/lib/next-auth/auth";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { apiRequest, fetchSingleData } from "@/lib/api/api-handler/generic";

// Types for dashboard metrics
export interface DashboardMetrics {
  totalRevenue: MetricData;
  customers: MetricData;
  orders: MetricData;
  averageOrder: MetricData;
}

interface MetricData {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

/**
 * Fetches main dashboard metrics (Total Revenue and Customer count)
 */
export async function getDashboardMetrics() {
  noStore();

  // Get user session
  const session = await auth();

  // Validate session
  if (!session?.user?.entity?.id) {
    console.error("No valid session found for dashboard metrics");
    return {
      totalRevenue: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      customers: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      orders: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      averageOrder: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
    };
  }

  try {
    // Make API request to get dashboard metrics
    const result = await fetchSingleData<DashboardMetrics>(
      `/bakeries/${session.user.entity.id}/metrics/dashboard`
    );

    if (!result.success) {
      console.error("Failed to fetch dashboard metrics:", result.error);
      return {
        totalRevenue: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
        customers: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
        orders: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
        averageOrder: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      };
    }

    return result.data.data;
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    return {
      totalRevenue: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      customers: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      orders: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
      averageOrder: { amount: 0, change: 0, comparisonPeriod: "tháng trước" },
    };
  }
}

/**
 * Alternative implementation to fetch individual dashboard metrics
 * when separate API endpoints are available
 */
export async function getTotalRevenue() {
  noStore();

  const session = await auth();

  if (!session?.user?.entity?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/bakeries/${session.user.entity.id}/sales_overview`)
    );

    if (result.success) {
      return result.data.payload as MetricData;
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}

export async function getCustomerCount() {
  noStore();

  const session = await auth();

  if (!session?.user?.entity?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/bakeries/${session.user.entity.id}/metrics/customers`)
    );

    if (result.success) {
      return result.data.payload as MetricData;
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching customer count:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}

export async function getOrderCount() {
  noStore();

  const session = await auth();

  if (!session?.user?.entity?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/bakeries/${session.user.entity.id}/metrics/orders`)
    );

    if (result.success) {
      return result.data.payload as MetricData;
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching order count:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}

export async function getAverageOrderValue() {
  noStore();

  const session = await auth();

  if (!session?.user?.entity?.id) {
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }

  try {
    const result = await apiRequest(() =>
      axiosAuth.get(`/bakeries/${session.user.entity.id}/metrics/average-order`)
    );

    if (result.success) {
      return result.data.payload as MetricData;
    }

    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  } catch (error) {
    console.error("Error fetching average order value:", error);
    return { amount: 0, change: 0, comparisonPeriod: "tháng trước" };
  }
}
