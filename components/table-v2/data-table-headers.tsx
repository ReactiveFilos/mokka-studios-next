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

import InputColumnFilter from "./elements/input-column-filter";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import {
  ChevronDownIcon,
  ChevronsUpDown,
  ChevronUpIcon,
  MoveLeftIcon,
  MoveRightIcon,
} from "lucide-react";

export default function DataTableHeaders<TData>(
  { table, columns, columnOrder }: TableProps<TData> & { columns: ColumnDef<TData>[], columnOrder: string[] }) {

  const reorderColumn = (
    movingColumnId: string,
    direction: "left" | "right"
  ) => {
    const currentIndex = columnOrder.indexOf(movingColumnId);
    const newIndex = direction === "left"
      ? Math.max(currentIndex - 1, 2) // Don't move left of select column
      : Math.min(currentIndex + 1, columnOrder.length - 1);

    // No change if already at edge
    if (currentIndex === newIndex) return;

    // Create a new order with the column moved
    const newOrder = [...columnOrder];
    newOrder.splice(currentIndex, 1);
    newOrder.splice(newIndex, 0, movingColumnId);

    table.setColumnOrder(newOrder);
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
                  {header.column.getCanFilter() &&
                    <InputColumnFilter
                      table={table}
                      columns={columns}
                      header={header}
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