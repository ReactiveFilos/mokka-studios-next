import { useEffect, useState } from "react";

import SideBarRootLayout from "@/layout/SideBarRootLayout";

import { CalendarBarChart } from "@/components/chart/CalendarBarChart";
import { KPIMetrics } from "@/components/chart/KPIMetrics";
import { LinePieCharts } from "@/components/chart/LinePieCharts";
import { AnalyticsData, getMockAnalyticsData } from "@/components/chart/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
    * TODO: Put data in mocked api and fetch it
    * For now, I just implemented a function that returns mocked data
  */
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const data = getMockAnalyticsData();
      setAnalyticsData(data);
    } catch (error) {
      // 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full max-w-full px-4 py-6">
      {isLoading || !analyticsData ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <Skeleton className="h-[350px] lg:col-span-2" />
            <Skeleton className="h-[350px]" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[400px] lg:col-span-2" />
          </div>
        </>
      ) : (
        <>
          <KPIMetrics metrics={analyticsData.kpiMetrics} />
          <LinePieCharts
            timeSeriesData={analyticsData.timeSeriesData}
            categoryData={analyticsData.categoryData}
          />
          <CalendarBarChart
            barChartData={analyticsData.barChartData}
            initialDateRange={analyticsData.dateRange}
          />
        </>
      )}
    </div>
  );
}

Analytics.getLayout = (page: React.ReactNode) => (
  <SideBarRootLayout>{page}</SideBarRootLayout>
);