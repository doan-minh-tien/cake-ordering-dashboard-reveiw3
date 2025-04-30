"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "lucide-react"

interface StatCardProps {
  title: string;
  value: number | string;
  change: number;
  period: string;
  icon: React.ReactNode;
}

const StatCard = ({ 
  title, 
  value, 
  change, 
  period, 
  icon 
}: StatCardProps) => {
  const isPositive = change > 0
  const isNeutral = change === 0
  
  return (
    <Card className="overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {/* <div className="mt-2 flex items-center rounded-full px-2 py-1 text-xs font-medium max-w-fit" 
             style={{ 
               backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 
                               isNeutral ? 'rgba(234, 179, 8, 0.1)' : 
                               'rgba(239, 68, 68, 0.1)',
             }}>
          <span className="flex items-center">
            {isPositive ? (
              <ArrowUpIcon className="mr-1 h-3.5 w-3.5 text-green-500" />
            ) : isNeutral ? (
              <ArrowRightIcon className="mr-1 h-3.5 w-3.5 text-yellow-500" />
            ) : (
              <ArrowDownIcon className="mr-1 h-3.5 w-3.5 text-red-500" />
            )}
            <span className={isPositive ? "text-green-600" : isNeutral ? "text-yellow-600" : "text-red-600"}>
              {formatPercentage(Math.abs(change))}
            </span>
            <span className="ml-1 text-muted-foreground/90">từ {period}</span>
          </span>
        </div> */}
      </CardContent>
    </Card>
  )
}

export default StatCard 