'use client'
import React from 'react'
import { BarChart3Icon, CalendarIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'

const DashboardHeader = () => {
  const today = new Date();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];
  
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3Icon className={`h-6 w-6 ${isDark ? 'text-primary/90' : 'text-primary'}`} />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-muted-foreground'}`}>
          Tổng quan về hoạt động kinh doanh bakery của bạn
        </p>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <Badge 
          variant="outline" 
          className={`${isDark ? 'bg-primary/20 text-primary-foreground' : 'bg-primary/5 text-primary'} hover:bg-primary/10 px-3 py-1.5 flex items-center gap-1.5 text-sm border-primary/20`}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          <span>{monthNames[today.getMonth()]} {today.getFullYear()}</span>
        </Badge>
      </div>
    </div>
  )
}

export default DashboardHeader 