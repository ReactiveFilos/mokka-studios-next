import { useEffect, useState } from "react";

import { TableProps } from "./types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ColumnDef, flexRender, Row } from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon, ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDown, ChevronUpIcon, Equal,
  EqualNot,
  Filter as FilterIcon, MoveLeftIcon, MoveRightIcon
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

export default function DataTableHeaders<TData>(
  { table, columns, columnOrder }: TableProps<TData> & { columns: ColumnDef<TData>[], columnOrder: string[] }) {
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
    const column = columns.find(col => col.id === columnId);
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
      const column = columns.find(col => col.id === filter.id);
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
  }, [columnFiltersState, columns]);

  // Implement the move column functions
  const moveColumn = (columnId: string, direction: "left" | "right") => {
    const currentIndex = columnOrder.indexOf(columnId);
    const newIndex = direction === "left"
      ? Math.max(currentIndex - 1, 2) // Don't move left of select column
      : Math.min(currentIndex + 1, columnOrder.length - 1);

    // No change if already at edge
    if (currentIndex === newIndex) return;

    // Create a new order with the column moved
    const newOrder = [...columnOrder];
    newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, columnId);

    table.setColumnOrder(newOrder);
  };

  const reorderColumn = (
    movingColumnId: string,
    targetColumnId: string,
  ) => {
    const newColumnOrder = [...columnOrder];
    newColumnOrder.splice(
      newColumnOrder.indexOf(targetColumnId),
      0,
      newColumnOrder.splice(newColumnOrder.indexOf(movingColumnId), 1)[0],
    );
    console.log(newColumnOrder);

    table.setColumnOrder(newColumnOrder);
  };

  return (
    <TableHeader className="bg-muted/50">
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow
          key={headerGroup.id}
          className="hover:bg-transparent">

          {/* First two cells (actions and select) without borders */}
          {headerGroup.headers.slice(0, 2).map((header) => (
            <TableHead
              key={header.id}
              style={{ width: `${header.getSize()}px` }}
              className="py-2">
              {/* No border for action columns */}
              {flexRender(header.column.columnDef.header, header.getContext())}
            </TableHead>
          ))}

          {/* Rest of cells with borders between them */}
          {headerGroup.headers.slice(2).map((header) => (
            <TableHead
              key={header.id}
              style={{ width: `${header.getSize()}px` }}
              className="py-2 border-l border-r border-border">
              {header.isPlaceholder ? null : (
                <div className="space-y-2">
                  {/* Column Header */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium ml-0.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    {/* Column Actions Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6">
                          <ChevronsUpDown size={14} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {header.column.getCanSort() && (
                          <DropdownMenuGroup>
                            <DropdownMenuItem
                              onClick={() => header.column.toggleSorting(false)}>
                              <ChevronUpIcon className="mr-2 h-4 w-4" />
                              Sort ascending
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => header.column.toggleSorting(true)}>
                              <ChevronDownIcon className="mr-2 h-4 w-4" />
                              Sort descending
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </DropdownMenuGroup>
                        )}
                        <DropdownMenuItem
                          onClick={() => reorderColumn(header.column.id, "left")}
                          disabled={columnOrder.indexOf(header.column.id) <= 2}>
                          <MoveLeftIcon className="mr-2 h-4 w-4" />
                          Move left
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => reorderColumn(header.column.id, "right")}
                          disabled={columnOrder.indexOf(header.column.id) >= columnOrder.length - 1}>
                          <MoveRightIcon className="mr-2 h-4 w-4" />
                          Move right
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Column Filter */}
                  {header.column.getCanFilter() && (
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
                  )}
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}