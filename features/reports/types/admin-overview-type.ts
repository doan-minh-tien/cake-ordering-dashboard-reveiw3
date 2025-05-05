/**
 * Kiểu dữ liệu cho các khoảng thời gian báo cáo
 */
export type ReportPeriod = "day" | "week" | "month" | "year" | "all" | "custom";

/**
 * Kiểu dữ liệu cho dữ liệu trong payload của API
 */
export type AdminOverviewType = {
  /**
   * Tổng doanh thu
   */
  totalRevenues: number;

  /**
   * Tổng số cửa hàng
   */
  totalBakeries: number;

  /**
   * Tổng số báo cáo chờ duyệt
   */
  totalReports: number;

  /**
   * Tổng số khách hàng
   */
  totalCustomers: number;

  /**
   * Tổng số sản phẩm
   */
  totalProducts: number;
};

/**
 * Kiểu dữ liệu cho hiển thị trên Dashboard
 */
export type DashboardMetric = {
  amount: number;
  change: number;
  comparisonPeriod: string;
};

/**
 * Kiểu dữ liệu đã chuyển đổi cho hiển thị trên dashboard
 */
export type AdminDashboardOverviewType = {
  totalRevenue: DashboardMetric;
  totalBakeries: DashboardMetric;
  totalReports: DashboardMetric;
  totalCustomers: DashboardMetric;
};

/**
 * Hàm chuyển đổi dữ liệu từ API sang định dạng hiển thị trên dashboard
 * @param data Dữ liệu từ API
 * @returns Dữ liệu đã chuyển đổi cho dashboard
 */
export function convertToAdminDashboardOverview(
  data: AdminOverviewType
): AdminDashboardOverviewType {
  return {
    totalRevenue: {
      amount: data.totalRevenues,
      change: 0, // Giá trị thay đổi sẽ được thêm vào sau khi có dữ liệu so sánh
      comparisonPeriod: "tháng trước",
    },
    totalBakeries: {
      amount: data.totalBakeries,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalReports: {
      amount: data.totalReports,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
    totalCustomers: {
      amount: data.totalCustomers,
      change: 0,
      comparisonPeriod: "tháng trước",
    },
  };
}
