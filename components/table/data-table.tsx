import { useMemo, useState } from "react";

import AppDiv from "@/components/app/AppDiv";
import { BasicDataTable } from "@/components/table/basic-data-table";
import DataTableSearch, { FilterType } from "@/components/table/data-table-search";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading: boolean;
  filterableFields?: Array<{
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  initialPageSize?: number;
}

export function DataTable<TData>({
  data,
  columns,
  isLoading,
  filterableFields = [],
  initialPageSize = 20,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [filters, setFilters] = useState<FilterType[]>([]);

  // Apply filters to the data
  const filteredData = useMemo(() => {
    if (filters.length === 0) return data;

    return data.filter(item => {
      return filters.every(filter => {
        const value = String(getNestedProperty(item, filter.field) || "").toLowerCase();
        const filterValue = filter.value.toLowerCase();

        switch (filter.operator) {
          case "contains":
            return value.includes(filterValue);
          case "equals":
            return value === filterValue;
          case "startsWith":
            return value.startsWith(filterValue);
          case "endsWith":
            return value.endsWith(filterValue);
          default:
            return true;
        }
      });
    });
  }, [data, filters]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: false,
    pageCount: Math.ceil(filteredData.length / pagination.pageSize),
  });

  const handleFiltersChange = (newFilters: FilterType[]) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <AppDiv width100 flexLayout="flexColumnStartLeft" gap="1.75rem">
      {filterableFields.length > 0 && (
        <div className="w-full">
          <DataTableSearch
            filterFields={filterableFields}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      )}
      <BasicDataTable
        table={table}
        isLoading={isLoading}
        showPagination={true}
      />
    </AppDiv>
  );
}

// Helper function to access nested properties with dot notation
function getNestedProperty(obj: any, path: string): any {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
}