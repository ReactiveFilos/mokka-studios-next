import { FilterFn, RowData, Table } from "@tanstack/react-table";

// Extend the ColumnMeta interface
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    type: metaType;
  }
}

export type metaType = "text" | "number" | "enum" | "date";

/**
 * Table prop
 * @template TData
 * @param {Table<TData>} table - Table instance
 * @returns {TableProps<TData>}
 * 
 * - DataTablePagination, ToggleColumnVisibility
 */
export interface TableProps<TData> {
  table: Table<TData>
}

export const enumFilterFn: FilterFn<any> = (row, columnId, filterValue: string[]) => {
  if (!filterValue?.length) return true;
  const value = row.getValue(columnId) as string;
  return filterValue.includes(value);
};

type FilterFunction = (cellValue: any, filterValue: any) => boolean;

export interface FilterOption {
  label: string;
  value: string;
  icon: React.ComponentType<any>;
  function: FilterFunction;
}

// Handles structured filter values with operators
export const enhancedFilterFn: FilterFn<any> = (row, columnId, filterValue) => {
  if (!filterValue) return true;

  const { operator, value } = filterValue;
  if (value === undefined || value === null || value === "") return true;

  const cellValue = row.getValue(columnId);

  // Get column type from column def meta
  const columnDef = row.getAllCells().find(cell => cell.column.id === columnId)?.column.columnDef;
  if (!columnDef?.meta) return true;

  const type = columnDef.meta.type || "text";
  const filterOption = filterOptions[type]?.find(option => option.value === operator);
  if (!filterOption) return true;

  return filterOption.function(cellValue, value);
};

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowRightLeft,
  ChevronLeftIcon,
  ChevronRightIcon,
  Equal,
  EqualNot,
  Filter as FilterIcon,
} from "lucide-react";

export const filterOptions: Record<metaType, FilterOption[]> = {
  text: [
    {
      value: "contains",
      label: "Contains",
      icon: FilterIcon,
      function: (value: string, filterValue: string) =>
        value ? String(value).toLowerCase().includes(String(filterValue).toLowerCase()) : false
    },
    {
      value: "equals",
      label: "Equals",
      icon: Equal,
      function: (value: string, filterValue: string) =>
        value ? String(value).toLowerCase() === String(filterValue).toLowerCase() : false
    },
    {
      value: "startsWith",
      label: "Starts with",
      icon: ArrowRightIcon,
      function: (value: string, filterValue: string) =>
        value ? String(value).toLowerCase().startsWith(String(filterValue).toLowerCase()) : false
    },
    {
      value: "endsWith",
      label: "Ends with",
      icon: ArrowLeftIcon,
      function: (value: string, filterValue: string) =>
        value ? String(value).toLowerCase().endsWith(String(filterValue).toLowerCase()) : false
    },
  ],
  number: [
    {
      value: "equals",
      label: "Equal to",
      icon: Equal,
      function: (value: number, filterValue: number) =>
        value === filterValue
    },
    {
      value: "notEquals",
      label: "Not equal to",
      icon: EqualNot,
      function: (value: number, filterValue: number) =>
        value !== filterValue
    },
    {
      value: "gt",
      label: "Greater than",
      icon: ChevronRightIcon,
      function: (value: number, filterValue: number) =>
        value > filterValue
    },
    {
      value: "lt",
      label: "Less than",
      icon: ChevronLeftIcon,
      function: (value: number, filterValue: number) =>
        value < filterValue
    },
    {
      value: "between",
      label: "Between",
      icon: ArrowRightLeft,
      function: (value: number, filterValue: [number, number]) =>
        value >= filterValue[0] && value <= filterValue[1]
    },
  ],
  enum: [
    {
      value: "equals",
      label: "Equals",
      icon: Equal,
      function: (value: string, filterValue: string[]) =>
        filterValue.includes(value)
    },
  ],
  date: [
    /* {
      value: "equals",
      label: "Equals",
      icon: Equal,
      function: (value: string, filterValue: string) =>
        new Date(value).setHours(0, 0, 0, 0) === new Date(filterValue).setHours(0, 0, 0, 0)
    },
    {
      value: "notEquals",
      label: "Not equal to",
      icon: EqualNot,
      function: (value: string, filterValue: string) =>
        new Date(value).setHours(0, 0, 0, 0) !== new Date(filterValue).setHours(0, 0, 0, 0)
    },
    {
      value: "gt",
      label: "After",
      icon: ChevronRightIcon,
      function: (value: string, filterValue: string) =>
        new Date(value) > new Date(filterValue)
    },
    {
      value: "lt",
      label: "Before",
      icon: ChevronLeftIcon,
      function: (value: string, filterValue: string) =>
        new Date(value) < new Date(filterValue)
    },
    {
      value: "between",
      label: "Between",
      icon: Scan,
      function: (value: string, filterValue: [string, string]) => {
        const date = new Date(value);
        return date >= new Date(filterValue[0]) && date <= new Date(filterValue[1]);
      }
    }, */
  ],
};