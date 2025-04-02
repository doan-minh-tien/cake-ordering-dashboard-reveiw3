"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'
import { useTheme } from "next-themes"

interface ProductDataItem {
  name: string;
  value: number;
}

interface ProductPerformanceChartProps {
  data: ProductDataItem[];
}

const ProductPerformanceChart = ({ data }: ProductPerformanceChartProps) => {
  // Brighter and more vibrant colors for both modes
  const LIGHT_COLORS = [
    '#34d399', // emerald-400
    '#60a5fa', // blue-400
    '#fbbf24', // amber-400
    '#a78bfa', // violet-400
    '#f87171'  // red-400
  ];
  
  const DARK_COLORS = [
    '#10b981', // emerald-500 (brighter)
    '#3b82f6', // blue-500 (brighter)
    '#f59e0b', // amber-500 (brighter)
    '#8b5cf6', // violet-500 (brighter)
    '#ef4444'  // red-500 (brighter)
  ];

  // Get current theme to determine colors
  const { resolvedTheme } = useTheme();
  const COLORS = resolvedTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <Card className="col-span-1 overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-card/50 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Sản Phẩm Bán Chạy</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Top sản phẩm bánh được đặt hàng nhiều nhất
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              barSize={36}
            >
              <defs>
                {COLORS.map((color, index) => (
                  <linearGradient 
                    key={`gradient-${index}`} 
                    id={`barGradient-${index}`} 
                    x1="0" 
                    y1="0" 
                    x2="0" 
                    y2="1"
                  >
                    <stop 
                      offset="0%" 
                      stopColor={color} 
                      stopOpacity={0.95} 
                    />
                    <stop 
                      offset="95%" 
                      stopColor={color} 
                      stopOpacity={0.7} 
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                vertical={false} 
              />
              <XAxis 
                dataKey="name" 
                tick={{ 
                  fill: 'var(--foreground)', 
                  fontSize: 12 
                }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ 
                  fill: 'var(--foreground)', 
                  fontSize: 12 
                }}
                tickLine={{ stroke: 'var(--border)' }}
                axisLine={{ stroke: 'var(--border)' }}
                tickFormatter={(value) => value.toLocaleString('vi-VN')}
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
                formatter={(value) => [value.toLocaleString('vi-VN'), 'Số Lượng']}
                cursor={{ 
                  fill: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', 
                  stroke: resolvedTheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                  strokeWidth: 1
                }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={() => 'Số Lượng Bánh'}
                iconSize={10}
                iconType="circle"
              />
              <Bar 
                dataKey="value" 
                name="Số Lượng" 
                radius={[4, 4, 0, 0]}
              >
                {sortedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={`url(#barGradient-${index % COLORS.length})`} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductPerformanceChart 