import { TableProps } from "../types";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { ColumnDef, Header } from "@tanstack/react-table";
import { Filter as FilterIcon } from "lucide-react";

export default function ColumnInputFilter<TData>({
  table, columns, header
}: TableProps<TData> & { columns: ColumnDef<TData>[], header: Header<TData, unknown> }) {


  return (
    <div className="flex items-center justify-between gap-2">
      <Input
        className="h-8 text-xs"
        placeholder={"Filter..."}
        value={""}
        onChange={() => { }}
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

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}