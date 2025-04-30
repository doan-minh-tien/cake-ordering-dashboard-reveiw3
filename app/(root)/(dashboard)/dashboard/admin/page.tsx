import {
  getCategoryDistribution,
  getProductPerformance,
} from "@/features/reports/actions/report-action";
import {
  getAdminTotalRevenue,
  getPendingBakeries,
  getTotalCustomers,
  getTotalBakeries,
  getSaleOverview,
  getOverview,
} from "@/features/reports/actions/admin-report-action";
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
import { startOfMonth, format } from "date-fns";

// Import components
import AdminHeader from "./_components/AdminHeader";
import StatCard from "../components/stat-card";
import SalesOverviewChart from "../components/sales-overview-chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTopBakery } from "@/features/reports/actions/admin-dashoboard-action";
import { ITopBakeriesType } from "@/features/reports/types/admid-dashboard-type";

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
    <div className="p-4 border rounded-lg hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-3 cursor-pointer min-h-[120px]">
      <div className={`p-3 rounded-full bg-primary/10 ${color}`}>{icon}</div>
      <div className="flex flex-col items-center gap-2">
        <span className="font-medium text-center">{title}</span>
        {count > 0 && (
          <div className="bg-muted px-2 py-1 rounded-full text-xs font-medium">
            {count}
          </div>
        )}
      </div>
    </div>
  </a>
);

// Top bakeries chart for admin
const TopBakeriesChart = ({
  data,
}: {
  data: ITopBakeriesType[];
}) => {
  console.log("data", data);
  return (
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
                {bakery.bakery.bakery_name}
              </span>
            </div>
            <div className="text-right">
              <span className="font-semibold">
                {formatCurrency(bakery.total_revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
      </CardContent>
    </Card>
  );
};

interface AdminDashboardProps {
  searchParams?: {
    dateFrom?: string;
    dateTo?: string;
  };
}

const AdminDashboard = async ({ searchParams }: AdminDashboardProps) => {
  // Verify user is admin
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

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
  
  console.log("Admin Dashboard Date range:", { dateFrom, dateTo });

  // Fetch data from API with the new admin report actions
  const [
    overviewData,
    pendingBakeries,
    categoryDistribution,
    productPerformance,
    saleOverviewRevenue,
    saleOverviewBakeries,
    saleOverviewCustomers,
    topBakeries,
  ] = await Promise.all([
    getOverview({ dateFrom, dateTo }),
    getPendingBakeries(),
    getCategoryDistribution({ dateFrom, dateTo }),
    getProductPerformance({ dateFrom, dateTo }),
    getSaleOverview({ type: "REVENUE", dateFrom, dateTo }),
    getSaleOverview({ type: "BAKERIES", dateFrom, dateTo }),
    getSaleOverview({ type: "CUSTOMERS", dateFrom, dateTo }),
    getTopBakery(),
  ]);

  // Debug: Log các giá trị nhận được
  console.log("Debug Admin Dashboard Data:");
  console.log("overviewData:", overviewData);
  console.log("pendingBakeries:", pendingBakeries);
  console.log("Sales data format:", saleOverviewRevenue?.data?.[0]);

  // Prepare sales data for chart
  const salesData = {
    REVENUE: saleOverviewRevenue?.data || [],
    BAKERIES: saleOverviewBakeries?.data || [],
    CUSTOMERS: saleOverviewCustomers?.data || [],
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
        <AdminHeader dateFrom={dateFrom} dateTo={dateTo} />

        {/* Stats Overview */}
        <section
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8"
          aria-label="Statistics overview"
        >
          {/* Tổng Doanh Thu */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Tổng Doanh Thu"
              value={formatCurrency(overviewData?.data?.totalRevenues || 0)}
              change={0}
              period="tháng trước"
              icon={
                <DollarSignIcon className={`h-5 w-5 ${iconColors.revenue}`} />
              }
            />
          </Suspense>

          {/* Chờ Duyệt */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Chờ Duyệt"
              value={(pendingBakeries?.amount || 0).toString()}
              change={0}
              period="tháng trước"
              icon={<ClockIcon className={`h-5 w-5 ${iconColors.pending}`} />}
            />
          </Suspense>

          {/* Khách Hàng */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Khách Hàng"
              value={(overviewData?.data?.totalCustomers || 0).toString()}
              change={0}
              period="tháng trước"
              icon={<UsersIcon className={`h-5 w-5 ${iconColors.customers}`} />}
            />
          </Suspense>

          {/* Cửa Hàng */}
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Cửa Hàng"
              value={(overviewData?.data?.totalBakeries || 0).toString()}
              change={0}
              period="tháng trước"
              icon={<StoreIcon className={`h-5 w-5 ${iconColors.store}`} />}
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
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AdminActionCard
                title="Duyệt Cửa Hàng"
                count={0}
                icon={<StoreIcon className="h-4 w-4" />}
                href="/dashboard/bakeries"
                color="text-indigo-500 dark:text-indigo-400"
              />
              <AdminActionCard
                title="Hỗ Trợ Khách Hàng"
                count={0}
                icon={<ShieldIcon className="h-4 w-4" />}
                href="/dashboard/bad-report"
                color="text-red-500 dark:text-red-400"
              />
              <AdminActionCard
                title="Khuyến Mãi"
                count={0}
                icon={<PercentIcon className="h-4 w-4" />}
                href="/dashboard/promotions"
                color="text-amber-500 dark:text-amber-400"
              />
            </CardContent>
          </Card>
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

        {/* Admin Specific Charts */}
        <section
          className="grid gap-6 md:grid-cols-2 mt-8"
          aria-label="Admin Analytics"
        >
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <TopBakeriesChart data={topBakeries?.data || []} />
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
                        {0}/{0}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${0}%`,
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Phí hoa hồng
                      </span>
                      <span className="font-medium">{formatCurrency(0)}</span>
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
                      <span className="font-medium">{0}%</span>
                    </div>
                    <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width: `${0}%` }}
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
