import { formatNumber } from "@/context/hooks/utils";

import { KPIMetric } from "@/components/chart/types";
import { Card, CardContent } from "@/components/ui/card";

import { ArrowDown, ArrowUp } from "lucide-react";

interface KPIMetricsProps {
  metrics: KPIMetric[];
}

export function KPIMetrics({ metrics }: KPIMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <Card key={metric.label} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{metric.label}</p>
                <h3 className="font-bold text-2xl tracking-tight">
                  {metric.unit === "€" ? `${metric.unit} ${formatNumber(metric.value)}` : `${formatNumber(metric.value)}${metric.unit}`}
                </h3>
                <div className="flex items-center mt-1">
                  <span
                    className={`inline-flex items-center text-xs font-medium ${metric.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                    {metric.change >= 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">{metric.changeLabel}</span>
                </div>
              </div>
              {metric.icon && (
                <div className={`rounded-md p-2 ${metric.change >= 0 ? "bg-emerald-100/80" : "bg-rose-100/80"}`}>
                  <metric.icon className={`h-5 w-5 ${metric.change >= 0 ? "text-emerald-600" : "text-rose-600"}`} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}