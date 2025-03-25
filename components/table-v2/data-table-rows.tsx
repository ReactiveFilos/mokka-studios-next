import { TableProps } from "./types";

import { cn } from "@/lib/utils";

import { TableBody, TableCell, TableRow } from "@/components/ui/table";

import { ColumnDef, flexRender } from "@tanstack/react-table";

export default function DataTableRows<TData>({ table, columns }: TableProps<TData> & { columns: ColumnDef<TData>[] }) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="hover:bg-transparent">
            {row.getVisibleCells().map((cell, index) => (
              <TableCell key={cell.id} className={cn(index > 0 && "border-r")}>
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
  );
}