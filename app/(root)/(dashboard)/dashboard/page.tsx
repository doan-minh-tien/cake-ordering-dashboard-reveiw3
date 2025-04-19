import {
  getOverview,
  getCategoryDistribution,
  getProductPerformance,
  getSaleOverview,
} from "@/features/reports/actions/report-action";
import { Suspense } from "react";
import {
  CakeIcon,
  CreditCardIcon,
  DollarSignIcon,
  UsersIcon,
  StoreIcon,
  ClockIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/enums/user-role-enum";
import { auth } from "@/lib/next-auth/auth";

// Import components
import DashboardHeader from "./components/dashboard-header";
import StatCard from "./components/stat-card";
import ProductPerformanceChart from "./components/product-performance-chart";
import CategoryDistributionChart from "./components/category-distribution-chart";
import SalesOverviewChart from "./components/sales-overview-chart";

// Animated shimmer effect for loading states
const Shimmer = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 ${className}`}
  >
    <div className="h-full w-full bg-gradient-to-r from-transparent via-background/5 to-transparent animate-shimmer" />
  </div>
);

const Dashboard = async () => {
  // Get current user and session to debug
  const user = await getCurrentUser();
  const session = await auth();

  // Hiển thị thông tin user trong console để debug
  console.log("Current user role:", user?.role);
  console.log("Full user object:", JSON.stringify(user, null, 2));
  console.log("Session info:", JSON.stringify(session, null, 2));

  // Kiểm tra role admin theo nhiều cách
  const isAdminByEnum = user?.role === UserRole.ADMIN;
  const isAdminByString = user?.role === "ADMIN";
  const isAdminByCaseInsensitive = user?.role?.toUpperCase() === "ADMIN";

  console.log("IsAdmin by enum:", isAdminByEnum);
  console.log("IsAdmin by string:", isAdminByString);
  console.log("IsAdmin by case insensitive:", isAdminByCaseInsensitive);

  // Sử dụng kiểm tra linh hoạt nhất
  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const currentYear = new Date().getFullYear();

  // Fetch data from API
  const [
    overview,
    categoryDistribution,
    productPerformance,
    saleOverviewRevenue,
    saleOverviewOrders,
    saleOverviewCustomers,
  ] = await Promise.all([
    getOverview(),
    getCategoryDistribution(),
    getProductPerformance(),
    getSaleOverview({ type: "REVENUE", year: currentYear }),
    getSaleOverview({ type: "ORDERS", year: currentYear }),
    getSaleOverview({ type: "CUSTOMERS", year: currentYear }),
  ]);

  // Fetch admin-specific data if user is admin
  let adminData = {
    totalBakeries: 0,
    pendingBakeries: 0,
    bakeryGrowth: 0,
  };

  if (isAdmin) {
    // In a real implementation, these would be API calls to get actual data
    // For now, we'll just use placeholder values
    adminData = {
      totalBakeries: 45,
      pendingBakeries: 5,
      bakeryGrowth: 10,
    };
  }

  // Chuyển đổi mảng số sang định dạng phù hợp với biểu đồ
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const convertArrayToChartData = (
    dataArray: number[],
    shouldRound = false
  ) => {
    if (!Array.isArray(dataArray)) return [];

    return dataArray.map((value, index) => {
      const processedValue = shouldRound ? Math.round(value || 0) : value || 0;
      const target = shouldRound
        ? Math.round((value || 0) * 1.2)
        : (value || 0) * 1.2;

      return {
        month: months[index],
        value: processedValue,
        target: target,
      };
    });
  };

  // Combine all sales data types
  const combinedSalesData = {
    REVENUE: convertArrayToChartData(saleOverviewRevenue?.data || [], false),
    ORDERS: convertArrayToChartData(saleOverviewOrders?.data || [], true),
    CUSTOMERS: convertArrayToChartData(saleOverviewCustomers?.data || [], true),
  };

  // Format the data for charts with robust null checks
  const productData =
    productPerformance?.data?.cake_names &&
    Array.isArray(productPerformance.data.cake_names)
      ? productPerformance.data.cake_names.map((name, index) => ({
          name: name || `Product ${index + 1}`,
          value: productPerformance.data?.cake_quantities?.[index] || 0,
        }))
      : [];

  const categoryData =
    categoryDistribution?.data?.cake_names &&
    Array.isArray(categoryDistribution.data.cake_names)
      ? categoryDistribution.data.cake_names.map((name, index) => ({
          name: name || `Category ${index + 1}`,
          value: categoryDistribution.data?.cake_quantities?.[index] || 0,
        }))
      : [];

  // Fallback data if API returns no data
  const fallbackProductData =
    productData.length === 0
      ? [
          { name: "Chocolate Cake", value: 25 },
          { name: "Vanilla Cake", value: 18 },
          { name: "Strawberry Cake", value: 15 },
          { name: "Red Velvet", value: 12 },
          { name: "Carrot Cake", value: 8 },
        ]
      : productData;

  const fallbackCategoryData =
    categoryData.length === 0
      ? [
          { name: "Birthday", value: 35 },
          { name: "Wedding", value: 25 },
          { name: "Anniversary", value: 20 },
          { name: "Custom", value: 15 },
          { name: "Holiday", value: 5 },
        ]
      : categoryData;

  // Icon colors for stats
  const iconColors = {
    revenue: "text-emerald-500 dark:text-emerald-400",
    orders: "text-blue-500 dark:text-blue-400",
    customers: "text-amber-500 dark:text-amber-400",
    average: "text-purple-500 dark:text-purple-400",
    store: "text-indigo-500 dark:text-indigo-400",
    pending: "text-orange-500 dark:text-orange-400",
  };

  return (
    <div className="min-h-screen p-6 pt-4 bg-gradient-to-br from-background via-background to-background/95 dark:from-background dark:to-background/90">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader />

        {/* Debug information - only visible in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-md mb-4 text-black dark:text-white text-sm overflow-auto max-h-[300px]">
            <h3 className="font-bold mb-1">Debug Information:</h3>
            <p>User Role: {user?.role || "Not found"}</p>
            <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
            <p>Role from UserRole enum: {UserRole.ADMIN}</p>
            <p>Check by enum: {isAdminByEnum ? "Yes" : "No"}</p>
            <p>Check by string: {isAdminByString ? "Yes" : "No"}</p>
            <p>
              Check by case insensitive:{" "}
              {isAdminByCaseInsensitive ? "Yes" : "No"}
            </p>
            <details>
              <summary className="cursor-pointer">
                View full user object
              </summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(user, null, 2)}
              </pre>
            </details>
            <details>
              <summary className="cursor-pointer">View session info</summary>
              <pre className="mt-2 whitespace-pre-wrap">
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}

        {/* Stats Overview */}
        <section
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8"
          aria-label="Statistics overview"
        >
          {/* Tổng Doanh Thu - shown for both roles */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Tổng Doanh Thu"
              value={formatCurrency(overview?.data?.totalRevenue?.amount || 0)}
              change={overview?.data?.totalRevenue?.change || 0}
              period={
                overview?.data?.totalRevenue?.comparisonPeriod || "tháng trước"
              }
              icon={
                <DollarSignIcon className={`h-5 w-5 ${iconColors.revenue}`} />
              }
            />
          </Suspense>

          {/* Khách Hàng - shown for both roles */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Khách Hàng"
              value={(overview?.data?.customers?.amount || 0).toString()}
              change={overview?.data?.customers?.change || 0}
              period={
                overview?.data?.customers?.comparisonPeriod || "tháng trước"
              }
              icon={<UsersIcon className={`h-5 w-5 ${iconColors.customers}`} />}
            />
          </Suspense>

          {isAdmin ? (
            // Admin-specific stats
            <>
              <Suspense fallback={<Shimmer className="h-32" />}>
                <StatCard
                  title="Cửa Hàng"
                  value={adminData.totalBakeries.toString()}
                  change={adminData.bakeryGrowth}
                  period="tháng trước"
                  icon={<StoreIcon className={`h-5 w-5 ${iconColors.store}`} />}
                />
              </Suspense>
              <Suspense fallback={<Shimmer className="h-32" />}>
                <StatCard
                  title="Chờ Duyệt"
                  value={adminData.pendingBakeries.toString()}
                  change={0}
                  period="tháng trước"
                  icon={
                    <ClockIcon className={`h-5 w-5 ${iconColors.pending}`} />
                  }
                />
              </Suspense>
            </>
          ) : (
            // Bakery-specific stats
            <>
              <Suspense fallback={<Shimmer className="h-32" />}>
                <StatCard
                  title="Đơn Hàng"
                  value={(overview?.data?.orders?.amount || 0).toString()}
                  change={overview?.data?.orders?.change || 0}
                  period={
                    overview?.data?.orders?.comparisonPeriod || "tháng trước"
                  }
                  icon={
                    <CreditCardIcon
                      className={`h-5 w-5 ${iconColors.orders}`}
                    />
                  }
                />
              </Suspense>
              <Suspense fallback={<Shimmer className="h-32" />}>
                <StatCard
                  title="Giá Trị Đơn TB"
                  value={formatCurrency(
                    overview?.data?.averageOrder?.amount || 0
                  )}
                  change={overview?.data?.averageOrder?.change || 0}
                  period={
                    overview?.data?.averageOrder?.comparisonPeriod ||
                    "tháng trước"
                  }
                  icon={
                    <CakeIcon className={`h-5 w-5 ${iconColors.average}`} />
                  }
                />
              </Suspense>
            </>
          )}
        </section>

        {/* Sales Overview Chart */}
        <section className="mt-8" aria-label="Sales overview chart">
          <Suspense fallback={<Shimmer className="h-[450px]" />}>
            <SalesOverviewChart data={combinedSalesData} year={currentYear} />
          </Suspense>
        </section>

        {/* Product & Category Charts */}
        <section
          className="grid gap-6 md:grid-cols-2 mt-8"
          aria-label="Product and category distribution"
        >
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <ProductPerformanceChart data={fallbackProductData} />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <CategoryDistributionChart data={fallbackCategoryData} />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
