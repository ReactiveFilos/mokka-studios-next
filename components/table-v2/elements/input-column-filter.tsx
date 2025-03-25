import { useEffect, useState } from "react";

import { TableProps } from "../types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { ColumnDef, Header, Row } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Equal,
  EqualNot,
  Filter as FilterIcon,
} from "lucide-react";

// Data type for a table column's filter state
interface ColumnFilterState {
  id: string;
  value: any;
  operator: string;
}

// Column filter operators
const operatorOptions = {
  text: [
    { value: "contains", label: "Contains", icon: FilterIcon },
    { value: "equals", label: "Equals", icon: Equal },
    { value: "startsWith", label: "Starts with", icon: ArrowRightIcon },
    { value: "endsWith", label: "Ends with", icon: ArrowLeftIcon },
  ],
  number: [
    { value: "equals", label: "Equal to", icon: Equal },
    { value: "notEquals", label: "Not equal to", icon: EqualNot },
    { value: "gt", label: "Greater than", icon: ChevronRightIcon },
    { value: "lt", label: "Less than", icon: ChevronLeftIcon },
  ],
};

// Use these types in your filter definitions
const filterFunctions = {
  string: {
    contains: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = String(row.getValue(id) || "").toLowerCase();
      return value.includes(String(filterValue).toLowerCase());
    },
    equals: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = String(row.getValue(id) || "").toLowerCase();
      return value === String(filterValue).toLowerCase();
    },
    startsWith: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = String(row.getValue(id) || "").toLowerCase();
      return value.startsWith(String(filterValue).toLowerCase());
    },
    endsWith: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = String(row.getValue(id) || "").toLowerCase();
      return value.endsWith(String(filterValue).toLowerCase());
    },
  },
  number: {
    equals: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = Number(row.getValue(id));
      return value === Number(filterValue);
    },
    notEquals: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = Number(row.getValue(id));
      return value !== Number(filterValue);
    },
    gt: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = Number(row.getValue(id));
      return value > Number(filterValue);
    },
    lt: (row: Row<any>, id: string, filterValue: string | number) => {
      const value = Number(row.getValue(id));
      return value < Number(filterValue);
    },
  },
};

export default function InputColumnFilter<TData>({
  table, columns, header
}: TableProps<TData> & { columns: ColumnDef<TData>[], header: Header<TData, unknown> }) {

  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFilterState[]>([]);

  // Handle column filter changes
  const updateColumnFilter = (columnId: string, value: any, operator?: string) => {
    setColumnFiltersState((prev) => {
      const filterIndex = prev.findIndex((filter) => filter.id === columnId);

      // If clearing the filter
      if (value === undefined || value === "") {
        if (filterIndex > -1) {
          const newFilters = [...prev];
          newFilters.splice(filterIndex, 1);
          return newFilters;
        }
        return prev;
      }

      // Add or update filter
      const newFilter = {
        id: columnId,
        value,
        operator: operator || getDefaultOperator(columnId)
      };

      if (filterIndex > -1) {
        const newFilters = [...prev];
        newFilters[filterIndex] = newFilter;
        return newFilters;
      }

      return [...prev, newFilter];
    });
  };

  // Get default operator for a column by its type
  const getDefaultOperator = (columnId: string) => {
    const column = columns.find((col: ColumnDef<TData>) => col.id === columnId);
    if (!column) return "contains";

    // Determine type based on column definition or data sample
    if (column.meta?.type === "number") return "equals";
    return "contains"; // Default for text
  };

  // Apply column filters to table
  useEffect(() => {
    const filters = columnFiltersState.map(filter => {
      let filterFn;

      // Determine filter function based on column type and operator
      const column = columns.find((col: ColumnDef<TData>) => col.id === filter.id);
      if (!column) return { id: filter.id, value: filter.value };

      const type = column.meta?.type || "text";

      // Fix: Use type assertion or check for valid types
      if (type === "number") {
        // Access number filter functions
        filterFn = filterFunctions.number[filter.operator as keyof typeof filterFunctions.number] ||
          filterFunctions.number.equals;
      } else {
        // Default to string/text filters
        filterFn = filterFunctions.string[filter.operator as keyof typeof filterFunctions.string] ||
          filterFunctions.string.contains;
      }

      return {
        id: filter.id,
        value: filter.value,
        filterFn: filterFn,
      };
    });

    table.setColumnFilters(filters);
  }, [columnFiltersState, columns, table]);

  return (
    <div className="flex items-center justify-between gap-2">
      <Input
        className="h-8 text-xs"
        placeholder={"Filter..."}
        value={(columnFiltersState.find(f => f.id === header.column.id)?.value || "") as string}
        onChange={(e) => updateColumnFilter(header.column.id, e.target.value)}
      />
      {/* Filter Operator Selection */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6">
            <FilterIcon size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Filter options</DropdownMenuLabel>
          {(header.column.columnDef.meta?.type === "number"
            ? operatorOptions.number
            : operatorOptions.text
          ).map(option => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                const currentFilter = columnFiltersState.find(f => f.id === header.column.id);
                if (currentFilter) {
                  updateColumnFilter(
                    header.column.id,
                    currentFilter.value,
                    option.value
                  );
                }
              }}>
              <option.icon className="mr-2 h-4 w-4" />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}