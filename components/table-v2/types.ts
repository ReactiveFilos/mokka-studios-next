import { FilterFn, Table } from "@tanstack/react-table";

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

type stringOptions = "contains" | "equals" | "startsWith" | "endsWith";
type numberOptions = "equals" | "notEquals" | "greaterThan" | "lessThan";

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