import { FilterFn, Table } from "@tanstack/react-table";

// Extend the ColumnMeta interface
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    type?: metaType;
  }
}

type metaType = "text" | "number" | "enum" | string;

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

export const filterFunctions = {
  string: {
    contains: (fieldValue: string, filterValue: string) => fieldValue.includes(filterValue),
    equals: (fieldValue: string, filterValue: string) => fieldValue === filterValue,
    startsWith: (fieldValue: string, filterValue: string) => fieldValue.startsWith(filterValue),
    endsWith: (fieldValue: string, filterValue: string) => fieldValue.endsWith(filterValue),
  },
  number: {
    equals: (fieldValue: number, filterValue: number) => fieldValue === filterValue,
    notEquals: (fieldValue: number, filterValue: number) => fieldValue !== filterValue,
    greaterThan: (fieldValue: number, filterValue: number) => fieldValue > filterValue,
    lessThan: (fieldValue: number, filterValue: number) => fieldValue < filterValue,
  }
};

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Equal,
  EqualNot,
  Filter as FilterIcon,
} from "lucide-react";

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