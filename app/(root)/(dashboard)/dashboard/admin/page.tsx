import {
  getOverview,
  getCategoryDistribution,
  getProductPerformance,
  getSaleOverview,
} from "@/features/reports/actions/report-action";
import { Suspense } from "react";
import {
  DollarSignIcon,
  UsersIcon,
  StoreIcon,
  ClockIcon,
  BarChart3Icon,
  PercentIcon,
  ShieldIcon,
  ActivityIcon,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/enums/user-role-enum";
import { redirect } from "next/navigation";

// Import components
import DashboardHeader from "../components/dashboard-header";
import StatCard from "../components/stat-card";
import SalesOverviewChart from "../components/sales-overview-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Animated shimmer effect for loading states
const Shimmer = ({ className }: { className: string }) => (
  <div
    className={`animate-pulse rounded-xl bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 ${className}`}
  >
    <div className="h-full w-full bg-gradient-to-r from-transparent via-background/5 to-transparent animate-shimmer" />
  </div>
);

// Admin-specific card for quick actions
const AdminActionCard = ({
  title,
  count,
  icon,
  href,
  color = "text-primary",
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  href: string;
  color?: string;
}) => (
  <a href={href}>
    <div className="p-4 border rounded-lg hover:bg-primary/5 transition-colors flex justify-between items-center cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-primary/10 ${color}`}>{icon}</div>
        <span className="font-medium">{title}</span>
      </div>
      {count > 0 && (
        <div className="bg-muted px-2 py-1 rounded-full text-xs font-medium">
          {count}
        </div>
      )}
    </div>
  </a>
);

// Top bakeries chart for admin
const TopBakeriesChart = ({
  data,
}: {
  data: { name: string; revenue: number }[];
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-base font-normal">
        Top Cửa Hàng Hiệu Quả
      </CardTitle>
      <StoreIcon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {data.map((bakery, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm w-5">
                {index + 1}.
              </span>
              <span className="font-medium truncate max-w-[180px]">
                {bakery.name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {formatCurrency(bakery.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = async () => {
  // Get current user and check if admin
  const user = await getCurrentUser();

  // Redirect if not admin
  if (user?.role?.toUpperCase() !== "ADMIN") {
    redirect("/dashboard");
  }

  const currentYear = new Date().getFullYear();

  // Fetch data from API
  const [
    overview,
    saleOverviewRevenue,
    saleOverviewOrders,
    saleOverviewCustomers,
  ] = await Promise.all([
    getOverview(),
    getSaleOverview({ type: "REVENUE", year: currentYear }),
    getSaleOverview({ type: "ORDERS", year: currentYear }),
    getSaleOverview({ type: "CUSTOMERS", year: currentYear }),
  ]);

  // Admin-specific data - in a real implementation, this would be from API
  const adminData = {
    totalBakeries: 45,
    pendingBakeries: 5,
    activeBakeries: 40,
    bakeryGrowth: 10,
    totalCommission: 5000000,
    openTickets: 3,
    activePromotions: 8,
    systemHealth: 98,
    topBakeries: [
      { name: "Tiệm Bánh ABC", revenue: 50000000 },
      { name: "Bánh Ngọt XYZ", revenue: 35000000 },
      { name: "Sweetie Bakery", revenue: 28000000 },
      { name: "Bánh Ngon 123", revenue: 22000000 },
      { name: "Tiệm Bánh Hạnh Phúc", revenue: 15000000 },
    ],
  };

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

  // Icon colors for stats
  const iconColors = {
    revenue: "text-emerald-500 dark:text-emerald-400",
    customers: "text-amber-500 dark:text-amber-400",
    store: "text-indigo-500 dark:text-indigo-400",
    pending: "text-orange-500 dark:text-orange-400",
    commission: "text-purple-500 dark:text-purple-400",
    health: "text-teal-500 dark:text-teal-400",
  };

  return (
    <div className="min-h-screen p-6 pt-4 bg-gradient-to-br from-background via-background to-background/95 dark:from-background dark:to-background/90">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3Icon className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h2>
            </div>
            <p className="mt-1 text-muted-foreground">
              Tổng quan về hoạt động của toàn bộ hệ thống
            </p>
          </div>
        </div>

        {/* Admin Stats Overview */}
        <section
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8"
          aria-label="Statistics overview"
        >
          {/* Tổng Doanh Thu */}
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

          {/* Khách Hàng */}
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

          {/* Cửa Hàng */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Cửa Hàng"
              value={adminData.totalBakeries.toString()}
              change={adminData.bakeryGrowth}
              period="tháng trước"
              icon={<StoreIcon className={`h-5 w-5 ${iconColors.store}`} />}
            />
          </Suspense>

          {/* Chờ Duyệt */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Chờ Duyệt"
              value={adminData.pendingBakeries.toString()}
              change={0}
              period="tháng trước"
              icon={<ClockIcon className={`h-5 w-5 ${iconColors.pending}`} />}
            />
          </Suspense>
        </section>

        {/* Admin Action Center */}
        <section className="mt-8" aria-label="Admin Actions">
          <Card>
            <CardHeader>
              <CardTitle>Trung Tâm Hành Động</CardTitle>
              <CardDescription>
                Truy cập nhanh đến các tác vụ quản trị quan trọng
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <AdminActionCard
                title="Duyệt Cửa Hàng"
                count={adminData.pendingBakeries}
                icon={<StoreIcon className="h-4 w-4" />}
                href="/dashboard/bakeries"
                color="text-indigo-500 dark:text-indigo-400"
              />
              <AdminActionCard
                title="Hỗ Trợ Khách Hàng"
                count={adminData.openTickets}
                icon={<ShieldIcon className="h-4 w-4" />}
                href="/dashboard/bad-report"
                color="text-red-500 dark:text-red-400"
              />
              <AdminActionCard
                title="Khuyến Mãi"
                count={adminData.activePromotions}
                icon={<PercentIcon className="h-4 w-4" />}
                href="/dashboard/promotions"
                color="text-amber-500 dark:text-amber-400"
              />
              <AdminActionCard
                title="Sức Khỏe Hệ Thống"
                count={0}
                icon={<ActivityIcon className="h-4 w-4" />}
                href="/dashboard/settings"
                color="text-emerald-500 dark:text-emerald-400"
              />
            </CardContent>
          </Card>
        </section>

        {/* Sales Overview Chart */}
        <section className="mt-8" aria-label="Sales overview chart">
          <Suspense fallback={<Shimmer className="h-[450px]" />}>
            <SalesOverviewChart data={combinedSalesData} year={currentYear} />
          </Suspense>
        </section>

        {/* Admin Specific Charts */}
        <section
          className="grid gap-6 md:grid-cols-2 mt-8"
          aria-label="Admin Analytics"
        >
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <TopBakeriesChart data={adminData.topBakeries} />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">
                  Thống Kê Hệ Thống
                </CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Cửa hàng hoạt động
                      </span>
                      <span className="font-medium">
                        {adminData.activeBakeries}/{adminData.totalBakeries}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${
                            (adminData.activeBakeries /
                              adminData.totalBakeries) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phí hoa hồng
                      </span>
                      <span className="font-medium">
                        {formatCurrency(adminData.totalCommission)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: "65%" }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Sức khỏe hệ thống
                      </span>
                      <span className="font-medium">
                        {adminData.systemHealth}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${adminData.systemHealth}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
