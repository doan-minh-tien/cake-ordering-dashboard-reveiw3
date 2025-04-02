import { getOverview, getCategoryDistribution, getProductPerformance, getSaleOverview } from '@/features/reports/actions/report-action'
import { Suspense } from 'react'
import { CakeIcon, CreditCardIcon, DollarSignIcon, UsersIcon } from "lucide-react"
import { formatCurrency } from '@/lib/utils'

// Import components
import DashboardHeader from './components/dashboard-header'
import StatCard from './components/stat-card'
import ProductPerformanceChart from './components/product-performance-chart'
import CategoryDistributionChart from './components/category-distribution-chart'
import SalesOverviewChart from './components/sales-overview-chart'

// Animated shimmer effect for loading states
const Shimmer = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-xl bg-gradient-to-r from-muted/30 via-muted/50 to-muted/30 ${className}`}>
    <div className="h-full w-full bg-gradient-to-r from-transparent via-background/5 to-transparent animate-shimmer" />
  </div>
);

const Dashboard = async () => {
  // Fetch data from API
  const [overview, categoryDistribution, productPerformance, saleOverview] = await Promise.all([
    getOverview(),
    getCategoryDistribution(),
    getProductPerformance(),
    getSaleOverview({type: "REVENUE", year: 2025}),
  ]);

  // Format the data for charts with robust null checks
  const productData = productPerformance?.data?.cake_names && Array.isArray(productPerformance.data.cake_names) ? 
    productPerformance.data.cake_names.map((name, index) => ({
      name: name || `Product ${index + 1}`,
      value: productPerformance.data?.cake_quantities?.[index] || 0
    })) : [];

  const categoryData = categoryDistribution?.data?.cake_names && Array.isArray(categoryDistribution.data.cake_names) ? 
    categoryDistribution.data.cake_names.map((name, index) => ({
      name: name || `Category ${index + 1}`,
      value: categoryDistribution.data?.cake_quantities?.[index] || 0
    })) : [];

  // Fallback data if API returns no data
  const fallbackProductData = productData.length === 0 ? [
    { name: "Chocolate Cake", value: 25 },
    { name: "Vanilla Cake", value: 18 },
    { name: "Strawberry Cake", value: 15 },
    { name: "Red Velvet", value: 12 },
    { name: "Carrot Cake", value: 8 }
  ] : productData;

  const fallbackCategoryData = categoryData.length === 0 ? [
    { name: "Birthday", value: 35 },
    { name: "Wedding", value: 25 },
    { name: "Anniversary", value: 20 },
    { name: "Custom", value: 15 },
    { name: "Holiday", value: 5 }
  ] : categoryData;

  // Icon colors for stats
  const iconColors = {
    revenue: "text-emerald-500 dark:text-emerald-400",
    orders: "text-blue-500 dark:text-blue-400",
    customers: "text-amber-500 dark:text-amber-400",
    average: "text-purple-500 dark:text-purple-400"
  };

  return (
    <div className="min-h-screen space-y-8 p-6 pt-4 bg-gradient-to-br from-background via-background to-background/90">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-8">
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Tổng Doanh Thu"
              value={formatCurrency(overview?.data?.totalRevenue?.amount || 0)}
              change={overview?.data?.totalRevenue?.change || 0}
              period={overview?.data?.totalRevenue?.comparisonPeriod || 'tháng trước'}
              icon={<DollarSignIcon className={`h-5 w-5 ${iconColors.revenue}`} />}
            />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Đơn Hàng"
              value={(overview?.data?.orders?.amount || 0).toString()}
              change={overview?.data?.orders?.change || 0}
              period={overview?.data?.orders?.comparisonPeriod || 'tháng trước'}
              icon={<CreditCardIcon className={`h-5 w-5 ${iconColors.orders}`} />}
            />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Khách Hàng"
              value={(overview?.data?.customers?.amount || 0).toString()}
              change={overview?.data?.customers?.change || 0}
              period={overview?.data?.customers?.comparisonPeriod || 'tháng trước'}
              icon={<UsersIcon className={`h-5 w-5 ${iconColors.customers}`} />}
            />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-32" />}>
            <StatCard
              title="Giá Trị Đơn TB"
              value={formatCurrency(overview?.data?.averageOrder?.amount || 0)}
              change={overview?.data?.averageOrder?.change || 0}
              period={overview?.data?.averageOrder?.comparisonPeriod || 'tháng trước'}
              icon={<CakeIcon className={`h-5 w-5 ${iconColors.average}`} />}
            />
          </Suspense>
        </div>

        {/* Sales Overview Chart */}
        <div className="mt-8">
          <Suspense fallback={<Shimmer className="h-[450px]" />}>
            <SalesOverviewChart data={saleOverview?.data || {}} year={2025} />
          </Suspense>
        </div>

        {/* Product & Category Charts */}
        <div className="grid gap-6 md:grid-cols-2 mt-8">
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <ProductPerformanceChart data={fallbackProductData} />
          </Suspense>
          <Suspense fallback={<Shimmer className="h-[380px]" />}>
            <CategoryDistributionChart data={fallbackCategoryData} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default Dashboard