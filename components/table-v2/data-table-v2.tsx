import { useMemo, useState } from "react";

import { TableProps } from "./types";

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
import { Label } from "@/components/ui/label";
import { Table } from "@/components/ui/table";

import DataTableHeaders from "./data-table-headers";
import { DataTablePagination } from "./data-table-pagination";
import DataTableRows from "./data-table-rows";
import {
  ColumnDef,
  ColumnFiltersState,
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
  CircleAlertIcon,
  Columns3Icon,
  EditIcon,
  EllipsisIcon,
  Filter as FilterIcon,
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

export interface DataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  onRowDelete?: (rows: TData[]) => void;
  onAddItem?: () => void;
  showAddButton?: boolean;
}

export function DataTableV2<TData>({
  data,
  columns: userColumns,
  onRowDelete,
  onAddItem,
  showAddButton = true,
}: DataTableProps<TData>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(
    userColumns.map((column) => column.id)
  );

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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

  // Table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onSortingChange: setSorting,

    getPaginationRowModel: getPaginationRowModel(),

    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      columnOrder,
      rowSelection,
      pagination,
    },
    enableRowSelection: true,
    enableMultiRowSelection: true,
    onColumnOrderChange: setColumnOrder,
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
          <EnumColumnFilter table={table} columnId="status" />
          <ToggleColumnVisibility table={table} />
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
              <AlertDialogContent className="max-w-[26rem]">
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
          <DataTableHeaders table={table} columns={columns} columnOrder={columnOrder} />
          <DataTableRows table={table} columns={columns} />
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

// Enum column filter component
function EnumColumnFilter<TData>({ table, columnId }: TableProps<TData> & { columnId: string }) {
  const id = `enum-column-filter-${columnId.charAt(0).toUpperCase() + columnId.slice(1)}`;

  // Get unique values
  const uniqueValues = useMemo(() => {
    const valuesColumn = table.getColumn(columnId);
    if (!valuesColumn) return [];

    const values = Array.from(valuesColumn.getFacetedUniqueValues().keys());

    return values.sort();
  }, [table.getColumn(columnId)?.getFacetedUniqueValues()]);

  // Get counts for each value
  const valueCounts = useMemo(() => {
    const valuesColumn = table.getColumn(columnId);
    if (!valuesColumn) return new Map();
    return valuesColumn.getFacetedUniqueValues();
  }, [table.getColumn(columnId)?.getFacetedUniqueValues()]);

  const selectedValues = useMemo(() => {
    const filterValue = table.getColumn(columnId)?.getFilterValue() as string[];
    return filterValue ?? [];
  }, [table.getColumn(columnId)?.getFilterValue()]);

  const handleValueChange = (checked: boolean, value: string) => {
    const filterValue = table.getColumn(columnId)?.getFilterValue() as string[];
    const newFilterValue = filterValue ? [...filterValue] : [];

    if (checked) {
      newFilterValue.push(value);
    } else {
      const index = newFilterValue.indexOf(value);
      if (index > -1) {
        newFilterValue.splice(index, 1);
      }
    }

    table.getColumn(columnId)?.setFilterValue(newFilterValue.length ? newFilterValue : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <FilterIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
          {columnId.charAt(0).toUpperCase() + columnId.slice(1)}
          {selectedValues.length > 0 && (
            <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              {selectedValues.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <div className="space-y-4 py-1.5 px-2">
          {uniqueValues.map((value, i) => (
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
                  {valueCounts.get(value)}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ToggleColumnVisibility<TData>({ table }: TableProps<TData>) {
  return (
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