import { DataTablePagination } from "@/components/table/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { flexRender, Table as ReactTable } from "@tanstack/react-table";

interface BasicDataTableProps<TData> {
  table: ReactTable<TData>
  isLoading: boolean
  showPagination?: boolean
  showSkeleton?: boolean
}

export function BasicDataTable<TData>({
  table,
  isLoading,
  showPagination = true,
  showSkeleton = true
}: BasicDataTableProps<TData>) {
  return (
    <div className="w-full">
      <div className="w-full rounded-md border">
        <div className="w-full overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table className="w-full">
            <TableHeader className="sticky top-0 bg-muted z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold whitespace-nowrap px-4 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading && showSkeleton ? (
                Array.from({ length: table.getState().pagination.pageSize || 10 }).map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    {table.getAllColumns().map((column, cellIndex) => (
                      <TableCell key={`loading-cell-${cellIndex}`}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 text-left">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}