"use server";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";

import {
  ApiListResponse,
  fetchListData,
  ApiSingleResponse,
  fetchSingleData,
  apiRequest,
  Result,
} from "@/lib/api/api-handler/generic";
import { SearchParams } from "@/types/table";
import { axiosAuth } from "@/lib/api/api-interceptor/api";
import { auth } from "@/lib/next-auth/auth";
import { ICake } from "@/features/cakes/types/cake";
import { 
  ICategoryDistributionType, 
  IProductPerformanceType, 
  OverviewType, 
  SalesOverviewParams, 
  SalesOverviewType,
  SalesOverviewItemType
} from "../types/overview-type";

export async function getProductPerformance(): Promise<
  ApiSingleResponse<IProductPerformanceType>
> {
  noStore();

  const session = await auth();

  const result = await fetchSingleData<IProductPerformanceType>(
    `/bakeries/${session?.user.entity.id}/products_performance`
  );
  if (!result.success) {
    console.error("Failed to fetch product performance:", result.error);
    return { data: null };
  }
  return result.data;
}

export async function getCategoryDistribution(): Promise<
  ApiSingleResponse<ICategoryDistributionType>
> {
  noStore();


    const session = await auth();

    const result = await fetchSingleData<ICategoryDistributionType>(
        `/bakeries/${session?.user.entity.id}/category_distribution`
    );          

    if (!result.success) {
        console.error("Failed to fetch category distribution:", result.error);
        return { data: null };
    }
    return result.data;
}

export async function getOverview(): Promise<
  ApiSingleResponse<OverviewType>
> {
  noStore();    

  const session = await auth();

  const result = await fetchSingleData<OverviewType>(
    `/bakeries/${session?.user.entity.id}/overview`
  );    

  if (!result.success) {
    console.error("Failed to fetch overview:", result.error);
    return { data: null };
  }
  return result.data;
}   

export async function getSaleOverview(params: SalesOverviewParams): Promise<
  ApiSingleResponse<SalesOverviewType>
> {
  noStore();

  const session = await auth();

  const { type = 'REVENUE', year = 2025 } = params;

  try {
    const result = await fetchSingleData<SalesOverviewType>(
      `/bakeries/${session?.user.entity.id}/sale_overview?type=${type}&year=${year}`
    );

    if (!result.success) {
      console.error("Failed to fetch sale overview:", result.error);
      return { data: getMockSalesData(type, year) };
    }
    
    return result.data;
  } catch (error) {
    console.error("Error fetching sales overview data:", error);
    // Return mock data for development
    return { data: getMockSalesData(type, year) };
  }
}

// Helper function to generate mock sales data for development
function getMockSalesData(type: string, year: number): SalesOverviewType {
  const months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 
                 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
  
  // Different base values for different types
  const baseValues = {
    'REVENUE': { min: 5000000, max: 15000000, targetMultiplier: 1.2 },
    'ORDERS': { min: 100, max: 300, targetMultiplier: 1.15 },
    'CUSTOMERS': { min: 50, max: 150, targetMultiplier: 1.1 }
  };

  // Ensure type is a valid key
  const validType = (type === 'REVENUE' || type === 'ORDERS' || type === 'CUSTOMERS') 
    ? type 
    : 'REVENUE';
  
  const config = baseValues[validType as keyof typeof baseValues];
  
  // Generate random but reasonable data for each month
  const typeData = months.map((month, index) => {
    // Create some seasonality - higher in middle and end of year
    const seasonalFactor = 1 + 
      Math.sin(((index + 1) / 12) * Math.PI) * 0.3 + // Higher mid-year 
      (index > 9 ? 0.4 : 0); // Higher end of year (holidays)
    
    const value = Math.floor(
      (config.min + Math.random() * (config.max - config.min)) * seasonalFactor
    );
    
    const target = Math.floor(value * config.targetMultiplier);
    
    return {
      month,
      value,
      target
    };
  });

  // Return data structure matching our type
  const result: SalesOverviewType = {};
  
  if (validType === 'REVENUE') {
    result.REVENUE = typeData;
  } else if (validType === 'ORDERS') {
    result.ORDERS = typeData;
  } else {
    result.CUSTOMERS = typeData;
  }
  
  return result;
}


