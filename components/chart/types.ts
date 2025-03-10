export interface KPIMetric {
  label: string;
  value: number;
  unit: string;
  change: number; // percentage change
  changeLabel: string;
  icon?: React.ElementType;
}

export interface TimeSeriesData {
  date: string;
  revenue: number;
  users: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface BarChartData {
  name: string;
  sales: number;
  conversions: number;
}

export interface AnalyticsData {
  kpiMetrics: KPIMetric[];
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryData[];
  barChartData: BarChartData[];
  dateRange: {
    start: string;
    end: string;
  }
}


import { CreditCard, ShoppingCart, TrendingUp, Users } from "lucide-react";

export const getMockAnalyticsData = (): AnalyticsData => ({
  kpiMetrics: [
    {
      label: "Total Revenue",
      value: 45600,
      unit: "€",
      change: 12.5,
      changeLabel: "vs last month",
      icon: CreditCard
    },
    {
      label: "Active Users",
      value: 3240,
      unit: "",
      change: 8.2,
      changeLabel: "vs last month",
      icon: Users
    },
    {
      label: "Orders",
      value: 1478,
      unit: "",
      change: -2.4,
      changeLabel: "vs last month",
      icon: ShoppingCart
    },
    {
      label: "Conversion Rate",
      value: 3.2,
      unit: "%",
      change: 4.1,
      changeLabel: "vs last month",
      icon: TrendingUp
    }
  ],
  timeSeriesData: Array.from({ length: 31 }, (_, i) => ({
    date: `2025-01-${String(i + 1).padStart(2, "0")}`,
    revenue: 8000 + Math.random() * 10000,
    users: 800 + Math.random() * 1200
  })),
  categoryData: [
    { name: "Electronics", value: 35, color: "#8884d8" },
    { name: "Clothing", value: 25, color: "#82ca9d" },
    { name: "Home", value: 18, color: "#ffc658" },
    { name: "Sports", value: 12, color: "#ff8042" },
    { name: "Other", value: 10, color: "#0088fe" }
  ],
  barChartData: Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString("default", { month: "short" });
    return {
      name: month,
      sales: 1000 + Math.floor(Math.random() * 9000),
      conversions: 100 + Math.floor(Math.random() * 900),
    };
  }),
  dateRange: {
    start: "2025-02-10",
    end: "2025-03-01"
  }
});