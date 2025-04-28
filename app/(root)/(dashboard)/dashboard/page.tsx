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
import { startOfMonth, format } from "date-fns";

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

interface DashboardProps {
  searchParams?: {
    dateFrom?: string;
    dateTo?: string;
  };
}

const Dashboard = async ({ searchParams }: DashboardProps) => {
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

  // Get date range parameters from URL or set defaults
  const today = new Date();
  let dateFrom = searchParams?.dateFrom;
  let dateTo = searchParams?.dateTo;
  
  // Set default date range to current month if not provided
  if (!dateFrom) {
    dateFrom = format(startOfMonth(today), 'yyyy-MM-dd');
  }
  
  if (!dateTo) {
    dateTo = format(today, 'yyyy-MM-dd');
  }
  
  console.log("Date range:", { dateFrom, dateTo });

  // Fetch data from API with date range parameters
  const [
    overview,
    categoryDistribution,
    productPerformance,
    saleOverviewRevenue,
    saleOverviewOrders,
    saleOverviewCustomers,
  ] = await Promise.all([
    getOverview({ dateFrom, dateTo }),
    getCategoryDistribution({ dateFrom, dateTo }),
    getProductPerformance({ dateFrom, dateTo }),
    getSaleOverview({ type: "REVENUE", dateFrom, dateTo }),
    getSaleOverview({ type: "ORDERS", dateFrom, dateTo }),
    getSaleOverview({ type: "CUSTOMERS", dateFrom, dateTo }),
  ]);
  
  // Log responses to debug the data structure
  console.log("Sales Overview Revenue data format:", 
    saleOverviewRevenue?.data?.length > 0 ? 
    saleOverviewRevenue.data[0] : "No data");

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

  // Prepare sales data for chart
  const salesData = {
    REVENUE: saleOverviewRevenue?.data || [],
    ORDERS: saleOverviewOrders?.data || [],
    CUSTOMERS: saleOverviewCustomers?.data || [],
  };

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
        <DashboardHeader dateFrom={dateFrom} dateTo={dateTo} />

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
            <SalesOverviewChart 
              data={salesData} 
              dateRange={{ dateFrom, dateTo }} 
            />
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
