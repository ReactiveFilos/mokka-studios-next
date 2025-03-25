import { useEffect, useId, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsUpDown,
  ChevronUpIcon,
  CircleAlertIcon,
  Columns3Icon,
  EditIcon,
  EllipsisIcon,
  Equal,
  EqualNot,
  Filter as FilterIcon,
  MoveLeftIcon,
  MoveRightIcon,
  PlusIcon,
  TrashIcon,
} from "lucide-react";

// Extend the ColumnMeta interface
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
    type?: "text" | "number" | "enum" | string;
    // Add any other custom metadata properties you're using
  }
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

// Define types for your filter functions
type FilterFn<TData, TValue> = (
  row: Row<TData>,
  id: string,
  filterValue: any
) => boolean;

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
  enum: (row: Row<any>, id: string, filterValue: unknown[] | null) => {
    if (!filterValue?.length) return true;
    const value = row.getValue(id);
    return filterValue.includes(value);
  },
};

// Data type for a table column's filter state
interface ColumnFilterState {
  id: string;
  value: any;
  operator: string;
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  onRowDelete?: (rows: TData[]) => void;
  onAddItem?: () => void;
  showAddButton?: boolean;
  searchPlaceholder?: string;
  searchColumnId?: string;
}

export function DataTableV2<TData>({
  data,
  columns: userColumns,
  onRowDelete,
  onAddItem,
  showAddButton = true,
}: DataTableProps<TData>) {
  const id = useId();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFiltersState, setColumnFiltersState] = useState<ColumnFilterState[]>([]);

  // Prepare columns with selection checkbox
  const columns = useMemo(() => {
    return [
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => <RowActions row={row} />,
        size: 30,
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected()
                ? true
                : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        size: 26,
        enableSorting: false,
        enableHiding: false,
      },
      ...userColumns,
    ];
  }, [userColumns]);

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
    if (column.meta?.type === "enum") return "equals";
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
      if (type === "enum") {
        filterFn = filterFunctions.enum;
      } else if (type === "number") {
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

    setColumnFilters(filters);
  }, [columnFiltersState, columns]);

  // Get faceted unique values for enum columns (like status)
  const getEnumColumnValues = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return [];

    const values = Array.from(column.getFacetedUniqueValues().keys());
    return values.sort();
  };

  // Get counts for each value in an enum column
  const getEnumColumnCounts = (columnId: string) => {
    const column = table.getColumn(columnId);
    if (!column) return new Map();
    return column.getFacetedUniqueValues();
  };

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  // Handle row deletion
  const handleDeleteRows = () => {
    const selectedRowIds = Object.keys(rowSelection);
    const selectedRows = selectedRowIds.map(
      id => table.getRow(id).original
    );

    if (typeof onRowDelete === "function") {
      onRowDelete(selectedRows);
    }

    table.resetRowSelection();
  };

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter - show for any enum column */}
          {table.getColumn("status") && (
            <EnumColumnFilter
              id={id}
              column={table.getColumn("status")}
              title="Status"
            />
          )}

          {/* Toggle columns visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Columns3Icon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      onSelect={(event) => event.preventDefault()}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {/* Delete button (shows only when rows are selected) */}
          {Object.keys(rowSelection).length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="ml-auto" variant="outline">
                  <TrashIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
                  Delete
                  <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                    {Object.keys(rowSelection).length}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
                  <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                    aria-hidden="true">
                    <CircleAlertIcon className="opacity-80" size={16} />
                  </div>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {Object.keys(rowSelection).length} selected{" "}
                      {Object.keys(rowSelection).length === 1 ? "row" : "rows"}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteRows}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Add item button */}
          {showAddButton && (
            <Button className="ml-auto" variant="outline" onClick={onAddItem}>
              <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
              Add item
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent *:border-border [&>:not(:last-child)]:border-r">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="py-2">
                      {header.isPlaceholder ? null : (
                        <div className="space-y-2">
                          {/* Column Header with Sort */}
                          <div className="flex items-center justify-between">
                            {header.column.getCanSort() ? (
                              <div
                                className={cn(
                                  "flex h-full cursor-pointer items-center gap-2 select-none",
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    header.column.getToggleSortingHandler()?.(e);
                                  }
                                }}
                                tabIndex={0}>
                                <span className="font-medium">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </span>
                                {{
                                  asc: (
                                    <ChevronUpIcon
                                      className="shrink-0 opacity-60"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                  ),
                                  desc: (
                                    <ChevronDownIcon
                                      className="shrink-0 opacity-60"
                                      size={16}
                                      aria-hidden="true"
                                    />
                                  ),
                                }[header.column.getIsSorted() as string] ?? null}
                              </div>
                            ) : (
                              <div className="font-medium">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                              </div>
                            )}

                            {/* Column Actions Menu */}
                            {header.column.getCanSort() && (
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
                                  <DropdownMenuItem>
                                    <MoveLeftIcon className="mr-2 h-4 w-4" />
                                    Move left
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <MoveRightIcon className="mr-2 h-4 w-4" />
                                    Move right
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>

                          {/* Column Filter */}
                          {header.column.getCanFilter() && (
                            <div className="flex items-center">
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
                                    className="h-8 w-8">
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
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

// Enum column filter component
function EnumColumnFilter<TData>({
  id,
  column,
  title
}: {
  id: string;
  column: any;
  title: string;
}) {
  const values = Array.from(column.getFacetedUniqueValues().keys());
  const counts = column.getFacetedUniqueValues();

  const selectedValues = (column.getFilterValue() as string[]) || [];

  const handleValueChange = (checked: boolean, value: string) => {
    const filterValue = column.getFilterValue() as string[] || [];
    const newFilterValue = [...filterValue];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    column.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
          {title}
          {selectedValues.length > 0 && (
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-36 p-3" align="start">
        <div className="space-y-3">
          <div className="text-muted-foreground text-xs font-medium">Filters</div>
          <div className="space-y-3">
            {values.map((value, i) => (
              <div key={value as string} className="flex items-center gap-2">
                <Checkbox
                  id={`${id}-${i}`}
                  checked={selectedValues.includes(value as string)}
                  onCheckedChange={(checked: boolean) => handleValueChange(!!checked, value as string)}
                />
                <Label
                  htmlFor={`${id}-${i}`}
                  className="flex grow justify-between gap-2 font-normal">
                  {value as string}{" "}
                  <span className="text-muted-foreground ms-2 text-xs">
                    {counts.get(value)}
                  </span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Row actions component with dropdown
function RowActions<TData>({ row }: { row: Row<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <EllipsisIcon size={16} />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <EditIcon className="mr-2 h-4 w-4" />
            <span>Edit</span>
            <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className="text-destructive focus:text-destructive">
            <TrashIcon className="mr-2 h-4 w-4" />
            <span>Delete</span>
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}