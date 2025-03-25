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