import { FilterFn, RowData, Table } from "@tanstack/react-table";

// Extend the ColumnMeta interface
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
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

const filterFunctions = {
  text: {
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

export const filterOptions = {
  text: [
    { value: "contains", label: "Contains", icon: FilterIcon, function: filterFunctions.text.contains },
    { value: "equals", label: "Equals", icon: Equal, function: filterFunctions.text.equals },
    { value: "startsWith", label: "Starts with", icon: ArrowRightIcon, function: filterFunctions.text.startsWith },
    { value: "endsWith", label: "Ends with", icon: ArrowLeftIcon, function: filterFunctions.text.endsWith },
  ],
  number: [
    { value: "equals", label: "Equal to", icon: Equal, function: filterFunctions.number.equals },
    { value: "notEquals", label: "Not equal to", icon: EqualNot, function: filterFunctions.number.notEquals },
    { value: "gt", label: "Greater than", icon: ChevronRightIcon, function: filterFunctions.number.greaterThan },
    { value: "lt", label: "Less than", icon: ChevronLeftIcon, function: filterFunctions.number.lessThan },
  ],
};