"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts'
import { useTheme } from "next-themes"
import { formatCurrency } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDownIcon, TrendingUpIcon } from "lucide-react"

// Define the types of sales data
export type SalesOverviewType = 'REVENUE' | 'ORDERS' | 'CUSTOMERS';

interface SalesDataItem {
  month: string;
  value: number;
  target?: number;
}

interface SalesOverviewChartProps {
  data: {
    REVENUE?: SalesDataItem[];
    ORDERS?: SalesDataItem[];
    CUSTOMERS?: SalesDataItem[];
  };
  year: number;
}

const SalesOverviewChart = ({ data, year }: SalesOverviewChartProps) => {
  const [selectedType, setSelectedType] = useState<SalesOverviewType>('REVENUE');
  const { resolvedTheme } = useTheme();
  
  // Color settings for each data type
  const colorSettings = {
    REVENUE: {
      main: '#10b981', // emerald-500
      target: '#f59e0b', // amber-500
      title: 'Doanh Thu',
      valueFormatter: (value: number) => formatCurrency(value),
      background: resolvedTheme === 'dark' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
    },
    ORDERS: {
      main: '#3b82f6', // blue-500
      target: '#f59e0b', // amber-500
      title: 'Đơn Hàng',
      valueFormatter: (value: number) => value.toLocaleString('vi-VN'),
      background: resolvedTheme === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)'
    },
    CUSTOMERS: {
      main: '#8b5cf6', // violet-500
      target: '#f59e0b', // amber-500
      title: 'Khách Hàng',
      valueFormatter: (value: number) => value.toLocaleString('vi-VN'),
      background: resolvedTheme === 'dark' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)'
    }
  };

  // Get the current data based on selected type
  const currentData = data[selectedType] || [];
  
  // Calculate totals
  const totalValue = currentData.reduce((sum, item) => sum + item.value, 0);
  const totalTarget = currentData.reduce((sum, item) => sum + (item.target || 0), 0);
  const percentOfTarget = totalTarget ? (totalValue / totalTarget * 100).toFixed(1) : '0.0';
  
  // Function to handle tab change
  const handleTabChange = (value: string) => {
    setSelectedType(value as SalesOverviewType);
  };
  
  return (
    <Card className="col-span-1 md:col-span-2 overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-card/50 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-primary" />
              Biểu Đồ Hoạt Động {year}
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm mt-1">
              So sánh chỉ tiêu và thực tế theo tháng
            </CardDescription>
          </div>
          
          <Tabs value={selectedType} onValueChange={handleTabChange} className="w-full max-w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger 
                value="REVENUE" 
                className={selectedType === 'REVENUE' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : ''}
              >
                Doanh Thu
              </TabsTrigger>
              <TabsTrigger 
                value="ORDERS" 
                className={selectedType === 'ORDERS' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400' : ''}
              >
                Đơn Hàng
              </TabsTrigger>
              <TabsTrigger 
                value="CUSTOMERS" 
                className={selectedType === 'CUSTOMERS' ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400' : ''}
              >
                Khách Hàng
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="px-1 pt-6">
        <div className="flex flex-col md:flex-row gap-4 px-4 mb-4">
          <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: colorSettings[selectedType].background }}>
            <div className="text-sm font-medium text-muted-foreground">Tổng {colorSettings[selectedType].title}</div>
            <div className="mt-1 text-2xl font-bold">{colorSettings[selectedType].valueFormatter(totalValue)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Chỉ tiêu: {colorSettings[selectedType].valueFormatter(totalTarget)}</div>
          </div>
          
          <div className="flex-1 rounded-lg p-4" style={{ backgroundColor: colorSettings[selectedType].background }}>
            <div className="text-sm font-medium text-muted-foreground">Hoàn Thành Chỉ Tiêu</div>
            <div className="mt-1 text-2xl font-bold flex items-center gap-1">
              {percentOfTarget}%
              <span className="text-xs text-muted-foreground mt-1">của mục tiêu</span>
            </div>
            <div className="w-full h-2 bg-muted/30 rounded-full mt-2">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${Math.min(Number(percentOfTarget), 100)}%`,
                  backgroundColor: colorSettings[selectedType].main
                }} 
              />
            </div>
          </div>
        </div>
        
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                vertical={false} 
              />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => {
                  if (selectedType === 'REVENUE') {
                    return `${(value / 1000000).toFixed(0)}M`;
                  }
                  return value.toLocaleString('vi-VN');
                }}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
                labelStyle={{ 
                  color: 'var(--foreground)', 
                  fontWeight: 'bold', 
                  marginBottom: '5px' 
                }}
                formatter={(value: number) => [
                  colorSettings[selectedType].valueFormatter(value), 
                  selectedType === 'REVENUE' ? 'Doanh Thu' : selectedType === 'ORDERS' ? 'Đơn Hàng' : 'Khách Hàng'
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={colorSettings[selectedType].title}
                stroke={colorSettings[selectedType].main} 
                strokeWidth={3}
                dot={{ 
                  r: 4, 
                  fill: colorSettings[selectedType].main,
                  strokeWidth: 0 
                }}
                activeDot={{ 
                  r: 6, 
                  fill: colorSettings[selectedType].main,
                  stroke: 'var(--background)',
                  strokeWidth: 2 
                }}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                name="Chỉ Tiêu"
                stroke={colorSettings[selectedType].target} 
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={{ 
                  r: 4, 
                  fill: colorSettings[selectedType].target,
                  strokeWidth: 0 
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default SalesOverviewChart 