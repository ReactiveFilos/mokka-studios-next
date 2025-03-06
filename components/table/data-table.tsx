import { useMemo, useState } from "react";

import AppDiv from "@/components/app/AppDiv";
import { BasicDataTable } from "@/components/table/basic-data-table";
import { DataTableToolbar } from "@/components/table/data-table-toolbar";
import { EntityType, FilterableField, FilterType, TableActions } from "@/components/table/types";

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
  entityType: EntityType;
  tableActions?: TableActions<TData>;
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
    return applyFilters(data, filters, filterableFields);
  }, [data, filters, filterableFields]);

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
        tableActions={tableActions}
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
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}

function applyFilters<TData>(data: TData[], filters: FilterType[], filterableFields: FilterableField[]): TData[] {
  if (!filters.length) return data;

  return data.filter(item => {
    return filters.every(filter => {
      const fieldValue = getNestedProperty(item, filter.field);

      // Skip if field value is undefined
      if (fieldValue === undefined) return false;

      // Get field type
      const fieldDef = filterableFields.find(f => f.value === filter.field);
      const fieldType = fieldDef?.type || "text";

      // For numeric fields
      if (fieldType === "number") {
        const numFieldValue = Number(fieldValue);
        const numFilterValue = Number(filter.value);

        // Skip if either value is not a valid number
        if (isNaN(numFieldValue) || isNaN(numFilterValue)) return false;

        switch (filter.operator) {
          case "equals":
            return numFieldValue === numFilterValue;
          case "notEquals":
            return numFieldValue !== numFilterValue;
          case "gt":
            return numFieldValue > numFilterValue;
          case "lt":
            return numFieldValue < numFilterValue;
          default:
            return false;
        }
      }

      // For text fields
      const strFieldValue = String(fieldValue).toLowerCase();
      const strFilterValue = filter.value.toLowerCase();

      switch (filter.operator) {
        case "equals":
          return strFieldValue === strFilterValue;
        case "contains":
          return strFieldValue.includes(strFilterValue);
        case "startsWith":
          return strFieldValue.startsWith(strFilterValue);
        case "endsWith":
          return strFieldValue.endsWith(strFilterValue);
        default:
          return strFieldValue.includes(strFilterValue);
      }
    });
  });
}