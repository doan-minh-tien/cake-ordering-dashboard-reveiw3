"use client";
import React, { useMemo } from "react";
import { BarChart3Icon, CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  format as formatDate,
  subMonths,
  startOfMonth,
  endOfMonth,
  isSameMonth,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DashboardHeaderProps {
  dateFrom?: string;
  dateTo?: string;
}

const DashboardHeader = ({ dateFrom, dateTo }: DashboardHeaderProps) => {
  const today = useMemo(() => new Date(), []);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const router = useRouter();

  // Create dateRange state from dateFrom and dateTo props
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      if (dateFrom && dateTo) {
        return {
          from: new Date(dateFrom),
          to: new Date(dateTo),
        };
      }
      // Default to current month if no date range is provided
      return {
        from: startOfMonth(today),
        to: today,
      };
    }
  );

  // Apply default date range on first render
  React.useEffect(() => {
    // Only redirect if no date params are in URL
    if (!dateFrom && !dateTo) {
      const defaultParams = new URLSearchParams();
      defaultParams.set(
        "dateFrom",
        formatDate(startOfMonth(today), "yyyy-MM-dd")
      );
      defaultParams.set("dateTo", formatDate(today, "yyyy-MM-dd"));
      router.push(`?${defaultParams.toString()}`, { scroll: false });
    }
  }, [dateFrom, dateTo, router, today]);

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);

    if (range?.from) {
      const newParams = new URLSearchParams();
      newParams.set("dateFrom", formatDate(range.from, "yyyy-MM-dd"));

      if (range.to) {
        newParams.set("dateTo", formatDate(range.to, "yyyy-MM-dd"));
      }

      router.push(`?${newParams.toString()}`);
    }
  };

  // Preset options for date ranges
  const handlePresetChange = (value: string) => {
    const today = new Date();

    let from: Date;
    let to: Date = today;

    switch (value) {
      case "last30Days":
        from = subMonths(today, 1);
        break;
      case "last3Months":
        from = subMonths(today, 3);
        break;
      case "last6Months":
        from = subMonths(today, 6);
        break;
      case "thisMonth":
        from = startOfMonth(today);
        to = today;
        break;
      case "lastMonth":
        to = endOfMonth(subMonths(today, 1));
        from = startOfMonth(to);
        break;
      default:
        return;
    }

    setDateRange({ from, to });

    const newParams = new URLSearchParams();
    newParams.set("dateFrom", formatDate(from, "yyyy-MM-dd"));
    newParams.set("dateTo", formatDate(to, "yyyy-MM-dd"));

    router.push(`?${newParams.toString()}`);
  };

  // Format date range for display
  const formatDateRange = () => {
    if (!dateRange?.from) {
      return "Chọn thời gian";
    }

    if (!dateRange.to) {
      return formatDate(dateRange.from, "dd/MM/yyyy");
    }

    // If same month, show as dd - dd/MM/yyyy
    if (isSameMonth(dateRange.from, dateRange.to)) {
      return `${formatDate(dateRange.from, "dd")} - ${formatDate(
        dateRange.to,
        "dd/MM/yyyy"
      )}`;
    }

    return `${formatDate(dateRange.from, "dd/MM/yyyy")} - ${formatDate(
      dateRange.to,
      "dd/MM/yyyy"
    )}`;
  };

  // Clear date filters
  const clearDateFilter = () => {
    // Set to current month when clearing
    const from = startOfMonth(today);
    const to = today;

    setDateRange({ from, to });

    const defaultParams = new URLSearchParams();
    defaultParams.set("dateFrom", formatDate(from, "yyyy-MM-dd"));
    defaultParams.set("dateTo", formatDate(to, "yyyy-MM-dd"));

    router.push(`?${defaultParams.toString()}`);
  };

  return (
    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div>
        <div className="flex items-center space-x-2">
          <BarChart3Icon
            className={`h-6 w-6 ${isDark ? "text-primary/90" : "text-primary"}`}
          />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <p
          className={`mt-1 ${
            isDark ? "text-gray-300" : "text-muted-foreground"
          }`}
        >
          Tổng quan về hoạt động kinh doanh bakery của bạn
        </p>
      </div>
      <div className="flex flex-row items-center space-x-2">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Select onValueChange={handlePresetChange} defaultValue="thisMonth">
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">Tháng này</SelectItem>
              <SelectItem value="lastMonth">Tháng trước</SelectItem>
              <SelectItem value="last30Days">30 ngày qua</SelectItem>
              <SelectItem value="last3Months">3 tháng qua</SelectItem>
              <SelectItem value="last6Months">6 tháng qua</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 flex items-center gap-1.5"
              >
                <CalendarIcon className="h-3.5 w-3.5" />
                <span>{formatDateRange()}</span>
                <ChevronDownIcon className="h-3.5 w-3.5 ml-1" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                locale={vi}
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeChange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Clear Filter */}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearDateFilter}
            className="h-9 px-2"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
