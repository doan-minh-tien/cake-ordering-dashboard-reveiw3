import React from 'react'
import { BarChart3Icon } from 'lucide-react'

const DashboardHeader = () => {
  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3Icon className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <p className="mt-1 text-muted-foreground">
          Tổng quan về hoạt động kinh doanh bakery của bạn
        </p>
      </div>
      <div className="flex flex-row items-center space-x-2">
        <div className="rounded-md bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          Báo cáo: Tháng {new Date().getMonth() + 1}/{new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}

export default DashboardHeader 