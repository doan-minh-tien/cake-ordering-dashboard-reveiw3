"use client"

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import { useTheme } from "next-themes"

interface CategoryDataItem {
  name: string;
  value: number;
}

interface CategoryDistributionChartProps {
  data: CategoryDataItem[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="#ffffff" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize={12}
      fontWeight="medium"
      className="pie-chart-label"
      stroke="#000000"
      strokeWidth={0.3}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CategoryDistributionChart = ({ data }: CategoryDistributionChartProps) => {
  // Brighter colors for both light and dark mode
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

  // Calculate total for the tooltip display
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Get current theme to determine colors
  const { resolvedTheme } = useTheme();
  const COLORS = resolvedTheme === 'dark' ? DARK_COLORS : LIGHT_COLORS;

  return (
    <Card className="col-span-1 overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-card/50 pb-2">
        <CardTitle className="text-lg font-semibold text-foreground">Phân Bổ Theo Danh Mục</CardTitle>
        <CardDescription className="text-muted-foreground text-sm">
          Phân bổ đơn hàng theo các danh mục bánh
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {COLORS.map((color, index) => (
                  <filter key={`shadow-${index}`} id={`shadow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.5" />
                  </filter>
                ))}
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={110}
                innerRadius={45}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                paddingAngle={3}
                strokeWidth={1}
                stroke={resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                    style={{ 
                      filter: `url(#shadow-${index % COLORS.length})`,
                      opacity: 0.9
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                }}
                labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', marginBottom: '5px' }}
                formatter={(value: number, name, props) => {
                  const percent = ((value / total) * 100).toFixed(1);
                  return [`${value.toLocaleString('vi-VN')} (${percent}%)`, props.payload.name];
                }}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value, entry, index) => (
                  <span style={{ 
                    color: 'var(--foreground)', 
                    fontSize: '12px',
                    fontWeight: 'medium'
                  }}>
                    {value}
                  </span>
                )}
                iconSize={10}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default CategoryDistributionChart 