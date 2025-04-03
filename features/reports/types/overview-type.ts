export type OverviewType = {
    totalRevenue: {
        amount: number;
        change: number;
        comparisonPeriod: string;
    };
    orders: {
        amount: number;
        change: number;
        comparisonPeriod: string;
    };
    customers: {
        amount: number;
        change: number;
        comparisonPeriod: string;
    };
    averageOrder: {
        amount: number;
        change: number;
        comparisonPeriod: string;
    };
};  


export type IProductPerformanceType = {
    cake_names: string[];
    cake_quantities: number[];
};


export type ICategoryDistributionType = {
    cake_names: string[];
    cake_quantities: number[];
};




