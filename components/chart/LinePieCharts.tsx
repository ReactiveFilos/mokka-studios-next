import { useState } from "react";

import { formatNumber } from "@/context/hooks/utils";

import { CategoryData, TimeSeriesData } from "@/components/chart/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Area, AreaChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";

interface LinePieChartsProps {
  timeSeriesData: TimeSeriesData[];
  categoryData: CategoryData[];
}

type ActiveTimeMetric = "revenue" | "users";

export function LinePieCharts({ timeSeriesData, categoryData }: LinePieChartsProps) {
  const [activeTimeMetric, setActiveTimeMetric] = useState<ActiveTimeMetric>("revenue");

  // Format date for x-axis
  const formattedTimeData = timeSeriesData.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", { day: "numeric", month: "short" }),
  }));

  // Custom tooltip for area chart
  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border rounded-md shadow-sm p-3">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name === "revenue" ? "Revenue: €" : "Users: "}
              {formatNumber(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const formattedValue = formatNumber(data.value);
      return (
        <div className="bg-background border border-border rounded-md shadow-sm p-3">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">
            Value: {formattedValue} ({Math.round(data.value * 100 / categoryData.reduce((sum, item) => sum + item.value, 0))}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-md font-medium">Performance Overview</CardTitle>
          <Tabs defaultValue="revenue" value={activeTimeMetric} onValueChange={(v: string) => setActiveTimeMetric(v as ActiveTimeMetric)}>
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedTimeData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <defs>
                  {activeTimeMetric === "revenue" ? (
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                    </linearGradient>
                  ) : (
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.1} />
                    </linearGradient>
                  )}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: "#888" }}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  tick={{ fontSize: 12, fill: "#888" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {activeTimeMetric === "revenue" ? (
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    activeDot={{ r: 6 }}
                  />
                ) : (
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    activeDot={{ r: 6 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium">Category Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 flex items-center justify-center">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <Legend layout="vertical" align="right" verticalAlign="middle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}