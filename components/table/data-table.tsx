import { useMemo, useState } from "react";

import AppDiv from "@/components/app/AppDiv";
import { BasicDataTable } from "@/components/table/basic-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { EntityType, FilterableField, FilterType } from "@/components/table/types";

import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from "@tanstack/react-table";

interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  isLoading: boolean;
  filterableFields?: FilterableField[];
  initialPageSize?: number;
  entityType: EntityType; // Use the proper type
  tableActions?: {
    onAdd?: () => void;
    addButtonLabel?: string;
  };
}

export function DataTable<TData>({
  data,
  columns,
  isLoading,
  filterableFields = [],
  initialPageSize = 20,
  entityType,
  tableActions,
}: DataTableProps<TData>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
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
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
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
      <DataTableToolbar
        filterFields={filterableFields}
        onFiltersChange={handleFiltersChange}
        entityType={entityType}
        onAdd={tableActions?.onAdd}
        addButtonLabel={tableActions?.addButtonLabel}
      />
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