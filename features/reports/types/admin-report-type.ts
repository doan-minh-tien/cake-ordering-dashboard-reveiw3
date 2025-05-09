export interface IAdminTotalRevenue {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

export interface IPendingBakeries {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

export interface ITotalCustomers {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

export interface AdminSalesOverviewResponse {
  totalRevenues: number;
  totalBakeries: number;
  totalReports: number;
  totalCustomers: number;
  totalProducts: number;
}

export interface ITotalBakeries {
  amount: number;
  change: number;
  comparisonPeriod: string;
}

export interface DateRangeParams {
  dateFrom?: string;
  dateTo?: string;
}
