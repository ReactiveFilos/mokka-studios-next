import { TableProps } from "./types";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

import ColumnInputFilter from "./elements/column-input-filter";
import ColumnMoveButtons from "./elements/column-move-buttons";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronsUpDown,
  ChevronUpIcon
} from "lucide-react";

export default function DataTableHeaders<TData>({
  table, columns, columnOrder
}: TableProps<TData> & { columns: ColumnDef<TData>[], columnOrder: string[] }) {

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
                        <ColumnMoveButtons
                          column={header.column}
                          columnOrder={columnOrder}
                          setColumnOrder={table.setColumnOrder}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Column Input Filter */}
                  {header.column.getCanFilter() &&
                    <ColumnInputFilter
                      table={table}
                      columns={columns}
                      column={header.column}
                    />
                  }
                </div>
              )}
            </TableHead>
          ))}
        </TableRow>
      ))}
    </TableHeader>
  );
}